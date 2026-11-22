import { describe, expect, it } from "vitest";
import { assertSameOrigin, validatePublication } from "./catalog";
import { companies } from "../data/slovenia";

describe("catalog publication", () => {
  it("accepts the sourced launch catalog", () => {
    for (const company of companies) expect(validatePublication(company).id).toBe(company.id);
  });
  it("rejects fictional, foreign and future-dated publications", () => {
    expect(() => validatePublication({ ...companies[0], isSample: true })).toThrow("real company");
    expect(() => validatePublication({ ...companies[0], offices: [{ city: "Rome", country: "IT", primary: true }] })).toThrow("Slovenian office");
    expect(() => validatePublication({ ...companies[0], checkedAt: "2099-01-01" })).toThrow("future");
  });
  it("requires a same-origin write request", () => {
    expect(() => assertSameOrigin(new Request("https://logisticsworld.eu/admin", { headers: { origin: "https://logisticsworld.eu" } }))).not.toThrow();
    for (const origin of ["https://other.test", "null", ""]) expect(() => assertSameOrigin(new Request("https://logisticsworld.eu/admin", { headers: { origin } }))).toThrow();
    expect(() => assertSameOrigin(new Request("https://logisticsworld.eu/admin", { headers: { origin: "https://logisticsworld.eu", "sec-fetch-site": "cross-site" } }))).toThrow();
  });
});
