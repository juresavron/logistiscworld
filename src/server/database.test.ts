import { afterEach, describe, expect, it, vi } from "vitest";
import { catalogError, databaseConfig, databaseRequest, DatabaseError } from "./database";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("database boundary", () => {
  it("only uses a static preview when no database is configured", async () => {
    vi.stubEnv("CATALOG_SUPABASE_URL", ""); vi.stubEnv("CATALOG_SUPABASE_PUBLISHABLE_KEY", "");
    expect(await databaseConfig()).toBeNull();
    vi.stubEnv("CATALOG_SUPABASE_URL", "https://catalog.supabase.co");
    await expect(databaseConfig()).rejects.toThrow("incomplete");
  });
  it("rejects elevated keys and arbitrary database origins", async () => {
    vi.stubEnv("CATALOG_SUPABASE_URL", "https://catalog.supabase.co");
    vi.stubEnv("CATALOG_SUPABASE_PUBLISHABLE_KEY", "sb_secret_not-a-real-key");
    await expect(databaseConfig()).rejects.toThrow("privileged");
    vi.stubEnv("CATALOG_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    vi.stubEnv("CATALOG_SUPABASE_URL", "https://other.test");
    await expect(databaseConfig()).rejects.toThrow("incomplete");
  });
  it("uses the user's bearer token and does not cache authenticated responses", async () => {
    const request = vi.fn().mockResolvedValue(new Response(JSON.stringify([])));
    vi.stubGlobal("fetch", request);
    await databaseRequest({ url: "https://catalog.supabase.co", key: "sb_publishable_test" }, "/rest/v1/admin_memberships", "user-token");
    expect(request.mock.calls[0][1]).toMatchObject({ cache: "no-store", headers: { Authorization: "Bearer user-token", apikey: "sb_publishable_test" } });
  });
  it("reports concurrency conflicts without revealing database errors", () => {
    expect(() => catalogError(new DatabaseError(400, "40001"))).toThrow("another session");
    expect(() => catalogError(new DatabaseError(409, "23505"))).toThrow("profile URL");
    expect(() => catalogError(Error("private SQL contents"))).toThrow("Your edits are still");
  });
});
