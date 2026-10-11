import { createFileRoute, redirect } from "@tanstack/react-router";
import { normalizeSloveniaSearch } from "../data/slovenia";

export const Route = createFileRoute("/locations")({
  beforeLoad: () => { throw redirect({ to: "/companies", search: normalizeSloveniaSearch({}), statusCode: 301 }); },
});
