# Production verification

Run the GitHub Pages build-job commands, followed by a local whitespace check:

```sh
npm ci
npm test
npm run build
npm run test:production
git diff --check
```

`test:production` reads the generated output directory, Vite base, and public-origin configuration. It compares the actual HTML files with the shared route manifest: currently 32 localized pages, plus the existing unlocalized compatibility entry. It checks rendered main content and localized headings, language, translated SEO metadata, canonical and reciprocal alternate links, translation-key leakage, shared JS/CSS files, sitemap contents, robots directives, and development addresses. It does not execute the application or contact the public site.

The verifier uses the known generated markup format rather than a general-purpose HTML validator. Its regression tests use temporary fixtures and deliberately corrupt output; they do not modify `dist`.

GitHub Actions runs dependency installation, unit tests, build, and production verification in order. A failed step prevents artifact upload and the dependent deployment job. Local checks do not establish that the hosted GitHub Actions run or deployment has succeeded.

## Browser and hosted-site checks

The Node output checks cannot validate:

- Hydration warnings, browser console errors, or runtime failures after scripts load.
- Language detection, blocked localStorage, preference persistence, and language switching without a reload.
- Filter state, browser Back/Forward, section scrolling, legacy-URL migration, or retaining an active video when switching language.
- Keyboard/focus behavior, gallery and hotspot interactions, carousel scrolling, and newsletter form behavior.
- Responsive layout, visual clipping, media playback/audio, or third-party video availability.
- Actual GitHub Pages responses and caching, crawler indexing, or the hostname's root `/robots.txt` (the generated project file is under the Vite base).

Before publishing, use `npm run preview` to check representative home, listing, filtered, and workout pages in all four languages on desktop and mobile. Inspect the console, language menu, page metadata after navigation, gallery, forms, and active video. After deployment, check direct localized URLs and refreshes, the sitemap, and asset responses on the live host. These remain separate from the required static production gate.
