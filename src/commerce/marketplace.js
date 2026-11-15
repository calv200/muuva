import { MARKETPLACES, selectMarketplace } from "./marketplaceRules.js";

export const MARKETPLACE_STORAGE_KEY = "muuva.marketplace";

export function marketplaceHref(language, override = null) {
  const env = import.meta.env || {};
  let cloudflareRoot = false;
  try {
    const host = new URL(env.VITE_PUBLIC_SITE_ORIGIN).hostname;
    cloudflareRoot = host === "muuva.nl" || host.endsWith(".muuva.pages.dev");
  } catch { /* Static builds have no Pages Function resolver. */ }
  if (!env.DEV && env.BASE_URL === "/" && cloudflareRoot) {
    const params = new URLSearchParams({ language });
    if (override) params.set("marketplace", override);
    return `/api/marketplace?${params}`;
  }
  return MARKETPLACES[selectMarketplace({ language, override })];
}
