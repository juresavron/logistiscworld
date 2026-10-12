# LogisticsWorld

A Slovenia-focused directory for finding and directly contacting logistics companies. Built with React, TypeScript, TanStack Start, and Tailwind, using OnlyWorld as the architecture reference.

## Current milestone

Live demo: https://logisticsworld.worldfans.workers.dev/

The directory is deployed to Cloudflare Workers with 25 real company listings. Source notes distinguish owner-supplied details from official website checks (12 October 2026). No database or administrator authentication has been connected.

- Slovenia-only homepage with service discovery.
- Searchable directory with URL-based filters, sorting, and pagination.
- Company profiles with addresses, branch contacts, source notes and direct website/email/phone links.
- Mediašped appears first in default matching results, labelled Featured; explicit alphabetical sorting is preserved.
- Service landing pages, including rail freight. Comparison has been removed.
- Browser-only admin catalog and company editor with draft validation, revision checks, and independent approved snapshots.
- Sample company submission form saved locally in the browser; no messages are sent.

The public catalog is maintained in `src/data/slovenian-companies.ts`; fictional fixtures remain only for tests. Approval in the demo editor does not change the public directory. Browser storage is neither shared nor permanent, and the admin route is deliberately unauthenticated for this sample milestone. No ratings, traffic, or verification claims are invented.

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

`check` runs TypeScript, behavior tests, and the client/server production build. `smoke` builds a separate Node test bundle, then checks rendered routes directly through its server handler without opening a listening server. Browser layout and interaction QA remains outstanding.

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

Connect an independent Supabase project with migrations, administrator authentication and access rules, then replace the static catalog lookup with database queries. Complete browser QA and verify the Cloudflare deployment on its live URL. The demo stays `noindex` until real content and publication controls are ready.

English, a single domain, administrator-managed listings, no visitor login, and no public reviews are working defaults. Brand/domain and commercial pricing remain open. Quote booking and intermediary messaging are outside the agreed direct-contact scope.
