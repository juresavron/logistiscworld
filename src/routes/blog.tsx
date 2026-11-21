import { createFileRoute } from "@tanstack/react-router";
import { BlogListing } from "../components/blog";
import { PublicLayout } from "../components/layout";
import { pageHead } from "../domain/seo";

export const Route = createFileRoute("/blog")({
  head: () => pageHead("Logistics Blog & Shipping Guides", "Practical freight and logistics guides: plan shipments through Koper, compare FCL and LCL, and prepare a clear freight quote request.", "/blog"),
  component: () => <PublicLayout><BlogListing/></PublicLayout>,
});
