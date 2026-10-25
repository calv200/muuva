# Umami foundation: pending review

Analytics remains disabled by default. This draft records implementation and review
requirements; it is not a published Privacy Notice or authorization to activate tracking.

## Configuration

No environment file or dashboard setting has been changed. Missing
`VITE_UMAMI_ENABLED` means disabled, including existing production builds.
Local development does not install the tracker. Preview must keep the flag absent
or `false`; `MUUVA_STAGING=true` also suppresses it at build time.

Only after explicit configuration and Privacy Notice approval, a production build
may use:

```dotenv
VITE_UMAMI_ENABLED=true
VITE_UMAMI_WEBSITE_ID=8963af84-1a22-4cad-a8ef-413afe485468
VITE_PUBLIC_SITE_ORIGIN=https://muuva.nl
VITE_BASE_PATH=/
```

The website ID is public, not an API credential. An enabled non-staging build
fails for a missing/invalid UUID, a different public origin, or subpath hosting.
Build and production verification must use the same environment variables.
Disabling requires rebuilding with the flag absent or `false`.

## Implementation and data boundaries

`build/analytics.js` inserts one synchronous privacy-hook script followed by one
deferred official `https://cloud.umami.is/script.js` in every generated document
head, including the compatibility root. No React effects install scripts.
Disabled output has neither script. An enabled artifact served on another host
may download the official script, but both `data-domains="muuva.nl"` and the hook
prevent analytics submission. Supported DNT signals also prevent submission.

The hook accepts pageviews only for the 32 manifest paths, on the exact hostname
`muuva.nl`. It sends only the configured website, hostname, sanitized relative URL,
external referrer origin and approved localized title. Titles are resolved at build
time from the route manifest, existing locale catalogs and shared SEO metadata
resolver. Neither `document.title` nor a tracking caller's title is accepted.
It omits screen size, browser-language payload fields, names, IDs, custom properties, event names, form values and
performance/identify requests. It drops arbitrary query parameters and fragments.
Unknown paths are omitted rather than sending a possibly personal route segment.

The five supported UTM parameters are retained as campaign labels, limited to
80 characters with a restricted character set. Duplicate keys and obvious
addresses, phone-like numbers, UUIDs and long opaque tokens are discarded.
Do not put personal names or other personal data in campaign labels: syntax
filtering cannot determine the meaning of every otherwise valid label. Marketing
must review its campaign naming convention before activation.

Automatic Umami History API tracking remains enabled for initial pageviews and
History API changes. Initial root
and legacy URLs are rejected until existing routing normalizes them; stale and
consecutive duplicate pathnames are rejected. Filter, anchor and campaign-only
changes on the same pathname do not create another pageview. UTM attribution is
retained on the first pageview of a genuine page navigation. No visitor URL is rewritten
by analytics. Existing routing preserves UTM parameters during automatic language
selection and language switching. Ordinary links keep their existing query
behavior; analytics does not append campaign parameters to every internal link.

Inspection of the Cloud script on 2026-10-25 found interception of `pushState`
and `replaceState`, without a `popstate` listener. Its delayed 300ms callbacks
read the latest URL, so rapid navigation can lose intermediate visits. Its
internal URL also remains stale after Back/Forward. A centralized adapter calls
`umami.track` immediately for Back/Forward and each existing `muuva:navigate`
event, using the actual current URL. The hook deduplicates delayed automatic
callbacks by pathname. A return to a route after visiting another route counts
again; same-page query/anchor changes do not. No router or history behavior is
modified. Browser checks cover these cases. Recheck before activation because
the hosted script can change independently of this repo. Views before a blocked
or not-yet-loaded tracker cannot be guaranteed; no pre-load visitor queue is kept.

## Device, language and title decisions (Pass A.1)

The official metric definitions describe Device broadly as OS plus screen.
The current public `getDevice()` implementation is more specific: it uses
UAParser on the HTTP User-Agent, defaults an unrecognized type to `desktop`,
and labels a desktop-class result `laptop` only when a supplied screen width
is at most 1920. Mobile/tablet types come from the User-Agent, not screen size.

| Dimension | Effect of keeping screen and browser language excluded |
| --- | --- |
| Mobile / tablet / desktop | User-Agent classification remains available; laptops join desktop. |
| Laptop versus desktop | The screen-width heuristic is intentionally unavailable. |
| Screen resolution | No resolution data is supplied. |
| Browser and OS | Still derived server-side from the HTTP User-Agent. |
| Browser language | No payload language is supplied; this report is intentionally incomplete. |
| Selected website language | Available from `/en/`, `/de/`, `/nl/`, `/es/`; distinct from browser preference. |
| Page title | Approved localized metadata now supports readable page-title reporting/filtering. |

No raw or synthetic/coarse screen value is added: broad device reporting does
not require one in this implementation, and synthetic dimensions would make
the screen-resolution report misleading. This trades resolution and a laptop
heuristic for less device detail. No client-side device, OS, browser or User-Agent
override is accepted or generated. User-Agent spoofing, reduced signals and
tablets using desktop-mode agents can still affect classification. This is a
review of current official public source, not proof of the deployed Cloud backend
version or dashboard ingestion. Confirm those results before activation.

