export type BlogCategory = "Slovenia" | "Ocean freight" | "Planning";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  artwork: "port" | "containers" | "checklist";
  publishedAt: string;
  takeaway: string;
  sections: { id: string; title: string; paragraphs: string[]; items?: string[] }[];
  sources: { label: string; url: string }[];
}

// Newest articles first. Content is published with the application; no visitor
// input or browser-only admin state can publish an article.
export const blogPosts: BlogPost[] = [
  {
    slug: "shipping-through-koper",
    title: "Shipping through Koper: plan the whole journey",
    description: "A practical starting point for coordinating the port, your logistics partner and the final delivery.",
    category: "Slovenia",
    artwork: "port",
    publishedAt: "2026-11-21",
    takeaway: "Choose a partner for the complete shipment, including the steps before and after the vessel arrives.",
    sections: [
      {
        id: "start-with-the-destination",
        title: "Start with the final destination",
        paragraphs: ["A port is one part of a shipment. Before requesting a route through Koper, write down where the cargo starts, where it must finish and when it needs to be available. That gives a logistics provider a useful brief for the whole journey.", "Ask each provider to quote the same scope. A price ending at the port cannot be compared directly with a price that also includes onward delivery."],
      },
      {
        id: "connect-the-transport-legs",
        title: "Connect the transport legs",
        paragraphs: ["Luka Koper’s container terminal handles vessel, truck and wagon operations. Its official information also describes railway connections to Central and Eastern European trade centres. Which onward option fits your cargo depends on the exact destination and the service available for your dates.", "Ask your provider to explain the proposed handovers and who coordinates them. Request a door-to-door plan rather than assuming that an ocean booking includes every inland movement."],
        items: ["Who arranges collection or delivery at the terminal?", "Does the proposal use road, rail or a combination?", "Who confirms cargo availability and the next transport leg?"],
      },
      {
        id: "agree-on-responsibilities",
        title: "Agree on responsibilities before arrival",
        paragraphs: ["Use a short responsibility list with your forwarder: shipment documents, release coordination, any customs services, inland transport and the delivery appointment. Ask which tasks are included and which require a separate instruction.", "If your cargo has special handling needs, raise them before booking. Explain the packaging, dimensions and any temperature or loading requirements so the provider can check the proposed service."],
      },
      {
        id: "choose-a-local-partner",
        title: "Find a partner who can explain the plan",
        paragraphs: ["Use the directory to identify companies with the services you need, then contact them with your shipment brief. Ask about the exact route and scope, who will handle the operation and how updates will reach you.", "Use the port’s official terminal information for operational references. Confirm schedules, availability and shipment-specific arrangements directly with your chosen provider."],
      },
    ],
    sources: [{ label: "Luka Koper: Container Terminal", url: "https://www.luka-kp.si/en/terminal/container-terminal/" }],
  },
  {
    slug: "fcl-or-lcl-container-shipping",
    title: "FCL or LCL: choosing how to ship by sea",
    description: "Understand the two container options and the questions that make a useful comparison.",
    category: "Ocean freight",
    artwork: "containers",
    publishedAt: "2026-11-21",
    takeaway: "Compare the complete service for your cargo and dates. Container utilisation alone does not decide the right option.",
    sections: [
      {
        id: "two-container-options",
        title: "Two ways to use a container",
        paragraphs: ["FCL means full container load: a container is used for one shipper’s goods. LCL means less-than-container load: your shipment shares container space with other shipments.", "You do not always need enough cargo to fill a container before considering FCL. Maersk notes that the better option depends on your cargo and needs, and that FCL can be worth comparing even when the container is not full."],
      },
      {
        id: "prepare-the-cargo-details",
        title: "Give the provider a complete cargo picture",
        paragraphs: ["Prepare one cargo description that can be used for both options. Include package count, dimensions, gross weight, packaging and collection and delivery locations. Tell the provider whether the goods can be stacked and whether they need special handling.", "Ask for advice on equipment and loading suitability instead of choosing a container solely from a general size guide."],
        items: ["Exact package dimensions and gross weight", "Cargo-ready date and delivery requirements", "Stackability, packaging and handling needs", "Collection and delivery addresses"],
      },
      {
        id: "compare-complete-proposals",
        title: "Compare complete proposals",
        paragraphs: ["Ask for both proposals on the same route, dates and service scope. Request a breakdown of collection, freight, handling and final delivery, with clear inclusions and exclusions.", "Ask the forwarder to explain the proposed schedule and the handovers involved. Avoid treating a general FCL-versus-LCL rule as a promise about your actual shipment."],
      },
      {
        id: "make-the-decision",
        title: "Choose against your priorities",
        paragraphs: ["Write down what matters most: budget, delivery timing, handling requirements or shipment flexibility. Then ask the provider which proposal best meets those priorities and why.", "Keep the written cargo details and quotation together. If the shipment changes, request a revised proposal before booking."],
      },
    ],
    sources: [
      { label: "Maersk: What is FCL?", url: "https://www.maersk.com/support/faqs/2023/10/18/what-is-fcl" },
      { label: "Maersk: What is better, LCL or FCL?", url: "https://www.maersk.com/support/faqs/2025/04/17/which-is-better-lcl-or-fcl" },
    ],
  },
  {
    slug: "freight-quote-checklist",
    title: "What to include in a freight quote request",
    description: "A clear shipment brief helps providers quote the same job and makes the replies easier to compare.",
    category: "Planning",
    artwork: "checklist",
    publishedAt: "2026-11-21",
    takeaway: "Send every provider the same shipment details and ask for a written breakdown of what their price covers.",
    sections: [
      {
        id: "describe-the-shipment",
        title: "Describe the shipment, not just the route",
        paragraphs: ["A route such as “China to Slovenia” is a starting point. Add the actual collection and delivery locations, your cargo-ready date and any required delivery timing. State whether you need a door-to-door service or only a specific transport leg.", "Freight costs depend on factors including transport mode, cargo weight and dimensions, route and handling requirements. Clear details give providers a better basis for their proposal."],
      },
      {
        id: "shipment-checklist",
        title: "Use one checklist for every provider",
        paragraphs: ["Put the essential details in one brief. If something is not confirmed, label it as an estimate and say when you expect to confirm it."],
        items: ["Collection and delivery addresses, including postcodes", "Goods description, packaging and number of packages", "Gross weight and dimensions for each package type", "Cargo-ready date and required delivery timing", "Required transport scope and any agreed trade terms", "Loading, unloading and special handling requirements", "Your contact person for clarification"],
      },
      {
        id: "ask-about-inclusions",
        title: "Ask what the price covers",
        paragraphs: ["Ask the provider to identify the transport and handling charges, any surcharges and the services excluded from the quotation. Request separate confirmation of any customs service, insurance or storage you need.", "For container shipments, ask which free-time terms apply and what happens if collection or return is delayed. The purpose is to understand your proposal, rather than assume that the first price is the complete shipment cost."],
      },
      {
        id: "compare-and-confirm",
        title: "Compare the replies on the same basis",
        paragraphs: ["Keep a simple comparison: scope, price and currency, validity, proposed schedule, exclusions and the person responsible for the operation. Resolve any gaps with the provider before you decide.", "A quotation is a proposal for the stated shipment. Ask the provider to confirm the final arrangements when you are ready to proceed, especially if cargo details or dates have changed."],
      },
    ],
    sources: [{ label: "Maersk: What factors determine your freight quote?", url: "https://www.maersk.com/logistics-explained/transportation-and-freight/2024/02/19/freight-shipping-costs-components" }],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}

export function readingMinutes(post: BlogPost) {
  const words = [post.description, post.takeaway, ...post.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.items ?? [])])].join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}
