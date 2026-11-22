import { emptySearch } from "../domain/search";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  Link,
} from "@tanstack/react-router";
import stylesheet from "../styles.css?url";
import countryStylesheet from "../country-site.css?url";
import adminStylesheet from "../admin-site.css?url";
import blogStylesheet from "../blog.css?url";
import featuredStylesheet from "../featured-partner.css?url";
import { getCompany } from "../server/catalog";
import { FeaturedPartnerContext } from "../components/featured-partner";
import { getSeoSettings } from "../server/seo";
import { jsonLd, robotsDirective, siteOrigin } from "../domain/seo";
export const Route = createRootRoute({
  loader: async () => { const [partner, settings] = await Promise.all([getCompany({ data: "mediasped" }), getSeoSettings()]); return { partner, ...settings }; },
  head: ({ loaderData, matches }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LogisticsWorld — find your logistics partner" },
      {
        name: "description",
        content:
          "Find local freight forwarders and logistics providers in Slovenia. Browse services, coverage, and company details.",
      },
      { name: "robots", content: robotsDirective(loaderData?.indexingEnabled ?? false, matches.at(-1)?.pathname ?? "/", matches.at(-1)?.search ?? {}, matches.every(match => match.status === "success")) },
      { name: "theme-color", content: "#252c2f" },
    ],
    links: [{ rel: "stylesheet", href: stylesheet }, { rel: "stylesheet", href: countryStylesheet }, { rel: "stylesheet", href: adminStylesheet }, { rel: "stylesheet", href: blogStylesheet }, { rel: "stylesheet", href: featuredStylesheet }],
  }),
  component: Root,
  notFoundComponent: () => (
    <div className="empty-state">
      <h1>That page isn’t here.</h1>
      <p>Find the right partner in the company directory.</p>
      <Link className="button dark" to="/companies" search={emptySearch}>
        Browse companies
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="empty-state">
      <h1>We couldn’t load this page.</h1>
      <p>
        {import.meta.env.DEV && error instanceof Error
          ? error.message
          : "Please try again."}
      </p>
      <button className="button dark" onClick={reset}>
        Try again
      </button>
    </div>
  ),
});
function Root() {
  const { partner } = Route.useLoaderData();
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "LogisticsWorld", url: siteOrigin }, { "@type": "WebSite", "@id": `${siteOrigin}/#website`, name: "LogisticsWorld", url: siteOrigin, inLanguage: "en", publisher: { "@id": `${siteOrigin}/#organization` } }] }) }}/>
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <FeaturedPartnerContext.Provider value={partner}><Outlet /></FeaturedPartnerContext.Provider>
        <Scripts />
      </body>
    </html>
  );
}
