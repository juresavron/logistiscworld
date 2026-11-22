import { createFileRoute, notFound } from "@tanstack/react-router";
import { AdminLayout, AdminLogin } from "../components/admin";
import { CompanyEditor } from "../components/company-editor";
import { getAdminCatalog, getAdminSession } from "../server/admin";
export const Route = createFileRoute("/admin_/companies/$id")({
  loader: async ({ params }) => {
    const session = await getAdminSession();
    const entry = session.user && params.id !== "new" ? (await getAdminCatalog()).find(entry => entry.draft.id === params.id) ?? null : null;
    if (session.user && params.id !== "new" && !entry) throw notFound();
    return { session, entry };
  },
  staleTime: 0,
  component: Page,
});
function Page() {
  const { id } = Route.useParams();
  const { session, entry } = Route.useLoaderData();
  if (!session.user) return <AdminLogin configured={session.configured}/>;
  return (
    <AdminLayout user={session.user}>
      <CompanyEditor key={`${id}:${entry?.version ?? 0}`} id={id} entry={entry} canPublish={session.user.role === "administrator"}/>
    </AdminLayout>
  );
}
