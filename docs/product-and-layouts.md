# Product and page layouts

Status: planning specification, 11 October 2026.

## Product promise

Help a business identify relevant logistics providers, understand their capabilities, compare alternatives, and contact a provider directly. Service and geographic suitability are the primary selection criteria.

The first release is a directory. Freight pricing, shipment booking, shipment tracking, shared quote requests, an internal message inbox, and customer reviews are outside this release.

## Navigation and URLs

Public navigation: Find companies, Services, Locations, How we select companies. Secondary action: Add a company. Logo returns home. Admin access is separate.

| Route | Role |
| --- | --- |
| `/` | Service/location search and discovery |
| `/companies` | Searchable, paginated directory |
| `/companies/:slug` | Canonical company profile |
| `/compare?company=id1,id2,id3` | Shareable comparison, maximum three |
| `/services` and `/services/:service` | Service index and curated service directory |
| `/locations` and `/locations/:country` | Country index and country directory |
| `/locations/:country/:city` | City directory when enough useful records exist |
| `/guides/:slug` | Manually reviewed best-company guides |
| `/methodology` | Selection, evidence, verification, sponsorship explanation |
| `/submit-company` | Moderated listing proposal |
| `/companies/:slug/claim` | Ownership-verification request |
| `/companies/:slug/correction` | Correction/report request |
| `/contact`, `/privacy`, `/terms` | Operator contact and policies |

Country means geography; language means content locale. Neither is a separate company identity. Language prefixes and alternate domains are deferred until there is translated content and a domain decision.

## 1. Company profile — reference layout

| Order | Desktop layout | Content and behavior |
| --- | --- | --- |
| 1 | Breadcrumb above header | Directory / company; preserve return-to-results filters |
| 2 | Wide company identity header | Logo or initials, trading name, legal name when different, company type, headquarters, date of last review |
| 3 | Main column + contact sidebar | Short factual overview and key services; contact panel contains Website, Call, Email, optional WhatsApp |
| 4 | Main-column sections | Services and capabilities, offices, countries served, credentials, company background |
| 5 | Evidence footer | What was checked, source links approved for publication, correction and claim links |
| 6 | Related providers | Up to three relevant alternatives; explain matching service or location |

Desktop contact sidebar remains visible while scrolling within its section. Mobile uses one column and a bottom Contact button opening a sheet with labelled channels; reserve safe-area space so content is never obscured. Compare is a secondary action beside the company identity.

Do not show empty sections or invent missing values. Comparison cells use “Not provided.” Use “Company details checked” with a details popover, not a blanket promise of reliability. Certificates show issuer, scope, expiry when known, evidence state, and last checked date. Expired credentials cannot receive a current-verification badge.

Primary contact action: Website when available, otherwise Call, otherwise Email. WhatsApp appears only when the company has explicitly supplied that channel. Phone numbers use international format. The interface never says a message was sent merely because an email or WhatsApp link opened.

## 2. Directory

Desktop: heading and result count; search field; left filter column; compact horizontal result cards; pagination; comparison tray at the bottom when selected. Mobile: search, Filters button showing active-filter count, active filter chips, stacked cards, pagination, comparison tray.

Each card shows logo, name, company type, main office, up to three services, a concise coverage summary, and explicit factual-check or sponsored labels. The main action opens the profile; the secondary action adds/removes comparison. Avoid clickable-card nesting conflicts: use a real profile link and a separate comparison button.

| Filter | Meaning |
| --- | --- |
| Search | Company name, service terms, city/port name |
| Service | What the visitor needs; selected services use OR semantics, stated in the UI |
| Office location | Physical office in the selected country/city |
| Serves country | Declared and reviewed service coverage, independent of offices |
| Company type | Forwarder, carrier, customs broker, warehouse operator; companies can have several |
| Capability | Refrigerated, dangerous goods, oversized cargo, etc.; selected capabilities require all matches |

