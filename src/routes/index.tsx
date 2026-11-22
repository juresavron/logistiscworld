import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Home } from "../components/home";
import { homeTitle, homeDescription, pageHead } from "../domain/seo";
import { normalizeSloveniaSearch } from "../domain/search";
import { getDirectory } from "../server/catalog";
export const Route = createFileRoute("/")({
  validateSearch: normalizeSloveniaSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getDirectory({ data: deps }),
  head: () => pageHead(homeTitle, homeDescription, "/"),
  component: Page,
});
function Page() {
  const result = Route.useLoaderData();
  const navigate = Route.useNavigate();
  return <PublicLayout><Home result={result} onChange={patch => void navigate({ search: previous => ({ ...previous, ...patch, office: "SI" }) })}/></PublicLayout>;
}
