# Product Purchase Section Copy

## Product title
Pilates Essential Kit

## Supporting copy
Four essentials. Endless ways to move.

## Buy CTA
Buy on Amazon →

## Gallery Buy CTA
Buy on Amazon →

## Amazon link
https://www.amazon.de/dp/B0GZ4RBMX9

## Presentation and gallery behavior
Left-aligned static title, description and one Buy on Amazon CTA in the square, unified `#F3EBE0` featured container. On wide desktop the title visually wraps as `Pilates` / `Essential Kit`, and the full-kit image sits across the center and right; smaller layouts stack the text above the image. The title and rounded CTA use deep green `#304C40`. No dynamic selection copy or routine links. Hero asset: `src/assets/images/Products/full-kit-cutout.png`, derived from `kit-billboard.png`.

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

Equipment items are separate non-interactive pills. The visible All Equipment filter uses the internal `Full body` category; every workout card still shows `Full body` as its muscle-group pill. No uppercase category label appears above card titles. The `All` filter shows all five workouts.

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
