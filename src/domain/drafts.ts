import { z } from "zod";
import {
  companyDraftSchema,
  companySchema,
  publicationIssues,
  type Company,
} from "./company";
export const draftRecordSchema = z.object({
  draft: companyDraftSchema,
  published: companySchema.nullable(),
  version: z.number().int().min(1),
  savedAt: z.string(),
});
export type DraftRecord = z.infer<typeof draftRecordSchema>;
export const DRAFT_KEY = "logisticsworld:demo-drafts:v1";
export function decodeDrafts(
  value: string | null,
): Record<string, DraftRecord> {
  if (!value) return {};
  try {
    const parsed = z.record(draftRecordSchema).safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}
export function nextDraft(
  previous: DraftRecord | undefined,
  draft: Company,
  expectedVersion: number,
  publish: boolean,
  now: string,
): DraftRecord {
  if ((previous?.version ?? 0) !== expectedVersion)
    throw Error(
      "This draft changed in another tab. Reload before saving to avoid overwriting it.",
    );
  const parsed = companyDraftSchema.parse(draft);
  if (publish) {
    const issues = publicationIssues(draft);
    if (issues.length) throw Error(issues.join(" "));
  }
  return {
    draft: structuredClone(parsed),
    published: publish
      ? structuredClone(companySchema.parse(draft))
      : (previous?.published ?? null),
    version: expectedVersion + 1,
    savedAt: now,
  };
}
