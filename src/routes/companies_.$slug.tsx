import { pageHead } from "../domain/seo";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCompany, getDirectory } from "../server/catalog";
import { PublicLayout } from "../components/layout";
import { Profile } from "../components/profile";
export const Route = createFileRoute("/companies_/$slug")({
  loader: async ({ params }) => {
    const c = await getCompany({ data: params.slug });
    if (!c) throw notFound();
    const related = await getDirectory({ data: { services: c.services } });
    return { company: c, similar: related.companies.filter(company => company.id !== c.id).slice(0, 3) };
  },
  head: ({ loaderData }) => loaderData ? pageHead(
    `${loaderData.company.name} | Logistics in Slovenia`,
    loaderData.company.summary,
    `/companies/${loaderData.company.slug}`,
  ) : {},
  component: Page,
});
function Page() {
  return (
    <PublicLayout>
      <Profile {...Route.useLoaderData()} />
    </PublicLayout>
  );
}
