import { safeContactHref } from "../domain/company";
import { emptySearch } from "../domain/search";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { PublicLayout } from "../components/layout";
export const Route = createFileRoute("/submit-company")({ component: Page });
function Page() {
  const [saved, setSaved] = useState(false),
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
                <p>Live submissions will be reviewed before publication.</p>
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
          {saved ? (
            <div role="status">
              <span className="success-icon">
                <Check />
              </span>
              <h2>Sample request saved.</h2>
              <p>
                Saved in this browser only. Nothing was sent to an administrator
                or published.
              </p>
              <button
                className="button outline"
                onClick={() => setSaved(false)}
              >
                Try another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                try {
                  if (!safeContactHref("website", String(data.website)))
                    throw Error("Use an https:// website address.");
                  localStorage.setItem(
                    "logisticsworld:sample-submission:v1",
                    JSON.stringify({
                      ...data,
                      createdAt: new Date().toISOString(),
                    }),
                  );
                  setSaved(true);
                  setError("");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "This browser could not save the request.",
                  );
                }
              }}
            >
              <span className="eyebrow">TRY THE SUBMISSION FLOW</span>
              <h2>Tell us about your company.</h2>
              <div className="notice-panel small-notice">
                Demo only. Use sample information; this request stays in your
                browser.
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
              {error && (
                <p role="alert" className="field-error">
                  {error}
                </p>
              )}
              <button className="button orange" type="submit">
                Save sample request <ArrowRight size={17} />
              </button>
              <p className="form-note">
                No email is sent and no listing is created.
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
