# MUUVA Website Project Brief

## 1. Goal
Create and evolve the MUUVA website, starting from the current landing page and extending it with additional pages such as Guided Routines.

Before adding new pages, establish a reusable site-wide design foundation so typography, colors, spacing, containers, header, footer, and shared UI elements remain consistent across the whole website.

## 2. Target audience
Women who want stylish, premium Pilates products for home workouts and everyday movement.

## 3. Desired style
Nordic, calm, premium, feminine, clean, editorial, contemporary, and wellness-oriented.

The website should feel closer to a modern lifestyle / design brand than to a conventional fitness or generic e-commerce website.

## 4. Current Landing Page Structure
1. Header
2. Hero video
3. Product purchase section
4. Guided Routines promotional section
5. Styled by You lifestyle image carousel
6. Footer

A separate **Guided Routines page** now exists as a statically generated, history-routed experience and can continue to be refined after visual review.

The homepage, Guided Routines listing and detail pages, and shared interfaces support English, German, Dutch, and Spanish. Sections 8.1–8.5 describe localization, localized routing, pre-rendering, SEO, and verification conventions.

---

## 5. Site-wide Design Foundation

This section defines the visual rules that should be reused across the landing page and all future MUUVA pages.

### 5.1 Brand / Logo Relationship

- The existing `muuva` logo is the primary visual anchor of the brand.
- The logo has a rounded, geometric, modern, calm, and slightly playful character.
- Website typography should complement the logo rather than try to reproduce or imitate it exactly.
- Do not recreate the logo using a website font when the real logo asset is available.
- Keep the logo clear and recognizable with enough surrounding whitespace.
- The primary logo green is approximately:
  - `#4E6D5E`
- When possible, use the original logo asset rather than recoloring or rebuilding it in CSS.

### 5.2 Typography System

Use only two main font families across the website. Both are self-hosted variable WOFF2 fonts in `src/assets/fonts/`, loaded through `src/index.css` with `font-display: swap`. Latin and Latin Extended subsets cover the four locales; licenses and download provenance accompany the files. Manrope supports 400-600 and Newsreader 400-500 with optical sizing retained. No italic styling is currently used. There are no Google Fonts stylesheet, preconnect or runtime font requests.

#### Display / editorial font
**Newsreader**

Use for:
- Major page headings
- Section headings
- Product titles
- Editorial statements
- Important short brand messages

Recommended weights:
- Regular `400`
- Medium `500` when additional emphasis is required
- Italic only as a deliberate editorial accent

Newsreader should provide the elegant/editorial contrast to the rounded MUUVA logo without making the site feel overly formal or like a traditional luxury fashion brand.

#### Body / UI font
**Manrope**

Use for:
- Body copy
- Navigation
- Buttons and CTAs
- Product information
- Small labels
- Form elements
- Footer content
- Utility text

Recommended weights:
- Regular `400`
- Medium `500`
- Semi-bold `600` only where stronger UI emphasis is required

Manrope should visually connect with the rounded, modern character of the MUUVA logo while remaining very readable.

#### Typography hierarchy — desktop starting values

Use responsive typography where appropriate, preferably with reusable Tailwind classes or `clamp()` rather than many isolated font-size values.

| Role | Suggested size |
| --- | --- |
| Major / hero heading | `48–56px` |
| Section heading | `36–44px` |
| Product heading | `34–40px` |
| Body copy | `15–17px` |
| Navigation | `14–15px` |
| Small uppercase label | `11–12px` |
| Button / CTA | `12–14px` |

#### Typography hierarchy — mobile starting values

| Role | Suggested size |
| --- | --- |
| Major / hero heading | `36–44px` |
| Section heading | `30–36px` |
| Product heading | `28–34px` |
| Body copy | `15–16px` |
| Navigation / menu | `14–15px` |
| Small uppercase label | `11–12px` |
| Button / CTA | `12–14px` |

#### Typography rules

- Newsreader headings should generally use a tight but comfortable line height, around `1.0–1.15` depending on size.
- Manrope body copy should generally use a line height around `1.5–1.7`.
- Small labels may use uppercase styling with restrained letter spacing, approximately `0.12em–0.18em`.
- Buttons may also use subtle letter spacing when uppercase.
- Avoid extremely small body or footer text.
- Important supporting text should remain comfortably readable; do not reduce it simply to create more negative space.
- Avoid introducing additional font families unless explicitly approved later.

### 5.3 Brand Color System

Use a small, restrained palette. These are starting design tokens and may be fine-tuned later after visual review.

#### Primary colors
- Brand green / logo green: `#4E6D5E`
- Primary text / soft charcoal: `#24211F`
- Muted text: `#6F6A63`

#### Neutral backgrounds
- Soft Sand token: `#E9E1D6` (Tailwind `soft-sand`); the current featured product container instead uses `#F2EFE9`.
- Main warm cream: `#FBF8F2`
- Secondary warm neutral: `#F2EFE9`
- Soft beige: `#DFD3BD`
- White: `#FFFFFF` only when it is visually intentional, such as photography or a defined card/image area

#### Borders / dividers
- Soft neutral border: `#D7D0C6`

#### Landing-page section assignments
- Header and footer: warm neutral `#F2EFE9` (`warm`).
- Featured Product Purchase Section: square framed container in warm neutral `#F2EFE9` on the existing cream page background.
- Guided Routines promotional text panel and Styled by You: warm cream `#FBF8F2` (`cream`), matching the dominant page canvas.
- Hero video, photography, overlays, typography and shared CTA styling remain unchanged. Soft beige `#DFD3BD` remains available as a secondary token; MUUVA green stays an accent.

