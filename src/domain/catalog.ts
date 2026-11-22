import { z } from "zod";
import { companyDraftSchema, companySchema, publicationIssues, type Company } from "./company";

export const catalogEntrySchema = z.object({
  draft: companyDraftSchema,
  published: companySchema.nullable(),
  version: z.number().int().min(1),
  savedAt: z.string(),
  archived: z.boolean(),
});
export type CatalogEntry = z.infer<typeof catalogEntrySchema>;
export type AdminSession = { configured: boolean; user: { email: string; role: "editor" | "administrator" } | null };
export const saveCatalogSchema = z.object({
  draft: companyDraftSchema,
  expectedVersion: z.number().int().min(0),
  publish: z.boolean(),
});
export const archiveCatalogSchema = z.object({ id: z.string().min(1).max(80), expectedVersion: z.number().int().min(1) });

export function validatePublication(value: Company) {
  const issues = publicationIssues(value);
  if (value.isSample) issues.push("Confirm this is a real company before publishing.");
  if (!value.offices.some(office => office.country === "SI")) issues.push("Add a Slovenian office.");
  if (value.checkedAt > new Date().toISOString().slice(0, 10)) issues.push("The review date cannot be in the future.");
  if (issues.length) throw Error(issues.join(" "));
  return companySchema.parse(value);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw Error("Open the editor on this website before making changes.");
  }
}
