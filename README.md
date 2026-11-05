# Pulse Neon

Independent gaming status hub. Initial static MVP for GitHub Pages.

## Current scope

- Responsive Vice-City-inspired visual direction using original CSS artwork only.
- German landing page targeting informational searches about GTA 6 server status and connection problems.
- Clear separation between official status sources, future technical checks, and future community reports.
- SEO metadata, canonical URL, basic WebSite structured data, robots.txt, sitemap.xml and custom-domain CNAME.

## Important data integrity rule

The current page intentionally does **not** claim that any game service is online or offline. No live status source or community-report backend is connected yet. Do not publish fabricated uptime, outage counts, charts, or user reports.

## Publish with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Select **Deploy from a branch**, branch `main`, folder `/ (root)` (if not already selected).
3. Save and wait for the Pages deployment.
4. Add `pulseneon.de` as the custom domain in Pages settings.
5. At the DNS provider, configure the apex A records and the `www` CNAME as documented by GitHub.
6. Enable **Enforce HTTPS** once GitHub makes the option available.

GitHub's current custom-domain instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Next engineering phase

Connect a trusted official status source and a small set of monitored endpoints. Only after validation should the page show live labels and timestamped history. Community reporting should be added with server-side rate limiting, abuse protection, and privacy-conscious data retention.


## Security

- Browser-side Content Security Policy and referrer policy are included on all HTML pages.
- The status monitor uses pinned Python dependencies, bounded remote responses, validated state, and atomic writes.
- GitHub Actions workflows are pinned to commit SHAs; Dependabot and a dependency audit workflow are enabled.
- See `SECURITY.md` and `SETUP.md` before enabling email alerts.
