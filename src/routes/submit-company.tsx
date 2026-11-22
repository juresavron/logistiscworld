import { emptySearch } from "../domain/search";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { PublicLayout } from "../components/layout";
import { submissionSchema } from "../domain/submissions";
import { getSubmissionAvailability, submitCompany } from "../server/submissions";
export const Route = createFileRoute("/submit-company")({ loader: () => getSubmissionAvailability(), staleTime: 0, component: Page });
function Page() {
  const { available } = Route.useLoaderData();
  const requestId = useRef("");
  const [reference, setReference] = useState(""), [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <PublicLayout>
      <div className="wrap section submission-layout">
        <div>
          <span className="eyebrow">BE PART OF THE DIRECTORY</span>
          <h1>
            Make your expertise
            <br />
            easier to find.
          </h1>
          <p className="intro-text">
            A clear company profile helps businesses understand what you do,
            where you operate, and how to reach you.
          </p>
          <ol className="steps">
            <li>
              <span>01</span>
              <div>
                <h3>Share the essentials</h3>
                <p>Start with your company name and website.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Review the details</h3>
                <p>Our editors review each request before publication.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Get discovered</h3>
                <p>
                  Connect directly with businesses looking for your services.
                </p>
              </div>
            </li>
          </ol>
        </div>
        <div className="form-panel">
          {reference ? (
            <div role="status">
              <span className="success-icon">
                <Check />
              </span>
              <h2>Request received.</h2>
              <p>
                Your company request is saved for editorial review. Your email stays private, and a listing becomes public only after approval.
              </p>
              <p className="submission-reference">Reference: {reference}</p>
              <button
                className="button outline"
                onClick={() => { setReference(""); requestId.current = ""; }}
              >
                Submit another company
              </button>
            </div>
          ) : !available ? <div role="status"><h2>Company submissions will open soon.</h2><p>Please check back later. The directory is available to browse.</p></div> : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (busy) return;
                const data = Object.fromEntries(new FormData(e.currentTarget));
                const id = requestId.current || crypto.randomUUID();
                requestId.current = id; setBusy(true); setError("");
                try {
                  const input = submissionSchema.safeParse({ ...data, requestId: id, consent: data.consent === "on" });
                  if (!input.success) throw Error(input.error.issues[0].message);
                  const result = await submitCompany({ data: input.data });
                  setReference(result.reference);
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Could not confirm the request. Please retry.",
                  );
                } finally { setBusy(false); }
              }}
            >
              <span className="eyebrow">SUBMIT YOUR COMPANY</span>
              <h2>Tell us about your company.</h2>
              <div className="notice-panel small-notice">
                Requests are reviewed before a company is added. Submitting does not publish a listing.
              </div>
              <label className="field">
                <span>Company name</span>
                <input
                  name="company"
                  required
                  minLength={3}
                  maxLength={100}
                  placeholder="Your company name"
                />
              </label>
              <div className="submission-trap" aria-hidden="true">
                <label>Leave this field empty<input name="contactFax" autoComplete="off" tabIndex={-1} maxLength={0} /></label>
              </div>
              <label className="field">
                <span>Company website</span>
                <input
                  name="website"
                  required
                  type="url"
                  maxLength={300}
                  placeholder="https://example.com"
                />
              </label>
              <label className="field">
                <span>Your email</span>
                <input
                  name="email"
                  required
                  type="email"
                  maxLength={150}
                  placeholder="you@example.com"
                />
              </label>
              <label className="submission-consent">
                <input name="consent" type="checkbox" required />
                <span>I am authorized to submit these company details. LogisticsWorld may store them and use my email to review this request. My email will not be published.</span>
              </label>
              {error && (
                <p role="alert" className="field-error">
                  {error}
                </p>
              )}
              <button className="button orange" type="submit" disabled={busy}>
                {busy ? "Submitting…" : "Submit for review"}
              </button>
              <p className="form-note">
                Keep the reference shown after submission. No confirmation email is sent.
              </p>
            </form>
          )}
          <Link className="text-link" to="/companies" search={emptySearch}>
            Return to the directory
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
