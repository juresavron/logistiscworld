import { emptySearch } from "../domain/search";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, ChevronDown, MapPin } from "lucide-react";
import { countryName, serviceName, type Company } from "../domain/company";
import { Monogram, ServiceIcon } from "./ui";
import { companies } from "../data/slovenia";
import { CompanyCard } from "./company-card";

export function ContactPanel({ company }: { company: Company }) {
  return <aside className="contact-panel" id="contact" aria-label={`Contact ${company.name}`}>
    <h2>Contact company</h2>
    <p>This is a fictional sample. Email, phone and website details are not available.</p>
    <Link className="text-link" to="/methodology">About our listings <ArrowUpRight size={16}/></Link>
  </aside>;
}

export function Profile({ company: c }: { company: Company }) {
  const office = c.offices.find((o) => o.primary) ?? c.offices[0];
  const similar = companies.filter(x => x.id !== c.id && x.services.some(s => c.services.includes(s))).slice(0, 3);
  return <div className="company-profile">
    <section className="profile-top">
      <div className="wrap">
        <Link className="back-link" to="/companies" search={emptySearch}>
          <ArrowLeft size={16}/> All companies
        </Link>
        <div className="profile-identity">
          <Monogram company={c} large/>
          <div className="profile-heading">
            <span className="eyebrow">{c.types.join(" · ")}</span>
            <h1>{c.name}</h1>
            <div className="profile-meta">
              <span><MapPin size={16}/>{office.city}, {countryName(office.country)}</span>
              <span className="sample-label">Sample company</span>
            </div>
            <p className="profile-summary">{c.summary}</p>
          </div>
        </div>
      </div>
    </section>
    <div className="wrap profile-layout">
      <ContactPanel company={c}/>
      <div className="profile-body">
        <section id="services" className="profile-section profile-services">
          <h2>Services & coverage</h2>
          <p className="section-caption">Countries served by each service.</p>
          <ul className="profile-service-list">
            {c.services.map(service => <li key={service}>
              <span className="service-icon"><ServiceIcon service={service}/></span>
              <div>
                <h3>{serviceName(service)}</h3>
                <p>{c.coverage.find(v => v.service === service)?.countries.map(countryName).join(" · ") || "Coverage not provided"}</p>
              </div>
            </li>)}
          </ul>
          {c.capabilities.length > 0 && <div className="profile-capabilities">
            <h3>Special capabilities</h3>
            <div className="tag-list">{c.capabilities.map(v => <span key={v}>{v}</span>)}</div>
          </div>}
        </section>
        <div className="profile-company-info">
          <section id="overview" className="profile-section">
            <h2>Company details</h2>
            <dl className="profile-facts">
              <div><dt>Registered name</dt><dd>{c.legalName}</dd></div>
              <div><dt>Company type</dt><dd>{c.types.join(", ")}</dd></div>
            </dl>
          </section>
          <section id="offices" className="profile-section">
            <h2>{c.offices.length === 1 ? "Office" : "Offices"}</h2>
            {c.offices.map((o, i) => <div className="profile-office" key={i}>
              <MapPin size={20}/>
              <div>
                <h3>{o.city}, {countryName(o.country)}</h3>
                <p>{o.primary ? "Primary office" : "Branch office"}</p>
                {o.country === "SI" && <Link className="text-link" to="/companies" search={{...emptySearch,q:o.city}}>
                  Companies in {o.city} <ArrowUpRight size={16}/>
                </Link>}
              </div>
            </div>)}
          </section>
        </div>
        <details id="details" className="profile-listing-note">
          <summary>About this sample listing <ChevronDown size={18}/></summary>
          <p>This profile is fictional and does not represent a real business. Its information has not been verified.</p>
          <Link className="text-link" to="/methodology">How we check listings <ArrowUpRight size={16}/></Link>
        </details>
      </div>
    </div>
    {similar.length > 0 && <section className="section profile-related">
      <div className="wrap">
        <div className="section-heading"><h2>Similar companies in Slovenia</h2></div>
        <div className="company-grid">{similar.map(x => <CompanyCard key={x.id} company={x} compact/>)}</div>
      </div>
    </section>}
  </div>;
}
