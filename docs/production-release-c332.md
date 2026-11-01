# C.3.2B / C.3.3 preparation — owner release handoff

Prepared 1 November 2026. **Implemented locally on staging; not authorized for unrestricted launch. No commit, push, merge, deployment or account changes by Codex.** Policy stays DRAFT FOR REVIEW. The owner-controlled procedure below is not deployment permission.

## Status and evidence

| State | Evidence |
| --- | --- |
| Implemented | Central independent consent; gated Umami; Option A gated YouTube; EN/DE/NL/ES policy drafts; release matrix and documentation. DOI, enquiry endpoints and limiter unchanged. |
| Tested locally | Node/static/browser results below. All browser third-party requests intercepted; no real subscriptions, enquiries or analytics ingestion. |
| Verified on staging | Historical C.3.1 **owner-reported** enforcement, five Newsletter 400s then 429/Retry-After 600 and independent Wholesale 400. See its security doc for commit/deployment. New C.3.2B consent code has not been deployed/verified there by this task. |
| Not yet verified on Production | Owner reports infrastructure/variables prepared; no fresh effective deployment, real Turnstile/DOI/Wholesale/analytics or video playback proof. |

Current source has 44 localized routes, 40 analytics-eligible routes. No new route, image replacement or dependency. Owner-created `workers/forms-rate-limiter/wrangler.production.jsonc` is preserved, separate from Preview, and remains owner-managed/untracked unless the owner chooses to include it.

## Implementation and files

- New `src/consent/store.js`, `ConsentProvider.jsx`, `ConsentPanel.jsx`: versioned local consent, independent booleans, notice/save/expiry, six-calendar-month initial renewal, storage/tab/expiry handling, equally styled first layer and footer settings. No server evidence database or visitor ID. Storage failure blocks optional services. Single-category grants preserve the other permission's renewal deadline.
- `src/App.jsx`, `src/components/Footer.jsx`: global provider and persistent localized settings button; existing page composition and footer navigation retained.
- `build/analytics.js`: inline first-party loader only; exact host, DNT and consent gate before script load and send. Official `data-auto-track=false`; gated current-page/load/grant plus router/popstate adapter, no queue/backfill or automatic/manual duplication. Inert loaded tracker can be reused after regrant without refetch. Withdrawal blocks future sends but cannot recall in-flight/transmitted data.
- `RoutineVideo.jsx`: original thumbnail/16:9, visible Google-processing explanation, category-only Enable YouTube & Play, nocookie embed with autoplay request/manual controls, safe unchanged external YouTube URL, immediate removal on withdrawal. Grid/filters/metadata/Back/centering unchanged.
- `src/data/privacy.js`, four locale catalogs: fourteen policy sections, draft date 2026-11-01, neutral translated address placeholder, purpose-specific bases, provider/retention/transfer/rights disclosures plus new consent/video copy. `PrivacyPage.jsx` and route/SEO architecture reused.
- `build/verify-production.js`, analytics/privacy/production tests, new `tests/consent.test.js`, reusable `scripts/verify-consent-browser.mjs`: privacy gates and regression coverage.
- Master brief/content, privacy/analytics/production reviews, forms C.1/C.2/C.3.1 and project handoff: current architecture and evidence boundaries, historical dated tests retained.

Exact documentation files: `PROJECT_BRIEF.md`, `CONTENT.md`, `docs/PROJECT_HANDOFF.md`, `docs/privacy-compliance-review.md`, `docs/analytics-pass-a-review.md`, `docs/production-verification.md`, `docs/forms-pass-c1.md`, `docs/forms-pass-c2-wholesale.md`, `docs/forms-pass-c3-1-security.md`, and this new handoff. Exact existing test files changed: `tests/analytics.test.js`, `tests/privacy.test.js`, `tests/production.test.js`; new test: `tests/consent.test.js`. The video component is `src/components/guided-routines/RoutineVideo.jsx`; locale files are `src/i18n/locales/{en,de,nl,es}.json`. No other application files were edited.

Final pageview fields remain **`website`, `hostname`, `url`, `referrer`, `title`**. Approved paths/titles, validated UTM values, origin-only external referrers, excluded screen/browser-language/IDs/custom events/form data and confirmation routes remain. HTTP metadata/device classification and provider session hashing remain relevant; syntax filtering cannot detect every personal campaign name.

## Production configuration matrix

