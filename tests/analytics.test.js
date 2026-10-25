import assert from "node:assert/strict";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { analyticsConfig, analyticsHead, documentWithAnalytics, installAnalyticsPrivacy } from "../build/analytics.js";
import { localizedUrl, parseLocation } from "../src/routing/urls.js";
import { readFileSync } from "node:fs";
import { createInstance } from "i18next";
import { getMetadata } from "../src/seo/metadata.js";

const env = { VITE_UMAMI_ENABLED: "true", VITE_UMAMI_WEBSITE_ID: "8963af84-1a22-4cad-a8ef-413afe485468", VITE_PUBLIC_SITE_ORIGIN: "https://muuva.nl" };
const config = analyticsConfig(env, { base: "/" });

test("privacy routes retain approved titles and sanitized URLs while duplicate attempts are rejected", () => {
  for (const language of ["en", "de", "nl", "es"]) {
    const pathname = `/${language}/privacy/`;
    assert(config.paths.includes(pathname));
    const { send } = browser(`https://muuva.nl${pathname}?utm_source=instagram&email=alice@example.com#secret`);
    const payload = send({ title: "Alice private account", referrer: "https://example.com/alice?secret=1" });
    assert.equal(payload.url, `${pathname}?utm_source=instagram`);
    assert.equal(payload.referrer, "https://example.com");
    assert.equal(payload.title, config.titles[pathname]);
    assert(!JSON.stringify(payload).includes("Alice"));
    assert.equal(send(), false);
  }
});

function browser(href = "https://muuva.nl/en/", dnt) {
  const listeners = {};
  const window = { location: new URL(href), addEventListener: (name, handler) => { listeners[name] = handler; } };
  runInNewContext(`(${installAnalyticsPrivacy.toString()})(${JSON.stringify(config)})`, { window, navigator: { doNotTrack: dnt }, URL, URLSearchParams });
  const send = (payload = {}, type = "event") => window.muuvaBeforeSend(type, { url: window.location.href, ...payload });
  return { window, send, listeners };
}

test("analytics is opt-in, fail-closed on invalid configuration, and excluded from staging", () => {
  for (const value of [undefined, "false", "TRUE", "1", ""]) assert.equal(analyticsConfig({ VITE_UMAMI_ENABLED: value }), null);
  for (const id of [undefined, "", "invalid", '<script>']) assert.throws(() => analyticsConfig({ ...env, VITE_UMAMI_WEBSITE_ID: id }, { base: "/" }), /valid.*UUID/);
  assert.throws(() => analyticsConfig(env), /root hosting/);
  assert.throws(() => analyticsConfig({ ...env, VITE_PUBLIC_SITE_ORIGIN: "https://muuva.pages.dev" }, { base: "/" }), /root hosting/);
  assert.equal(analyticsConfig(env, { base: "/", staging: true }), null);
});

test("head installation is single, ordered, domain-restricted, DNT-aware and absent when disabled", () => {
  const template = "<html><head></head><body></body></html>";
  assert.equal(documentWithAnalytics(template, null), template);
  const html = documentWithAnalytics(template, config);
  assert.equal((html.match(/src="https:\/\/cloud.umami.is\/script.js"/g) || []).length, 1);
  assert(html.indexOf('id="muuva-analytics-privacy"') < html.indexOf('src="https://cloud.umami.is/script.js"'));
  for (const attribute of ['data-domains="muuva.nl"', 'data-do-not-track="true"', 'data-before-send="muuvaBeforeSend"', 'referrerpolicy="no-referrer"']) assert(html.includes(attribute));
  assert.throws(() => documentWithAnalytics(html, config), /Duplicate/);
  assert.equal(analyticsHead(null), "");
});

test("preview, localhost, GitHub Pages, www and DNT never pass the send hook", () => {
  for (const host of ["localhost", "127.0.0.1", "muuva.pages.dev", "abc.muuva.pages.dev", "calv200.github.io", "www.muuva.nl", "muuva.nl.evil.test"]) assert.equal(browser(`https://${host}/en/`).send(), false);
  for (const dnt of ["1", 1, "yes"]) assert.equal(browser(undefined, dnt).send(), false);
});