The language-specific URL is sufficient for MUUVA's selected-language analysis.
It does not reveal the visitor's preferred browser language or region, so that
separate dimension remains intentionally excluded. Approved titles add no
visitor-specific detail, and they remain correct during rapid navigation even
when React has not yet updated the document title.

Final pageview payload fields: `website`, `hostname`, `url`, `referrer`, `title`.

The integration does not call `identify`, generate IDs, enable replay,
performance tracking, advertising, or conversion events. Umami receives normal
network metadata such as IP address and browser request headers regardless of
which JSON fields are omitted. Provider-side aggregation/session mechanisms,
retention and processing must be reviewed; this code does not establish that the
service performs no identification-related processing.

Sources reviewed:

- [Official tracker configuration](https://docs.umami.is/docs/tracker-configuration)
- [Official tracker functions](https://docs.umami.is/docs/tracker-functions)
- [Hosted Cloud tracker inspected](https://cloud.umami.is/script.js)
- [Official metric definitions](https://docs.umami.is/docs/metric-definitions)
- [Current public device classification](https://github.com/umami-software/umami/blob/master/src/lib/detect.ts)
- [Current public ingestion schema and title storage](https://github.com/umami-software/umami/blob/master/src/app/api/send/route.ts)

## Privacy Notice draft checklist: launch blocker

Pass A.2 replaces the footer placeholder with four localized Privacy Notice staging drafts.
They are not approved for publication; see [the compliance review](privacy-compliance-review.md).
At the time of Pass A, no functioning Privacy Notice
was found. Publish an approved, accessible localized notice before activation.
The notice needs reviewed statements covering:

- MUUVA's use of Umami Cloud for aggregate traffic and campaign attribution.
- Data processed: approved page paths and UTM labels, referrer origins, normal
  HTTP metadata, and verified provider-derived metrics/session processing.
- The account's reported EU region, verified hosting/subprocessors and any
  possible international processing or transfers and applicable safeguards.
- Actual configured retention periods, provider retention and deletion process.
- The responsible business/controller's verified identity, contact details,
  relevant rights, how to exercise them and applicable complaint information.
- The applicable lawful basis and cookie/ePrivacy assessment, including whether
  consent or an additional control is required before loading the provider script.
- DNT handling and the limitations of that browser signal.

No business contacts, retention periods, legal guarantees or consent exemption
are assumed here. Obtain privacy review and confirm the EU-region account/DPA
settings; cookie-free operation alone does not settle consent requirements.

## Documentation after approval

Update `PROJECT_BRIEF.md` with the approved analytics architecture, environment
requirements, verified deployment state, data boundaries and verification steps.
Update `CONTENT.md` and all four catalogs when approved visitor-facing Privacy
Notice content/navigation is implemented. Those two documents remain unchanged
for this implementation pass. Cloudflare dashboard and DNS changes remain out
of scope.

## Implementation-pass verification

Pass A initially verified 50 Node tests, including configuration rejection, payload
filtering, domain/DNT checks, UTM preservation and enabled/disabled HTML checks.
An actual enabled root-hosted build passed the production verifier for all 28
localized pages and the compatibility root, including existing SEO checks.

Chromium ran the downloaded current Cloud script against local generated files
served through request interception. All requests were intercepted: no events
were sent to Umami. All 28 direct localized routes produced one pageview each.
Root language detection preserved the five UTM values and the visitor's original
query while the outbound payload omitted email/token parameters. Listing/detail
navigation, language switching and Back/Forward produced the expected pageviews
with one tracker load. Legacy entries normalized to one pageview. Preview,
localhost, GitHub Pages and DNT cases submitted none. Custom events and identify
requests were blocked. No browser page errors or desktop/mobile horizontal
overflow were observed. Disabling the adapter in a separate browser experiment
confirmed that the Cloud script alone did not send a Back pageview.
Pass A.1 expands this coverage with consecutive Back/Forward actions, Back then
normal navigation or language switching, rapid route changes, separated repeat
visits, and query/anchor-only changes. The expanded tests exposed and corrected
lost rapid pageviews and extra campaign-only pageviews. Chromium ran the current
Cloud script with the updated head injected into intercepted local pages; the
generated artifacts themselves stayed disabled. It verified exact pageview counts,
approved titles on all 28 routes, exclusion of arbitrary dynamic titles and extra
payload fields, and domain/DNT/disabled-mode protections. All network traffic was
intercepted, with zero real analytics submissions.

These checks do not validate dashboard ingestion, provider-side processing,
region, retention, hosted deployment, video playback, or legal compliance.
Fonts and third-party media were blocked during the intercepted browser run.
Activation still requires approved configuration, a functioning reviewed Privacy
Notice and any controls required by the privacy assessment.
