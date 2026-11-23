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

## SEO follow-up — 23 November 2026

Direct Search Console inspection now confirms that `/locations/koper` is on Google and its page is indexed. This is an index-inclusion receipt, not a ranking or traffic measurement. `/services/customs/koper` remains unknown to Google's index; its live test at 12:07 CET returned “URL is available to Google” and “Page can be indexed”. No additional indexing request was submitted in this follow-up.

The Sitemaps report still shows “Couldn't fetch”, type Unknown and zero discovered pages. Its detail view offers no specific HTTP or parsing error. The existing live sitemap test at 12:01 CET reports crawling allowed and successful fetching. These are different signals: sitemap processing is unresolved even though Google can fetch the XML and has indexed the Koper directory page. Do not report this as a fixed sitemap issue. Google's [sitemap troubleshooting guidance](https://support.google.com/webmasters/answer/7451001) recommends checking the live fetch result; its [official office-hours guidance](https://developers.google.com/search/help/office-hours/2023/december#can-the-sitemap-file-link-itself) also permits an X-Robots-Tag noindex header on the sitemap itself.

The Koper directory and customs landing page now have server-rendered shipment handovers, enquiry checklists, quotation cost comparisons, buyer questions, official source links and in-page navigation. Mediašped's labelled quotation actions beside each checklist preserve `location:koper` and `location:customs-koper` attribution and disappear if the featured partner is unpublished. Port information is based on [Luka Koper](https://www.luka-kp.si/en/terminal/container-terminal/); customs background is based on [FURS import guidance](https://www.fu.gov.si/en/customs/areas_of_work/import_of_goods/) and [FURS transit guidance](https://www.fu.gov.si/en/business_events_businesses/transport_of_goods_under_transit_procedures/). Provider acceptance, procedures and costs require shipment-specific confirmation.

Validation: TypeScript, 39 unit tests, 60 PostgreSQL assertions, 39 rendered-route checks, database-backed production/indexing/publication checks, the Workers production build/deployment dry run and 57 packaged asset checks pass. Browser layout QA could not run: the local sandbox denied the development-server listener and headless Chrome terminated at startup. Responsive CSS is included, but no visual verification is claimed. These page improvements are prepared for review; no production deployment was made in this follow-up.
