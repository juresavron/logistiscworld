import { createFileRoute, notFound } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { BreadcrumbTrail, DiscoveryLinks } from "../components/discovery";
import { ShipmentGuide, ShipmentGuideNavigation } from "../components/shipment-guide";
import { koperCustomsGuide } from "../data/local-guides";
import { FeaturedPartner } from "../components/featured-partner";
import { getDirectory } from "../server/catalog";
import { pageHead } from "../domain/seo";
export const Route = createFileRoute("/services_/customs/koper")({
  loader: async () => { const result = await getDirectory({ data: { city: "Koper", services: ["customs"] } }); if (!result.total) throw notFound(); return result; },
  head: () => pageHead("Customs Clearance in Koper, Slovenia", "Find customs clearance services in Koper. Compare local providers, prepare your shipment documents and contact a company about import, export or transit.", "/services/customs/koper"),
  component: Page,
});
function Page() {
  const result = Route.useLoaderData(), navigate = Route.useNavigate();
  return <PublicLayout><BreadcrumbTrail items={[{ name: "Customs services", path: "/services/customs" }, { name: "Koper", path: "/services/customs/koper" }]}/>
    <Directory result={result} title="Customs clearance in Koper, Slovenia." subtitle="Compare customs providers with a published Koper office. Prepare your documents and discuss import clearance, transit and onward delivery for your shipment." referralSource={{ placement: "location", content: "customs-koper" }} introContent={<ShipmentGuideNavigation/>} onChange={patch => void navigate({ to: "/companies", search: { ...result.search, ...patch } })}/>
    <ShipmentGuide guide={koperCustomsGuide} source={{ placement: "location", content: "customs-koper" }}/>
    <div className="wrap featured-partner-wrap"><FeaturedPartner source={{ placement: "location", content: "customs-koper" }}/></div><DiscoveryLinks/>
  </PublicLayout>;
}
