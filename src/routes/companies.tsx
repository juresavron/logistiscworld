import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { normalizeSearch } from "../domain/search";
import { getDirectory } from "../server/catalog";
export const Route = createFileRoute("/companies")({
  validateSearch: normalizeSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getDirectory({ data: deps }),
  head: () => ({
    meta: [{ title: "Find logistics companies | LogisticsWorld" }],
  }),
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
