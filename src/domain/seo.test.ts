import { describe, expect, it } from "vitest";
import { robotsDirective, xmlEscape, jsonLd } from "./seo";
import { officeMatchesCity } from "./search";
describe("public search eligibility", () => {
  it("allows canonical landing pages only when indexing is enabled", () => {
    for (const path of ["/", "/locations/koper", "/locations/ljubljana", "/services/customs/koper", "/companies/mediasped", "/blog/container-shipping-china-to-koper"]) {
      expect(robotsDirective(true,path,{})).toBe("index, follow");
      expect(robotsDirective(false,path,{})).toContain("noindex");
      expect(robotsDirective(true,path,{},false)).toContain("noindex");
    }
  });
  it("excludes private operations, unknown pages and filtered results", () => {
    for (const path of ["/admin", "/admin/submissions", "/submit-company", "/compare", "/go/mediasped", "/locations/maribor"]) expect(robotsDirective(true,path,{})).toContain("noindex");
    for (const search of [{q:"Koper"},{city:"Koper"},{services:["sea"]},{coverage:"HR"},{type:"Carrier"},{capabilities:["Refrigerated cargo"]},{sort:"name"},{page:2}]) expect(robotsDirective(true,"/companies",search)).toContain("noindex");
    expect(robotsDirective(true,"/companies",{q:"",city:"",services:[],office:"SI",page:1,sort:"relevance"})).toBe("index, follow");
  });
  it("does not turn a served city or a foreign office into a local office", () => {
    expect(officeMatchesCity({city:"Ljubljana–Črnuče",country:"SI"},"Ljubljana")).toBe(true);
    expect(officeMatchesCity({city:"Ljubljana–Šentvid",country:"SI"},"ljubljana")).toBe(true);
    expect(officeMatchesCity({city:"Brnik",country:"SI"},"Ljubljana")).toBe(false);
    expect(officeMatchesCity({city:"Koper",country:"IT"},"Koper")).toBe(false);
  });
  it("escapes sitemap and structured-data output", () => {
    expect(xmlEscape("a&b<c>\"'")).toBe("a&amp;b&lt;c&gt;&quot;&apos;");
    expect(jsonLd({name:"</script>"})).not.toContain("<");
  });
});
