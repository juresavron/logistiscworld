# Cloudflare Workers deployment

The application is configured for Cloudflare Workers with the official Cloudflare Vite plugin. Worker name: `logisticsworld`. The repository name remains `juresavron/logistiscworld`.

## Connect the GitHub repository

In Cloudflare's Workers & Pages dashboard, create a Worker using the existing GitHub repository:

- Repository: `juresavron/logistiscworld`
- Branch: `main`
- Root directory: repository root
- Worker/project name: `logisticsworld` (must match `wrangler.jsonc`)
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node.js version: 22.16.0 or newer supported version

No application secrets or database bindings are required for the fictional-data preview. Wrangler deployment authentication is supplied by Cloudflare's Git integration. Once connected, pushes to the production branch trigger a build/deploy.

After deployment, open the exact `workers.dev` URL Cloudflare returns and check the homepage, company directory, a profile, comparison, and demo admin editor. The account's Workers subdomain is assigned by Cloudflare and is not assumed in the source.

## CLI alternative

```sh
npm ci
npx wrangler login
npm run deploy
```

With multiple accounts, choose the intended account during setup. For noninteractive CI, supply a scoped `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as protected CI secrets. Never commit credentials or put them in client-side environment variables.

## Validation

```sh
npm run typecheck
npm test
npm run smoke
npm run deploy:check
```

`smoke` builds a Node-only version for direct server-handler route checks. `deploy:check` rebuilds for the actual Workers runtime and runs Wrangler's deployment dry run. Always deploy through `npm run deploy`, or run `npm run build` immediately before `npx wrangler deploy`; the Node smoke output is not the deployment artifact.

## Launch state

This first deployment is a visibly labelled sample-data preview with `noindex` metadata. The admin workspace and submission form save only to browser storage. They do not offer authenticated server-side administration or process submissions. Supabase integration, real company listings, browser QA, and a custom domain are separate launch milestones.
