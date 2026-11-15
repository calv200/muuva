import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { checkFormRateLimit } from "../functions/_lib/rate-limit.js";
import { handleNewsletter } from "../functions/api/newsletter.js";
import { handleWholesale } from "../functions/api/wholesale.js";
import { evaluateAttempts, expireAttempts, FormRateLimiter, reserveAttempt } from "../workers/forms-rate-limiter/index.js";
import { retryAfterDelay } from "../src/forms/retry.js";

const origin = "https://staging.muuva.pages.dev";
const baseEnv = {
  NEWSLETTER_SUBMISSIONS_ENABLED: "true", NEWSLETTER_PUBLIC_ORIGIN: origin, NEWSLETTER_ALLOWED_HOSTNAME: "staging.muuva.pages.dev",
  WHOLESALE_SUBMISSIONS_ENABLED: "true", WHOLESALE_PUBLIC_ORIGIN: origin, WHOLESALE_ALLOWED_HOSTNAME: "staging.muuva.pages.dev",
  BREVO_API_KEY: "test-newsletter-secret", BREVO_NEWSLETTER_LIST_ID: "3", BREVO_DOI_TEMPLATE_EN: "2", BREVO_DOI_TEMPLATE_DE: "3", BREVO_DOI_TEMPLATE_NL: "4", BREVO_DOI_TEMPLATE_ES: "5",
  BREVO_WHOLESALE_API_KEY: "test-wholesale-secret", BREVO_WHOLESALE_TO_EMAIL: "contact@muuva.nl", BREVO_WHOLESALE_SENDER_EMAIL: "website@muuva.nl", BREVO_WHOLESALE_SENDER_NAME: "MUUVA", TURNSTILE_SECRET: "test-turnstile-secret",
  FORMS_RATE_LIMIT_MODE: "enforce", FORMS_RATE_LIMIT_HASH_SECRET: "fictitious-test-hmac-key-at-least-32-characters", FORMS_RATE_LIMIT_SCOPE: "preview",
};
const handlers = { newsletter: handleNewsletter, wholesale: handleWholesale };
const quiet = () => {};

// Serial storage is a test double for the documented SQLite transaction contract.
// It is never used by the deployed limiter; real workerd concurrency is checked separately.
class Storage {
  values = new Map();
  alarm = null;
  queue = Promise.resolve();
  transaction(callback) {
    const work = this.queue.then(callback);
    this.queue = work.catch(() => {});
    return work;
  }
  async get(key) { return structuredClone(this.values.get(key)); }
  async put(key, value) { this.values.set(key, structuredClone(value)); }
  async setAlarm(value) { this.alarm = value; }
  async deleteAll() { this.values.clear(); this.alarm = null; }
}

function limiter(clock = () => 1000000000) {
  const records = new Map();
  const names = [];
  const bodies = [];
  const namespace = {
    idFromName(name) { names.push(name); return name; },
    get(name) {
      if (!records.has(name)) records.set(name, new Storage());
      return { async fetch(_, options) {
        bodies.push(options.body);
        const retryAfter = await reserveAttempt(records.get(name), JSON.parse(options.body), clock());
        return new Response(null, { status: retryAfter ? 429 : 204, headers: retryAfter ? { "Retry-After": String(retryAfter) } : {} });
      } };
    },
  };
  return { namespace, records, names, bodies };
}

