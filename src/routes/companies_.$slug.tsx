import { createFileRoute, notFound } from "@tanstack/react-router";
import { findCompany } from "../data/companies";
import { PublicLayout } from "../components/layout";
import { Profile } from "../components/profile";
export const Route = createFileRoute("/companies_/$slug")({
  loader: ({ params }) => {
    const c = findCompany(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.name ?? "Company"} | LogisticsWorld` }],
  }),
  component: Page,
});
function Page() {
  return (
    <PublicLayout>
      <Profile company={Route.useLoaderData()} />
    </PublicLayout>
  );
}
