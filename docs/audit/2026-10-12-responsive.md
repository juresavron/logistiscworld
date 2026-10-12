# Responsive visual audit — 12 October 2026

Checked the deployed Cloudflare site in Chromium using same-origin frames with actual CSS viewport widths of 320, 375, 390, 600, 768, 1024, 1280, 1440 and 1920 pixels. Large frames were scaled only for viewing; media queries used the specified viewport width. This is responsive browser coverage, not a claim of testing every physical device or Safari/Firefox.

## Coverage

108 layout checks across the homepage, directory, Mediašped profile, multi-office Gebrüder Weiss profile, long-name ASR profile, services index, rail results, methodology, submission form, admin catalog, company editor and missing-company page. No page-level horizontal overflow or broken loaded images were detected. Service shortcuts, editor tabs and tablet admin tables intentionally scroll within their own containers.

Visual inspection included phone, tablet, laptop and wide desktop layouts. Opened the mobile navigation and filters, changed alphabetical/default sorting, and opened the mobile editor's Offices tab. No submission or approval actions were performed.

## Fixes

- Removed Mediašped's Featured badge while preserving its first position in default results.
- Replaced the misleading static Name A–Z text with a working, accessible sort selector showing Default order.
- Aligned homepage and directory pagination at 12 companies per page.
- Fixed a mobile profile overlap: the 112px logo had occupied an old 56px grid column. At widths up to 480px, the logo now has its own row and the company text uses the full width. Confirmed the logo and heading no longer intersect at 320px and inspected the tablet arrangement.

## Validation

TypeScript check, 16 unit tests, 28 server-rendering smoke checks and 44 packaged-asset checks passed. Production build passed. The temporary audit route is excluded from the final deployment.

The admin and submission flows remain explicitly labelled browser-only demos; this audit does not add a backend or publishing functionality.
