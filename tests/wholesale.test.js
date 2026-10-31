import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createServer } from "vite";
import { handleWholesale } from "../functions/api/wholesale.js";
import { fetchWithTimeout } from "../functions/_lib/forms.js";
import { validateWholesale, wholesaleLimits } from "../src/forms/wholesale.js";
import { localizedUrl, parseLocation } from "../src/routing/urls.js";
import { supportedLanguages } from "../src/routing/routeManifest.js";
import { escapeMarkup } from "../build/html.js";

const origin = "https://staging.muuva.pages.dev";
const env = {
  WHOLESALE_SUBMISSIONS_ENABLED: "true", WHOLESALE_PUBLIC_ORIGIN: origin,
  WHOLESALE_ALLOWED_HOSTNAME: "staging.muuva.pages.dev",
  BREVO_WHOLESALE_API_KEY: "private-wholesale-key", TURNSTILE_SECRET: "private-turnstile-secret",
  BREVO_WHOLESALE_TO_EMAIL: "contact@muuva.nl", BREVO_WHOLESALE_SENDER_EMAIL: "website@muuva.nl",
  BREVO_WHOLESALE_SENDER_NAME: "MUUVA",
};
const valid = { name: "  Alex  ", businessName: "Pilates & Co", email: "alex@example.com", businessType: "studio", enquiry: "Hello MUUVA,\nWe would love to work together.", consent: true, language: "en", turnstileToken: "test-token" };

function request(overrides = {}, { method = "POST", requestOrigin = origin, url = `${origin}/api/wholesale` } = {}) {
  return new Request(url, { method, headers: { Origin: requestOrigin, "Content-Type": "application/json" }, ...method === "POST" ? { body: JSON.stringify({ ...valid, ...overrides }) } : {} });
}

function services({ challenge = { success: true, action: "wholesale_enquiry", hostname: env.WHOLESALE_ALLOWED_HOSTNAME }, challengeStatus = 200, brevoStatus = 201, failAt = "" } = {}) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (failAt && url.includes(failAt)) throw new Error("Private error with alex@example.com");
    if (url.includes("siteverify")) return new Response(JSON.stringify(challenge), { status: challengeStatus });
    assert.equal(url, "https://api.brevo.com/v3/smtp/email");
    return new Response("Private Brevo response with alex@example.com", { status: brevoStatus });
  };
  return { fetchImpl, calls };
}

test("Wholesale routes preserve language, queries and anchors under both deployment bases", () => {
  for (const base of ["/", "/muuva/"]) {
    const route = parseLocation(new URL(`https://muuva.nl${base}en/wholesale?utm_source=studio#wholesale-form-title`), base);
    assert.equal(route.page, "wholesale");
    for (const language of supportedLanguages) assert.equal(localizedUrl(language, route, base), `${base}${language}/wholesale/?utm_source=studio#wholesale-form-title`);
  }
});

