import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getSeoSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { indexingEnabled } = await import("./seo-handlers.server");
  return { indexingEnabled: await indexingEnabled(getRequest()) };
});
