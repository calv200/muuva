import { MARKETPLACES, selectMarketplace } from "../../src/commerce/marketplaceRules.js";

const languages = new Set(["en", "de", "nl", "es"]);
const responseHeaders = {
  "Cache-Control": "no-store, private",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
};

export function handleMarketplace({ request }) {
  if (request.method !== "GET") return new Response(null, { status: 405, headers: { ...responseHeaders, Allow: "GET" } });
  const url = new URL(request.url);
  const allowed = new Set(["language", "marketplace"]);
  if ([...url.searchParams.keys()].some((key) => !allowed.has(key)) || [...allowed].some((key) => url.searchParams.getAll(key).length > 1)) {
    return new Response(null, { status: 400, headers: responseHeaders });
  }
  const language = url.searchParams.get("language") || "en";
  const override = url.searchParams.get("marketplace") || null;
  if (!languages.has(language) || (override !== null && !["NL", "DE"].includes(override))) {
    return new Response(null, { status: 400, headers: responseHeaders });
  }
  const country = request.cf?.country;
  const marketplace = selectMarketplace({ language, override, country });
  return new Response(null, { status: 302, headers: { ...responseHeaders, Location: MARKETPLACES[marketplace] } });
}

export function onRequest(context) { return handleMarketplace(context); }
