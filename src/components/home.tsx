import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { countries, services, type ServiceId } from "../domain/company";
import { type DirectorySearch, searchCompanies } from "../domain/search";
import { companies } from "../data/companies";
import { CompanyCard } from "./company-card";
import { BuyerGuide } from "./buyer-guide";
import harbourImage from "../assets/koper-harbour.jpg";

const localCompanies = companies.filter(c => c.offices.some(o => o.country === "SI"));
const photoSource = "https://commons.wikimedia.org/wiki/File:MSC_HARMONY_III_(container_ship,_2006)_in_Port_Koper_(SIKOP,_2024).jpg";

export function Home({ search, onChange }: {
  search: DirectorySearch;
  onChange: (patch: Partial<DirectorySearch>) => void;
}) {
  const [query, setQuery] = useState(search.q);
  useEffect(() => setQuery(search.q), [search.q]);
  const result = searchCompanies(companies, { ...search, office: "SI" });
  const selectedService = search.services[0] ?? "";
  const setService = (service: ServiceId | "") => onChange({ services: service ? [service] : [], page: 1 });
  return <>
    <section className="freight-intro wrap">
      <div className="freight-kicker"><span>THE SLOVENIA EDITION</span><span>FOR SHIPPERS & FORWARDERS</span></div>
      <div className="freight-cover">
        <div className="freight-cover-copy">
          <h1>Best logistics companies <em>in Slovenia.</em></h1>
          <p>From a container in Koper to a delivery across Europe. Find the people who can handle your shipment.</p>
          <a className="cover-jump" href="#company-index">Explore the directory <ArrowDown size={16} /></a>
        </div>
        <figure className="freight-cover-photo">
          <img src={harbourImage} alt="Container ship MSC Harmony III alongside the cranes at the Port of Koper" width="1280" height="841" fetchPriority="high" />
          <figcaption><span><b>01 / KOPER</b> Slovenia’s maritime gateway</span><a href={photoSource} target="_blank" rel="noreferrer">Photograph: Petar Milošević ↗</a></figcaption>
        </figure>
      </div>
    </section>

    <section id="company-index" className="freight-index wrap" aria-labelledby="index-title">
      <div className="index-heading"><h2 id="index-title">The company index<span> / SI</span></h2><p>Compare capabilities. Contact companies directly.</p></div>
      <form className="index-search" onSubmit={event => { event.preventDefault(); onChange({ q: query, page: 1 }); }}>
        <Search size={20} strokeWidth={1.5} />
        <label className="sr-only" htmlFor="index-query">Company, service, or city in Slovenia</label>
        <input id="index-query" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by company, service, or city" maxLength={100} />
        <span className="index-country">Slovenia <span>SI</span></span>
        <button type="submit">Search directory <ArrowRight size={18} /></button>
      </form>
      <div className="index-tabs" role="group" aria-label="Filter by logistics service">
        <button aria-pressed={!selectedService} onClick={() => setService("")}>All companies <sup>{localCompanies.length.toString().padStart(2, "0")}</sup></button>
        {services.map(service => <button key={service.id} aria-pressed={selectedService === service.id} onClick={() => setService(service.id)}>{service.name}<sup>{localCompanies.filter(c => c.services.includes(service.id)).length.toString().padStart(2, "0")}</sup></button>)}
      </div>
      <div className="index-body">
        <aside className="index-sidebar">
          <div className="index-sidebar-label">NARROW YOUR SEARCH</div>
          <label>Office city<select aria-label="Filter office city" value={["Koper","Ljubljana","Maribor"].includes(search.q) ? search.q : ""} onChange={e => onChange({q:e.target.value,page:1})}><option value="">All cities</option><option>Koper</option><option>Ljubljana</option><option>Maribor</option></select></label>
          <label>Company type<select value={search.type} onChange={e => onChange({type:e.target.value,page:1})}><option value="">All company types</option><option>Freight forwarder</option><option>Carrier</option><option>Customs broker</option><option>Warehouse operator</option></select></label>
          <div className="index-sidebar-note"><span className="index-note-rule" /><h3>Who’s the best fit?</h3><p>Start with your route and cargo. A local office doesn’t always mean a company serves your destination.</p><Link to="/methodology">How to compare <ArrowUpRight size={14} /></Link></div>
          <p className="index-disclosure">Preview edition.<br />All listings are fictional examples. No rankings or live contacts.</p>
        </aside>
        <div className="index-results">
          <div className="index-results-toolbar"><span role="status"><b>{result.total}</b> sample {result.total === 1 ? "company" : "companies"}</span><label>Order by <select aria-label="Sort company index" value={search.sort} onChange={e => onChange({sort:e.target.value as DirectorySearch["sort"],page:1})}><option value="relevance">Relevance</option><option value="name">Name A–Z</option></select></label></div>
          {(search.q || selectedService || search.type) && <div className="index-active"><span>{[search.q, services.find(s => s.id === selectedService)?.name, search.type].filter(Boolean).join(" / ")}</span><button onClick={() => onChange({q:"",services:[],type:"",page:1})}>Clear filters <X size={13} /></button></div>}
          {result.companies.map(c => <CompanyCard key={c.id} company={c} />)}
          {!result.total && <div className="index-empty"><h3>No companies match this search.</h3><p>Try another city or service.</p><button className="button outline" onClick={() => onChange({q:"",services:[],type:"",page:1})}>Clear filters</button></div>}
          {result.pages > 1 && <div className="index-pagination"><button disabled={result.page === 1} onClick={() => onChange({page:result.page - 1})}>Previous</button><span>{result.page} / {result.pages}</span><button disabled={result.page === result.pages} onClick={() => onChange({page:result.page + 1})}>Next <ArrowRight size={14} /></button></div>}
          <div className="index-endnote"><span>Office locations and service coverage shown separately.</span><Link to="/companies" search={search}>Open full directory <ArrowUpRight size={14} /></Link></div>
        </div>
      </div>
    </section>

    <BuyerGuide />
    <section className="freight-markets wrap"><div><span className="index-sidebar-label">NEIGHBOURING MARKETS</span><h2>Across the border.</h2></div><div>{countries.filter(c=>c.code!=="SI").map(c=><Link key={c.code} to="/locations/$country" params={{country:c.slug}}><span>{c.code}</span>{c.name}<ArrowUpRight size={20}/></Link>)}</div></section>
    <div className="freight-colophon wrap"><p>Port of Koper photograph, January 2024. <a href={photoSource}>Petar Milošević</a> / <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>. Display cropped to fit.</p><span>LOGISTICSWORLD / SLOVENIA</span></div>
  </>;
}