All current values below are **owner-reported preparation**, not independent effective-deployment verification. Never print/read secret values. Verify presence, environment and permission through the owner's dashboard. Do not reuse Preview keys/namespaces. Build-time variables require rebuild; changed runtime bindings/settings may require a new deployment.

| Setting | Prepared Production | Final separately approved activation | Preview isolation |
| --- | --- | --- | --- |
| Pages project / branch / output | `muuva` / `main` / `dist`, auto Production deployments enabled | Same; do not merge/push until release approved | `staging` branch |
| `VITE_BASE_PATH` | `/` | `/` | `/` |
| `VITE_PUBLIC_SITE_ORIGIN` | `https://muuva.nl` | Same | `https://staging.muuva.pages.dev` |
| `MUUVA_STAGING` | `false` | `false` | `true` |
| `VITE_UMAMI_ENABLED` | `false` | `true` **only with reviewed consent loader** | `false`; staging suppresses an accidental true |
| `VITE_UMAMI_WEBSITE_ID` | Owner says configured | `8963af84-1a22-4cad-a8ef-413afe485468` (public ID) | Not needed for disabled integration |
| Visitor Analytics category | No implied grant | Always off until affirmative visitor consent; DNT/host still restrict | No real production sends |
| `VITE_NEWSLETTER_ENABLED` | `false` | `true` | Owner-authorized Preview value, not inherited |
| `NEWSLETTER_SUBMISSIONS_ENABLED` | `false` | `true`, only after enforced limiter and checks | Separate authorized Preview runtime flag |
| `VITE_WHOLESALE_ENABLED` | `false` | `true` | Separate Preview build flag |
| `WHOLESALE_SUBMISSIONS_ENABLED` | `false` | `true`, only after enforced limiter and checks | Separate Preview runtime flag |
| `VITE_TURNSTILE_SITE_KEY` | Separate Production widget public key prepared | Matching Production widget; hostname `muuva.nl` | Separate Preview widget/key |
| `TURNSTILE_SECRET` | Production secret configured (reported) | Matching Production widget secret; verify presence only | Separate Preview secret |
| Turnstile actions | Must inspect effective deployment | `newsletter_signup`, `wholesale_enquiry` | Same action names, Preview hostname |
| `NEWSLETTER_PUBLIC_ORIGIN` | Production value prepared | `https://muuva.nl` | Staging origin |
| `NEWSLETTER_ALLOWED_HOSTNAME` | Production value prepared | `muuva.nl` | `staging.muuva.pages.dev` |
| `BREVO_API_KEY` | Production secret prepared | Authorized DOI Contacts: All permission; existing templates/list | Separately authorized Preview credential |
| `BREVO_NEWSLETTER_LIST_ID` | Existing production list | `3` | `3` only for authorized designated tests |
| `BREVO_DOI_TEMPLATE_EN` | Existing template | `2` | Same approved ID |
| `BREVO_DOI_TEMPLATE_DE` | Existing template | `3` | Same approved ID |
| `BREVO_DOI_TEMPLATE_NL` | Existing template | `4` | Same approved ID |
| `BREVO_DOI_TEMPLATE_ES` | Existing template | `5` | Same approved ID |
| DOI redirect | Derived by server | `https://muuva.nl/{en,de,nl,es}/newsletter-confirmed/` | Staging origin, same localized route |
| `WHOLESALE_PUBLIC_ORIGIN` | Production value prepared | `https://muuva.nl` | Staging origin |
| `WHOLESALE_ALLOWED_HOSTNAME` | Production value prepared | `muuva.nl` | Staging hostname |
| `BREVO_WHOLESALE_API_KEY` | Production secret prepared | Authorized Transactional email: All permission | Separate authorized Preview secret |
| `BREVO_WHOLESALE_TO_EMAIL` | Prepared; value not independently inspected | Owner-approved business recipient, expected `contact@muuva.nl` | Owner-approved test recipient |
| `BREVO_WHOLESALE_SENDER_EMAIL` | Prepared; not independently inspected | Existing authorized sender mailbox; owner must verify exact value | Authorized test sender |
| `BREVO_WHOLESALE_SENDER_NAME` | Prepared; not independently inspected | Existing approved nonempty sender name; verify exact value | Approved test name |
| `FORMS_RATE_LIMITER` | Reported binding | `muuva-forms-rate-limiter-production_FormRateLimiter` | `muuva-forms-rate-limiter-preview_FormRateLimiter` |
| Worker/class | Owner reports deployed | `muuva-forms-rate-limiter-production` / `FormRateLimiter`, SQLite, public URLs disabled | Separate Preview Worker/class namespace |
| `FORMS_RATE_LIMIT_SCOPE` | `production` | `production` | `preview` |
| `FORMS_RATE_LIMIT_MODE` | `off` | **`enforce` before either form goes live** | Owner-reported `enforce` |
| `FORMS_RATE_LIMIT_10M` / `_1H` | `5` / `20` | `5` / `20` | Defaults `5` / `20` |
| `FORMS_RATE_LIMIT_HASH_SECRET` | Production secret configured (reported) | Separate Production secret, valid 32–256 characters; never print it | Separate Preview secret |

