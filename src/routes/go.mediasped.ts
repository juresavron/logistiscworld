import { createFileRoute } from "@tanstack/react-router";
import { handleQuoteReferral } from "../domain/referrals";

async function redirect(request: Request) {
  let analytics;
  try { const { env } = await import("cloudflare:workers"); analytics = env.REFERRALS; }
  catch { /* Node-only smoke checks do not provide Cloudflare bindings. */ }
  return handleQuoteReferral(request, analytics);
}
export const Route = createFileRoute("/go/mediasped")({
  server: { handlers: { GET: ({ request }) => redirect(request), HEAD: ({ request }) => redirect(request) } },
});
