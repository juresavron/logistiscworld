import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "../components/layout";
import { Home } from "../components/home";
export const Route = createFileRoute("/")({
  component: () => (
    <PublicLayout>
      <Home />
    </PublicLayout>
  ),
});
