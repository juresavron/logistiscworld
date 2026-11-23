# Launch verification — 23 November 2026

The existing `sc-domain:logisticsworld.eu` Search Console property is accessible in the owner's signed-in Chrome account. The submission of `https://logisticsworld.eu/sitemap.xml` returned “Sitemap submitted successfully”. The Sitemaps report then showed “Couldn't fetch”, with zero discovered pages. A later URL Inspection live test reported successful fetching and allowed crawling of the XML. Its `X-Robots-Tag: noindex` prevents the XML document itself appearing as a search result; public content pages remain indexable.

Google's live homepage test reported “URL is available to Google” and “Page can be indexed”. URL Inspection confirmed “Indexing requested” for:

- `/`
- `/locations/koper`
- `/services/customs/koper`
- `/services/sea`
- `/blog/container-shipping-china-to-koper`
- `/locations/ljubljana`

These receipts confirm requests, not completed crawling, index inclusion, query positions or traffic. The sitemap processing result needs a later check; no success is claimed for that report.

The Mediašped/SavSale integration has separate production receipt evidence for two reserved QA submissions, one from each source table. Replaying both events returned the same saved enquiry IDs and left one CRM row per source ID. The two QA submissions, their source outbox rows and their CRM rows were removed after exact receipt and replay verification; zero matching QA rows remain. They are not counted as business leads. Source and CRM changes are documented in their respective PRs and in [the referral funnel](mediasped-referrals.md).

## Publication status

Mediašped production deployment `6b0381f652a4da9dc3add911` is published at source commit `b0e55897899cf03ccdd5d67b2d290fe84ae9f7ac`. The SavSale receiver, private source binding and dispatcher are active. A further anonymous public-form API test returned HTTP 201, preserved `location:koper` and produced a matching CRM receipt; that fixture was also removed.

SavSale production build `6b0383cf45e44c15697dd7cc` passed its release checks at commit `e7dbd0326d6e78a2816f3cd6aa454538aed8612f`, but remains unpublished. The site's currently published deployment `6aff8444e51ace2e466482fa` is locked. The new Website enquiries screen therefore awaits manual publication of [the ready deployment](https://app.netlify.com/sites/5fb23195-2db3-4862-8793-fb2327d47b7d/deploys/6b0383cf45e44c15697dd7cc). The connected deployment tools expose status but no publication action, and the computer/browser connection became unavailable. No lock or access setting was changed.
