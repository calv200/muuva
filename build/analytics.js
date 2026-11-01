import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";
import { readFileSync } from "node:fs";
import { createInstance } from "i18next";
import { parseLocation } from "../src/routing/urls.js";
import { getMetadata } from "../src/seo/metadata.js";

export const umamiScript = "https://cloud.umami.is/script.js";

export function analyticsConfig(env = {}, { staging = false, base = "/muuva/" } = {}) {
  if (env.VITE_UMAMI_ENABLED !== "true" || staging) return null;
  const website = env.VITE_UMAMI_WEBSITE_ID;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(website || "")) {
    throw new Error("Enabled Umami requires a valid VITE_UMAMI_WEBSITE_ID UUID");
  }
  if (base !== "/" || env.VITE_PUBLIC_SITE_ORIGIN !== "https://muuva.nl") {
    throw new Error("Enabled Umami requires root hosting and VITE_PUBLIC_SITE_ORIGIN=https://muuva.nl");
  }
  // Use the same approved catalogs and metadata resolver as pre-rendering.
  // Never trust document.title or a caller-supplied tracking title at runtime.
  const titles = {};
  for (const language of supportedLanguages) {
    const translation = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
    const i18n = createInstance();
    i18n.init({ lng: language, resources: { [language]: { translation } }, initImmediate: false, interpolation: { escapeValue: false } });
    for (const page of pagePaths) {
      // A static landing page is not proof of a confirmed subscription.
      if (page === "newsletter-confirmed/") continue;
      const pathname = `/${language}/${page}`;
      const route = parseLocation(new URL(pathname, env.VITE_PUBLIC_SITE_ORIGIN), "/");
      titles[pathname] = getMetadata(language, route, i18n.t.bind(i18n), { origin: env.VITE_PUBLIC_SITE_ORIGIN, base: "/" }).title;
    }
  }
  return { website, paths: Object.keys(titles), titles };
}

// Self-contained consent loader. The external tracker is never emitted as HTML.
// Automatic tracking is disabled: only the gated navigation adapter sends views.
export function installAnalyticsPrivacy({ website, paths, titles }) {
  const allowedPaths = new Set(paths);
  const approvedTitles = new Map(Object.entries(titles));
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  let lastPage;
  let consented = false;
  let requested = false;
  let ready = false;
  const permitted = () => window.location.hostname === "muuva.nl"
    && window.muuvaConsent?.analytics === true
    && ![window.doNotTrack, navigator.doNotTrack, navigator.msDoNotTrack].some((value) => [1, "1", "yes"].includes(value));

  function cleanUrl(value) {
    try {
      const url = new URL(value, "https://muuva.nl");
      if (url.origin !== "https://muuva.nl" || !allowedPaths.has(url.pathname)) return null;
      const search = new URLSearchParams();
      for (const key of campaignKeys) {
        const values = url.searchParams.getAll(key);
        const campaign = values[0];
        // Marketing labels only; reject duplicate values, addresses, phone-like
        // numbers, encoded payloads, long opaque tokens, and URL punctuation.
        if (values.length === 1 && /^[a-z0-9][a-z0-9 ._~-]{0,79}$/i.test(campaign)
          && !/\d{7}|[a-z0-9]{24}|(?:\d[ ._~-]*){7}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(campaign)) search.set(key, campaign);
      }
      return url.pathname + (search.size ? `?${search}` : "");
    } catch { return null; }
  }

  window.muuvaBeforeSend = (type, payload) => {
    if (!permitted() || type !== "event" || !payload || payload.name || window.location.hash.startsWith("#/")) return false;
    const url = cleanUrl(payload.url);
    // Reject initial compatibility URLs and stale automatic callbacks after rapid navigation.
    if (!url || url !== cleanUrl(window.location.href)) return false;
    const pathname = new URL(url, "https://muuva.nl").pathname;
    if (pathname === lastPage || !approvedTitles.has(pathname)) return false;
    let referrer = "";
    try {
      const source = new URL(payload.referrer);
      if (["http:", "https:"].includes(source.protocol) && source.hostname !== "muuva.nl") referrer = source.origin;
    } catch { /* Relative/internal referrers are deliberately omitted. */ }
    lastPage = pathname;
    // Construct an allowlist rather than spreading provider/custom payload data.
    // Screen and browser language stay excluded; see the device trade-offs in
    // docs/analytics-pass-a-review.md. HTTP User-Agent supplies device detection.
    return { website, hostname: "muuva.nl", url, referrer, title: approvedTitles.get(pathname) };
  };

  // Keep Back/Forward recovery and immediate completed-router navigation.
  // No events from before consent/load are retained or replayed.
  const trackCurrentPage = () => {
    if (!permitted() || !ready) return;
    if (!allowedPaths.has(window.location.pathname)) { lastPage = undefined; return; }
    window.umami?.track((payload) => ({ ...payload, url: window.location.href, referrer: lastPage ? "" : document.referrer }));
  };
  const updateConsent = () => {
    const next = permitted();
    if (next === consented) return;
    consented = next;
    lastPage = undefined;
    if (!next) return; // Hook also blocks already-loaded or delayed callbacks.
    if (ready) { trackCurrentPage(); return; }
    if (requested) return; // Never reload a failed, pending or withdrawn tracker.
    requested = true;
    const script = document.createElement("script");
    script.id = "muuva-umami";
    script.src = "https://cloud.umami.is/script.js";
    script.defer = true;
    for (const [name, value] of Object.entries({ "website-id": website, domains: "muuva.nl", "do-not-track": "true", "exclude-hash": "true", "before-send": "muuvaBeforeSend", "auto-track": "false" })) script.setAttribute(`data-${name}`, value);
    script.referrerPolicy = "no-referrer";
    script.onload = () => { ready = true; trackCurrentPage(); };
    document.head.append(script);
  };
  window.addEventListener("muuva:consent", updateConsent);
  window.addEventListener("popstate", trackCurrentPage);
  window.addEventListener("muuva:navigate", trackCurrentPage);
  updateConsent();
}

export function analyticsHead(config) {
  if (!config) return "";
  const settings = JSON.stringify(config).replaceAll("<", "\\u003c");
  return `<script id="muuva-analytics-privacy">(${installAnalyticsPrivacy.toString()})(${settings});</script>\n`;
}

export function documentWithAnalytics(template, config) {
  if (!config) return template;
  if (template.includes("muuva-analytics-privacy") || template.includes(umamiScript)) throw new Error("Duplicate Umami integration");
  return template.replace("</head>", () => `${analyticsHead(config)}</head>`);
}
