# Pass C.2 Wholesale enquiry — review record

Implemented on `staging` for review on 31 October 2026. No commit, push, deployment, account configuration or Production setting is part of this pass.

Files added: `src/pages/WholesalePage.jsx`, `src/components/WholesaleForm.jsx`, `src/forms/wholesale.js`, `src/forms/turnstile.js`, `functions/api/wholesale.js`, `functions/_lib/forms.js`, `tests/wholesale.test.js` and this document. Files updated: `src/App.jsx`, `src/components/Footer.jsx`, `src/components/NewsletterSignup.jsx`, the four locale catalogs, `src/routing/routeManifest.js`, `src/routing/urls.js`, `src/seo/metadata.js`, `build/verify-production.js`, the related About/analytics/Privacy/production/routing/SEO tests and `docs/production-verification.md`. Existing uncommitted newsletter endpoint, test and Pass C.1 review corrections were preserved. The supplied studio photograph was already present and remains unmodified.

## Page and routing

The four public `/{language}/wholesale/` routes use the existing React, Tailwind, Newsreader/Manrope and localized routing patterns. The page has an editorial introduction, studio photograph on the left and a warm neutral form panel on the right. Below the desktop breakpoint the photograph stacks above the form. The supplied photograph exists at `src/assets/images/studios and B2B/reformer_bench.jpg`, rather than the requested `studios/` path; it is used without modification or relocation.

Both Wholesale Muuva and Apply for Wholesale in the footer link to this page. Language switching preserves the route, queries and anchor. The manifest, static HTML, localized SEO, canonical/hreflang links and sitemap include the four new pages: 44 localized pages in total. The existing analytics configuration derives its approved public paths and titles from that manifest (40 paths after excluding newsletter confirmation pages); form values and submission events are never added to analytics.

## Form and delivery

The ordered fields are name (required, 100 characters), business name (required, 160), email (required, 254), optional business type (fixed `studio`, `instructor`, `retailer`, `other` IDs), enquiry (required, 4,000) and a required unchecked privacy acknowledgement. All labels, validation and feedback are available in EN/DE/NL/ES. Inline errors retain the entered data, focus the first invalid field and reset the single-use challenge after a failed submission. Successful submission replaces the form with an inline status and focused confirmation heading. Fields stay in component memory only; they are cleared on success and are not persisted through page reloads.

`POST /api/wholesale` uses a separate runtime switch and server configuration. It accepts only same-origin JSON requests on the configured host, enforces POST, limits the body to 16 KiB, rejects extra fields and unsupported languages, trims/normalizes text and rejects control characters. Browser and server share field validation. Siteverify must return success, the configured hostname and action `wholesale_enquiry`; newsletter tokens cannot be reused for this form. Verification and Brevo requests have 6/8 second timeouts. The browser uses a 20 second timeout, prevents concurrent submissions and does not retry automatically.

After validation the Function calls Brevo's [transactional email endpoint](https://developers.brevo.com/reference/send-transac-email). No template is required. Recipient and sender come exclusively from server configuration; the subject is fixed. The email contains structured plain text and escaped HTML with the enquiry details and selected language. The validated visitor email/name are used as Reply-To. User content cannot supply recipients, headers, templates or HTML markup. Only Brevo `201` produces `202 enquiry_received`; all Brevo rejections and transport failures produce a fixed generic `503`. API acceptance is not proof of mailbox delivery. Responses are `no-store` and `nosniff`, never expose upstream details, and the Function logs no submitted data or upstream responses.

This workflow does not create contacts or marketing subscriptions. The optional visitor acknowledgment email is deferred: sending one is a separate delivery that could fail after the MUUVA notification succeeds and would need its own abuse, retry and copy review. The existing newsletter DOI endpoint and its response/privacy behavior are preserved. Both browser forms now use one shared Turnstile script loader so their widgets can coexist without duplicate script requests. A shared container observer selects the compact widget below 300px and refreshes it on size changes; the newsletter retains its normal size in wider containers. This follows Cloudflare's [documented widget sizes](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/) and prevents overflow at narrow mobile widths.

## Configuration still required manually

These values have not been added to Cloudflare. All switches default off. For an authorized Preview integration test, configure the root-hosted build and runtime independently; keep Production disabled until separately approved.

