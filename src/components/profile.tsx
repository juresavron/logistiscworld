import { emptySearch } from "../domain/search";
import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
  X,
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
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <aside className="contact-panel">
        <span className="eyebrow">MAKE THE CONNECTION</span>
        <h2>Let’s talk logistics.</h2>
        <p>
          Reach the company directly.
          <br />
          No middleman, no extra steps.
        </p>
        <button
          className="button orange"
          onClick={() => dialog.current?.showModal()}
        >
          Contact options <ArrowUpRight size={18} />
        </button>
        <div className="contact-options">
          <span>
            <Globe2 size={16} />
            Website
          </span>
          <span>
            <Phone size={16} />
            Phone
          </span>
          <span>
            <Mail size={16} />
            Email
          </span>
        </div>
        <div className="contact-footnote">
          <strong>Sample profile</strong>
          <p>This fictional company has no live contact details.</p>
        </div>
      </aside>
      <dialog
        aria-labelledby="contact-dialog-title"
        ref={dialog}
        className="contact-dialog"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-top">
          <span className="eyebrow">SAMPLE COMPANY</span>
          <button
            className="icon-button"
            aria-label="Close contact options"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="contact-dialog-title">{company.name}</h2>
        <p>
          This is a fictional listing. Live profiles will offer the company’s
          published website, phone, email, and WhatsApp where provided.
        </p>
        <p className="muted">No message or inquiry has been sent.</p>
        <button className="button dark" onClick={() => dialog.current?.close()}>
          Back to profile
        </button>
      </dialog>
    </>
  );
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
        <div className="profile-body">
          <nav className="profile-sections" aria-label="Company sections">
            <a href="#overview">Overview</a>
            <a href="#services">Services & coverage</a>
            <a href="#offices">Offices</a>
            <a href="#details">Listing details</a>
          </nav>
          <section id="overview" className="profile-section">
            <span className="eyebrow">IN THEIR CORNER OF LOGISTICS</span>
            <h2>{c.summary}</h2>
            <p>{c.description}</p>
            <dl className="facts-grid">
              <div>
                <dt>Company type</dt>
                <dd>{c.types.join(", ")}</dd>
              </div>
              <div>
                <dt>Primary office</dt>
                <dd>
                  {office.city}, {countryName(office.country)}
                </dd>
              </div>
              <div>
                <dt>Services</dt>
                <dd>{c.services.length} areas of expertise</dd>
              </div>
              <div>
                <dt>Service coverage</dt>
                <dd>
                  {new Set(c.coverage.flatMap((v) => v.countries)).size}{" "}
                  regional markets
                </dd>
              </div>
            </dl>
          </section>
          <section id="services" className="profile-section">
            <span className="eyebrow">WHAT THEY DO</span>
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
            <span className="eyebrow">LOCAL PRESENCE</span>
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
            <span className="eyebrow">CLEAR INFORMATION</span>
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
        <ContactPanel company={c} />
      </div>
      <section className="section soft-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">KEEP EXPLORING</span>
              <h2>More companies. More possibilities.</h2>
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
