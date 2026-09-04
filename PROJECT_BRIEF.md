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

A separate **Guided Routines page** now exists as a GitHub Pages-safe routed experience and can continue to be refined after visual review.

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

Use only two main font families across the website.

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
- Main warm cream: `#FBF8F2`
- Secondary warm neutral: `#F2EFE9`
- Soft beige: `#DFD3BD`
- White: `#FFFFFF` only when it is visually intentional, such as photography or a defined card/image area

#### Borders / dividers
- Soft neutral border: `#D7D0C6`

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

### 6.3 Product Purchase Section Reference
- Source image
`references/screenshots/product-purchase-section-billboard-reference.png`

- Purpose
This section presents the Pilates Essential Kit as a calm editorial product billboard rather than an e-commerce product-detail panel.

- Section placement
Place this section directly after the hero video.

- Suggested page flow:
    ```text
    [ Header ]
    [ Hero video ]
    [ Product Purchase Section ]
    [ Guided Routines promotional section ]
    [ Styled by You lifestyle carousel ]
    [ Footer ]
    ```

- Overall feeling
The section should feel minimal, premium, spacious, product-first, and campaign-like. It should avoid generic Shopify, Amazon listing, or product-configuration styling.

- Layout description
Use a centered vertical billboard composition:
    ```text
    Pilates Essential Kit
    Everything you need to make Pilates part of your everyday routine.
    [ More info ] [ Buy on Amazon -> ]

    [ Large transparent product kit composition ]
    ```

- Product title
    - Text: `Pilates Essential Kit`
    - Use **Newsreader**.
    - Use dark soft charcoal from the design system.
    - The title may use the upper end of the established section/display heading scale.
    - Keep the line-height tight but comfortable.

- Supporting copy
    - Text: `Everything you need to make Pilates part of your everyday routine.`
    - Use **Manrope**.
    - Use the muted text color from the design system.
    - Keep it clearly smaller than the title but comfortably readable.

- CTAs
    - Show `More info` and `Buy on Amazon ->` side by side on desktop.
    - Use the shared MUUVA CTA/button foundation.
    - Keep the treatment minimal, editorial, and restrained.
    - Do not use Apple-style blue or Amazon-orange styling.
    - Preserve the existing Amazon destination.

- Main product image
    - Use the transparent product composition asset:
    `src/assets/images/Products/kit-billboard.webp`
    - The image has a transparent background and natural/contact shadows.
    - Display it with `object-contain`.
    - Let it sit directly on the CSS-controlled section background.
    - Do not add a white/beige rectangle behind it.
    - Do not add a heavy CSS drop shadow.
    - Preserve the horizontal/wide composition.

- Gallery behavior
    - The main billboard image is not the gallery trigger.
    - The `More info` button opens the existing product gallery/lightbox.
    - The gallery should open as an overlay/modal, not a separate page.
    - Preserve previous/next controls, close control, Escape-to-close behavior, and keyboard arrow navigation where available.
    - Keep the gallery minimal and premium with a dark or softly blurred overlay.

- Gallery images
Keep this existing image order:
    `src/assets/images/Products/ring1.png`
    `src/assets/images/Products/ball1.png`
    `src/assets/images/Products/band1.png`
    `src/assets/images/Products/slider1.png`
    `src/assets/images/Products/kit1.png`

- Removed product-detail UI
Do not show:
    - the small `muuva` product/category label above the title
    - `COLOR` label
    - beige color selector or swatch
    - product configuration UI
    - horizontal divider lines
    - the long contents line
    - product-detail panel styling

- Responsive behavior
    - Desktop: centered title, supporting copy, side-by-side CTAs, large wide product composition below.
    - Tablet: maintain centered hierarchy and scale the product image intentionally.
    - Mobile: keep title and supporting copy centered, allow CTAs to stack if needed, and preserve the full wide kit composition with `object-contain` and no horizontal overflow.