test("all 32 public paths pass without arbitrary payload properties or identifiers", () => {
  assert.equal(config.paths.length, 32);
  for (const path of config.paths) {
    const result = browser(`https://muuva.nl${path}`).send({ title: "Private name", id: "user", data: { email: "name@example.com" }, screen: "123x456", language: "en" });
    assert.deepEqual(JSON.parse(JSON.stringify(result)), { website: config.website, hostname: "muuva.nl", url: path, referrer: "", title: config.titles[path] });
  }
});

test("titles match approved localized SEO metadata for all public routes, ignoring dynamic payload values", () => {
  for (const language of ["en", "de", "nl", "es"]) {
    const translation = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
    const i18n = createInstance();
    i18n.init({ lng: language, resources: { [language]: { translation } }, initImmediate: false, interpolation: { escapeValue: false } });
    for (const pathname of config.paths.filter((path) => path.startsWith(`/${language}/`))) {
      const route = parseLocation(new URL(pathname, "https://muuva.nl"), "/");
      const expected = getMetadata(language, route, i18n.t.bind(i18n), { base: "/" }).title;
      const payload = browser(`https://muuva.nl${pathname}`).send({ title: "Alice, alice@example.com, token=secret" });
      assert.equal(payload.title, expected);
      assert(!payload.title.includes("{{"));
    }
  }
});

test("raw device, screen, language and client identity fields cannot bypass the payload allowlist", () => {
  const result = browser().send({ screen: "1920x1080", language: "private-language", device: "private-device", os: "private-os", browser: "private-browser", userAgent: "private-agent", ip: "192.0.2.1", id: "private-id", data: { name: "Alice" } });
  assert.deepEqual(Object.keys(result).sort(), ["website", "hostname", "url", "referrer", "title"].sort());
  assert(!JSON.stringify(result).includes("private"));
});

test("referrers retain at most an HTTP origin, removing credentials, personal paths, queries and fragments", () => {
  for (const [input, expected] of [
    ["https://alice:secret@example.com:8443/Alice?token=secret#alice@example.com", "https://example.com:8443"],
    ["https://muuva.nl/en/?email=alice@example.com", ""],
    ["/en/?token=secret", ""], ["javascript:alert(1)", ""], ["data:text/plain,private", ""], ["invalid", ""],
  ]) assert.equal(browser().send({ referrer: input }).referrer, expected);
});

test("only marketing query labels survive; URLs, referrers, fragments and personal/token data are sanitized", () => {
  const utm = "utm_source=instagram&utm_medium=social&utm_campaign=autumn-2026&utm_content=ring-video&utm_term=home+pilates";
  const { send } = browser(`https://muuva.nl/nl/?${utm}&email=person%40example.com&token=secret&name=Alice&filter=Ring#person`);
  const result = send({ referrer: "https://example.com/private/person?email=person@example.com#token" });
  assert.equal(result.url, `/nl/?${utm}`);
  assert.equal(result.referrer, "https://example.com");
  for (const value of ["person@example.com", "+31612345678", "123-456-7890", "a".repeat(32), "https://example.com", "8963af84-1a22-4cad-a8ef-413afe485468"]) {
    assert.equal(browser(`https://muuva.nl/en/?utm_campaign=${encodeURIComponent(value)}`).send().url, "/en/");
  }
  assert.equal(browser("https://muuva.nl/en/?utm_source=a&utm_source=b").send().url, "/en/");
});

test("custom events, identify, performance, unknown paths and compatibility URLs are rejected", () => {
  for (const path of ["/", "/en/private/person@example.com", "/en/guided-routines/person/"]) assert.equal(browser(`https://muuva.nl${path}`).send(), false);
  assert.equal(browser("https://muuva.nl/en/#/guided-routines").send(), false);
  assert.equal(browser().send({ name: "subscribe", data: { email: "a@b.com" } }), false);
  for (const type of ["identify", "performance", "unknown"]) assert.equal(browser().send({}, type), false);
});

