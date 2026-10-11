import { pageHead } from "../domain/seo";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { services } from "../domain/company";
import { companies } from "../data/companies";
import { searchCompanies } from "../domain/search";
export const Route = createFileRoute("/services_/$service")({
  loader: ({ params }) => {
    const service = services.find((s) => s.id === params.service);
    if (!service) throw notFound();
    return {
      service,
      result: searchCompanies(companies, { services: [service.id] }),
    };
  },
  head: ({ loaderData }) => loaderData ? pageHead(
    `${loaderData.service.name} Companies — Slovenia & Region`,
    `Explore ${loaderData.service.name.toLowerCase()} providers in Slovenia and neighbouring markets. Compare offices and service coverage in our directory preview.`,
    `/services/${loaderData.service.id}`,
  ) : {},
  component: Page,
});
function Page() {
  const { service, result } = Route.useLoaderData(),
    navigate = useNavigate();
  return (
    <PublicLayout>
      <Directory
        result={result}
        title={`${service.name} companies.`}
        subtitle={service.description}
        onChange={(patch) =>
          void navigate({
            to: "/companies",
            search: { ...result.search, ...patch },
          })
        }
      />
    </PublicLayout>
  );
}
