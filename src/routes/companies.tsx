import { pageHead } from "../domain/seo";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { normalizeSloveniaSearch } from "../domain/search";
import { getDirectory } from "../server/catalog";
export const Route = createFileRoute("/companies")({
  validateSearch: normalizeSloveniaSearch,
  search: { middlewares: [stripSearchParams(normalizeSloveniaSearch({}))] },
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getDirectory({ data: deps }),
  head: () => pageHead(
    "Slovenia Logistics Company Directory",
    "Search Slovenian logistics companies by service, office city and international coverage. View published company profiles and contact providers directly.",
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
