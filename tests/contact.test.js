import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { escapeMarkup } from "../build/html.js";
import { handleContact, contactEmail } from "../functions/api/contact.js";
import { checkFormRateLimit } from "../functions/_lib/rate-limit.js";
import { validateContact, contactLimits } from "../src/forms/contact.js";
import { localizedUrl, parseLocation } from "../src/routing/urls.js";
import { pagePaths, supportedLanguages } from "../src/routing/routeManifest.js";
import { handleMarketplace } from "../functions/api/marketplace.js";
import { MARKETPLACES, selectMarketplace } from "../src/commerce/marketplaceRules.js";

const origin = "https://staging.muuva.pages.dev";
const env = {
  CONTACT_SUBMISSIONS_ENABLED: "true", CONTACT_PUBLIC_ORIGIN: origin, CONTACT_ALLOWED_HOSTNAME: "staging.muuva.pages.dev",
  BREVO_WHOLESALE_API_KEY: "mock-transactional-key", BREVO_CONTACT_TO_EMAIL: "contact@muuva.nl",
  BREVO_CONTACT_SENDER_EMAIL: "website@muuva.nl", BREVO_CONTACT_SENDER_NAME: "MUUVA", TURNSTILE_SECRET: "mock-turnstile-secret",
  FORMS_RATE_LIMIT_MODE: "off",
};
const valid = { name: "Alex", email: "alex@example.com", subject: "general", message: "Hello MUUVA", consent: true, language: "en", turnstileToken: "mock-token" };

function contactRequest(fields = {}, { method = "POST", originHeader = origin, body = null } = {}) {
  return new Request(`${origin}/api/contact`, {
    method,
    headers: { ...(method === "POST" ? { "Content-Type": "application/json" } : {}), ...(originHeader ? { Origin: originHeader } : {}) },
    ...(method === "POST" ? { body: body ?? JSON.stringify({ ...valid, ...fields }) } : {}),
  });
}

function mockFetch({ action = "contact_enquiry", hostname = "staging.muuva.pages.dev", accepted = true, brevoStatus = 201 } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (url.includes("siteverify")) return new Response(JSON.stringify({ success: accepted, action, hostname }), { status: 200 });
    return new Response("private mocked provider response", { status: brevoStatus });
  };
  return { calls, fetchImpl };
}

test("contact validation requires all fields, supported category, privacy acknowledgement, and Unicode-safe limits", () => {
  const accepted = validateContact({ ...valid, message: "🙂".repeat(contactLimits.message) });
  assert.deepEqual(accepted.errors, {});
  assert.equal(accepted.value.message.length, contactLimits.message * 2);
  for (const [field, max] of Object.entries(contactLimits)) {
    assert.equal(validateContact({ ...valid, [field]: "x".repeat(max + 1) }).errors[field], "tooLong");
  }
  assert.equal(validateContact({ ...valid, subject: "https://evil.example" }).errors.subject, "invalidSubject");
  assert.equal(validateContact({ ...valid, consent: false }).errors.consent, "consentRequired");
  assert.equal(validateContact({ ...valid, message: "  " }).errors.message, "required");
  assert.equal(validateContact({ ...valid, email: "not-an-email" }).errors.email, "invalidEmail");
});

test("contact mail content escapes HTML, fixes recipient-facing subject and retains plain text", () => {
  const email = contactEmail({ ...valid, name: "<Alex>", message: "<script>alert('&')</script>" }, "en");
  assert.equal(email.subject, "MUUVA contact enquiry");
  assert(email.htmlContent.includes("&lt;script&gt;"));
  assert(!email.htmlContent.includes("<script>"));
  assert(email.textContent.includes("<script>alert('&')</script>"));
  assert(email.textContent.includes("no marketing subscription"));
});

