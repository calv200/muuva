# Landing Page Project Brief

## 1. Goal
Create a local landing page for muuva.

## 2. Target audience
Women who want stylish, premium Pilates products for home workouts and everyday movement.

## 3. Desired style
Nordic, calm, premium, feminine, clean

## 4. Page structure
1. Header
2. Hero video
3. Intro text below hero
4. Product purchase
5. Guided Routines
6. Styled by You Gallery
7. Footer

## 5. Visual References

### 5.1 Header Reference
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
    - Logo color is muted green / grey-green.
    - Logo should feel grounded, soft, and premium.
    - Registered trademark symbol should sit close to the logo, aligned near the top-right of the wordmark.
    - Logo should not be too large, but it should remain clearly visible.

- Navigation links, Navigation items shown in the sketch:
    - Shop
    - Training sessions

- Style direction:
    - Serif italic typeface.
    - Elegant, editorial, slightly fashion-like.
    - Black or very dark charcoal text.
    - Underlined links.
    - Links should feel refined, not bold or sporty.
    - Spacing between links should be generous.
    - The navigation should sit visually closer to the right side than the center.

- Utility icons, Icons shown on the far right:
    - Search icon
    - Globe / language icon

- Style direction:
    - Thin line icons.
    - Dark charcoal color.
    - Clean, minimal, and simple.
    - Icons should align vertically with the navigation links.
    - Icon size should be balanced with the text, not oversized.

- Background color. The header background should use a warm neutral beige similar to the sketch.
    Suggested starting values:
    - `#d8cbb0`
    - `#d9ccb2`
    - `#ded2ba`

- Typography direction
    Use a contrast between:
    - A soft, modern logo wordmark.
    - Elegant italic serif navigation links.
    - Minimal outline utility icons.

- Possible navigation font direction:
    - Editorial serif italic
    - High-fashion inspired
    - Elegant but readable

- Avoid:
    - Sporty fonts
    - Heavy sans-serif navigation
    - Rounded playful fonts
    - Corporate-looking menus

- Header structure
    Recommended desktop structure:
    ```text
    [ muuva® ]                                      [ Shop ] [ Training sessions ]   [ Search icon ] [ Globe icon ]
    ```

### 5.2 Hero Section Reference
- Source image
`references/screenshots/hero-section-sketch.png`

- Purpose
This sketch defines the desired layout direction for the hero section, including the header, hero video, and introductory text block placed directly underneath the video.

- Hero layout description
    The hero section should be composed of three main parts:
    1. Header at the top.
    2. Hero video directly below the header.
    3. Introductory text block directly below the video.

The text block should not overlay the video. It should appear underneath the video, centered on a clean light background.

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

- Text block below video
    Place the following phrase directly underneath the video:
    - Headline:
    `Pilates essentials,`
    - Subtitle:
    `Styled for everyday movement.`

- Text block positioning
    - The text should be centered horizontally.
    - It should appear immediately after the hero video.
    - Use generous vertical breathing room, but keep it visually connected to the video.
    - The block should feel minimal, calm, and premium.
    - The headline should be visually stronger than the subtitle.
    - The subtitle should sit directly underneath the headline.

- Text style direction
    - Use clean, elegant typography.
    - Avoid sporty or generic fitness styling.
    - The text should feel editorial and refined.
    - Use dark charcoal or soft black text.
    - Background should be light, warm, and neutral.

- Suggested structure
    ```text
    [ Header ]
    [ Full-width hero video ]
    [ Centered text block ]
    Pilates essentials,
    Styled for everyday movement.
    ```

### 5.3  Product Purchase Section Reference
- Source image
`references/screenshots/product-purchase-section-sketch.png`

- Purpose
This section should appear after the user scrolls down from the hero section. It presents the Pilates Essential Kit as the main product and gives the visitor a clear path to buy it on Amazon.

- Section placement
Place this section directly after the hero/introduction area.

- Suggested page flow:
    ```text
    [ Header ]
    [ Hero video ]
    [ Centered intro text ]
    Pilates essentials,
    Styled for everyday movement.
    [ Product Purchase Section ]
    ```

