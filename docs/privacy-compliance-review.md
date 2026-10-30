# MUUVA privacy notice - publication review

Updated 25 October 2026 for Pass A.3, implemented locally on `staging`. **Privacy remains draft; publication and analytics activation are not approved by this technical review.** The visible date is a draft-update date, not an effective date. No account, DNS or deployment settings were changed. Keep confidential business evidence outside a public repository.

## Confirmed facts and evidence boundaries

The owner confirmed the following in Pass A.3; these are not results of a registry search or authenticated account inspection:

| Item | Confirmed information |
| --- | --- |
| Business | MUUVA, Netherlands, sole proprietorship (eenmanszaak), KvK 99637588 |
| Privacy contact | contact@muuva.nl, linked with mailto in all four notices |
| Website/hosting | https://muuva.nl, Cloudflare Pages |
| Analytics account | Umami Cloud, Hobby plan, EU analytics storage |
| Standard analytics retention | Six months; does not establish log or backup retention |
| Purpose | Website analytics, traffic attribution and navigation analysis |

Full legal proprietor identity and the required postal address are unavailable in the reviewed repository/documentation. The trading name and KvK do not complete the controller disclosure. Obtain verified details and approval before publishing an address; do not automatically publish a residential address. The confirmed email resolves the missing-contact issue, but the identity/address blocker remains.

## Verified local implementation

- Four Privacy routes use one component and four locale catalogs. The current manifest has 36 localized public pages, including the later About Us routes; generated pages have pre-rendered content, localized SEO, canonical/hreflang and sitemap entries. Draft labels and draft SEO descriptions remain. This route-count update does not constitute a renewed legal review.
- Manrope and Newsreader are self-hosted variable WOFF2 Latin/Latin Extended assets. Google Fonts stylesheet/preconnects are removed. Fonts load from the website origin. Licenses, sources and hashes are in `src/assets/fonts/`.
- The newsletter form, email input, submit button, success message/state and validation handlers are removed. The footer preserves its grid and branding with translated description and a noninteractive Coming soon label. There is no newsletter email collection or backend.
- Standard YouTube embeds still load on workout pages before Play. Player behavior is unchanged. Amazon and Instagram remain voluntary outbound links with unchanged destinations.
- Manual language choice uses localStorage `muuva.language` until changed/cleared. URL language wins; automatic detection does not save. No first-party cookie setter was found. This does not make the entire website cookie-free.
- Cloudflare hosting involves normal network metadata and may involve operational/security logs. Account-specific products, settings, access controls and retention were not inspected.

## Analytics boundaries and deployment status

The integration is unchanged: disabled by default, exact `muuva.nl` restriction, staging/localhost exclusion, DNT support and navigation duplicate suppression/recovery. Retained fields are only `website`, `hostname`, `url`, `referrer`, `title`: approved routes/titles, sanitized campaigns and origin-only external referrers. Screen/browser language, custom visitor IDs/events, advertising pixels and recordings are excluded.

UTM syntax filtering cannot recognize every personal name inside an otherwise valid campaign label; marketing must keep labels nonpersonal. Umami may process IP/User-Agent for session hashing and derived metrics. Hashing does not guarantee anonymity; EU analytics storage does not guarantee EU-only processing. User-Agent-derived broad device reporting remains; screen resolution and laptop heuristics are intentionally omitted.

Production activation is a separate owner action after review. Local enabled simulations do not mean production tracking is live. Exact Production/Preview variables, rollback and manual steps are in [production verification](production-verification.md). No shared environment file has been enabled.

## Proposed lawful bases and Dutch consent decision - pending

The owner intends to pursue the Dutch limited-impact analytics exception and legitimate interests under GDPR Article 6(1)(f). This is a proposed direction, **not a completed assessment**. Document purposes, necessity, proportionality and balancing for the actual deployment, including identifiers, IP use, provider reuse, sharing, retention and safeguards. Separately assess terminal access/storage and the Dutch Telecommunications Act Article 11.7a exception. Cookie-free configuration alone does not settle either question.

Possible legitimate interests for proportionate delivery/security and functional storage for the visitor's explicit language choice also need purpose/basis documentation. Final public disclosures must state approved bases and interests per purpose. No conclusion that visitor consent is never needed has been approved.

