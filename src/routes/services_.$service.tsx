import { pageHead } from "../domain/seo";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Directory } from "../components/directory";
import { services } from "../domain/company";
import { getDirectory } from "../server/catalog";
import { FeaturedPartner } from "../components/featured-partner";
import { BreadcrumbTrail, DiscoveryLinks, LocalGuide } from "../components/discovery";
export const Route = createFileRoute("/services_/$service")({
  loader: async ({ params }) => {
    const service = services.find((s) => s.id === params.service);
    if (!service) throw notFound();
    const result = await getDirectory({ data: { services: [service.id] } });
    if (!result.total) throw notFound();
    return {
      service,
      result,
    };
  },
  head: ({ loaderData }) => loaderData ? pageHead(
    loaderData.service.id === "sea" ? "Sea Freight in Slovenia via Port of Koper" : loaderData.service.id === "forwarding" ? "International Freight Forwarding Services in Slovenia" : `${loaderData.service.name} Companies in Slovenia`,
    loaderData.service.id === "sea"
      ? "Compare sea freight and container shipping providers in Slovenia. Plan ocean freight via the Port of Koper, FCL or LCL and inland delivery."
      : loaderData.service.id === "forwarding"
      ? "Compare international freight forwarding services in Slovenia. Find a logistics partner for transport, Port of Koper handovers and onward delivery."
      : `Find ${loaderData.service.name.toLowerCase()} providers with offices in Slovenia. Compare published services, local offices and direct company contacts.`,
    `/services/${loaderData.service.id}`,
  ) : {},
  component: Page,
});
function Page() {
  const { service, result } = Route.useLoaderData(),
    navigate = useNavigate();
  return (
    <PublicLayout>
      <BreadcrumbTrail items={[{name:"Services",path:"/services"},{name:service.name,path:`/services/${service.id}`}]}/>
      <Directory
        referralSource={{placement:"service",content:service.id}}
        result={result}
        title={service.id === "sea" ? "Sea freight in Slovenia." : service.id === "forwarding" ? "International freight forwarding services in Slovenia." : `${service.name} companies in Slovenia.`}
        subtitle={service.id === "sea" ? "Find ocean freight and container shipping providers with Slovenian offices. Compare services for FCL, LCL and onward delivery through the Port of Koper." : service.id === "forwarding" ? "Find a logistics partner to coordinate your international shipment. Compare published freight forwarding services and confirm who handles each transport stage." : service.description}
        onChange={(patch) =>
          void navigate({
            to: "/companies",
            search: { ...result.search, ...patch },
          })
        }
      />
      {service.id === "sea" && <LocalGuide title="Sea freight through Koper: compare the full shipment" paragraphs={[
        "For container shipping in Slovenia, start with the loading port, destination address and cargo-ready date. Ask the forwarder which ocean freight service is proposed and who arranges the stages before loading and after discharge. If you need FCL or LCL advice, include package dimensions, gross weight and handling requirements.",
        "Koper’s container terminal publishes vessel, truck and rail information. Agree the onward movement with your provider at quotation stage, including any collection, storage, customs service and empty-container return that your shipment needs.",
        "Compare proposals on the same service scope. Ask for the currency, validity, destination charges and exclusions alongside the ocean freight. Confirm the available routing and dates directly; this directory does not publish live rates or booking availability.",
      ]} checklist={["Loading port and final delivery address", "Container or LCL cargo details and cargo-ready date", "Origin, ocean, destination and inland charges", "Free-time terms, handling requirements and the operational contact"]} source={{label:"Luka Koper: Container Terminal",url:"https://www.luka-kp.si/en/terminal/container-terminal/"}}/>}
      {service.id === "forwarding" && <LocalGuide title="Plan international freight forwarding from origin to delivery" paragraphs={[
        "Start with the journey you need coordinated. Share the collection address, final delivery postcode, cargo details and dates. Ask which transport modes are proposed and whether your freight forwarding service includes collection, handling, customs arrangements, storage and delivery, or only selected stages.",
        "For cargo through the Port of Koper, agree who coordinates the shipping line, terminal, customs representative and inland carrier. Ask whether the same contact manages the complete operation and who updates you when a handover or delivery changes.",
        "A logistics provider’s published service label is a starting point for comparison. Confirm acceptance of your goods, the proposed routing, availability and the work performed by partners. Compare quotations for the same scope, with transport charges, additional services and exclusions clearly identified.",
      ]} checklist={["Collection and delivery addresses, including country and postcode", "Goods, package dimensions, gross weight and handling needs", "Cargo-ready date, delivery requirement and agreed trade terms", "Service scope, handover responsibilities and one operational contact"]}/>}
      <div className="wrap featured-partner-wrap"><FeaturedPartner source={{placement:"service",content:service.id}}/></div>
      <DiscoveryLinks/>
    </PublicLayout>
  );
}
