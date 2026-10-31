import { json } from "./forms.js";

function threshold(value, fallback) {
  if (value === undefined) return fallback;
  return typeof value === "string" && /^[1-9]\d{0,3}$/.test(value) && Number(value) <= 1000 ? Number(value) : null;
}

function clientAddress(request) {
  // Only the Cloudflare ingress header, in a Cloudflare request context. Never X-Forwarded-For.
  if (!request.cf || typeof request.cf !== "object") return null;
  const value = request.headers.get("CF-Connecting-IP");
  if (!value) return null;
  if (/^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255) ? value : null;
  }
  if (!value.includes(":") || !/^[a-f0-9:.]+$/i.test(value)) return null;
  try { return new URL(`http://[${value}]/`).hostname.toLowerCase(); } catch { return null; }
}

function diagnostic(log, endpoint, category, status) {
  try { log("forms.rate_limit", { endpoint, category, status }); } catch { /* Logging must not alter enforcement. */ }
}

// Off by default preserves the currently configured forms. Enforce always fails closed.
export async function checkFormRateLimit({ request, env, endpoint }, { log = console.warn, timeoutMs = 1500 } = {}) {
  const mode = env.FORMS_RATE_LIMIT_MODE;
  if (mode === undefined || mode === "off") return null;
  const fail = (category) => {
    diagnostic(log, endpoint, category, 503);
    return json(503, "unavailable");
  };
  if (!["newsletter", "wholesale"].includes(endpoint)) return json(503, "unavailable");
  const namespace = env.FORMS_RATE_LIMITER;
  const secret = env.FORMS_RATE_LIMIT_HASH_SECRET;
  const scope = env.FORMS_RATE_LIMIT_SCOPE;
  const shortLimit = threshold(env.FORMS_RATE_LIMIT_10M, 5);
  const hourLimit = threshold(env.FORMS_RATE_LIMIT_1H, 20);
  if (mode !== "enforce" || typeof namespace?.idFromName !== "function" || typeof namespace?.get !== "function"
    || typeof secret !== "string" || secret.length < 32 || secret.length > 256
    || typeof scope !== "string" || !/^[a-z0-9-]{1,32}$/.test(scope) || !shortLimit || !hourLimit) return fail("configuration");
  const address = clientAddress(request);
  if (!address) return fail("client_identity_unavailable");

  const controller = new AbortController();
  let timer;
  try {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`muuva.forms.v1|${scope}|${endpoint}|${address}`));
    const digest = [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    const stub = namespace.get(namespace.idFromName(`v1:${scope}:${endpoint}:${digest}`));
    const deadline = new Promise((_, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new Error("limiter_timeout")); }, timeoutMs);
    });
    const response = await Promise.race([stub.fetch("https://forms-limit.internal/reserve", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortLimit, hourLimit }), signal: controller.signal,
    }), deadline]);
    if (response.status === 204) return null;
    const retryAfter = response.headers.get("Retry-After");
    if (response.status === 429 && /^[1-9]\d{0,3}$/.test(retryAfter || "") && Number(retryAfter) <= 3600) {
      diagnostic(log, endpoint, "throttled", 429);
      return json(429, "rate_limited", { "Retry-After": retryAfter });
    }
    return fail("invalid_limiter_response");
  } catch { return fail("limiter_unavailable"); }
  finally { clearTimeout(timer); }
}
