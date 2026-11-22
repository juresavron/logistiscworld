import { z } from "zod";
import { databaseConfig, databaseRequest, runtimeValue } from "./database";
import { blogPosts } from "../data/blog";
import { locations } from "../data/locations";
import { serviceIds } from "../domain/company";
import { officeMatchesCity } from "../domain/search";
import { siteOrigin, xmlEscape } from "../domain/seo";

export async function indexingEnabled(request: Request) {
  return new URL(request.url).origin === siteOrigin && await runtimeValue("PUBLIC_INDEXING_ENABLED") === "true" && Boolean(await databaseConfig());
}

const sitemapRow = z.object({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), published_at: z.string().datetime({ offset: true }), services: z.array(z.enum(serviceIds)), offices: z.array(z.object({ city: z.string(), country: z.string() })) });
export async function sitemapResponse(request: Request) {
  const headers = { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" };
  if (!await indexingEnabled(request)) return new Response("Sitemap unavailable on previews.", { status: 404, headers });
  try {
    const config = (await databaseConfig())!;
    const records: z.infer<typeof sitemapRow>[] = [];
    for (let offset = 0; offset < 50000; offset += 1000) {
      const rows = z.array(sitemapRow).parse(await databaseRequest(config, `/rest/v1/company_publications?select=slug,published_at,services:payload->services,offices:payload->offices&order=slug.asc&limit=1000&offset=${offset}`));
      records.push(...rows);
      if (rows.length < 1000) break;
      if (offset === 49000) throw Error("Split the sitemap before reaching 50,000 companies.");
    }
    const urls: { path: string; modified?: string }[] = ["/", "/companies", "/services", "/locations", "/blog", "/methodology"].map(path => ({ path }));
    for (const service of serviceIds) if (records.some(company => company.services.includes(service))) urls.push({ path: `/services/${service}` });
    for (const location of locations) if (records.some(company => company.offices.some(office => officeMatchesCity(office, location.name)))) urls.push({ path: `/locations/${location.slug}` });
    if (records.some(company => company.services.includes("customs") && company.offices.some(office => office.country === "SI" && office.city.toLowerCase() === "koper"))) urls.push({ path: "/services/customs/koper" });
    for (const company of records) urls.push({ path: `/companies/${company.slug}`, modified: company.published_at });
    for (const post of blogPosts) urls.push({ path: `/blog/${post.slug}`, modified: `${post.publishedAt}T00:00:00+01:00` });
    const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(entry => `  <url><loc>${xmlEscape(siteOrigin + entry.path)}</loc>${entry.modified ? `<lastmod>${xmlEscape(entry.modified)}</lastmod>` : ""}</url>`).join("\n") + '\n</urlset>\n';
    return new Response(body, { headers });
  } catch {
    return new Response("Sitemap temporarily unavailable.", { status: 503, headers: { ...headers, "Retry-After": "60" } });
  }
}
export async function robotsResponse(request: Request) {
  const enabled = await indexingEnabled(request);
  const body = enabled ? `User-agent: *\nAllow: /\nDisallow: /_serverFn/\nSitemap: ${siteOrigin}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n";
  return new Response(request.method === "HEAD" ? null : body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
