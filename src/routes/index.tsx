import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Home } from "../components/home";
import { homeTitle, homeDescription, pageHead } from "../domain/seo";
export const Route = createFileRoute("/")({
  head: () => pageHead(homeTitle, homeDescription, "/"),
  component: () => (
    <PublicLayout>
      <Home />
    </PublicLayout>
  ),
});