test("Wholesale has localized editorial content, accessible fields, image, SEO and both footer links", async () => {
  const keys = ["VITE_BASE_PATH", "VITE_TURNSTILE_SITE_KEY", "VITE_NEWSLETTER_ENABLED", "VITE_WHOLESALE_ENABLED"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.VITE_BASE_PATH = "/";
  process.env.VITE_TURNSTILE_SITE_KEY = "public-test-key";
  process.env.VITE_NEWSLETTER_ENABLED = "false";
  process.env.VITE_WHOLESALE_ENABLED = "true";
  let server;
  try {
    server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom", logLevel: "error" });
    const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
    for (const language of supportedLanguages) {
      const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
      const { html, metadata } = renderPage(language, "wholesale/");
      const main = html.match(/<main>[\s\S]*?<\/main>/)[0].replaceAll("&#x27;", "&#39;");
      assert.equal((main.match(/<h1\b/g) || []).length, 1);
      for (const key of ["title", "eyebrow", "intro", "formTitle", "formIntro", "imageAlt", "consent", "privacyText", "submit"]) assert(main.includes(escapeMarkup(locale.wholesale[key])), `${language}: ${key}`);
      for (const label of Object.values(locale.wholesale.fields)) assert(main.includes(escapeMarkup(label)));
      const ids = [...main.matchAll(/\bid="wholesale-(name|businessName|email|businessType|enquiry|consent)"/g)].map((match) => match[1]);
      assert.deepEqual(ids, ["name", "businessName", "email", "businessType", "enquiry", "consent"]);
      assert.equal((main.match(/ required=""/g) || []).length, 5);
      assert(!/<input\b[^>]*type="checkbox"[^>]*checked/.test(main));
      assert(main.includes('type="email"') && main.includes('autoComplete="email"'));
      assert(main.includes("reformer_bench.jpg") && main.includes("object-cover") && main.indexOf("<img") < main.indexOf("<form"));
      assert(main.includes(`href="/${language}/privacy/"`));
      assert.equal(metadata.title, locale.seo.wholesale.title);
      assert.equal(metadata.description, locale.seo.wholesale.description);
      assert(metadata.canonical.endsWith(`/${language}/wholesale/`));
      assert(metadata.alternates.every((alternate) => alternate.href.endsWith("/wholesale/")));
      const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
      assert.equal((footer.match(new RegExp(`href="/${language}/wholesale/"`, "g")) || []).length, 2);
    }
  } finally {
    if (server) await server.close();
    for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : process.env[key] = value;
  }
});

test("shared validation enforces required fields, lengths, email, business IDs and privacy acknowledgement", () => {
  const cleaned = validateWholesale({ ...valid, businessType: "" });
  assert.deepEqual(cleaned.errors, {});
  assert.equal(cleaned.value.name, "Alex");
  assert.equal(cleaned.value.enquiry, valid.enquiry);
  for (const field of Object.keys(wholesaleLimits)) {
    assert.equal(validateWholesale({ ...valid, [field]: " " }).errors[field], "required");
    assert.equal(validateWholesale({ ...valid, [field]: "x".repeat(wholesaleLimits[field] + 1) }).errors[field], "tooLong");
    assert.equal(validateWholesale({ ...valid, [field]: null }).errors[field], "required");
  }
  for (const email of ["invalid", "a..b@example.com", "alex@example.com\r\nBcc: other@example.com", "alex@-example.com"]) assert(validateWholesale({ ...valid, email }).errors.email);
  assert.equal(validateWholesale({ ...valid, businessType: "Arbitrary business" }).errors.businessType, "invalidBusinessType");
  assert.equal(validateWholesale({ ...valid, consent: false }).errors.consent, "consentRequired");
  assert.equal(validateWholesale({ ...valid, name: "Alex\nBcc: someone" }).errors.name, "invalidText");
  assert.equal(validateWholesale({ ...valid, enquiry: "Bad\u0000text" }).errors.enquiry, "invalidText");
});

test("disabled Wholesale builds, missing widget keys and subpath builds leave submission unavailable", async () => {
  const keys = ["VITE_BASE_PATH", "VITE_TURNSTILE_SITE_KEY", "VITE_WHOLESALE_ENABLED"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    for (const [base, enabled, siteKey] of [["/", "false", "public-test-key"], ["/", "true", ""], ["/muuva/", "true", "public-test-key"]]) {
      process.env.VITE_BASE_PATH = base;
      process.env.VITE_WHOLESALE_ENABLED = enabled;
      process.env.VITE_TURNSTILE_SITE_KEY = siteKey;
      const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom", logLevel: "error" });
      try {
        const { renderPage } = await server.ssrLoadModule("/src/entry-server.jsx");
        const main = renderPage("en", "wholesale/").html.match(/<main>[\s\S]*?<\/main>/)[0];
        assert(/<button\b[^>]*type="submit"[^>]*disabled/.test(main));
        assert(main.includes("Enquiries through this form are currently unavailable."));
        assert(!main.includes("Spam protection verification"));
      } finally { await server.close(); }
    }
  } finally {
    for (const [key, value] of Object.entries(saved)) value === undefined ? delete process.env[key] : process.env[key] = value;
  }
});

test("Wholesale locale catalogs have identical keys and interpolation variables", () => {
  const flatten = (value, prefix = "") => Object.entries(value).flatMap(([key, item]) => typeof item === "object" ? flatten(item, `${prefix}${key}.`) : [[`${prefix}${key}`, item]]);
  let expected;
  for (const language of supportedLanguages) {
    const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
    const values = flatten({ wholesale: locale.wholesale, seo: locale.seo.wholesale });
    const signature = values.map(([key, value]) => [key, [...value.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1])]);
    assert(values.every(([, value]) => typeof value === "string" && value.trim()));
    if (!expected) expected = signature;
    else assert.deepEqual(signature, expected, `${language}: locale keys or interpolation differ`);
  }
});

test("valid enquiries send one structured transactional email with fixed recipients and no contact subscription", async () => {
  for (const language of supportedLanguages) {
    const mock = services();
    const response = await handleWholesale({ request: request({ language, enquiry: '<script>alert("x")</script>\nA & B' }), env }, mock.fetchImpl);
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { code: "enquiry_received" });
    assert.equal(mock.calls.length, 2);
    const challenge = new URLSearchParams(mock.calls[0].options.body);
    assert.deepEqual([...challenge.keys()], ["secret", "response"]);
    const email = JSON.parse(mock.calls[1].options.body);
    assert.deepEqual(email.to, [{ email: "contact@muuva.nl" }]);
    assert.deepEqual(email.sender, { email: "website@muuva.nl", name: "MUUVA" });
    assert.deepEqual(email.replyTo, { email: "alex@example.com", name: "Alex" });
    assert.equal(email.subject, "MUUVA wholesale enquiry");
    assert(email.textContent.includes(`Language:\n${language}`));
    assert(email.htmlContent.includes("&lt;script&gt;") && email.htmlContent.includes("A &amp; B"));
    assert(!email.htmlContent.includes("<script>") && !email.htmlContent.includes("<a "));
    assert.equal(mock.calls[1].options.headers["api-key"], env.BREVO_WHOLESALE_API_KEY);
    assert.deepEqual(Object.keys(email).sort(), ["sender", "to", "replyTo", "subject", "textContent", "htmlContent"].sort());
    assert(!JSON.stringify(email).includes("test-token") && !JSON.stringify(email).includes(env.TURNSTILE_SECRET));
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});

