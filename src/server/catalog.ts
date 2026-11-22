import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { databaseConfig, databaseRequest } from "./database";
import { normalizeSloveniaSearch } from "../domain/search";
import { companySchema } from "../domain/company";

// Enforce the public market on the server, including direct function requests.
export const getDirectory = createServerFn({ method: "GET" })
  .validator(normalizeSloveniaSearch)
  .handler(async ({ data }) => {

    const config = await databaseConfig();
    if (!config) return (await import("../data/slovenia")).searchSloveniaCompanies(data);
    const result = z.object({ companies: z.array(companySchema), total: z.number().int().min(0), page: z.number().int().min(1), pages: z.number().int().min(1) })
      .parse(await databaseRequest(config, "/rest/v1/rpc/search_companies", undefined, { p_search: data }));
    return { ...result, search: { ...data, page: result.page } };
  });

export const getCompany = createServerFn({ method: "GET" }).validator(z.string().min(1).max(100)).handler(async ({ data }) => {

  const config = await databaseConfig();
  if (!config) return (await import("../data/slovenia")).findCompany(data) ?? null;
  const rows = await databaseRequest<{ payload: unknown }[]>(config, `/rest/v1/company_publications?select=payload&slug=eq.${encodeURIComponent(data)}&limit=1`);
  return rows.length ? companySchema.parse(rows[0].payload) : null;
});
