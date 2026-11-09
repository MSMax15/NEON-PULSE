# Handoff Report — Foundation Build 2026-11-09

## What was delivered

- **AGENTS.md** — complete rulebook for every AI that works on this repository.
- **check.py** — automatic foundation checker (run `python3 check.py`).
- Clean **README.md** focused on the overwrite deploy method.
- All existing HTML/CSS/JS files preserved and included in the foundation package.
- English-first direction already applied (`lang="en"` on pages).
- Navigation architecture locked: single `#site-nav` + `nav.js` only.

## How to use this package

1. Overwrite the root of the GitHub repository with the contents of this foundation.
2. Keep binary media that may be missing from the code package (`bg/`, large video, logos, shop images).
3. Run `python3 check.py` and fix any remaining errors.
4. Commit + push → GitHub Pages deploys.

## What still needs human / next-AI attention

- Some legacy content blocks and placeholder labels may still need a final English copy-edit.
- Legal pages (`impressum.html`, `datenschutz.html`) should be reviewed for legal accuracy.
- SSL / custom-domain “Not secure” warnings are a DNS / GitHub Pages certificate issue, not a code issue.
- Amazon image hotlinks can fail; local fallbacks exist historically.
- SixM is community terminology — keep the disclaimer.
- No live status backend is connected. Do not invent status data.

## Known good architecture (do not regress)

- Nav HTML is identical across pages.
- `nav.js` is the sole controller for drawer + accordion.
- `site.js` does not bind navigation accordion buttons.
- Background system uses `.bg` / `.bg.dive` at z-index -1.
- Index uses dive effect; other pages use v2-* image set.

## Checker status at foundation build

Run the checker after you drop the files into the real repository (media paths and full tree may differ slightly).

## Next recommended steps

1. Drop foundation into repo → run checker.
2. Hard-refresh live site and test burger + all 4 accordions on index + one inner page.
3. Confirm countdown and launch cinema still work.
4. Resubmit sitemap in Google Search Console.
5. Only then start new feature work (status backend, new SEO pages, etc.).