#### Color rules
- Favor warm neutrals rather than bright white across large page areas.
- Use the MUUVA green selectively for brand details, logo-related moments, accents, or subtle interactive states.
- Do not overuse the green as a large UI fill unless a section specifically calls for it.
- Avoid loud fitness colors, saturated gradients, or aggressive e-commerce colors.
- Avoid pure black when soft charcoal provides sufficient contrast.
- Maintain accessible contrast for body text, navigation, and interactive elements.

### 5.4 Global Content Grid

Create one consistent content container that controls alignment across the site.

#### Desktop
- Maximum content width: approximately `1280px`
- Standard horizontal page gutter: approximately `48px`

#### Tablet
- Horizontal page gutter: approximately `32px`

#### Mobile
- Horizontal page gutter: approximately `20–24px`

#### Grid rules
- Header content, product content, section headings, lifestyle content, and footer content should visually align to the same global left/right grid whenever they are inside a contained section.
- Full-width / full-bleed media sections are allowed.
- When a section is full bleed, its internal text/content should still use the shared content grid where appropriate.
- Avoid giving every section a different arbitrary maximum width.
- Use a reusable container utility/component instead of repeating unrelated width and padding values throughout the code.

The Product Purchase featured card is an intentional exception to the shared 1280px content grid: its own container reaches 1462px so the complete kit can remain prominent.

### 5.5 Spacing Scale

Use a consistent spacing system instead of adjusting every section independently by eye.

Recommended reusable spacing values:
- `8px` — micro spacing
- `16px` — small spacing
- `24px` — small/medium spacing
- `32px` — medium spacing
- `48px` — medium/large spacing
- `64px` — large spacing
- `96px` — standard desktop section spacing
- `128px` — large editorial section spacing when genuinely needed

#### Section spacing guidance
- Standard desktop section spacing: around `96px`
- Large editorial sections may use up to `128px`
- Tablet sections: around `64–80px`
- Mobile sections: around `48–64px`

#### Spacing rules
- Preserve generous breathing room, but do not use empty space to compensate for text that is too small.
- Sections should feel related to each other and follow a consistent vertical rhythm.
- Avoid large one-off spacing values unless the composition specifically requires them.

### 5.6 Shared Header Foundation

The header should remain minimal and elegant, but it must not feel visually insignificant compared with the hero.

- Use the same global content container and horizontal gutters as the rest of the website.
- Use the real MUUVA logo asset.
- Navigation should use **Manrope**, normally around `14–15px` on desktop.
- Use comfortable spacing between navigation items.
- Utility icons should remain thin and minimal but large enough to recognize easily.
- The header should feel slim rather than bulky, while still giving the logo and navigation enough visual presence.
- Suggested desktop header height starting range: approximately `64–72px`.
- Suggested mobile header height starting range: approximately `56–64px`.
- Newsreader Italic may be used selectively as an editorial accent elsewhere, but the primary navigation should favor Manrope for clarity and consistency.

### 5.7 Shared CTA / Button Foundation

Create one reusable CTA/button style for actions such as:
- `Buy on Amazon →`
- `Explore Guided Routines →`

Default direction:
- Manrope Medium
- Approximately `12–14px`
- Restrained uppercase styling and/or subtle letter spacing when appropriate
- Thin neutral border
- Transparent or warm-neutral background
- Dark charcoal text
- Subtle corner radius rather than a highly rounded pill unless specifically chosen later
- Comfortable horizontal and vertical padding
- Gentle hover/focus change
- No loud Amazon-orange treatment
- Keep arrows and icons minimal

The Product Purchase CTA is a deliberate section-specific exception: a rounded, filled `#304C40` pill with white text. The gallery CTA and Guided Routines CTA retain their own implemented styles.

Interactive elements must include visible keyboard focus states and should remain accessible on mobile.

### 5.8 Shared Footer Foundation

- Footer content should use Manrope.
- Footer headings may use Newsreader or Manrope depending on hierarchy; the large newsletter statement can use Newsreader.
- Avoid microscopic footer copy.
- Standard footer body/link text should generally remain around `14–15px` on desktop unless a specific legal line needs to be smaller.
- Footer columns should align to the global content grid.
- Maintain generous spacing without making the footer feel empty because its content is too small.

### 5.9 Responsive Behavior

- The design foundation must work consistently across desktop, tablet, and mobile.
- Do not treat mobile as a compressed desktop layout.
- Typography should scale intentionally.
- Horizontal gutters should decrease according to the global grid rules.
- Multi-column sections should stack cleanly when space becomes limited.
- Buttons and interactive controls should remain easy to tap.
- Avoid horizontal overflow.
- Preserve the calm/editorial feeling at smaller sizes rather than overcrowding the screen.

### 5.10 Foundation Cleanup Guardrails

During the design-foundation cleanup:

- Do **not** redesign the individual landing-page sections.
- Do **not** change the written content unless specifically requested.
- Do **not** replace imagery or alter image/gallery behavior unless required to support the global system.
- Preserve the current overall landing-page order and concept.
- Focus first on typography, shared colors, grid/container rules, and spacing.
- Header, CTA, and footer refinements should use those global foundations rather than independent styling.
- Prefer reusable components, design tokens, and shared utility classes over repeated one-off values.
- After each major implementation pass, review the page visually before introducing further design changes.

