import { emptySearch } from "../domain/search";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import { companies } from "../data/companies";
import { compareIds } from "../domain/search";
import { countryName, serviceName, type Company } from "../domain/company";
import { PublicLayout } from "../components/layout";
import { EmptyState, Monogram } from "../components/ui";
import { useComparison } from "../components/comparison";
export const Route = createFileRoute("/compare")({
  validateSearch: (r: Record<string, unknown>) => ({
    company: compareIds(r.company),
  }),
  head: () => ({
    meta: [{ title: "Compare logistics companies | LogisticsWorld" }],
  }),
  component: Page,
});
const rows: Array<[string, (c: Company) => string]> = [
  ["Company type", (c) => c.types.join(", ")],
  [
    "Offices",
    (c) =>
      c.offices.map((o) => `${o.city}, ${countryName(o.country)}`).join(" · "),
  ],
  ["Services", (c) => c.services.map(serviceName).join(" · ")],
  [
    "Coverage by service",
    (c) =>
      c.coverage
        .map(
          (v) =>
            `${serviceName(v.service)}: ${v.countries.map(countryName).join(", ")}`,
        )
        .join("\n"),
  ],
  ["Special capabilities", (c) => c.capabilities.join(", ") || "Not provided"],
  ["Verification", () => "Sample listing — not verified"],
];
function Page() {
  const { company: ids } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { set } = useComparison();
  const selected = ids
    .map((id) => companies.find((c) => c.id === id))
    .filter((c): c is Company => !!c);
  const remove = (id: string) => {
    const next = ids.filter((v) => v !== id);
    set(next);
    void navigate({ search: { company: next } });
  };
  return (
    <PublicLayout>
      <div className="wrap section">
        <Link className="back-link" to="/companies" search={emptySearch}>
          <ArrowLeft size={15} />
          Back to directory
        </Link>
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR SHORTLIST</span>
            <h1>A clearer comparison.</h1>
            <p className="muted">
              The same questions. Side-by-side answers. Up to three companies.
            </p>
          </div>
        </div>
        {selected.length ? (
          <>
            <p className="mobile-scroll-note">
              Scroll sideways to compare company details →
            </p>
            <div
              className="comparison-scroll"
              tabIndex={0}
              role="region"
              aria-label="Company comparison table"
            >
              <table className="comparison-table">
                <caption className="sr-only">
                  Compare {selected.map((c) => c.name).join(", ")}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Company details</th>
                    {selected.map((c) => (
                      <th scope="col" key={c.id}>
                        <button
                          className="remove-comparison icon-button"
                          onClick={() => remove(c.id)}
                          aria-label={`Remove ${c.name}`}
                        >
                          <X size={16} />
                        </button>
                        <Monogram company={c} />
                        <h2>{c.name}</h2>
                        <span className="sample-label">SAMPLE</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, read]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {selected.map((c) => (
                        <td key={c.id}>{read(c)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">Next step</th>
                    {selected.map((c) => (
                      <td key={c.id}>
                        <Link
                          className="text-link"
                          to="/companies/$slug"
                          params={{ slug: c.slug }}
                        >
                          View company <ArrowUpRight size={15} />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {selected.length < 3 && (
              <Link
                className="button outline"
                to="/companies"
                search={emptySearch}
              >
                Find another company <ArrowUpRight size={16} />
              </Link>
            )}
          </>
        ) : (
          <EmptyState title="Start with a shortlist.">
            <p>Select Compare on a company card to add it here.</p>
            <Link className="button dark" to="/companies" search={emptySearch}>
              Find companies
            </Link>
          </EmptyState>
        )}
      </div>
    </PublicLayout>
  );
}
