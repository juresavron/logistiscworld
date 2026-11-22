import { emptySearch } from "../domain/search";
import { Link, useRouter } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  CircleHelp,
  LayoutGrid,
  Plus,
  Search,
  Inbox,
} from "lucide-react";
import { useState } from "react";
import { DirectoryBrand } from "./layout";
import { signIn, signOut } from "../server/admin";
import type { AdminSession, CatalogEntry } from "../domain/catalog";
import { countryName } from "../domain/company";

import { Monogram } from "./ui";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  return <main className="admin-signin" id="main-content">
    <DirectoryBrand />
    <h1>Company management</h1>
    {configured ? <form onSubmit={async event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      setBusy(true); setError("");
      try { await signIn({ data: { email: String(form.get("email")), password: String(form.get("password")) } }); await router.invalidate(); }
      catch (error) { setError(error instanceof Error ? error.message : "Sign-in failed. Please retry."); }
      finally { setBusy(false); }
    }}>
      <p>Sign in with your authorized editor account.</p>
      <label className="field"><span>Email</span><input name="email" type="email" autoComplete="username" required maxLength={254}/></label>
      <label className="field"><span>Password</span><input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>
      {error && <p role="alert">{error}</p>}
      <button className="button dark" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form> : <p>Company management is awaiting database setup. Existing company listings remain available in the directory.</p>}
    <Link to="/" search={emptySearch}>Return to the directory</Link>
  </main>;
}
export function AdminLayout({ children, user }: { children: React.ReactNode; user: NonNullable<AdminSession["user"]> }) {
  const router = useRouter();
  const [error, setError] = useState("");
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
          <Link to="/admin/submissions" search={{ status: "pending", page: 1 }}><Inbox size={18} />Company submissions</Link>
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
          <span className="sample-label">EDITOR WORKSPACE</span>
          <p>
            Drafts are shared with your editing team.
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
          <button className="text-link" onClick={async () => { try { await signOut(); await router.invalidate(); } catch { setError("Could not sign out. Please retry."); } }}>Sign out</button>
        </div>
        <div className="admin-demo-note">
          {user.email} · {user.role === "administrator" ? "Administrator" : "Editor"}. Draft changes become public only after publication. {error && <span role="alert">{error}</span>}
        </div>
        <main id="main-content" className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
export function AdminCatalog({ entries }: { entries: CatalogEntry[] }) {
  const [q, setQ] = useState(""), [filter, setFilter] = useState("all");
  const rows = entries.filter(record => record.draft.name.toLowerCase().includes(q.toLowerCase()) &&
    (filter === "all" || (filter === "drafts" && !record.archived && (!record.published || JSON.stringify(record.draft) !== JSON.stringify(record.published))) ||
    (filter === "ready" && record.published && !record.archived) || (filter === "archived" && record.archived)))
    .map(record => ({ company: record.draft, record }));
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
          <span>Company catalog</span>
          <strong>{entries.length}</strong>
          <small>Listed Slovenian companies</small>
        </div>
        <div>
          <span>Saved drafts</span>
          <strong>{entries.filter(entry => !entry.archived && (!entry.published || JSON.stringify(entry.draft) !== JSON.stringify(entry.published))).length}</strong>
          <small>Awaiting publication</small>
        </div>
        <div>
          <span>Published listings</span>
          <strong>
            {entries.filter(entry => entry.published && !entry.archived).length}
          </strong>
          <small>Visible in the public directory</small>
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
            <option value="ready">Published listings</option><option value="archived">Archived</option>
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
                      {record.archived ? "Archived" : record.published ? "Published listing" : "Draft saved"}
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
          <span>{rows.length} companies · Shared catalog</span><span></span>
        </div>
      </div>
    </>
  );
}