---

## 6. Visual References

### 6.1 Header Reference

Current implementation: the shared header uses the real logo, Shop and Training sessions links from 640px upward, and a globe/language-code selector at every viewport size. The language menu lists English, Deutsch, Nederlands, and Español. The search icon in the reference below is not implemented. The reference remains visual inspiration rather than a list of current functionality.

- Source image
`references/screenshots/headerMuuva.png`

- Purpose
    This sketch defines the desired direction for the website header. It should be used as a visual reference for layout, spacing, typography contrast, and brand feeling.

- Overall feeling
    Minimal, premium, calm, editorial, and slightly fashion-oriented. The header should feel elegant and spacious, not like a typical fitness e-commerce website.

- Layout description
    - Full-width horizontal header.
    - Soft beige / warm neutral background.
    - Logo positioned on the far left.
    - Navigation links positioned toward the right side.
    - Utility icons positioned on the far right.
    - Plenty of horizontal breathing room.
    - Header height should feel slim and elegant, not bulky.

- Logo
    - The `muuva®` logo appears on the left.
    - Use the existing logo asset rather than recreating the wordmark with text.
    - Logo color is muted green / grey-green.
    - Logo should feel grounded, soft, and premium.
    - Registered trademark symbol should remain part of the official logo treatment when present in the asset.
    - Logo should not be oversized, but it should remain clearly visible.

- Navigation links shown in the sketch:
    - Shop
    - Training sessions

- Updated navigation style direction:
    - Use Manrope as the primary navigation font.
    - Elegant, clean, modern, and highly readable.
    - Dark charcoal text.
    - Underlining may be used selectively if it improves the editorial feeling, but it should not make the menu feel busy.
    - Spacing between links should be generous.
    - The navigation should sit visually closer to the right side than the center.

- Utility icons shown on the far right:
    - Search icon
    - Globe / language icon

- Style direction:
    - Thin line icons.
    - Dark charcoal color.
    - Clean, minimal, and simple.
    - Icons should align vertically with the navigation links.
    - Icon size should be balanced with the text, not oversized or too small.

- Background color
    The header should use one of the approved warm-neutral colors from the site-wide color system, with the original sketch used as visual inspiration.

- Typography direction
    Use a contrast between:
    - The existing rounded MUUVA logo wordmark.
    - Clean Manrope navigation / utility typography.
    - Newsreader for editorial headings elsewhere on the page.
    - Minimal outline utility icons.

- Avoid:
    - Sporty fonts
    - Heavy or corporate-looking navigation
    - Overly decorative serif navigation
    - Rounded playful display fonts that compete with the MUUVA logo

- Header structure
    Recommended desktop structure:
    ```text
    [ muuva® ]                                      [ Shop ] [ Training sessions ]   [ Search icon ] [ Globe icon ]
    ```

### 6.2 Hero Section Reference
- Source image
`references/screenshots/hero-section-sketch.png`

- Purpose
This sketch defines the desired layout direction for the hero section, including the header and hero video.

- Hero layout description
    The hero section should be composed of two main parts:
    1. Header at the top.
    2. Hero video directly below the header.

- Video file location
    `src/assets/videos/hero-video.mp4`

- Video behavior
    - Autoplay
    - Muted
    - Loop
    - Plays inline on mobile
    - Cropped with `object-cover` so it fills the hero area elegantly
    - Should not show video controls
    - Should feel premium, calm, and editorial

- Suggested structure
    ```text
    [ Header ]
    [ Full-width hero video ]
    ```

### 6.3 Product Purchase / Discovery Section

- Placement: after the hero video, before the Guided Routines promotional section. Preserve the remaining page order.
- Layout: centered framed container up to 1462px wide with square 90-degree corners, a subtle shadow, and one unified `#F2EFE9` background. At 1280px and wider, the left-aligned editorial block shares the card with the image positioned across the center and right. Below 1280px, copy stacks above the image. The surrounding section remains `#FBF8F2`.
- Static copy: left-aligned Newsreader title `Get Your Pilates Kit` in deep green `#304C40`, wrapping naturally without forced line breaks. No subtitle appears. The single main CTA remains the rounded, filled `Buy on Amazon →` button in `#304C40` with white text, darker hover, and visible focus, spaced directly below the title. The `More info` button remains removed.
- Sizing and positioning: the image wrapper is 100% wide up to 1341.6px below 1280px. At 1280px and wider it is 106% wide up to 1422.1px, shifted right by 9% of its width and upward with a -24px top margin. The wider layout uses 40px top and 24px bottom card padding; the card remains content-sized. The original image proportions, transparent padding, product arrangement, and percentage hotspot alignment remain intact. No equipment is independently resized.
- Composition: one transparent `src/assets/images/Products/full-kit-cutout.png` (1672×941), derived locally from `src/assets/images/Products/kit-billboard.png`. Preserve the original product arrangement, perspective, guide/phone angle and photographic shadows. Original source remains unchanged. No floating animation.
- Gallery triggers: five semantic hotspot buttons overlay the single image, with percentage coordinates and centralized `galleryImageId` mapping in `src/data/productComposition.js`. Ring, Ball, Band and Sliders open their respective photos. The workout-guide hotspot at 73% x / 83% y, beneath the printed guide beside the phone, temporarily opens the full-kit photo. Change only its `galleryImageId` when a dedicated guide photo is added to the gallery. The independent image button opens the full-kit photo; empty section space outside the image and editorial text do not.
- Gallery order and mapping, all under `src/assets/images/Products/`: Ring = `ring1.png`; Ball = `ball1.png`; Band = `band1.png`; Sliders = `slider1.png`; workout guide and full kit = `kit1.png`. The workout-guide hotspot does not add a gallery slide. Use the root-level kit image, never `Archive/kit1.png`.
- Preserve gallery styling, five images, previous/next arrows, thumbnails, close/backdrop/Escape behavior, keyboard arrows, focus trapping/restoration, and its Amazon CTA.
- The main and gallery Amazon CTAs use the centralized product URL, a new tab, and `noopener noreferrer`.
- Accessibility: hotspots have 44px targets, meaningful photo-viewing labels and visible focus. The hero-image button and hotspots are independent siblings, never nested controls.
- Removed: dynamic selection state, hover-preview copy, contextual routine links, reset controls and selected-content transitions. Editorial content never changes during interaction.