| Variable | Scope | Preview value or requirement |
| --- | --- | --- |
| `VITE_WHOLESALE_ENABLED` | Build, new | `true` to enable the form; defaults off |
| `WHOLESALE_SUBMISSIONS_ENABLED` | Runtime, new | `true` to accept submissions; defaults off |
| `WHOLESALE_PUBLIC_ORIGIN` | Runtime, new | `https://staging.muuva.pages.dev` |
| `WHOLESALE_ALLOWED_HOSTNAME` | Runtime, new | `staging.muuva.pages.dev` |
| `BREVO_WHOLESALE_API_KEY` | Runtime secret, new | An authorized transactional sending key |
| `BREVO_WHOLESALE_TO_EMAIL` | Runtime, new | `contact@muuva.nl` |
| `BREVO_WHOLESALE_SENDER_EMAIL` | Runtime, new | An existing Brevo-authorized sender address |
| `BREVO_WHOLESALE_SENDER_NAME` | Runtime, new | `MUUVA` |
| `VITE_BASE_PATH` | Existing build variable | `/`; subpath builds display the form with submission disabled |
| `VITE_TURNSTILE_SITE_KEY` | Existing public build variable | Widget authorized for the Preview hostname |
| `TURNSTILE_SECRET` | Existing runtime secret | Secret matching that widget |

A restricted Brevo key requires **Transactional email: All** for sending; Read cannot send. See [Brevo API key permissions](https://help.brevo.com/hc/en-us/articles/40158277171474-About-API-key-permissions). Use the new Wholesale key binding without changing the newsletter key or templates. No email credentials or template IDs are embedded in browser code. Missing configuration fails closed; an unavailable form displays a localized explanation without loading Turnstile.

The current Privacy drafts do not yet describe Wholesale enquiries, Brevo/mailbox processing or retention. Review those notices and the acknowledgement wording before enabling real collection. Turnstile, body limits, fixed recipients and a single-use action-specific token provide the same initial abuse protections as the newsletter; a persistent rate limit would require separate infrastructure/configuration. The application has no durable queue or deduplication store: a manual retry after an ambiguous network failure may produce a duplicate notification.

`npm run dev` and `npm run preview` serve the frontend only. Use `wrangler pages dev dist` for a local Pages Function check, with local untracked bindings as described in [Pass C.1](forms-pass-c1.md). Automated tests mock both upstream services and use fictitious credentials. Actual delivery to `contact@muuva.nl`, sender authorization, spam/bounce handling and hosted responses require a later authorized integration test. No such delivery is established by local tests.

## Verification

Run `npm test`, `npm run build`, `npm run test:production` and `git diff --check`. The tests cover localized routes, server-rendered content/form accessibility, SEO, required fields, fixed business types, email and size limits, wrong method/origin/host, malformed input, missing configuration, Turnstile failures/replay/action/hostname, one structured escaped email on success, safe failures and upstream timeouts. Existing Newsletter, Privacy, analytics, routing and production-verifier tests remain required.

Browser review must include all four languages at desktop/tablet/mobile widths, image decoding and crop, no horizontal overflow, footer entry, direct entry/reload, language/history navigation, field focus/validation, consent, failure retaining data, challenge reset, loading/duplicate-submit prevention, success feedback and simultaneous newsletter/Wholesale widgets. Mock services for local checks; avoid real credentials or delivery in automated verification.

Local results on 31 October 2026: default, root-hosted analytics-enabled and root-hosted staging builds passed the 44-page production verifier. The enabled staging build used fictitious public configuration with both forms active. Chromium checks passed for all four languages at 320/390/768/1440px, including direct entry/reload, localized titles, original image decoding, two-column/stacked geometry and no horizontal overflow. A desktop-to-320px resize switched both widgets to compact. Mocked interaction checks passed for footer navigation, validation/first-error focus, challenge expiry/reset, language switching and Back/Forward without losing fields, failed submissions retaining values/consent, duplicate-submit prevention, inline success, a subsequent newsletter signup and a single shared Turnstile script. No hydration or page errors occurred. Desktop English, tablet German and mobile Dutch screenshots were visually reviewed. The Pages Functions bundle also compiled locally with Wrangler, exposing only the two intended API routes; no account requests or real emails were sent.

Final checks: `npm test` passed all 90 tests; `npm run build`, `npm run test:production` and `git diff --check` passed. Locale keys/interpolation match and all four JSON catalogs were checked for duplicate keys. The restored default build was checked in Chromium: Wholesale submission stayed disabled, the newsletter teaser remained visible, no Turnstile requests occurred, and Shop anchors, gallery keyboard navigation, five hotspots, the Amazon link, routine filters/detail navigation and Wholesale footer entry worked. The Node suite emitted existing HMR port-24678 warnings from parallel Vite servers; there were no test failures.

`PROJECT_BRIEF.md` and `CONTENT.md` still contain the historical no-backend/no-form descriptions. They have not been rewritten as part of this review implementation. Synchronize those approved documents, the Privacy drafts and the project handoff after the new flow and copy are approved.
