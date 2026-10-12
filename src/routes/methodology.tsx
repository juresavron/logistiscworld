import { pageHead } from "../domain/seo";
import { emptySearch } from "../domain/search";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PublicLayout } from "../components/layout";
export const Route = createFileRoute("/methodology")({
  head: () => pageHead('How to Compare Logistics Companies', 'Understand how LogisticsWorld helps you compare logistics providers by services, offices, and coverage, and what has been checked.', '/methodology'),
  component: () => (
    <PublicLayout>
      <div className="wrap section editorial">
        <span className="eyebrow">OUR APPROACH</span>
        <h1>
          A useful directory
          <br />
          starts with clear information.
        </h1>
        <p className="intro-text">
          Finding a logistics partner should begin with the facts that matter to
          your business.
        </p>
        <div className="editorial-grid">
          <section>
            <span className="step-number">01</span>
            <h2>What “best” means for your shipment.</h2>
            <p>
              The best logistics company depends on the shipment. Choose a
              service and the countries you need served. All listed providers have an office in Slovenia.
              We do not assign a universal quality ranking. Results match those requirements. In the default order, owner-selected
              priority listings appear first. The remaining results prioritise matching
              names when searching, then alphabetical order. Choosing A–Z sorts every result alphabetically.
            </p>
          </section>
          <section>
            <span className="step-number">02</span>
            <h2>Know what has been checked.</h2>
            <p>
              Each profile explains which details were supplied and which were
              checked against official sources, with a review date. Checking a
              company’s identity or website does not guarantee service quality.
            </p>
          </section>
          <section>
            <span className="step-number">03</span>
            <h2>Paid placement stays visible.</h2>
            <p>
              Future sponsored placements will be labelled and separate from
              organic results. Payment will not create a verification badge or
              an editorial recommendation.
            </p>
          </section>
          <section>
            <span className="step-number">04</span>
            <h2>The connection is yours.</h2>
            <p>
              Contact the company through its own channels. LogisticsWorld does
              not book shipments, calculate freight quotes, or act as an
              intermediary in this release.
            </p>
          </section>
        </div>
        <div className="notice-panel">
          <strong>About this working preview</strong>
          <p>
            Listings combine information supplied to the directory with official website checks.
            Source notes explain any gaps or changes. Inclusion is not an endorsement.
            Confirm services and contact details with the company before arranging a shipment.
          </p>
        </div>
        <Link className="button dark" to="/companies" search={emptySearch}>
          Explore the directory <ArrowUpRight size={17} />
        </Link>
      </div>
    </PublicLayout>
  ),
});