### 6.4 Guided Routines Page

- Page route
Use the localized listing path `/muuva/{language}/guided-routines/` and detail path `/muuva/{language}/guided-routines/{slug}/`. Supported languages and stable workout slugs come from `src/routing/routeManifest.js`; see section 8.2.

The Sliders routine is available in All and Sliders, using its existing thumbnail and the video URL listed below.

- Routing decision
The current hosting architecture is Cloudflare Pages at `https://muuva.nl`, as confirmed by the owner. The repository retains GitHub Pages compatibility and its existing workflow; this local pass does not deploy either host. Shared routing utilities handle browser history navigation, and pre-rendered HTML files support direct entry and refresh for every manifest route without a server-side fallback. Hash page routes remain supported only as legacy links; see sections 8.2–8.3.

- Page structure
    ```text
    [ Header ]
    [ Guided Routines dynamic hero ]
    [ Workout filters ]
    [ Routine grid ]
    [ Footer ]
    ```

- Default hero
When `All` is active, show:
    - Small label: `Guided routines`
    - Heading: `Guided routines`
    - Description: `Move with your essentials. Follow simple Pilates sessions designed to make movement part of your everyday routine.`

Do not show an individual product image or product CTA in the `All` state. The default hero must use the same fixed responsive hero height as every filtered state so the filter bar does not jump.

- Filters
Show only:
    - All
    - Ring
    - Ball
    - Sliders
    - Band
    - All Equipment

The displayed `All Equipment` filter retains the internal `Full body` identifier and existing routes. Workout muscle-group pills still display `Full body`; the existing `Full Body Routines` hero heading is unchanged. Only one filter can be active at a time. `All` represents the default state and shows every available routine. Selecting `All` resets the page to the complete routine collection and generic hero. Product filters should remain selected until another filter is chosen.

- Dynamic hero behavior
The same hero area changes when a filter is active.

Filtered heroes use the header image as one full-width background-image banner:
    ```text
    [ Full-width background image ]
    [ Left-aligned content within the normal site container ]
    ```

The hero image should span the available page width beneath the global navigation, while text remains aligned to the shared site container. The supplied hero assets place product imagery primarily on the right, so position hero copy in the left content area and preserve the right-side image composition. Use a very subtle warm-neutral readability layer rather than a heavy overlay.

All hero states use an explicit fixed responsive height controlled by the hero container, not by the image's intrinsic dimensions. The current implementation uses the same height for `All`, Ring, Ball, Sliders, Band, and All Equipment at each breakpoint.

All Equipment uses the `full-body-header` asset as the full-width hero background in the same manner as equipment filters and does not show the Pilates Essential Kit CTA.

- Equipment hero copy
Ring:
    - Heading: `Pilates Ring Routines`
    - Description: `Add resistance and control to familiar movements while engaging your core, legs and upper body.`

Ball:
    - Heading: `Pilates Ball Routines`
    - Description: `Small prop, endless possibilities. Use the ball to challenge stability, alignment and deeper muscle control.`

Sliders:
    - Heading: `Slider Routines`
    - Description: `Turn simple movements into controlled, full-range exercises that challenge strength, stability and coordination.`

Band:
    - Heading: `Resistance Band Routines`
    - Description: `Add just the right amount of resistance to strengthen, activate and move with more intention.`

For equipment categories, show the discreet text CTA:
`Part of the Pilates Essential Kit · Explore the kit →`

All Equipment:
    - Heading: `Full Body Routines`
    - Description: `Balanced sessions designed to connect strength, control and mobility from head to toe.`

- Routine grid
Use the existing responsive one/two/three-column editorial grid and unchanged thumbnails and play overlays. Below each thumbnail, show a Newsreader workout title after 20px, then a duration/clock and intensity row after 8px, followed by muscle-group and equipment pills after 8px. Remove the previous uppercase category label. Do not load YouTube iframes inside the grid.

Workout metadata lives in `src/data/guidedRoutines.js`: `titleKey`, `durationMinutes`, `intensity`, `muscleGroups`, and `equipment`. Text is resolved from the locale files. Intensity uses the stable `medium` ID, muscle groups use `fullBody`, and equipment uses `ring`, `ball`, `sliders`, and `band`. In English, Pilates Ring Workout, Pilates Ball Workout, Pilates Sliders Workout, and Resistance Band Workout each show 15 min, Medium, Full body, and their respective Ring/Ball/Slider/Band equipment tag. All Equipment Workout shows 20 min, Medium, Full body, and four separate equipment pills: Band, Ball, Ring, Slider. It remains associated only with the internal `Full body` filter category, displayed as the All Equipment filter (and the All view).

