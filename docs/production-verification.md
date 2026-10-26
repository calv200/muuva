# Production verification

Run the local verification sequence (the retained GitHub Pages compatibility workflow also runs the build checks):

```sh
npm ci
npm test
npm run build
npm run test:production
git diff --check
```

`test:production` reads the generated output directory, Vite base, and public-origin configuration. It compares the actual HTML files with the shared route manifest: currently 36 localized pages, plus the existing unlocalized compatibility entry. It checks rendered main content and localized headings, language, translated SEO metadata, canonical and reciprocal alternate links, translation-key leakage, shared JS/CSS/font files and absence of Google Fonts requests, sitemap contents, robots directives, and development addresses. It does not execute the application or contact the public site.

The verifier uses the known generated markup format rather than a general-purpose HTML validator. Its regression tests use temporary fixtures and deliberately corrupt output; they do not modify `dist`.

GitHub Actions runs dependency installation, unit tests, build, and production verification in order. A failed step prevents artifact upload and the dependent deployment job. Local checks do not establish that the hosted GitHub Actions run or deployment has succeeded.

## Browser and hosted-site checks

The Node output checks cannot validate:

- Hydration warnings, browser console errors, or runtime failures after scripts load.
- Language detection, blocked localStorage, preference persistence, and language switching without a reload.
- Filter state, browser Back/Forward, section scrolling, legacy-URL migration, or retaining an active video when switching language.
- Keyboard/focus behavior, gallery and hotspot interactions, carousel scrolling, and the noninteractive newsletter teaser.
- Responsive layout, visual clipping, media playback/audio, or third-party video availability.
- Actual Cloudflare Pages responses and caching, crawler indexing, or the hostname's root `/robots.txt` (the generated project file is under the Vite base).

Before publishing, use `npm run preview` to check representative home, listing, filtered, and workout pages in all four languages on desktop and mobile. Inspect the console, language menu, page metadata after navigation, gallery, footer teaser, and active video. After deployment, check direct localized URLs and refreshes, the sitemap, and asset responses on the live host. These remain separate from the required static production gate.

## Cloudflare Production and Preview configuration

Cloudflare Pages at `https://muuva.nl` is the owner-confirmed hosting architecture. This pass changes local files only. Existing GitHub Pages defaults/workflow remain for compatibility; no deployment settings are edited.

After the publication/compliance blockers in [the review](privacy-compliance-review.md) have been resolved and the owner has separately approved deployment, set these variables **only in Cloudflare Pages Production**:

```dotenv
VITE_UMAMI_ENABLED=true
VITE_UMAMI_WEBSITE_ID=8963af84-1a22-4cad-a8ef-413afe485468
VITE_PUBLIC_SITE_ORIGIN=https://muuva.nl
VITE_BASE_PATH=/
```

Ensure `MUUVA_STAGING` is absent or false in Production. Under **Preview**, keep:

```dotenv
MUUVA_STAGING=true
VITE_UMAMI_ENABLED=false
```

Never place activation values in a shared environment file or inherit Production analytics into Preview. Build and verification must receive the same environment. For local enabled simulations, set the four Production values only for that process and run build plus production verification; intercept every tracker request and event in browser tests. Repeat with the Preview values (and test that `MUUVA_STAGING=true` still suppresses an accidentally true enabled flag). Finish with the ordinary disabled build.

Manual activation steps remaining:

1. Resolve the draft-policy/controller and legal-review blockers; confirm the accepted DPA, transfer safeguards and retention limitations. Review the final four texts. Technical tests do not satisfy these steps.
2. Review and separately approve the code release to the Cloudflare production branch. No commit, push, merge or deployment has been performed here.
3. In the existing Pages project settings, select the Production environment and enter the exact variables above; independently confirm the Preview overrides. Do not change DNS.
4. Trigger an approved production rebuild/deployment; changing a variable alone does not update a built artifact. Verify all 36 direct routes/refreshes, local font responses, one tracker and one privacy hook, the website ID, canonical/hreflang/sitemap and non-production exclusion. Check dashboard ingestion only during an authorized live check.
5. To disable tracking, set `VITE_UMAMI_ENABLED=false` in Production and rebuild/redeploy. Verify that the published HTML contains neither analytics script.

## Pass A.3 local verification record (25 October 2026)

- 64 Node tests pass, including all 32 real server-rendered pages, localized draft/contact/teaser content, no footer form, routing/SEO and the existing analytics privacy/navigation regressions. New production-verifier defects cover external font references and missing/invalid WOFF2 files.
- Enabled root production simulation passes: 32 pages plus the compatibility root, exactly one tracker/hook per document, the specified website ID and six shared JS/CSS/font assets. Build variables were process-local; no shared activation file was created.
- Both Preview configurations pass: `MUUVA_STAGING=true` with the enabled flag false, and with the flag deliberately true. Actual Preview browser loading produces no tracker requests/events. The final ordinary build is disabled.
- Chromium used the current official tracker against intercepted build files: approved titles on all 32 routes, language navigation, consecutive Back/Forward, rapid/repeated visits, query/anchor-only changes and hostname/DNT exclusions passed without real analytics submissions. Privacy links from home/list/workout, direct entry/reload, keyboard focus/language selection and new-tab opening passed in all four languages.
- Local font requests resolve to the simulated website origin with no Google Fonts requests during normal loading. A separate reference-only comparison loaded the former Google stylesheet: heading, navigation and footer dimensions matched exactly at 390, 768 and 1440 pixels on all four Privacy pages, German/Dutch homepages and an English workout page. No horizontal overflow or hydration errors were observed. Screenshots were reviewed for Privacy typography and the noninteractive footer teaser.
- Initial layout-shift totals on tested Preview Privacy loads were 0 to 0.000804. `font-display: swap` permits a small initial fallback-to-font shift; this is not a guarantee of zero shift on every device/network. Loaded text geometry showed no introduced wrapping differences.
- Required final sequence: `npm test`, `npm run build`, `npm run test:production`, `git diff --check`. Live Cloudflare responses, account settings, actual Umami dashboard ingestion, real YouTube playback and legal/native-language approval remain unverified. Technical checks do not establish compliance.

## Pass B.1 About Us verification

The manifest now contains 36 localized public pages (9 per language), including `/en/about-us/`, `/de/about-us/`, `/nl/about-us/`, `/es/about-us/`. Historical Pass A.3 counts above describe that earlier build. Current tests cover full translated About server content, one H1/two sections/eight paragraphs/two images, localized footer links, unchanged placeholders, base-aware language routing, SEO/sitemap and analytics path/title coverage. Existing analytics restrictions remain intact.

For browser review, check direct entry/reload, Behind Muuva from home/list/workout/Privacy, keyboard entry/focus, language switching, Back/Forward, both original image responses and all four languages at 390/768/1440. Desktop rows alternate image/text with equal neighboring heights; stacked layouts put each text before its photograph. Check faces after cropping and long translations for clipping/overflow. No image optimization is implied: the supplied second photo is approximately 10 MB.

Local verification on 26 October 2026: 66 Node tests pass; root-hosted output verifies all 36 pages. Chromium passed the checks above for all four languages, including image decoding, row geometry and no horizontal overflow/hydration errors. Screenshots were reviewed for desktop composition and mobile reading order. An injected browser-only analytics fixture produced one approved pageview per About navigation/language/history transition; all requests were intercepted and no real events were submitted. Generated builds remain disabled. Existing locale values were compared with HEAD and are unchanged outside the new About/SEO keys. Live Cloudflare responses and native-language editorial approval remain separate from these local checks.
