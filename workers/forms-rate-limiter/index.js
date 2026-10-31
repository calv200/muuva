const hourMs = 60 * 60 * 1000;
const tenMinutesMs = 10 * 60 * 1000;

export function evaluateAttempts(attempts, { shortLimit, hourLimit }, now) {
  // Never move the admission clock backwards if the host clock is adjusted.
  now = Math.max(now, attempts.at(-1) || 0);
  const active = attempts.filter((timestamp) => timestamp > now - hourMs);
  let retryAt = now;
  for (const [limit, window] of [[shortLimit, tenMinutesMs], [hourLimit, hourMs]]) {
    const recent = active.filter((timestamp) => timestamp > now - window);
    if (recent.length >= limit) retryAt = Math.max(retryAt, recent[recent.length - limit] + window);
  }
  const retryAfter = Math.ceil((retryAt - now) / 1000);
  return { retryAfter, attempts: retryAfter ? active : [...active, now] };
}

export async function reserveAttempt(storage, policy, now = Date.now()) {
  // SQLite-backed Durable Object storage: read, decision, write and alarm commit atomically.
  return storage.transaction(async () => {
    const previous = await storage.get("attempts") || [];
    if (!Array.isArray(previous) || previous.length > 1000 || previous.some((value, index) => !Number.isSafeInteger(value) || value < 0 || (index && value < previous[index - 1]))) throw new Error("invalid_counter");
    const decision = evaluateAttempts(previous, policy, now);
    if (!decision.retryAfter) {
      await storage.put("attempts", decision.attempts);
      await storage.setAlarm(decision.attempts.at(-1) + hourMs);
    }
    return decision.retryAfter;
  });
}

export async function expireAttempts(ctx, now = Date.now()) {
  // deleteAll cannot run inside a storage transaction. Serialize only this short
  // alarm cleanup against new requests; no network I/O is performed in the gate.
  await ctx.blockConcurrencyWhile(async () => {
    const storage = ctx.storage;
    const attempts = await storage.get("attempts");
    const expiry = attempts?.at(-1) + hourMs;
    if (!attempts?.length || expiry <= now) await storage.deleteAll();
    else await storage.setAlarm(expiry);
  });
}

export class FormRateLimiter {
  constructor(ctx) { this.ctx = ctx; }

  async fetch(request) {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/reserve") return new Response(null, { status: 404 });
    try {
      const policy = await request.json();
      if (!policy || Object.keys(policy).sort().join(",") !== "hourLimit,shortLimit"
        || ![policy.shortLimit, policy.hourLimit].every((value) => Number.isInteger(value) && value >= 1 && value <= 1000)) return new Response(null, { status: 400 });
      const retryAfter = await reserveAttempt(this.ctx.storage, policy);
      return retryAfter ? new Response(null, { status: 429, headers: { "Retry-After": String(retryAfter) } }) : new Response(null, { status: 204 });
    } catch { return new Response(null, { status: 503 }); }
  }

  async alarm() {
    await expireAttempts(this.ctx);
  }
}

// Namespace access is through the Pages binding. No public HTTP limiter service.
export default { fetch() { return new Response(null, { status: 404 }); } };
