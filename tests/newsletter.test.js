import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { handleNewsletter, requestWithTimeout } from "../functions/api/newsletter.js";
import { localizedUrl, parseLocation } from "../src/routing/urls.js";
import { supportedLanguages } from "../src/routing/routeManifest.js";
import { escapeMarkup } from "../build/html.js";

const origin = "https://staging.muuva.pages.dev";
const env = {
  NEWSLETTER_SUBMISSIONS_ENABLED: "true",
  NEWSLETTER_PUBLIC_ORIGIN: origin,
  NEWSLETTER_ALLOWED_HOSTNAME: "staging.muuva.pages.dev",
  BREVO_API_KEY: "private-brevo-key",
  TURNSTILE_SECRET: "private-turnstile-secret",
  BREVO_NEWSLETTER_LIST_ID: "3",
  BREVO_DOI_TEMPLATE_EN: "2",
  BREVO_DOI_TEMPLATE_DE: "3",
  BREVO_DOI_TEMPLATE_NL: "4",
  BREVO_DOI_TEMPLATE_ES: "5",
};

function request(body = {}, { requestOrigin = origin, url = `${origin}/api/newsletter`, method = "POST" } = {}) {
  return new Request(url, {
    method,
    headers: { Origin: requestOrigin, "Content-Type": "application/json" },
    ...method === "POST" ? { body: JSON.stringify({ email: "person@example.com", language: "en", consent: true, turnstileToken: "valid-token", ...body }) } : {},
  });
}

function services({ challenge = { success: true, action: "newsletter_signup", hostname: "staging.muuva.pages.dev" }, brevoStatus = 201, failAt = "" } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (failAt && url.includes(failAt)) throw new Error("private upstream error with person@example.com");
    if (url.includes("siteverify")) return new Response(JSON.stringify(challenge), { status: 200 });
    return new Response("private upstream body with person@example.com", { status: brevoStatus });
  };
  return { calls, fetchImpl };
}

test("the four languages select fixed DOI templates, list and same-origin confirmation routes", async () => {
  for (const [language, templateId] of [["en", 2], ["de", 3], ["nl", 4], ["es", 5]]) {
    const mock = services();
    const response = await handleNewsletter({ request: request({ language }), env }, mock.fetchImpl);
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { code: "confirmation_pending" });
    assert.equal(mock.calls.length, 2);
    assert.equal(new URLSearchParams(mock.calls[0].options.body).get("secret"), env.TURNSTILE_SECRET);
    const brevo = JSON.parse(mock.calls[1].options.body);
    assert.equal(mock.calls[1].url, "https://api.brevo.com/v3/contacts/doubleOptinConfirmation");
    assert.equal(mock.calls[1].options.headers["api-key"], env.BREVO_API_KEY);
    assert.deepEqual(brevo, { email: "person@example.com", includeListIds: [3], redirectionUrl: `${origin}/${language}/newsletter-confirmed/`, templateId, contactPixelTrackingConsent: false });
  }
});

