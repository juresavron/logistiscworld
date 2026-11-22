import { afterEach, describe, expect, it, vi } from "vitest";
const response = vi.hoisted(() => ({ getCookie: vi.fn(), setCookie: vi.fn(), deleteCookie: vi.fn(), getRequest: vi.fn(), setResponseHeader: vi.fn() }));
vi.mock("@tanstack/react-start/server", () => response);
import { currentSession, requireAdmin, saveSession, sessionFor } from "./session";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetAllMocks(); });
describe("editor sessions", () => {
  const config = { url: "https://catalog.supabase.co", key: "sb_publishable_test" };
  it("requires active database membership even when user metadata claims administrator", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "user-id", email: "editor@example.test", user_metadata: { role: "administrator" } })))
      .mockResolvedValueOnce(new Response(JSON.stringify([]))));
    await expect(sessionFor(config, "token")).rejects.toThrow("permission");
  });
  it("uses the current active membership rather than a role cached in a token", async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "user-id", email: "editor@example.test" })))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ role: "editor" }])));
    vi.stubGlobal("fetch", fetch);
    expect((await sessionFor(config, "token")).user.role).toBe("editor");
    expect(fetch.mock.calls[1][0]).toContain("active=eq.true");
  });
  it("fails closed when Auth cannot validate a cookie", async () => {
    vi.stubEnv("CATALOG_SUPABASE_URL", config.url); vi.stubEnv("CATALOG_SUPABASE_PUBLISHABLE_KEY", config.key);
    response.getCookie.mockReturnValue("forged-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 401 })));
    expect(await currentSession()).toEqual({ configured: true, session: null });
    await expect(requireAdmin()).rejects.toThrow("Sign in");
    expect(response.setResponseHeader).toHaveBeenCalledWith("Cache-Control", "private, no-store");
  });
  it("stores only a short HttpOnly secure session cookie", () => {
    response.getRequest.mockReturnValue(new Request("https://logisticsworld.eu/admin"));
    saveSession("access-token", 7200);
    expect(response.setCookie).toHaveBeenCalledWith("lw-admin-session", "access-token", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 3600 });
  });
});
