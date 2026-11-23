export const locations = [
  {
    slug: "koper", name: "Koper",
    title: "Freight Forwarders in Koper, Slovenia",
    description: "Find freight forwarders in Koper, Slovenia. Compare local providers, prepare an international shipping enquiry and check port, customs and inland delivery costs.",
    heading: "Freight forwarding in Koper: plan the complete journey",
    paragraphs: [
      "When choosing a freight forwarder in Koper, start with the parts of the journey you need coordinated. The companies below have a published office in Koper; a local address does not by itself confirm terminal access, equipment availability or the service for your shipment.",
      "Ask who will arrange release, collection and delivery, and whether the proposal includes customs services or storage. Share the final delivery address and loading requirements at the same time as the port details, so you can compare the complete job.",
    ],
    checklist: ["Origin port, cargo-ready date and destination address", "Container or package details, gross weight and special handling", "Port collection, onward delivery and equipment requirements", "Written inclusions, exclusions and the contact for the operation"],
    source: { label: "Luka Koper: official container terminal information", url: "https://www.luka-kp.si/en/terminal/container-terminal/" },
  },
  {
    slug: "ljubljana", name: "Ljubljana",
    title: "Freight Forwarders in Ljubljana, Slovenia",
    description: "Find freight forwarders with offices in Ljubljana, including Črnuče and Šentvid. Browse transport, customs and warehousing services and direct contacts.",
    heading: "Choosing logistics companies in Ljubljana",
    paragraphs: [
      "This directory groups Ljubljana offices with the published Ljubljana–Črnuče and Ljubljana–Šentvid district addresses. Brnik, Kranj and Šenčur remain separate locations; a company serving Ljubljana is not automatically listed as having an office in the city.",
      "For collection or delivery, give the provider the exact postcode, site access and loading arrangements. If the route also involves an airport or the Port of Koper, ask who coordinates that handover and whether inland transport is included in the proposal.",
    ],
    checklist: ["Exact collection and delivery postcodes", "Package dimensions, gross weight and loading facilities", "Road, air, ocean or rail service needed", "Responsibility for each handover and final delivery"],
    source: null,
  },
] as const;
export function locationBySlug(slug: string) { return locations.find(location => location.slug === slug); }
