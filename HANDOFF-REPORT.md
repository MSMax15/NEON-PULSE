# Pulseneon – Handoff / Status Report
Date: 2026-11-09

## Goal
GTA 6 fan hub (pulseneon.de) + ZAP-Hosting affiliate conversion + Shop + Mods placeholder.
GitHub Pages, static HTML/CSS/JS. Brand: Pulseneon (capital P). English UI.

## Critical constraints
- Weapon wheel / weapon menus / image filenames & extensions must stay intact.
- Index “dive” hero: hero.png surface → underwater deep on scroll (`--d`). Do not remove.
- Do not put version numbers on the live site.
- Affiliate honesty: no “objectively best host” claims; transparent partner links + voucher FeedError-a-4064.
- Formspree endpoint: https://formspree.io/f/xaeeklye (alerts).
- Domain: https://pulseneon.de (SSL must be fixed at host/DNS if browser shows “Not secure”).

## What broke recently
1. Multiple stacked background systems (dive zoom + HD patch + user images) caused soft/rotated BGs.
2. Bare CSS `nav {}` rules from shop-subnav polluted the site header → overlap on index.
3. Nav HTML differed per page; accordion only “worked” for the active section.
4. site.js and nav.js both bound `.nav-acc-btn` → half-broken menu.
5. Aggressive CSS `body>.bg{z-index:0}` could stack backgrounds incorrectly.

## Current architecture (after this fix)
- **Nav:** Identical `#site-nav` on every HTML page. Groups: Fan hub / Servers / Shop / More.
- **nav.js:** Sole controller for drawer + accordion (site.js nav handlers removed).
- **style.css:** High-specificity `#site-nav` / `#nav-drawer` rules at end; `.bg` / `.bg.dive` at z-index -1.
- **Backgrounds:** Index = dive (hero.png + bg/v2-underwater-1920.jpg). Other pages = v2-{night|vice|motel|pegasus} with `orientation: portrait` mobile sources + 1920/2560 desktop srcset.
- **mods-gta6.html:** Coming soon placeholder for post-PC mod hub.
- **shop.html:** Amazon affiliate merch grid (categories).
- **Packs:** #packs on index + packs.html with ZAP affiliate package links.

## Deploy instructions
1. Overwrite ALL files from NEON-PULSE-FULL-FIX.zip into the repo root.
2. Keep binary assets if missing from zip: logo.png, hero.png, favicon.png, weapon images, shop-img/, any extra media.
3. Ensure folder `bg/` with all v2-*.jpg is live.
4. Hard refresh / purge CDN cache.
5. Test: index countdown, dive scroll, burger opens, all 4 accordions open on every page, #packs, shop, mods page.

## Known external issues
- SSL “Not secure” = certificate/custom domain config (GitHub Pages / Cloudflare), not CSS.
- Amazon image hotlink can fail; local shop-img crops used as fallback historically.
- SixM is community terminology, not a confirmed Rockstar product – keep disclaimer.

## If index still looks wrong
Checklist:
- [ ] hero.png 200?
- [ ] bg/v2-underwater-1920.jpg 200?
- [ ] style.css and nav.js 200 and latest?
- [ ] Only one site-nav in DOM?
- [ ] Console errors from old cached site.js?

## Monetization focus
Organic SEO pages (hosting, SixM, status) + Instagram → #packs / partner / ZAP links.
Conversion: packs CTAs, alert form, shop Amazon links.
