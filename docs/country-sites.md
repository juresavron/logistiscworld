# Slovenia launch and future country editions

User direction, 11 October 2026: acquire a separate country domain, for example
`freightforwarderslovenia.com` and `freightforwarderpoland.com`.
These are proposed names, not checked availability or connected domains.

## Architecture decision

Keep one repository, one application design, and one shared company catalog.
Use a country edition configuration for the domain, country, display name,
languages, local copy, primary service intent, and publication state. Do not fork
one application repository per country. Administration should manage companies
once and explicitly select which country editions each listing belongs to.
A physical office and a country served remain separate data fields.

When domains have been purchased, connect approved hostnames to the Worker and
resolve the edition on the server from an explicit hostname allowlist. Pass the
resolved edition through the router context so SSR and hydration agree. Never
construct canonical URLs from an arbitrary incoming Host header. Keep preview
hosts noindex; redirect www/apex aliases to one chosen canonical origin.

Each published edition requires:

- A local homepage and useful, country-specific company/service content.
- Country-scoped default discovery, listings, and internal links.
- Its own canonical origin, sitemap, robots policy, and Search Console property.
- Self-canonicals for genuinely distinct pages. Redirect or canonicalize true
  duplicates; do not canonicalize the whole network to the Slovenia homepage.
- Hreflang only for real equivalent language/region pages, with reciprocal links.
- Shared company identity but accurate local offices, contacts, and service
  coverage. Poland requires a catalog-country schema extension and real local
  records; it is not presently part of the supported five-country catalog.

The domain is an entry point, not a ranking guarantee. Each country needs
original, useful information. Do not publish near-identical country sites by
changing country words alone.

## Current implementation

Launch is strictly Slovenia-only, per the user's clarification on 11 October.
No country browsing or office-country selector appears on the public website.
`src/data/slovenia.ts` scopes discovery, profiles, recommendations and comparison
to companies with a Slovenian office. Search forces the Slovenian scope even
when an old URL requests another office country. International destinations
remain service-coverage data, not a way to browse foreign providers.

Old `/locations` and `/locations/slovenia` links redirect to `/companies`.
Other country pages and foreign-only company profiles return 404. Foreign
fixtures are retained only for demo admin and generic domain tests. Future
country editions are a separate launch decision; they do not add a country
switcher to this website.

The Worker still uses its preview domain. No purchased domains, hostname
routing, Poland edition, production database, or automatic Git deployment are
configured. See `design-research.md` for the current visual direction.

## Design references

- Clutch: https://clutch.co/logistics/supply-chain-management
  — structured provider information and clear profile actions.
- Freightnet: https://www.freightnet.com/directory/p1/cSI/s99.htm
  — country/service discovery and direct provider contact.
- Sortlist: https://www.sortlist.com/
  — service discovery as the main entry point.

Pages reviewed for content and interaction structure, not audited pixel by pixel.
The new design is an original navy/blue/white directory layout. It replaces the
large decorative globe and pushes search and comparable listings earlier.
No ratings, endorsements, customer counts, or real company logos are invented.

Google reference:
https://developers.google.com/search/docs/appearance/ranking-systems-guide
