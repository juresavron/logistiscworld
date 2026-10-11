import { createServerFn } from "@tanstack/react-start";
import { companies } from "../data/companies";
import { normalizeSearch, searchCompanies } from "../domain/search";

// Server boundary is retained when fixture lookup is replaced by indexed DB queries.
export const getDirectory = createServerFn({ method: "GET" })
  .validator(normalizeSearch)
  .handler(({ data }) => searchCompanies(companies, data));
