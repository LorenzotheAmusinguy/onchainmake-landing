# Test report — GA4 and consent update

Date: 2026-07-30

## Automated checks completed

- JavaScript syntax: `node --check analytics-consent.js` — PASS.
- Consent interface render: PASS in headless Chromium.
- Consent dataLayer sequence: default denied → granted on acceptance → denied on rejection — PASS.
- Google tag injection only after acceptance — PASS in interaction test.
- HTML structure: eight pages parsed; one `html`, `head`, `body`, footer and consent loader per page — PASS.
- Local links and assets referenced by HTML pages — PASS.
- `Cookie settings` control available on every page — PASS.
- CSS brace balance — PASS.
- Duplicate consent/analytics loader check — PASS.

## Manual production checks still required

- Cloudflare deployment status must be successful.
- First visit in a private browser must show the banner.
- `_ga` / `_ga_*` cookies must be absent before acceptance.
- GA4 Realtime must register a visit after `Accept analytics`.
- Revocation through footer `Cookie settings` must remove accessible GA cookies and reload with analytics blocked.
- Existing HubSpot embedded forms should be separately reviewed if full multi-provider consent management is required.
