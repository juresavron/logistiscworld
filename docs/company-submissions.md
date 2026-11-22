# Private company submissions

The public `/submit-company` form stores a company name, HTTPS website, private email and consent timestamp in the independent Logisticsworld database. It displays a reference only after a confirmed database receipt. No Auth account, public listing, outgoing email, customer enquiry or CRM record is created.

The form no longer writes contact details to local storage. A request ID remains in component memory for retries while the form stays open. Retrying the same request ID and normalized details returns the same receipt even after a lost response or quota exhaustion. A reused ID with different details is rejected. Reloading starts a separate request; the page does not promise cross-reload recovery.

Validation runs in the form, server handler and database function. Consent is required, HTTPS URLs cannot contain credentials, input lengths are bounded, and extra form fields cannot grant publication or ownership. The web handler requires the same Origin and rejects a filled hidden spam field. Database-enforced quotas allow at most three requests per normalized email per 24 hours and 100 requests globally per hour, including direct RPC calls. Quotas use a transaction advisory lock, so concurrent requests cannot race past them. These launch quotas are basic abuse protection, not proof of email or company ownership; reassess anti-bot protection before enabling indexing or acquisition campaigns.

`/admin/submissions` provides database pagination (20 requests), status filters and private review notes. Active editors and administrators may mark requests pending, reviewed or rejected. Every review requires the current version and writes an append-only audit entry. A review never publishes a company. Editors must check facts, use the existing company editor and obtain administrator publication separately. The submitter email must not be copied into public company contacts without an appropriate source and publication decision.

All new tables have RLS and no direct visitor/editor access. Anonymous callers can execute only the bounded intake RPC. The public inbox/review wrappers use invoker rights and check an active membership again in private, fixed-search-path functions. Unassigned Auth users and revoked memberships are denied. There is no service-role key. Submission pages, receipts and all private responses use no-store; private routes remain noindex.

## Deployment and verification

Apply the `private_company_submissions` migration to `iaescoqdabfzhzslcepr` before deploying this application code. Preserve the existing `CATALOG_SUPABASE_URL`, `CATALOG_SUPABASE_PUBLISHABLE_KEY` and `REFERRALS` bindings. The migration does not change existing catalog records or memberships.

Validation commands:

```sh
npm run typecheck
npm test
npm run test:database
npm run smoke
npm run smoke:database
npm run deploy:check
node scripts/package-worker-modules.mjs
node scripts/check-worker-package.mjs
```

The database fixtures verify private reads, consent, unsafe URLs, duplicate receipts, quotas, outsider denial, review conflicts, immutable audit and unchanged publication count. Built-server checks cover intake, duplicate retries, private inbox rendering, review, CSRF and membership revocation through an emulated Supabase boundary. They do not claim real hosted editor sign-in has been verified.

At implementation time the real project has no Auth users or administrator memberships. The owner must create their own Auth account with a private password and supply its exact email for membership provisioning. Hosted authenticated review and company editing remain pending that account. The subsequent SEO release enables public production indexing while preserving noindex on submissions and administration. Mediašped/SavSale conversion attribution is separate work. No data-retention automation is introduced by this release; an operator retention policy remains part of the wider launch preparation.
