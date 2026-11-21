import { blogPosts } from "../data/blog";
import { serviceIds } from "./company";

const sources = {
  profile: ["mediasped"], directory: ["listing"], homepage: ["featured"],
  blog: ["index", ...blogPosts.map(post => post.slug)], service: ["index", ...serviceIds],
  route: ["sea-koper", "inland-slovenia", "europe-road"], verification: ["qa"],
} as const;
export type ReferralPlacement = keyof typeof sources;
export interface ReferralSource { placement: ReferralPlacement; content: string }

export function parseReferralSource(params: URLSearchParams): ReferralSource | null {
  const placement = params.get("placement") ?? "profile", content = params.get("content") ?? "mediasped";
  if (!Object.hasOwn(sources, placement)) return null;
  const allowed = sources[placement as ReferralPlacement] as readonly string[];
  return allowed.includes(content) ? { placement: placement as ReferralPlacement, content } : null;
}
export function quoteReferralHref(source: ReferralSource) {
  return `/go/mediasped?${new URLSearchParams({ placement: source.placement, content: source.content })}`;
}
export function mediaspedQuoteDestination(source: ReferralSource) {
  const url = new URL("https://mediasped.com/en/request-quote/");
  url.searchParams.set("utm_source", "logisticsworld.eu");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "featured-partner");
  url.searchParams.set("utm_content", `${source.placement}:${source.content}`);
  return url.href;
}
export interface ReferralAnalytics {
  writeDataPoint(point: { indexes: string[]; blobs: string[]; doubles: number[] }): void;
}
/** An outbound handoff is not a submitted enquiry or a customer rating. */
export function handleQuoteReferral(request: Request, analytics?: ReferralAnalytics) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "strict-origin-when-cross-origin" };
  if (!["GET", "HEAD"].includes(request.method)) return new Response("Method not allowed", { status: 405, headers: { ...headers, Allow: "GET, HEAD" } });
  const source = parseReferralSource(new URL(request.url).searchParams);
  if (!source) return new Response("Unknown referral source", { status: 400, headers });
  const prefetch = /prefetch|prerender/i.test(`${request.headers.get("purpose") ?? ""} ${request.headers.get("sec-purpose") ?? ""}`);
  if (request.method === "GET" && !prefetch) {
    try {
      analytics?.writeDataPoint({ indexes: ["mediasped"], blobs: [source.placement === "verification" ? "verification" : "quote_handoff", source.placement, source.content], doubles: [1] });
    } catch { console.warn("Referral analytics unavailable"); }
  }
  return new Response(null, { status: 302, headers: { ...headers, Location: mediaspedQuoteDestination(source) } });
}
