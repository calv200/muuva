---
name: muuva-form-safety
description: "Use when creating or auditing MUUVA Contact Us, Wholesale, Newsletter, Cloudflare Pages Functions, Turnstile, HMAC Durable Object rate limiting and Brevo mail sending."
---
# MUUVA form safety
1. Inspect `functions/api/wholesale.js`, `functions/api/newsletter.js`, `functions/_lib/forms.js`, `functions/_lib/rate-limit.js`, and Worker config first.
2. A general Contact Us form gets its own endpoint, action and rate bucket; reuse the reviewed architecture but do not turn enquiries into newsletter subscriptions.
3. Preserve POST only, exact approved origin/hostname, JSON size/field allowlist, per-field length caps, fixed sender+recipient, verified Turnstile hostname+action, safe Reply-To, escaped plaintext/HTML, timeouts, neutral status/error handling and 429 Retry-After.
4. Continue fail-closed behavior if DO binding, secret, scope or configuration missing. Extend limiter allowed endpoint without breaking the previous `newsletter`/`wholesale` buckets and quotas.
5. Use mocks/fixtures, never actual production submissions or real API keys. Do not log names, email addresses, inquiry contents, IPs, tokens, secrets or full upstream bodies.
6. Owner must review new production/preview flags, Brevo permissions and privacy-policy notice before activation. No deploy or dashboard changes.
