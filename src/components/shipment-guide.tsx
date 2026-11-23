import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import type { ShipmentGuideContent } from "../data/local-guides";
import type { ReferralSource } from "../domain/referrals";
import { FeaturedPartnerContext, MediaSpedQuoteLink } from "./featured-partner";

export function ShipmentGuideNavigation() {
  return <nav className="shipment-guide-nav" aria-label="On this page">
    <a href="#directory-results">Compare companies</a>
    <a href="#shipment-checklist">Prepare an enquiry</a>
    <a href="#quote-costs">Compare quote costs</a>
    <a href="#shipment-questions">Common questions</a>
  </nav>;
}

export function ShipmentGuide({ guide, source }: { guide: ShipmentGuideContent; source: ReferralSource }) {
  const featuredPartner = useContext(FeaturedPartnerContext);
  return <article className="wrap shipment-guide" aria-labelledby="shipment-guide-title">
    <header className="shipment-guide-header"><span className="eyebrow">FOR INTERNATIONAL BUYERS</span><h2 id="shipment-guide-title">{guide.title}</h2><p>{guide.introduction}</p></header>
    <section aria-labelledby="shipment-handovers"><h3 id="shipment-handovers">{guide.stepsTitle}</h3><div className="shipment-guide-steps">{guide.steps.map(step => <div key={step.title}><h4>{step.title}</h4><p>{step.text}</p></div>)}</div></section>
    <section id="shipment-checklist" className="shipment-guide-checklist" aria-labelledby="shipment-checklist-title"><h3 id="shipment-checklist-title">What to send with your enquiry</h3><p>Send the same details to each provider so the proposals cover the same job.</p><ul>{guide.checklist.map(item => <li key={item}>{item}</li>)}</ul><p><Link to="/blog/$slug" params={{ slug: "freight-quote-checklist" }}>Read the complete freight quote checklist</Link></p>
      {featuredPartner?.featured && <aside className="shipment-guide-action" aria-label="Mediašped quotation enquiry">
        <MediaSpedQuoteLink source={source}/>
        <p>Featured partner · Mediašped is affiliated with the directory operator. <Link to="/methodology" hash="featured-placements">About this placement</Link></p>
      </aside>}
    </section>
    <section id="quote-costs" aria-labelledby="quote-costs-title"><h3 id="quote-costs-title">What should the quotation include?</h3><p>Ask for a written breakdown. A service label in the directory does not confirm these costs are included.</p><div className="shipment-costs"><table><caption>Questions to ask when comparing quotations</caption><thead><tr><th scope="col">Cost or service</th><th scope="col">Confirm with the provider</th></tr></thead><tbody>{guide.costs.map(cost => <tr key={cost.item}><th scope="row">{cost.item}</th><td>{cost.question}</td></tr>)}</tbody></table></div></section>
    <section id="shipment-questions" aria-labelledby="shipment-questions-title"><h3 id="shipment-questions-title">Common questions</h3><div className="shipment-guide-questions">{guide.questions.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    <footer className="shipment-guide-sources"><h3>Official references</h3><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul><p>Confirm current arrangements for your shipment directly with the provider.</p></footer>
  </article>;
}
