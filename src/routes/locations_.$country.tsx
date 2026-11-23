import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { normalizeSloveniaSearch } from "../domain/search";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { DiscoveryLinks, BreadcrumbTrail, LocalGuide } from "../components/discovery";
import { locationBySlug } from "../data/locations";
import { getDirectory } from "../server/catalog";
import { pageHead } from "../domain/seo";
import { FeaturedPartner } from "../components/featured-partner";
import { ShipmentGuide, ShipmentGuideNavigation } from "../components/shipment-guide";
import { koperShipmentGuide } from "../data/local-guides";

export const Route = createFileRoute("/locations_/$country")({
  beforeLoad: ({ params }) => {
    if (params.country === "slovenia") throw redirect({ to: "/companies", search: normalizeSloveniaSearch({}), statusCode: 301 });
  },
  loader: async ({ params }) => {
    const location = locationBySlug(params.country);
    if (!location) throw notFound();
    const result = await getDirectory({ data: { city: location.name } });
    if (!result.total) throw notFound();
    return { location, result };
  },
  head: ({ loaderData }) => loaderData ? pageHead(loaderData.location.title, loaderData.location.description, `/locations/${loaderData.location.slug}`) : {},
  component: Page,
});
function Page() {
  const { location, result } = Route.useLoaderData(), navigate = Route.useNavigate();
  return <PublicLayout><BreadcrumbTrail items={[{ name: "Cities", path: "/locations" }, { name: location.name, path: `/locations/${location.slug}` }]}/>
    <Directory result={result} title={`Freight forwarders in ${location.name}, Slovenia.`} subtitle={location.description} referralSource={{ placement: "location", content: location.slug }} introContent={location.slug === "koper" ? <ShipmentGuideNavigation/> : undefined} onChange={patch => void navigate({ to: "/companies", search: { ...result.search, ...patch } })}/>
    {location.slug === "koper" ? <ShipmentGuide guide={koperShipmentGuide} source={{ placement: "location", content: "koper" }}/> : <LocalGuide title={location.heading} paragraphs={location.paragraphs} checklist={location.checklist} source={location.source}/>}
    <div className="wrap featured-partner-wrap"><FeaturedPartner source={{ placement: "location", content: location.slug }}/></div><DiscoveryLinks/>
  </PublicLayout>;
}
