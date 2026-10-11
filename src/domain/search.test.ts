import { describe, it, expect } from "vitest";
import { companies } from "../data/companies";
import { compareIds, normalizeSearch, searchCompanies } from "./search";
import { companySchema, safeContactHref } from "./company";

describe("catalog boundaries", () => {
  it("has structurally valid, explicitly fictional records", () => {
    for (const c of companies)
      expect(companySchema.safeParse(c).success).toBe(true);
  });
  it("distinguishes office country from country served", () => {
    expect(
      searchCompanies(companies, { office: "AT" }, 50).companies.every((c) =>
        c.offices.some((o) => o.country === "AT"),
      ),
    ).toBe(true);
    expect(
      searchCompanies(companies, { coverage: "AT" }, 50).companies.some(
        (c) => c.offices[0].country === "SI",
      ),
    ).toBe(true);
  });
  it("does not match road coverage to an unrelated customs service", () => {
    const company = companies[0];
    expect(
      searchCompanies([company], { services: ["customs"], coverage: "IT" })
        .total,
    ).toBe(0);
    expect(
      searchCompanies([company], { services: ["road"], coverage: "IT" }).total,
    ).toBe(1);
  });
  it("handles accent-insensitive search and multiple capability requirements", () => {
    expect(searchCompanies(companies, { q: "sezana" }).companies[0].name).toBe(
      "Karst Customs",
    );
    expect(
      searchCompanies(companies, {
        capabilities: ["Refrigerated cargo", "Dangerous goods"],
      }).total,
    ).toBe(0);
  });
  it("bounds invalid URL input and clamps empty pages", () => {
    expect(
      normalizeSearch({
        q: { bad: 1 },
        office: "ZZ",
        services: ["road", "road", "hack"],
        page: -1,
      }),
    ).toMatchObject({ q: "", office: "", services: ["road"], page: 1 });
    const result = searchCompanies(companies, { page: 999 });
    expect(result.page).toBe(result.pages);
    expect(result.companies.length).toBeGreaterThan(0);
  });
  it("deduplicates comparison IDs and caps at three", () => {
    expect(
      compareIds([
        "sample-01",
        "sample-01",
        "bad",
        "sample-02",
        "sample-03",
        "sample-04",
      ]),
    ).toEqual(["sample-01", "sample-02", "sample-03"]);
  });
});
describe("contact destinations", () => {
  it("rejects scripts, credentials and injected headers", () => {
    expect(safeContactHref("website", "javascript:alert(1)")).toBeNull();
    expect(
      safeContactHref("website", "https://user:password@example.com"),
    ).toBeNull();
    expect(
      safeContactHref("email", "a@example.com?bcc=someone@example.com"),
    ).toBeNull();
    expect(safeContactHref("phone", "123")).toBeNull();
  });
  it("constructs only explicit supported channels", () => {
    expect(safeContactHref("website", "https://example.com")).toBe(
      "https://example.com/",
    );
    expect(safeContactHref("email", "hello@example.com")).toBe(
      "mailto:hello@example.com",
    );
    expect(safeContactHref("phone", "+38640123456")).toBe("tel:+38640123456");
    expect(safeContactHref("whatsapp", "+38640123456")).toBe(
      "https://wa.me/38640123456",
    );
  });
});
