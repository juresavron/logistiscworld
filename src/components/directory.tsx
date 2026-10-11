import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  capabilityOptions,
  companyTypes,
  countries,
  countryName,
  services,
  serviceName,
  type CountryCode,
  type ServiceId,
} from "../domain/company";
import { type DirectorySearch, type searchCompanies } from "../domain/search";
import { CompanyCard } from "./company-card";
import { EmptyState } from "./ui";

type Result = ReturnType<typeof searchCompanies>;
export function Directory({
  result,
  onChange,
  title = "Find your next logistics partner.",
  subtitle = "Local knowledge. The right capabilities. A direct connection.",
}: {
  result: Result;
  onChange: (patch: Partial<DirectorySearch>) => void;
  title?: string;
  subtitle?: string;
}) {
  const s = result.search;
  const [q, setQ] = useState(s.q);
  useEffect(() => setQ(s.q), [s.q]);
  const active =
    s.services.length +
    Number(!!s.office) +
    Number(!!s.coverage) +
    Number(!!s.type) +
    s.capabilities.length +
    Number(!!s.q);
  const reset = () =>
    onChange({
      q: "",
      services: [],
      office: "",
      coverage: "",
      type: "",
      capabilities: [],
      page: 1,
    });
  const toggleService = (id: ServiceId) =>
    onChange({
      services: s.services.includes(id)
        ? s.services.filter((v) => v !== id)
        : [...s.services, id],
      page: 1,
    });
  return (
    <>
      <section className="page-intro wrap">
        <span className="eyebrow">THE COMPANY DIRECTORY</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </section>
      <section className="wrap directory-section">
        <form
          className="directory-search"
          onSubmit={(e) => {
            e.preventDefault();
            onChange({ q, page: 1 });
          }}
        >
          <Search size={21} />
          <label className="sr-only" htmlFor="company-search">
            Search companies, services, or cities
          </label>
          <input
            id="company-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search companies, services, or cities…"
            maxLength={100}
          />
          <button className="button dark" type="submit">
            Search <ArrowRight size={16} />
          </button>
        </form>
        <div className="directory-layout">
          <aside>
            <details className="filters">
              <summary>
                <SlidersHorizontal size={17} />
                Filters {active > 0 && <span>{active}</span>}
              </summary>
              <div className="filter-content">
                <div className="filter-heading">
                  <h2>Refine results</h2>
                  {active > 0 && (
                    <button className="text-button" onClick={reset}>
                      Reset
                    </button>
                  )}
                </div>
                <fieldset>
                  <legend>
                    Services <span>match any selected</span>
                  </legend>
                  {services.map((v) => (
                    <label className="check-label" key={v.id}>
                      <input
                        type="checkbox"
                        checked={s.services.includes(v.id)}
                        onChange={() => toggleService(v.id)}
                      />
                      <span>{v.name}</span>
                    </label>
                  ))}
                </fieldset>
                <label className="field">
                  <span>Office location</span>
                  <select
                    value={s.office}
                    onChange={(e) =>
                      onChange({
                        office: e.target.value as CountryCode | "",
                        page: 1,
                      })
                    }
                  >
                    <option value="">All countries</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Serves country</span>
                  <select
                    value={s.coverage}
                    onChange={(e) =>
                      onChange({
                        coverage: e.target.value as CountryCode | "",
                        page: 1,
                      })
                    }
                  >
                    <option value="">Any country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <small>
                    Where services are available, regardless of office location.
                  </small>
                </label>
                <label className="field">
                  <span>Company type</span>
                  <select
                    value={s.type}
                    onChange={(e) =>
                      onChange({ type: e.target.value, page: 1 })
                    }
                  >
                    <option value="">All company types</option>
                    {companyTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <fieldset>
                  <legend>
                    Special capabilities <span>match all selected</span>
                  </legend>
                  {capabilityOptions.map((v) => (
                    <label className="check-label" key={v}>
                      <input
                        type="checkbox"
                        checked={s.capabilities.includes(v)}
                        onChange={() =>
                          onChange({
                            capabilities: s.capabilities.includes(v)
                              ? s.capabilities.filter((c) => c !== v)
                              : [...s.capabilities, v],
                            page: 1,
                          })
                        }
                      />
                      <span>{v}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
            </details>
            <div className="sidebar-note">
              <strong>Know what you’re comparing.</strong>
              <p>
                Office location and service coverage are different. Our profiles
                show both.
              </p>
              <Link to="/methodology">
                Our approach <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
          <div className="results">
            <div className="results-heading">
              <div role="status">
                <strong>{result.total}</strong> sample{" "}
                {result.total === 1 ? "company" : "companies"}
                <span>Fictional data for this preview</span>
              </div>
              <label className="sort-control">
                <span>Sort by</span>
                <select
                  value={s.sort}
                  onChange={(e) =>
                    onChange({
                      sort: e.target.value as DirectorySearch["sort"],
                      page: 1,
                    })
                  }
                >
                  <option value="relevance">Relevant first</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>
            {active > 0 && (
              <div className="active-filters">
                {s.q && (
                  <button onClick={() => onChange({ q: "", page: 1 })}>
                    “{s.q}”<X size={12} />
                  </button>
                )}
                {s.services.map((v) => (
                  <button key={v} onClick={() => toggleService(v)}>
                    {serviceName(v)}
                    <X size={12} />
                  </button>
                ))}
                {s.office && (
                  <button onClick={() => onChange({ office: "", page: 1 })}>
                    Office: {countryName(s.office)}
                    <X size={12} />
                  </button>
                )}
                {s.coverage && (
                  <button onClick={() => onChange({ coverage: "", page: 1 })}>
                    Serves: {countryName(s.coverage)}
                    <X size={12} />
                  </button>
                )}
                {s.type && (
                  <button onClick={() => onChange({ type: "", page: 1 })}>
                    {s.type}
                    <X size={12} />
                  </button>
                )}
                {s.capabilities.map((v) => (
                  <button
                    key={v}
                    onClick={() =>
                      onChange({
                        capabilities: s.capabilities.filter((c) => c !== v),
                        page: 1,
                      })
                    }
                  >
                    {v}
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}
            {result.companies.length ? (
              result.companies.map((c) => (
                <CompanyCard company={c} key={c.id} />
              ))
            ) : (
              <EmptyState title="No companies match this search.">
                <p>
                  Try a broader service or location. Your filters are shown
                  above.
                </p>
                <button className="button dark" onClick={reset}>
                  Clear filters
                </button>
              </EmptyState>
            )}
            {result.pages > 1 && (
              <nav className="pagination" aria-label="Results pages">
                <button
                  className="button outline small"
                  disabled={result.page === 1}
                  onClick={() => onChange({ page: result.page - 1 })}
                >
                  <ArrowLeft size={15} />
                  Previous
                </button>
                <span>
                  Page {result.page} of {result.pages}
                </span>
                <button
                  className="button outline small"
                  disabled={result.page === result.pages}
                  onClick={() => onChange({ page: result.page + 1 })}
                >
                  Next
                  <ArrowRight size={15} />
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
