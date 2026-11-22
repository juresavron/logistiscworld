# LogisticsWorld

A Slovenia-focused directory for finding and directly contacting logistics companies. Built with React, TypeScript, TanStack Start, and Tailwind, using OnlyWorld as the architecture reference.

## Current milestone

Live demo: https://logisticsworld.worldfans.workers.dev/

Custom domain: https://logisticsworld.eu/ (including `www`).

The directory is deployed to Cloudflare Workers with 25 real company listings. Source notes distinguish owner-supplied details from official website checks (12 October 2026). The independent Supabase project is initialized and connected to the live public catalog. The administrator sign-in page is protected; the first administrator Auth account and membership remain to be created. Without database runtime settings, the application serves the sourced static preview and administration stays locked. See `docs/persistent-catalog.md`.

- Slovenia-only homepage with service discovery.
- Searchable directory with URL-based filters, sorting, and pagination.
- Company profiles with addresses, branch contacts, source notes and direct website/email/phone links.
- Mediašped appears first in default matching results; explicit alphabetical sorting is preserved.
- Service landing pages, including rail freight. Comparison has been removed.
- Blog at `/blog`, with topic filters, three shipping guides, article pages, source links, related reading and a homepage preview. Articles use the custom domain for canonical and social metadata.
- Labelled Mediašped featured placements, an enriched company profile and source-tagged quote handoffs to Mediašped's own form. Aggregate referral metrics and the remaining CRM attribution gap are described in `docs/mediasped-referrals.md`.
- Authenticated shared catalog and company editor, with private drafts, administrator publication, revision checks and archival. Activation uses the independent Logisticsworld project.
- Private company submissions with reference receipts, duplicate-safe retries, database quotas and an authenticated review inbox at `/admin/submissions`. Review status never publishes a company; no messages are sent.

The sourced static catalog and database seed originate in `src/data/slovenian-companies.ts`; fictional fixtures remain only for tests. Once configured, the database is authoritative for all public listings. Drafts stay private until an administrator publishes them. No ratings, traffic, or verification claims are invented.

## Run locally

Requires Node.js 22.12+.

```sh
npm ci
npm run dev
```

Open `http://localhost:4173`. The development server binds to all interfaces; use a trusted development environment.

```sh
npm run check
npm run smoke
```

`check` runs TypeScript, behavior tests, and the client/server production build. `smoke` builds a separate Node test bundle, then checks rendered routes directly through its server handler without opening a listening server. Hosted authenticated browser QA remains pending database activation.

## Cloudflare deployment

Cloudflare Workers configuration is included. See [deployment setup](docs/cloudflare-deployment.md) for GitHub integration and first deployment. To validate the Workers bundle without publishing, run `npm run deploy:check`. To build and publish from an authenticated CLI, run `npm run deploy`.

The first demo was published through the Cloudflare API on 11 October 2026. GitHub automatic deployments are not yet connected. The connector asset-upload endpoint rejected authentication, so this demo packages JS/CSS as Worker text modules; normal Wrangler deployments use native static assets.

## Design and architecture

The current design uses charcoal, white and yellow accents, wide responsive layouts, structured company information and prominent search. Research references include Clutch, Freightnet, Freightos, and Cargo Directory World.

- [Design research and decisions](docs/design-research.md)
- [Product and page layouts](docs/product-and-layouts.md)
- [Data model and application architecture](docs/architecture.md)
- [Build milestones and acceptance criteria](docs/build-plan.md)

The original `docs/wireframes.html` is a superseded planning artifact. The application in `src/` is the current implementation.

## Next milestone

The independent Supabase project and 25-company catalog are initialized. Private company intake and its review inbox are implemented; see [company submissions](docs/company-submissions.md). Complete the first administrator account and verify the hosted editing and review flows. The code and activation steps are in [persistent catalog setup](docs/persistent-catalog.md). Then connect Mediašped enquiries to SavSale and complete the indexing launch. The site stays `noindex` until those publication controls are ready.

English, a single domain, administrator-managed listings, no visitor login, and no public reviews are working defaults. Commercial pricing remains open. Quote booking and intermediary messaging are outside the agreed direct-contact scope.

## Blog content

Published articles live in `src/data/blog.ts`, newest first. Add a `BlogPost` with a unique URL slug, summary, topic, publication date, takeaway, sections with unique anchor IDs, and primary-source links. Article pages, the blog listing, related reading and homepage previews use this catalog. New content is published with an application deployment; the company editor does not manage articles.

The domain is `logisticsworld.eu`. Search indexing remains disabled while the wider directory is in preview.
