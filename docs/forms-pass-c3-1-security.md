# Pass C.3.1 — Forms security and rate limiting

Implementation review and staging-validation documentation closure on `staging`, 31 October 2026.

**Pass C.3.1 — Core security implementation and hosted rate-limiting enforcement validated on staging. Production readiness remains subject to operational, regression and privacy review.**

The Cloudflare configuration/deployment observations below are owner-reported and supported by Cloudflare dashboard screenshots described in the closure handoff; the live request results are owner-reported browser-console observations. Codex performed no fresh authenticated Cloudflare inspection or new live requests during this documentation closure. Local Git inspection found a clean `staging` working tree at `1baaa5b837bdeb8b5d20aa6a17a72c56e6cb9cfd`, matching the reported deployed source commit; this confirms local Git state, not an independent inspection of the Cloudflare deployment. This closure changes only this document, creates no resource, changes no account setting and performs no deployment.

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

The Worker configuration at `workers/forms-rate-limiter/wrangler.jsonc` exports `FormRateLimiter` with a SQLite migration, compatibility date `2026-10-30`, and public Worker/preview URLs disabled. Its default HTTP handler returns `404`; it is not a public proxy for spending another visitor's allowance. Pages calls the namespace directly. Cloudflare requires a separately deployed Worker to export a DO class; a Pages project cannot deploy that class itself. The owner has now reported the separate Preview Worker/namespace ready and bound, as recorded below. Separate Production infrastructure remains pending. Codex did not create or deploy either resource.

## Enforcement contract

For each valid-origin POST to an enabled form, admission precedes payload parsing and Siteverify/Brevo. Malformed form payloads and failed challenges therefore consume an admitted attempt. Methods other than POST, disabled endpoints and rejected origins do not reserve an attempt. An admission never bypasses subsequent validation or Turnstile.

The initial policy is five admitted attempts over a rolling ten minutes and twenty over a rolling hour, separately for Newsletter and Wholesale. Windows use `(now - window, now]`; they do not reset at wall-clock bucket boundaries. A transaction reads the previous timestamps, evaluates both limits, and atomically persists an admitted timestamp plus its cleanup alarm. All locations use the same object for a given client/endpoint/scope. No module-memory or non-atomic KV quota is substituted. Denied attempts are not appended and do not extend the block. This bounds upstream attempts, rather than every rejected HTTP request; persistent rejections still require a DO read.

If either limit is reached, return `429 {"code":"rate_limited"}` and an integer `Retry-After` of 1–3600 seconds, calculated from when both limits next permit admission in the absence of competing requests. Concurrent requests from the same shared network can use that capacity first; the header is not a reservation. Neither upstream is called for a rejection. Limits are independent of email and enquiry content, preserving Newsletter enumeration protection.

Mode unset or `off` deliberately preserves the existing deployment without rate enforcement. It is not an automatic fallback from an error. `enforce` requires every binding/secret/configuration and a validated Cloudflare client address; any missing dependency, malformed limiter reply, storage failure or 1.5-second limiter deadline returns generic `503`, without upstream calls. Unknown/empty mode values fail closed too. No mode claims enforcement when the resource is absent.

A cleanup alarm deletes all object storage once the last admitted timestamp is an hour old. Admission also discards expired timestamps, so delayed cleanup cannot prolong a block. SQLite `deleteAll()` cannot run in a transaction; the alarm uses a short `blockConcurrencyWhile` gate around only local storage cleanup, preventing deletion of a newer reservation. Ordinary admission uses storage transactions. See [SQLite storage transactions/deletion](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) and [Durable Object concurrency guidance](https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/).

## Client identity, privacy and diagnostics

Only a syntactically valid `CF-Connecting-IP` on a Cloudflare-context request is used, after the existing origin/host checks. IPv6 spelling is canonicalized. `X-Forwarded-For`, `X-Real-IP`, arbitrary caller IDs and email addresses are never fallback identities. Missing platform identity fails closed in `enforce`; local Node tests explicitly supply synthetic Cloudflare metadata. A local emulator is not an authenticated Internet proxy.

