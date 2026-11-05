# Neon Pulse – Security hardening

## Applied in this update

- A restrictive Content Security Policy (CSP) meta policy is installed on every HTML page. It limits scripts to the same origin, blocks plugins and frames, limits form submission to Formspree, and permits only the external font, banner-image, and status/form API origins the site currently needs.
- The referrer policy is set to `strict-origin-when-cross-origin`, preserving the site origin for normal external referral attribution while avoiding full-path leakage.
- The image lightbox now builds DOM nodes instead of interpolating image alt text or captions into `innerHTML`.
- The Formspree handler checks the exact HTTPS endpoint and POST method, validates the email length/format, discards filled honeypots, omits credentials, disables caching, and aborts requests after 15 seconds.
- The status monitor validates all states and persisted state data, rejects unexpected simulation values, bounds Rockstar's response to 2 MiB, uses request timeouts, and writes status data atomically.
- Python dependencies are pinned. Dependabot checks Python packages and GitHub Actions weekly.
- The status workflow pins its GitHub Actions to commit SHAs, scopes write permission to the job, and avoids persisting checkout credentials. The GitHub token is only placed in the environment of the two git-push steps.
- A scheduled security workflow runs `pip-audit`, `pip check`, and Python syntax compilation.

## Important platform limitation

This project is hosted on GitHub Pages. A static repository cannot set all HTTP response headers itself. The CSP and referrer policy above are delivered as HTML meta policies, but headers such as these must be configured at an HTTP edge/CDN or hosting layer:

- `Strict-Transport-Security: max-age=31536000` (add `includeSubDomains` only after every subdomain supports HTTPS)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Cross-Origin-Opener-Policy: same-origin`

Do not add a `_headers` file expecting GitHub Pages to apply it; GitHub Pages does not provide general custom response-header configuration. If an edge provider such as Cloudflare is later placed in front of the domain, configure the headers there and test the final response headers.

## External services and remaining risks

- Formspree and ZAP-Hosting are third-party services. The site cannot control their security, availability, data retention, or privacy practices.
- The Formspree endpoint is public by design; client-side checks are not a substitute for server-side spam controls. Enable Formspree's spam protection/rate limits and review submissions in its dashboard.
- Never commit `BUTTONDOWN_API_KEY`, personal subscriber data, access tokens, or private credentials. Store secrets only in GitHub Actions repository secrets.
- Restrict repository write access and enable GitHub two-factor authentication. Review Dependabot/security alerts and workflow changes before merging.
- The status monitor still depends on Rockstar's public page structure and can misread changes; the official Rockstar status page remains authoritative.
- A static GitHub Pages site cannot securely host user accounts, private server credentials, or a public server-report backend. Such features need a server-side API with authentication, validation, rate limiting, abuse controls, and a data-retention policy.
