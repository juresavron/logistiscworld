import { getCookie, setCookie, deleteCookie, getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { databaseConfig, databaseRequest, type DatabaseConfig } from "./database";
import { assertSameOrigin } from "../domain/catalog";

const cookieName = "lw-admin-session";
export function privateResponse() {
  setResponseHeader("Cache-Control", "private, no-store");
  setResponseHeader("Vary", "Cookie");
  setResponseHeader("X-Robots-Tag", "noindex, nofollow");
}
export function mutationRequest() { privateResponse(); assertSameOrigin(getRequest()); }
export async function sessionFor(config: DatabaseConfig, token: string) {
  // Validate with Auth on every request. Cookie contents and user_metadata never authorize access.
  const user = await databaseRequest<{ id: string; email?: string }>(config, "/auth/v1/user", token);
  const memberships = await databaseRequest<{ role: "editor" | "administrator" }[]>(config,
    `/rest/v1/admin_memberships?select=role&user_id=eq.${encodeURIComponent(user.id)}&active=eq.true`, token);
  const role = memberships[0]?.role;
  if (role !== "editor" && role !== "administrator") throw Error("Editing permission is required.");
  return { config, token, user: { email: user.email ?? "Administrator", role } };
}
export async function currentSession() {
  privateResponse();
  const config = await databaseConfig();
  if (!config) return { configured: false as const, session: null };
  const token = getCookie(cookieName);
  if (!token) return { configured: true as const, session: null };
  try { return { configured: true as const, session: await sessionFor(config, token) }; }
  catch { return { configured: true as const, session: null }; }
}
export async function requireAdmin() {
  const { session } = await currentSession();
  if (!session) throw Error("Sign in with an authorized editor account.");
  return session;
}
export function saveSession(token: string, expiresIn: number) {
  // Access token only: no refresh token in the browser, no indefinitely renewed sessions.
  setCookie(cookieName, token, { httpOnly: true, secure: new URL(getRequest().url).protocol === "https:", sameSite: "strict", path: "/", maxAge: Math.min(3600, expiresIn) });
}
export function clearSession() { deleteCookie(cookieName, { path: "/" }); }
