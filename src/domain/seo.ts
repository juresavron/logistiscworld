// Preview origin; change this once a permanent domain is connected.
export const siteOrigin = "https://logisticsworld.worldfans.workers.dev";

export function pageHead(title: string, description: string, path: string) {
  const url = new URL(path, siteOrigin).href;
  return {
    meta: [
      { title: `${title} | LogisticsWorld` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | LogisticsWorld` },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "LogisticsWorld" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const homeTitle = "Best Logistics Companies in Slovenia";
export const homeDescription =
  "Find the best logistics companies in Slovenia for your shipment. Compare freight forwarding, transport, customs and warehousing. Explore our directory preview.";
