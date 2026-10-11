# LogisticsWorld

A regional directory for finding, comparing, and directly contacting logistics companies.

## Status

Planning baseline established on 11 October 2026. This repository currently contains product and architecture specifications, not a running application. No database or production deployment has been created.

## Agreed scope

- Start with Slovenia and neighbouring markets.
- Visitors contact companies directly through their published contact channels.
- Use the existing OnlyWorld architecture as the starting reference.
- Build the project in `juresavron/logistiscworld`.

## Working defaults

These are proposed implementation defaults, not additional user decisions: Slovenia, Italy, Austria, Croatia, and Hungary; English first; a single domain; administrator-managed listings; no visitor login; no public review system at launch. Brand name, domain, visual identity, and commercial pricing remain open.

## Blueprint

- [Product and page layouts](docs/product-and-layouts.md)
- [Data model and application architecture](docs/architecture.md)
- [Build milestones and acceptance criteria](docs/build-plan.md)
- [Responsive layout prototype](docs/wireframes.html) — download and open locally; fictional examples, no live company information.

Proposed stack: React, TypeScript, TanStack Start, Tailwind, Supabase, and Cloudflare Workers. Reuse suitable application patterns and components; create a fresh logistics schema and independent infrastructure.

## First implementation milestone

Scaffold the application and implement a fictional-data company profile, searchable directory, comparison view, and admin company editor. Then connect the database after access rules and publication behavior have been verified.
