import { createFileRoute, notFound } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { BreadcrumbTrail, DiscoveryLinks, LocalGuide } from "../components/discovery";
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
    <Directory result={result} title="Customs clearance in Koper, Slovenia." subtitle="Published customs service providers with a local Koper office. Confirm the procedure and service scope for your goods directly." referralSource={{ placement: "location", content: "customs-koper" }} onChange={patch => void navigate({ to: "/companies", search: { ...result.search, ...patch } })}/>
    <LocalGuide title="Choosing a customs broker in Koper" paragraphs={[
      "When choosing a customs broker in Koper, explain who is importing or exporting, what the goods are, where they come from and where they must go. A request for customs clearance needs more detail than the container number. Ask the provider to confirm which procedure fits the shipment and what authorisation they need to act for you.",
      "Slovenia’s Financial Administration identifies supporting documents such as an invoice, origin evidence and authorisation, depending on the procedure. Give the broker your available documents early and ask which additional product information or controls apply to the actual goods.",
      "Compare the brokerage service separately from port handling, inland transport, storage and any duties or taxes. Ask who coordinates the next movement after release. The service labels in this directory describe published company information; the provider must confirm acceptance and arrangements for your shipment.",
    ]} checklist={["Importer or exporter details and a clear goods description", "Available invoice, packing information and transport references", "Origin, destination and the intended movement after Koper", "A written breakdown of the broker’s scope and excluded charges"]} source={{ label: "FURS: import of goods", url: "https://www.fu.gov.si/en/customs/areas_of_work/import_of_goods/" }}/>
    <div className="wrap featured-partner-wrap"><FeaturedPartner source={{ placement: "location", content: "customs-koper" }}/></div><DiscoveryLinks/>
  </PublicLayout>;
}
