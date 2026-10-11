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