Cloudflare's [header reference](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip) documents special Worker-subrequest behavior and Pseudo IPv4. Keep same-zone Workers trusted, avoid a different untrusted ingress/CDN, and include any visitor-IP-removal/Pseudo IPv4 setting in the remaining operational review and before Production activation. Cross-zone Workers can share Cloudflare's special address and consequently share an allowance. The code does not infer identity from user-controlled forwarding headers to work around these cases.

The Function HMACs the canonical address using a dedicated server secret and a domain-separated string containing scope and endpoint. Only the HMAC digest plus nonpersonal version/scope/endpoint names determine the object name. The private DO request contains only the two numeric thresholds; its stored `attempts` value contains only admission timestamps, at most 1,000. No submitted body, token, address or credential is forwarded to the DO or written to application logs.

The identifier is **pseudonymous, not anonymous**: it is deterministic until the secret changes, and the operator holding the secret can test an address. Raw IP processing still occurs at Cloudflare ingress and during HMAC calculation. Active counts have one-hour logical expiry; alarms schedule deletion after that period, but retries/outages can delay physical cleanup. Namespace metadata, operational logs and SQLite backup/PITR retention are separate provider concerns; this pass does not establish immediate backup erasure, EU-only storage or account-specific retention. Review these processing details, access controls, applicable agreements and the legitimate security purpose for the upcoming Privacy notice. No new browser cookie or stored visitor identifier is introduced.

New diagnostics log only `forms.rate_limit` with fixed `endpoint`, safe `category` and numeric `status` for throttling/configuration/dependency failures. Allowed/off requests are not logged by this helper. Categories are `throttled`, `configuration`, `client_identity_unavailable`, `limiter_unavailable`, `invalid_limiter_response`. No exception text, digest, raw IP, form values or upstream bodies are logged. Existing allowlisted Preview Brevo diagnostics are retained. Platform request logs are outside this application-log claim and still require owner review.

## Configuration reference and owner rollout

No Pages Wrangler configuration is added or substituted for the existing dashboard convention. The owner has completed the Preview resource/binding setup recorded in the hosted-validation section below. The following table preserves the configuration contract and missing-value behavior:

| Name | Type | Value / missing behavior |
| --- | --- | --- |
| `FORMS_RATE_LIMITER` | Durable Object namespace binding | Namespace exporting `FormRateLimiter` from `muuva-forms-rate-limiter-preview`. Missing causes `503` in enforce mode. |
| `FORMS_RATE_LIMIT_HASH_SECRET` | Secret | Dedicated high-entropy secret, at least 32 characters, maximum 256; generate independently of Brevo/Turnstile secrets and keep out of Git. Missing/invalid causes `503`. |
| `FORMS_RATE_LIMIT_SCOPE` | Plain runtime string | `preview`; required lowercase letters/digits/hyphens, 1–32 characters. Missing/invalid causes `503`. |
| `FORMS_RATE_LIMIT_MODE` | Plain runtime string | Current owner-reported Preview value: `enforce`. Unset or `off` disables enforcement explicitly; any other value is invalid and returns `503`. |
| `FORMS_RATE_LIMIT_10M` | Optional plain runtime string | Default `5`; integer `1`–`1000`. |
| `FORMS_RATE_LIMIT_1H` | Optional plain runtime string | Default `20`; integer `1`–`1000`. |

Both thresholds apply independently to each endpoint; adjust them together with real shared-network experience. A studio, office, mobile carrier or privacy proxy can share one IP among legitimate visitors. Five attempts per ten minutes is an initial conservative policy for controlled testing, not a proven production allowance. Different addresses, including changing IPv6 privacy addresses, can obtain separate allowances. No persistent cookie/fingerprint is added to try to defeat that limitation.

Owner rollout procedure retained for reference and future configuration changes; it is not a list of outstanding Preview resource dependencies. The final Preview setup/deployment is reported complete below, while normal valid-submission regression testing remains pending:

