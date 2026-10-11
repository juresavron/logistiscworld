import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { normalizeSloveniaSearch } from "../data/slovenia";

export const Route = createFileRoute("/locations_/$country")({
  beforeLoad: ({ params }) => {
    if (params.country !== "slovenia") throw notFound();
    throw redirect({ to: "/companies", search: normalizeSloveniaSearch({}), statusCode: 301 });
  },
});
