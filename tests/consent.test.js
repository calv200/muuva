import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { createConsentStore, consentKey, consentNotice, consentVersion, consentExpiry, parseConsent } from "../src/consent/store.js";

function browser() {
  let time = Date.UTC(2026, 10, 1);
  let raw = null;
  let blocked = false;
  const events = {};
  const timers = new Map();
  let id = 0;
  const win = {
    Event: class { constructor(type) { this.type = type; } },
    localStorage: { getItem: () => { if (blocked) throw Error(); return raw; }, setItem: (_, value) => { if (blocked) throw Error(); raw = value; }, removeItem: () => { raw = null; } },
    addEventListener: (name, callback) => { (events[name] ??= []).push(callback); },
    dispatchEvent: (event) => { events[event.type]?.forEach((callback) => callback(event)); },
    setTimeout: (callback) => { timers.set(++id, callback); return id; }, clearTimeout: (key) => timers.delete(key),
  };
  const store = createConsentStore(win, () => time);
  return { store, win, timers, get now() { return time; }, get raw() { return raw; }, set raw(value) { raw = value; }, block() { blocked = true; }, advance(value) { time = value; }, refresh: () => win.dispatchEvent({ type: "focus" }) };
}

test("consent starts blocked; individual choices persist across refresh without resetting the other category", () => {
  const b = browser(); b.store.start();
  assert.equal(b.store.getSnapshot(), null);
  assert(b.store.save({ analytics: true }));
  assert.equal(b.win.muuvaConsent.analytics, true);
  assert.equal(b.win.muuvaConsent.externalVideos, false);
  assert(b.store.save({ externalVideos: true }));
  assert(b.store.getSnapshot().analytics);
  const refreshed = createConsentStore(b.win, () => Date.UTC(2026, 10, 2)); refreshed.start();
  assert(refreshed.getSnapshot().externalVideos);
  assert(refreshed.save({ analytics: false }));
  assert.equal(refreshed.getSnapshot().analytics, false);
  assert.equal(refreshed.getSnapshot().externalVideos, true);
  assert(refreshed.save({ analytics: false, externalVideos: false }));
  assert.equal(refreshed.getSnapshot().externalVideos, false);
});

test("accept/reject, cross-tab updates, clearing storage, expiry and failed storage all fail closed", () => {
  const b = browser(); b.store.start();
  const other = createConsentStore(b.win, () => b.now); other.start();
  b.store.save({ analytics: true, externalVideos: true });
  b.win.dispatchEvent({ type: "storage", key: consentKey });
  assert(other.getSnapshot().analytics);
  other.save({ analytics: false, externalVideos: false });
  b.win.dispatchEvent({ type: "storage", key: consentKey });
  assert.equal(b.store.getSnapshot().analytics, false);
  b.store.save({ analytics: true });
  b.advance(b.store.getSnapshot().expiresAt);
  b.refresh();
  assert.equal(b.store.getSnapshot(), null);
  b.block();
  assert.equal(b.store.save({ analytics: true, externalVideos: true }), false);
  assert.equal(b.win.muuvaConsent, null);
  const c = browser(); c.store.start(); c.store.save({ externalVideos: true });
  c.raw = null; c.win.dispatchEvent({ type: "storage", key: null });
  assert.equal(c.store.getSnapshot(), null);
});

test("strict consent record validation rejects corruption, versions, future times and arbitrary values", () => {
  const savedAt = Date.UTC(2026, 10, 1);
  const valid = { version: consentVersion, notice: consentNotice, savedAt, expiresAt: consentExpiry(savedAt), analytics: true, externalVideos: false };
  assert(parseConsent(JSON.stringify(valid), savedAt));
  for (const patch of [{ version: 99 }, { notice: "old" }, { analytics: "yes" }, { externalVideos: 1 }, { id: "visitor" }, { savedAt: savedAt + 1 }, { expiresAt: savedAt + 1 }]) assert.equal(parseConsent(JSON.stringify({ ...valid, ...patch }), savedAt), null);
  for (const raw of [null, "broken", "{}", "[]"]) assert.equal(parseConsent(raw, savedAt), null);
  assert.equal(parseConsent(JSON.stringify(valid), valid.expiresAt), null);
  assert.equal(consentExpiry(Date.UTC(2026, 7, 31)), Date.UTC(2027, 1, 28));
  const b = browser(); b.store.start();
  assert.equal(b.store.save({ marketing: true }), false);
});

test("single-category changes do not renew the other permission; expiry requires a fresh affirmative choice", () => {
  const b = browser(); b.store.start(); b.store.save({ analytics: true, externalVideos: false });
  const original = b.store.getSnapshot();
  b.advance(b.now + 86400000);
  b.store.save({ externalVideos: true });
  assert.equal(b.store.getSnapshot().savedAt, original.savedAt);
  assert.equal(b.store.getSnapshot().expiresAt, original.expiresAt);
  b.advance(original.expiresAt); b.refresh();
  assert.equal(b.store.getSnapshot(), null);
  b.store.save({ externalVideos: true });
  assert.equal(b.store.getSnapshot().analytics, false);
});

test("four consent/video/policy catalogs have complete matching keys and substantive translated drafts", () => {
  const locales = ["en", "de", "nl", "es"].map((l) => JSON.parse(readFileSync(new URL(`../src/i18n/locales/${l}.json`, import.meta.url), "utf8")));
  const flatten = (value, prefix = "") => Object.entries(value).flatMap(([key, item]) => typeof item === "object" ? flatten(item, `${prefix}${key}.`) : [`${prefix}${key}`]).sort();
  for (const group of ["consent", "videoConsent", "privacy"]) {
    for (const locale of locales) {
      assert.deepEqual(flatten(locale[group]), flatten(locales[0][group]));
      assert(!JSON.stringify(locale[group]).includes("undefined"));
    }
  }
  for (const locale of locales) {
    const text = JSON.stringify(locale.privacy);
    assert(text.includes("KvK 99637588") && text.includes("contact@muuva.nl"));
    for (const word of ["HMAC", "Turnstile", "Brevo", "Microsoft 365", "GoDaddy", "muuva.consent", "muuva.language", "Frankfurt", "Purview"]) assert(text.includes(word), word);
    assert(!/\b[1-9]\d{3}\s?[A-Z]{2}\b/.test(text), "No Dutch postal address in draft copy");
    assert(locale.privacy.draft.length > 5);
  }
});

test("all localized workout SSR uses its local thumbnail and informed Option A, with no external iframe", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom", logLevel: "error" });
  try {
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    const { routines } = await server.ssrLoadModule("/src/data/guidedRoutines.js");
    for (const language of ["en", "de", "nl", "es"]) {
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      for (const routine of routines) {
        const { html } = renderPage(language, `guided-routines/${routine.slug}/`);
        assert(!html.includes("<iframe"));
        assert(html.includes(routine.thumbnail));
        assert(html.includes(routine.youtubeUrl.replaceAll("&", "&amp;")));
        assert(html.includes("noopener noreferrer"));
        for (const key of ["explanation", "external", "leaving"]) assert(html.includes(locale.videoConsent[key]));
      }
    }
  } finally { await server.close(); }
});
