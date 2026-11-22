# Persistent company catalog and administrator access

This release replaces the browser-only editor with authenticated server administration. It adds the application code, database baseline, and a seed for the 25 sourced launch listings. The user provisioned the independent Logisticsworld Supabase project `iaescoqdabfzhzslcepr` in Ireland. Both catalog migrations and the 25-company seed have been applied. The public site is deployed with its database connection. Live directory search, company profiles, the blog referral link and the protected administrator sign-in page have been verified. The first administrator Auth account and membership still need provisioning.

## Behavior

- Without either database setting, public pages use the existing sourced preview catalog and administration shows a setup message. No local-storage editing is offered.
- With both settings present, homepage results, directory searches, profiles, related companies and featured placement use published database records. Database failures produce an error; they never silently restore an archived static listing.
- Drafts are shared, private records. Saving leaves the current publication visible. An administrator publishes a complete revision in one transaction. Editors cannot publish, archive, change promotional placement or grant themselves access.
- A version check and a row lock prevent stale writes. Retrying an uncertain result cannot silently overwrite a newer version. A new editor session uses a stable ID for its initial save.
- Archive removes the public record and records a new revision. Publishing again restores it. Published profile slugs cannot be changed in this milestone; this preserves existing links without introducing unreviewed redirects.
- Revision snapshots are append-only through the application. Memberships and all base writes are provisioned administratively; no public sign-up or role assignment is exposed.

## Authentication and public access

The application uses the project's publishable key and each editor's access token, never a service-role key. Password login uses Supabase Auth. The access token stays in an HttpOnly, same-site cookie, secure on HTTPS, with a maximum one-hour lifetime. Refresh tokens are not retained. Editors sign in again when the session expires. Every authenticated operation validates the user with Auth and checks their active database membership. A role in user-editable metadata does not grant access.

Private responses use `Cache-Control: private, no-store`; mutation requests require a matching Origin. SQL authorization is checked again for direct RPC access, including immediate membership revocation. Every table has RLS; anonymous visitors can select published records only. Privileged SQL functions are confined to the non-exposed `catalog_private` schema with a fixed empty search path and explicit grants. Public wrappers run with invoker rights. Supabase’s explicit default `anon` function grants are revoked from administrative wrappers; only published-catalog search is callable anonymously. The PostgreSQL test setup reproduces these hosted defaults.

The current directory is small. Filtering, counting, ordering and pagination run in PostgreSQL. The public query returns at most 12 company records. Add and measure further indexes when the catalog grows; do not introduce public response caching until publication and archival invalidation has been implemented and tested.

## Activation

1. Select the Supabase organization and review any quoted incremental project cost before creating a project. Use a separate project named LogisticsWorld; do not point this baseline at Mediašped, SavSale, OnlyWorld or OcenaGor.
2. Apply all migrations in order, including the explicit Supabase RPC-grant hardening migration. Keep `catalog_private` outside the Data API's exposed schemas. Only `public` needs exposure for this application.
3. Apply `supabase/seed.sql` once to the empty project. It refuses to run over an existing catalog and creates no administrator users. `npm run catalog:seed` reproduces the seed from the sourced TypeScript catalog.
4. Create the authorized administrator in Supabase Auth using the chosen sign-in email and a secure password. Provision its exact returned user ID in `public.admin_memberships` with role `administrator`. Editors can be provisioned separately with role `editor`. Keep public sign-up disabled and configure Auth's login rate limits.
5. Set `CATALOG_SUPABASE_URL` and `CATALOG_SUPABASE_PUBLISHABLE_KEY` in the Worker runtime. Both are server configuration. Use the project's actual publishable key. Privileged keys are explicitly rejected. Local development can copy `.dev.vars.example` to the ignored `.dev.vars`.
6. Rebuild and deploy the exact reviewed source. When deploying through the alternative module API, preserve runtime bindings and secrets; do not upload an older configuration that drops these settings.
7. Verify sign-in, a draft save, publication, a stale concurrent save and archival on the real database. Confirm anonymous reads cannot access drafts or revisions, check all public routes after archival, and run Supabase security advisors. This live verification is required before calling database activation complete.

No new Auth emails or customer enquiries are sent by this release. The database has been initialized with sourced company records. Google indexing remains disabled. The sample company-submission form is still browser-only. Persistent submissions, Mediašped/SavSale conversion attribution and indexing are subsequent work.

## Validation

```sh
npm ci
npm run typecheck
npm test
npm run test:database
npm run smoke
npm run smoke:database
npm run deploy:check
```

`test:database` applies the real migration and seed in a disposable PostgreSQL WASM instance. It checks public/private access, editor and administrator privileges, concurrency, publication validation, service-specific search, archival and revocation. `smoke:database` checks the built server through an emulated Supabase HTTP boundary backed by the same schema; it does not claim to validate the hosted Supabase service. Do not use a production database for these checks.

## Verified deployment — 22 November 2026

- Public URL: https://logisticsworld.eu/
- Supabase project: `iaescoqdabfzhzslcepr`, organization Logisticsworld, Ireland.
- Applied migration versions: `20261122213700` and `20261122214042`. Source filenames match the server's recorded history; their SQL is unchanged from the tested baseline and grant correction.
- Published company count: 25. Live anonymous search and private-access denial checks passed.
- Application source: `d6a0080ddec970780079d2c8408a5404f278c46d` (PR #3), tree `b3e8b3a0d5f6c7f8b4eded8cb3c01de9807fdbfd`.
- Cloudflare deployment: `69b04fcb-6549-4378-88e8-f4c1ecb3af7c`; Worker version `59708d7b-358f-445d-bfbd-f8fa0b2d2e53`, serving 100% of traffic.
- Both database runtime settings and the existing referral analytics binding are present. No elevated database key is used.
- Local validation passed: 32 unit tests, 37 PostgreSQL assertions, 33 rendered routes, compiled-server auth/publication checks and the Workers deployment/package checks. Hosted CI did not start; no check or branch protection was disabled.
- Security advisors report no warnings or errors. Two informational notices identify private tables with RLS and no direct-access policies; this intentional default-deny boundary was verified with actual anonymous and unassigned authenticated roles.

Administrator activation is intentionally incomplete until the owner creates their Auth account with their own password and its exact Auth user ID is assigned an administrator membership. No invitation emails have been sent. The public catalog is live, and Google indexing remains disabled while submission handling and the broader launch work remain pending.
