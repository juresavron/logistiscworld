import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { countryName, serviceName, type Company } from "../domain/company";
import { CompareButton } from "./comparison";

export function CompanyCard({ company: c, compact = false }: { company: Company; compact?: boolean }) {
  const primary = c.offices.find(o => o.primary) ?? c.offices[0];
  const coverage = [...new Set(c.coverage.flatMap(x => x.countries))];
  return <article className={`company-card freight-record ${compact ? "compact" : ""}`}>
    <div className="record-identity">
      <span className={`record-monogram tone-${c.tone}`} aria-hidden="true">{c.initials}</span>
      <div><span className="record-type">{c.types[0]} <span>· Sample listing</span></span><h3><Link to="/companies/$slug" params={{slug:c.slug}}>{c.name}</Link></h3><span className="record-location">{primary.city}, {countryName(primary.country)}</span></div>
      <Link className="record-open" to="/companies/$slug" params={{slug:c.slug}} aria-label={`View ${c.name}`}><ArrowUpRight size={22} strokeWidth={1.5}/></Link>
    </div>
    <p className="record-summary">{c.summary}</p>
    <div className="record-data"><div><span>SERVICES</span><p>{c.services.map(serviceName).join(" / ")}</p></div><div><span>COVERAGE</span><p>{coverage.map(countryName).join(" · ")}</p></div></div>
    <div className="record-bottom"><CompareButton id={c.id} compact/><Link to="/companies/$slug" params={{slug:c.slug}}>Company profile <ArrowRightIcon /></Link></div>
  </article>;
}
function ArrowRightIcon() { return <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true"><path d="M1 7h15m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.3"/></svg>; }
