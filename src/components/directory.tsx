import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { capabilityOptions, companyTypes, countries, countryName, services, serviceName, type CountryCode, type ServiceId } from "../domain/company";
import { type DirectorySearch, type searchCompanies } from "../domain/search";
import { CompanyCard } from "./company-card";
import { EmptyState } from "./ui";

type Result = ReturnType<typeof searchCompanies>;
export function Directory({ result, onChange, title, subtitle = "Find the services you need. Contact the company directly." }: {
  result: Result;
  onChange: (patch: Partial<DirectorySearch>) => void;
  title?: ReactNode;
  subtitle?: string;
}) {
  const s = result.search;
  const [q, setQ] = useState(s.q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => setQ(s.q), [s.q]);
  const advancedCount = Number(!!s.coverage) + Number(!!s.type) + s.capabilities.length;
  const active = s.services.length + advancedCount + Number(!!s.q);
  const reset = () => onChange({ q: "", services: [], coverage: "", type: "", capabilities: [], page: 1 });
  const toggleService = (id: ServiceId) => onChange({ services: s.services.includes(id) ? s.services.filter(v => v !== id) : [...s.services, id], page: 1 });
  return <>
    <section className="directory-intro">
      <div className="wrap directory-intro-copy">
        <div className="directory-intro-text">
        <span className="eyebrow">SLOVENIA / FREIGHT & LOGISTICS</span>
        <h1>{title ?? <>Freight forwarders <span>in Slovenia.</span></>}</h1>
        <p>{subtitle}</p>
        </div>
      <form className="directory-search" role="search" onSubmit={e => { e.preventDefault(); onChange({ q, page: 1 }); }}>
        <Search size={21}/>
        <label className="sr-only" htmlFor="company-search">Company, service, or city</label>
        <input id="company-search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Company, service, or city" maxLength={100}/>
        <button className="button dark" type="submit">Search <ArrowRight size={17}/></button>
      </form>
      </div>
    </section>
    <section className="wrap directory-section" aria-label="Find logistics companies">
      <div className="directory-tools">
        <span className="filters-label">Filter by service</span>
        <div className="service-shortcuts" role="group" aria-label="Services: match any selected">
          <button aria-pressed={!s.services.length} onClick={() => onChange({services:[],page:1})}>All services</button>
          {services.map(service => <button key={service.id} aria-pressed={s.services.includes(service.id)} onClick={() => toggleService(service.id)}>{service.name}</button>)}
        </div>
        <button className={`filter-toggle ${filtersOpen ? "is-open" : ""}`} aria-expanded={filtersOpen} aria-controls="extra-filters" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={17}/>Filters{advancedCount > 0 && <span>{advancedCount}</span>}</button>
      </div>
      <div id="extra-filters" className="extra-filters" hidden={!filtersOpen}>
        <div className="extra-filter-fields">
          <label className="field"><span>Company type</span><select value={s.type} onChange={e => onChange({type:e.target.value,page:1})}><option value="">Any type</option>{companyTypes.map(t => <option key={t}>{t}</option>)}</select></label>
          <label className="field"><span>Serves country</span><select value={s.coverage} onChange={e => onChange({coverage:e.target.value as CountryCode | "",page:1})}><option value="">Any destination</option>{countries.map(c => <option value={c.code} key={c.code}>{c.name}</option>)}</select><small>Where the Slovenian provider offers services.</small></label>
        </div>
        <fieldset><legend>Special capabilities <span>Must include all selected</span></legend><div className="capability-options">{capabilityOptions.map(v => <label className="check-label" key={v}><input type="checkbox" checked={s.capabilities.includes(v)} onChange={() => onChange({capabilities:s.capabilities.includes(v) ? s.capabilities.filter(c => c !== v) : [...s.capabilities,v],page:1})}/><span>{v}</span></label>)}</div></fieldset>
        <button className="filter-done" onClick={() => setFiltersOpen(false)}>Done <ArrowRight size={16}/></button>
      </div>
      <div className="results">
        <div className="results-heading">
          <div role="status"><strong>{result.total}</strong> {result.total === 1 ? "company" : "companies"}<span>Sample listings · No quality ranking</span></div>
          {s.q ? <label className="sort-control"><span>Sort</span><select value={s.sort} onChange={e => onChange({sort:e.target.value as DirectorySearch["sort"],page:1})}><option value="relevance">Relevance</option><option value="name">Name A–Z</option></select></label> : <span className="sort-note">Name A–Z</span>}
        </div>
        {active > 0 && <div className="active-filters">
          {s.q && <button onClick={() => onChange({q:"",page:1})} aria-label={`Remove search ${s.q}`}>“{s.q}”<X size={13}/></button>}
          {s.services.map(v => <button key={v} onClick={() => toggleService(v)} aria-label={`Remove ${serviceName(v)} filter`}>{serviceName(v)}<X size={13}/></button>)}
          {s.coverage && <button onClick={() => onChange({coverage:"",page:1})}>Serves: {countryName(s.coverage)}<X size={13}/></button>}
          {s.type && <button onClick={() => onChange({type:"",page:1})}>{s.type}<X size={13}/></button>}
          {s.capabilities.map(v => <button key={v} onClick={() => onChange({capabilities:s.capabilities.filter(c => c !== v),page:1})}>{v}<X size={13}/></button>)}
          <button className="clear-all" onClick={reset}>Clear filters</button>
        </div>}
        {result.companies.length ? <div className="directory-results">{result.companies.map(c => <CompanyCard company={c} key={c.id} officeCountry={s.office || undefined}/>)}</div> : <EmptyState title="No companies match this search."><p>Try another service or city, or clear your filters.</p><button className="button dark" onClick={reset}>Clear filters</button></EmptyState>}
        {result.pages > 1 && <nav className="pagination" aria-label="Results pages"><button className="button outline small" disabled={result.page === 1} onClick={() => onChange({page:result.page-1})}><ArrowLeft size={15}/>Previous</button><span>Page {result.page} of {result.pages}</span><button className="button outline small" disabled={result.page === result.pages} onClick={() => onChange({page:result.page+1})}>Next<ArrowRight size={15}/></button></nav>}
      </div>
    </section>
  </>;
}
