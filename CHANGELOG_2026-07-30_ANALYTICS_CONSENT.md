# OnChainMake website — Analytics and consent update

Date: 2026-07-30

## Scope

- Added Google Analytics 4 Measurement ID `G-XLG2N4EMG5` to every HTML page through a consent-gated local loader.
- Implemented basic consent mode: the Google tag is not requested and no Analytics data is sent before the visitor accepts analytics.
- Advertising storage, advertising personalisation, advertising user data and Google signals remain disabled.
- Added a responsive privacy banner with `Reject optional`, `Accept analytics` and a close control that preserves the privacy-default state.
- Added persistent cookie settings using local storage key `ocm_cookie_consent_v1`.
- Added a `Cookie settings` control to every footer.
- Added revocation handling: consent is changed to denied, accessible GA cookies are removed and the page reloads without Analytics.
- Updated `cookies.html` and `privacy.html` to describe the implemented public-website behavior.

## Files added

- `analytics-consent.js`
- `CHANGELOG_2026-07-30_ANALYTICS_CONSENT.md`
- `DEPLOY_AND_VERIFY_2026-07-30.txt`

## Files updated

- All eight HTML pages
- `main.css`
- `cookies.html`
- `privacy.html`

## Deliberately unchanged

- Website commercial copy and layout, except for the consent interface and policy wording.
- Existing HubSpot form embeds and form IDs.
- Cloudflare configuration, DNS and custom domains.
- The React/Vite application at `app.onchainmake.com`, where the GA tag was already present.

## Review note

This implementation controls Google Analytics 4. Existing third-party embedded forms remain unchanged and should be reviewed separately if a full multi-provider consent management platform is required.