test("Contact endpoint enforces method, activation, origin, strict fields, challenge and fixed transactional delivery", async () => {
  const upstream = mockFetch();
  assert.equal((await handleContact({ request: contactRequest({}, { method: "GET" }), env }, upstream.fetchImpl)).status, 405);
  assert.equal((await handleContact({ request: contactRequest({}, { originHeader: "https://attacker.example" }), env }, upstream.fetchImpl)).status, 403);
  assert.equal((await handleContact({ request: contactRequest({ unexpected: "field" }), env }, upstream.fetchImpl)).status, 400);
  assert.equal((await handleContact({ request: contactRequest(), env: { ...env, CONTACT_SUBMISSIONS_ENABLED: "false" } }, upstream.fetchImpl)).status, 503);
  assert.equal(upstream.calls.length, 0);

  const challengeFailure = mockFetch({ action: "wholesale_enquiry" });
  assert.equal((await handleContact({ request: contactRequest(), env }, challengeFailure.fetchImpl)).status, 400);
  assert.equal(challengeFailure.calls.length, 1);

  const success = mockFetch();
  const response = await handleContact({ request: contactRequest(), env }, success.fetchImpl);
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { code: "enquiry_received" });
  assert.equal(success.calls.length, 2);
  const payload = JSON.parse(success.calls[1].options.body);
  assert.deepEqual(payload.to, [{ email: "contact@muuva.nl" }]);
  assert.deepEqual(payload.replyTo, { email: "alex@example.com", name: "Alex" });
  assert.equal(payload.subject, "MUUVA contact enquiry");
  assert(!("includeListIds" in payload));
  assert(new URLSearchParams(success.calls[0].options.body).get("secret") === "mock-turnstile-secret");
});

test("Contact body byte bound and required challenge fail before any provider call", async () => {
  const upstream = mockFetch();
  const tooLarge = contactRequest({}, { body: JSON.stringify({ ...valid, message: "🙂".repeat(7000) }) });
  assert.equal((await handleContact({ request: tooLarge, env }, upstream.fetchImpl)).status, 400);
  assert.equal((await handleContact({ request: contactRequest({ turnstileToken: "" }), env }, upstream.fetchImpl)).status, 400);
  assert.equal(upstream.calls.length, 0);
});

test("Contact limiter uses its own HMAC category and fails closed when enforcement is incomplete", async () => {
  const names = [];
  const namespace = { idFromName(name) { names.push(name); return name; }, get() { return { fetch: async () => new Response(null, { status: 204 }) }; } };
  const request = contactRequest();
  Object.defineProperty(request, "cf", { value: { colo: "TEST" } });
  Object.defineProperty(request, "headers", { value: new Headers({ ...Object.fromEntries(request.headers), "CF-Connecting-IP": "192.0.2.20" }) });
  const limiterEnv = { FORMS_RATE_LIMIT_MODE: "enforce", FORMS_RATE_LIMITER: namespace, FORMS_RATE_LIMIT_HASH_SECRET: "fictitious-test-hmac-key-at-least-32-characters", FORMS_RATE_LIMIT_SCOPE: "preview" };
  assert.equal(await checkFormRateLimit({ request, env: limiterEnv, endpoint: "contact" }, { log: () => {} }), null);
  assert.match(names[0], /^v1:preview:contact:[0-9a-f]{64}$/);
  const blocked = await checkFormRateLimit({ request, env: { ...limiterEnv, FORMS_RATE_LIMITER: undefined }, endpoint: "contact" }, { log: () => {} });
  assert.equal(blocked.status, 503);

  const limitedRequest = contactRequest();
  Object.defineProperty(limitedRequest, "cf", { value: { colo: "TEST" } });
  const headers = new Headers(limitedRequest.headers);
  headers.set("CF-Connecting-IP", "192.0.2.20");
  Object.defineProperty(limitedRequest, "headers", { value: headers });
  const limitedEnv = { ...env, ...limiterEnv, FORMS_RATE_LIMITER: { idFromName: (name) => name, get: () => ({ fetch: async () => new Response(null, { status: 429, headers: { "Retry-After": "300" } }) }) } };
  const noEmail = mockFetch();
  const rateLimited = await handleContact({ request: limitedRequest, env: limitedEnv }, noEmail.fetchImpl);
  assert.equal(rateLimited.status, 429);
  assert.equal(rateLimited.headers.get("Retry-After"), "300");
  assert.equal(noEmail.calls.length, 0);
});

test("Contact page routes, localized copy, footer destinations and metadata are present in every language", () => {
  assert(pagePaths.includes("contact/"));
  for (const base of ["/", "/muuva/"]) {
    for (const language of supportedLanguages) {
      const route = parseLocation(new URL(`https://muuva.nl${base}${language}/contact`, "https://muuva.nl"), base);
      assert.equal(route.page, "contact");
      assert.equal(localizedUrl(language, route, base), `${base}${language}/contact/`);
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      assert(locale.contact.title && locale.contact.intro && locale.contact.errors.notReady);
      assert(locale.seo.contact.title && locale.seo.contact.description.length > 50);
      assert(locale.product.marketplace.nl && locale.footer.tiktok && locale.footer.youtube);
      assert(locale.privacy.sections.contact.p1.length > 100);
    }
  }
});

