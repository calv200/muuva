# Umami consent-controlled analytics review

Updated 1 November 2026, local staging C.3.2B. Default disabled; no deployment/account activation. Unrestricted publication remains blocked by [privacy review](privacy-compliance-review.md).

## Configuration and loader

VITE_UMAMI_ENABLED=true means consent-controlled availability, never consent. It requires root hosting, VITE_PUBLIC_SITE_ORIGIN=https://muuva.nl and valid public website ID 8963af84-1a22-4cad-a8ef-413afe485468. Missing/false disables; MUUVA_STAGING=true suppresses even an enabled flag. Build and verifier use identical inputs. Full matrix and owner activation/rollback: [release checklist](production-release-c332.md).

build/analytics.js emits one first-party inline privacy loader and **no external tracker tag or analytics resource hint**. Before affirmative Analytics permission it fetches no tracker and sends/queues nothing. The central consent store publishes state synchronously. Exact muuva.nl and all supported DNT signals gate loading and before-send; enabled artifacts on localhost/Preview cannot load the tracker. Disabled output has no integration.

After permission it requests the official Cloud tracker once with data-auto-track=false, data-domains=muuva.nl, data-do-not-track=true, data-exclude-hash=true, data-before-send=muuvaBeforeSend and no-referrer script policy. Official configuration/downloaded source inspected 1 November 2026 confirms automatic initialization is disabled: no automatic history/click/performance/error tracking listeners. Current Cloud ingestion uses gateway.umami.is; browser tests intercept gateway and script traffic.

## Navigation and withdrawal

The existing centralized popstate and muuva:navigate adapter sends immediate current-location pageviews. Current eligible page counts once after consent/load; subsequent genuine navigations count. No preload queue/backfill. During loading, only the route current at load is sent. Approved paths/titles, pathname deduplication and stale-callback rejection remain. Queries/filters/anchors alone do not count; repeat visits separated by another page, rapid navigation, consecutive Back/Forward and language/internal navigation after Back count once. No analytics history writes or URL changes. Manifest: 44 routes, 40 analytics-eligible; Newsletter confirmation excluded.

Withdrawal synchronously closes before-send and future adapter sends, resetting deduplication. The loaded script remains inert in memory without automatic listeners, so no forced reload is needed. A pending download may finish but cannot send without current permission. The script is never refetched in that document, including failure/regrant. Fresh permission can reuse the loaded tracker and count current page once. Already initiated requests/transmitted events cannot be recalled. Refresh/new documents check saved consent normally.

## Payload boundaries

Only website, hostname, url, referrer and title remain. Titles come from approved localized metadata at build time, never document.title or caller text. Unknown/personal routes, fragments, arbitrary queries, form content, custom IDs/properties/events and identify/performance/error payloads are rejected. Referrers retain at most an external HTTP(S) origin. Five UTM values remain syntax/length validated, excluding duplicates and obvious email/phone/token/UUID values. Syntax cannot recognize every personal name: require nonpersonal campaign naming. No recordings or advertising. Provider network metadata/session processing remains relevant.

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


## Current review status

This release chooses consent, superseding the historical proposed limited-analytics exception and postponed consent/video work. Owner confirms Hobby/Frankfurt/six-month analytics storage; logs/backups/transfers and final legal/controller review remain open. Four drafts cover current forms and gated services. No activation was performed.

## Historical verification — earlier automatic-tracker architecture

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
