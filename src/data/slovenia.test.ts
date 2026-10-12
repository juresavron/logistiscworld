import { describe, expect, it } from "vitest";
import { companies, searchSloveniaCompanies } from "./slovenia";
import { companyDraftSchema, companySchema } from "../domain/company";

describe("real Slovenian directory", () => {
  it("contains all 25 real listings with unique identities and usable contacts", () => {
    expect(companies).toHaveLength(25);
    expect(new Set(companies.map(c => c.id)).size).toBe(25);
    expect(new Set(companies.map(c => c.slug)).size).toBe(25);
    for (const c of companies) {
      expect(companySchema.safeParse(c).success).toBe(true);
      expect(c.isSample).toBe(false);
      expect(c.website || c.email || c.phone).toBeTruthy();
      expect(c.offices.some(o => o.country === "SI")).toBe(true);
      expect(c.sourceUrl).toBeTruthy();
    }
  });
  it("features Mediašped first without bypassing filters or explicit alphabetical sort", () => {
    expect(searchSloveniaCompanies({}).companies[0].slug).toBe("mediasped");
    expect(searchSloveniaCompanies({ q: "Koper" }).companies[0].slug).toBe("mediasped");
    expect(searchSloveniaCompanies({ q: "Cargomind" }).companies.map(c => c.slug)).toEqual(["cargomind"]);
    expect(searchSloveniaCompanies({ coverage: "HR" }).companies.map(c => c.slug)).toEqual(["starin-transport"]);
    expect(searchSloveniaCompanies({ sort: "name" }).companies[0].slug).toBe("2hm-logistics");
  });
  it("keeps all listings reachable through pagination", () => {
    const first = searchSloveniaCompanies({});
    const ids = Array.from({ length: first.pages }, (_, i) => searchSloveniaCompanies({ page: i + 1 }).companies).flat().map(c => c.id);
    expect(new Set(ids).size).toBe(25);
    expect(ids).toHaveLength(25);
  });
  it("keeps both branch offices and their contacts when saved as a local draft", () => {
    for (const slug of ["spedicija-stori", "gebrueder-weiss"]) {
      const company = companies.find(c => c.slug === slug)!;
      expect(company.offices).toHaveLength(2);
      const draft = companyDraftSchema.parse(company);
      expect(draft.offices).toEqual(company.offices);
      expect(draft.isSample).toBe(false);
    }
  });
  it("finds accented company names and street addresses", () => {
    expect(searchSloveniaCompanies({ q: "mediasped" }).companies[0].slug).toBe("mediasped");
    expect(searchSloveniaCompanies({ q: "Studljanska" }).companies[0].slug).toBe("starin-transport");
  });
});
