import { createFileRoute, redirect } from "@tanstack/react-router";
import { emptySearch } from "../domain/search";

// Keep previously shared comparison URLs useful after retiring the feature.
export const Route = createFileRoute("/compare")({
  beforeLoad: () => {
    throw redirect({ to: "/companies", search: emptySearch, statusCode: 301 });
  },
});
