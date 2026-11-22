import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { currentSession, mutationRequest, sessionFor, saveSession, clearSession, requireAdmin } from "./session";
import { databaseConfig, databaseRequest, catalogError } from "./database";
import { archiveCatalogSchema, catalogEntrySchema, saveCatalogSchema, validatePublication, type AdminSession } from "../domain/catalog";

export const getAdminSession = createServerFn({ method: "GET" }).handler(async (): Promise<AdminSession> => {
  const { configured, session } = await currentSession();
  return { configured, user: session?.user ?? null };
});
export const signIn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) }))
  .handler(async ({ data }) => {

    mutationRequest();
    const config = await databaseConfig();
    if (!config) throw Error("Administration is awaiting its database setup.");
    try {
      const result = await databaseRequest<{ access_token: string; expires_in: number }>(config, "/auth/v1/token?grant_type=password", undefined, data);
      const session = await sessionFor(config, result.access_token);
      saveSession(result.access_token, result.expires_in);
      return session.user;
    } catch { throw Error("Sign-in failed. Check your details and administrator access."); }
  });
export const signOut = createServerFn({ method: "POST" }).handler(async () => {

  mutationRequest();
  const { session } = await currentSession();
  clearSession();
  if (session) await databaseRequest(session.config, "/auth/v1/logout?scope=local", session.token, {}).catch(() => undefined);
  return { signedOut: true };
});
export const getAdminCatalog = createServerFn({ method: "GET" }).handler(async () => {

  const session = await requireAdmin();
  const records = await databaseRequest<unknown>(session.config, "/rest/v1/rpc/admin_catalog", session.token, {});
  return z.array(catalogEntrySchema).parse(records);
});
export const saveCompany = createServerFn({ method: "POST" }).validator(saveCatalogSchema).handler(async ({ data }) => {

  mutationRequest();
  const session = await requireAdmin();
  if (data.publish) {
    if (session.user.role !== "administrator") throw Error("Only an administrator can publish a company.");
    validatePublication(data.draft);
  }
  try {
    const result = await databaseRequest(session.config, "/rest/v1/rpc/save_company", session.token, {
      p_draft: data.draft, p_expected_version: data.expectedVersion, p_publish: data.publish,
    });
    return catalogEntrySchema.parse(result);
  } catch (error) { return catalogError(error); }
});
export const archiveCompany = createServerFn({ method: "POST" }).validator(archiveCatalogSchema).handler(async ({ data }) => {

  mutationRequest();
  const session = await requireAdmin();
  if (session.user.role !== "administrator") throw Error("Only an administrator can archive a company.");
  try {
    await databaseRequest(session.config, "/rest/v1/rpc/archive_company", session.token, { p_id: data.id, p_expected_version: data.expectedVersion });
    return { archived: true };
  } catch (error) { return catalogError(error); }
});
