import { describe, expect, it, vi } from "vitest";
import { handleQuoteReferral } from "./referrals";

describe("Mediašped quote handoffs", () => {
  it("opens only the fixed quote page and preserves the known source", () => {
    const writeDataPoint = vi.fn();
    const response = handleQuoteReferral(new Request("https://logisticsworld.eu/go/mediasped?placement=blog&content=shipping-through-koper&url=https://attacker.test&email=private@example.test"), { writeDataPoint });
    expect(response.status).toBe(302);
    const destination = new URL(response.headers.get("location")!);
    expect(destination.origin + destination.pathname).toBe("https://mediasped.com/en/request-quote/");
    expect(destination.searchParams.get("utm_source")).toBe("logisticsworld.eu");
    expect(destination.searchParams.get("utm_content")).toBe("blog:shipping-through-koper");
    expect([...destination.searchParams.keys()].every(key => key.startsWith("utm_"))).toBe(true);
    expect(writeDataPoint.mock.calls[0][0]).toEqual({ indexes: ["mediasped"], blobs: ["quote_handoff", "blog", "shipping-through-koper"], doubles: [1] });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it("rejects unknown placements and source values without recording them", () => {
    const writeDataPoint = vi.fn();
    for (const query of ["placement=__proto__&content=mediasped", "placement=blog&content=private@example.test", "placement=service&content=unpublished-service"]) {
      expect(handleQuoteReferral(new Request(`https://example.test/go/mediasped?${query}`), { writeDataPoint }).status).toBe(400);
    }
    expect(writeDataPoint).not.toHaveBeenCalled();
  });
  it("does not count HEAD requests, prefetches or unsupported methods", () => {
    const writeDataPoint = vi.fn(), analytics = { writeDataPoint }, url = "https://example.test/go/mediasped";
    expect(handleQuoteReferral(new Request(url, { method: "HEAD" }), analytics).status).toBe(302);
    expect(handleQuoteReferral(new Request(url, { headers: { "Sec-Purpose": "prefetch" } }), analytics).status).toBe(302);
    expect(handleQuoteReferral(new Request(url, { method: "POST" }), analytics).status).toBe(405);
    expect(writeDataPoint).not.toHaveBeenCalled();
  });
  it("keeps the company reachable when analytics fails", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      expect(handleQuoteReferral(new Request("https://example.test/go/mediasped"), { writeDataPoint() { throw new Error("unavailable"); } }).status).toBe(302);
      expect(handleQuoteReferral(new Request("https://example.test/go/mediasped")).status).toBe(302);
    } finally { warn.mockRestore(); }
  });
  it("separates verification traffic from visitor handoffs", () => {
    const writeDataPoint = vi.fn();
    handleQuoteReferral(new Request("https://example.test/go/mediasped?placement=verification&content=qa"), { writeDataPoint });
    expect(writeDataPoint.mock.calls[0][0].blobs[0]).toBe("verification");
  });
});
