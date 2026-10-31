# Pass C.3.1 — Forms security and rate limiting

Review implementation on `staging`, 31 October 2026. The owner reports Newsletter and Wholesale are deployed to Preview; no account configuration or deployed commit was inspected here. This pass creates no external resource, changes no Cloudflare setting and performs no deployment. **Live enforcement remains inactive until the owner creates and binds the Durable Object resource and explicitly selects `enforce`.**

## Audit findings

| Finding | Correction or retained safeguard |
| --- | --- |
| Fresh Turnstile tokens allow repeated submissions without an application request quota. | Add durable admission checks before reading form bodies or calling either upstream service. |
| Newsletter relies on a React loading state for its concurrency guard and has no browser request deadline. | Add an immediate in-flight reference, cancellation on unmount and a 20-second deadline, matching Wholesale. |
| Neither browser form handles `429` or `Retry-After`. A refreshed Newsletter challenge can erase failure feedback. | Add localized rate feedback, retain data, defer manual retries and preserve non-challenge errors when tokens refresh. |
| Newsletter accepts a MIME prefix such as `application/jsonp`. | Require the exact JSON media type, allowing normal parameters, as Wholesale already does. |
| No account-wide budget or distributed-attack protection is established. | Per-network limits complement Turnstile; they do not solve botnets, IP rotation, DDoS or overall account exhaustion. |

Existing protections are retained: POST and runtime activation checks, exact configured origin/host, bounded JSON and allowed fields/languages, required consent and validation, upstream timeouts and safe responses. Turnstile must succeed with the correct hostname and action; its single-use/replay checks remain provider-enforced. Newsletter still calls only the DOI endpoint with list `3` and templates EN `2`, DE `3`, NL `4`, ES `5`; its neutral public receipt for Brevo `201`/`400`/`409` remains unchanged. No direct contact creation or subscriber-state disclosure is added. Wholesale still uses a fixed configured recipient/sender, validated Reply-To, escaped HTML/plain text and a fixed subject; only a Brevo `201` produces its existing accepted state. No enquiry or subscriber values enter analytics, rate records or new logs.

The master brief, CONTENT and handoff contain older no-form descriptions and counts. Current source is authoritative: 44 localized pages and two form endpoints. Those master documents and public Privacy drafts remain unchanged, pending C.3.3 synchronization and review.

## Architecture decision and evidence

| Option | Pages / staging coverage and guarantee | Decision |
| --- | --- | --- |
| WAF rate rules | Zone rules on a proxied custom domain do not establish coverage for the separate `staging.muuva.pages.dev` hostname. Available windows/rule counts depend on the WAF plan. | Potential extra custom-domain protection; insufficient as the shared application mechanism. |
| Workers Rate Limiting API | Cloudflare documents approximate counters per location, eventual synchronization and 10/60-second periods. A direct rate-limit binding is not listed in the current Pages binding reference. A helper Worker would retain these approximate guarantees. | Does not provide the selected strict rolling windows. |
| Pages binding to a SQLite Durable Object exported by a Worker | Pages explicitly supports external Durable Object namespaces. All reservations for one object use the same authoritative transactional storage across locations. It applies inside each Function, including the recognized `pages.dev` origin. | Selected: one namespace binding, no HTTP helper service or separate database. |
| Workers KV / process counters | KV read-modify-write is not atomic; isolate memory is neither shared nor durable. | Not used. |

