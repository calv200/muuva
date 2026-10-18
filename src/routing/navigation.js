import i18n, { normalizeLanguage } from "../i18n/index.js";
import { languageFromPath, localizedUrl, parseLocation } from "./urls.js";

export const navigationEvent = "muuva:navigate";

export function synchronizeLocation() {
  const route = parseLocation(window.location);
  const language = route.language ?? normalizeLanguage(i18n.resolvedLanguage || i18n.language) ?? "en";
  const url = localizedUrl(language, route);
  const currentUrl = window.location.pathname + window.location.search + window.location.hash;

  // Replace old/root links in place so Back never loops through a redirect.
  if (url !== currentUrl) window.history.replaceState(window.history.state, "", url);
  if (i18n.resolvedLanguage !== language) void i18n.changeLanguage(language);
  return { ...route, language, legacy: false };
}

export function navigate(href) {
  const url = new URL(href, window.location.href);
  const current = window.location.pathname + window.location.search + window.location.hash;
  const next = url.pathname + url.search + url.hash;
  if (next === current) {
    if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView();
    return;
  }
  window.history.pushState(null, "", next);
  synchronizeLocation();
  window.dispatchEvent(new Event(navigationEvent));
}

// Keep real hrefs for copying, opening a new tab, and native modified clicks.
export function handleInternalLink(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest?.("a[href]");
  if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
  if (link.getAttribute("href").startsWith("#")) return;
  const url = new URL(link.href);
  if (url.origin !== window.location.origin || !languageFromPath(url.pathname)) return;
  event.preventDefault();
  navigate(url.href);
}
