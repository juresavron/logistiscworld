import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin";
import { CompanyEditor } from "../components/company-editor";
export const Route = createFileRoute("/admin_/companies/$id")({
  component: Page,
});
function Page() {
  const { id } = Route.useParams();
  return (
    <AdminLayout>
      <CompanyEditor key={id} id={id} />
    </AdminLayout>
  );
}
