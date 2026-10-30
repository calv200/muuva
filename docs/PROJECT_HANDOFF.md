# MUUVA project handoff

## 1. Project at a glance

MUUVA is a premium Pilates equipment site with product discovery and Guided Routines. The repository is `calv200/muuva`: React, Vite, Tailwind CSS and four locale catalogs. The owner identifies Cloudflare Pages as the host: Production `https://muuva.nl`, Preview `https://staging.muuva.pages.dev`. Read [PROJECT_BRIEF.md](../PROJECT_BRIEF.md) for the architecture and design specification and [CONTENT.md](../CONTENT.md) for editorial guidance.

## 2. Current Git and deployment state

Inspected **30 October 2026** while on clean `staging`. Both local tracking refs and `git ls-remote` showed:

| Branch | Role | Verified remote branch head |
| --- | --- | --- |
| `staging` | Development; Cloudflare Preview source | `c516f738e17ce60264f90b5d27eef795dd4f036f` — B.1.1 About Us storytelling |
| `main` | Production source | `5c342698407e042cd3d5f424129cd9e21e0f2362` — Cloudflare production deployment trigger |

The owner reports automatic Cloudflare deployments from these branches. **Branch heads are not deployed commit IDs.** The Cloudflare project settings, latest Preview and Production deployment commit IDs, successful build status, custom-domain responses and analytics ingestion were not inspected in this handoff. Check the Pages deployment history and settings, then the live URLs, before claiming a feature is deployed. The repository also retains a separate GitHub Pages compatibility workflow at `.github/workflows/deploy-pages.yml`.

## 3. Current website structure

`src/routing/routeManifest.js` defines **36 localized public pages**, nine per language (`en`, `de`, `nl`, `es`): `/{lang}/`, `/{lang}/guided-routines/`, five `/{lang}/guided-routines/{slug}/` detail pages, `/{lang}/privacy/`, and `/{lang}/about-us/`. The unlocalized root is a compatibility/language-detection entry, not a 37th localized page.

The homepage has Header, hero video, Product Purchase with image hotspots and gallery/Amazon links, Guided Routines promotion, Styled by You carousel and Footer. Guided Routines has stable category IDs, filters, five workout detail routes and YouTube embeds. Privacy pages are **drafts**. About Us has two alternating image/text sections with the approved B.1.1 story. Footer Behind Muuva and Privacy links are real localized routes; the newsletter is a noninteractive Coming soon teaser; Wholesale, Contact Us and other remaining footer items are placeholders. Legacy hash page links are normalized to localized History API routes.

## 4. Key source files and responsibilities

| Need | Source of truth |
| --- | --- |
| Page composition and shared UI | `src/App.jsx`, `src/pages/`, `src/components/`, `src/components/SiteContainer.jsx`, `src/index.css` |
| Routes, language selection and history | `src/routing/routeManifest.js`, `urls.js`, `navigation.js`, `RouteContext.jsx`; `src/components/LanguageSelector.jsx` |
| Visitor-facing copy | `src/i18n/locales/{en,de,nl,es}.json`; `src/i18n/` |
| SEO and static output | `src/seo/`, `src/entry-server.jsx`, `src/main.jsx`, `build/prerender.js`, `build/html.js`, `build/localizedEntries.js` |
| Analytics and output checks | `build/analytics.js`, `build/verify-production.js`, `tests/`; see [analytics review](analytics-pass-a-review.md) and [production verification](production-verification.md) |
| Product, routines and media | `src/data/`, `src/assets/`; font licensing in `src/assets/fonts/README.md` |

Add a public page through the shared route manifest and localized copy/SEO. Check language switching, static HTML, canonical/hreflang, sitemap and the analytics allowlist together. Preserve stable identifiers and base-aware URLs.

## 5. Approved design decisions

The style is Nordic, minimal, premium and editorial: warm cream/neutral surfaces, established brand green and design tokens, restrained spacing, reusable `SiteContainer`, Header and Footer, responsive layouts, Newsreader headings and Manrope interface/body text. Licensed variable WOFF2 fonts are self-hosted in `src/assets/fonts/`; normal page loading should make no Google Fonts runtime request. Preserve original product and About photographs. The About layout has two alternating desktop rows and text-before-photo stacking on smaller screens. See [PROJECT_BRIEF.md](../PROJECT_BRIEF.md) for exact colors, typography, spacing, interactions and asset rules.

## 6. Completed development milestones

The checked source contains the design foundation, landing page and Product Purchase section, Guided Routines, four-language History API routing and static SEO/pre-rendering, Umami analytics foundation, four draft Privacy pages, self-hosted fonts, newsletter Coming soon teaser, About Us page (B.1) and its four-language storytelling refinement (B.1.1). Cloudflare Pages hosting is owner-confirmed; deployment of each staging milestone and production activation of analytics require separate verification. The default build omits analytics, and staging/localhost safeguards remain in source.

## 7. Pending development priorities

**Next planned feature: Wholesale / Contact page.** The intended direction is a dedicated MUUVA page for business/wholesale enquiries. It has **not** been designed or implemented. A later specification must decide layout, copy, fields, integration, submission backend and email workflow.

Also pending: choose Wholesale navigation behavior; decide whether general Contact Us needs a separate page or shared contact flow; review other footer placeholders; finalize the Privacy Policy and compliance decisions; review YouTube embed privacy; verify production analytics activation and actual deployment state; continue responsive/visual QA as pages are added.

## 8. Known risks and unresolved decisions

- Privacy pages remain drafts. Full legal controller identity/address and compliance conclusions are incomplete; see [privacy review](privacy-compliance-review.md).
- Consent-management and standard YouTube embed privacy changes were postponed. Existing YouTube playback and video metadata need manual review.
- Umami Cloud Hobby, EU analytics storage and six-month standard analytics retention are owner-confirmed account details; log/backup retention, transfers and live activation are not verified. Campaign labels still require nonpersonal naming.
- Cloudflare/GoDaddy DNS and nameserver issues occurred historically. Current DNS state must be checked; this document does not say the issue persists or is resolved.
- The Wholesale/Contact feature has no approved functional specification. Local/static tests cannot establish hosted behavior, legal approval or native-language editorial approval.

## 9. Development and testing workflow

Work on `staging`; read [AGENTS.md](../AGENTS.md), [PROJECT_BRIEF.md](../PROJECT_BRIEF.md) and [CONTENT.md](../CONTENT.md), then inspect affected source. Implement only approved scope. Update all four locales for visitor-facing copy. For new public routes, update routing, SEO, pre-rendering and analytics coverage. For application changes run, in order:

```sh
npm test
npm run build
npm run test:production
git diff --check
```

Review the diff and browser interactions/responsive layouts. Commit and push only after user approval; verify the Cloudflare Preview deployment. Merge to `main` only with explicit approval, then verify Production separately. Documentation-only changes require Markdown/link review and `git diff --check`; application tests/build are unnecessary unless requested.

## 10. Instructions for the next Codex session

Read in order: [AGENTS.md](../AGENTS.md), this handoff, relevant [PROJECT_BRIEF.md](../PROJECT_BRIEF.md) sections, relevant [CONTENT.md](../CONTENT.md) sections, then affected source files. Check current Git and deployment state again. Treat future plans as unimplemented until the source and approved specification show otherwise.
