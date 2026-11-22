import { z } from "zod";
import { safeContactHref } from "./company";

export const submissionSchema = z.object({
  requestId: z.string().uuid(),
  company: z.string().trim().min(3, "Enter the company name.").max(100).regex(/^[^\u0000-\u001f\u007f]+$/, "Use a single line for the company name."),
  website: z.string().trim().min(1).max(300).refine(value => safeContactHref("website", value) !== null && !/\s/.test(value), "Use a complete https:// website address."),
  email: z.string().trim().email("Enter a valid email address.").max(150).transform(value => value.toLowerCase()),
  consent: z.literal(true, { errorMap: () => ({ message: "Confirm that we may use these details to review your request." }) }),
  contactFax: z.string().max(0, "Could not submit this request. Please reload and try again."),
}).strict();
export const submissionStatuses = ["pending", "reviewed", "rejected"] as const;
export const inboxQuerySchema = z.object({ status: z.enum(["all", ...submissionStatuses]), page: z.number().int().min(1).max(10000) });
export const reviewSubmissionSchema = z.object({ id: z.string().uuid(), expectedVersion: z.number().int().min(1), status: z.enum(submissionStatuses), note: z.string().trim().max(1000) });
export const submissionEntrySchema = z.object({
  id: z.string().uuid(), company: z.string(), website: z.string(), email: z.string(),
  status: z.enum(submissionStatuses), note: z.string(), version: z.number().int().min(1),
  createdAt: z.string(), reviewedAt: z.string().nullable(),
});
export const inboxSchema = z.object({ submissions: z.array(submissionEntrySchema), total: z.number().int(), page: z.number().int(), pages: z.number().int() });
export type SubmissionEntry = z.infer<typeof submissionEntrySchema>;
export type SubmissionInbox = z.infer<typeof inboxSchema>;
