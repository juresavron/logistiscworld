import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { DiscoveryLinks } from "../components/discovery";
import { pageHead } from "../domain/seo";

export const Route = createFileRoute("/locations")({
  head: () => pageHead("Find Freight Forwarders by City in Slovenia", "Browse freight forwarders with local offices in Koper and Ljubljana. Choose a location, explore services and contact the company directly.", "/locations"),
  component: () => <PublicLayout><div className="wrap section"><span className="eyebrow">BROWSE LOCAL OFFICES</span><h1>Freight forwarders by city in Slovenia.</h1><p className="intro-text">A local office and a service area describe different things. Start with where a provider is based, then confirm the route and service you need.</p></div><DiscoveryLinks/></PublicLayout>,
});
