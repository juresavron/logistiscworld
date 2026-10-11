import { createServerFn } from "@tanstack/react-start";
import { normalizeSloveniaSearch, searchSloveniaCompanies } from "../data/slovenia";

// Enforce the public market on the server, including direct function requests.
export const getDirectory = createServerFn({ method: "GET" })
  .validator(normalizeSloveniaSearch)
  .handler(({ data }) => searchSloveniaCompanies(data));
