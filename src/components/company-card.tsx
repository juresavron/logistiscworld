import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { countryName, serviceName, type Company } from "../domain/company";
import { CompareButton } from "./comparison";
import { Monogram } from "./ui";

export function CompanyCard({
  company: c,
  compact = false,
}: {
  company: Company;
  compact?: boolean;
}) {
  const primary = c.offices.find((o) => o.primary) ?? c.offices[0];
  const coverage = [...new Set(c.coverage.flatMap((x) => x.countries))];
  return (
    <article className={`company-card ${compact ? "compact" : ""}`}>
      <div className="company-card-top">
        <Monogram company={c} />
        <div className="company-card-identity">
          <span className="overline">{c.types[0]}</span>
          <h3>
            <Link to="/companies/$slug" params={{ slug: c.slug }}>
              {c.name}
            </Link>
          </h3>
          <span className="location-line">
            <MapPin size={13} />
            {primary.city}, {countryName(primary.country)}
          </span>
        </div>
        <span className="sample-label">SAMPLE</span>
      </div>
      <p className="company-summary">{c.summary}</p>
      <div className="tag-list">
        {c.services.slice(0, 3).map((s) => (
          <span key={s}>{serviceName(s)}</span>
        ))}
        {c.services.length > 3 && <span>+{c.services.length - 3}</span>}
      </div>
      <div className="company-facts">
        <div>
          <span className="overline">Service coverage</span>
          <strong>{coverage.map(countryName).join(" · ")}</strong>
        </div>
        {!compact && (
          <div>
            <span className="overline">Special capability</span>
            <strong>{c.capabilities[0] ?? "Not provided"}</strong>
          </div>
        )}
      </div>
      <div className="company-card-bottom">
        <CompareButton id={c.id} compact />
        <Link
          className="profile-link"
          to="/companies/$slug"
          params={{ slug: c.slug }}
        >
          View company <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