- Overall feeling
The section should feel minimal, premium, spacious, and product-focused. It should look closer to a refined e-commerce product page than a loud fitness sales page.

- Layout description
    - Use a two-column desktop layout:
    ```text
    [ Large product image / product collage ]        [ Product title and purchase information ]
    ```

    - Left side:
        - Large product visual.
        - The image should show the full Pilates Essential Kit clearly.   
        - Product should feel clean, premium, and centered.
        - Use lots of white or warm neutral negative space.

    - Right side:
        - Small brand/category label above the title.
        - Large product title.
        - One color option only: Beige.
        - A clear Buy on Amazon action.
        - Minimal supporting details.

- Product image area
    - Use the beige Pilates kit product images from the asset folder.
    - Main image should show the full kit or a polished product collage.
    - Image should be large and visually dominant.
    - Keep background clean and neutral.
    - Avoid cluttered product grid styling.
    - The product should appear premium and editorial.
    - Product title

- Titles
    The title should be large, clean, and easy to read.
    - Product title: Pilates Essential Kit
    - Optional subtitle or expanded product description:
    Pilates Ring · Resistance Band · Soft Pilates Ball · Sliders · Pump · Carry Bag · Guide

- Product color options
Only show one color option:
    Beige
Do not show multiple color swatches.
If a color indicator is used:
    Show only one beige circle.
    Do not include brown, pink, black, or any other color options.
    The selected color should be clearly beige.

- CTA
Replace the reference text View full details with:
Buy on Amazon

- CTA behavior:
    - The Buy on Amazon text/button should be clearly visible.
    - It should link to the Amazon product page once the final Amazon URL is available.
    - For now, use a placeholder link such as #.
    - The design should feel elegant, not aggressive.
    - Avoid using a loud orange Amazon-style button unless requested later.
    - The CTA may be styled as an elegant text link with arrow or as a refined button.
    - Suggested CTA text: Buy on Amazon →

- Image click behavior
    When the user clicks the main product image, open a product image gallery / reel.
    - The gallery should:
        - Display all product images already stored in the asset folder.
        - Open as a modal or lightbox overlay.
        - Allow the user to move through images.
        - Include previous and next controls.
        - Allow closing the gallery.
        - Work on desktop and mobile.
        - Support keyboard close with Esc if possible.
        - Keep the design minimal and premium.

- Product gallery / reel behavior
    The image reel should use the product images from:
    `src/assets/images/product/`

-  Images order for the reel
    `src/assets/images/product/kit1.png`
    `src/assets/images/product/ring1.png`
    `src/assets/images/product/ball1.png`
    `src/assets/images/product/ball_exercise.png`
    
- Gallery design direction
    - Dark or softly blurred overlay behind the image.
    - Large centered image.
    - Minimal arrows for previous/next.
    - Small close button in the top-right.
    - Optional thumbnail row at the bottom.
    - Avoid busy carousel styling.
    - The gallery should feel clean, premium, and editorial.

- What to borrow from the sketch
    Two-column product layout.
    Large product image on the left.
    Product information on the right.
    Clean white or neutral background.
    Minimal product purchase feeling.
    Clear CTA on the right side.
    Premium spacing.

- What to change from the sketch
    Show only one color: Beige.
    Replace View full details with Buy on Amazon.
    Do not include multiple color options.
    Do not use the exact reference product layout too literally.
    Do not include unnecessary e-commerce elements unless needed.

- What not to do
    Do not make the section look like a generic Shopify template.
    Do not use loud discount badges.
    Do not show multiple product colors.
    Do not make the CTA too aggressive.
    Do not overcrowd the section with too much text.
    Do not make the gallery open a new page; it should open as an overlay/modal.

## 5.4 Guided Routines Section Reference
- Section name
Guided Routines

- Source reference image
`references/screenshots/guided-routines-section-reference.png`

