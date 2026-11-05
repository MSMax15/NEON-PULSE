# Neon Pulse – Update notes

## Implemented
- Added a responsive ZAP-Hosting horizontal affiliate banner on the homepage.
- Added a compact vertical ZAP-Hosting banner on wide desktop screens only; it is hidden on smaller screens to avoid covering content.
- Added a hosting discovery section for game-server and voice-server hosting, with affiliate links and a clear affiliate disclosure.
- Connected the existing GTA 6 status-alarm signup form on `index.html` and `alarm.html` to the supplied Formspree endpoint `https://formspree.io/f/xyeeovyz`.
- Added named consent and subject fields and an AJAX submission handler with success/error feedback.
- Updated the privacy page to identify Formspree form processing and disclose affiliate links (the page still contains legal placeholders that must be completed).

## Important limitations / setup
- Formspree now receives signup submissions. This alone does NOT send automatic GTA 6 status-change emails. The monitoring workflow and a mailing provider/API key still need to be configured and tested.
- The site currently does not verify or publish third-party game-server uptime. No public server directory or live server ping feature was added because there is no server data/API or moderation process configured.
- Only two ZAP banner creatives were supplied. The second supplied destination URL contained `Pulseneonz` (extra `z`); to avoid a potentially broken destination, both creatives currently use the first supplied affiliate destination: `https://zap-hosting.com/Pulseneon?voucher=FeedError-a-4064`.
- Complete and review `datenschutz.html` and `impressum.html` before collecting personal data or monetizing traffic. In particular, verify Formspree's current privacy/processing terms and affiliate tracking disclosures.

## Preserved
- The SVG category wheel is byte-for-byte unchanged.
- All 21 existing image files are unchanged, including their original extensions (`.png`, `.jpg`, `.jpeg`).
- Existing category pages, site assets, and countdown behavior were not rebuilt.