Consent-management implementation is postponed at the owner's direction. No banner, consent UI or new opt-out system was added. If the assessment requires consent or another control, it must be implemented in an approved later task before the affected processing is activated. Postponement is not an exemption.

## DPA, subprocessors, transfers and retention

The [Umami Cloud FAQ](https://docs.umami.is/docs/cloud/faq), rechecked 25 October 2026, reports six months for Hobby analytics and distinguishes storage region from other operations and backups. This agrees with the owner's account confirmation. Operational/security logs, support records and backup deletion cycles remain separate and unverified. Confirm meaningful periods or determination criteria for Cloudflare and other relevant processing too.

Review the applicable [Umami DPA](https://umami.is/dpa), accepted agreement/version and customer entity. Incorporation through account/agreement acceptance can matter without a separately signed document. Confirm assistance, deletion/return, breach handling and backup/legal-retention exceptions. Distinguish customer analytics processing from separate provider account/security purposes.

Review [Umami subprocessors](https://umami.is/subprocessors) against the actual features/region used. The list includes US and EU providers; do not assume every listed service receives MUUVA visitor data. Establish actual non-EEA destinations, transfer mechanisms and safeguards, including applicable SCCs and any required transfer assessment. EU storage alone is insufficient evidence. Review Cloudflare and YouTube/Google processing as appropriate.

## YouTube review postponed; fonts and newsletter corrected

The owner postponed the YouTube privacy assessment and prohibited player changes. Existing players make requests before playback. Privacy-enhanced embedding and a user-initiated loading gate remain proposals, not implemented features or a consent exemption. Assess cookies/terminal access, account association and independent provider processing before final legal approval. A click alone is not automatically informed consent.

Self-hosted fonts resolve the previous Google Fonts request issue in this implementation. Removing the newsletter form resolves its misleading success confirmation. These fixes do not resolve the separate YouTube/analytics decisions. No new external service was added.

## Authoritative references

- [AP information requirements](https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-informatie), [AP cookies guidance](https://autoriteitpersoonsgegevens.nl/en/themes/internet-and-smart-devices/cookies), [ACM cookies guidance](https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/online-beinvloeden/cookies-plaatsen): transparency and assessment of cookies/similar technologies and limited-impact analytics.
- [GDPR official text](https://eur-lex.europa.eu/eli/reg/2016/679/oj): lawful bases, transparency/rights, processors, transfers and complaints. Public drafts retain rights and the Dutch supervisory-authority complaint route.
- [Umami privacy policy](https://umami.is/privacy), [metric definitions](https://docs.umami.is/docs/metric-definitions), FAQ/DPA/subprocessors above: distinguish minimized application payloads from provider network and operational processing.
- [Cloudflare privacy policy](https://www.cloudflare.com/privacypolicy/): end-user IP, routing/system information and operational processing, not an account-specific retention guarantee.
- [YouTube embedding help](https://support.google.com/youtube/answer/171780), [Google privacy policy](https://policies.google.com/privacy): embedding modes and independent provider processing.
- [Font provenance and licensing](../src/assets/fonts/README.md): official source URLs, SIL OFL notices and asset hashes. Public services copy no longer links to Google Fonts privacy information because fonts are local.

These sources inform review, not a finding of MUUVA compliance. Recheck terms before approval. Source/browser checks are not a complete provider cookie/log inventory across regions, sign-in states and browsers.

## Publication and activation blockers

1. Verify full controller identity and required postal address, with explicit approval before publishing a residential address. Keep draft status until complete.
2. Complete lawful-basis and Dutch consent assessments. Record the result rather than treating the owner's intended exception as established. Complete any required controls in separately approved work.
3. Complete DPA, subprocessors, transfers and operational-log/backup retention reviews. Establish privacy-request handling, erasure/objection procedures and processor assistance without unnecessary identifying data.
4. Complete the postponed YouTube assessment. Obtain legal/native-language review of all four texts; approve final copy and the effective date before removing draft messaging.
5. Review the release and separately authorize production deployment/analytics activation. Confirm Preview separation and verify live output afterwards. Other footer policy/navigation placeholders remain outside scope.

`PROJECT_BRIEF.md` and `CONTENT.md` are synchronized for this approved implementation milestone, distinguishing local implementation, owner-confirmed facts, pending legal conclusions and deployment status. No production deployment is claimed.
