export const consentKey = "muuva.consent";
export const consentVersion = 1;
export const consentNotice = "2026-11-01";
export const renewalMonths = 6;
export const consentEvent = "muuva:consent";

export function consentExpiry(savedAt) {
  const date = new Date(savedAt);
  // Calendar months, capped to the last day of the target month.
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + renewalMonths);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.getTime();
}

export function parseConsent(raw, now = Date.now()) {
  try {
    const value = JSON.parse(raw);
    if (!value || Object.keys(value).sort().join() !== "analytics,expiresAt,externalVideos,notice,savedAt,version"
      || value.version !== consentVersion || value.notice !== consentNotice
      || typeof value.analytics !== "boolean" || typeof value.externalVideos !== "boolean"
      || !Number.isSafeInteger(value.savedAt) || value.savedAt < 0 || value.savedAt > now
      || value.expiresAt !== consentExpiry(value.savedAt) || value.expiresAt <= now) return null;
    return Object.freeze(value);
  } catch { return null; }
}

// One store for every route. No visitor ID, cookies, server record or preload queue.
export function createConsentStore(browser, clock = Date.now) {
  let state = null;
  let timer;
  let started = false;
  const listeners = new Set();
  const publish = (next) => {
    if (JSON.stringify(state) === JSON.stringify(next)) return;
    state = next;
    browser.clearTimeout(timer);
    if (state) timer = browser.setTimeout(refresh, Math.min(state.expiresAt - clock(), 2147483647));
    // Synchronous notification closes the analytics gate before React renders.
    browser.muuvaConsent = state;
    browser.dispatchEvent(new browser.Event(consentEvent));
    listeners.forEach((listener) => listener());
  };
  function refresh() {
    let next = null;
    try { next = parseConsent(browser.localStorage.getItem(consentKey), clock()); } catch { /* Fail closed. */ }
    publish(next);
    // Long intervals exceed the browser timer maximum; continue checking.
    browser.clearTimeout(timer);
    if (state) timer = browser.setTimeout(refresh, Math.min(state.expiresAt - clock(), 2147483647));
  }
  return {
    getSnapshot: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    start() {
      if (started) return;
      started = true;
      browser.addEventListener("storage", (event) => { if (event.key === consentKey || event.key === null) refresh(); });
      for (const event of ["focus", "pageshow", "visibilitychange"]) browser.addEventListener(event, refresh);
      refresh();
    },
    save(choices) {
      refresh();
      if (!choices || Object.keys(choices).some((key) => !["analytics", "externalVideos"].includes(key))
        || Object.values(choices).some((value) => typeof value !== "boolean")) return false;
      // A video-only grant must not renew an existing Analytics permission.
      const savedAt = state && Object.keys(choices).length === 1 ? state.savedAt : clock();
      const next = { version: consentVersion, notice: consentNotice, savedAt, expiresAt: consentExpiry(savedAt),
        analytics: state?.analytics ?? false, externalVideos: state?.externalVideos ?? false, ...choices };
      try {
        const raw = JSON.stringify(next);
        browser.localStorage.setItem(consentKey, raw);
        if (browser.localStorage.getItem(consentKey) !== raw) throw new Error("storage_unavailable");
        publish(parseConsent(raw, clock()));
        return true;
      } catch {
        try { browser.localStorage.removeItem(consentKey); } catch { /* Remain blocked. */ }
        publish(null);
        return false;
      }
    },
  };
}