1. Confirm Workers/DO availability, quotas and costs for the account. Approve creation of the separate Preview Worker and its SQLite namespace using the supplied Worker configuration. Do not change the Production Worker/Pages environment.
2. In the Pages project's **Preview** bindings, add Durable Object variable `FORMS_RATE_LIMITER`, selecting that exported namespace. Add the Preview-only hash secret, scope and optional thresholds; leave mode `off` initially. Do not attach a production namespace here.
3. The owner deploys the reviewed source to Preview with the bindings and verifies the existing forms still work. Binding changes require a new Pages deployment. The owner-reported enforcement deployment is recorded below; valid-submission regressions under enforced limits are not established by its invalid-payload tests.
4. The owner changes Preview mode to `enforce`, redeploys and runs the controlled checklist below. A missing binding or quota failure must produce `503`, never a silent bypass.
5. Keep all Production activation flags/settings unchanged. Production needs separate approval, a separately named Worker/namespace, a different hash secret and scope `production`, reviewed thresholds, Privacy/operational review and an independently verified binding. The provided Worker config names only Preview.

Cloudflare documents [DO Free/Paid pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/): SQLite DOs are available on Workers Free, within daily limits; paid usage can incur compute/storage charges. No paid feature is inherently required by this design, but free limits can be exhausted and then operations fail. Each check, alarm and retained SQLite data has operational cost; review current quotas rather than assuming this is unmetered. No external database/vendor account is added.

## Browser retry behavior

Both forms display brief EN/DE/NL/ES rate feedback by HTTP status, even for a non-JSON `429` body. Valid `Retry-After` delta seconds or canonical HTTP dates up to one day defer submission using one local timer; invalid, absent, past or unreasonable values do not start a guessed countdown. The timer never submits or polls. An immediate deadline reference also guards programmatic repeated submits before React updates. Fields/consent remain in memory, with no localStorage or URL persistence. Turnstile is reset after rejection and again when a deferred retry becomes available, so the visitor must use a fresh challenge/token. Existing button styles and form layouts/copy remain unchanged except the new inline message.

## Verification and evidence limits

Automated Node tests use fake clocks, transactional storage doubles and mocked upstreams. They cover below/over threshold, independent endpoint/scope keys, rolling/hourly expiry, concurrent admission, no calls to either upstream after rejection, mandatory/off/error behavior, validated platform identity, IPv6 normalization, safe diagnostics, challenge/consent preservation, protocol validation, retry-header parsing and four-language feedback. Existing form, privacy, localization, routing and production-verifier tests remain required. The storage double tests logic against the documented transaction contract; it cannot prove account-level consistency or activation.

A separate local Miniflare/workerd SQLite check exercises the real storage transaction: eight simultaneous calls admit five and return three `429` responses with retry headers. It also invokes the real expiry alarm handler against expired state and checks the host Worker's `404` response. That test uses a local-only subclass for inspection/expiry seeding; no inspection route is present in deployed source. It validates the alarm handler, not live Cloudflare alarm delivery or an active Pages binding. The compatibility date matches the installed runtime's supported `2026-10-30` date.

The reusable check is `scripts/verify-forms-rate-limiter-runtime.mjs`. Run `node scripts/verify-forms-rate-limiter-runtime.mjs <path-to-miniflare/dist/src/index.js>` using the Miniflare supplied by the existing local Wrangler installation. It supports the installed Miniflare 5 adapter and the version 4 options format. No runtime/test dependency or account access is added to the application. This review used Wrangler `4.156.0` / Miniflare `5.20261023.3-beta` locally.

Original application-verification sequence: `npm test`, `npm run build`, `npm run test:production`, `git diff --check`; compile Pages Functions using the existing local Wrangler workflow, and package the DO Worker with a local dry run. Browser checks use mocked Turnstile/API responses; they must verify rate feedback in all languages, retained data, both independent cooldowns, no automatic retries, fresh tokens on manual retry, success/failure and newsletter concurrency. No real Brevo call or email is part of these automated checks. This documentation-only closure requires diff/Markdown review, not a rerun of application tests or builds.

