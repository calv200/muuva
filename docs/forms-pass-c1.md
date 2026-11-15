# Pass C.1 Forms foundation — review record

The source implements a newsletter form behind separate build/runtime flags, a Cloudflare Pages Function at `POST /api/newsletter`, and four static confirmation pages. C.2 subsequently added Wholesale; general Contact remains outside scope. C.3.1 added the shared SQLite Durable Object limiter before body parsing, superseding the initial rate-limit proposal below. No Cloudflare, DNS, Brevo or Turnstile setting was changed by this repository work. See [current release matrix](production-release-c332.md) for later owner-reported configuration.

## Processing and safeguards

The browser submits email, language, explicit unchecked consent and a Turnstile token to the same-origin endpoint. The Function accepts only `en`, `de`, `nl`, `es`, checks the request origin against trusted runtime configuration, limits JSON body size, validates fields and rejects extra keys. It verifies each Turnstile token with Siteverify and requires action `newsletter_signup` and the exact allowed hostname. Invalid, expired and replayed tokens fail closed. Upstream requests have timeouts. The Function returns fixed JSON codes with `Cache-Control: no-store` and does not return Brevo errors or secrets. Turnstile, origin checking and input limits provide initial abuse protection; a Cloudflare rate limiting rule should be reviewed before public activation.

Only after these checks does the Function call Brevo's [official double opt-in endpoint](https://developers.brevo.com/reference/create-doi-contact). It uses the server-bound API key, fixed newsletter list `3` and language-specific template IDs EN `2`, DE `3`, NL `4`, ES `5`. The trusted server origin and selected language determine `redirectionUrl`; `contactPixelTrackingConsent` is set to `false` where Brevo supports that preference. No marketing list is joined directly and the separate Wholesale template `1` is unused. Existing Brevo templates must retain `{{ params.DOIurl }}`. Brevo documents `201 Created` for a DOI request; arbitrary `400` or `409` responses are not evidence of DOI creation. The public `202 request_received` is a neutral receipt for `201`, `400` and `409` so contact state remains private; it does not confirm that Brevo accepted the request or sent an email. Other HTTP failures and transport failures return a generic `503`. The static landing page is conditional copy, can be opened directly and is excluded from Umami's pageview allowlist; it is not conversion proof. No email or token is placed in a URL or analytics event.

On the `staging` Pages branch and staging hostname only, the Function logs `newsletter.brevo` with the upstream HTTP status and an exact allowlisted Brevo error code when available. Unknown, oversized or malformed error bodies are `unclassified`; network failures are `transport_failure`. These records never include the address, token, API key, redirect URL, request body, upstream message or raw response. A `duplicate_request` error code means an identical API request was repeated too quickly; it does not prove the contact already exists. A restricted API key needs **Contacts: All** access for contact writes; `403` can indicate insufficient permission. Inspect the safe Preview status/category for a fresh authorized test before changing account settings or templates.

## Cloudflare settings still required

Set these separately for **Preview** and **Production** in the Pages project. Values shown are configuration identifiers or public hostnames, not credentials. Secret values must be entered in Cloudflare as secrets and kept out of Git.

| Binding | Preview | Production before approval |
| --- | --- | --- |
| `VITE_BASE_PATH`, `VITE_PUBLIC_SITE_ORIGIN` | `/`, `https://staging.muuva.pages.dev` | `/`, `https://muuva.nl` |
| `VITE_NEWSLETTER_ENABLED` (build time) | `false` until staged review; `true` for authorized UI testing | `false` |
| `NEWSLETTER_SUBMISSIONS_ENABLED` (runtime) | `false` until staged review; `true` only for authorized integration testing | `false` |
| `VITE_TURNSTILE_SITE_KEY` (public, build time) | Preview widget site key | Production widget site key, when approved |
| `TURNSTILE_SECRET` (runtime secret) | Matching Preview widget secret | Matching Production widget secret, when approved |
| `NEWSLETTER_PUBLIC_ORIGIN`, `NEWSLETTER_ALLOWED_HOSTNAME` | `https://staging.muuva.pages.dev`, `staging.muuva.pages.dev` | `https://muuva.nl`, `muuva.nl` |
| `BREVO_API_KEY` (runtime secret) | Authorized testing key | Production key, when approved |
| `BREVO_NEWSLETTER_LIST_ID` | `3` | `3` |
| `BREVO_DOI_TEMPLATE_EN/DE/NL/ES` | `2` / `3` / `4` / `5` | `2` / `3` / `4` / `5` |

The public Vite flags are compiled into HTML/JS at build time. The runtime flag must also be `true` for submissions. Both default off; missing credentials also fail closed. The form is shown only in root-hosted builds. Do not inherit Production settings into Preview. A setting change affecting the built frontend needs a new deployment. Cloudflare documents [Pages runtime bindings](https://developers.cloudflare.com/pages/functions/bindings/) and [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/); the Siteverify result must always be checked server-side.

## Local checks and activation gate

Keep `npm run dev` and `npm run preview` for frontend work; neither serves Pages Functions. For a local endpoint smoke check, build root-hosted output with analytics disabled and run `npx wrangler pages dev dist` from the repository root, with nonsecret bindings supplied through Wrangler's `--binding` options or local untracked `.dev.vars` as appropriate. A default local request to `/api/newsletter` must return `503` with `{"code":"unavailable"}`; static localized pages must still load. Wrangler documentation covers [Pages local development](https://developers.cloudflare.com/pages/functions/local-development/). Automated Node tests mock Siteverify and Brevo; they make no real subscription request. Live email delivery, DOI link behavior, unsubscribe flow and Cloudflare deployment require a separately authorized test with actual environment credentials.

**Do not enable unrestricted public collection yet.** C.3.2B updates the four Privacy drafts for Brevo, forms and infrastructure and synchronizes master docs. Controller/final legal review, wording-to-subscriber evidence, unconfirmed cleanup, unsubscribe/suppression procedures and actual Production delivery remain open. Source wording/version is not a per-subscriber consent record; interface language selects DOI template/redirect without proving a saved contact-language attribute. Optional website consent never subscribes a visitor. DOI payload/templates remain unchanged. Use [the release checklist](production-release-c332.md); activation requires separate owner approval.
