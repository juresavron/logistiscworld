import { emptySearch } from "../domain/search";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { ComparisonProvider } from "../components/comparison";
import stylesheet from "../styles.css?url";
import countryStylesheet from "../country-site.css?url";
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LogisticsWorld — find your logistics partner" },
      {
        name: "description",
        content:
          "Find local freight forwarders and logistics providers in Slovenia. Compare services, coverage, and company details.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#252c2f" },
    ],
    links: [{ rel: "stylesheet", href: stylesheet }, { rel: "stylesheet", href: countryStylesheet }],
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
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ComparisonProvider>
          <Outlet />
        </ComparisonProvider>
        <Scripts />
      </body>
    </html>
  );
}
