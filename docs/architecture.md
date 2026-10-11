# Data model and application architecture

Status: proposed design; no SQL migrations or infrastructure applied.

## Architectural decisions

Retain the reference application's React/TypeScript, TanStack Start server rendering and routing, Tailwind component patterns, Supabase, and Cloudflare Workers. Create an independent deployment and Supabase project; never use the source project's connection fallbacks, production routes, datasets, credentials, or deployment workflow unchanged.

Start with one domain, one canonical company catalog, and geographic navigation. Keep locale configuration extensible. A geographic market is not an authorization tenant. A future company account is an organization membership, not a country membership.

Create a fresh migration baseline for this domain. Do not copy the reference application's historical migration chain or public-specific ranking behavior. Reuse reviewed code components selectively after dependencies, source identifiers, and embedded assumptions are checked.

## Entity model

Identifiers are UUIDs unless noted. Timestamps use timezone-aware values; user-visible analytics default to Europe/Ljubljana. Country identifiers use ISO two-letter codes. Taxonomy keys/slugs are stable and language-independent.

| Entity | Principal fields | Constraints and purpose |
| --- | --- | --- |
| `companies` | id, slug, legal_name, trading_name, registration_country, registration_number, publication_status, published_revision_id, archived_at, created_at, updated_at | One record per legal business, globally unique slug; partial uniqueness for nonempty registration country/number; not one row per market |
| `company_revisions` | id, company_id, revision_number, state, summary, description, website_url, public_email, phone_e164, whatsapp_e164, logo_path, founded_year, checked_at, checked_by, created_by, created_at | Versioned editable content; unique company/revision number; an approved published revision is immutable |
| `countries` | code, name, slug, launch_enabled | Five initial market candidates; other coverage countries may be recorded without launching directory pages |
| `places` | id, country_code, name, slug, kind, parent_place_id | City or port; unique country/slug; port associations do not imply a company owns port infrastructure |
| `company_offices` | id, revision_id, label, country_code, city_id, address, is_primary, public_phone, public_email | Many offices per revision; one primary office required for publication; city and office country must agree |
| `company_types` / `revision_company_types` | id or key, name, slug / revision_id, type_id | Many-to-many: freight forwarder, carrier, customs broker, warehouse operator |
| `services` / `revision_services` | id, key, name, slug, active / revision_id, service_id | Initial six services; pairs unique; referenced taxonomy terms retire rather than disappear |
| `capabilities` / `revision_capabilities` | id, key, name / revision_id, capability_id, note | Optional special handling and industry capabilities |
| `revision_coverage` | revision_id, country_code, service_id | Coverage attached to a specific service; unique triple; avoids implying every service operates in every listed country |
| `revision_port_services` | revision_id, port_id, service_id | Optional declared port service; distinct from physical office location |
| `credentials` | id, revision_id, name, issuer, reference, valid_until, check_state, checked_at, public_evidence_url | Credential-specific evidence; expiry disables current-check indication |
| `evidence_records` | id, company_id, revision_id, field_scope, source_url, source_kind, checked_at, checked_by, private_notes | Private editorial provenance; separately approve any public evidence links |
| `submissions` | id, kind, company_id?, submitter_email, payload, status, review_notes, reviewed_by, timestamps | Listing, correction, or ownership claim; private; bounded payload awaiting validation |
| `import_batches` / `import_candidates` | source, status, counts / batch_id, source_key, payload, matched_company_id, state, review_result | Staged ingestion, idempotent source keys, manual duplicate resolution |
| `guides` / `guide_companies` | slug, title, criteria, body, reviewed_at, status / guide_id, company_id, explanation, position | Editorial rankings and reasons; unique guide/company and guide/position |
| `sponsorships` | id, company_id, service_id?, country_code?, starts_at, ends_at, state | Separate commercial placements; valid interval and published-company eligibility |
| `analytics_events` | event_id, event_type, company_id?, session_token?, visitor_token?, path_key, placement, channel, dimensions, occurred_at | Server-validated event types/dimensions; idempotent event_id; no contact-message contents |
| `admin_memberships` | user_id, role, active | Provisioned administratively, no public role assignment |
| `audit_log` | id, actor_id, action, entity_kind, entity_id, before_summary, after_summary, created_at | Append-only editorial/security activity, no secret values |
| `company_slug_redirects` | old_slug, company_id | Preserve public links after approved renames; prevent slug reuse conflicts |

Descriptions and service labels start in English. Later add normalized translation tables keyed by entity and locale; do not duplicate the underlying company for translations. Parent/subsidiary legal entities remain separate and can acquire explicit group links later. Trade lanes and company-owner memberships are future additions.

## Publication and editing

