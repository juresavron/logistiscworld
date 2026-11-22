import { describe, expect, it } from "vitest";
import { submissionSchema, reviewSubmissionSchema } from "./submissions";
const input = { requestId: "44444444-4444-4444-8444-444444444444", company: "Example Logistics", website: "https://example.com/", email: "CONTACT@example.com", consent: true, contactFax: "" };
describe("private company submissions", () => {
  it("normalizes the private contact and requires explicit consent", () => {
    expect(submissionSchema.parse(input).email).toBe("contact@example.com");
    expect(submissionSchema.safeParse({ ...input, consent: false }).success).toBe(false);
  });
  it("rejects injected publication fields, traps, oversized fields and unsafe links", () => {
    for (const change of [{ status: "reviewed" }, { contactFax: "spam" }, { company: "a".repeat(101) }, { company: "Example\nLogistics" }, { website: "javascript:alert(1)" }, { website: "https://user:password@example.com" }, { website: "https://example.com/hello world" }]) {
      expect(submissionSchema.safeParse({ ...input, ...change }).success).toBe(false);
    }
  });
  it("limits review statuses and requires a current version", () => {
    expect(reviewSubmissionSchema.safeParse({ id: input.requestId, expectedVersion: 0, status: "published", note: "" }).success).toBe(false);
  });
});