Reusable non-interactive metadata pills use Manrope, soft borders, and charcoal text (#24211F). Intensity uses buttery cream #F8EACB; muscle group uses creamy blush #F8E9E3; equipment uses sage #DFE5D8. Styles are centralized in `src/components/guided-routines/RoutineCard.css`. Equipment tags stay in one wrapping group; multi-equipment cards place this group beneath the muscle-group row. The `All` filter shows all five playable cards. Preserve filter labels, category associations, video IDs, destinations, thumbnails, hero content, and player behavior.

- Routine detail pages
Clicking a valid routine opens a detail page with:
    ```text
    [ Header ]
    [ Same category hero ]
    [ Centered video section viewport ]
    [ Back to Guided Routines pill ]
    [ Large centered responsive YouTube iframe ]
    [ Footer ]
    ```

The category hero remains above the video in the document. When a detail page opens, automatically position the video section in the viewport using immediate scroll behavior so the visitor does not need to manually scroll down. The video section should use a viewport-aware minimum height and center the responsive 16:9 iframe comfortably.

The back link should look like an inactive filter pill and return to the localized Guided Routines listing, preserving the current language and active filter when possible, for example `/muuva/en/guided-routines/?filter=Ring`.

- Video data
Keep routine data and video URLs centralized in:
`src/data/guidedRoutines.js`

YouTube embed URLs:
    - Ring: `https://www.youtube.com/embed/Ns9PKZRh2j4`
    - Ball: `https://www.youtube.com/embed/eZBYO-GSlVk`
    - Band: `https://www.youtube.com/embed/i9Ev0n22PYc`
    - Sliders: `https://www.youtube.com/embed/hcx_IU7NLf8`
    - All Equipment: `https://www.youtube.com/embed/7X87YbXHo9c`

The Sliders card is titled `Pilates Sliders Workout` and shows the clock with `15 min`, `Medium` intensity, `Full body` muscle group, and a `Slider` equipment pill, using the same metadata layout as the other workouts.

- Expected image assets
Header images:
    - `src/assets/images/guided-routines/headers/ring-header.png`
    - `src/assets/images/guided-routines/headers/ball-header.png`
    - `src/assets/images/guided-routines/headers/sliders-header.png`
    - `src/assets/images/guided-routines/headers/band-header.png`
    - `src/assets/images/guided-routines/headers/full-body-header.png`
    - `src/assets/images/guided-routines/headers/main-page.png`

Thumbnails:
    - `src/assets/images/guided-routines/thumbnails/ring-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/ball-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/sliders-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/band-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/full-body-routine-thumbnail.png`

All listed assets currently exist as `.png` files. The asset lookup also accepts `.webp` names, and missing assets render neutral placeholders without breaking the build.

- How to add another routine
Add or update one object in `src/data/guidedRoutines.js` with the routine `id`, `slug`, `titleKey`, `durationMinutes`, `intensity`, `muscleGroups`, `equipment`, `filters`, thumbnail filename, `thumbnailAltKey`, YouTube URLs, and matching category hero. Hero copy uses `titleKey` and `descriptionKey`. Add matching text entries, including SEO copy, to all four locale files. Keep equipment display labels separate from filter identifiers. Add the expected image file to the relevant `guided-routines` asset folder when ready. For a new public detail page, update the shared workout-slug manifest and assess pre-rendering, canonical/alternate links, sitemap generation, and production verification as described in sections 8.2–8.5.

- Visual direction
The page should feel curated, editorial, premium, and calm. Use the approved duration and intensity metadata above; do not invent additional values. Do not add search, ratings, progress UI, extra filters, YouTube UI in cards, or dense fitness-platform styling.
---

## 7. Important Rules for Codex

- Read this brief before making design or layout changes.
- Treat **Section 5: Site-wide Design Foundation** as the main source of truth for typography, colors, spacing, containers, and shared UI styling.
- Use visual references only as inspiration.
- Do not copy any external website exactly.
- Keep the design minimal, premium, calm, and editorial.
- Avoid sporty, loud, overly corporate, or generic fitness styling.
- Keep the code beginner-friendly and easy to understand.
- Use React + Tailwind CSS.
- Use reusable components.
- Prefer shared design tokens/classes/components over repeated hard-coded values.
- Make all pages responsive for desktop, tablet, and mobile.
- Preserve existing content unless the requested task explicitly includes copy changes.
- During foundation-cleanup tasks, do not redesign individual sections unless explicitly requested.
- Before making large structural changes, explain the plan first.
- After a major design-system pass, stop and allow visual review before making additional unrelated design changes.

## 8. Technical Requirements

- Build locally first.
- Use Vite + React + Tailwind CSS.
- Use local assets from the `src/assets/` folder.
- Use reference screenshots from the `references/screenshots/` folder.
- Load **Manrope** and **Newsreader** consistently through one font-loading approach; do not mix multiple font-loading methods.
- Use a reusable site/container pattern for global page alignment.
- Use shared components for recurring UI such as Header, Footer, and CTA/Button elements.
- No backend is needed for now.
- No additional hosting or domain setup is needed for the current design work.

### 8.1 Multilingual implementation

The homepage, Guided Routines listing and workout details, and shared interfaces support English (`en`), German (`de`), Dutch (`nl`), and Spanish (`es`). The same React components use `i18next`, `react-i18next`, and `i18next-browser-languagedetector`; language-specific URLs do not require duplicated page components.

#### Translation sources and coverage

- `src/i18n/index.js` initializes the browser instance through `src/main.jsx`. `src/i18n/resources.js` supplies the shared resources and translation options for browser rendering and static generation. All four catalogs are bundled; no translation server or runtime locale-file request is required.
- `src/i18n/locales/en.json`, `de.json`, `nl.json`, and `es.json` are authoritative for implemented interface and SEO copy. English preserves the approved source wording; `CONTENT.md` provides editorial excerpts and a key map rather than a second catalog.
- Active groups are `header`, `languages`, `hero`, `product`, `promo`, `lifestyle`, `footer`, `routines`, `privacy`, and `seo`. The older `site.title` entry remains in the catalogs; generated and browser document titles now use `seo.*`.
- Coverage includes all page copy, filter and metadata labels, header/footer, gallery and hotspot controls, carousel descriptions, newsletter Coming soon copy, Privacy drafts, accessible labels, and SEO titles/descriptions.
- Product Purchase retains the English heading `Get Your Pilates Kit`, no subtitle, and the square uniform `#F2EFE9` container. Localization does not change the kit image, five hotspot coordinates, or Amazon destination.

#### Detection, persistence, and synchronization

Language precedence is:

1. Explicit supported language in the URL.
2. Supported manual preference saved under localStorage key `muuva.language`.
3. First supported entry in `navigator.languages`, falling back to `navigator.language` if the list is absent or empty.
4. English when no supported preference is available.

Browser and saved-preference normalization handles case, underscores, and regional tags, for example `de-AT` → `de`, `nl-BE` → `nl`, and `es-MX` → `es`. Public route prefixes use the four supported base codes. English is also the missing-key fallback, a safeguard rather than permission to omit translations.

Automatic detection does not save a preference. Manual selection saves the language and navigates to the equivalent localized URL. Storage access is guarded: switching still works when storage is unavailable, and the explicit selected URL survives refresh; an unsaved preference cannot influence a later unlocalized entry.

`synchronizeLocation()` in `src/routing/navigation.js` reads the route, normalizes root/legacy links in place, and updates i18next only when its language differs from the URL. The App subscribes to navigation, `popstate`, and `hashchange` events. This keeps language and route state aligned without a route/i18next update loop. HTML `lang` updates with language selection; the SEO layer updates document title, description, canonical, and alternate links.

`LanguageSelector.jsx` retains the globe, uppercase active code, and chevron. Its radio menu lists English, Deutsch, Nederlands, and Español, marks the active option, and supports keyboard opening, arrows, Home/End, Enter/Space, Escape, Tab dismissal, and outside clicks. Selection/Escape restores trigger focus. Trigger/menu targets are at least 44px high with visible keyboard focus styles. Below 640px, the existing header navigation links remain hidden while the selector stays available.

#### Translation maintenance

- Update all four catalogs when changing headings, CTAs, navigation, accessible labels, form messages, or SEO copy. Consume complete phrases through `useTranslation()`; preserve approved English unless a content change is requested.
- Preserve interpolation names across languages: `{{language}}`, `{{number}}`, `{{year}}`, `{{title}}`, and `{{count}}`. Catalog values are plain text; React escapes rendered content. Durations remain numeric workout data, not translated identifiers.
- Do not translate MUUVA/Muuva, Calv200, domains, URLs, video IDs, route/category IDs, slugs, filenames, or asset paths. Language names remain native. Shared words such as Ring, Shop, Slider, or min may correctly match English.
- Filtering uses fixed IDs `All`, `Ring`, `Ball`, `Sliders`, `Band`, and `Full body`. `filterLabelKeys` maps them to display text. The last filter displays All Equipment in English and is distinct from the `fullBody` muscle-group metadata ID.
- Keep workout objects, React keys, and video URLs stable when switching language. Resolve text at render time rather than reconstructing language-specific data or remounting the iframe.
- Use natural responsive wrapping with Newsreader and Manrope rather than language-specific coordinates or reduced font sizes. Follow section 8.5 for verification, including separate browser checks.
- After translation edits, compare key sets and interpolation variables, check duplicate keys, and review all languages on home, listing, filtered, detail, unavailable, and form states. Test keyboard controls, manual persistence, gallery, filters, and video continuity.

### 8.2 Localized URL architecture

Cloudflare production uses Vite base `/` and public origin `https://muuva.nl`. The unchanged repository defaults (`/muuva/`, `https://calv200.github.io`) retain compatibility when no overrides are provided. Use command/environment overrides for the deployment target. The production route patterns are:

| Page | Pattern under the current base | Example |
| --- | --- | --- |
| Homepage | `/{language}/` | `/de/` |
| Guided Routines | `/{language}/guided-routines/` | `/nl/guided-routines/` |
| Workout detail | `/{language}/guided-routines/{slug}/` | `/es/guided-routines/ring/` |
| Privacy | `/{language}/privacy/` | `/de/privacy/` |

`/en/` is the production English homepage (`/muuva/en/` with the compatibility base). `src/routing/routeManifest.js` defines supported languages, stable `routineSlugs`, and public `pagePaths`; workout data imports its slug definitions. Slugs and filter IDs stay independent of translated labels.

`src/routing/urls.js` parses locations and generates base-aware localized URLs and filter queries. `src/routing/navigation.js` implements browser-history navigation and compatibility normalization. `src/routing/RouteContext.jsx` shares the current route, including query state, with page components. Use these utilities instead of concatenating the deployment base in components.

Internal links have real localized `href` values. Ordinary same-origin app clicks use `history.pushState` and update the mounted App; modified clicks, new tabs, downloads, and external links retain native behavior. Back/Forward updates the page, filter, and URL language. Language switching preserves the equivalent page, workout slug, query values, and section anchor without reloading or unnecessarily replacing an active video iframe.

Filter state uses query parameters, for example `/muuva/en/guided-routines/?filter=Ring`. `filterQuery()` changes or removes only the filter parameter, preserving unrelated query values. All resets to the complete collection; workout cards and the back link retain the applicable filter.

The unlocalized `/muuva/` entry chooses a language using section 8.1. Existing `#/`, `#/guided-routines`, detail hash routes, and filtered hash links are parsed for backward compatibility and replaced in browser history with their equivalent localized paths. Compatibility normalization uses `replaceState`, not an HTTP redirect or a generic 404 fallback. Old hash-query values take precedence if the outer query repeats the same key. Ordinary section anchors such as `#product` remain separate from legacy page hashes; Shop links target the localized homepage's Product Purchase section.

New navigation must not reintroduce hash-based page routes. Static files support direct entry and refresh for every manifest route; unknown slugs are not generated. Cloudflare production uses root base `/`; the `/muuva/` examples document retained subpath compatibility.

### 8.3 Static pre-rendering and hydration

The route manifest currently produces **32 localized public HTML pages**: four homepages, four Guided Routines listings, twenty detail pages (five workout slugs in four languages), and four Privacy pages. The separate `dist/index.html` remains a compatibility/language-detection entry, with its canonical pointing to the English homepage; it is not an additional localized page or sitemap entry.

`npm run build` runs `build/prerender.js`:

1. Vite builds the client application and base-aware hashed assets. `build/localizedEntries.js` emits the manifest's initial HTML entry shells.
2. A separate Vite server bundle compiles `src/entry-server.jsx` into a temporary build-cache directory. For each manifest route, `renderPage()` creates a fresh i18next instance with an explicit language and renders the existing React components through `I18nextProvider` and `renderToString`.
3. The build replaces each localized shell with real page HTML and embedded canonical route state. Browser-only operations remain in browser callbacks/effects or guarded initialization; the server render does not depend on browser detection or storage. Per-page instances prevent one generated language from leaking into another.
4. `build/html.js` inserts localized `lang`, title, description, canonical, and language-alternate tags, preserving Vite's client asset references. The root compatibility entry receives English-home metadata.
5. The same public route definitions generate `dist/sitemap.xml` and `dist/robots.txt`. Temporary server output is cleaned from the build cache.

The final localized files contain readable translated main content and metadata in the initial HTML response, rather than an empty client-only React root. No running server renderer, SPA rewrite rule, or 404 fallback is needed on GitHub Pages.

`src/main.jsx` first synchronizes the browser location. Generated pages embed route JSON in `#muuva-prerender`; the client initially renders that same canonical route and calls `hydrateRoot` against the existing HTML. The App then applies the actual query/filter and anchor state after hydration, avoiding a mismatch between the static unfiltered page and a filtered request. `RouteContext` supplies route data without browser-only reads during rendering. Entries without pre-rendered state use `createRoot`, including the compatibility shell and development entry.

Adding a public page or language requires assessing the shared manifest, component/data mappings, all locale/SEO entries, pre-rendering, and verification expectations together. Generated pages, navigation, metadata, and sitemap must remain synchronized; do not maintain a separate manual list of workout URLs.

### 8.4 Multilingual SEO

`seo.*` in all four locale JSON files owns SEO copy. `seo.home` and `seo.routines` supply page-specific titles and descriptions. `seo.workout.title` interpolates the translated workout name; `seo.workout.descriptions.<slug>` provides the relevant workout description. The title metadata does not replace the approved visible page headings.

`src/seo/metadata.js` computes shared metadata for static generation and the browser. Each supported localized page has one self-canonical absolute URL and five alternate links: `en`, `de`, `nl`, `es`, and `x-default`. Each alternate points to the equivalent page and workout slug; `x-default` points to that page's English version. Relationships are reciprocal and reference generated public routes. Filter queries and section anchors are omitted from canonical and alternate URLs.

`src/seo/SeoMetadata.jsx` updates the browser head after page or language navigation without accumulating duplicate canonical/description/alternate tags. Generated HTML already has the correct localized metadata and HTML `lang` before JavaScript runs.

`src/seo/site.js` centralizes the public origin, defaulting to `https://calv200.github.io`, with production using `VITE_PUBLIC_SITE_ORIGIN=https://muuva.nl`. Canonical, alternate, and sitemap URLs combine it with the configured Vite base and route helpers. A hosting/domain migration must update and verify both the public origin and base; changing display copy does not change deployment URLs.

The sitemap includes exactly the public localized canonical routes, with language alternates in the XHTML namespace. It excludes filter URLs, invalid slugs, development routes, and root/legacy compatibility URLs. The generated robots file allows crawling and references the absolute sitemap URL, `https://muuva.nl/sitemap.xml` in production. Under project hosting, this file is served at `/muuva/robots.txt`; it does not configure the hostname's root `/robots.txt`.

New public pages or languages must receive appropriate SEO copy and equivalent canonical/alternate relationships, appear in pre-rendering and sitemap output, and pass production verification. Metadata, routes, and sitemap are derived from shared definitions rather than copied across components.

### 8.5 Production verification and deployment

For application changes, run:

```sh
npm test
npm run build
npm run test:production
git diff --check
```

Routing tests cover URL generation, compatibility, queries, stable filters, and base paths. SEO tests cover translated metadata, canonical/alternate relationships, HTML insertion, and sitemap generation. Production-verifier tests use temporary fixtures and intentional defects, including confirmation that the command fails with a nonzero exit status.

`build/verify-production.js` inspects actual generated output against the shared manifest, SEO helpers, and locale files. It checks the expected localized HTML files, rendered main content/headings, language, localized titles/descriptions, single canonical, reciprocal hreflang, resolvable local JS/CSS references, sitemap routes/alternates, robots configuration, unresolved keys/interpolation, development addresses, and unwanted noindex directives. It reads generated markup; it does not execute browser interactions or verify the live host.

`.github/workflows/deploy-pages.yml` uses Node 20 and runs `npm ci`, `npm test`, `npm run build`, and `npm run test:production` before uploading `dist`. A required failure prevents artifact upload and the dependent deployment job. Deployment is configured for pushes to `main` and manual workflow dispatch. `git diff --check` is a separate local review check, not a step in that workflow.

See [production verification instructions](docs/production-verification.md) for the detailed checklist and browser/live-host checks. Local automated success does not establish that a hosted workflow, deployment, or search-engine indexing has succeeded.

### 8.6 Privacy and analytics readiness

Confirmed by the owner: MUUVA is a Netherlands sole proprietorship (eenmanszaak), KvK 99637588, privacy contact `contact@muuva.nl`, website `https://muuva.nl`. Full proprietor identity and the required postal address remain unverified; do not publish a residential address without approval. Privacy pages retain their draft label and draft-update date.

The existing Umami Cloud integration uses Hobby, EU analytics storage and six-month standard analytics retention. Operational/security logs and backup retention remain separate and unverified. It is disabled by default and excluded from Preview; intended production configuration and manual activation steps are in [production verification](docs/production-verification.md). The hook retains only `website`, `hostname`, `url`, `referrer`, `title`, with approved routes/titles, filtered campaigns, origin-only external referrers, DNT and navigation deduplication. No custom visitor IDs/events, ad pixels or recordings are added. Provider IP/User-Agent processing and non-EU operations remain possible.

The owner intends to pursue the Dutch limited-impact analytics exception and GDPR Article 6(1)(f); neither assessment is complete. Consent-management work and the standard YouTube embed privacy review are postponed, not legally resolved. No cookie banner or player changes are implemented. See [the compliance review](docs/privacy-compliance-review.md) for DPA/transfers/retention and publication blockers. Technical readiness is not legal approval.

### 8.7 Known limitations and pending launch work

Cloudflare Pages is the current host. Pass A.3 is implemented locally on staging only; deployment and analytics activation are separate owner actions. The Privacy drafts are available at `/en/privacy/`, `/de/privacy/`, `/nl/privacy/`, `/es/privacy/` through one shared component, with localized footer links, static HTML and SEO. The newsletter form has been removed in favor of a noninteractive Coming soon teaser; no subscription backend or email collection exists. Other footer navigation/policy placeholders remain unchanged.

Static verification is separate from browser checks for hydration, language/storage behavior, Back/Forward, anchors, filters, active videos, focus, galleries, forms, carousel, and responsive layout. Third-party playback/audio and actual hosted responses/caching require separate validation. The production verifier targets the known generated markup format, not general-purpose HTML validation.

Pre-rendering provides translated initial content and discoverable canonical URLs, but search-engine crawling and indexing are not guaranteed. The unlocalized compatibility entry and legacy migration still rely on browser JavaScript; only the localized manifest routes are included in the sitemap. No live deployment or indexing result should be claimed from local output checks alone.

#### Media and editorial limitations

Product packaging, printed guides, phone screens, photographs, and video imagery can contain baked-in English. These assets remain unchanged. The website translates surrounding interface text and the iframe's accessible title; YouTube owns the embedded player's controls and their language. Website language selection does not localize spoken audio. Captions, subtitles, or localized video versions require separate media work.

Final QA on 2026-10-17 found the Sliders embed (`hcx_IU7NLf8`) reporting a private video. Other live YouTube titles also differ from approved card metadata: Ring and Ball refer to 20-minute videos while the cards show 15 minutes; Band refers to a no-equipment workout; All Equipment refers to a 30-minute dumbbell workout while its card shows 20 minutes and the kit equipment. IDs and card metadata were preserved. The owner should verify availability and intended destinations before publishing. The live embeds loaded, but playback did not advance in the automated Chromium check; uninterrupted playback and audio still require a manual browser/device check.

Native-language brand review is recommended for the localized Product Purchase heading, Styled by You adaptations, newsletter heading, and promotional descriptions. In particular, the DE/NL/ES carousel headings adapt the English phrase to “Your style. Your Muuva.” These are implemented editorial choices, not literal translations; final QA does not replace a native editor's brand-voice review.