test("Contact server HTML localizes form and keeps footer/social links and disabled form safe", async () => {
  const keys = ["VITE_BASE_PATH", "VITE_PUBLIC_SITE_ORIGIN", "VITE_CONTACT_ENABLED", "VITE_TURNSTILE_SITE_KEY"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.VITE_BASE_PATH = "/muuva/";
  process.env.VITE_PUBLIC_SITE_ORIGIN = "https://calv200.github.io";
  process.env.VITE_CONTACT_ENABLED = "false";
  process.env.VITE_TURNSTILE_SITE_KEY = "";
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom", logLevel: "error" });
  try {
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    for (const language of supportedLanguages) {
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      const { html, metadata } = renderPage(language, "contact/");
      const main = html.match(/<main>([\s\S]*?)<\/main>/)[1].replaceAll("&#x27;", "&#39;");
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0].replaceAll("&#x27;", "&#39;");
      assert(main.includes(escapeMarkup(locale.contact.title)) && main.includes(escapeMarkup(locale.contact.intro)));
      for (const copy of Object.values(locale.contact.fields)) assert(main.includes(escapeMarkup(copy)));
      for (const copy of Object.values(locale.contact.subjects)) assert(main.includes(escapeMarkup(copy)));
      assert(main.includes(escapeMarkup(locale.contact.errors.notReady)));
      assert(main.includes("contact@muuva.nl"));
      assert.equal(metadata.title, locale.seo.contact.title);
      assert(metadata.canonical.endsWith(`/${language}/contact/`));
      assert(metadata.alternates.every((alternate) => alternate.href.endsWith("/contact/")));
      assert(footer.includes(`href="/muuva/${language}/contact/"`));
      assert(footer.includes(`href="/muuva/${language}/wholesale/"`));
      for (const [platform, url] of [["instagram", "https://www.instagram.com/muuva.studio/"], ["tiktok", "https://www.tiktok.com/@muuva.studio"], ["youtube", "https://www.youtube.com/@Muuva.studio"]]) {
        assert(footer.includes(`href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${escapeMarkup(locale.footer[platform])}"`));
      }
      for (const retired of ["wholesale", "care", "sustainability", "faq", "refund", "shipping"]) assert(!footer.includes(locale.footer.links[retired]));
    }
  } finally {
    await server.close();
    for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : process.env[key] = value;
  }
});

test("marketplace precedence follows explicit choice, language, Cloudflare country and safe NL fallback", () => {
  const cases = [
    [{ language: "de", override: "NL", country: "DE" }, "NL"],
    [{ language: "nl", override: "DE", country: "NL" }, "DE"],
    [{ language: "nl", country: "DE" }, "NL"],
    [{ language: "de", country: "NL" }, "DE"],
    [{ language: "en", country: "DE" }, "DE"],
    [{ language: "es", country: "NL" }, "NL"],
    [{ language: "en", country: "US" }, "NL"],
    [{ language: "es" }, "NL"],
  ];
  for (const [input, expected] of cases) assert.equal(selectMarketplace(input), expected);
  assert.equal(MARKETPLACES.NL, "https://www.amazon.nl/dp/B0GZ4RBMX9");
  assert.equal(MARKETPLACES.DE, "https://www.amazon.de/dp/B0GZ4RBMX9");
});

test("Cloudflare marketplace redirect is ordinary Origin-free GET with strict query allowlist", () => {
  const resolve = (query, country, method = "GET") => {
    const request = new Request(`https://muuva.nl/api/marketplace${query}`, { method });
    if (country) Object.defineProperty(request, "cf", { value: { country } });
    return handleMarketplace({ request });
  };
  for (const [query, country, expected] of [["?language=en", "DE", MARKETPLACES.DE], ["?language=es", "NL", MARKETPLACES.NL], ["?language=nl", "DE", MARKETPLACES.NL], ["?language=de&marketplace=NL", "DE", MARKETPLACES.NL], ["?language=en", null, MARKETPLACES.NL]]) {
    const response = resolve(query, country);
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), expected);
    assert.equal(response.headers.get("cache-control"), "no-store, private");
    assert.equal(response.headers.get("access-control-allow-origin"), null);
  }
  for (const query of ["?language=fr", "?language=en&marketplace=https://evil.example", "?language=en&url=https://evil.example", "?language=en&language=de"]) {
    assert.equal(resolve(query, "DE").status, 400);
  }
  assert.equal(resolve("?language=en", "DE", "POST").headers.get("allow"), "GET");
});
