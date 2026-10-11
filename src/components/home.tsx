import { normalizeSearch } from "../domain/search";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, MapPin, Search } from "lucide-react";
import { countries, services } from "../domain/company";
import { companies } from "../data/companies";
import { CompanyCard } from "./company-card";
import { ServiceIcon } from "./ui";

function NetworkIllustration() {
  return (
    <div className="network-art" aria-hidden="true">
      <svg viewBox="0 0 500 420">
        <defs>
          <pattern
            id="dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#79918a" opacity=".2" />
          </pattern>
        </defs>
        <rect width="500" height="420" fill="url(#dots)" />
        <g fill="none" stroke="#527268" strokeWidth="1">
          <ellipse cx="262" cy="210" rx="162" ry="162" />
          <ellipse cx="262" cy="210" rx="99" ry="162" />
          <ellipse cx="262" cy="210" rx="39" ry="162" />
          <ellipse cx="262" cy="210" rx="162" ry="72" />
          <path d="M100 210H424M113 146H411M113 275H411" />
        </g>
        <g fill="none" stroke="#ed8a5f" strokeWidth="2" strokeDasharray="5 7">
          <path d="M140 247Q200 85 287 118M140 247Q250 183 382 255M140 247Q168 282 246 314M287 118Q396 159 382 255" />
        </g>
        <g fill="#fa8d5d">
          <circle cx="140" cy="247" r="8" />
          <circle cx="287" cy="118" r="6" />
          <circle cx="382" cy="255" r="6" />
          <circle cx="246" cy="314" r="6" />
        </g>
        <circle
          cx="140"
          cy="247"
          r="19"
          stroke="#fa8d5d"
          fill="none"
          opacity=".4"
        />
        <g fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#dee9e0">
          <text x="102" y="279">
            SLOVENIA
          </text>
          <text x="256" y="97">
            AUSTRIA
          </text>
          <text x="365" y="282">
            HUNGARY
          </text>
          <text x="218" y="344">
            CROATIA
          </text>
        </g>
      </svg>
      <div className="route-note">
        <span className="route-note-icon">
          <MapPin size={17} />
        </span>
        <div>
          <span>REGIONAL KNOWLEDGE</span>
          <strong>Connected by expertise.</strong>
        </div>
        <ArrowUpRight size={20} />
      </div>
      <span className="network-caption">
        A region of possibilities. One place to start.
      </span>
    </div>
  );
}
export function Home() {
  const [service, setService] = useState(""),
    [office, setOffice] = useState("SI");
  const navigate = useNavigate();
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow light">
              <span />
              SLOVENIA FIRST. CONNECTED TO THE REGION.
            </div>
            <h1>
              Best logistics companies <em>in Slovenia.</em>
            </h1>
            <p>
              Find the right partner for your shipment. Compare freight
              forwarding, transport, customs clearance, and warehousing in
              Slovenia, with connections to neighbouring markets.
            </p>
            <div className="hero-proof">
              <span>
                <Check size={14} /> Compare capabilities
              </span>
              <span>
                <Check size={14} /> Contact directly
              </span>
            </div>
          </div>
          <NetworkIllustration />
        </div>
        <form
          className="hero-search"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({
              to: "/companies",
              search: normalizeSearch({
                services: service ? [service] : [],
                office,
              }),
            });
          }}
        >
          <label>
            <span>WHAT DO YOU NEED?</span>
            <div>
              <Search size={19} />
              <select
                aria-label="Service"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">All logistics services</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label>
            <span>WHERE SHOULD THEY BE BASED?</span>
            <div>
              <MapPin size={19} />
              <select
                aria-label="Office country"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
              >
                <option value="">Anywhere in the region</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <button className="button orange" type="submit">
            Find companies <ArrowRight size={19} />
          </button>
        </form>
      </section>
      <div className="market-strip">
        <span>START WITH LOCAL KNOWLEDGE</span>
        {countries.map((c) => (
          <Link
            key={c.code}
            to="/locations/$country"
            params={{ country: c.slug }}
          >
            <span>{c.code}</span>
            {c.name}
          </Link>
        ))}
      </div>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE EXPERTISE YOU NEED</span>
            <h2>
              Every shipment starts
              <br />
              with the right partner.
            </h2>
          </div>
          <Link className="text-link" to="/services">
            Explore all services <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="service-grid">
          {services.map((s, i) => (
            <Link
              className="service-tile"
              key={s.id}
              to="/services/$service"
              params={{ service: s.id }}
            >
              <div className="service-tile-top">
                <ServiceIcon service={s.id} size={27} />
                <span>0{i + 1}</span>
              </div>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <ArrowUpRight className="tile-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section soft-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MEET THE DIRECTORY</span>
              <h2>
                Start your Slovenia shortlist.
              </h2>
            </div>
            <div>
              <p className="muted section-aside">
                Explore a few sample profiles to see
                <br />
                how companies will be presented.
              </p>
              <Link className="text-link" to="/locations/$country" params={{ country: "slovenia" }}>
                Logistics companies in Slovenia <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <div className="company-grid">
            {companies.filter((c) => c.offices.some((o) => o.country === "SI")).slice(0, 3).map((c) => (
              <CompanyCard key={c.id} company={c} compact />
            ))}
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="approach-block">
          <div>
            <span className="eyebrow">LESS SEARCHING. BETTER CONNECTIONS.</span>
            <h2>
              Your business is moving.
              <br />
              Find someone who gets it.
            </h2>
            <Link className="button dark" to="/methodology">
              Our approach <ArrowUpRight size={17} />
            </Link>
          </div>
          <ol className="steps">
            <li>
              <span>01</span>
              <div>
                <h3>Find your fit</h3>
                <p>
                  Start with the service you need and the location that matters.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Look beyond the logo</h3>
                <p>
                  Compare services, office locations, and coverage side by side.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Make the connection</h3>
                <p>
                  Speak directly with the company through its published
                  channels.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
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
    </>
  );
}
