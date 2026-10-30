const languages = ["en", "de", "nl", "es"];
const templateBindings = {
  en: "BREVO_DOI_TEMPLATE_EN",
  de: "BREVO_DOI_TEMPLATE_DE",
  nl: "BREVO_DOI_TEMPLATE_NL",
  es: "BREVO_DOI_TEMPLATE_ES",
};
const approvedTemplates = { en: 2, de: 3, nl: 4, es: 5 };
const siteverifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const brevoUrl = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";
const maxBodyBytes = 2048;

function json(status, code) {
  return new Response(JSON.stringify({ code }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

function emailIsValid(value) {
  if (typeof value !== "string" || value.length > 254 || value.length < 3 || /[\s<>(),;:"\\]/.test(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2 || !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(parts[0]) || parts[0].length > 64 || parts[0].startsWith(".") || parts[0].endsWith(".") || parts[0].includes("..")) return false;
  const labels = parts[1].split(".");
  return labels.length >= 2 && labels.every((label) => label.length > 0 && label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)) && /^[a-z]{2,}$/i.test(labels.at(-1));
}

async function boundedJson(request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return null;
  const declared = Number(request.headers.get("content-length"));
  if (declared > maxBodyBytes) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let body = "";
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) { await reader.cancel(); return null; }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

export async function requestWithTimeout(fetchImpl, url, options, timeoutMs, readJson = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { ...options, signal: controller.signal });
    return readJson ? { ok: response.ok, body: response.ok ? await response.json() : null } : response;
  }
  finally { clearTimeout(timer); }
}

function trustedOrigin(request, env) {
  try {
    const configured = new URL(env.NEWSLETTER_PUBLIC_ORIGIN);
    const actual = new URL(request.url);
    const local = configured.hostname === "localhost" && configured.protocol === "http:";
    if (!local && configured.protocol !== "https:") return null;
    if (configured.pathname !== "/" || configured.search || configured.hash || configured.username || configured.password) return null;
    if (configured.hostname !== env.NEWSLETTER_ALLOWED_HOSTNAME || configured.origin !== actual.origin) return null;
    if (request.headers.get("origin") !== configured.origin) return null;
    return configured.origin;
  } catch { return null; }
}

function configFor(env, language) {
  const listId = Number(env.BREVO_NEWSLETTER_LIST_ID);
  const templateId = Number(env[templateBindings[language]]);
  if (!env.BREVO_API_KEY || !env.TURNSTILE_SECRET || listId !== 3 || templateId !== approvedTemplates[language]) return null;
  return { listId, templateId };
}

// Kept separate from the Pages entry point so network calls can be mocked in tests.
export async function handleNewsletter({ request, env }, fetchImpl = fetch) {
  if (request.method !== "POST") return json(405, "method_not_allowed");
  if (env?.NEWSLETTER_SUBMISSIONS_ENABLED !== "true") return json(503, "unavailable");
  const origin = trustedOrigin(request, env);
  if (!origin) return json(403, "forbidden");
  const input = await boundedJson(request);
  if (!input || Object.keys(input).some((key) => !["email", "language", "consent", "turnstileToken"].includes(key))) return json(400, "invalid_request");
  if (!languages.includes(input.language)) return json(400, "invalid_language");
  if (input.consent !== true) return json(400, "consent_required");
  if (!emailIsValid(input.email)) return json(400, "invalid_email");
  if (typeof input.turnstileToken !== "string" || input.turnstileToken.length < 1 || input.turnstileToken.length > 2048) return json(400, "challenge_required");
  const config = configFor(env, input.language);
  if (!config) return json(503, "unavailable");

  let verified;
  try {
    const response = await requestWithTimeout(fetchImpl, siteverifyUrl, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: input.turnstileToken }),
    }, 6000, true);
    if (!response.ok) return json(503, "unavailable");
    verified = response.body;
  } catch { return json(503, "unavailable"); }
  if (verified?.success !== true || verified.action !== "newsletter_signup" || verified.hostname !== env.NEWSLETTER_ALLOWED_HOSTNAME) return json(400, "challenge_failed");

  try {
    const response = await requestWithTimeout(fetchImpl, brevoUrl, {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        email: input.email,
        includeListIds: [config.listId],
        redirectionUrl: `${origin}/${input.language}/newsletter-confirmed/`,
        templateId: config.templateId,
        contactPixelTrackingConsent: false,
      }),
    }, 8000);
    // A contact-state error must not reveal whether an address already exists.
    if (response.ok || response.status === 400 || response.status === 409) return json(202, "confirmation_pending");
    return json(503, "unavailable");
  } catch { return json(503, "unavailable"); }
}

export function onRequest(context) {
  return handleNewsletter(context);
}
