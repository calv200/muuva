# Copy authority and localization

The approved website interface is available in English, German, Dutch, and Spanish. Runtime copy is authoritative in `src/i18n/locales/en.json`, `de.json`, `nl.json`, and `es.json`. The English excerpts below summarize the approved editorial content; update the JSON files whenever copy changes and keep this reference aligned. Do not copy the complete translated catalogs into this document.

| Locale key group | Content |
| --- | --- |
| `header`, `languages`, `site` | Navigation, native language names, selector labels, document title |
| `hero` | Homepage hero/video accessibility labels |
| `product` | Purchase title and CTA, gallery controls, five hotspots and image descriptions |
| `promo` | Homepage Guided Routines promotion |
| `lifestyle` | Styled by You heading, image descriptions and carousel controls |
| `footer` | Newsletter, navigation, policies, about text, legal credit and form messaging |
| `routines` | Listing and category heroes, filter labels, workouts, metadata, player title, back links, placeholders and unavailable states |

MUUVA/Muuva and Calv200 remain unchanged. Translate interface copy, not URLs, filenames, asset paths, category IDs, route slugs, or YouTube IDs. Keep interpolation variables unchanged across languages. See `PROJECT_BRIEF.md` section 8.1 for detection, persistence, terminology, and maintenance rules.

Before publishing, request native-language brand review of the translated kit heading, promotional descriptions, newsletter heading, and Styled by You adaptations. The DE/NL/ES carousel headings adapt the English phrase to “Your style. Your Muuva.” rather than translate it literally. Preserve the implemented wording until an editorial change is approved.

# Shared Header and Hero Copy

English navigation: Shop · Training sessions. The language selector shows EN, DE, NL, or ES and lists English, Deutsch, Nederlands, Español. The homepage hero has no visible heading or CTA; its video and section accessibility descriptions are in `hero`.

# Product Purchase Section Copy

## Product title
Get Your Pilates Kit

## Buy CTA
Buy on Amazon →

## Gallery Buy CTA
Buy on Amazon →

## Amazon link
https://www.amazon.de/dp/B0GZ4RBMX9

## Presentation and gallery behavior
Left-aligned title and one Buy on Amazon CTA in the square, unified `#F2EFE9` featured container. The title wraps naturally and has no subtitle. On wide desktop the full-kit image sits across the center and right; smaller layouts stack the title and CTA above the image. The title and rounded CTA use deep green `#304C40`. No dynamic selection copy or routine links. Hero asset: `src/assets/images/Products/full-kit-cutout.png`, derived from `kit-billboard.png`.

Hotspot labels and destinations, under `src/assets/images/Products/`:

- View Pilates Ring photos: `ring1.png`
- View Pilates Ball photos: `ball1.png`
- View Resistance Band photos: `band1.png`
- View Pilates Sliders photos: `slider1.png`
- View workout guide and complete kit photos: `kit1.png` (temporary until a dedicated guide image is supplied)

Hero-image clicks always open root-level `kit1.png`, not the archived copy. Empty section space outside the hero image does not open the gallery. Image order: Ring, Ball, Band, Sliders, complete kit. Hotspot gallery destinations are set in `src/data/productComposition.js`.

# Guided Routines Section Copy

## Label
Included with your kit

## Headline
Guided routines included

## Supporting text
Your kit includes complimentary access to guided Pilates routines designed to help you move with confidence, from your first session onwards.

## CTA
Explore guided routines →

# Guided Routines Page Copy

## Default page heading
Guided routines

## Default page description
Move with your essentials. Follow simple Pilates sessions designed to make movement part of your everyday routine.

## Filters
All
Ring
Ball
Sliders
Band
All Equipment

## Ring hero
Pilates Ring Routines
Add resistance and control to familiar movements while engaging your core, legs and upper body.

## Ball hero
Pilates Ball Routines
Small prop, endless possibilities. Use the ball to challenge stability, alignment and deeper muscle control.

## Sliders hero
Slider Routines
Turn simple movements into controlled, full-range exercises that challenge strength, stability and coordination.

## Band hero
Resistance Band Routines
Add just the right amount of resistance to strengthen, activate and move with more intention.

## All Equipment filter hero
Full Body Routines
Balanced sessions designed to connect strength, control and mobility from head to toe.

## Equipment hero text CTA
Part of the Pilates Essential Kit · Explore the kit →

## Workout card titles and metadata

| Title | Duration | Intensity | Muscle group | Equipment pills |
| --- | --- | --- | --- | --- |
| Pilates Ring Workout | 15 min | Medium | Full body | Ring |
| Pilates Ball Workout | 15 min | Medium | Full body | Ball |
| Pilates Sliders Workout | 15 min | Medium | Full body | Slider |
| Resistance Band Workout | 15 min | Medium | Full body | Band |
| All Equipment Workout | 20 min | Medium | Full body | Band, Ball, Ring, Slider |

Equipment items are separate non-interactive pills. The visible All Equipment filter uses the stable internal `Full body` category; every workout card still shows `Full body` as its English muscle-group pill, resolved from the separate `fullBody` metadata ID. No uppercase category label appears above card titles. The `All` filter shows all five workouts. Translated labels never determine filter behavior or routes.

The displayed titles and thumbnail descriptions use `routines.workouts.<slug>`, category heroes use `routines.categories.<slug>`, and filter text uses `routines.filters`. Workout duration values, category associations, order, and video destinations remain in `src/data/guidedRoutines.js`.

## Navigation and fallback messages

- Back: ← Back to Guided Routines
- Unavailable heading: Routine not available
- Unavailable description: This routine is not ready yet.
- Empty collection: New routine coming soon.
- Missing asset: Image placeholder / Image unavailable

Video audio, embedded player controls, and text printed into thumbnails or other media are not translated by these interface catalogs. See the media QA findings in `PROJECT_BRIEF.md`: the Sliders video currently reports private, and several live video titles differ from the approved card metadata. Verify media ownership, availability, and intended destinations before publishing; this synchronization preserves the current video IDs and card copy.

# Lifestyle Carousel Section Copy

## Heading
Styled by You.

# Footer Copy

## Newsletter heading
Stay in the move.

## Newsletter description
Sign up for exclusive Muuva content and pilates inspiration

## Newsletter confirmation
You have been subscribed to our newsletter.

## Newsletter field and validation

- Field label: Email address
- Placeholder: E-mail
- Submit accessibility label: Subscribe to newsletter
- Missing value: Please enter your email address.
- Invalid email: Please enter a valid email address.

All form messages use `footer` locale entries and update when the language changes. The browser's native email validation remains in use.

## About heading
About Muuva

## About text
Based in Amsterdam, Muuva creates beautifully designed and sustainably made Pilates gear for movement practices at home and in the studio.

## Navigation links
Behind Muuva · Contact Us · Wholesale Muuva · Apply for Wholesale · Caring For Your Muuva · Sustainability Commitment

## Policy links
FAQs · Privacy Policy · Refund Policy · Shipping Policy · Terms of Service · Terms of Use

## Legal line
© 2026, Muuva. Website designed by Calv200.

The newsletter form currently shows its confirmation through local page state; it is not connected to a subscription service. Footer navigation and policy labels currently use `#` placeholder links.
