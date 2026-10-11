import { describe, it, expect } from "vitest";
import { companies } from "../data/companies";
import { blankCompany } from "./company";
import { decodeDrafts, nextDraft } from "./drafts";
describe("browser-only draft workflow", () => {
  it("allows an incomplete draft but blocks its publication", () => {
    const c = blankCompany("local-test");
    expect(nextDraft(undefined, c, 0, false, "2026-10-11").draft.name).toBe("");
    expect(() => nextDraft(undefined, c, 0, true, "2026-10-11")).toThrow();
  });
  it("keeps the approved snapshot unchanged during edits", () => {
    const c = {
      ...companies[0],
      sourceUrl: "https://example.com",
      checkedAt: "2026-10-11",
    };
    const published = nextDraft(undefined, c, 0, true, "2026-10-11");
    const draft = nextDraft(
      published,
      { ...c, name: "Edited sample" },
      1,
      false,
      "2026-10-11",
    );
    expect(draft.published?.name).toBe(c.name);
    expect(draft.draft.name).toBe("Edited sample");
  });
  it("rejects stale versions and invalid stored data", () => {
    const first = nextDraft(undefined, companies[0], 0, false, "2026-10-11");
    expect(() =>
      nextDraft(first, companies[0], 0, false, "2026-10-11"),
    ).toThrow("another tab");
    expect(decodeDrafts("{bad")).toEqual({});
    expect(decodeDrafts('{"x":{"draft":{"isSample":false}}}')).toEqual({});
  });
});
