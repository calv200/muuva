# Production verification

Updated 1 November 2026 for C.3.2B. Use [ordered release/smoke-test checklist](production-release-c332.md) for configuration, approvals, blockers, current results and rollback. Tests do not establish legal approval, live delivery/ingestion or hosted deployment.

## Required local gate

Run in order: npm test, npm run build, npm run test:production, git diff --check. Default build is disabled. Separate root-hosted enabled simulations use process-local dummy public Turnstile configuration; runtime submission flags remain false and all third-party browser requests must be intercepted. Also test MUUVA_STAGING=true with analytics accidentally enabled. No shared environment/dashboard activation change is needed.

Static verification covers all 44 localized pages plus compatibility root, SSR text, language, localized metadata, canonical/reciprocal hreflang, sitemap/robots, assets/fonts and hosting headers. It rejects external fonts, development addresses, empty shells, unresolved translations, broken sitemap and incorrect noindex rules. Enabled output must have exactly the expected inline loader and zero external tracker tags, including root; disabled output has neither. Analytics resource hints and pre-consent YouTube iframes are rejected. Fixture-corruption checks preserve these gates. Compatibility root is not another public route; 40 paths are analytics-eligible.

## Browser gate

Use Chromium against generated files: no hydration/page errors; all locales/direct routes/reloads; 320/390/tablet/desktop layouts without overflow; equally accessible first-layer choices, unchecked categories, footer settings/keyboard/focus; independent permissions, persistence, language changes, tabs, blocked/invalid/expired storage and withdrawal.

Use the official tracker with every script/gateway request intercepted: zero before consent, current page once after load, exact sanitized fields/titles/referrer/UTMs, rapid navigation, consecutive Back/Forward, language/internal navigation after Back, separated repeat visits, no filter/anchor-only views, no new events after withdrawal, no script refetch in the document and DNT/hostname gates. Simulated muuva.nl interception is local fixture evidence only.

Intercept YouTube: original five thumbnails, 16:9 geometry, informed Option A and safe external links, independent Analytics choice, correct nocookie embeds/autoplay request and immediate removal on withdrawal. Check listing/filters/detail/Back, vertical centering, original hero/product gallery/hotspots/Amazon and both forms. Intercepted players do not prove playback/audio or browser autoplay permission.

The reusable scripts/verify-consent-browser.mjs takes an existing Playwright module path and downloaded official tracker path; no application dependency is added. Serve an enabled root-hosted build on 127.0.0.1:4175. It intercepts all external traffic. Form/security unit tests mock Siteverify and Brevo with no real email calls.

## Current local results — 1 November 2026

See [release handoff](production-release-c332.md). Historical records below retain earlier route counts/architecture and are not fresh verification. C.3.1 hosted enforcement evidence is owner-reported in its security doc. C.3.2B changes remain local until separately deployed and validated on staging/Production.

## Historical Pass A.3 local verification record (25 October 2026)

- 64 Node tests pass, including all 32 real server-rendered pages, localized draft/contact/teaser content, no footer form, routing/SEO and the existing analytics privacy/navigation regressions. New production-verifier defects cover external font references and missing/invalid WOFF2 files.
- Enabled root production simulation passes: 32 pages plus the compatibility root, exactly one tracker/hook per document, the specified website ID and six shared JS/CSS/font assets. Build variables were process-local; no shared activation file was created.
- Both Preview configurations pass: `MUUVA_STAGING=true` with the enabled flag false, and with the flag deliberately true. Actual Preview browser loading produces no tracker requests/events. The final ordinary build is disabled.
- Chromium used the current official tracker against intercepted build files: approved titles on all 32 routes, language navigation, consecutive Back/Forward, rapid/repeated visits, query/anchor-only changes and hostname/DNT exclusions passed without real analytics submissions. Privacy links from home/list/workout, direct entry/reload, keyboard focus/language selection and new-tab opening passed in all four languages.
- Local font requests resolve to the simulated website origin with no Google Fonts requests during normal loading. A separate reference-only comparison loaded the former Google stylesheet: heading, navigation and footer dimensions matched exactly at 390, 768 and 1440 pixels on all four Privacy pages, German/Dutch homepages and an English workout page. No horizontal overflow or hydration errors were observed. Screenshots were reviewed for Privacy typography and the noninteractive footer teaser.
- Initial layout-shift totals on tested Preview Privacy loads were 0 to 0.000804. `font-display: swap` permits a small initial fallback-to-font shift; this is not a guarantee of zero shift on every device/network. Loaded text geometry showed no introduced wrapping differences.
- Required final sequence: `npm test`, `npm run build`, `npm run test:production`, `git diff --check`. Live Cloudflare responses, account settings, actual Umami dashboard ingestion, real YouTube playback and legal/native-language approval remain unverified. Technical checks do not establish compliance.

## Historical Pass B.1 About Us verification (26 October 2026)

The manifest grew to 36 localized public pages (9 per language), including `/en/about-us/`, `/de/about-us/`, `/nl/about-us/`, `/es/about-us/`. Historical Pass A.3 counts above describe that earlier build. At this B.1 checkpoint, tests covered the then-current translated About server content, one H1/two sections/eight paragraphs/two images, localized footer links, unchanged placeholders, base-aware language routing, SEO/sitemap and analytics path/title coverage. Pass B.1.1 subsequently revised the story to one opening statement and five body paragraphs in the first section and five body paragraphs in the second; the eight-paragraph assertion describes the earlier version. Existing analytics restrictions remain intact.

For browser review, check direct entry/reload, Behind Muuva from home/list/workout/Privacy, keyboard entry/focus, language switching, Back/Forward, both original image responses and all four languages at 390/768/1440. Desktop rows alternate image/text with equal neighboring heights; stacked layouts put each text before its photograph. Check faces after cropping and long translations for clipping/overflow. No image optimization is implied: the supplied second photo is approximately 10 MB.

Local verification on 26 October 2026: 66 Node tests pass; root-hosted output verifies all 36 pages. Chromium passed the checks above for all four languages, including image decoding, row geometry and no horizontal overflow/hydration errors. Screenshots were reviewed for desktop composition and mobile reading order. An injected browser-only analytics fixture produced one approved pageview per About navigation/language/history transition; all requests were intercepted and no real events were submitted. Generated builds remain disabled. Existing locale values were compared with HEAD and are unchanged outside the new About/SEO keys. Live Cloudflare responses and native-language editorial approval remain separate from these local checks.

The B.1.1 source revision is present on `staging` at `c516f73` (branch inspected 30 October 2026). No application tests, browser checks or hosted deployment checks were run during this documentation synchronization. The records above remain historical, not fresh verification of the checked branch.
