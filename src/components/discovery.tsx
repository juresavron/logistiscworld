import { Link } from "@tanstack/react-router";
import { jsonLd, siteOrigin } from "../domain/seo";
import { locations } from "../data/locations";

export function DiscoveryLinks() {
  return <section className="wrap seo-discovery" aria-labelledby="discover-local"><h2 id="discover-local">Explore logistics in Slovenia</h2><p>Start with a local office, a service or a practical shipping guide.</p><nav aria-label="Local logistics guides">
    {locations.map(location => <Link key={location.slug} to="/locations/$country" params={{ country: location.slug }}>Freight forwarders in {location.name}</Link>)}
    <Link to="/services/customs/koper">Customs clearance in Koper</Link>
    <Link to="/services/$service" params={{ service: "sea" }}>Sea freight in Slovenia</Link>
    <Link to="/blog/$slug" params={{ slug: "container-shipping-china-to-koper" }}>Container shipping from China to Koper</Link>
  </nav></section>;
}
export function BreadcrumbTrail({ items }: { items: { name: string; path: string }[] }) {
  return <div className="wrap seo-breadcrumbs"><nav aria-label="Breadcrumb"><a href="/">Slovenia logistics</a>{items.map(item => <span key={item.path}><span aria-hidden="true"> / </span><a href={item.path}>{item.name}</a></span>)}</nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ name: "Slovenia logistics", path: "/" }, ...items].map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: siteOrigin + item.path })) }) }}/>
  </div>;
}
export function LocalGuide({ title, paragraphs, checklist, source }: { title: string; paragraphs: readonly string[]; checklist: readonly string[]; source?: { label: string; url: string } | null }) {
  return <section className="wrap seo-local-guide"><h2>{title}</h2>{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<h3>What to send with your enquiry</h3><ul>{checklist.map(item => <li key={item}>{item}</li>)}</ul>{source && <p className="form-note">Official reference: <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></p>}</section>;
}
