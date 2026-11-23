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

## Submitted-enquiry attribution

On 23 November 2026, [Mediašped PR #22](https://github.com/juresavron/mediasped-landing-lovable-15/pull/22) and [SavSale PR #180](https://github.com/juresavron/savsale-c378cf35/pull/180) added allowlisted referral fields to actual express/contact and detailed quote submissions. Mediašped captures the arrival tags in memory for at most two hours, without new cookies or browser storage; a later return without tags may not be attributed. New placement IDs must also be added to Mediašped's frontend and database allowlists.

A private transactional outbox delivers future LogisticsWorld-attributed submissions to a source-bound SavSale endpoint. The exact source row identity and immutable payload hash make repeats safe. Completion requires a matching stored receipt; failed/lost responses retain the enquiry and retry. Two reserved production QA submissions and their replays returned the same CRM IDs, with matching source receipt readback.

Current Mediašped members can read these source records in [SavSale → Inbox → Website enquiries](https://savsale.com/review?company=mediasped&view=website). They are submitted-form evidence, with self-reported campaign tags and unverified sender identity. Existing contact/deal/task recording and sending controls remain separate. There is no historical backfill, automatic deal creation or won-revenue attribution. Existing email-notification configuration was not activated.

Report aggregate handoffs, submitted enquiries, qualified opportunities and won deals separately. No customer reviews, popularity badges or quality rankings have been introduced.
