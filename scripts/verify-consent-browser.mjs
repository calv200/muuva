// Run against a root-hosted enabled build. Requires an existing Playwright install
// and a separately downloaded official tracker; never submits to external hosts.
// node scripts/verify-consent-browser.mjs <playwright index.mjs> <tracker.js>
import assert from "node:assert/strict";
import { readFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { tmpdir } from "node:os";
import { pagePaths } from "../src/routing/routeManifest.js";
const { chromium } = await import(pathToFileURL(path.resolve(process.argv[2])).href);
const tracker = readFileSync(process.argv[3], "utf8");
const browser = await chromium.launch({ headless: true });
const errors = [];
const folder = path.join(tmpdir(), "muuva-c332-browser"); mkdirSync(folder, { recursive: true });
const wait = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));
const locales = Object.fromEntries(["en", "de", "nl", "es"].map((l) => [l, JSON.parse(readFileSync(`src/i18n/locales/${l}.json`, "utf8"))]));
const ids = { ring: "Ns9PKZRh2j4", ball: "eZBYO-GSlVk", sliders: "hcx_IU7NLf8", band: "i9Ev0n22PYc", "full-body": "7X87YbXHo9c" };
async function setup({ host = "muuva.nl", dnt = false, storageBlocked = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const requests = { trackers: 0, videos: [], views: [], forms: [], formCounts: {}, unexpected: [] };
  await context.addInitScript(({ dnt, storageBlocked }) => {
    if (dnt) Object.defineProperty(navigator, "doNotTrack", { get: () => "1" });
    if (storageBlocked) Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } });
    window.__widgets = {};
    let id = 0;
    window.turnstile = {
      render(element, options) { const key = ++id; window.__widgets[key] = { element, options }; options.callback(`mock-token-${key}`); return key; },
      reset(key) { window.__widgets[key]?.options.callback(`mock-fresh-token-${key}`); },
      remove(key) { delete window.__widgets[key]; },
    };
  }, { dnt, storageBlocked });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === host) {
      if (url.pathname.startsWith("/api/")) {
        requests.forms.push(JSON.parse(route.request().postData()));
        const language = requests.forms.at(-1).language;
        const key = `${url.pathname}/${language}`;
        const count = requests.formCounts[key] = (requests.formCounts[key] ?? 0) + 1;
        if (count === 1) return route.fulfill({ status: 429, headers: { "Retry-After": "1" }, contentType: "text/html", body: "Limited" });
        if (count === 2) return route.fulfill({ status: 503, contentType: "application/json", body: '{"code":"unavailable"}' });
        return route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ code: url.pathname.endsWith("newsletter") ? "request_received" : "enquiry_received" }) });
      }
      const response = await context.request.get(`http://127.0.0.1:4175${url.pathname}${url.search}`);
      return route.fulfill({ response });
    }
    if (url.href === "https://cloud.umami.is/script.js") { requests.trackers++; return route.fulfill({ contentType: "application/javascript", body: tracker }); }
    if (["cloud.umami.is", "gateway.umami.is"].includes(url.hostname) && route.request().method() === "POST") {
      requests.views.push(JSON.parse(route.request().postData()));
      return route.fulfill({ contentType: "application/json", body: "{}" });
    }
    if (url.hostname === "www.youtube-nocookie.com") { requests.videos.push(url.href); return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Intercepted player</title>" }); }
    if (["www.youtube.com", "youtu.be"].includes(url.hostname)) return route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Intercepted external video</title>" });
    requests.unexpected.push(url.origin); return route.abort();
  });
  context.on("page", (page) => {
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (/hydration|hydrating|did not match|Minified React error/i.test(m.text())) errors.push(m.text()); });
  });
  const page = await context.newPage();
  return { context, page, requests, origin: `https://${host}` };
}
async function open(s, route) {
  await s.page.goto(s.origin + route);
  await s.page.locator("footer button").filter({ hasText: locales[route.split("/")[1]]?.consent.settings ?? "Privacy settings" }).waitFor();
  await wait();
}
const panel = (page, l = "en") => page.getByRole("region", { name: locales[l].consent.title, exact: true });
async function reject(page, l = "en") { await panel(page, l).getByRole("button", { name: locales[l].consent.reject, exact: true }).click(); }
async function settings(page, l = "en") { await page.locator("footer").getByRole("button", { name: locales[l].consent.settings, exact: true }).click(); }
async function choice(page, analytics, videos, l = "en") {
  await settings(page, l);
  const box = panel(page, l);
  await box.getByRole("checkbox", { name: locales[l].consent.analytics, exact: false }).setChecked(analytics);
  await box.getByRole("checkbox", { name: locales[l].consent.externalVideos, exact: false }).setChecked(videos);
  await box.getByRole("button", { name: locales[l].consent.save, exact: true }).click();
}
async function count(s, n) {
  for (let i = 0; i < 50 && s.requests.views.length < n; i++) await wait(40);
  assert.equal(s.requests.views.length, n, JSON.stringify({ expected: n, trackers: s.requests.trackers, unexpected: s.requests.unexpected, errors }));
}
async function navigate(page, url) {
  await page.evaluate((value) => { history.pushState(null, "", value); window.dispatchEvent(new Event("muuva:navigate")); }, url);
  await wait();
}
try {
  const s = await setup(); const { page, requests } = s;
  await open(s, "/en/guided-routines/ring/?email=private%40example.com&utm_source=instagram#private");
  assert.equal(requests.trackers, 0); assert.equal(requests.videos.length, 0);
  assert.equal(await page.locator("iframe").count(), 0);
  const first = panel(page);
  for (const key of ["reject", "customize", "accept"]) {
    const button = first.getByRole("button", { name: locales.en.consent[key], exact: true });
    assert(await button.isVisible()); assert((await button.boundingBox()).height >= 44);
  }
  await first.getByRole("button", { name: "Customize", exact: true }).click();
  assert.equal(await first.locator("input:checked").count(), 0);
  await reject(page);
  const initialRaw = await page.evaluate(() => localStorage.getItem("muuva.consent"));
  const popupWait = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Watch on YouTube", exact: true }).click();
  const popup = await popupWait; await popup.waitForLoadState(); await popup.close();
  assert.equal(await page.evaluate(() => localStorage.getItem("muuva.consent")), initialRaw);
  await choice(page, true, false); await count(s, 1);
  assert.equal(requests.trackers, 1); assert.equal(requests.videos.length, 0);
  assert.deepEqual(Object.keys(requests.views[0].payload).sort(), ["website", "hostname", "url", "referrer", "title"].sort());
  assert.equal(requests.views[0].payload.url, "/en/guided-routines/ring/?utm_source=instagram");
  assert(!JSON.stringify(requests.views).includes("private"));
  const beforeVideo = await page.evaluate(() => JSON.parse(localStorage.getItem("muuva.consent")));
  await page.getByRole("button", { name: "Enable YouTube & Play", exact: true }).click();
  await page.locator("iframe").waitFor();
  assert((await page.locator("iframe").getAttribute("src")).endsWith("?autoplay=1"));
  const afterVideo = await page.evaluate(() => JSON.parse(localStorage.getItem("muuva.consent")));
  assert.equal(afterVideo.analytics, true); assert.equal(afterVideo.savedAt, beforeVideo.savedAt);
  await choice(page, false, true);
  await navigate(page, "/de/guided-routines/ball/"); await wait(); assert.equal(requests.views.length, 1);
  assert.equal(await page.locator("iframe").count(), 1);
  await choice(page, false, false, "de"); assert.equal(await page.locator("iframe").count(), 0);
  await choice(page, true, false, "de"); await count(s, 2); assert.equal(requests.trackers, 1);
  const paths = ["/en/", "/en/guided-routines/", "/nl/guided-routines/ring/", "/es/guided-routines/", "/en/guided-routines/"];
  await page.evaluate((paths) => { for (const path of paths) { history.pushState(null, "", path); window.dispatchEvent(new Event("muuva:navigate")); } }, paths);
  await count(s, 7);
  assert.deepEqual(requests.views.slice(2).map((v) => v.payload.url), paths);
  for (let i = 0; i < 3; i++) { await page.goBack(); await wait(); }
  await count(s, 10);
  for (let i = 0; i < 3; i++) { await page.goForward(); await wait(); }
  await count(s, 13);
  await page.goBack(); await wait(); await navigate(page, "/de/guided-routines/"); await count(s, 15);
  for (const suffix of ["?filter=Ring", "?filter=Ball#video", "#product"]) await navigate(page, "/de/guided-routines/" + suffix);
  await count(s, 15);
  await page.reload(); await wait(); await count(s, 16); assert.equal(requests.trackers, 2);
  assert.equal(await panel(page, "de").count(), 0);
  const other = await s.context.newPage(); await other.goto(s.origin + "/en/guided-routines/ring/"); await wait(); await count(s, 17);
  await settings(other); await reject(other);
  await page.waitForFunction(() => window.muuvaConsent?.analytics === false);
  await navigate(page, "/nl/"); await wait(); await count(s, 17);
  await other.close();
  // Every direct route hydrates, with no optional services after rejection.
  for (const l of Object.keys(locales)) for (const path of pagePaths) {
    await open(s, `/${l}/${path}`);
    assert.equal(await page.locator("iframe").count(), 0);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await count(s, 17);
  // Shared language controls and original product interactions still work.
  await open(s, "/en/");
  await page.locator('header button[aria-haspopup="menu"]').click();
  await page.getByRole("menuitemradio", { name: /^Nederlands/ }).click();
  await page.waitForURL("**/nl/");
  assert.equal(await page.evaluate(() => localStorage.getItem("muuva.language")), "nl");
  await settings(page, "nl"); await panel(page, "nl").getByRole("button", { name: locales.nl.consent.close, exact: true }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem("muuva.language")), "nl");
  assert(await page.locator("video").evaluate((video) => video.autoplay && video.muted && video.loop && video.playsInline));
  assert.equal(await page.locator(".product-hotspot").count(), 5);
  assert((await page.locator(".product-purchase-cta").getAttribute("href")).startsWith("https://"));
  await page.locator(".product-image-button").click();
  await page.getByRole("dialog").waitFor(); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  // Responsive first-visit panel, policy and five original videos in every locale.
  for (const l of Object.keys(locales)) {
    await page.evaluate(() => localStorage.removeItem("muuva.consent"));
    await open(s, `/${l}/`);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await panel(page, l).isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (width === 320 || (l === "en" && width === 1440)) await page.screenshot({ path: path.join(folder, `${l}-${width}-banner.png`) });
    }
    await reject(page, l);
    for (const [slug, id] of Object.entries(ids)) {
      await open(s, `/${l}/guided-routines/${slug}/`);
      const image = page.locator(`img[src*="${slug}-routine-thumbnail"]`);
      assert(await image.isVisible());
      const frame = await image.evaluate((element) => ({ w: element.parentElement.clientWidth, h: element.parentElement.clientHeight }));
      assert(Math.abs(frame.w / frame.h - 16 / 9) < 0.02);
      if (l === "en" && slug === "ring") await page.screenshot({ path: path.join(folder, "en-option-a.png") });
      await page.getByRole("button", { name: locales[l].videoConsent.enable, exact: true }).click();
      const iframe = page.locator("iframe"); await iframe.waitFor();
      assert.equal(await iframe.getAttribute("src"), `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`);
      assert.equal(await page.evaluate(() => window.muuvaConsent.analytics), false);
      await choice(page, false, false, l); assert.equal(await page.locator("iframe").count(), 0);
    }
    await open(s, `/${l}/privacy/`);
    assert(await page.getByText(locales[l].privacy.draft, { exact: true }).isVisible());
    await page.setViewportSize({ width: 390, height: 900 });
    await page.screenshot({ path: path.join(folder, `${l}-policy.png`), fullPage: true });
    await open(s, `/${l}/wholesale/`);
    for (const endpoint of ["wholesale", "newsletter"]) {
      const form = page.locator(endpoint === "wholesale" ? "main form" : "footer form");
      const submit = form.locator('button[type="submit"]');
      const prior = requests.forms.length;
      await submit.click(); assert.equal(requests.forms.length, prior, "Invalid fields must not submit");
      if (endpoint === "wholesale") {
        await form.locator('[name="name"]').fill("Alex");
        await form.locator('[name="businessName"]').fill("Studio Example");
        await form.locator('[name="enquiry"]').fill("A fictional browser regression enquiry.");
      }
      await form.locator('input[type="email"]').fill("test@example.com");
      await form.locator('input[type="checkbox"]').check();
      for (let attempt = 1; attempt <= 2; attempt++) {
        await submit.click();
        await form.getByRole("alert").waitFor();
        const expected = endpoint === "wholesale" ? locales[l].wholesale.errors[attempt === 1 ? "rateLimited" : "unavailable"] : locales[l].newsletter[attempt === 1 ? "rateLimited" : "unavailable"];
        assert.equal(await form.getByRole("alert").textContent(), expected);
        assert.equal(await form.locator('input[type="email"]').inputValue(), "test@example.com");
        assert(await form.locator('input[type="checkbox"]').isChecked());
        if (attempt === 1) { assert(await submit.isDisabled()); await wait(1100); }
      }
      await submit.click();
      await page.locator(endpoint === "wholesale" ? 'main [role="status"]' : 'footer [role="status"]').waitFor();
      assert.equal(requests.forms.length, prior + 3);
      assert.equal(await page.locator(endpoint === "wholesale" ? "main h3" : 'footer [role="status"]').textContent(), endpoint === "wholesale" ? locales[l].wholesale.successTitle : locales[l].newsletter.success);
      assert.equal(requests.forms.at(-1).language, l);
    }
  }
  assert.deepEqual(requests.unexpected, []);
  await s.context.close();
  const accepted = await setup(); await open(accepted, "/en/guided-routines/ring/");
  await panel(accepted.page).getByRole("button", { name: "Accept optional", exact: true }).click();
  await count(accepted, 1); assert.equal(await accepted.page.locator("iframe").count(), 1);
  await accepted.context.close();
  for (const invalid of ["corrupt", JSON.stringify({ version: 99 }), JSON.stringify({ version: 1, notice: "2026-11-01", savedAt: 0, expiresAt: 1, analytics: true, externalVideos: true })]) {
    const x = await setup();
    await x.context.addInitScript((raw) => localStorage.setItem("muuva.consent", raw), invalid);
    await open(x, "/es/guided-routines/ball/");
    assert(await panel(x.page, "es").isVisible());
    assert.equal(x.requests.trackers, 0); assert.equal(await x.page.locator("iframe").count(), 0);
    await x.context.close();
  }
  for (const options of [{ dnt: true }, { host: "staging.muuva.pages.dev" }, { host: "localhost" }, { storageBlocked: true }]) {
    const x = await setup(options); await open(x, "/en/guided-routines/ring/");
    await panel(x.page).getByRole("button", { name: "Accept optional", exact: true }).click();
    await wait(); assert.equal(x.requests.trackers, 0); assert.equal(x.requests.views.length, 0);
    if (options.storageBlocked) { assert.equal(await x.page.locator("iframe").count(), 0); assert(await x.page.getByRole("alert").isVisible()); }
    await x.context.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS: consent independence, persistence, withdrawal, tabs, invalid/expired/disabled storage, DNT/host exclusions, intercepted official tracker navigation, all 44 routes, five videos × four languages, localized forms 429/503/success, language/gallery/hero regression, 320/390/768/1440 panel layouts, no hydration errors/overflow. No real submissions. Screenshots: " + folder);
} finally { await browser.close(); }
