# MUUVA repository instructions

## Project overview

MUUVA is a premium Pilates equipment brand. This React/Vite site includes product discovery, shopping links, and Guided Routines. Use [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for architecture, branding, and technical direction, and [CONTENT.md](CONTENT.md) for editorial copy. Keep detailed specifications in those files rather than repeating them here.

## Required context

Before changing the site, read the relevant parts of `PROJECT_BRIEF.md`, and read `CONTENT.md` when changing copy. Inspect the affected components, styles, data, and related shared utilities before adding code. Treat the current repository and approved documentation as more reliable than older conversation history. If specifications conflict, identify the conflict and report it; do not silently treat an outdated description as current behavior.

## Development principles

- Follow the existing React/Vite architecture, naming, and folder conventions. Reuse components and design tokens where they fit.
- Make the smallest maintainable change that fulfills the request. Avoid unnecessary dependencies and unrelated refactoring.
- Preserve responsive behavior and keep changes within the requested scope.
- New or changed visitor-facing copy, including accessibility labels and form messages, must update all four locale files in `src/i18n/locales/` or explicitly flag pending translations. Keep category IDs, routes, URLs, and asset paths independent of translated labels; see the multilingual conventions in `PROJECT_BRIEF.md`.

## MUUVA design principles

- Preserve MUUVA's premium, minimal visual identity, typography, and color system. Follow approved layouts where available.
- Use authentic product imagery. Do not regenerate, redraw, distort, or replace product assets unless explicitly requested.
- Add decorative elements or animations only when authorized by the task.
- Keep controls accessible and usable across desktop, tablet, and mobile.

## Existing functionality

Preserve working behavior unless the user requests a change. Check the Product Purchase section, gallery and hotspots, Amazon links, Guided Routines filters and videos, navigation, hash routing, image assets, and responsive layouts when a task touches them. Read the current source and project documentation for exact behavior.

## Documentation lifecycle

- **Experimental or refinement work:** implement the requested change without automatically rewriting `PROJECT_BRIEF.md` or `CONTENT.md`. Report documentation that may need updating after approval.
- **Approved milestone or synchronization work:** update the relevant documentation when explicitly requested. Match verified implementation, remove outdated descriptions of replaced behavior, preserve unrelated information, and avoid duplicating content between files.
- Do not document an unapproved experiment as an approved design unless explicitly instructed.

## Verification

- For application changes, run `npm run build`, run relevant existing checks when available, and verify affected behavior where tooling permits. State clearly when browser or visual checks were unavailable.
- For documentation-only changes, review Markdown consistency and run `git diff --check`. A build is unnecessary unless the task asks for one.

## Git safety

Do not commit or push automatically. Do not perform destructive Git operations without explicit authorization. Preserve unrelated uncommitted changes and keep edits scoped to the task.

## Completion report

Briefly report what changed, which files changed, verification results, unresolved issues, and any documentation impact.
