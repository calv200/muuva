# MUUVA privacy notice — publication review

Prepared 25 October 2026 for Pass A.2 on `staging`. **Not approved for publication or analytics activation.** The four public-page implementations are visibly labelled staging drafts. Their displayed date records preparation of this draft, not an effective date or legal approval. This repository document is a review checklist, not part of the rendered policy. Do not put confidential business evidence here if the repository is public.

## 1. Confirmed implementation and evidence boundaries

- One shared Privacy component and translated content serve `/en/privacy/`, `/de/privacy/`, `/nl/privacy/`, `/es/privacy/` (with the configured Vite base). The existing footer links to the current language. The route manifest now has 32 localized pages; metadata, static HTML, sitemap and analytics paths derive from that manifest.
- Analytics remains opt-in and disabled in the build. No production deployment or account inspection was performed. The requester reports that production analytics has not been enabled and that MUUVA is established in the Netherlands.
- The approved Umami hook retains exactly `website`, `hostname`, `url`, `referrer`, `title`. The URL contains an approved manifest path and only validated campaign parameters; titles come from approved route metadata, never `document.title`. External referrers contain at most an HTTP(S) origin. Queries outside the campaign rules and fragments are removed. There are no custom events or visitor IDs, screen/language fields, ad pixels or session replay. DNT is respected; only exact `muuva.nl` is eligible. Staging, localhost and disabled builds are excluded. The existing history recovery and duplicate suppression are unchanged.
- `src/i18n/index.js` stores only a manual language selection as `muuva.language` in localStorage. It has no expiry; changing the selection replaces it and clearing site data removes it. URL language takes precedence; automatic detection does not store a preference. No first-party cookie setter was found in the application source.
- `index.html` requests Google Fonts CSS and fonts on page load. `RoutineVideo.jsx` loads standard `youtube.com/embed` iframes immediately on workout pages, before playback. These are direct third-party requests, independent of analytics.
- Amazon and Instagram are outbound links, not embedded tracking integrations. Checkout is external to MUUVA. No URLs were changed.
- The footer newsletter validates locally, changes React state and resets the input. There is no subscription request, backend or implemented email marketing database.
- Cloudflare Pages is the hosting context supplied for this task. Repository hosting headers support that context, but the account, deployed configuration and log controls were not inspected. `PROJECT_BRIEF.md` retains an older hosting description; it was deliberately not synchronized in this refinement pass. Default `/muuva/` build compatibility remains intact.

Source inspection establishes integration behavior, not a complete inventory of provider cookies, logs or account-specific processing. Such behavior can depend on region, browser, login and provider consent settings. Complete that inventory before approval.

## 2. Authoritative provider and regulatory sources

Reviewed on 25 October 2026; recheck at approval because provider terms can change.

