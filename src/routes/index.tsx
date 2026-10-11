import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Home } from "../components/home";
import { homeTitle, homeDescription, pageHead } from "../domain/seo";
import { normalizeSearch } from "../domain/search";
export const Route = createFileRoute("/")({
  validateSearch: raw => normalizeSearch({ ...raw, office: "SI" }),
  head: () => pageHead(homeTitle, homeDescription, "/"),
  component: Page,
});
function Page() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return <PublicLayout><Home search={search} onChange={patch => {
    if (patch.office !== undefined && patch.office !== "SI") {
      void navigate({ to: "/companies", search: { ...search, ...patch } });
    } else {
      void navigate({ search: previous => ({ ...previous, ...patch, office: "SI" }) });
    }
  }} /></PublicLayout>;
}