test("initial/hydration duplicates and stale navigation callbacks are dropped; Back/Forward has one pageview", () => {
  const { window, send, listeners } = browser();
  assert(send());
  assert.equal(send(), false);
  window.location = new URL("https://muuva.nl/de/");
  assert(send());
  assert.equal(send({ url: "/en/" }), false);
  let count = 0;
  window.umami = { track: (callback) => { if (send(callback({ url: "/de/" }))) count++; } };
  window.location = new URL("https://muuva.nl/en/");
  listeners.popstate();
  listeners.popstate();
  assert.equal(count, 1);
  window.location = new URL("https://muuva.nl/de/");
  listeners["muuva:navigate"]();
  assert.equal(count, 2, "First navigation after Back covers the provider's stale internal URL");
  assert.equal(send(), false, "An automatic callback for the same navigation is deduplicated");
});

test("all five UTM parameters survive root language selection, legacy normalization and language switching", () => {
  const search = "?utm_source=instagram&utm_medium=social&utm_campaign=autumn&utm_content=ring&utm_term=pilates";
  for (const language of ["en", "de", "nl", "es"]) {
    for (const suffix of ["", "#/", "#/guided-routines/ring"]) {
      const route = parseLocation(new URL(`https://muuva.nl/${search}${suffix}`), "/");
      const localized = localizedUrl(language, route, "/");
      assert.equal(new URL(localized, "https://muuva.nl").search, search);
      assert.equal(parseLocation(new URL(localized, "https://muuva.nl"), "/").search, search);
    }
  }
});

// Model the Cloud tracker's observed contract: history changes queue a delayed
// callback which reads its latest URL, and popstate does not update that URL.
// The pageview expectations below describe visitor navigation, not timer count.
function navigationBrowser() {
  const session = browser();
  const pageviews = [];
  const pending = [];
  let trackerUrl = session.window.location.href;
  session.window.umami = {
    track(callback) {
      const defaults = { url: trackerUrl, title: "Untrusted dynamic title" };
      const payload = typeof callback === "function" ? callback(defaults) : defaults;
      const result = session.send(payload);
      if (result) pageviews.push(result.url);
    },
  };
  session.window.umami.track();
  return {
    pageviews,
    navigate(path) {
      session.window.location = new URL(path, "https://muuva.nl");
      const next = session.window.location.href;
      if (next !== trackerUrl) pending.push(() => session.window.umami.track());
      trackerUrl = next;
      session.listeners["muuva:navigate"]();
    },
    traverse(path) {
      session.window.location = new URL(path, "https://muuva.nl");
      session.listeners.popstate();
    },
    flush() { pending.splice(0).forEach((callback) => callback()); },
  };
}

test("consecutive Back and Forward actions each record one pageview", () => {
  const session = navigationBrowser();
  const paths = ["/en/", "/en/guided-routines/", "/en/guided-routines/ring/", "/de/guided-routines/ring/"];
  for (const path of paths.slice(1)) { session.navigate(path); session.flush(); }
  for (const path of paths.slice(0, -1).reverse()) session.traverse(path);
  for (const path of paths.slice(1)) session.traverse(path);
  session.flush();
  assert.deepEqual(session.pageviews, [...paths, ...paths.slice(0, -1).reverse(), ...paths.slice(1)]);
});

test("Back followed by internal navigation or a language switch records once", () => {
  for (const destination of ["/en/guided-routines/", "/de/"]) {
    const session = navigationBrowser();
    session.navigate(destination); session.flush();
    session.traverse("/en/");
    session.navigate(destination); session.flush();
    assert.deepEqual(session.pageviews, ["/en/", destination, "/en/", destination]);
  }
});

test("rapid navigation and repeat visits retain every genuine page, without late duplicates", () => {
  const session = navigationBrowser();
  const paths = ["/en/guided-routines/", "/en/guided-routines/ring/", "/en/guided-routines/", "/nl/guided-routines/"];
  for (const path of paths) session.navigate(path);
  session.flush();
  assert.deepEqual(session.pageviews, ["/en/", ...paths]);
});

test("filter, anchor and campaign-only changes do not constitute another page", () => {
  const session = navigationBrowser();
  session.navigate("/en/guided-routines/"); session.flush();
  for (const suffix of ["?filter=Ring", "?filter=Ball#video", "#video", "?utm_source=instagram"]) {
    session.navigate(`/en/guided-routines/${suffix}`); session.flush();
  }
  session.traverse("/en/guided-routines/?filter=Ring");
  session.traverse("/en/guided-routines/#video");
  assert.deepEqual(session.pageviews, ["/en/", "/en/guided-routines/"]);
});
