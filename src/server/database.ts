// Used only by server-function handlers. Keep their imports static so the bundler
// sees both read and write calls and preserves the optional POST body.
export type DatabaseConfig = { url: string; key: string };
export async function databaseConfig(): Promise<DatabaseConfig | null> {
  let bindings: Record<string, unknown> = {};
  try { bindings = (await import("cloudflare:workers")).env as unknown as Record<string, unknown>; }
  catch { /* The Node smoke build uses process.env. */ }
  const url = bindings.CATALOG_SUPABASE_URL ?? process.env.CATALOG_SUPABASE_URL;
  const key = bindings.CATALOG_SUPABASE_PUBLISHABLE_KEY ?? process.env.CATALOG_SUPABASE_PUBLISHABLE_KEY;
  if (!url && !key) return null;
  if (typeof url !== "string" || typeof key !== "string" || !key || !/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url)) {
    throw Error("The company database configuration is incomplete.");
  }
  // Explicitly reject legacy elevated keys and modern secret keys.
  if (key.startsWith("sb_secret_") || (!key.startsWith("sb_publishable_") && !isAnonKey(key))) {
    throw Error("Use a publishable database key; privileged keys are not supported.");
  }
  return { url, key };
}
function isAnonKey(key: string) {
  try { return JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role === "anon"; }
  catch { return false; }
}
export class DatabaseError extends Error {
  constructor(public status: number, public code: string) { super("The company database could not complete this request."); }
}
export async function databaseRequest<T>(config: DatabaseConfig, path: string, token?: string, body?: unknown): Promise<T> {
  const response = await fetch(`${config.url}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { apikey: config.key, ...(token || config.key.startsWith("eyJ") ? { Authorization: `Bearer ${token ?? config.key}` } : {}), ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as { code?: string };
    throw new DatabaseError(response.status, error.code ?? "unknown");
  }
  return (response.status === 204 ? null : await response.json()) as T;
}
export function catalogError(error: unknown): never {
  if (error instanceof DatabaseError) {
    if (error.code === "40001") throw Error("This company changed in another session. Reload before saving.");
    if (error.code === "23505") throw Error("Another company already uses that profile URL. Choose another slug.");
    if (error.status === 401 || error.status === 403 || error.code === "42501") throw Error("Your session or editing permission has expired. Sign in again.");
    if (error.code === "22023") throw Error("The company is not ready to publish. Check its identity, contacts, offices and source date.");
  }
  throw Error("Could not save this change. Your edits are still in the editor; retry or reload to check the saved version.");
}
