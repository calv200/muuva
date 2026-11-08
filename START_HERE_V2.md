# MUUVA Kilo Swarm v2 — safe retest

**Created:** 2026-11-08. This is a targeted correction to the first configuration and a controlled first implementation test. **No code, provider settings, deployments, or remote Git actions are performed by this package.**

## 1 — Reset the incomplete implementation FIRST

In VS Code Source Control on branch `staging`, review your changes and use **Discard All Changes** for tracked website modifications made by the failed Swarm. This operation is destructive for any later edits; back them up if needed. Separately delete only the following untracked failed feature files:

- `functions/api/contact.js`
- `functions/api/marketplace.js`
- `src/commerce/marketplace.js`
- `src/components/ContactForm.jsx`
- `src/forms/contact.js`
- `src/pages/ContactPage.jsx`
- `tests/contact.test.js`
- `tests/marketplace.test.js`

**DO NOT delete** `.kilo/agent/`, `.kilo/skills/`, `AGENTS.md`, `PROJECT_BRIEF.md`, `CONTENT.md`, or the setup documents. Run `git status --short` to confirm the source tree is back to its baseline. Avoid `git clean -fd` or `git reset --hard` since they are easy to misuse.

## 2 — Install replacement role definitions

Unzip this package into the MUUVA repository root. It will replace the six existing `.kilo/agent/muuva-*.md` role definitions. The three `.kilo/skills/` files are included unchanged; existing local skills may be preserved. **Preview replacements**, particularly if you edited the agent configurations yourself. Do not leave duplicate definitions for identical agent names in `.kilo/agents/` and `.kilo/agent/`. Reopen Kilo/new session to reload the definitions.

## 3 — What changed

- Feature-agent file edits: explicit allowlist `allow` rather than non-interactive `ask`. Catch-all remains `deny`.
- Commerce permissions now include `GuidedRoutineHero.jsx` and `tests/marketplace-api.test.js` for future use.
- Integrator has narrow allowed writes; QA has explicit test/build permissions.
- Lead must make correctly-shaped task calls, stop on errors, and require proper QA.
- First retest is a **single Hero.jsx mobile-only change**, with a separate QA child. All other features are out of scope until another owner approval.

## 4 — Start a new Kilo session

Select `muuva-lead` and paste `SECOND_TEST_PROMPT.md`. Do not use `/goal resume` on the old goal. Do not authorize commits, pushes, merges, deployments or live service calls.

## 5 — Verify / review

After the agent stops, check source-control diff and local desktop/mobile screenshots. If QA has not actually run tests or inspected mobile layout, the result is **UNVERIFIED**. Show results to the owner before proceeding.

## IMPORTANT

The approved complete MUUVA request remains larger: mobile logo, product, CTA, footer/social, Sliders 10min, Contact page/API, Amazon NL/DE routing, and controlled Privacy/SEO integration. These are explicitly **not authorized in the first v2 retest**. The workflow proves permissions and responsive correctness before expanding scope. Trademark ® remains deferred pending registered rights evidence.