No current source requires a marketing category, analytics API secret, new DOI template or frontend email credential. Exact unprovided sender/key values must be verified by the owner; do not invent them. Essential Turnstile can run with optional categories rejected when a form is available. This release does not change account log/pre-clearance settings.

## Local verification record

Final results on 1 November 2026 (local, not hosted deployment/legal sign-off):

- Required final sequence passed: `npm test` **113/113**, `npm run build`, `npm run test:production` (44 localized pages plus root, six shared JS/CSS/font assets), `git diff --check`.
- Root-hosted enabled Production-like build and verifier passed. Generated documents contain the expected first-party loader but no external Umami script tags, analytics hints or YouTube iframes. Browser interception used the actual current official downloaded tracker including its `gateway.umami.is` ingestion path.
- Staging-like environment with both frontend forms available and accidentally true Umami flag: **113/113 tests**, build and 44-page verification passed; actual Preview output has no analytics integration or YouTube iframe. Runtime submission flags remained false in build simulations.
- Chromium suite passed: equal first-layer controls/initial unchecked categories; accept/reject/independent choices; persistence/reload, language selection, same-origin tabs, invalid/expired/blocked storage, withdrawal/regrant without refetch; DNT/localhost/Preview exclusions; zero optional network before consent; exact sanitized payload, rapid navigation and consecutive Back/Forward, navigation after Back and no filter/anchor duplicates. All traffic was intercepted.
- All 44 direct localized routes hydrated without page/hydration errors or horizontal overflow. All five original workouts × four locales retained local thumbnails/16:9 and correct accepted nocookie IDs, category-only informed play and removal on withdrawal. External YouTube link retained saved choices. Actual playback/audio/autoplay acceptance is not established by intercepted frames.
- Both forms in all four languages passed mocked invalid input, 429/Retry-After, 503, retained fields/acknowledgement and success; original endpoint security/DOI/rate-limit unit regressions pass. Language preference, original hero properties, gallery/keyboard and five hotspot controls/Amazon destination were checked. No real DOI, enquiry or analytics submission occurred.
- First-visit layouts checked at 320, 390, 768 and 1440px in every locale. Desktop/mobile banner, Option A and Dutch long-policy screenshots were visually reviewed. Temporary artifacts: `%TEMP%/muuva-c332-browser/`; these are local images, not deployed assets. Real devices/screen readers/native-language approval remain separate checks.
- Locale AST duplicate-key checks passed; keys match, and all pre-existing copy outside Privacy/Privacy SEO/new consent-video groups matches HEAD. No endpoint, limiter or Worker config diff; owner Production file preserved.
- Non-failing existing Vite HMR port-24678 warnings from parallel SSR tests and stale Browserslist-data warning were observed; no dependency update was introduced. Git emitted LF-to-CRLF informational warnings. Final generated output restored to ordinary disabled configuration; no persistent environment file changed.
- Restored disabled-build Chromium check passed: banner/settings, original Coming soon/no Newsletter form, actual Ring filter interaction, no iframe or tracker and zero third-party requests. Markdown relative links and new-file whitespace checks passed. Local preview servers used for these checks were stopped after verification.

Root-hosted enabled simulation uses only process-local public values: base `/`, origin `https://muuva.nl`, staging false, Umami true/public website ID, both Vite form flags true and `VITE_TURNSTILE_SITE_KEY=public-test-key`; runtime submission flags false and no real credentials. Browser fixture serves those files through a simulated origin, intercepting official tracker/gateway, YouTube and mocked form responses. Actual localhost/Preview/DNT cases exercise exclusion. Run a separate actual staging build with `MUUVA_STAGING=true`, staging origin and an accidentally true Umami flag; confirm no hook/tracker. Restore the ordinary disabled build after testing.