- Purpose
This section should communicate that the Pilates Essential Kit includes complimentary access to a digital product: guided Pilates routines. It should add value to the physical kit and make the product feel like a complete movement experience, not only a set of accessories.

- Section placement
Place this section directly after the Product Purchase Section and before the Styled by You Gallery Section.

- Suggested page flow:
    ```text
    [ Product Purchase Section ]
    [ Guided Routines Section ]
    [ Styled by You Gallery Section ]
    [ Footer ]
    ```

- Overall feeling
The section should feel calm, premium, modern, and supportive. It should introduce the digital content in a clean editorial way, without looking promotional or overly sales-focused.

- Layout description
Use a two-column desktop layout:
    ```text
    [ Lifestyle image ]        [ Guided routines content block ]
    ```

- Left side
    - Display one large lifestyle image.
    - The image should show a woman using or exercising with the Pilates kit in a warm, calm home environment.
    - The image should occupy approximately 50% of the section width.
    - Use an edge-to-edge image within its half of the section.
    - The image should feel natural, aspirational, and aligned with the premium muuva aesthetic.

- Right side
    - Use a soft, very light neutral or muted pale background.
    - Place a short headline, supporting text, and CTA centered vertically inside the content area.
    - Keep generous empty space around the text.
    - The content block should feel refined and minimal.

- Content direction
    - Small optional label:
    `Included with your kit`

    - Headline:
    `Guided routines included`

    - Supporting text:
    `Your kit includes complimentary access to guided Pilates routines designed to help you move with confidence, from your first session onwards.`

    - CTA:
    `Explore guided routines →`

- CTA behavior
    - For now, use a placeholder link such as `#`.
    - The CTA can be styled as a refined pill-shaped button or an elegant text link.
    - It should feel premium and subtle, not loud or overly commercial.
    - Do not use strong Amazon orange or bright fitness-style colors.

- Visual style direction
    - The right-side background should contrast softly with the image while remaining within the neutral muuva palette.
    - Keep the design editorial, calm, and spacious.
    - Use dark charcoal text.
    - The headline should be visually stronger than the body text.
    - The CTA should be clearly visible but understated.

- Desktop layout
    - Image on the left.
    - Text content block on the right.
    - Both sides should have equal or near-equal width.
    - The section should feel like one horizontal visual block.

- Mobile layout
    - Stack the layout vertically.
    - Show the image first.
    - Show the text content block underneath.
    - Maintain comfortable padding and centered text.
    - Avoid making the content block feel too tall or empty on small screens.

- Lifestyle image asset
    `src/assets/images/Model/ball_exercise1.png`
    - Do not use external images unless explicitly requested.

- What to borrow from the sketch
    - Two-column layout.
    - Lifestyle image on the left.
    - Soft contrasting content panel on the right.
    - Short value-focused message.
    - Centered CTA within the text panel.

- What to change from the sketch
    - Use muuva branding and tone.
    - Do not mention any reference brand.
    - Keep the copy more premium and aligned with the muuva identity.
    - Use `Guided routines included` rather than heavily promotional messaging.

- What not to do
    - Do not make it look like an advertisement banner.
    - Do not overcrowd the section with multiple benefits or icons.
    - Do not use bright blue, neon, or sporty colors.
    - Do not include app screens, login forms, or membership details yet.
    - Do not imply paid subscriptions or ongoing fees.

## 6. Important Rules for Codex
- Use this brief as the main design direction.
- Use visual references only as inspiration.
- Do not copy any external website exactly.
- Keep the design minimal, premium, calm, and editorial.
- Avoid sporty, loud, or generic fitness styling.
- Keep the code beginner-friendly and easy to understand.
- Use React + Tailwind CSS.
- Use reusable components.
- Make the page responsive for desktop and mobile.
- Before making large structural changes, explain the plan first.

## 7. Technical Requirements
- Build locally first.
- Use Vite + React + Tailwind CSS.
- Use local assets from the `src/assets/` folder.
- Use reference screenshots from the `references/screenshots/` folder.
- No backend is needed for now.
- No hosting or domain setup is needed yet.