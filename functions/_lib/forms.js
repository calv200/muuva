export function json(status, code) {
  return new Response(JSON.stringify({ code }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export function trustedOrigin(request, configuredOrigin, allowedHostname) {
  try {
    const configured = new URL(configuredOrigin);
    const local = configured.hostname === "localhost" && configured.protocol === "http:";
    if (!local && configured.protocol !== "https:") return null;
    if (configured.pathname !== "/" || configured.search || configured.hash || configured.username || configured.password) return null;
    if (configured.hostname !== allowedHostname || configured.origin !== new URL(request.url).origin) return null;
    return request.headers.get("origin") === configured.origin ? configured.origin : null;
  } catch { return null; }
}

export async function boundedJson(request, maxBytes) {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return null;
  if (Number(request.headers.get("content-length")) > maxBytes) return null;
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
      if (size > maxBytes) { await reader.cancel(); return null; }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

export async function fetchWithTimeout(fetchImpl, url, options, timeoutMs, readJson = false) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { ...options, signal: controller.signal });
    return readJson ? { ok: response.ok, body: response.ok ? await response.json() : null } : response;
  } finally { clearTimeout(timer); }
}