Reproduction using an **already installed** Playwright (no application dependency): download official `https://cloud.umami.is/script.js` to a temporary file, serve enabled output with `VITE_BASE_PATH=/ npm run preview -- --host 127.0.0.1 --port 4175 --strictPort` (PowerShell: set the variable for that process), then run `node scripts/verify-consent-browser.mjs <path-to-playwright/index.mjs> <downloaded-tracker.js>`. Never remove interception to test real ingestion without separate authorization.

## Owner-controlled release procedure

### A. Pre-release — stop on unresolved blockers

1. Inspect `git branch --show-current`, `git status --short`, `git diff --stat`, `git diff`, `git ls-files --others --exclude-standard` and `git diff --check`. Confirm staging and inspect every untracked consent/test/checklist file plus the owner Production config. No automatic staging/commit/push.
2. Review the exact source/diff, all four texts and screenshots. Run required checks in order and enabled/Preview/browser checks with interception. Confirm Preview sends no production analytics, reject-all causes zero Umami/YouTube requests and essential form security still works.
3. Complete approved controller contact/address disclosure, final legal/native-language/provider-transfer review, Newsletter consent linkage/cleanup/unsubscribe/suppression and manual Wholesale retention procedure. Keep draft status until approval. **Do not expose the unfinished address placeholder on an unrestricted public site.** If a short live test precedes legal completion, the owner must first confirm an effective access restriction with a separate authorized plan; none is configured by this task. If unavailable, do not proceed.
4. In Cloudflare dashboard → Workers & Pages → `muuva` → Deployments, record current Production successful deployment ID, source commit/time and a known-good **Production** rollback target. Confirm its behavior, forms/analytics flags and privacy exposure. A Preview deployment is not a rollback target for Production.
5. Inspect Settings → Builds & deployments / branch controls (labels may vary): Production branch `main`, output `dist`, auto deployments enabled. Merging/pushing main may deploy immediately. Prepare review and obtain separate release permission **before** any main update or trigger. Record exact release commit; do not accidentally deploy while assembling settings.
6. In Settings → Variables and Secrets choose **Production**, compare every matrix row without exposing secret values. Verify separate Production Turnstile widget hostname, keys and server action names; namespace binding/class/SQLite readiness in Bindings; existing separate Worker Ready with public routes disabled. Do not redeploy the Worker merely because the file exists. Preview remains independently configured.
7. Assign one release operator, observers, designated test addresses, test window (Europe/Amsterdam), rollback threshold and retention owner. Check quotas/cost/shared-network allowance. Confirm no unreviewed load testing or sensitive logging.

### B. Activation — only after separate owner approval

1. Keep both form runtime flags and frontend flags false while confirming Production binding/secret/scope/thresholds. Set Production `FORMS_RATE_LIMIT_MODE=enforce` first; never turn enforcement off as a workaround for a failing public form.
2. Confirm correct Production origins, authorized Brevo keys/list/templates/sender/recipient and Turnstile hostname/actions. Secrets already reported configured still require presence/environment verification, not printing.
3. Set Production Newsletter build/runtime flags true, then Wholesale build/runtime flags true only with enforced protection. Set `VITE_UMAMI_ENABLED=true` only for the new reviewed consent-aware build, base/origin/ID as above. Visitor Analytics permission remains off by default. Keep Preview analytics disabled.
4. Only after separate approval, release the reviewed commit to main/trigger the agreed Production rebuild. This checklist grants no such permission. Build variables require rebuild and runtime bindings may require deployment; changed dashboard fields alone do not prove effective configuration.
5. Wait for successful tests/build/verification in the deployment. Record deployment UUID, exact deployed commit and Europe/Amsterdam date/time. Check custom-domain alias `https://muuva.nl`, bindings/effective mode and expected static output. Do not declare readiness from branch head alone.

### C. Controlled live smoke test — designated owner only