test("disabled, cross-origin, malformed, nonconsenting and unsupported requests never call an upstream service", async () => {
  const cases = [
    [request(), { ...env, NEWSLETTER_SUBMISSIONS_ENABLED: "false" }, 503],
    [request({}, { requestOrigin: "https://evil.example" }), env, 403],
    [request({}, { url: "https://other.pages.dev/api/newsletter" }), env, 403],
    [request({ language: "fr" }), env, 400],
    [request({ consent: false }), env, 400],
    [request({ email: "not-an-email" }), env, 400],
    [request({ email: "person@example.com", listId: 999 }), env, 400],
    [request({ turnstileToken: "" }), env, 400],
    [request({}, { method: "GET" }), env, 405],
  ];
  for (const [incoming, bindings, status] of cases) {
    const mock = services();
    const response = await handleNewsletter({ request: incoming, env: bindings }, mock.fetchImpl);
    assert.equal(response.status, status);
    assert.equal(mock.calls.length, 0);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
});

test("oversized and non-JSON bodies fail before Turnstile", async () => {
  const invalid = [
    new Request(`${origin}/api/newsletter`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "x".repeat(2049) }),
    new Request(`${origin}/api/newsletter`, { method: "POST", headers: { Origin: origin, "Content-Type": "text/plain" }, body: "hello" }),
    new Request(`${origin}/api/newsletter`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{" }),
  ];
  for (const incoming of invalid) {
    const mock = services();
    assert.equal((await handleNewsletter({ request: incoming, env }, mock.fetchImpl)).status, 400);
    assert.equal(mock.calls.length, 0);
  }
});

test("Turnstile action, hostname, token failure and replay prevent Brevo calls", async () => {
  for (const challenge of [
    { success: false, "error-codes": ["timeout-or-duplicate"] },
    { success: false, "error-codes": ["invalid-input-response"] },
    { success: true, action: "other", hostname: env.NEWSLETTER_ALLOWED_HOSTNAME },
    { success: true, action: "newsletter_signup", hostname: "evil.example" },
  ]) {
    const mock = services({ challenge });
    const response = await handleNewsletter({ request: request(), env }, mock.fetchImpl);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { code: "challenge_failed" });
    assert.equal(mock.calls.length, 1);
  }
});

test("missing credentials, upstream failures and timeouts return safe errors without secrets", async () => {
  for (const bindings of [{ ...env, BREVO_API_KEY: "" }, { ...env, TURNSTILE_SECRET: "" }, { ...env, BREVO_DOI_TEMPLATE_NL: "" }, { ...env, BREVO_NEWSLETTER_LIST_ID: "99" }, { ...env, BREVO_DOI_TEMPLATE_NL: "99" }]) {
    const mock = services();
    const response = await handleNewsletter({ request: request({ language: "nl" }), env: bindings }, mock.fetchImpl);
    assert.equal(response.status, 503);
    assert.equal(mock.calls.length, 0);
  }
  for (const settings of [{ brevoStatus: 401 }, { brevoStatus: 429 }, { failAt: "siteverify" }, { failAt: "doubleOptinConfirmation" }]) {
    const mock = services(settings);
    const response = await handleNewsletter({ request: request(), env }, mock.fetchImpl);
    assert.equal(response.status, 503);
    const body = await response.text();
    assert(!body.includes("person@example.com") && !body.includes(env.BREVO_API_KEY) && !body.includes(env.TURNSTILE_SECRET));
  }
  assert(!readFileSync(new URL("../functions/api/newsletter.js", import.meta.url), "utf8").includes("console."));
});

test("possible duplicate-contact errors do not reveal subscriber state", async () => {
  for (const brevoStatus of [201, 400, 409]) {
    const mock = services({ brevoStatus });
    const response = await handleNewsletter({ request: request(), env }, mock.fetchImpl);
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { code: "confirmation_pending" });
  }
});

test("upstream timeout aborts a stalled request", async () => {
  await assert.rejects(requestWithTimeout((_, options) => new Promise((_, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
  }), "https://example.invalid", {}, 10), { name: "AbortError" });
  await assert.rejects(requestWithTimeout(async (_, options) => ({
    ok: true,
    json: () => new Promise((_, reject) => options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))),
  }), "https://example.invalid", {}, 10, true), { name: "AbortError" });
});

test("confirmation routes have localized server content and preserve language, SEO and footer access", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
  try {
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    for (const language of supportedLanguages) {
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      const { html, metadata } = renderPage(language, "newsletter-confirmed/");
      const main = html.match(/<main>[\s\S]*?<\/main>/)[0];
      for (const key of ["title", "description", "cta"]) assert(main.includes(escapeMarkup(locale.newsletterConfirmed[key])));
      assert.equal(metadata.title, locale.seo.newsletterConfirmed.title);
      assert.equal(metadata.description, locale.seo.newsletterConfirmed.description);
      assert(!main.includes("person@example.com") && !main.includes("token="));
      assert(main.includes(`href="${localizedUrl(language, {}, server.config.base)}"`));
      for (const next of supportedLanguages) {
        const route = parseLocation(new URL(`${origin}/${language}/newsletter-confirmed/`), "/");
        assert.equal(localizedUrl(next, route, "/"), `/${next}/newsletter-confirmed/`);
      }
    }
  } finally { await server.close(); }
});

test("enabled root-hosted footer renders a compact accessible form in every language", async () => {
  const saved = Object.fromEntries(["VITE_BASE_PATH", "VITE_NEWSLETTER_ENABLED", "VITE_TURNSTILE_SITE_KEY"].map((key) => [key, process.env[key]]));
  process.env.VITE_BASE_PATH = "/";
  process.env.VITE_NEWSLETTER_ENABLED = "true";
  process.env.VITE_TURNSTILE_SITE_KEY = "public-test-site-key";
  let server;
  try {
    server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    for (const language of supportedLanguages) {
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      const footer = renderPage(language, "").html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
      assert(footer.includes("<form") && footer.includes('type="email"') && footer.includes('type="checkbox"'));
      assert(/auto[Cc]omplete="email"/.test(footer));
      assert(footer.includes("min-h-11"));
      assert(footer.includes("max-w-md"));
      assert(footer.includes(`href="${localizedUrl(language, { page: "privacy" }, "/")}"`));
      for (const key of ["formLabel", "emailLabel", "consent", "subscribe"]) assert(footer.includes(escapeMarkup(locale.newsletter[key])));
      assert(!footer.includes(escapeMarkup(locale.footer.comingSoon)));
      assert(!footer.includes(env.BREVO_API_KEY) && !footer.includes(env.TURNSTILE_SECRET));
    }
  } finally {
    if (server) await server.close();
    for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : process.env[key] = value;
  }
});
