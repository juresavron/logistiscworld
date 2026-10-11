# Revised design direction

11 October 2026. The first wireframe was rejected as too generic. The working application supersedes `wireframes.html`, which remains a historical planning artifact.

## References reviewed

| Reference | Observed pattern | Application to LogisticsWorld |
| --- | --- | --- |
| [Clutch logistics listings](https://clutch.co/logistics/supply-chain-management) | Repeatable company information, service breakdowns, location, profile and website actions | Structured company cards with a consistent facts row and clear next actions |
| [Freightnet Slovenia directory](https://www.freightnet.com/directory/p1/cSI/s30.htm) | Country/service discovery and direct provider information | Separate physical office location from service coverage |
| [Freightos Marketplace](https://www.freightos.com/marketplace/) | A prominent search task and comparable provider choices | A focused search surface; do not import quote-booking functionality |
| [Cargo Directory World Slovenia](https://www.cargodirectoryworld.com/slovenia) | Geographic browsing into cities and companies | Dedicated regional entry points connected to one company catalog |

Public pages and available interface images were reviewed; no signed-in competitor product was audited. Design choices below are original proposals, not claims about competitor colors or current pixel-level layouts.

## Direction

Warm ivory canvas, deep forest-green typography/navigation, and restrained orange action accents. Strong editorial headings, generous section spacing, thin borders, useful density inside result cards. Compact geometric monograms distinguish fictional sample companies without implying real logos. Logistics-themed route lines are decorative, not geographic data.

Home: concise headline, service/location search, distinct service tiles, country discovery, and company examples. Directory: compact header, filters, repeatable results, persistent comparison tray. Profile: identity and essential facts first, service-by-service coverage, easy-to-find contact panel. Admin: quieter workspace with table-based catalog, short navigation, dedicated editor, explicit save state and readiness checks.

No invented ratings, customer counts, verification claims, or live traffic. The application milestone is clearly marked as a sample-data preview. Browser-only admin drafts do not modify a live database.

## Country-directory redesign — supersedes the color/layout direction above

Following the user's further design rejection and country-domain plan, the public
site now uses navy text, blue actions, white surfaces, and pale blue-grey section
backgrounds. A compact country masthead, task-focused search, service shortcuts,
company rows, comparison guidance, and local buyer content replace the decorative
globe and broad regional landing page. See `country-sites.md` for the domain
architecture and `seo-strategy.md` for search intent. Admin styling remains separate.

## Editorial freight index — superseded

The user rejected the blue directory as still looking like a generic AI-built
site. The current version replaces that public stylesheet, rather than adding
another layer of colour overrides. The art direction is a freight trade
publication: paper background, dark ink, restrained oxide-red actions, serif
country/editorial headings, mono index labels, and a licensed real photograph
of the Port of Koper. Attribution is in `src/assets/README.md` and on the page.

The main functional change is an in-place, URL-driven homepage index. Search,
service tabs, city shortcuts, company type, ordering, and pagination update
company results on the homepage. Company entries form a compact ledger with
location, services, coverage, comparison, and profile actions. Service tiles,
benefit checkmarks, slogan sections, promotional cards, and the large listing
CTA are removed. The buyer guidance is reduced to three expandable questions.

Responsive layouts are implemented in `src/country-site.css`. Type checking,
server rendering, filtering, and the exact static-asset deployment handler are
checked. A full browser visual/interaction review is still unavailable in this
managed environment and must not be represented as completed.


## Directory revision from the supplied screenshot — superseded

The screenshot showed `/companies?office=SI`, not the homepage. Visible defects:
small low-contrast typography, weak separation between records, and an almost
empty sidebar. The filters were inside a closed native `details` element while
the desktop summary was hidden. CSS alone did not expose that closed content.

The directory now has a 1400px maximum content width, a white introduction with
a licensed Koper image, 14–16px reading text, a charcoal navigation strip, and
yellow search accents. Company cards separate identity, service tags, service
coverage, comparison, and a clearly labelled profile button. The same tokens
and card layout apply to the homepage and secondary routes. The previous
public stylesheet was replaced, not appended with another override layer.

Filters render open, then use a responsive disclosure on mobile. Crossing the
900px breakpoint updates disclosure state. A server-rendering regression check
asserts the initial open state on the Slovenian directory route. The provided
screenshot was inspected, but browser review of the revised render remains
unavailable in this managed environment. Fictional listings remain labelled
and excluded from indexing.


## Simple aggregator — current direction

The user accepted the improved visual language and requested a simpler product
that works across screen sizes. Retained the charcoal, white and yellow palette.
Home, country, service and general results now share `Directory`: a short
heading, one search field, office country, service buttons and a collapsed
advanced-filter panel. Removed the photo hero, duplicate homepage search logic,
sidebar prose, nonfunctional city shortcut and repeated market sections.

Company rows put comparable information on the left and actions on the right;
they stack below 700px. Filter fields stack, service buttons scroll within their
own strip, and page widths remain fluid down to 320px. Controls have 44px touch
targets, input text stays 16px on phones, navigation supports Escape, comparison
leaves space below the footer, and reduced-motion preferences are respected.
Country results show the matching local office when one exists. The homepage
now preserves advanced filters and switches to the general directory when
another office country is selected.

Profiles show the contact panel first on mobile. Removed the contact modal
which only told users that contacts were unavailable. Sample status is stated
in the panel. Real direct contact still requires real listings and the
production publishing workflow; the current schema only allows sample records.

Validation: TypeScript, server-rendering/filtering checks and asset packaging.
Responsive CSS was inspected at its breakpoint boundaries, but no browser
rendering/interaction verification is available in this environment. Do not
claim the design has been visually verified across devices.


## Slovenia-only refinement

Launch scope is now local Slovenian freight forwarders and logistics providers.
Removed country browsing from navigation and removed the country selector. The
service controls and optional filters share a compact toolbar, with a separate
scrollable service row on narrow screens. Retained the accepted visual palette
and card hierarchy. Removed the internal demo-admin link from the public footer.

The Slovenia boundary is applied to public search, service pages, individual
profiles, related companies, comparison URLs and stored comparison selections.
International service coverage is still shown. Server smoke checks verify that
foreign companies cannot reappear through old URLs or related-company links.
Visual browser verification remains unavailable; automated checks do not certify
visual polish or device compatibility.