Compatibility references: [Pages bindings and local DO development](https://developers.cloudflare.com/pages/functions/bindings/#durable-objects), [Workers rate-limit locality/accuracy](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), [Pages custom-domain differences](https://developers.cloudflare.com/pages/configuration/debugging-pages/#differences-between-pagesdev-and-custom-domains), [WAF availability](https://developers.cloudflare.com/waf/rate-limiting-rules/#availability). No claim is made that this account has a particular WAF plan or any rules enabled.

The Worker configuration at `workers/forms-rate-limiter/wrangler.jsonc` exports `FormRateLimiter` with a SQLite migration, compatibility date `2026-10-30`, and public Worker/preview URLs disabled. Its default HTTP handler returns `404`; it is not a public proxy for spending another visitor's allowance. Pages calls the namespace directly. Cloudflare requires a separately deployed Worker to export a DO class; a Pages project cannot deploy that class itself. Creating that Worker/namespace is an **owner dependency**, not an action performed by this pass.

## Enforcement contract

For each valid-origin POST to an enabled form, admission precedes payload parsing and Siteverify/Brevo. Malformed form payloads and failed challenges therefore consume an admitted attempt. Methods other than POST, disabled endpoints and rejected origins do not reserve an attempt. An admission never bypasses subsequent validation or Turnstile.

The initial policy is five admitted attempts over a rolling ten minutes and twenty over a rolling hour, separately for Newsletter and Wholesale. Windows use `(now - window, now]`; they do not reset at wall-clock bucket boundaries. A transaction reads the previous timestamps, evaluates both limits, and atomically persists an admitted timestamp plus its cleanup alarm. All locations use the same object for a given client/endpoint/scope. No module-memory or non-atomic KV quota is substituted. Denied attempts are not appended and do not extend the block. This bounds upstream attempts, rather than every rejected HTTP request; persistent rejections still require a DO read.

If either limit is reached, return `429 {"code":"rate_limited"}` and an integer `Retry-After` of 1–3600 seconds, calculated from when both limits next permit admission in the absence of competing requests. Concurrent requests from the same shared network can use that capacity first; the header is not a reservation. Neither upstream is called for a rejection. Limits are independent of email and enquiry content, preserving Newsletter enumeration protection.

Mode unset or `off` deliberately preserves the existing deployment without rate enforcement. It is not an automatic fallback from an error. `enforce` requires every binding/secret/configuration and a validated Cloudflare client address; any missing dependency, malformed limiter reply, storage failure or 1.5-second limiter deadline returns generic `503`, without upstream calls. Unknown/empty mode values fail closed too. No mode claims enforcement when the resource is absent.

A cleanup alarm deletes all object storage once the last admitted timestamp is an hour old. Admission also discards expired timestamps, so delayed cleanup cannot prolong a block. SQLite `deleteAll()` cannot run in a transaction; the alarm uses a short `blockConcurrencyWhile` gate around only local storage cleanup, preventing deletion of a newer reservation. Ordinary admission uses storage transactions. See [SQLite storage transactions/deletion](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) and [Durable Object concurrency guidance](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/).

## Client identity, privacy and diagnostics

Only a syntactically valid `CF-Connecting-IP` on a Cloudflare-context request is used, after the existing origin/host checks. IPv6 spelling is canonicalized. `X-Forwarded-For`, `X-Real-IP`, arbitrary caller IDs and email addresses are never fallback identities. Missing platform identity fails closed in `enforce`; local Node tests explicitly supply synthetic Cloudflare metadata. A local emulator is not an authenticated Internet proxy.

Cloudflare's [header reference](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip) documents special Worker-subrequest behavior and Pseudo IPv4. Keep same-zone Workers trusted, avoid a different untrusted ingress/CDN, and review any visitor-IP-removal/Pseudo IPv4 setting before activation. Cross-zone Workers can share Cloudflare's special address and consequently share an allowance. The code does not infer identity from user-controlled forwarding headers to work around these cases.

The Function HMACs the canonical address using a dedicated server secret and a domain-separated string containing scope and endpoint. Only the HMAC digest plus nonpersonal version/scope/endpoint names determine the object name. The private DO request contains only the two numeric thresholds; its stored `attempts` value contains only admission timestamps, at most 1,000. No submitted body, token, address or credential is forwarded to the DO or written to application logs.

The identifier is **pseudonymous, not anonymous**: it is deterministic until the secret changes, and the operator holding the secret can test an address. Raw IP processing still occurs at Cloudflare ingress and during HMAC calculation. Active counts have one-hour logical expiry; alarms schedule deletion after that period, but retries/outages can delay physical cleanup. Namespace metadata, operational logs and SQLite backup/PITR retention are separate provider concerns; this pass does not establish immediate backup erasure, EU-only storage or account-specific retention. Review these processing details, access controls, applicable agreements and the legitimate security purpose for the upcoming Privacy notice. No new browser cookie or stored visitor identifier is introduced.

New diagnostics log only `forms.rate_limit` with fixed `endpoint`, safe `category` and numeric `status` for throttling/configuration/dependency failures. Allowed/off requests are not logged by this helper. Categories are `throttled`, `configuration`, `client_identity_unavailable`, `limiter_unavailable`, `invalid_limiter_response`. No exception text, digest, raw IP, form values or upstream bodies are logged. Existing allowlisted Preview Brevo diagnostics are retained. Platform request logs are outside this application-log claim and still require owner review.

## Configuration and owner rollout

No Pages Wrangler configuration is added or substituted for the existing dashboard convention. Configure the following **Preview runtime** bindings only after approving the resource:

| Name | Type | Value / missing behavior |
| --- | --- | --- |
| `FORMS_RATE_LIMITER` | Durable Object namespace binding | Namespace exporting `FormRateLimiter` from `muuva-forms-rate-limiter-preview`. Missing causes `503` in enforce mode. |
| `FORMS_RATE_LIMIT_HASH_SECRET` | Secret | Dedicated high-entropy secret, at least 32 characters, maximum 256; generate independently of Brevo/Turnstile secrets and keep out of Git. Missing/invalid causes `503`. |
| `FORMS_RATE_LIMIT_SCOPE` | Plain runtime string | `preview`; required lowercase letters/digits/hyphens, 1–32 characters. Missing/invalid causes `503`. |
| `FORMS_RATE_LIMIT_MODE` | Plain runtime string | Initially unset or `off`; explicitly `enforce` after binding verification. Any other value is invalid and returns `503`. |
| `FORMS_RATE_LIMIT_10M` | Optional plain runtime string | Default `5`; integer `1`–`1000`. |
| `FORMS_RATE_LIMIT_1H` | Optional plain runtime string | Default `20`; integer `1`–`1000`. |

Both thresholds apply independently to each endpoint; adjust them together with real shared-network experience. A studio, office, mobile carrier or privacy proxy can share one IP among legitimate visitors. Five attempts per ten minutes is an initial conservative policy for controlled testing, not a proven production allowance. Different addresses, including changing IPv6 privacy addresses, can obtain separate allowances. No persistent cookie/fingerprint is added to try to defeat that limitation.

Owner sequence:

1. Confirm Workers/DO availability, quotas and costs for the account. Approve creation of the separate Preview Worker and its SQLite namespace using the supplied Worker configuration. Do not change the Production Worker/Pages environment.
2. In the Pages project's **Preview** bindings, add Durable Object variable `FORMS_RATE_LIMITER`, selecting that exported namespace. Add the Preview-only hash secret, scope and optional thresholds; leave mode `off` initially. Do not attach a production namespace here.
3. The owner deploys the reviewed source to Preview with the bindings and verifies the existing forms still work. Binding changes require a new Pages deployment. This pass has not performed either deployment.
4. The owner changes Preview mode to `enforce`, redeploys and runs the controlled checklist below. A missing binding or quota failure must produce `503`, never a silent bypass.
5. Keep all Production activation flags/settings unchanged. Production needs separate approval, a separately named Worker/namespace, a different hash secret and scope `production`, reviewed thresholds, Privacy/operational review and an independently verified binding. The provided Worker config names only Preview.

Cloudflare documents [DO Free/Paid pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/): SQLite DOs are available on Workers Free, within daily limits; paid usage can incur compute/storage charges. No paid feature is inherently required by this design, but free limits can be exhausted and then operations fail. Each check, alarm and retained SQLite data has operational cost; review current quotas rather than assuming this is unmetered. No external database/vendor account is added.

## Browser retry behavior

Both forms display brief EN/DE/NL/ES rate feedback by HTTP status, even for a non-JSON `429` body. Valid `Retry-After` delta seconds or canonical HTTP dates up to one day defer submission using one local timer; invalid, absent, past or unreasonable values do not start a guessed countdown. The timer never submits or polls. An immediate deadline reference also guards programmatic repeated submits before React updates. Fields/consent remain in memory, with no localStorage or URL persistence. Turnstile is reset after rejection and again when a deferred retry becomes available, so the visitor must use a fresh challenge/token. Existing button styles and form layouts/copy remain unchanged except the new inline message.

## Verification and evidence limits

Automated Node tests use fake clocks, transactional storage doubles and mocked upstreams. They cover below/over threshold, independent endpoint/scope keys, rolling/hourly expiry, concurrent admission, no calls to either upstream after rejection, mandatory/off/error behavior, validated platform identity, IPv6 normalization, safe diagnostics, challenge/consent preservation, protocol validation, retry-header parsing and four-language feedback. Existing form, privacy, localization, routing and production-verifier tests remain required. The storage double tests logic against the documented transaction contract; it cannot prove account-level consistency or activation.

A separate local Miniflare/workerd SQLite check exercises the real storage transaction: eight simultaneous calls admit five and return three `429` responses with retry headers. It also invokes the real expiry alarm handler against expired state and checks the host Worker's `404` response. That test uses a local-only subclass for inspection/expiry seeding; no inspection route is present in deployed source. It validates the alarm handler, not live Cloudflare alarm delivery or an active Pages binding. The compatibility date matches the installed runtime's supported `2026-10-30` date.

The reusable check is `scripts/verify-forms-rate-limiter-runtime.mjs`. Run `node scripts/verify-forms-rate-limiter-runtime.mjs <path-to-miniflare/dist/src/index.js>` using the Miniflare supplied by the existing local Wrangler installation. It supports the installed Miniflare 5 adapter and the version 4 options format. No runtime/test dependency or account access is added to the application. This review used Wrangler `4.156.0` / Miniflare `5.20261023.3-beta` locally.

Required final checks: `npm test`, `npm run build`, `npm run test:production`, `git diff --check`; compile Pages Functions using the existing local Wrangler workflow, and package the DO Worker with a local dry run. Browser checks use mocked Turnstile/API responses; they must verify rate feedback in all languages, retained data, both independent cooldowns, no automatic retries, fresh tokens on manual retry, success/failure and newsletter concurrency. No real Brevo call or email is part of these automated checks.

Results on 31 October 2026: all **103 Node tests passed**, including under the enabled root-hosted staging build environment. Default and enabled staging builds passed production verification for **44 localized pages**. Pages Functions compiled successfully; the DO Worker packaged successfully with Wrangler's `--dry-run`. The real local runtime check passed as described above. Chromium passed both forms' rate feedback in EN/DE/NL/ES at desktop/mobile widths, including non-JSON `429` responses, delta-second and HTTP-date headers, retained fields/consent, independent disabled states, no automatic requests, fresh tokens after accelerated cooldowns, duplicate-submit prevention and both existing accepted states. No page/hydration errors occurred; Spanish mobile feedback was visually reviewed with no overflow. All four locale catalogs have no duplicate keys, and comparison with HEAD confirmed only the two new message values were added. `git diff --check` passed. Existing parallel-Vite HMR port warnings did not fail the Node suite. These results do not prove live enforcement or email delivery.

For repeatable local namespace checks, Cloudflare documents running `wrangler dev` for the separate Worker and `wrangler pages dev dist --do FORMS_RATE_LIMITER=FormRateLimiter@muuva-forms-rate-limiter-preview` for Pages. Supply nonproduction local bindings in ignored `.dev.vars` files and keep test traffic on localhost. The installed Wrangler binary can also compile `pages functions build --outdir <temporary-directory>` and package the Worker with `deploy --dry-run --config workers/forms-rate-limiter/wrangler.jsonc --outdir <temporary-directory>`; the latter is packaging only, not a deployment command executed against an account. Existing `npm run dev` / `preview` serve only frontend files.

## Controlled Preview checklist and Production gate

- Inspect the actual Preview deployment/binding and mode. Do not infer enforcement from mocked tests or a successful build.
- Use one controlled browser/network and one endpoint. Five valid-origin dummy JSON submissions that fail payload validation should return `400`; the sixth should return `429` with decreasing `Retry-After`. These invalid payloads must not reach either upstream. Do not run load tests.
- Confirm the other endpoint has its own allowance. Check retry after the window, not repeated polling; confirm no permanent block and no history extension from denied requests.
- Check malformed/missing mandatory config and a controlled dependency failure return safe `503` with no upstream call. Inspect only safe status/category logs, never print environment bindings or captured bodies.
- Check shared-network usability, changing language, expired challenges, stored field/consent state, failed submissions and manual retry with a new token. After the quota window, perform only a separately approved real newsletter/enquiry delivery test.
- Confirm Production is unchanged; finalize privacy/controller/provider/retention review, limits, operational monitoring, resource costs, separate namespace/secrets and rollback ownership before any Production activation.

Staging is ready for a controlled **local** test of this code. A controlled **hosted enforcement** test is blocked on owner creation/deployment of the external Worker/namespace, the Preview binding/secret and Preview deployment with `enforce`. No account-level enforcement is claimed.

## Rollback and C.3.3 handoff

Owner rollback is explicit: set Preview mode to `off` and redeploy to restore the prior no-limiter behavior, or redeploy the preceding reviewed bundle. During active abuse, disabling the individual form submission flag is safer than removing its quota. No automatic error path turns enforcement off. Do not delete namespaces, undo migrations or rotate the hash secret as an incident shortcut: rotation changes every identifier and resets allowances; old counters still follow their expiry. Leave Production untouched.

Files added: `functions/_lib/rate-limit.js`, `workers/forms-rate-limiter/index.js`, `workers/forms-rate-limiter/wrangler.jsonc`, `src/forms/retry.js`, `tests/forms-security.test.js`, `scripts/verify-forms-rate-limiter-runtime.mjs` and this document. Files changed: both API endpoints, `functions/_lib/forms.js`, both form components, all four locale catalogs, and the Newsletter MIME regression test. No page/image/layout, route, deployment workflow or master project document is changed.

C.3.3 must synchronize the master brief/content/handoff and Privacy review with the verified deployment, chosen resource/region, IP-derived pseudonymous identifiers, logical expiry versus provider retention, operational failure policy and actual activation state. This review is technical implementation evidence, not legal or native-language approval.
