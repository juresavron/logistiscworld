import { pageHead } from "../domain/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PublicLayout } from "../components/layout";
import { countries } from "../domain/company";
import { companies } from "../data/companies";
export const Route = createFileRoute("/locations")({
  head: () => pageHead('Logistics Companies by Country', 'Find logistics companies with offices in Slovenia, Italy, Austria, Croatia, and Hungary. Explore sample profiles by country.', '/locations'),
  component: () => (
    <PublicLayout>
      <div className="wrap section">
        <span className="eyebrow">REGIONAL REACH. LOCAL KNOWLEDGE.</span>
        <h1>Start closer to your business.</h1>
        <p className="intro-text">
          Explore companies by their physical office location. Every profile
          also shows the countries its services cover.
        </p>
        <div className="country-grid">
          {countries.map((c, i) => (
            <Link
              className={`country-tile country-${i}`}
              key={c.code}
              to="/locations/$country"
              params={{ country: c.slug }}
            >
              <div className="country-tile-top">
                <span>{c.code}</span>
                <ArrowUpRight size={24} />
              </div>
              <div>
                <h2>{c.name}</h2>
                <p>{c.city}</p>
                <span className="country-count">
                  {
                    companies.filter((x) =>
                      x.offices.some((o) => o.country === c.code),
                    ).length
                  }{" "}
                  sample companies
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  ),
});
