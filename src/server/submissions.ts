import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { databaseConfig, databaseRequest, DatabaseError } from "./database";
import { mutationRequest, privateResponse, requireAdmin } from "./session";
import { inboxQuerySchema, inboxSchema, reviewSubmissionSchema, submissionSchema } from "../domain/submissions";

export const getSubmissionAvailability = createServerFn({ method: "GET" }).handler(async () => {
  privateResponse();
  return { available: Boolean(await databaseConfig()) };
});
export const submitCompany = createServerFn({ method: "POST" }).validator(submissionSchema).handler(async ({ data }) => {
  mutationRequest();
  const config = await databaseConfig();
  if (!config) throw Error("Company submissions are temporarily unavailable. Please try again later.");
  try {
    const receipt = await databaseRequest(config, "/rest/v1/rpc/submit_company", undefined, {
      p_id: data.requestId, p_company: data.company, p_website: data.website, p_email: data.email, p_consent: data.consent,
    });
    return z.object({ reference: z.string().uuid() }).parse(receipt);
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "54000") throw Error("The submission limit has been reached. Please try again in 24 hours.");
    if (error instanceof DatabaseError && error.code === "22023") throw Error("Check the details, then start a new request if you changed a previously submitted request.");
    throw Error("We could not confirm your submission. Your details are still here. Retry with the same details to check the saved request.");
  }
});
export const getSubmissionInbox = createServerFn({ method: "GET" }).validator(inboxQuerySchema).handler(async ({ data }) => {
  const session = await requireAdmin();
  return inboxSchema.parse(await databaseRequest(session.config, "/rest/v1/rpc/submission_inbox", session.token, { p_status: data.status, p_page: data.page }));
});
export const reviewSubmission = createServerFn({ method: "POST" }).validator(reviewSubmissionSchema).handler(async ({ data }) => {
  mutationRequest();
  const session = await requireAdmin();
  try {
    await databaseRequest(session.config, "/rest/v1/rpc/review_submission", session.token, {
      p_id: data.id, p_expected_version: data.expectedVersion, p_status: data.status, p_note: data.note,
    });
    return { saved: true };
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "40001") throw Error("This request changed in another session. Reload the inbox before saving.");
    throw Error("Could not save the review. Reload to check the current status and your access.");
  }
});
