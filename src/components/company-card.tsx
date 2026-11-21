import { CompanyLogo } from "./company-logo";
import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { countryName, serviceName, type Company, type CountryCode } from "../domain/company";
import { FeaturedBadge, MediaSpedQuoteLink } from "./featured-partner";
import type { ReferralSource } from "../domain/referrals";

export function CompanyCard({ company: c, compact = false, officeCountry, referralSource = {placement:"directory",content:"listing"} }: { company: Company; compact?: boolean; officeCountry?: CountryCode; referralSource?: ReferralSource }) {
  const primary = c.offices.find(o => o.country === officeCountry) ?? c.offices.find(o => o.primary) ?? c.offices[0];
  const coverage = [...new Set(c.coverage.flatMap(x => x.countries))];
  return <article className={`company-card freight-record ${compact ? "compact" : ""} ${c.featured ? "freight-record--featured" : ""}`}>
    <div className="record-main">
    <div className="record-identity">
      <CompanyLogo company={c}/>
      <div className="record-name">{c.featured && <FeaturedBadge/>}<span className="record-type">{c.types[0]}</span><h3><Link to="/companies/$slug" params={{slug:c.slug}}>{c.name}</Link></h3><span className="record-location"><MapPin size={14}/>{primary.city}, {countryName(primary.country)}</span></div>

    </div>
    <p className="record-summary">{c.summary}</p>
    <div className="record-data">
      <div><span>Services</span><ul className="record-services">{c.services.map(s => <li key={s}>{serviceName(s)}</li>)}</ul></div>
      <div className="record-coverage"><span>Service coverage</span><p>{coverage.map(countryName).join(" · ") || "Ask company for destinations"}</p></div>
    </div>
    </div>
    <div className="record-bottom">{c.slug === "mediasped" && c.featured && <MediaSpedQuoteLink className="record-quote-link" source={referralSource}/>}<Link to="/companies/$slug" params={{slug:c.slug}}>View company <ArrowRight size={17}/></Link>{c.featured && <span className="record-featured-note">Promotional placement · <Link to="/methodology" hash="featured-placements">About featured partners</Link></span>}</div>
  </article>;
}
