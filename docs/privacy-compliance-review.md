# MUUVA privacy and consent review

Updated 1 November 2026 for C.3.2B / C.3.3 preparation, implemented locally on staging. **Draft for review. No unrestricted public launch or Production activation approved.** See [release checklist](production-release-c332.md) for matrix, owner actions and local results.

## Implementation and evidence boundaries

There are 44 localized routes including Newsletter confirmation and Wholesale. Four policy drafts retain localized SEO, canonical/hreflang, sitemap, visible draft status and preparation date rather than an invented effective date. Local source/tests do not establish a Cloudflare deployment or effective account settings.

A central consent store/provider/panel handles independent Analytics and External videos, initially off. Reject, customize and accept are equally styled/accessible; no preselection or browsing/scrolling inference. Essential delivery/security and functional preferences are not optional consent. No active marketing category exists. Footer Privacy settings supports update/withdrawal. First-party localStorage muuva.consent contains version 1, notice 2026-11-01, boolean categories, savedAt and expiresAt, with initial six-calendar-month renewal. Invalid/corrupt/blocked/expired storage fails closed. Storage events synchronize tabs; bounded timers/focus/pageshow/visibility revalidate. A video-only grant preserves the other choice and its renewal deadline.

Browser-local evidence cannot establish who chose, is not tamperproof or a server audit trail, can be cleared and is specific to browser/origin. No persistent visitor ID or server tracking database is created solely for consent. Review accountability requirements before launch.

Umami availability is build gated; generated HTML has no external tracker tag/resource hint. Exact muuva.nl, DNT and Analytics permission gate loading and every before-send call. Official automatic initialization is disabled; the existing router/popstate adapter sends the current eligible page once after load/grant and subsequent genuine navigations without a preload queue/backfill. Withdrawal closes the gate immediately. A loaded script can remain inert in memory without automatic tracking listeners; fresh permission reuses it without refetch. Already initiated requests cannot be recalled. Only website, hostname, url, referrer and title survive; no form data, IDs, custom events, recordings or arbitrary titles/paths. See [analytics review](analytics-pass-a-review.md).

YouTube loads only after independent External videos consent. Option A preserves original local thumbnails and 16:9 frames. Informed Enable YouTube & Play grants that category alone and requests autoplay on a youtube-nocookie.com player; normal controls remain if denied. Watch on YouTube opens the original URL safely and changes no choice. Withdrawal removes active iframes. Enhanced mode still sends data to Google. Fonts stay self-hosted; Amazon/Instagram remain voluntary links.

Newsletter DOI and Wholesale validation, Turnstile, origins, rate limiting, timeouts, safe responses and diagnostics are unchanged. Website consent never subscribes a visitor or infers marketing consent from Wholesale acknowledgement.

## Owner-confirmed facts — not authenticated inspection

| Area | Evidence and limits |
| --- | --- |
| Controller | MUUVA, Netherlands eenmanszaak, KvK 99637588, contact@muuva.nl, https://muuva.nl. Approved controller address/contact disclosure and legal review are outstanding. Only a neutral business-address placeholder appears. No home address was sought. |
| Cloudflare staging | Managed Turnstile, pre-clearance disabled, Workers Logs disabled, no Logpush jobs. Does not prove absence of provider operational/security records or equivalent effective Production settings. |
| Rate limiting | C.3.1 owner-reported staging enforcement remains in its security doc. IP-derived HMAC identifiers are pseudonymous; active counters logically expire after roughly one hour. SQLite recovery history/provider records may last longer. No EU-only or absolute-erasure guarantee. |
| Production preparation | Owner reports separate Worker/binding/keys and variables prepared; forms/Umami off, limiter off. Not independently validated in a fresh Production deployment. Owner-created Production Wrangler file inspected and preserved. |
| Umami | Hobby, EU (Frankfurt) analytics storage, six-month standard analytics retention. Logs/security/support/backups separate. EU storage is not EU-only operations. |
| Brevo newsletter | List 3, DOI templates EN2/DE3/NL4/ES5. Active subscribers while subscribed; review after 24 inactive months. Intended 30-day unconfirmed cleanup not fully verified. Suppression only as necessary under documented criteria. |
| Brevo logs | Owner confirms 24-month transactional-log retention for all senders and disabled full email previews. Does not erase historical previews, metadata or backups. |
| Wholesale | Intended manual content review/deletion within 12 months of last meaningful business interaction, except ongoing relationships, obligations/disputes. Not an automatic mailbox rule; distinct from 24-month Brevo logs. |
| Microsoft 365 / GoDaddy | contact@muuva.nl, Microsoft 365 Email Essentials via GoDaddy. Default MRM Policy, assigned legacy tags, Online Archive disabled, Mailbox Litigation Hold off. Additional Purview retention/holds, actual deleted-item recovery and other backup periods unverified. No universal permanent-deletion deadline. |