Conditions across different filter groups combine with AND. Launch sorting: Relevant first and Name A–Z. Relevant first uses text-match relevance when a query exists, then exact requested office-location match, then stable name/ID ordering. Service and coverage constraints filter eligibility; sponsorship never changes organic ordering. Do not label this objective service-quality ranking.

Search/filter/sort/page state belongs in the URL. A filter change resets pagination. Back restores the search. Twenty results per page by default. Show results immediately from server rendering; refresh indicators do not blank the existing list. Empty results show active constraints and a clear reset action. Errors offer retry and preserve filters. Do not silently widen geography.

## 3. Home and discovery

Home hierarchy: concise value proposition; service selector + location selector + Search; service categories; launch countries; selected company profiles; short methodology explanation; Add your company.

Service/location pages reuse directory components. Add useful, specific introductory content only when supported by actual listings. Avoid publishing hundreds of empty combinations. “Best” guides remain editorial, with criteria, author/reviewer, review date, and reasons for inclusion. They are not generated automatically from payment or profile completeness.

## 4. Comparison

Maximum three published companies, no login. Columns: companies. Rows: company types, offices, countries served, services, capabilities, published credentials, last checked date, contact actions. Align facts by shared taxonomies. No fabricated overall score. Mobile uses labelled horizontal scrolling with a persistent row-label column and visible scroll affordance. Users can remove companies without leaving the page. Invalid/unpublished IDs are omitted with an explanation. Duplicate IDs count once.

## 5. Admin information architecture

Sidebar: Overview, Companies, Submissions, Imports, Services & locations, Analytics, Sponsorships. Admin title bar contains page title and one primary action.

Company list columns: Company, Offices, Services, Publication status, Last checked, Actions. Search and filters above the table; bulk publish only after per-record validation; archive requires confirmation. Editor opens as a dedicated page, not an oversized modal.

Editor sections: Identity; Services & capabilities; Offices & coverage; Contact channels; Evidence & credentials; Preview & publish. Desktop has a content column and a narrow readiness panel; mobile stacks these. Explicit Save draft and Publish actions. Show field-level validation plus a summary linked to invalid fields. Warn before navigating away with unsaved edits.

Readiness panel: identity, description, primary office, at least one service, at least one usable contact, source and review date. A logo is optional. Missing optional data does not block publication.

Submissions queue: new, in review, needs information, approved, rejected. Approval creates/updates an editor draft; it does not automatically publish. Claim approval records the outcome; it does not grant self-service account access in this release. Correction requests link to the affected company and preserve the old published version until a change is approved.

## 6. Analytics and commercial placements

Overview: estimated visitors, page views, company-profile views, contact-action clicks, comparison use. Show date range, timezone, definitions, and previous-period comparison. Unique visitors are an estimate under the selected measurement/consent approach, never a count of named people.

Analytics tabs: Traffic, Companies, Search. Traffic shows referrer/channel and landing pages; Companies shows profiles and contact-click breakdown; Search shows common normalized queries and zero-result patterns. Count a contact action once by event ID, record channel and placement, and exclude admin previews/test traffic.

Do not call clicks leads or completed calls. No invented response times, conversion claims, traffic counts, reviews, or endorsements. Treat raw search text as potentially sensitive: trim, limit, redact obvious email/phone patterns, and define retention before enabling collection.

Sponsorship inventory is a separate labelled block, scoped to relevant service/location pages, with explicit start/end dates and archived history. Expiry removes the placement without unpublishing the underlying company. Automatic billing and exact pricing are deferred.

## Visual and accessibility direction

Working wireframes use neutral colors and restrained blue accents; these are not approved branding. Information density, readable type, consistent service labels, and clear contact actions take priority over decorative imagery. Keyboard navigation, visible focus, labelled controls, descriptive errors, semantic headings, accessible tables, reduced motion, and mobile touch targets are acceptance requirements.

The companion HTML is a responsive layout prototype using fictional data. It illustrates directory, profile, and editor structure; filters, editing, and contact controls are illustrative until the actual application is built.
