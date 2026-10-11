import { createFileRoute } from "@tanstack/react-router";
import { AdminCatalog, AdminLayout } from "../components/admin";
export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminLayout>
      <AdminCatalog />
    </AdminLayout>
  ),
});
