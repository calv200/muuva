# Paste into a NEW Kilo chat (muuva-lead)

Start MUUVA Swarm **v2 controlled retest: WAVE 1 — mobile hero video only**.

Owner approval for THIS WAVE ONLY: edit `src/components/Hero.jsx` to display the complete video frame on narrow mobile screens. No other code changes are authorized. Work on `staging`; use current AGENTS.md, PROJECT_BRIEF.md, CONTENT.md and relevant `.kilo/skills/` instructions.

Before starting, verify that the incomplete previous implementation was reset. `git status --short` should have no tracked changes or newly created Contact/marketplace implementation files. Preserve the untracked `.kilo/` definitions and setup markdown files. If the source baseline is not clean, STOP.

Delegate exactly one writing subagent (`muuva-ui`, Qwen/OpenRouter). Use a valid `task` call with nonempty `description`, `prompt`, `subagent_type`, plus `background: true` only when supported. The child may edit **only** `src/components/Hero.jsx`, regardless of wider future permission allowlists. No other implementation subagents yet. Require start/done/blocked board posts.

Acceptance criteria:
1. At 320px and 390px, entire MP4 frame fits available screen width with no horizontal crop and no artificial blank bars caused by a fixed tall container. Use the video's intrinsic ratio on mobile.
2. At >=640px, keep the committed baseline container sizing and object-cover visual behavior unchanged. Check at 768px and 1440px.
3. Preserve autoplay, muted, loop, playsInline and accessibility labels.
4. Do not touch other files, asset files, branding, Contact, Amazon, routes, Footer, consent or configurations.

Wait for that child to finish; then delegate `muuva-qa` (GPT-6 Luna, read-only) to independently inspect the actual diff, run `npm test`, `npm run build`, `npm run test:production`, `git diff --check` sequentially, and assess responsive screenshots/browser visual evidence. If actual browser automation or screenshots are unavailable, report visual check UNVERIFIED and request manual 320/390/768/1440 screenshots. Do not declare PASS based only on a child's report.

On any permission rejection, failed task call, missing test, unexpected modified file, or failed acceptance criterion, STOP, report the exact blocker, and don't start further fixes or waves without my approval. Do not use `/goal resume` from the prior failed session. No commit, push, merge, deploy, provider/secret changes or external service calls. Return a one-page summary with actual modified files, child model/provider reports, test results, mobile vs desktop evidence, and PASS/FAIL/UNVERIFIED.