Previously recorded local results on 31 October 2026: all **103 Node tests passed**, including under the enabled root-hosted staging build environment. Default and enabled staging builds passed production verification for **44 localized pages**. Pages Functions compiled successfully; the DO Worker packaged successfully with Wrangler's `--dry-run`. The real local runtime check passed as described above. Chromium passed both forms' rate feedback in EN/DE/NL/ES at desktop/mobile widths, including non-JSON `429` responses, delta-second and HTTP-date headers, retained fields/consent, independent disabled states, no automatic requests, fresh tokens after accelerated cooldowns, duplicate-submit prevention and both existing accepted states. No page/hydration errors occurred; Spanish mobile feedback was visually reviewed with no overflow. All four locale catalogs have no duplicate keys, and comparison with the then-current HEAD confirmed only the two new message values were added. `git diff --check` passed. Existing parallel-Vite HMR port warnings did not fail the Node suite. These local results alone do not prove hosted enforcement or email delivery; the separate owner-reported hosted evidence follows. Application tests and builds were not rerun for this documentation-only closure.

For repeatable local namespace checks, Cloudflare documents running `wrangler dev` for the separate Worker and `wrangler pages dev dist --do FORMS_RATE_LIMITER=FormRateLimiter@muuva-forms-rate-limiter-preview` for Pages. Supply nonproduction local bindings in ignored `.dev.vars` files and keep test traffic on localhost. The installed Wrangler binary can also compile `pages functions build --outdir <temporary-directory>` and package the Worker with `deploy --dry-run --config workers/forms-rate-limiter/wrangler.jsonc --outdir <temporary-directory>`; the latter is packaging only, not a deployment command executed against an account. Existing `npm run dev` / `preview` serve only frontend files.

## Hosted Preview deployment and live validation — owner-reported

The owner reports the following final Preview configuration and successful deployment on **31 October 2026**, supported by Cloudflare dashboard screenshots. This is a record of that evidence, not a fresh authenticated inspection by Codex. Production configuration is reported unchanged.

| Item | Owner-reported observation |
| --- | --- |
| Separate Worker | `muuva-forms-rate-limiter-preview` — Ready |
| Durable Object class / storage | `FormRateLimiter` / SQLite-backed Durable Objects |
| Public Worker URLs | Disabled |
| Pages project / environment | `muuva` / Preview |
| Pages Durable Object binding | `FORMS_RATE_LIMITER` |
| Bound namespace | `muuva-forms-rate-limiter-preview_FormRateLimiter` |
| Hash secret | `FORMS_RATE_LIMIT_HASH_SECRET` configured as a Secret; its value is never recorded |
| Scope / mode | `FORMS_RATE_LIMIT_SCOPE=preview`, `FORMS_RATE_LIMIT_MODE=enforce` |
| Thresholds | No optional overrides; defaults of 5 attempts per rolling 10 minutes and 20 per rolling 60 minutes |
| Source branch / commit | `staging` / `1baaa5b837bdeb8b5d20aa6a17a72c56e6cb9cfd` (`local hardening on staging`) |
| Final enforcement deployment | `3b97ab77-5f05-4d21-b595-8a27e7fa30aa` |
| Alias | `https://staging.muuva.pages.dev` |
| Deployment status / date | Success / 31 October 2026 |

### Newsletter threshold test

The owner made six controlled browser-console requests from the staging website to `POST https://staging.muuva.pages.dev/api/newsletter`. Every request used `{"test":true}`: syntactically valid JSON with an unsupported form field, rather than malformed JSON. This exercises rate admission before normal form-input validation.

| Attempt | HTTP response | Observed `Retry-After` |
| --- | --- | --- |
| 1 | `400 Bad Request` | `null` |
| 2 | `400 Bad Request` | `null` |
| 3 | `400 Bad Request` | `null` |
| 4 | `400 Bad Request` | `null` |
| 5 | `400 Bad Request` | `null` |
| 6 | `429 Too Many Requests` | `600` |

`null` records the browser's observation that the header was absent. The results show that the Pages Function reached the limiter, five attempts were admitted before input validation rejected them, and the sixth was rate-limited with a 600-second retry interval. Hosted Newsletter rate-limit enforcement was operational on staging during this owner-performed test.

Given this invalid form payload and the documented validation order, these requests were rejected before Turnstile and Brevo processing. The test did not intentionally create subscriptions or send emails. **It does not verify Brevo double opt-in delivery.**