test("disabled, cross-origin, wrong-host and invalid methods cannot call upstream services", async () => {
  const cases = [
    [request(), { ...env, WHOLESALE_SUBMISSIONS_ENABLED: "false" }, 503],
    [request(), { ...env, WHOLESALE_SUBMISSIONS_ENABLED: undefined }, 503],
    [request({}, { method: "GET" }), env, 405],
    [request({}, { method: "OPTIONS" }), env, 405],
    [request({}, { requestOrigin: "https://evil.example" }), env, 403],
    [request({}, { requestOrigin: "null" }), env, 403],
    [request({}, { url: "https://other.pages.dev/api/wholesale" }), env, 403],
    [request(), { ...env, WHOLESALE_PUBLIC_ORIGIN: `${origin}/unexpected/` }, 403],
    [request(), { ...env, WHOLESALE_PUBLIC_ORIGIN: "http://staging.muuva.pages.dev" }, 403],
  ];
  for (const [incoming, bindings, status] of cases) {
    const mock = services();
    assert.equal((await handleWholesale({ request: incoming, env: bindings }, mock.fetchImpl)).status, status);
    assert.equal(mock.calls.length, 0);
  }
});

test("invalid input and oversized or malformed payloads fail before Turnstile", async () => {
  const bodies = [{ name: "" }, { businessName: "" }, { email: "invalid" }, { enquiry: "" }, { consent: false }, { language: "fr" }, { businessType: "unknown" }, { to: "attacker@example.com" }, { turnstileToken: "" }, { turnstileToken: "x".repeat(2049) }];
  const requests = bodies.map((body) => request(body));
  for (const [body, contentType] of [["{", "application/json"], ["[]", "application/json"], ["null", "application/json"], ["hello", "text/plain"], ["x".repeat(16385), "application/json"]]) {
    requests.push(new Request(`${origin}/api/wholesale`, { method: "POST", headers: { Origin: origin, "Content-Type": contentType }, body }));
  }
  for (const incoming of requests) {
    const mock = services();
    assert.equal((await handleWholesale({ request: incoming, env }, mock.fetchImpl)).status, 400);
    assert.equal(mock.calls.length, 0);
  }
});

test("missing credentials or invalid sender/recipient configuration fail closed", async () => {
  for (const key of ["BREVO_WHOLESALE_API_KEY", "TURNSTILE_SECRET", "BREVO_WHOLESALE_TO_EMAIL", "BREVO_WHOLESALE_SENDER_EMAIL", "BREVO_WHOLESALE_SENDER_NAME"]) {
    const mock = services();
    assert.equal((await handleWholesale({ request: request(), env: { ...env, [key]: "" } }, mock.fetchImpl)).status, 503);
    assert.equal(mock.calls.length, 0);
  }
  for (const overrides of [{ BREVO_WHOLESALE_TO_EMAIL: "not-an-email" }, { BREVO_WHOLESALE_SENDER_NAME: "MUUVA\r\nBcc: attacker" }]) {
    const mock = services();
    assert.equal((await handleWholesale({ request: request(), env: { ...env, ...overrides } }, mock.fetchImpl)).status, 503);
    assert.equal(mock.calls.length, 0);
  }
});

test("Turnstile failure, replay, wrong action and wrong hostname prevent email submission", async () => {
  for (const challenge of [{ success: false, "error-codes": ["timeout-or-duplicate"] }, { success: true, action: "newsletter_signup", hostname: env.WHOLESALE_ALLOWED_HOSTNAME }, { success: true, action: "wholesale_enquiry", hostname: "evil.example" }, null]) {
    const mock = services({ challenge });
    const response = await handleWholesale({ request: request(), env }, mock.fetchImpl);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { code: "challenge_failed" });
    assert.equal(mock.calls.length, 1);
  }
});

test("Brevo rejections and transport failures return safe errors without claiming success", async () => {
  for (const settings of [200, 400, 401, 403, 409, 429, 500].map((brevoStatus) => ({ brevoStatus })).concat([{ challengeStatus: 500 }, { failAt: "siteverify" }, { failAt: "smtp/email" }])) {
    const mock = services(settings);
    const response = await handleWholesale({ request: request(), env }, mock.fetchImpl);
    assert.equal(response.status, 503);
    assert.equal(await response.text(), JSON.stringify({ code: "unavailable" }));
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }
  const source = readFileSync(new URL("../functions/api/wholesale.js", import.meta.url), "utf8");
  assert(!source.includes("console.") && !source.includes("/contacts"));
});

test("Wholesale upstream timeout aborts stalled fetches and Siteverify bodies", async () => {
  await assert.rejects(fetchWithTimeout((_, { signal }) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))), "https://example.invalid", {}, 10), { name: "AbortError" });
  await assert.rejects(fetchWithTimeout(async (_, { signal }) => ({ ok: true, json: () => new Promise((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))) }), "https://example.invalid", {}, 10, true), { name: "AbortError" });
});