## Lawful bases and consent evidence — review required

This release chooses affirmative consent for optional analytics/YouTube. The former proposed Dutch limited-analytics exception / analytics legitimate-interest direction and postponed consent/video work are superseded. Newsletter consent stays separate and unchecked with DOI. Proposed purpose-specific bases: Article 6(1)(f) reliable delivery/proportionate security/business reply; 6(1)(b) requested pre-contractual steps where applicable; 6(1)(a) optional analytics/videos/newsletter; 6(1)(c) applicable legal duties. Complete necessity/balancing and terminal-access/security-exemption assessments. Tests do not determine legal compliance.

The Newsletter endpoint sends fixed list/template, email, language-derived redirect and pixel preference to Brevo. It does not attach subscriber-specific wording/version/timestamp attributes. Language selects the template/redirect, not a verified saved contact-language attribute. Wording/version exists in repository history; linkage to each confirmation/subscriber and retention of DOI/unsubscribe/suppression evidence are **operational gaps requiring verification**, not implemented consent logging. DOI code/templates were preserved. Neutral 202 receipts do not prove DOI creation/delivery. See C.1 for enumeration-safe diagnostics.

## Official references reviewed 1 November 2026

[GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj) informs purpose-specific bases, transparency/rights, processors and transfers. [AP banner guidance](https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners) informs accessible refusal/withdrawal. This review is technical, not legal approval.

- Cloudflare [DPA including section 6 transfers](https://www.cloudflare.com/cloudflare-customer-dpa/), [service subprocessors](https://www.cloudflare.com/gdpr/subprocessors/cloudflare-services/), [privacy](https://www.cloudflare.com/privacypolicy/), [Turnstile addendum](https://www.cloudflare.com/turnstile-privacy-policy/), [SQLite/recovery](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/). Recovery is distinct from one-hour logical counter expiry.
- Umami [configuration](https://docs.umami.is/docs/tracker-configuration), [Cloud FAQ](https://docs.umami.is/docs/cloud/faq), [DPA](https://umami.is/dpa), [subprocessors](https://umami.is/subprocessors), [privacy](https://umami.is/privacy). Six-month analytics storage does not specify every operational/backup deletion cycle.
- YouTube [embedding/enhanced mode](https://support.google.com/youtube/answer/171780), [Google privacy](https://policies.google.com/privacy).
- Brevo [privacy](https://www.brevo.com/legal/privacypolicy/), [DPA location](https://help.brevo.com/hc/en-us/articles/15403782599570-Where-can-I-find-the-Data-Processing-Agreement-DPA), [DOI endpoint](https://developers.brevo.com/reference/create-doi-contact).
- [Microsoft privacy](https://www.microsoft.com/en-us/privacy/privacystatement), [GoDaddy privacy](https://www.godaddy.com/legal/agreements/privacy-policy) do not prove tenant retention, recovery or holds.

Verify accepted agreement/entity/version, actual subprocessors/destinations, adequacy or SCCs and supplementary measures/transfer assessment where applicable, assistance, deletion/return, backups and legal exceptions. Public provider documents alone do not prove MUUVA acceptance/configuration. Do not assume every listed subprocessor handles MUUVA visitors. Assign manual retention and privacy-request owners without unnecessary identifying data.

## Publication and release blockers

1. Approved controller identity/address/contact disclosure: resolve placeholder before unrestricted launch. Never infer or publish a residential address.
2. Final purpose-specific legal/terminal-access, provider/DPA/transfer and native-language review; approved effective date before removing draft status.
3. Newsletter consent linkage/confirmation/unsubscribe/suppression evidence and cleanup; manual Wholesale review; actual provider logs/backups/recovery/holds criteria.
4. Hosted C.3.2B staging regression and real video availability/playback/audio, including historical ID/metadata discrepancies. Intercepted iframes prove gates, not playback.
5. Separately authorized Production release/smoke test: actual binding/enforcement, Turnstile hostname/actions, DOI and Wholesale delivery, Umami ingestion. Require access restriction if testing while policy incomplete. No account or deployment action was taken here.
