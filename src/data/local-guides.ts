export interface ShipmentGuideContent {
  title: string;
  introduction: string;
  stepsTitle: string;
  steps: readonly { title: string; text: string }[];
  checklist: readonly string[];
  costs: readonly { item: string; question: string }[];
  questions: readonly { question: string; answer: string }[];
  sources: readonly { label: string; url: string }[];
}

export const koperShipmentGuide: ShipmentGuideContent = {
  title: "Find a freight forwarder for the Port of Koper",
  introduction: "Planning an import or export through the Port of Koper, Slovenia? Compare freight forwarding companies with a published Koper office, then ask each provider to confirm the services for your shipment. Give them the same origin, cargo and final destination so the proposal covers the port handovers and onward delivery you need.",
  stepsTitle: "Agree who handles each handover",
  steps: [
    { title: "Before booking", text: "Confirm the origin port, cargo-ready date, container or LCL service and the Incoterm with its named place. Ask which origin and destination charges are included and who is your operational contact." },
    { title: "Before arrival", text: "Send the transport references and available documents. Agree who coordinates shipping-line release, customs arrangements and collection. Ask when documents must be ready and what could prevent pickup." },
    { title: "From port to consignee", text: "Provide the full delivery postcode, unloading facilities and appointment requirements. Confirm the proposed road or rail movement, any handover at an inland terminal and the arrangements for returning an empty container." },
  ],
  checklist: [
    "Origin and destination, including the final inland delivery postcode and country",
    "Cargo-ready date, estimated arrival if booked, and any delivery deadline",
    "FCL container size and quantity, or LCL package count and dimensions",
    "Goods description, gross cargo weight and any special handling requirements",
    "Incoterm and named place; the services already arranged by your supplier",
    "Available shipping references, customs documents and unloading requirements",
  ],
  costs: [
    { item: "Ocean freight", question: "Which ports and shipment dates does the rate cover? What is its validity and which surcharges are included?" },
    { item: "Destination handling and release", question: "Which terminal, shipping-line and documentation charges are included, and who invoices each one?" },
    { item: "Customs services", question: "Does the quote include brokerage or transit arrangements? Which duties, taxes or inspection costs are separate?" },
    { item: "Inland delivery", question: "Does the price reach the named delivery address? Confirm any rail-terminal transfer, unloading time and empty-container return." },
    { item: "Storage and equipment time", question: "Ask for the applicable free time, how it is counted, and the tariff for storage, demurrage or detention after it expires." },
    { item: "Insurance and exceptions", question: "Is cargo insurance included or separately available? Ask how waiting, inspections or a failed delivery would be charged." },
  ],
  questions: [
    { question: "How do I choose a freight forwarder for the Port of Koper?", answer: "Start with your cargo, origin, final delivery address and dates. Ask who coordinates shipping-line release, any customs service, port collection and inland transport. Compare written inclusions, exclusions and the contact responsible for the shipment; a local office alone does not establish the service scope." },
    { question: "Can a Koper freight forwarder arrange delivery outside Slovenia?", answer: "Ask about your exact destination and cargo. Luka Koper publishes rail connections with Central and Eastern Europe, but a port connection does not confirm an individual forwarder’s coverage, capacity or door-delivery price. Include the consignee’s postcode and ask who manages each inland leg." },
    { question: "Does an office in Koper mean every port service is included?", answer: "A local office is a useful starting point. It does not establish terminal access, equipment availability or acceptance of your cargo. Confirm the actual service scope with the provider, including any subcontracted work." },
    { question: "How do I compare two freight quotations?", answer: "Use the same cargo, dates, Incoterm and delivery address. Compare the written inclusions and exclusions as well as the total. Check quote validity, free time and the contact responsible for changes before accepting." },
  ],
  sources: [{ label: "Luka Koper: container terminal services and inland connections", url: "https://www.luka-kp.si/en/terminal/container-terminal/" }],
};

export const koperCustomsGuide: ShipmentGuideContent = {
  title: "Arrange customs clearance in Koper",
  introduction: "For goods arriving from outside the EU, tell the customs provider who is importing, what the goods are and where they must go after Koper. Explain whether you need a customs service alone or coordination with port collection and inland delivery. Ask the provider to confirm the procedure and authorisation required for your shipment.",
  stepsTitle: "Discuss clearance and onward movement together",
  steps: [
    { title: "Clearance in Koper", text: "Ask whether import clearance in Koper fits your shipment. Confirm who supplies the declaration data, who is represented, and which documents or product controls the broker needs before proceeding." },
    { title: "Transit to a destination", text: "FURS describes customs transit as a way of moving non-Union goods with duties and other charges deferred. If clearance is planned inland, ask the broker to confirm the suitable procedure, destination arrangements, guarantee and responsibility for completing transit." },
    { title: "Collection after customs arrangements", text: "Agree who confirms customs status and shipping-line release to the collecting carrier. Ask who books collection, manages any examination and updates you if documents or release are delayed." },
  ],
  checklist: [
    "Importer/exporter company details and EORI, if available, for the broker to check",
    "Commercial invoice and packing information: package count, dimensions and gross weight",
    "A precise goods description, materials and intended use; any known commodity code for review",
    "Origin information and any available supporting evidence",
    "Bill of lading or other transport reference, container number if known and expected arrival",
    "Final delivery address, intended clearance location and any available representation authorisation",
  ],
  costs: [
    { item: "Brokerage", question: "Which declaration and representation work is included? What changes the fee, such as additional commodity lines or amendments?" },
    { item: "Duties and taxes", question: "Request these separately from the service fee and ask which shipment information is needed to determine them." },
    { item: "Transit arrangements", question: "If relevant, does the price include the declaration, guarantee and destination arrangements? Who confirms transit has been completed?" },
    { item: "Inspections and terminal work", question: "Who coordinates an examination, and which inspection, handling or storage costs would be additional?" },
    { item: "Port collection and delivery", question: "Are shipping-line release, collection and onward transport part of this proposal or arranged separately?" },
  ],
  questions: [
    { question: "Must my goods be cleared in Koper?", answer: "FURS describes both clearance at the border and transit to a destination customs office. Ask a customs provider which arrangement is available for your goods, importer and destination before booking the onward movement." },
    { question: "Which documents should I prepare?", answer: "Start with your invoice, packing information and transport references. FURS identifies supporting documents such as origin evidence and authorisation, depending on the procedure. Send the available documents for review; the broker should confirm the complete set for your actual goods." },
    { question: "How long will customs clearance take?", answer: "Ask the broker for an estimate after reviewing the shipment. Document completeness, the procedure and any controls can affect the timing. Agree when information is needed and who will notify the carrier when collection can proceed." },
  ],
  sources: [
    { label: "FURS: import of goods and supporting documents", url: "https://www.fu.gov.si/en/customs/areas_of_work/import_of_goods/" },
    { label: "FURS: transport of goods under transit procedures", url: "https://www.fu.gov.si/en/business_events_businesses/transport_of_goods_under_transit_procedures/" },
  ],
};