| Source | Relevant finding and limit |
| --- | --- |
| [Umami Cloud FAQ](https://docs.umami.is/docs/cloud/faq) | EU/US selection concerns analytics storage; other operations may occur elsewhere. Published Hobby retention is six months. Account settings and agreement must establish MUUVA's actual region, plan and retention. |
| [Umami privacy policy](https://umami.is/privacy) and [metric definitions](https://docs.umami.is/docs/metric-definitions) | IP and User-Agent can participate in hashed session identifiers and derived metrics; infrastructure/security processing is separate. Do not assert that IP is never processed, all data is anonymous, or all processing stays in the EU. |
| [Umami DPA](https://umami.is/dpa) and [subprocessors](https://umami.is/subprocessors) | Review contractual processor duties, deletion, subprocessors and international transfers against the actual agreement and services used. |
| [Cloudflare privacy policy](https://www.cloudflare.com/privacypolicy/) | End-user requests can include IP, traffic routing and system information. Hosting/security can generate logs; absence of analytics is not absence of operational data. |
| [Google Fonts team privacy explanation](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html) | Google receives IP information to deliver requested fonts. This explanation is not an account-specific retention guarantee. |
| [YouTube embedding help](https://support.google.com/youtube/answer/171780) and [Google privacy policy](https://policies.google.com/privacy) | Privacy-enhanced embedding uses `youtube-nocookie.com` and limits personalization effects. It does not eliminate the network request or establish a blanket consent exemption. |
| [AP information requirements](https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-informatie), [AP cookies guidance](https://autoriteitpersoonsgegevens.nl/en/themes/internet-and-smart-devices/cookies), [ACM cookies guidance](https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/online-beinvloeden/cookies-plaatsen) | Provide meaningful controller/purpose/rights information; assess cookies and similar technologies, including whether analytics has no or little privacy impact. A cookie-free label alone does not settle the assessment. |
| [GDPR official text](https://eur-lex.europa.eu/eli/reg/2016/679/oj) | Articles 6, 12–22, 28, 44 onwards and 77 inform lawful basis, transparency, rights, processors, transfers and complaints. |

## 3. Open operational questions

- Confirm the deployed host and third-party request inventory across ordinary visits, video visits, browser/login states and consent choices. Record actual Cloudflare log products, settings, recipients, retention and access controls.
- Obtain account evidence of the Umami EU region (Settings → Account → Data region), plan, retention and contracting entity. EU storage is reported/intended, not independently account-verified in this pass.
- Confirm who handles privacy requests and how requests, objections, erasure and processor assistance will be handled. MUUVA does not supply its own visitor ID; establish realistic identification limits without collecting unnecessary additional data.
- Decide the lawful purposes and necessity of each integration. Identify applicable EEA/non-EEA operations and any controller/processor distinctions.
- Check the separate footer Terms, Cookie Policy and navigation placeholder links. They remain `#`; only Privacy was in scope.

## 4. Required business/controller details — publication blockers

Obtain and approve the controller's full legal name and legal form, trading-name relationship to MUUVA, business/postal address, working privacy contact channel and applicable business registration details (including KvK where required). Confirm whether a representative or DPO is legally required or appointed; do not invent one. Confirm the Netherlands establishment claim and relevant jurisdiction. Publish the verified identity/contact information in all four drafts before approval, including an actionable contact method in the rights section. Current drafts intentionally contain no fictional email/address and are not complete Article 13 notices.

## 5. Proposed lawful bases — not adopted decisions

| Processing | Candidate rationale requiring approval |
| --- | --- |
| Website delivery and proportionate security logs | Legitimate interests in delivering a reliable, secure site may be appropriate. Document necessity, proportionality, retention and balancing; do not assume every provider purpose shares this basis. |
| Explicit language preference | Assess necessary functional storage for the service requested by the visitor and an appropriate GDPR basis. Keep the value limited to the selected language. |
| Limited audience analytics | Legitimate interests is a candidate only after a documented purpose/necessity/balancing assessment and separate Dutch terminal-access/consent assessment. Cookie-free, hashed sessions and minimized payloads are relevant safeguards, not automatic legal conclusions. |
| External fonts and embedded YouTube | Assess each transfer, purpose and storage/access operation. Consider less intrusive alternatives. Obtain prior consent where required; independent provider processing needs separate analysis. |
| Newsletter | No operational subscription service exists. Define its basis, consent/marketing requirements, provider and retention only if a future implementation is approved. |

The final notice needs settled bases per purpose, including the specific legitimate interests relied on. It must also state applicable rights, recipients, retention and transfer information in a usable form. The current prospective language is explicitly pending review.

## 6. Dutch consent/ePrivacy decision pending

Document whether this exact Umami deployment qualifies for the Dutch limited-analytics exception under Telecommunications Act Article 11.7a: effects on privacy, session hashing/IP use, provider reuse, data sharing, retention, necessity and access to terminal information must be considered. GDPR obligations remain even if consent is not required under that rule. Excluding screen/language reduces collection; User-Agent-derived device reporting still exists, while omitted screen size prevents a separate laptop classification. There is no need to restore fields for this notice.

If the assessment does not support the exception, implement and test prior consent before loading analytics, with withdrawal and refusal working correctly, in a separately approved task. Do not activate analytics while this is unresolved. No cookie banner was added here because no consent design has been approved. This does not conclude that the current third-party embeds require no consent.

## 7. Umami DPA, processors and transfers

Umami's published DPA addresses customer data processing; agreement/account acceptance can incorporate it without a separately signed paper document. Verify the customer entity, accepted agreement/version, applicability and evidence of acceptance rather than assuming an unsigned copy means no DPA. Distinguish customer analytics processing from Umami's separate account/security purposes.

The published subprocessor list includes providers in the US and EU (including infrastructure/CDN, logging and database providers). Not every listed service necessarily receives MUUVA visitor data; establish applicability by feature, region and contract. Review subprocessor notifications, objection procedures, assistance, deletion/return and breach arrangements. EU analytics storage is not a promise of EU-only CDN, security, logs, support or account operations.

Identify actual transfers outside the EEA, the contractual mechanism and relevant safeguards (including applicable standard contractual clauses and any required transfer assessment). Obtain evidence; do not infer adequacy or completed safeguards from the EU storage selection. Apply an equivalent review to Cloudflare and relevant Google services.

## 8. Retention confirmation

The Cloud FAQ currently reports **six months for Hobby**, two years for Pro, five years for Business and custom Enterprise retention. MUUVA's actual plan and retention are **not account-confirmed**. Do not publish six months as a verified MUUVA period until confirmed. Production analytics retention does not automatically describe backup, support, security or infrastructure-log retention. The DPA allows backup/legal-retention qualifications; determine actual deletion cycles and any exceptions. No precise universal operational-log retention period was established here.

Confirm and document Cloudflare retention for enabled products, applicable Google processing and any later privacy-request records. Language preference persists client-side until changed/cleared. Analytics is disabled, so this implementation is not currently collecting analytics records. Final public text must provide verified periods or meaningful determination criteria for each relevant purpose.

## 9. YouTube and Google Fonts assessment

Current standard YouTube players make a third-party request before Play. Assess privacy-enhanced embeds plus a user-initiated loading gate, with consent before loading where required. A click alone is not automatically valid informed consent; provide an approved explanation and choices. Preserve workout navigation and accessibility when implementing a later approved solution. No player changes were made in this pass; the unresolved assessment is a publication/readiness blocker, not a declaration that existing loading is compliant.

Consider self-hosting the licensed fonts to avoid Google font requests, subject to licensing and performance review. Current external fonts disclose IP/request information on page visits. Neither integration is necessary to Umami. No network behavior was silently changed as part of the policy work.

## 10. Newsletter issue

The current success confirmation is misleading because no subscription is created. Correct the message in all four languages or disable/remove the form in a separately approved change before publishing a final notice. No newsletter service, consent capture, mailing list or data retention system was built. The draft accurately discloses present behavior rather than implying that a backend exists.

## 11. Approval gates

Before **policy publication**: resolve controller/contact details; confirm deployed facts; approve purposes, legal bases, retention and transfers; complete provider/DPA and consent assessments; resolve the immediate-loading YouTube/Fonts decisions and misleading newsletter confirmation; obtain legal and native-language review of all four texts. Replace provisional statements with verified details, approve the effective/update date and remove draft labels only with approval. Check other policy placeholders separately. Technical tests are not legal approval.

Before **analytics activation**: satisfy those gates plus confirm the actual Umami account/region/plan/website ID and accepted DPA; record the Dutch limited-analytics decision or implement approved consent; reverify exact-host restriction, disabled staging/localhost, DNT, minimized fields, all 32 paths/titles and history deduplication. Explicit deployment approval is still required. No Cloudflare/DNS changes, production deployment, analytics activation, commit or push are part of this pass.

`PROJECT_BRIEF.md` and `CONTENT.md` remain unchanged. Their eventual approved synchronization should cover the privacy routes, finalized policy ownership and hosting facts; do not describe this draft as an approved milestone.

## Technical verification record

- Final required sequence passed: `npm test` (60 tests), `npm run build` (32 localized pages), `npm run test:production` (32 pages, shared assets, metadata/sitemap/headers), then `git diff --check`. Analytics remained disabled. Git reported only configured LF-to-CRLF normalization notices, not whitespace errors.
- Automated tests cover all 32 real server-rendered pages and localized footer links, all four complete draft bodies, route/language preservation, metadata, sitemap, analytics allowlist and existing privacy regressions. Existing locale entries were compared with `HEAD` and are unchanged; only Privacy copy and its SEO entries were added.
- Root-hosted output (`/`, `https://muuva.nl`) passed production verification with analytics disabled. The default base-path build is also checked separately. Neither changes deployment configuration.
- Chromium checks against intercepted local build files covered Privacy links from home, routines and workout pages in each language, keyboard activation and heading focus, language switching, Back/Forward, direct opening/reload and Ctrl-click opening a new tab. All four languages were checked at widths of 390, 768 and 1440 pixels without horizontal overflow.
- A visual pass loaded the actual Manrope/Newsreader fonts, checked hydration console errors and confirmed all four pages still contain meaningful text with JavaScript disabled. Typography accommodates the longer German title.
- A separate browser-only analytics fixture exercised all 32 approved routes/titles, history navigation, repeated/rapid visits and query/anchor changes, plus staging/localhost/DNT/disabled exclusions. Requests were intercepted: no real analytics data was submitted and the generated artifact stayed disabled.
- These local checks do not verify live Cloudflare responses, account settings, provider log retention, all third-party cookies or real YouTube playback. They do not constitute legal review, native-speaker approval or a compliance finding.
