import { pageHead } from "../domain/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PublicLayout } from "../components/layout";
import { ServiceIcon } from "../components/ui";
import { services } from "../domain/company";
export const Route = createFileRoute("/services")({
  head: () => pageHead('Logistics Services in Slovenia & Neighbouring Markets', 'Explore freight forwarding, road transport, sea and air freight, customs clearance, and warehousing services in our regional directory preview.', '/services'),
  component: () => (
    <PublicLayout>
      <div className="wrap section">
        <span className="eyebrow">BROWSE BY SERVICE</span>
        <h1>Find companies by service.</h1>
        <p className="intro-text">
          From a single customs declaration to a complete transport operation,
          start with the service your business needs.
        </p>
        <div className="service-grid">
          {services.map((s, i) => (
            <Link
              className="service-tile"
              key={s.id}
              to="/services/$service"
              params={{ service: s.id }}
            >
              <div className="service-tile-top">
                <ServiceIcon service={s.id} size={29} />
                <span>0{i + 1}</span>
              </div>
              <h2>{s.name}</h2>
              <p>{s.description}</p>
              <ArrowUpRight className="tile-arrow" size={20} />
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  ),
});
