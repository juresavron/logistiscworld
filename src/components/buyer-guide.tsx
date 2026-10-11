import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function BuyerGuide() { return <>
      <section className="section wrap editorial" aria-labelledby="choose-partner">
        <span className="eyebrow">A PRACTICAL BUYER’S GUIDE</span>
        <h2 id="choose-partner">How to choose the best logistics company in Slovenia</h2>
        <p className="intro-text">
          The best partner depends on your cargo, route, and delivery requirements.
          A forwarder arranging an ocean shipment may offer a different service
          from a carrier handling regular pallet deliveries. Use these questions
          to build a shortlist before requesting a quote.
        </p>
        <div className="editorial-grid">
          <section>
            <h3>Match the service to the shipment</h3>
            <p>Check whether you need a freight forwarder to coordinate the journey,
              a road carrier, a customs broker, or a warehouse operator. Ask who
              will carry out each part of the work and who your contact will be.</p>
            <Link className="text-link" to="/services">Compare logistics services <ArrowUpRight size={16} /></Link>
          </section>
          <section>
            <h3>Check local offices and route coverage</h3>
            <p>A Slovenian office and service coverage are different things. For
              shipments through Koper, ask about port collection and onward
              transport. For deliveries to Italy, Austria, Croatia, or Hungary,
              confirm that the provider handles your specific route.</p>
            <Link className="text-link" to="/locations/$country" params={{ country: "slovenia" }}>Explore Slovenian offices <ArrowUpRight size={16} /></Link>
          </section>
          <section>
            <h3>Confirm cargo requirements</h3>
            <p>Share dimensions, weight, packaging, and any temperature or handling
              requirements. Ask for evidence of relevant experience, current
              insurance, and any authorisations your shipment requires.</p>
          </section>
          <section>
            <h3>Compare quotes on the same basis</h3>
            <p>Give each company the same collection and delivery details. Ask
              which transport, handling, customs, storage, and other charges are
              included, along with the proposed schedule and tracking arrangements.</p>
          </section>
        </div>
        <p className="muted">Directory order is not a quality ranking. This preview
          contains fictional profiles, with no verified ratings or recommendations. <Link
            className="text-link" to="/methodology">Read our comparison approach.</Link></p>
      </section>
      <section className="section soft-section">
        <div className="wrap editorial">
          <span className="eyebrow">BEFORE YOU CONTACT A COMPANY</span>
          <h2>Questions about logistics companies in Slovenia</h2>
          <div className="seo-faq">
            <details>
              <summary>Which is the best logistics company in Slovenia?</summary>
              <p>There is no single best company for every shipment. Compare providers
                against your route, cargo type, service needs, and schedule. LogisticsWorld
                helps structure that comparison; the current sample listings are not endorsements.</p>
            </details>
            <details>
              <summary>Can I find a partner for shipments through Koper?</summary>
              <p>Start with sea freight, freight forwarding, and customs clearance.
                Confirm that the company can handle your shipment through Koper and
                arrange any collection, storage, and onward delivery you need.</p>
            </details>
            <details>
              <summary>How do I request a logistics quote?</summary>
              <p>Once real listings are available, contact each company directly using
                its published details. Include collection and delivery locations,
                cargo dimensions and weight, dates, and required services.
                LogisticsWorld does not sell or arrange transport.</p>
            </details>
          </div>
        </div>
      </section>

</>; }
