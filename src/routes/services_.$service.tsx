import { pageHead } from "../domain/seo";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { services } from "../domain/company";
import { searchSloveniaCompanies } from "../data/slovenia";
export const Route = createFileRoute("/services_/$service")({
  loader: ({ params }) => {
    const service = services.find((s) => s.id === params.service);
    if (!service) throw notFound();
    return {
      service,
      result: searchSloveniaCompanies({ services: [service.id] }),
    };
  },
  head: ({ loaderData }) => loaderData ? pageHead(
    `${loaderData.service.name} Companies in Slovenia`,
    `Explore ${loaderData.service.name.toLowerCase()} providers with offices in Slovenia. Compare offices and service coverage in our directory preview.`,
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
        title={`${service.name} companies in Slovenia.`}
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
