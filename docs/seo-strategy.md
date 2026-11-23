# Slovenia search launch — 22 November 2026

LogisticsWorld is a Slovenia-focused directory intended to connect relevant freight searches with useful company information and labelled Mediašped quotation handoffs. The owner asked to learn from the SEO of ForwardingCompanies and FreightForwarderServices, not to copy their design or content. No search volume, competitor traffic, backlink profile or ranking outcome has been established.

The agreed primary and supporting keyword assignments are maintained in [the keyword map](keyword-map.md). The homepage targets **freight forwarders in Slovenia**; logistics companies is a supporting query family.

## Search intent and page ownership

| Canonical page | Search intent |
| --- | --- |
| `/` | Freight forwarders in Slovenia; logistics forwarder and logistics companies as supporting query families |
| `/companies` | Search the catalog; arbitrary filters remain noindex |
| `/locations` | Discover published local-office directories |
| `/locations/koper` | Finding a freight forwarder for the Port of Koper; listings have a published Koper office and must confirm port service scope |
| `/locations/ljubljana` | Freight forwarders with Ljubljana or explicitly named district offices |
| `/services/customs/koper` | Customs service providers with a Koper office |
| `/services/sea` | Sea freight in Slovenia and planning through Koper |
| `/services/forwarding` | International freight forwarding services, coordinated transport and shipment responsibilities |
| Other service pages | Individual freight and logistics services |
| `/companies/{slug}` | Company identity, public offices, services and direct contacts |
| `/blog/container-shipping-china-to-koper` | China-to-Koper planning and complete quotation requests |
| Other blog articles | Koper shipments, FCL/LCL and freight quote preparation |
| `/methodology` | Source handling, company selection and commercial disclosure |

There is no second country page duplicating the homepage. The old `/locations/slovenia` URL retains its redirect. Maribor and other locations are not given empty SEO pages. Ljubljana matches Ljubljana, Ljubljana–Šentvid and Ljubljana–Črnuče; it does not silently include Brnik, Kranj or Šenčur. Companies with multiple matching offices count once. The launch catalog has 17 Koper companies, four in the Ljubljana grouping and seven matching both Koper and customs.

## Production indexing

`PUBLIC_INDEXING_ENABLED=true` enables indexing only on the exact HTTPS origin `https://logisticsworld.eu` and only with a configured persistent catalog. Local development, workers.dev and other preview hosts remain noindex and do not receive a sitemap. A configured database failure does not fall back to static records.

Public successful canonical routes permit indexing. Admin, submissions, comparison, quotation handoffs, filtered search and pagination stay noindex. Defaults are stripped from generated directory URLs. Company profiles use one canonical URL regardless of the city/service page linking to them. HTML errors retain actual 404/500 status; missing and archived companies cannot appear in the sitemap.

`/sitemap.xml` reads current public publications with bounded database pagination. It includes profiles, nonempty curated city/service pages and the public guides. Profile lastmod reflects publication time, not draft edits; blog dates are recorded publication dates. Static pages do not invent a fresh update date. Database failure returns 503 without an incomplete or stale sitemap. Sitemap and robots responses are not cached. Robots allows the public site, excludes server-function URLs and advertises the sitemap. Cloudflare may prepend its managed content-signal notice.

Organization/WebSite, company Organization, article BlogPosting and visible BreadcrumbList markup describe the corresponding content. No reviews, stars, quality positions or rich-result promises are invented. City and article quote handoffs preserve their allowlisted source and remain marked sponsored; outbound clicks are not submitted enquiries.

## Validation and next operations

TypeScript, behavior tests, PostgreSQL access/search tests, rendered routes and the compiled-server database suite cover production indexing, preview isolation, all sitemap URLs, private routes, duplicate-free city matching, database failure and removal after archival. Deployment uses the existing Cloudflare module transport and preserves catalog settings and referral analytics. Hosted CI remains subject to the account-level Actions restriction.

The first administrator Auth account is still an operational setup item. This does not expose drafts or private submissions: administration remains authenticated and database-authorized. On 23 November 2026 the Search Console domain property was accessible, sitemap submission was accepted, and indexing requests were confirmed for the six keyword pages. The sitemap report initially said “Couldn't fetch”; a separate live inspection fetched the XML successfully. Processing remains unconfirmed. A deployed sitemap or accepted request is not confirmation of Google indexing or rankings. See [launch verification](launch-verification.md).

## Sources used

- https://forwardingcompanies.com/in/slovenia
- https://forwardingcompanies.com/in/koper
- https://freightforwarderservices.com/slovenia/
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/crawling/docs/faceted-navigation
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://tanstack.com/router/latest/docs/api/router/stripSearchParamsFunction
- https://www.luka-kp.si/en/terminal/container-terminal/
- https://www.fu.gov.si/en/customs/areas_of_work/import_of_goods/
- https://www.maersk.com/support/faqs/2023/10/18/what-is-fcl
