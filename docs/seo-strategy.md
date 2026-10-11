# Slovenia-first search strategy

Primary target: **best logistics companies in Slovenia**.
Language: English initially, matching the current product. The public launch
is exclusively Slovenia; other countries describe service coverage only. No keyword volumes or ranking positions have been measured.

## Search intent and page ownership

| Page | Purpose / target |
| --- | --- |
| `/` | Best logistics companies in Slovenia: a buyer's guide and entry point to comparison |
| `/companies` | Local freight forwarders and logistics providers with Slovenian offices |
| `/services/forwarding` | Freight forwarding services from Slovenian providers |
| `/services/sea` | Sea freight providers, with local Koper shipment guidance in the buyer notes |
| Other service pages | Distinct service intent, limited to Slovenian providers |
| `/methodology` | Explain comparison criteria, sorting, source checks, and sponsorship policy |
| Company profiles | Specific company identity, services, locations, and direct contact |

Do not create duplicate landing pages for tiny keyword variations. Build useful
Slovenia-specific service pages later when real records and original local
content can support them. A Slovenian-language edition could target “najboljša
logistična podjetja v Sloveniji” and “špedicija Slovenija”; add proper translated
pages and hreflang only when those pages exist.

## Implemented

- Homepage title and H1 explicitly target the main query.
- Slovenia is enforced across all public search, profiles and comparison.
- Homepage sample shortlist contains only companies with Slovenian offices.
- Buyer guidance covers service fit, local offices versus service coverage,
  shipment requirements, and comparable quotes.
- Visible FAQs answer selection, Koper shipment, and direct-contact questions.
- Public directory, service, profile, and approach pages have distinct
  titles, descriptions, canonical links, and Open Graph metadata.
- The canonical origin is centralized in `src/domain/seo.ts`.
- Existing demo disclosures remain. No invented ratings, rankings, reviews,
  endorsements, or company structured data were added.

## Indexing remains blocked until real content is ready

The root `noindex, nofollow` directive still applies to the entire preview.
These changes prepare positioning; they do not make the website eligible to
appear in Google yet. Current companies are fictional and contact links are
not live. The preview description explicitly identifies its status.

Before public SEO launch:

1. Replace fictional records with researched real companies, current direct
   contact details, source URLs, and dates checked. Verify what each service
   actually covers. Document any commercial relationship with listed companies.
2. Choose the permanent domain and update the canonical origin and social URLs.
   A custom domain is a branding choice, not a technical indexing requirement.
3. Review every public page for accurate content, then replace the preview-wide
   robots directive with route-specific rules. Keep admin, comparison state,
   submissions, and arbitrary filters out of search indexing. Do not expose
   unauthenticated admin functionality as a production management system.
4. Publish a sitemap containing only canonical, indexable, real-content URLs.
   Ensure robots.txt allows the crawling needed to read indexing directives.
5. Verify Google Search Console for the chosen domain and submit the sitemap.
   Monitor impressions, clicks, indexed pages, and relevant queries. No ranking
   or traffic outcome is guaranteed.

## References reviewed 2026-10-11

- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Titles should describe each page, and the content should help a buyer make a
decision. Repeating “best” across every page or inventing a top-ten ranking does
not supply evidence about service quality.
