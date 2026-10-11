import { pageHead } from "../domain/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { normalizeSloveniaSearch } from "../data/slovenia";
import { getDirectory } from "../server/catalog";
export const Route = createFileRoute("/companies")({
  validateSearch: normalizeSloveniaSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getDirectory({ data: deps }),
  head: () => pageHead(
    "Freight Forwarders & Logistics Companies in Slovenia",
    "Find Slovenian freight forwarders and logistics providers. Compare services, local offices, and international coverage in our directory preview.",
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
