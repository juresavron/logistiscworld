import { pageHead } from "../domain/seo";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { countries } from "../domain/company";
import { companies } from "../data/companies";
import { searchCompanies } from "../domain/search";
import { Directory } from "../components/directory";
import { PublicLayout } from "../components/layout";
export const Route = createFileRoute("/locations_/$country")({
  loader: ({ params }) => {
    const country = countries.find((c) => c.slug === params.country);
    if (!country) throw notFound();
    return {
      country,
      result: searchCompanies(companies, { office: country.code }),
    };
  },
  head: ({ loaderData }) => loaderData ? pageHead(
    `Logistics Companies in ${loaderData.country.name}`,
    `Explore logistics companies with offices in ${loaderData.country.name}. Compare services and coverage in our sample directory before contacting a provider.`,
    `/locations/${loaderData.country.slug}`,
  ) : {},
  component: Page,
});
function Page() {
  const { country, result } = Route.useLoaderData(),
    navigate = useNavigate();
  return (
    <PublicLayout>
      <Directory
        result={result}
        title={`Logistics companies in ${country.name}.`}
        subtitle="Find providers with a local office, then explore their services and regional coverage."
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