### 6.4 Guided Routines Page

- Page route
Use a GitHub Pages-safe hash route:
`#/guided-routines`

Routine detail pages use:
`#/guided-routines/ring`
`#/guided-routines/ball`
`#/guided-routines/band`
`#/guided-routines/full-body`

The Sliders routine has no video URL yet, so it should not link to a detail page until a URL is added.

- Routing decision
The project is deployed as a static Vite build through GitHub Pages. Use lightweight hash routing in React instead of `BrowserRouter` so direct entry to the deployed site does not require a server-side fallback.

- Page structure
    ```text
    [ Header ]
    [ Guided Routines dynamic hero ]
    [ Workout filters ]
    [ Routine grid ]
    [ Footer ]
    ```

- Default hero
When no filter is active, show:
    - Heading: `Guided routines`
    - Description: `Move with your essentials. Follow simple Pilates sessions designed to make movement part of your everyday routine.`

Do not show an individual product image or product CTA in the default state.

- Filters
Show only:
    - Ring
    - Ball
    - Sliders
    - Band
    - Full body

Only one filter can be active at a time. Clicking the active filter again clears it and returns to the default state showing all available routines.

- Dynamic hero behavior
The same hero area changes when a filter is active.

Equipment filters use a two-column editorial layout on desktop:
    ```text
    [ Text/content ] [ Product image or neutral placeholder ]
    ```

Full body uses a lifestyle image or neutral placeholder and does not show the Pilates Essential Kit CTA.

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

Full body:
    - Heading: `Full Body Routines`
    - Description: `Balanced sessions designed to connect strength, control and mobility from head to toe.`

- Routine grid
Use a clean editorial card grid. Cards should show a custom thumbnail or neutral placeholder, a custom MUUVA play button overlay, a routine title, and category metadata. Do not load YouTube iframes inside the grid.

- Routine detail pages
Clicking a valid routine opens a detail page with:
    ```text
    [ Header ]
    [ Same category hero ]
    [ Back to Guided Routines ]
    [ Large centered responsive YouTube iframe ]
    [ Footer ]
    ```

The back link should return to `#/guided-routines` and preserve the active filter when possible, for example `#/guided-routines?filter=Ring`.

- Video data
Keep routine data and video URLs centralized in:
`src/data/guidedRoutines.js`

Temporary YouTube embed URLs:
    - Ring: `https://www.youtube.com/embed/Ns9PKZRh2j4`
    - Ball: `https://www.youtube.com/embed/eZBYO-GSlVk`
    - Band: `https://www.youtube.com/embed/i9Ev0n22PYc`
    - Full body: `https://www.youtube.com/embed/7X87YbXHo9c`

No Slider video URL exists yet. Show `New routine coming soon.` for the Sliders filter.

- Expected image assets
Header images:
    - `src/assets/images/guided-routines/headers/ring-header.png`
    - `src/assets/images/guided-routines/headers/ball-header.png`
    - `src/assets/images/guided-routines/headers/sliders-header.png`
    - `src/assets/images/guided-routines/headers/band-header.png`
    - `src/assets/images/guided-routines/headers/full-body-header.png`

Thumbnails:
    - `src/assets/images/guided-routines/thumbnails/ring-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/ball-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/sliders-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/band-routine-thumbnail.png`
    - `src/assets/images/guided-routines/thumbnails/full-body-routine-thumbnail.png`

Missing assets should render as neutral placeholders and must not break the build.

- How to add another routine
Add or update one object in `src/data/guidedRoutines.js` with the routine `id`, `slug`, `title`, `meta`, `filters`, thumbnail filename, YouTube URLs, and matching category hero. Add the expected image file to the relevant `guided-routines` asset folder when ready.

- Visual direction
The page should feel curated, editorial, premium, and calm. Do not add search, ratings, fake durations, difficulty badges, progress UI, many filters, YouTube UI in cards, or dense fitness-platform styling.
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
