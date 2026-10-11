import { Link, useBlocker } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Circle, Plus, Save, Trash2 } from "lucide-react";
import {
  blankCompany,
  capabilityOptions,
  companyDraftSchema,
  companyTypes,
  countries,
  publicationIssues,
  services,
  type Company,
  type CountryCode,
  type ServiceId,
} from "../domain/company";
import { decodeDrafts, DRAFT_KEY, nextDraft } from "../domain/drafts";
import { companies } from "../data/companies";
import { Monogram } from "./ui";

const tabs = ["Identity", "Services", "Offices", "Contacts", "Evidence"];
export function CompanyEditor({ id }: { id: string }) {
  const initial =
    companies.find((c) => c.id === id) ??
    blankCompany(id === "new" ? "local-new" : id);
  const [value, setValue] = useState<Company>(structuredClone(initial)),
    [baseline, setBaseline] = useState(JSON.stringify(initial)),
    [version, setVersion] = useState(0),
    [tab, setTab] = useState(0),
    [status, setStatus] = useState(""),
    [errors, setErrors] = useState<string[]>([]),
    [loaded, setLoaded] = useState(false),
    [blocked, setBlocked] = useState(false);
  const dirty = JSON.stringify(value) !== baseline,
    dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  useEffect(() => {
    try {
      const records = decodeDrafts(localStorage.getItem(DRAFT_KEY));
      if (records[id]) {
        setValue(records[id].draft);
        setBaseline(JSON.stringify(records[id].draft));
        setVersion(records[id].version);
      } else if (id !== "new" && !companies.some((c) => c.id === id)) {
        setBlocked(true);
        setErrors([
          "This browser has no saved draft with that ID. Return to the catalog.",
        ]);
      }
    } catch {
      setErrors([
        "Browser storage is unavailable. Drafts cannot be saved here.",
      ]);
    }
    setLoaded(true);
  }, [id]);
  useBlocker({
    shouldBlockFn: () =>
      dirtyRef.current &&
      !window.confirm("Leave this editor and discard unsaved changes?"),
    enableBeforeUnload: dirty,
  });
  const patch = (changes: Partial<Company>) => {
    setValue((v) => ({ ...v, ...changes }));
    setStatus("");
  };
  const input = (
    key:
      | "name"
      | "legalName"
      | "slug"
      | "summary"
      | "description"
      | "website"
      | "email"
      | "phone"
      | "whatsapp"
      | "sourceUrl"
      | "checkedAt",
    label: string,
    placeholder = "",
    area = false,
  ) => (
    <label className="field" key={key}>
      <span>{label}</span>
      {area ? (
        <textarea
          value={value[key]}
          onChange={(e) => patch({ [key]: e.target.value })}
          rows={key === "description" ? 5 : 3}
          maxLength={key === "description" ? 3000 : 260}
        />
      ) : (
        <input
          value={value[key]}
          onChange={(e) => patch({ [key]: e.target.value })}
          placeholder={placeholder}
          type={
            key === "checkedAt" ? "date" : key === "email" ? "email" : "text"
          }
          maxLength={key === "name" ? 100 : key === "legalName" ? 150 : 300}
        />
      )}
    </label>
  );
  const toggleService = (service: ServiceId) => {
    const next = value.services.includes(service)
      ? value.services.filter((s) => s !== service)
      : [...value.services, service];
    patch({
      services: next,
      coverage: next.map(
        (s) =>
          value.coverage.find((c) => c.service === s) ?? {
            service: s,
            countries: [],
          },
      ),
    });
  };
  const save = (publish: boolean) => {
    const parsed = companyDraftSchema.safeParse(value);
    if (!parsed.success) {
      setErrors(
        parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      );
      return;
    }
    if (publish && publicationIssues(value).length) {
      setErrors(publicationIssues(value));
      return;
    }
    try {
      const records = decodeDrafts(localStorage.getItem(DRAFT_KEY));
      const nextValue = {
        ...parsed.data,
        id:
          value.id === "local-new" ? `local-${crypto.randomUUID()}` : value.id,
      };
      const next = nextDraft(
        records[nextValue.id],
        nextValue,
        version,
        publish,
        new Date().toISOString(),
      );
      if (
        Object.values(records).some(
          (r) =>
            r.draft.id !== nextValue.id &&
            r.draft.slug &&
            r.draft.slug === nextValue.slug,
        ) ||
        companies.some(
          (c) => c.id !== nextValue.id && c.slug === nextValue.slug,
        )
      ) {
        throw Error(
          "Another company already uses that profile URL. Choose a different slug.",
        );
      }
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ ...records, [nextValue.id]: next }),
      );
      setValue(nextValue);
      setBaseline(JSON.stringify(nextValue));
      setVersion(next.version);
      dirtyRef.current = false;
      setErrors([]);
      setStatus(
        publish
          ? "Approved snapshot saved in this browser. The public sample catalog is unchanged."
          : "Draft saved in this browser.",
      );
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Could not save this draft.",
      ]);
    }
  };
  const readiness = [
    ["Company identity", !!value.name && !!value.legalName && !!value.slug],
    ["Services and type", value.services.length > 0 && value.types.length > 0],
    ["Primary office", !!value.offices.find((o) => o.primary)?.city],
    ["Contact channel", !!value.website || !!value.phone || !!value.email],
    ["Source and review date", !!value.sourceUrl && !!value.checkedAt],
  ] as const;
  return (
    <>
      <Link className="back-link" to="/admin">
        <ArrowLeft size={15} />
        Company catalog
      </Link>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">COMPANY EDITOR</span>
          <h1>{value.name || "Add a company"}</h1>
          <p>
            {dirty
              ? "Unsaved changes"
              : version
                ? `Saved draft · revision ${version}`
                : "New workspace draft"}{" "}
            · Browser-only demo
          </p>
        </div>
        <div className="editor-actions">
          <button
            className="button outline"
            onClick={() => save(false)}
            disabled={!loaded || blocked}
          >
            <Save size={16} />
            Save draft
          </button>
          <button
            className="button dark"
            onClick={() => save(true)}
            disabled={!loaded || blocked}
          >
            Approve sample <Check size={16} />
          </button>
        </div>
      </div>
      {status && (
        <div className="success-notice" role="status">
          <Check size={18} />
          {status}
        </div>
      )}
      {errors.length > 0 && (
        <div className="error-notice" role="alert">
          <strong>Please check these details</strong>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
          <span>Use the editor sections below to make corrections.</span>
        </div>
      )}
      <div className="editor-layout">
        <div className="editor-panel">
          <div
            className="editor-tabs"
            role="tablist"
            aria-label="Company editor sections"
          >
            {tabs.map((t, i) => (
              <button
                key={t}
                id={`editor-tab-${i}`}
                aria-controls={`editor-panel-${i}`}
                role="tab"
                aria-selected={i === tab}
                tabIndex={i === tab ? 0 : -1}
                onKeyDown={(e) => {
                  const next =
                    e.key === "ArrowRight"
                      ? (i + 1) % tabs.length
                      : e.key === "ArrowLeft"
                        ? (i + tabs.length - 1) % tabs.length
                        : e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? tabs.length - 1
                            : null;
                  if (next !== null) {
                    e.preventDefault();
                    setTab(next);
                    document.getElementById(`editor-tab-${next}`)?.focus();
                  }
                }}
                onClick={() => setTab(i)}
              >
                {i + 1}
                <span>{t}</span>
              </button>
            ))}
          </div>
          <section
            role="tabpanel"
            id={`editor-panel-${tab}`}
            aria-labelledby={`editor-tab-${tab}`}
            className="editor-fields"
          >
            {tab === 0 && (
              <>
                <h2>Make a clear first impression.</h2>
                <p className="muted">
                  Use factual company details. Every entry in this workspace
                  remains a sample.
                </p>
                {input("name", "Trading name", "Company name")}
                {input(
                  "legalName",
                  "Legal company name",
                  "Registered company name",
                )}
                {input("slug", "Profile URL slug", "company-name")}
                {input("summary", "Short summary", "", true)}
                {input("description", "Company overview", "", true)}
                <fieldset>
                  <legend>Company types</legend>
                  <div className="choice-grid">
                    {companyTypes.map((t) => (
                      <label className="check-label" key={t}>
                        <input
                          type="checkbox"
                          checked={value.types.includes(t)}
                          onChange={() =>
                            patch({
                              types: value.types.includes(t)
                                ? value.types.filter((x) => x !== t)
                                : [...value.types, t],
                            })
                          }
                        />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
            {tab === 1 && (
              <>
                <h2>Services & regional coverage</h2>
                <p className="muted">
                  Choose the countries served for each selected service.
                </p>
                {services.map((s) => (
                  <div className="service-editor-row" key={s.id}>
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={value.services.includes(s.id)}
                        onChange={() => toggleService(s.id)}
                      />
                      <strong>{s.name}</strong>
                    </label>
                    {value.services.includes(s.id) && (
                      <div className="coverage-choices">
                        {countries.map((c) => {
                          const selected =
                            value.coverage.find((v) => v.service === s.id)
                              ?.countries ?? [];
                          return (
                            <label className="check-label" key={c.code}>
                              <input
                                type="checkbox"
                                checked={selected.includes(c.code)}
                                onChange={() =>
                                  patch({
                                    coverage: value.coverage.map((v) =>
                                      v.service === s.id
                                        ? {
                                            ...v,
                                            countries: selected.includes(c.code)
                                              ? selected.filter(
                                                  (x) => x !== c.code,
                                                )
                                              : [...selected, c.code],
                                          }
                                        : v,
                                    ),
                                  })
                                }
                              />
                              {c.name}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                <fieldset>
                  <legend>Special capabilities</legend>
                  {capabilityOptions.map((c) => (
                    <label className="check-label" key={c}>
                      <input
                        type="checkbox"
                        checked={value.capabilities.includes(c)}
                        onChange={() =>
                          patch({
                            capabilities: value.capabilities.includes(c)
                              ? value.capabilities.filter((x) => x !== c)
                              : [...value.capabilities, c],
                          })
                        }
                      />
                      {c}
                    </label>
                  ))}
                </fieldset>
              </>
            )}
            {tab === 2 && (
              <>
                <h2>Where is the company based?</h2>
                <p className="muted">
                  Physical offices are separate from countries served.
                </p>
                {value.offices.map((o, i) => (
                  <div className="office-editor" key={i}>
                    <div className="office-editor-heading">
                      <strong>Office {i + 1}</strong>
                      {value.offices.length > 1 && (
                        <button
                          className="icon-button"
                          aria-label={`Remove office ${i + 1}`}
                          onClick={() => {
                            const next = value.offices.filter(
                              (_, j) => j !== i,
                            );
                            if (!next.some((o) => o.primary))
                              next[0] = { ...next[0], primary: true };
                            patch({ offices: next });
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <label className="field">
                      <span>City</span>
                      <input
                        value={o.city}
                        maxLength={80}
                        onChange={(e) =>
                          patch({
                            offices: value.offices.map((v, j) =>
                              j === i ? { ...v, city: e.target.value } : v,
                            ),
                          })
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Country</span>
                      <select
                        value={o.country}
                        onChange={(e) =>
                          patch({
                            offices: value.offices.map((v, j) =>
                              j === i
                                ? {
                                    ...v,
                                    country: e.target.value as CountryCode,
                                  }
                                : v,
                            ),
                          })
                        }
                      >
                        {countries.map((c) => (
                          <option value={c.code} key={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="check-label">
                      <input
                        type="radio"
                        name="primary-office"
                        checked={o.primary}
                        onChange={() =>
                          patch({
                            offices: value.offices.map((v, j) => ({
                              ...v,
                              primary: j === i,
                            })),
                          })
                        }
                      />
                      Primary office
                    </label>
                  </div>
                ))}
                <button
                  className="button outline small"
                  disabled={value.offices.length >= 20}
                  onClick={() =>
                    patch({
                      offices: [
                        ...value.offices,
                        { city: "", country: "SI", primary: false },
                      ],
                    })
                  }
                >
                  <Plus size={16} />
                  Add another office
                </button>
              </>
            )}
            {tab === 3 && (
              <>
                <h2>Make it easy to get in touch.</h2>
                <p className="muted">
                  Use sample contact information. No messages are sent by this
                  editor.
                </p>
                {input("website", "Website", "https://example.com")}
                {input("email", "Public email", "hello@example.com")}
                {input("phone", "Phone", "+38640123456")}
                {input("whatsapp", "WhatsApp (optional)", "+38640123456")}
                <div className="notice-panel">
                  Phone and WhatsApp numbers need an international country code.
                  Only HTTPS website links are accepted.
                </div>
              </>
            )}
            {tab === 4 && (
              <>
                <h2>A source behind the details.</h2>
                <p className="muted">
                  Try the publication checklist with sample evidence. This does
                  not verify a real company.
                </p>
                {input(
                  "sourceUrl",
                  "Evidence source URL",
                  "https://example.com",
                )}
                {input("checkedAt", "Date checked")}
                <div className="notice-panel">
                  Approval creates a separate snapshot in your browser. Later
                  draft edits leave that snapshot unchanged.
                </div>
              </>
            )}
          </section>
        </div>
        <aside className="readiness-panel">
          <span className="eyebrow">PROFILE AT A GLANCE</span>
          <Monogram company={value} />
          <h3>{value.name || "Your company name"}</h3>
          <p>
            {value.summary || "A short, factual introduction will appear here."}
          </p>
          <hr />
          <h3>Before approval</h3>
          <ul>
            {readiness.map(([label, ready]) => (
              <li key={label} className={ready ? "ready" : ""}>
                {ready ? <Check size={16} /> : <Circle size={15} />} {label}
              </li>
            ))}
          </ul>
          <p className="small">
            These are quick readiness indicators. Full field validation runs
            when you approve.
          </p>
          <Link className="text-link" to="/admin">
            Back to catalog
          </Link>
        </aside>
      </div>
    </>
  );
}
