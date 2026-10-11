import { emptySearch } from "../domain/search";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PublicLayout } from "../components/layout";
export const Route = createFileRoute("/methodology")({
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
            <h2>Relevance comes first.</h2>
            <p>
              Choose a service, office location, and the country you need
              served. Results match those requirements. Relevant-first sorting
              prioritizes matching company names when you search; otherwise
              results are alphabetical.
            </p>
          </section>
          <section>
            <span className="step-number">02</span>
            <h2>Know what has been checked.</h2>
            <p>
              Live profiles will distinguish company statements from details
              checked against a source, including the review date. Checking a
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
            All company records are fictional. There are no verified businesses,
            live reviews, paid placements, or visitor-tracking systems connected
            yet.
          </p>
        </div>
        <Link className="button dark" to="/companies" search={emptySearch}>
          Explore the directory <ArrowUpRight size={17} />
        </Link>
      </div>
    </PublicLayout>
  ),
});