1. Use actual `https://muuva.nl` with the agreed restriction and fresh browser storage/profile. Keep test emails out of URLs/campaigns/screenshots. Open DevTools Network/Console; record statuses/counts, not secrets/bodies.
2. First visit: equal Reject optional/Customize/Accept optional, no Umami or YouTube requests. Reject all, navigate/refresh/workout: still zero optional requests. Essential assets/Turnstile may load as disclosed.
3. Analytics only: one tracker load/current eligible view, subsequent genuine route/language/Back/Forward views once; YouTube stays blocked. Confirm actual Umami dashboard ingestion, sanitized public path/title/referrer/campaign data and no email/form/private parameters. DNT must still prevent tracking. Confirmation routes excluded.
4. YouTube only: correct local thumbnail → informed play action/nocookie player, actual playback/audio/fullscreen/manual fallback; no Umami requests. Check all five original IDs and historical availability/metadata concerns. External link opens safely without changing consent.
5. Accept both: each works independently. Withdraw Analytics, navigate/Back/Forward: no new analytics events. Withdraw videos: active iframe removed immediately. Regrant does not duplicate/reload tracker in the same document. Check persistence, same-origin tabs, language preference and all four locales/main navigation. Earlier transmitted data cannot be recalled by withdrawal.
6. Designated Newsletter email: empty/invalid fields/unchecked consent blocked; valid challenge/action/hostname; neutral receipt; real DOI email, link, correct localized confirmation and list state verified separately. Test unsubscribe/suppression and safe duplicate behavior without exposing subscriber status. Receipt alone is not successful delivery. Preserve approved templates/DOI code.
7. Designated Wholesale enquiry: separate acknowledgement, valid challenge, real intended recipient delivery/Reply-To, escaped content and localized success. Verify no newsletter/marketing enrollment. No visitor acknowledgement is claimed.
8. Confirm effective Production limiter with a small separately approved invalid-field JSON test such as `{"test":true}` from one network: five admitted invalid requests should reach 400, sixth 429 with Retry-After. Both flags/origin must be correct; do not use valid form payloads for quota testing. Verify independent other-form allowance and recovery after window, never poll aggressively. Confirm legitimate submissions below threshold do not return 503. Missing dependency/configuration fails closed; use safe categories only, not raw data. Hosted hourly expiry/alarm/outage tests remain distinct from this short smoke check.
9. Check all 44 direct localized pages/refreshes, canonical/hreflang/sitemap, policy/contact/footer links, hero, gallery/hotspots/Amazon, routine filters/Back and responsive widths. Check console/network for hydration, overflow or unexpected third-party requests. Verify Preview still uses its own namespace/keys/origin and never sends production analytics.

### D. Post-test and rollback

1. Record exact deployment/commit/time, consent cases, safe statuses, real DOI/Wholesale/analytics results and failures. Record what remains untested, including provider/tenant retention and real media. Store sensitive test evidence privately.
2. Remove unnecessary designated test contacts/enquiries appropriately; keep only required opt-out/suppression/consent evidence under documented criteria. Follow provider recovery/backups limits; do not claim absolute erasure.
3. For test-only activation, restore the recorded known-good Production deployment/configuration and confirm restricted test access is not exposing the unfinished policy. Recheck effective flags/bindings/Preview isolation after any rollback.
4. Cloudflare dashboard → Workers & Pages → `muuva` → Deployments → recorded earlier successful **Production** deployment → menu → **Rollback to this deployment**, confirm, then verify live alias/commit/behavior. [Official Pages rollback procedure](https://developers.cloudflare.com/pages/configuration/rollbacks/). Dashboard wording may vary; do not guess a deployment ID or run a destructive Git reset.
5. To disable new form collection, set both runtime submission flags false and rebuild/redeploy reviewed disabled frontend flags. To remove analytics availability, set `VITE_UMAMI_ENABLED=false` and rebuild/redeploy; check no hook/tracker. An existing open tab may retain old code until reload; owner must verify stale-tab behavior and runtime disable effectiveness. Keep rate enforcement on while any submission path is active. Never roll back to the old pre-consent enabled tracker.
6. Rollback does not undo external emails/events, separately deployed Worker versions, dashboard variables, secrets, namespace records, templates, DNS or Access changes. Reinspect bindings/settings and re-deploy approved corrected configuration where needed. Do not delete namespaces, undo migrations or rotate hash secrets as an incident shortcut. No rollback/deployment command is executed by this task.

## Outstanding launch blockers

Approved controller details/address; final legal/native-language and DPA/transfer review; browser-local consent accountability limits and Newsletter subscriber-evidence linkage; intended cleanup/manual retention procedures and unknown provider recovery/holds; hosted staging consent regression; real Production configuration/enforcement/DOI/Wholesale/Umami validation; real YouTube availability/audio/playback. A short restricted live test needs separate authorization and effective access restriction if policy incomplete. Passing tests is not legal or Production readiness approval.
