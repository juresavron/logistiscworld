# Build plan and acceptance criteria

Planning baseline: 11 October 2026. No effort estimate is a delivery commitment.

## Milestone 1 — runnable product skeleton

Scaffold independent React/TypeScript/TanStack Start application. Adapt reviewed reference components and routing patterns. Create local fictional fixtures and shared company types. Implement home, directory, company profile, comparison, and admin-editor layouts. Preserve room for branding changes.

Done when: local build succeeds; public routes render directly; search/filter state survives reload and back; mobile layouts work; compare caps at three; contact controls clearly identify destination/channel; no real messages are sent; fixtures are visibly marked and cannot reach a production seed by accident.

## Milestone 2 — catalog and access model

Provision the agreed independent development database; create fresh schema/migrations, policies, storage rules, indexes, authenticated admin shell, draft/revision flow, and atomic publication. Read the current Supabase documentation before implementing schema/auth details. Production project/hosting selection occurs before production provisioning.

Done when: anonymous clients cannot read drafts, private evidence, submissions, or admin memberships; editors cannot assign roles; one editor cannot overwrite another's changed revision unnoticed; draft edits to a published company do not change public data; publication is atomic; archived listings disappear; upload validation and storage access are checked. Tests must exercise database/API boundaries, not only hidden UI controls.

## Milestone 3 — working directory and content operations

Connect indexed search, pagination, profile relations, comparison, service/location routes, CSV import staging, duplicate review, listing/correction/claim submission, and admin moderation. First import flow accepts a documented CSV format; external scraping and enrichment are separate future decisions.

Done when: offices and coverage produce distinct correct results; coverage filters respect selected service; no duplicate company cards appear from joins; count/pagination agree; invalid filters fail gracefully; approved imports create drafts, not automatically published listings; submissions are rate-limited and remain private; claim approval alone grants no account permissions.

## Milestone 4 — analytics and launch preparation

Implement defined events and aggregate dashboards after deciding measurement/consent and retention. Add reviewed guides, sponsorship display, metadata, sitemap, redirects, error states, and cache invalidation. Confirm operator details, brand/domain, initial language, and content rights. Curate a proposed 50–100 real profiles from attributable sources; publication requires fact checks.

Done when: contact navigation works with tracking blocked; duplicate events do not inflate counts; previews are excluded; visitor/page/profile/click metrics have clear definitions; paid placements are labelled and expire correctly; search and preview pages do not enter the sitemap; expired credentials lose current-check status; mobile and keyboard journeys work; production configuration has no source-project identifiers or secrets.

## Milestone 5 — deployment and handover

Configure independent production environment and deployment workflow. Apply reviewed migrations, publish approved catalog, deploy, and smoke-test representative service, location, company, comparison, submission, login, and admin routes. Verify rollback approach for application changes and backup/recovery for the database. Record actual deployed commit and unresolved issues.

Done when: production behavior matches acceptance criteria, access restrictions are verified, contact destinations are checked, monitoring and operator ownership are documented, and the deployed version is recorded. A successful frontend build alone is not launch completion.

## Deferred features

Self-service company accounts; automated billing; paid plan limits; customer reviews; shipment quote requests; bookings; shipment tracking; internal chat; broad automated scraping; route-rate calculators; multi-domain rollout. Add only after a concrete need is established.

## Pending decisions and defaults

| Decision | Current proposed default | Needed by |
| --- | --- | --- |
| Market countries | SI, IT, AT, HR, HU | Real catalog ingestion |
| Initial language | English | Real public content |
| Branding and colors | Neutral wireframes only | Final visual design |
| Domain | Not selected | Production configuration |
| Infrastructure | Independent Supabase + Cloudflare deployment | Database/provisioning milestone |
| Listing population | CSV and manual editorial entry | Catalog milestone |
| Commercial model | Free listings and labelled sponsorships; no billing at launch | Sponsorship rollout |
| Measurement and retention | Pending explicit design choice | Analytics collection |

These choices do not block fixture-based application scaffolding. Do not silently treat a proposed default as a confirmed user instruction.
