# AGENTS.md — Neon Pulse / Pulseneon Foundation Rules

**Read this file completely before changing any file.**  
This is the single source of truth for every AI (and human) that works on this repository.

---

## 1. Project Identity

- **Name:** Neon Pulse / Pulseneon
- **Domain:** https://pulseneon.de
- **Type:** Static site (GitHub Pages)
- **Primary language of the website:** English (`lang="en"` on every HTML page)
- **Internal docs & this rulebook:** English only
- **Purpose:** Independent gaming status & info hub focused on GTA 6, server hosting, FiveM / SixM, TeamSpeak, Minecraft, etc.
- **Tone:** Clear, honest, Vice-City neon aesthetic. No hype claims that cannot be verified.

---

## 2. Absolute Rules (never break these)

### 2.1 Language
- All **visible page content**, navigation labels, buttons, titles, meta descriptions, Open Graph tags → **English**.
- Keep existing German **filenames** (e.g. `datenschutz.html`, `sixm-server-mieten.html`) so indexed URLs and backlinks do not break.
- Do **not** add automatic Google Translate redirects or language-switch prompts.
- Legal pages (`impressum.html`, `datenschutz.html`) may keep German legal text where required by law, but UI chrome stays English.

### 2.2 Data Integrity (critical)
- **Never invent live status data.** Do not claim any game service is online/offline, do not invent uptime percentages, outage counts, player numbers, or charts unless a real backend is connected and verified.
- The site currently has **no live status source**. Placeholder language only.
- Do not publish unverified vehicle, weapon, cheat, leak, or server claims as facts.
- Affiliate / partner links must stay transparent. Never claim “objectively best host”.

### 2.3 Navigation
- There is **exactly one** navigation system:
  - HTML: identical `#site-nav` block on every page
  - JS: **only** `nav.js` controls the drawer and accordion
  - CSS: high-specificity `#site-nav` / `#nav-drawer` rules live at the end of `style.css`
- **Never** put navigation logic back into `site.js`.
- **Never** invent a second nav or different HTML structure per page.
- Accordion groups: Fan hub / Servers / Shop / More

### 2.4 Backgrounds & CSS
- Backgrounds use the `.bg` / `.bg.dive` system with `z-index: -1`.
- Index page uses the dive effect (hero + underwater).
- Other pages use the `v2-*` image set with proper `srcset` and mobile portrait sources.
- Do **not** re-introduce stacked background systems or bare `nav {}` rules that can leak into the header.
- Prefer existing CSS classes. Add new rules only when necessary and with high specificity when touching the nav.

### 2.5 File structure
- Root of the repository = site root (GitHub Pages `/`).
- Do not nest the site inside an extra folder when deploying.
- Keep binary assets that are missing from a code-only package:
  - `logo.png`, `hero.png`, `favicon.png`
  - entire `bg/` folder
  - `gta6-launch.mp4` (large, keep on server)
  - shop images, weapon images, etc.
- `CNAME` must remain `pulseneon.de`.

### 2.6 SEO
- Every public HTML page must have:
  - `<html lang="en">`
  - unique `<title>`
  - unique meta description
  - canonical URL pointing to `https://pulseneon.de/...`
  - Open Graph tags (at least title, description, url, type)
- Keep `robots.txt` and `sitemap.xml` in sync with real public pages.
- After structural changes, update `lastmod` in `sitemap.xml`.
- Do not add hreflang for languages that do not have complete localized pages.

### 2.7 Scripts
- `nav.js` → sole navigation controller
- `site.js` → countdown, cinema/launch video, forms, packs, non-nav UI
- Never duplicate event listeners for the same elements across both files.

### 2.8 Security & secrets
- Never commit API keys, Formspree tokens, Buttondown keys, or Worker secrets.
- Secrets live only in Cloudflare Worker secrets / GitHub Actions secrets.
- Formspree endpoint currently documented in SETUP.md (do not hard-code new secrets).

---

## 3. How to work on this repo

1. Read this entire AGENTS.md.
2. Run the checker: `python3 check.py` (or `python check.py`).
3. Fix every error the checker reports before doing new feature work.
4. Make the smallest change that solves the task.
5. Re-run the checker.
6. If you touch navigation, test the burger menu + all four accordions on **index + one inner page**.
7. If you touch backgrounds, hard-refresh and check mobile + desktop.

---

## 4. Deployment (overwrite method)

This foundation is designed to be dropped on top of the existing repository:

1. Download / extract the foundation ZIP.
2. Copy **all files** into the root of the GitHub repository (overwrite).
3. Keep existing large media that are not in the ZIP (`bg/`, `gta6-launch.mp4`, shop images, etc.).
4. Commit & push to `main`.
5. GitHub Pages deploys automatically.
6. Hard-refresh / purge CDN cache.
7. Re-submit sitemap in Google Search Console if structure changed.

---

## 5. Checker expectations

`check.py` enforces:

- All HTML pages have `lang="en"`
- Exactly one `#site-nav` per page (except pure fragments)
- `nav.js` and `site.js` exist and do not both bind accordion buttons
- `CNAME` is correct
- `robots.txt` points to the sitemap
- No obvious hardcoded secrets
- Core files present

Treat checker failures as blockers.

---

## 6. What this foundation deliberately does NOT do

- It does not invent live server status.
- It does not claim to be an official Rockstar or Take-Two product.
- It does not automatically translate the site.
- It does not require a build step (pure static HTML/CSS/JS).

---

## 7. Contact / continuity

When handing off to another AI or human, leave a short note in `HANDOFF-REPORT.md` describing:

- What was changed
- What still needs human copy-edit
- Any known external issues (SSL, affiliate image hotlinks, etc.)

---

**Last foundation build:** 2026-11-09  
**Rule version:** 1.0
