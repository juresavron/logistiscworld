# Mediašped referral funnel

Mediašped is labelled Featured partner in directory results and on its enriched profile. Blog and service pages show an explicitly promotional partner block. Contact links for other companies continue to use their own channels. Directory filters and A–Z sorting are preserved.

Quotation buttons open `/go/mediasped` with an allowlisted placement and content ID. The endpoint redirects to the existing Mediašped English quotation form with `utm_source=logisticsworld.eu`, `utm_medium=referral`, `utm_campaign=featured-partner`, and a `utm_content` identifying the source. The destination is fixed. Arbitrary query parameters are never forwarded or recorded. Analytics failure does not block the handoff.

## Aggregate referral metrics

The Cloudflare Analytics Engine binding `REFERRALS` writes to `logisticsworld_referrals`. Each outbound GET records `blob1=quote_handoff`, `blob2=placement`, `blob3=content`, `double1=1`, and `index1=mediasped`. HEAD and declared prefetch requests are excluded. Verification uses `blob1=verification` and is excluded from visitor reporting. No contact information, IP addresses, cookies or visitor IDs enter these events. These are aggregate handoff requests, not unique visitors, confirmed enquiries or customer popularity. Bots and repeated clicks may still be included.

Example reporting query:

```sql
SELECT blob2 AS placement, blob3 AS content, SUM(_sample_interval * double1) AS handoffs
FROM logisticsworld_referrals
WHERE blob1 = 'quote_handoff' AND timestamp > NOW() - INTERVAL '30' DAY
GROUP BY placement, content ORDER BY handoffs DESC
```

Use `npm run cf-typegen` after changing bindings. Native Wrangler deploys use the config dataset binding. The connector-compatible module packager also includes it.

## Conversion attribution gap

As checked on 21 November 2026, Mediašped's quote and contact forms save to its existing Supabase project. Source code does not currently retain referral UTMs in those saved submissions. The installed `notify_new_lead` database trigger has neither notification URL nor shared secret configured, so its current implementation skips notifications. No website-to-SavSale conversion attribution has been verified.

The next integration should persist validated referral metadata with both express and detailed quote submissions and connect a durable, idempotent ingestion path into SavSale. Then report actual submitted enquiries and won deals separately from outbound handoffs. No customer reviews, popularity badges or quality rankings have been introduced by this release.
