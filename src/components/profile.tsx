import { emptySearch } from "../domain/search";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import {
  countries,
  countryName,
  serviceName,
  type Company,
} from "../domain/company";
import { Monogram, ServiceIcon } from "./ui";
import { CompareButton } from "./comparison";
import { companies } from "../data/companies";
import { CompanyCard } from "./company-card";

export function ContactPanel({ company }: { company: Company }) {
  return <aside className="contact-panel" id="contact" aria-label={`Contact ${company.name}`}>
    <span className="eyebrow">CONTACT</span>
    <h2>Contact details</h2>
    <p>{company.name} is a fictional sample. Contact details are not available.</p>
    <Link className="text-link" to="/methodology">About our listings <ArrowUpRight size={15}/></Link>
  </aside>;
}
export function Profile({ company: c }: { company: Company }) {
  const office = c.offices.find((o) => o.primary) ?? c.offices[0];
  const similar = companies
    .filter(
      (x) => x.id !== c.id && x.services.some((s) => c.services.includes(s)),
    )
    .slice(0, 3);
  return (
    <>
      <section className="profile-top">
        <div className="wrap">
          <Link className="back-link" to="/companies" search={emptySearch}>
            <ArrowLeft size={15} />
            Company directory
          </Link>
          <div className="profile-identity">
            <Monogram company={c} large />
            <div>
              <span className="eyebrow">{c.types.join(" · ")}</span>
              <h1>{c.name}</h1>
              <div className="profile-meta">
                <span>
                  <MapPin size={15} />
                  {office.city}, {countryName(office.country)}
                </span>
                <span className="sample-label">SAMPLE PROFILE</span>
              </div>
            </div>
            <CompareButton id={c.id} />
          </div>
        </div>
      </section>
      <div className="wrap profile-layout">
        <ContactPanel company={c} />
        <div className="profile-body">
          <nav className="profile-sections" aria-label="Company sections">
            <a href="#overview">Overview</a>
            <a href="#services">Services & coverage</a>
            <a href="#offices">Offices</a>
            <a href="#details">Listing details</a>
          </nav>
          <section id="overview" className="profile-section">
            <h2>About the company</h2>
            <p>{c.description}</p>
            <dl className="profile-facts"><div><dt>Registered name</dt><dd>{c.legalName}</dd></div><div><dt>Company type</dt><dd>{c.types.join(", ")}</dd></div></dl>
          </section>
          <section id="services" className="profile-section">
            <h2>Services & coverage</h2>
            <p className="muted">See where each service is available.</p>
            <div className="coverage-list">
              {c.services.map((s) => (
                <div key={s}>
                  <span className="service-icon">
                    <ServiceIcon service={s} />
                  </span>
                  <strong>{serviceName(s)}</strong>
                  <span>
                    {c.coverage
                      .find((v) => v.service === s)
                      ?.countries.map(countryName)
                      .join(" · ") || "Not provided"}
                  </span>
                </div>
              ))}
            </div>
            {c.capabilities.length > 0 && (
              <>
                <h3 className="subheading">Special capabilities</h3>
                <div className="tag-list">
                  {c.capabilities.map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
              </>
            )}
          </section>
          <section id="offices" className="profile-section">
            <h2>Offices</h2>
            {c.offices.map((o, i) => (
              <div className="office-card" key={i}>
                <span className="country-code">{o.country}</span>
                <div>
                  <h3>
                    {o.city}, {countryName(o.country)}
                  </h3>
                  <p>{o.primary ? "Primary office" : "Branch office"}</p>
                </div>
                <Link
                  className="text-link"
                  to="/locations/$country"
                  params={{
                    country: countries.find((x) => x.code === o.country)!.slug,
                  }}
                >
                  Explore market <ArrowUpRight size={16} />
                </Link>
              </div>
            ))}
          </section>
          <section id="details" className="profile-section">
            <h2>About this listing</h2>
            <p>
              This profile uses fictional information to demonstrate the
              directory. It has not been verified and does not represent a real
              business.
            </p>
            <p>
              Published company profiles will show the source and date of
              checked details. Factual checks do not guarantee service quality.
            </p>
            <Link className="text-link" to="/methodology">
              Read our approach <ArrowUpRight size={16} />
            </Link>
          </section>
        </div>
      </div>
      <section className="section soft-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <h2>Similar companies</h2>
            </div>
          </div>
          <div className="company-grid">
            {similar.map((x) => (
              <CompanyCard key={x.id} company={x} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
