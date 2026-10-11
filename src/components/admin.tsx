import { emptySearch } from "../domain/search";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  CircleHelp,
  LayoutGrid,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DirectoryBrand } from "./layout";
import { companies } from "../data/slovenia";
import { countryName } from "../domain/company";
import { decodeDrafts, DRAFT_KEY, type DraftRecord } from "../domain/drafts";
import { Monogram } from "./ui";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <DirectoryBrand />
        <span className="workspace-label">Slovenia workspace</span>
        <nav aria-label="Admin navigation">
          <Link to="/admin" activeOptions={{ exact: true }}>
            <LayoutGrid size={18} />
            Company catalog
          </Link>
          <Link to="/admin/companies/$id" params={{ id: "new" }}>
            <Plus size={18} />
            Add company
          </Link>
          <Link to="/methodology">
            <CircleHelp size={18} />
            Publishing approach
          </Link>
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="sample-label">DEMO WORKSPACE</span>
          <p>
            Browser-only drafts.
            <br />
            No production database.
          </p>
          <Link to="/" search={emptySearch}>
            View directory <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <span>
            <Building2 size={16} />
            Company management
          </span>
          <Link to="/" search={emptySearch}>
            Open directory <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="admin-demo-note">
          Demo workspace — drafts stay in this browser. Saving does not update the public website.
        </div>
        <main id="main-content" className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
export function AdminCatalog() {
  const [drafts, setDrafts] = useState<Record<string, DraftRecord>>({}),
    [q, setQ] = useState(""),
    [filter, setFilter] = useState("all");
  useEffect(() => {
    const load = () => {
      try {
        setDrafts(Object.fromEntries(Object.entries(decodeDrafts(localStorage.getItem(DRAFT_KEY))).filter(([, record]) => record.draft.offices.some(office => office.country === "SI"))));
      } catch {}
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);
  const all = [
    ...companies.map((c) => ({
      company: drafts[c.id]?.draft ?? c,
      record: drafts[c.id],
    })),
    ...Object.values(drafts)
      .filter((r) => !companies.some((c) => c.id === r.draft.id))
      .map((r) => ({ company: r.draft, record: r })),
  ];
  const rows = all.filter(
    ({ company, record }) =>
      company.name.toLowerCase().includes(q.toLowerCase()) &&
      (filter === "all" ||
        (filter === "drafts" && record) ||
        (filter === "ready" && record?.published)),
  );
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Company catalog</h1>
          <p>Manage Slovenian company profiles, services and contact details.</p>
        </div>
        <Link
          className="button dark"
          to="/admin/companies/$id"
          params={{ id: "new" }}
        >
          <Plus size={17} />
          Add company
        </Link>
      </div>
      <div className="admin-stats">
        <div>
          <span>Sample catalog</span>
          <strong>{companies.length}</strong>
          <small>Slovenian sample profiles</small>
        </div>
        <div>
          <span>Saved drafts</span>
          <strong>{Object.keys(drafts).length}</strong>
          <small>Stored in this browser</small>
        </div>
        <div>
          <span>Approved snapshots</span>
          <strong>
            {Object.values(drafts).filter((d) => d.published).length}
          </strong>
          <small>Demo publishing flow</small>
        </div>
      </div>
      <div className="catalog-panel">
        <div className="catalog-toolbar">
          <label className="inline-search">
            <Search size={17} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search company catalog"
              placeholder="Find a company…"
            />
          </label>
          <select
            aria-label="Filter company status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All companies</option>
            <option value="drafts">Saved drafts</option>
            <option value="ready">Approved snapshots</option>
          </select>
        </div>
        <div className="table-scroll">
          <table className="catalog-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Office</th>
                <th>Services</th>
                <th>Workspace status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ company: c, record }) => (
                <tr key={c.id}>
                  <td>
                    <div className="table-company">
                      <Monogram company={c} />
                      <div>
                        <strong>{c.name || "Untitled company"}</strong>
                        <span>{c.types[0] ?? "Company type not set"}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Office">
                    {c.offices[0]?.city || "Not set"}
                    <small>{countryName(c.offices[0]?.country ?? "")}</small>
                  </td>
                  <td data-label="Services">{c.services.length} services</td>
                  <td data-label="Status">
                    <span
                      className={`status-pill ${record?.published ? "approved" : ""}`}
                    >
                      {record?.published
                        ? "Approved snapshot"
                        : record
                          ? "Draft saved"
                          : "Sample profile"}
                    </span>
                  </td>
                  <td>
                    <Link
                      className="text-link"
                      to="/admin/companies/$id"
                      params={{ id: c.id }}
                    >
                      Edit <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="empty-state">
            <h2>No matching companies</h2>
            <button
              className="button outline"
              onClick={() => {
                setQ("");
                setFilter("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        <div className="catalog-footer">
          <span>{rows.length} companies · Sample data only</span><span>Visitor analytics not connected</span>
        </div>
      </div>
    </>
  );
}
