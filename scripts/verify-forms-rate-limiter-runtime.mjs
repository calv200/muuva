import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

// Use Miniflare from the operator's existing Wrangler installation; no account access.
const modulePath = process.argv[2];
if (!modulePath) throw new Error("Pass the path to Miniflare's dist/src/index.js from your local Wrangler installation.");
const { Miniflare, convertV4MiniflareOptions = (options) => options } = await import(pathToFileURL(path.resolve(modulePath)).href);
const source = readFileSync(new URL("../workers/forms-rate-limiter/index.js", import.meta.url), "utf8");
// Inspection and expiry-seeding routes exist only in this local test subclass.
const probe = source + `
export class Probe extends FormRateLimiter {
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path === "/run-alarm") {
      await this.alarm();
      return new Response(null, { status: 204 });
    }
    if (path === "/state") return Response.json(await this.ctx.storage.get("attempts") || []);
    if (path === "/seed-expired") {
      await reserveAttempt(this.ctx.storage, { shortLimit: 5, hourLimit: 20 }, Date.now() - 3600000 - 1000);
      return new Response(null, { status: 204 });
    }
    return super.fetch(request);
  }
}`;
const mf = new Miniflare(convertV4MiniflareOptions({ workers: [{
  name: "muuva-local-limiter-test", modules: true, script: probe,
  compatibilityDate: "2026-10-30",
  durableObjects: { FORMS_RATE_LIMITER: { className: "Probe", useSQLite: true } },
}] }));
try {
  const namespace = await mf.getDurableObjectNamespace("FORMS_RATE_LIMITER");
  const stub = namespace.get(namespace.idFromName("concurrent-test"));
  const reserve = () => stub.fetch("https://local/reserve", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shortLimit: 5, hourLimit: 20 }),
  });
  const responses = await Promise.all(Array.from({ length: 8 }, reserve));
  assert.equal(responses.filter((response) => response.status === 204).length, 5);
  assert.equal(responses.filter((response) => response.status === 429).length, 3);
  assert.equal((await (await stub.fetch("https://local/state")).json()).length, 5);
  assert(responses.filter((response) => response.status === 429).every((response) => Number(response.headers.get("Retry-After")) > 0));
  const expiring = namespace.get(namespace.idFromName("alarm-test"));
  assert.equal((await expiring.fetch("https://local/seed-expired", { method: "POST" })).status, 204);
  assert.equal((await expiring.fetch("https://local/run-alarm", { method: "POST" })).status, 204);
  assert.deepEqual(await (await expiring.fetch("https://local/state")).json(), []);
  assert.equal((await mf.dispatchFetch("http://local/")).status, 404);
  console.log("Real local workerd SQLite: eight concurrent reservations admitted exactly five; three received 429; expiry alarm handler removed expired state; public Worker returns 404.");
} finally { await mf.dispose(); }
