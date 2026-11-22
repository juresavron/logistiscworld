import { createFileRoute } from "@tanstack/react-router";
import { AdminCatalog, AdminLayout, AdminLogin } from "../components/admin";
import { getAdminCatalog, getAdminSession } from "../server/admin";
export const Route = createFileRoute("/admin")({
  loader: async () => {
    const session = await getAdminSession();
    return { session, entries: session.user ? await getAdminCatalog() : [] };
  },
  staleTime: 0,
  component: Page,
});
function Page() {
  const { session, entries } = Route.useLoaderData();
  if (!session.user) return <AdminLogin configured={session.configured}/>;
  return <AdminLayout user={session.user}><AdminCatalog entries={entries}/></AdminLayout>;
}
