import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AdminLayout, AdminLogin } from "../components/admin";
import { getAdminSession } from "../server/admin";
import { getSubmissionInbox, reviewSubmission } from "../server/submissions";
import { inboxQuerySchema, submissionStatuses, type SubmissionEntry } from "../domain/submissions";
import { safeContactHref } from "../domain/company";

export const Route = createFileRoute("/admin_/submissions")({
  validateSearch: input => inboxQuerySchema.parse({ status: input.status ?? "pending", page: Number(input.page) || 1 }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const session = await getAdminSession();
    return { session, inbox: session.user ? await getSubmissionInbox({ data: deps }) : null };
  },
  staleTime: 0,
  component: Page,
});
function Page() {
  const { session, inbox } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  if (!session.user || !inbox) return <AdminLogin configured={session.configured} />;
  return <AdminLayout user={session.user}>
    <div className="admin-page-heading"><div><h1>Company submissions</h1><p>Review company requests. Reviewing a request does not publish a listing.</p></div><Link className="button dark" to="/admin/companies/$id" params={{ id: "new" }}>Add company</Link></div>
    <div className="catalog-toolbar">
      <span>{inbox.total} requests</span>
      <label>Status <select value={search.status} onChange={event => navigate({ search: { status: event.target.value as typeof search.status, page: 1 } })}>
        <option value="all">All requests</option>{submissionStatuses.map(status => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
      </select></label>
    </div>
    <div className="submission-inbox">{inbox.submissions.map(entry => <SubmissionReview key={`${entry.id}:${entry.version}`} entry={entry} />)}</div>
    {inbox.total === 0 && <div className="empty-state"><h2>No requests in this view</h2><p>New company submissions will appear here for review.</p></div>}
    <div className="catalog-footer"><span>Page {inbox.page} of {inbox.pages}</span><div>
      {inbox.page > 1 && <Link className="button outline" to="/admin/submissions" search={{ ...search, page: inbox.page - 1 }}>Previous</Link>}
      {inbox.page < inbox.pages && <Link className="button outline" to="/admin/submissions" search={{ ...search, page: inbox.page + 1 }}>Next</Link>}
    </div></div>
  </AdminLayout>;
}
function SubmissionReview({ entry }: { entry: SubmissionEntry }) {
  const router = useRouter();
  const [status, setStatus] = useState(entry.status), [note, setNote] = useState(entry.note), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const website = safeContactHref("website", entry.website), email = safeContactHref("email", entry.email);
  return <article className="submission-review">
    <h2>{entry.company}</h2>
    <dl><dt>Website</dt><dd>{website ? <a href={website} target="_blank" rel="noopener noreferrer">{entry.website}</a> : entry.website}</dd>
      <dt>Private contact</dt><dd>{email ? <a href={email}>{entry.email}</a> : entry.email}</dd>
      <dt>Received</dt><dd>{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Ljubljana" }).format(new Date(entry.createdAt))}</dd>
      <dt>Reference</dt><dd>{entry.id}</dd></dl>
    <form onSubmit={async event => {
      event.preventDefault(); if (busy) return; setBusy(true); setError("");
      try { await reviewSubmission({ data: { id: entry.id, expectedVersion: entry.version, status, note } }); await router.invalidate(); }
      catch (error) { setError(error instanceof Error ? error.message : "Could not save the review."); }
      finally { setBusy(false); }
    }}>
      <label className="field"><span>Review status</span><select value={status} onChange={event => setStatus(event.target.value as typeof status)}>{submissionStatuses.map(value => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label>
      <label className="field"><span>Private review notes</span><textarea value={note} onChange={event => setNote(event.target.value)} maxLength={1000} rows={3} /></label>
      {error && <p role="alert" className="field-error">{error}</p>}
      <button className="button outline" disabled={busy}>{busy ? "Saving…" : "Save review"}</button>
    </form>
  </article>;
}
