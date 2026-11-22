export const siteOrigin = "https://logisticsworld.eu";

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

export const homeTitle = "Freight Forwarders in Slovenia";
export const homeDescription =
  "Compare freight forwarders and logistics companies in Slovenia. Find Koper and Ljubljana offices, sea freight, customs services and direct company contacts.";

export function indexablePath(path: string) {
  return ["/", "/companies", "/services", "/locations", "/methodology", "/blog", "/locations/koper", "/locations/ljubljana", "/services/customs/koper"].includes(path)
    || /^\/(companies|blog)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)
    || /^\/services\/(road|sea|air|customs|warehouse|forwarding|rail)$/.test(path);
}
export function robotsDirective(enabled: boolean, path: string, search: Record<string, unknown>, successful = true) {
  const filtered = Boolean(search.q || search.city || search.coverage || search.type
    || (Array.isArray(search.services) && search.services.length) || (Array.isArray(search.capabilities) && search.capabilities.length)
    || (search.page && Number(search.page) !== 1) || (search.sort && search.sort !== "relevance"));
  return enabled && successful && indexablePath(path) && !filtered ? "index, follow" : "noindex, follow";
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
export function xmlEscape(value: string) { return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]!); }
