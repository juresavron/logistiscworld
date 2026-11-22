import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CompanyLogo } from "./company-logo";
import { createContext, useContext } from "react";
import type { Company } from "../domain/company";
import { quoteReferralHref, type ReferralSource } from "../domain/referrals";

export function FeaturedBadge() { return <span className="featured-badge">Featured partner</span>; }
export const FeaturedPartnerContext = createContext<Company | null>(null);
export function MediaSpedQuoteLink({ source, className = "button dark", children = "Request a quote from Mediašped" }: { source: ReferralSource; className?: string; children?: React.ReactNode }) {
  return <a className={className} href={quoteReferralHref(source)} rel="sponsored">{children}<ArrowUpRight size={17} aria-hidden="true"/></a>;
}
export function FeaturedPartner({ source }: { source: ReferralSource }) {
  const company = useContext(FeaturedPartnerContext);
  if (!company?.featured) return null;
  return <aside className="featured-partner" aria-label="Featured logistics partner: Mediašped"><div className="featured-partner-identity"><CompanyLogo company={company}/><div><FeaturedBadge/><h2>Mediašped d.o.o.</h2><span className="featured-partner-location"><MapPin size={14} aria-hidden="true"/>Koper, Slovenia</span></div></div><div className="featured-partner-copy"><h3>Have a shipment in mind?</h3><p>Discuss sea, road, air and intermodal freight, customs clearance or inland delivery with the Mediašped team.</p><div className="featured-partner-actions"><MediaSpedQuoteLink source={source}/><Link className="featured-profile-link" to="/companies/$slug" params={{ slug: "mediasped" }}>View company profile</Link></div><p className="featured-disclosure">Promotional placement. Mediašped is affiliated with the directory operator. <Link to="/methodology" hash="featured-placements">About featured placements</Link></p></div></aside>;
}
export function MediaSpedShipmentNeeds() {
  const needs = [
    { id: "sea-koper", title: "Sea freight via Koper", text: "Discuss your origin and destination ports, container or LCL requirements, cargo-ready date and onward delivery." },
    { id: "inland-slovenia", title: "Inland delivery in Slovenia", text: "Share the collection point, delivery address, cargo weight and unloading requirements for an inland transport proposal." },
    { id: "europe-road", title: "European road shipments", text: "Ask about your exact collection and delivery locations, packaging, dimensions and preferred transport dates." },
  ];
  return <section className="profile-section mediasped-shipment-needs" aria-labelledby="shipment-needs-heading"><h2 id="shipment-needs-heading">Start with your shipment</h2><p className="section-caption">Share your requirements. Mediašped will need to confirm availability, equipment, timing and price for your request.</p><div className="shipment-needs-grid">{needs.map(need => <article key={need.id}><h3>{need.title}</h3><p>{need.text}</p><MediaSpedQuoteLink className="shipment-quote-link" source={{ placement: "route", content: need.id }}>Discuss this shipment</MediaSpedQuoteLink></article>)}</div></section>;
}