### Independent Wholesale allowance test

Immediately after exhausting the Newsletter allowance, the owner made one controlled request from the same testing network to `POST https://staging.muuva.pages.dev/api/wholesale`, also using `{"test":true}`. The response was `400 Bad Request`, with `Retry-After: null` (header absent).

Wholesale retained an available allowance while Newsletter was rate-limited, confirming independent endpoint allowances for that testing network. The invalid request stopped before transactional email delivery. This is an isolation check, not a complete Wholesale threshold, valid-submission or delivery test.

## Milestone closure and outstanding validation

Completed: application security hardening; the previously recorded 103 passing tests and local SQLite concurrency/expiry checks; owner-reported Preview Worker deployment, namespace binding and runtime configuration with `enforce`; successful staging Pages deployment; and the controlled live Newsletter enforcement and independent Wholesale allowance tests above. The earlier resource-creation blocker is resolved for Preview according to the owner evidence.

Still pending or outside the verified hosted-test scope:

- Normal valid-submission regression testing for both forms under enforced limits: validation, language switching, expired challenges, retained fields/consent, recoverable failures, fresh-token manual retries and actual accepted/delivery workflows. Earlier mocked browser tests do not replace this hosted regression check.
- Hosted recovery after the rolling window expires, including retry timing, no permanent block and no extension from denied requests. The short live test does not verify the hourly threshold or hosted alarm delivery.
- Hosted failure-path testing for missing/unavailable Durable Object infrastructure and mandatory configuration: confirm safe fail-closed `503` responses without upstream calls. Inspect only safe status/category logs, never secrets, raw IPs or form bodies.
- Longer-term quota/cost monitoring and shared-IP/network usability review, including relevant ingress/header settings. Avoid load tests or repeated polling.
- Separate Production infrastructure, namespace, secrets and configuration; Production remains unchanged according to the owner report.
- Privacy and data-retention review under **Pass C.3.2**, including controller/provider processing, pseudonymous identifiers, logical expiry versus physical/provider/backup retention. That pass is not begun by this closure.
- Final independent Production release authorization, with reviewed limits, monitoring and rollback ownership.

The documented C.3.1 core staging-validation milestone is closed within the evidence scope above. It is **not fully Production-approved**. All existing shared-network, Free-plan/quota, fail-closed, privacy, retention and distributed-abuse caveats remain applicable.

Documentation-closure verification: `git diff --check` passed, and `git diff -- docs/forms-pass-c3-1-security.md` was reviewed for Markdown consistency, evidence attribution and scope. Only this document changed; application tests and builds were not rerun. The change remains uncommitted for owner review.

## Rollback and C.3.3 handoff

Owner rollback is explicit: set Preview mode to `off` and redeploy to restore the prior no-limiter behavior, or redeploy the preceding reviewed bundle. During active abuse, disabling the individual form submission flag is safer than removing its quota. No automatic error path turns enforcement off. Do not delete namespaces, undo migrations or rotate the hash secret as an incident shortcut: rotation changes every identifier and resets allowances; old counters still follow their expiry. Leave Production untouched.

Implementation files committed in `1baaa5b`: added `functions/_lib/rate-limit.js`, `workers/forms-rate-limiter/index.js`, `workers/forms-rate-limiter/wrangler.jsonc`, `src/forms/retry.js`, `tests/forms-security.test.js`, `scripts/verify-forms-rate-limiter-runtime.mjs` and this document; changed both API endpoints, `functions/_lib/forms.js`, both form components, all four locale catalogs, and the Newsletter MIME regression test. No page/image/layout, route, deployment workflow or master project document was changed by that implementation. This documentation closure changes **only `docs/forms-pass-c3-1-security.md`**, with no application, test, Worker configuration or account changes and no commit/push/deployment by Codex.

C.3.3 must synchronize the master brief/content/handoff and Privacy review with the owner-reported staging deployment and live results, remaining operational evidence, chosen resource/region, IP-derived pseudonymous identifiers, logical expiry versus provider retention, operational failure policy and actual activation state. This review is technical implementation evidence, not legal or native-language approval. Those master documents remain reserved for C.3.3 and unchanged by this closure.