function request(endpoint, { language = "en", cf = true, address = "192.0.2.9", extraHeaders = {}, originHeader = origin, fields = {} } = {}) {
  const body = { email: "person@example.com", language, consent: true, turnstileToken: "fictitious-token", ...endpoint === "wholesale" ? { name: "Private name", businessName: "Private business", businessType: "studio", enquiry: "Private enquiry" } : {}, ...fields };
  const incoming = new Request(`${origin}/api/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: originHeader, "CF-Connecting-IP": address, ...extraHeaders }, body: JSON.stringify(body) });
  if (cf) Object.defineProperty(incoming, "cf", { value: { colo: "TEST" } });
  return incoming;
}

function services(challengeSuccess = true, brevoStatus = 201) {
  const calls = [];
  return { calls, fetchImpl: async (url, options) => {
    calls.push(url);
    if (url.includes("siteverify")) {
      const token = new URLSearchParams(options.body).get("response");
      return new Response(JSON.stringify({ success: challengeSuccess, hostname: "staging.muuva.pages.dev", action: token === "wholesale-token" ? "wholesale_enquiry" : "newsletter_signup" }), { status: 200 });
    }
    return new Response("Never expose person@example.com or raw Brevo details", { status: brevoStatus });
  } };
}

function incoming(endpoint, options = {}) {
  return request(endpoint, { ...options, fields: { turnstileToken: endpoint === "wholesale" ? "wholesale-token" : "newsletter-token", ...options.fields } });
}

test("five admitted attempts per endpoint; rejection has Retry-After and calls neither upstream", async (t) => {
  t.mock.method(console, "warn", quiet);
  const backend = limiter();
  const env = { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace };
  const upstream = services();
  for (const endpoint of Object.keys(handlers)) {
    for (let index = 0; index < 5; index++) assert.equal((await handlers[endpoint]({ request: incoming(endpoint), env }, upstream.fetchImpl, quiet)).status, 202);
    const count = upstream.calls.length;
    const response = await handlers[endpoint]({ request: incoming(endpoint, { fields: { email: "other@example.com" } }), env }, upstream.fetchImpl, quiet);
    assert.equal(response.status, 429);
    assert.deepEqual(await response.json(), { code: "rate_limited" });
    assert.equal(response.headers.get("Retry-After"), "600");
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(upstream.calls.length, count);
  }
  assert.equal(backend.records.size, 2);
});

test("rolling ten-minute and hourly limits expire, and denied attempts do not extend the block", async () => {
  let now = 1000000000;
  const backend = limiter(() => now);
  const env = { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace, FORMS_RATE_LIMIT_10M: "2", FORMS_RATE_LIMIT_1H: "3" };
  const check = () => checkFormRateLimit({ request: incoming("newsletter"), env, endpoint: "newsletter" }, { log: quiet });
  assert.equal(await check(), null); assert.equal(await check(), null);
  assert.equal((await check()).headers.get("Retry-After"), "600");
  now += 600000;
  assert.equal(await check(), null);
  assert.equal((await check()).headers.get("Retry-After"), "3000");
  now += 1000;
  assert.equal((await check()).headers.get("Retry-After"), "2999");
  now += 2999000;
  assert.equal(await check(), null);
  const storage = [...backend.records.values()][0];
  assert.equal((await storage.get("attempts")).length, 2);
  await expireAttempts({ storage, blockConcurrencyWhile: (callback) => storage.transaction(callback) }, now + 3600000);
  assert.equal(await storage.get("attempts"), undefined);
  assert.equal(storage.alarm, null);
});

test("the sliding policy does not reset at a wall-clock bucket boundary", () => {
  const previous = [599900, 599910, 599920, 599930, 599940];
  assert(evaluateAttempts(previous, { shortLimit: 5, hourLimit: 20 }, 600000).retryAfter > 0);
  assert.equal(evaluateAttempts(previous, { shortLimit: 5, hourLimit: 20 }, 1199900).retryAfter, 0);
});

test("simultaneous requests reserve atomically before any Brevo submission", async () => {
  const backend = limiter();
  const env = { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace };
  const upstream = services();
  const responses = await Promise.all(Array.from({ length: 8 }, () => handleNewsletter({ request: incoming("newsletter"), env }, upstream.fetchImpl, quiet)));
  assert.equal(responses.filter((response) => response.status === 202).length, 5);
  assert.equal(responses.filter((response) => response.status === 429).length, 3);
  assert.equal(upstream.calls.filter((url) => url.includes("doubleOptinConfirmation")).length, 5);
});

test("limits never bypass Turnstile, consent, origin, or the disabled runtime switches", async () => {
  for (const endpoint of Object.keys(handlers)) {
    const backend = limiter();
    const env = { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace };
    const upstream = services(false);
    assert.equal((await handlers[endpoint]({ request: incoming(endpoint), env }, upstream.fetchImpl, quiet)).status, 400);
    assert.equal(upstream.calls.length, 1);
    assert.equal((await handlers[endpoint]({ request: incoming(endpoint, { fields: { consent: false } }), env }, upstream.fetchImpl, quiet)).status, 400);
    assert.equal(upstream.calls.length, 1);
    const before = backend.names.length;
    assert.equal((await handlers[endpoint]({ request: incoming(endpoint, { originHeader: "https://evil.example" }), env }, upstream.fetchImpl, quiet)).status, 403);
    const flag = endpoint === "newsletter" ? "NEWSLETTER_SUBMISSIONS_ENABLED" : "WHOLESALE_SUBMISSIONS_ENABLED";
    assert.equal((await handlers[endpoint]({ request: incoming(endpoint), env: { ...env, [flag]: "false" } }, upstream.fetchImpl, quiet)).status, 503);
    assert.equal(backend.names.length, before);
  }
});

test("off or unset preserves existing forms; invalid or mandatory missing configuration fails closed", async () => {
  const backend = limiter();
  for (const mode of [undefined, "off"]) {
    assert.equal(await checkFormRateLimit({ request: incoming("newsletter", { cf: false }), env: { FORMS_RATE_LIMIT_MODE: mode }, endpoint: "newsletter" }), null);
  }
  const records = [];
  const failures = [{ FORMS_RATE_LIMIT_MODE: "" }, { FORMS_RATE_LIMIT_MODE: "true" }, { FORMS_RATE_LIMITER: undefined }, { FORMS_RATE_LIMIT_HASH_SECRET: "short" }, { FORMS_RATE_LIMIT_SCOPE: undefined }, { FORMS_RATE_LIMIT_SCOPE: "invalid scope" }, { FORMS_RATE_LIMIT_10M: "0" }, { FORMS_RATE_LIMIT_10M: "5.5" }, { FORMS_RATE_LIMIT_1H: "1001" }];
  for (const overrides of failures) {
    const response = await checkFormRateLimit({ request: incoming("newsletter"), env: { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace, ...overrides }, endpoint: "newsletter" }, { log: (...args) => records.push(args) });
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { code: "unavailable" });
  }
  assert.equal(backend.names.length, 0);
  assert(records.every(([, record]) => record.category === "configuration" && record.status === 503));
});

test("only validated Cloudflare client headers are used; IPv6 spellings normalize and scopes isolate state", async () => {
  const backend = limiter();
  const env = { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace };
  for (const options of [{ cf: false }, { address: "" }, { address: "999.1.2.3" }, { address: "192.0.2.1, 192.0.2.2" }, { address: "not-an-ip", extraHeaders: { "X-Forwarded-For": "192.0.2.1" } }]) {
    assert.equal((await checkFormRateLimit({ request: incoming("newsletter", options), env, endpoint: "newsletter" }, { log: quiet })).status, 503);
  }
  for (const address of ["2001:db8:0:0:0:0:0:1", "2001:db8::1"]) assert.equal(await checkFormRateLimit({ request: incoming("newsletter", { address }), env, endpoint: "newsletter" }, { log: quiet }), null);
  assert.equal(backend.names[0], backend.names[1]);
  await checkFormRateLimit({ request: incoming("newsletter", { address: "2001:db8::1", extraHeaders: { "X-Forwarded-For": "198.51.100.1" } }), env, endpoint: "newsletter" }, { log: quiet });
  assert.equal(backend.names[1], backend.names[2]);
  await checkFormRateLimit({ request: incoming("newsletter", { address: "2001:db8::1" }), env: { ...env, FORMS_RATE_LIMIT_SCOPE: "production" }, endpoint: "newsletter" }, { log: quiet });
  assert.notEqual(backend.names[2], backend.names[3]);
  assert(backend.names.every((name) => /^v1:(preview|production):newsletter:[0-9a-f]{64}$/.test(name)));
  assert(backend.bodies.every((body) => body === JSON.stringify({ shortLimit: 5, hourLimit: 20 })));
  assert(!JSON.stringify([...backend.names, ...backend.bodies]).includes("2001:db8"));
});

test("limiter outages, malformed replies and timeouts fail closed with safe diagnostics", async () => {
  const logs = [];
  let aborted = false;
  const cases = [async () => { throw new Error("person@example.com private IP or key"); }, async () => new Response(null, { status: 200 }), async () => new Response(null, { status: 429, headers: { "Retry-After": "person@example.com" } }), async (_, { signal }) => { signal.addEventListener("abort", () => { aborted = true; }); return new Promise(() => {}); }];
  for (const fetch of cases) {
    const env = { ...baseEnv, FORMS_RATE_LIMITER: { idFromName: (name) => name, get: () => ({ fetch }) } };
    const response = await checkFormRateLimit({ request: incoming("newsletter"), env, endpoint: "newsletter" }, { log: (...args) => logs.push(args), timeoutMs: 5 });
    assert.equal(response.status, 503);
  }
  assert(aborted);
  assert(!JSON.stringify(logs).includes("person@example.com"));
  for (const privateValue of [baseEnv.FORMS_RATE_LIMIT_HASH_SECRET, "192.0.2.9", "Private enquiry", "fictitious-token"]) assert(!JSON.stringify(logs).includes(privateValue));
  assert(logs.every(([event, record]) => event === "forms.rate_limit" && Object.keys(record).sort().join(",") === "category,endpoint,status"));
});

test("mandatory missing or unavailable namespace prevents both endpoints from calling upstream", async (t) => {
  t.mock.method(console, "warn", quiet);
  for (const endpoint of Object.keys(handlers)) {
    for (const namespace of [undefined, { idFromName: (name) => name, get: () => ({ fetch: async () => { throw new Error("private upstream detail"); } }) }]) {
      const upstream = services();
      const response = await handlers[endpoint]({ request: incoming(endpoint), env: { ...baseEnv, FORMS_RATE_LIMITER: namespace } }, upstream.fetchImpl, quiet);
      assert.equal(response.status, 503);
      assert.deepEqual(await response.json(), { code: "unavailable" });
      assert.equal(upstream.calls.length, 0);
    }
  }
});

test("Newsletter receipts stay neutral for contact-state rejections with enforcement enabled", async () => {
  const backend = limiter();
  const env = { ...baseEnv, FORMS_RATE_LIMITER: backend.namespace };
  for (const status of [201, 400, 409]) {
    const upstream = services(true, status);
    const response = await handleNewsletter({ request: incoming("newsletter"), env }, upstream.fetchImpl, quiet);
    assert.equal(response.status, 202);
    assert.deepEqual(await response.json(), { code: "request_received" });
  }
});

test("Durable Object expiry preserves a newer attempt and validates its private protocol", async () => {
  const storage = new Storage();
  await reserveAttempt(storage, { shortLimit: 5, hourLimit: 20 }, 1000000000);
  await expireAttempts({ storage, blockConcurrencyWhile: (callback) => storage.transaction(callback) }, 1000000001);
  assert.equal((await storage.get("attempts")).length, 1);
  assert.equal(storage.alarm, 1003600000);
  const object = new FormRateLimiter({ storage });
  assert.equal((await object.fetch(new Request("https://internal/other"))).status, 404);
  for (const body of ["null", "{}", '{"shortLimit":0,"hourLimit":20}', '{"shortLimit":5,"hourLimit":20,"email":"person@example.com"}']) {
    assert.equal((await object.fetch(new Request("https://internal/reserve", { method: "POST", body }))).status, 400);
  }
});

test("Retry-After supports safe delta seconds and HTTP dates without polling or arbitrary waits", () => {
  const now = Date.UTC(2026, 9, 31);
  assert.equal(retryAfterDelay("600", now), 600000);
  assert.equal(retryAfterDelay(new Date(now + 60000).toUTCString(), now), 60000);
  for (const header of [null, "", "-1", "1.5", "invalid", "99999999999999999", new Date(now - 1000).toUTCString()]) assert.equal(retryAfterDelay(header, now), 0);
});

test("localized rate feedback exists in all four languages", () => {
  for (const language of ["en", "de", "nl", "es"]) {
    const locale = JSON.parse(readFileSync(new URL(`../src/i18n/locales/${language}.json`, import.meta.url), "utf8"));
    assert(locale.newsletter.rateLimited.length > 20);
    assert.equal(locale.newsletter.rateLimited, locale.wholesale.errors.rateLimited);
    assert(locale.newsletter.consent && locale.wholesale.consent);
  }
});
