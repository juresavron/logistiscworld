import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Search, SlidersHorizontal, Building2 } from "lucide-react";
import { countries, services } from "../domain/company";
import { normalizeSearch } from "../domain/search";
import { companies } from "../data/companies";
import { CompanyCard } from "./company-card";
import { ServiceIcon } from "./ui";
import { BuyerGuide } from "./buyer-guide";

const localCompanies = companies.filter((c) => c.offices.some((o) => o.country === "SI"));
const localSearch = normalizeSearch({ office: "SI" });

export function Home() {
  const [service, setService] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return <>
    <section className="finder-hero">
      <div className="wrap">
        <div className="edition-label"><span className="slovenia-mark" aria-hidden="true" /> SLOVENIA DIRECTORY <span className="edition-divider" /> LOCAL EXPERTISE. GLOBAL REACH.</div>
        <div className="finder-heading">
          <h1>Best logistics companies <em>in Slovenia.</em></h1>
          <p>Find a freight forwarder that fits your business.<br className="desktop-break" /> Compare services, explore local expertise, and connect directly.</p>
        </div>
        <form className="finder-search" onSubmit={(event) => {
          event.preventDefault();
          void navigate({ to: "/companies", search: normalizeSearch({ office: "SI", services: service ? [service] : [], q: query }) });
        }}>
          <label className="finder-service"><span>What do you need?</span><div><SlidersHorizontal size={19} /><select aria-label="Service" value={service} onChange={(e) => setService(e.target.value)}><option value="">All logistics services</option>{services.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></div></label>
          <label className="finder-query"><span>Company or city</span><div><Search size={20} /><input aria-label="Company or city" placeholder="Try Koper, Ljubljana, or a company" value={query} maxLength={100} onChange={(e) => setQuery(e.target.value)} /></div></label>
          <button type="submit" className="button finder-submit">Find companies <ArrowRight size={18} /></button>
        </form>
        <div className="finder-popular"><span>Popular searches</span>{["Koper", "Ljubljana", "Maribor"].map((city) => <Link key={city} to="/companies" search={normalizeSearch({ office: "SI", q: city })}>{city}<ArrowUpRight size={13} /></Link>)}<Link to="/companies" search={normalizeSearch({ office: "SI", services: ["forwarding"] })}>Freight forwarders<ArrowUpRight size={13} /></Link></div>
        <div className="finder-benefits"><span><Check size={16} /> Compare up to 3 companies</span><span><Check size={16} /> Services and coverage in one place</span><span><Check size={16} /> Direct company contact</span></div>
      </div>
    </section>

    <section className="wrap finder-services" aria-labelledby="services-heading">
      <div className="finder-section-label"><h2 id="services-heading">What are you shipping?</h2><Link to="/services">Explore services <ArrowRight size={15} /></Link></div>
      <div className="finder-service-grid">{services.map((s) => <Link key={s.id} to="/companies" search={normalizeSearch({ office: "SI", services: [s.id] })}><span className="service-square"><ServiceIcon service={s.id} size={24} /></span><span>{s.name}</span><ArrowUpRight size={15} /></Link>)}</div>
    </section>

    <section className="finder-directory">
      <div className="wrap">
        <div className="finder-section-heading"><div><span className="eyebrow">YOUR NEXT LOGISTICS PARTNER</span><h2>Local companies.<br />The right capabilities.</h2></div><Link className="button outline" to="/locations/$country" params={{ country: "slovenia" }}>View Slovenia directory <ArrowRight size={17} /></Link></div>
        <div className="finder-list-layout">
          <div>
            <div className="finder-list-caption"><span><Building2 size={16} /> {localCompanies.length} sample companies with Slovenian offices</span><span>Preview listings</span></div>
            {localCompanies.slice(0, 3).map((company) => <CompanyCard key={company.id} company={company} />)}
            <Link className="finder-all" to="/companies" search={localSearch}>Explore all Slovenian companies <ArrowRight size={17} /></Link>
          </div>
          <aside className="finder-help">
            <span className="finder-help-icon"><SlidersHorizontal size={24} /></span>
            <h3>A better shortlist<br />starts here.</h3>
            <p>Choose by what matters to your shipment.</p>
            <ol><li><span>01</span><div><strong>Start with your service</strong><p>Transport, forwarding, customs, or storage.</p></div></li><li><span>02</span><div><strong>Compare the details</strong><p>Local offices, routes, and cargo capabilities.</p></div></li><li><span>03</span><div><strong>Speak to the company</strong><p>Discuss your shipment directly with the provider.</p></div></li></ol>
            <Link to="/methodology">How we compare companies <ArrowUpRight size={16} /></Link>
            <div className="finder-preview-note">This is a design preview. Company profiles are fictional, with no live contacts or quality rankings.</div>
          </aside>
        </div>
      </div>
    </section>

    <section className="wrap finder-regions">
      <div><span className="eyebrow">BEYOND THE BORDER</span><h2>Find expertise<br />across the region.</h2><p>Explore offices in neighbouring markets for the next leg of your supply chain.</p></div>
      <div className="finder-country-grid">{countries.filter((c) => c.code !== "SI").map((country) => <Link key={country.code} to="/locations/$country" params={{ country: country.slug }}><span className="country-code">{country.code}</span><div><strong>{country.name}</strong><span>{country.city}</span></div><ArrowUpRight size={20} /></Link>)}</div>
    </section>

    <BuyerGuide />
    <section className="wrap finder-listing-cta"><div><span className="eyebrow">FOR LOGISTICS PROVIDERS</span><h2>Your next customer<br />could start here.</h2><p>Help businesses understand your services and where you operate.</p></div><Link className="button dark" to="/submit-company">List your company <ArrowRight size={18} /></Link></section>
  </>;
}
