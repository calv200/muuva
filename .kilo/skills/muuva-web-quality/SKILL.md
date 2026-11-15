---
name: muuva-web-quality
description: "Use when implementing or testing MUUVA responsive UI, logo, hero video, product composition, footer, localized links, images and accessible controls."
---
# MUUVA web quality
1. Read AGENTS.md, PROJECT_BRIEF.md and CONTENT.md before changes. Copy is authoritative in the four locale JSON files.
2. Preserve the original logo and real product photos. No generated replacements unless user requests. Registered ® only with owner-confirmed trademark rights.
3. Visual desktop/mobile acceptance at 320, 390, 768, 1440px; verify no horizontal overflow and reachable controls. Mobile media must not crop essential content. Keep product hotspot interactive target >=44px even if visual marker shrinks.
4. Keep Amazon CTA, product gallery and hotspots working. Guided Routines CTA changes shape/font, not color. Full-body kit photo must show every product.
5. Preserve 4-language routing, SEO, controlled third-party video/Umami consent, and footer Privacy settings.
6. Run npm test, npm run build, npm run test:production and git diff --check only during the final exclusive QA phase. No production networking.
