import { pageHead } from "../domain/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { normalizeSearch } from "../domain/search";
import { getDirectory } from "../server/catalog";
export const Route = createFileRoute("/companies")({
  validateSearch: normalizeSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getDirectory({ data: deps }),
  head: () => pageHead(
    "Logistics Company Directory — Slovenia & Region",
    "Filter logistics providers by service, office country, and coverage. Compare sample companies in Slovenia, Italy, Austria, Croatia, and Hungary.",
    "/companies",
  ),
  component: Page,
});
function Page() {
  const result = Route.useLoaderData(),
    navigate = Route.useNavigate();
  return (
    <PublicLayout>
      <Directory
        result={result}
        onChange={(patch) =>
          void navigate({ search: (prev) => ({ ...prev, ...patch }) })
        }
      />
    </PublicLayout>
  );
}
