# Neon Pulse / Pulseneon

Independent gaming status & info hub. Static site for GitHub Pages.

**Domain:** https://pulseneon.de  
**Language:** English (`lang="en"`)  
**Rulebook for every AI/human:** [AGENTS.md](AGENTS.md)

---

## Quick start (overwrite deploy)

1. Extract this foundation package.
2. Copy **every file** into the root of your existing GitHub repository (overwrite).
3. Keep large media that are not in the package:
   - entire `bg/` folder
   - `gta6-launch.mp4`
   - `logo.png`, `hero.png`, `favicon.png`, shop images, etc.
4. Commit + push to `main`.
5. GitHub Pages deploys from the root.
6. Hard-refresh the live site / purge CDN cache.

---

## Foundation tools

| File        | Purpose                                      |
|-------------|----------------------------------------------|
| `AGENTS.md` | Mandatory rules for every AI that works here |
| `check.py`  | Automatic validator — run before every commit|

```bash
python3 check.py
```

Fix every error the checker reports before new work.

---

## Architecture (do not break)

- **Nav:** Identical `#site-nav` on every page. Controlled only by `nav.js`.
- **Styles:** `style.css` — high-specificity nav rules at the end. Backgrounds via `.bg` / `.bg.dive`.
- **Scripts:** `nav.js` (navigation only) + `site.js` (countdown, cinema, forms, packs).
- **SEO:** Every page has `lang="en"`, unique title, meta description, canonical URL.
- **No live status data** is invented. No fabricated uptime or outage claims.

---

## Important integrity rule

The site intentionally does **not** claim that any game service is online or offline.  
No live status backend is connected yet. Do not publish fabricated numbers, charts, or reports.

---

## Publish with GitHub Pages

1. Settings → Pages → Deploy from branch `main` / folder `/ (root)`.
2. Custom domain: `pulseneon.de` (CNAME file already present).
3. Enable **Enforce HTTPS** once available.
4. DNS: apex A records + `www` CNAME as documented by GitHub.

---

## SEO after deploy

Resubmit `https://pulseneon.de/sitemap.xml` in Google Search Console.  
Inspect the homepage and main GTA 6 / hosting pages.

---

## Monetization & partners

Organic SEO pages + transparent affiliate / partner links (ZAP, Amazon, etc.).  
Never claim an “objectively best” host.

---

## Continuity

When another AI or human takes over, update `HANDOFF-REPORT.md` with:

- what changed
- what still needs human review
- known external issues (SSL, hotlinked images, etc.)

See also: `SETUP.md`, `SECURITY.md`, `SEO-UPDATE-v10.2-ENGLISH.md`.