Draft -> ready for review -> published; company can later be archived. Editing a published company creates a new draft revision; the existing published revision remains visible until replacement. Related offices, services, coverage, capabilities, and credentials belong to the revision so partial edits cannot leak.

Publish is a single server-authorized transaction: validate revision, validate all related records, freeze the revision, update the company's published pointer/status, write audit entry, and request public-cache invalidation. Require expected revision/version to prevent one editor silently overwriting another. If validation fails, nothing is published. Archive removes directory/profile eligibility and invalidates caches. Public rendering uses the published pointer only.

Minimum publication requirements: legal/trading identity, registration country, unique slug, factual summary, company type, primary office, at least one service, at least one validated contact channel, source provenance, and review date. Registration number and logo are optional; lack of them restricts any identity-verification claim. Never invent missing company facts.

## Query and public response contract

Directory request: `q`, `service[]`, `office_country`, `office_city`, `serves_country`, `type[]`, `capability[]`, `sort`, `page`. Validate UUIDs/keys, allowlisted sort values, query length, list lengths, and maximum page size on the server.

Response: public card fields only, total count, page information, and active filter summary. Profile response adds approved public contacts, offices, service-specific coverage, and credentials. Evidence notes, submitter identities, internal reviews, drafts, and admin flags never enter public response objects.

Use indexed database filtering, explicit column selection, and deterministic order. Start with offset pagination for the bounded launch catalog; consider cursor pagination after query measurement. Do not fetch all companies and sort/filter them in the browser. Coverage joins must match the chosen service; deduplicate companies before calculating counts and pagination.

Candidate indexes: unique company slug; registration country/number; company publication status; revision company/state; office country/city/revision; service-to-revision and capability-to-revision reverse indexes; coverage country/service/revision; analytics timestamp/company; submission status/created_at. Use `EXPLAIN ANALYZE` with representative volumes to confirm choices. Begin text search with PostgreSQL full-text search and a normalized searchable document; validate local names and accent handling before adding fuzzy matching. Never expose an unrestricted dynamic SQL order string.

## Access boundaries

| Actor | Read | Write |
| --- | --- | --- |
| Visitor | Published company projection, active taxonomy, published guides | Only validated submission and analytics endpoints |
| Editor | Drafts, evidence, submissions, catalog, aggregate analytics | Draft edits and moderation; publication subject to role |
| Administrator | Editor access plus roles, sponsorships, operational audit | Publish/archive, role management, placements |
| Future company member | Own organization only, after verified ownership | Own pending drafts only; outside launch scope |

Use authenticated user context and database policies for admin actions; enforce roles in server handlers and database policies. Public readers must not gain broad access to base revision/evidence tables. If using views, ensure their security semantics enforce the intended underlying policies, or restrict them to a server-only role. Every exposed table needs appropriate grants plus RLS. Service/secret keys stay server-only. Do not use user-editable metadata for roles.

Private submissions and analytics writes go through bounded, rate-limited server endpoints. Public users cannot insert approved records, assign ownership, or mark credentials verified. Use allowlisted contact protocols, validated media uploads, and plain text or sanitized rich content. Website contact links go directly to approved destinations; analytics must never prevent navigation.

## Analytics event contract

Events: `page_view`, `company_view`, `contact_click`, `compare_add`, `search_executed`, `submission_completed`. Server validates company visibility, channel, path, and placement, applies abuse controls, and deduplicates by event ID. A successful submission event follows confirmed storage, not a button click. A company profile page produces a page view and a company view with separate definitions; never sum them as total page views.

Contact channels: website, phone, email, whatsapp. Do not transmit full contact targets or page query strings to analytics. Use canonical path keys and bounded fields. Set the measurement/consent mechanism, retention, bot exclusion, and unique-visitor definition before enabling collection. Aggregate metrics are admin-only. Show contact clicks as clicks, not leads or delivered communications.

## Rendering, SEO, caching, and deployment

Server-render public profiles and directory pages. Only published canonical pages enter the sitemap. Noindex internal search/filter permutations, comparison, submissions, and admin routes. Curated service/location pages can be indexed when useful and nonempty. Maintain canonical links and slug redirects; add hreflang only for real translated equivalents.

Use a provisional short public cache TTL with publish/archive invalidation. Private/admin/submission responses use no-store; never cache authenticated data in a public response. Cache keys include normalized public URL and locale. Test removal/archival propagation rather than relying on long stale windows.

Separate development/preview and production configuration. Preview is noindex and uses fixtures or a separate database. Pin and audit dependencies before implementation. Run type checks, relevant unit/integration tests, build, and public/admin smoke checks before deployment. The first milestone does not provision production resources.

## Documentation references

- https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/query-optimization

Verify current SDK and hosting documentation before implementing. This document specifies desired behavior, not a claim that infrastructure or database policies already exist.
