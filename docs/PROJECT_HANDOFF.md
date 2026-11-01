# MUUVA project handoff

Updated 1 November 2026 for C.3.2B / C.3.3 preparation. Read [AGENTS](../AGENTS.md), [brief](../PROJECT_BRIEF.md), [copy](../CONTENT.md) and [release handoff](production-release-c332.md) before further work. **No commit/push/merge/deployment/account activation is authorized by this record.**

## Current architecture

React/Vite/Tailwind, four catalogs EN/DE/NL/ES, 44 statically rendered localized routes plus compatibility root. Home, listing, five workouts per locale, Privacy, About Us, Wholesale and newsletter confirmation. Forty paths are analytics-eligible; confirmation pages excluded. Source is authoritative over older milestones.

Shared header/footer, original hero/product photography/hotspots/gallery/Amazon, Guided Routines grid/filters/metadata, About story and authentic images remain. Wholesale footer links are live localized routes; general Contact/other policy placeholders remain outside scope. Newsletter DOI and Wholesale have separate default-off build/runtime flags, Turnstile and the shared C.3.1 limiter.

C.3.2B adds a central independent consent store/provider/panel and footer settings, versioned first-party preferences with six-calendar-month initial expiry and fail-closed storage. Analytics and videos are optional/off initially. Umami enabled means consent-controlled availability; exact host/DNT, no external script before permission, manual-only gated pageviews and no queue. YouTube Option A retains local thumbnails until informed permission, then nocookie player; withdrawal removes it. Four updated notices remain drafts, with neutral address placeholder and no final legal effective date.

Key files: src/consent/, build/analytics.js, RoutineVideo.jsx, src/data/privacy.js, four catalogs, tests/ and build/verify-production.js. See release handoff for exact changed files, public variable/binding matrix, local results and owner-only smoke/rollback procedure. Master brief holds design/architecture; catalogs hold full public copy.

## Git and deployment evidence

C.3.2B started on staging with only owner-created untracked workers/forms-rate-limiter/wrangler.production.jsonc. It was inspected and preserved, separate from Preview. This pass is local/uncommitted. Check current Git state again before further work; do not assume branch heads prove deployed commits.

Historical inspection on 30 October 2026: local/remote staging c516f738e17ce60264f90b5d27eef795dd4f036f and main 5c342698407e042cd3d5f424129cd9e21e0f2362, recorded at that time. These are not current branch/deployment claims.

Owner-reported C.3.1 staging commit/deployment/enforcement and live invalid-field quota tests remain in [security review](forms-pass-c3-1-security.md), not independently authenticated account inspection. C.3.2B changes have not been deployed/hosted-validated by this task. Production origin https://muuva.nl, Preview https://staging.muuva.pages.dev. Owner reports Production main/auto-deploy, separate Worker/namespace/keys and variables prepared, with forms/Umami off and limiter off. Effective fresh-deployment settings remain unverified. GitHub Pages compatibility defaults/workflow remain.

## Outstanding work

Approved controller address/contact disclosure, final legal/native-language and provider/DPA/transfer review, local-consent accountability and Newsletter wording-to-subscriber evidence, cleanup/suppression/manual enquiry retention, unknown provider recovery/holds and live hosted checks. No residential address may be sought or published. If policy incomplete, require owner-confirmed effective restriction before a separately authorized Production smoke test.

Historical 17 October YouTube QA found Sliders private and mismatched duration/content titles for other IDs; IDs and approved cards are preserved. Intercepted iframe checks do not prove real playback/audio or fix these issues. Native-language review remains recommended. Tests are not legal approval.

## Workflow

Work only on staging; preserve unrelated edits. For application changes run npm test, npm run build, npm run test:production and git diff --check in order, then affected browser checks. Documentation-only work needs Markdown review/diff check. Default builds stay disabled; enabled browser fixtures must intercept every third-party request and use no real credentials. See production-verification.md and the release checklist. Commit/push/release only with separate owner instruction.
