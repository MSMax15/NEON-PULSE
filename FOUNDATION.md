# FOUNDATION — Neon Pulse / Pulseneon (locked)

**Read this file before changing anything.**  
This document explains the last known-good architecture, why the site broke, and the rules that prevent a repeat.

Domain: https://pulseneon.de  
Stack: static HTML / CSS / JS on GitHub Pages  
Primary UI language: English

---

## 1. What broke (root causes)

### A. Truncated `site.js` (critical)
- `site.js` ended mid-statement (`document.addEventListener("click", (e) => {` with no body/close).
- Browser threw `SyntaxError: Unexpected end of input`.
- **Effects:** countdown timer dead, category wheel never got class `.in` (stayed `opacity:0`), any code after the parse error never ran.

### B. Double navigation controllers
- `site.js` controlled the burger/drawer with class **`open`** and `body.nav-open`.
- A later `nav.js` also controlled the same DOM with class **`is-open`** and `documentElement.nav-open`.
- CSS mixed rules for `.nav-drawer.open` and `#nav-drawer.is-open`.
- **Effects:** menu appeared not to open, or opened invisibly (`visibility:hidden` not cleared).

### C. Conflicting CSS layers
- Extra high-specificity blocks (`#site-nav`, `#nav-drawer{...!important}`) were appended on top of the working stylesheet.
- Working pages use plain `<nav>` (no `id="site-nav"`).
- Drawer could stay at `visibility:hidden` / wrong transform even when “open”.

### D. Background markup drift
- Working index uses: `<div class="bg dive">` + `<picture class="bg-pic bg-surface/deep">` + `bg/v2-underwater-1920.jpg`.
- Broken variants used raw `<img class="bg-surface">` without `.dive` or pointed at different files.
- Without `.dive`, water/caustics/rays stay `display:none`.

---

## 2. Locked architecture (do not regress)

### Navigation
- **One system only:** hamburger + right drawer implemented in **`site.js`**.
- **Do not add `nav.js`.** Do not bind `.nav-burger` in a second file.
- HTML: plain `<nav>` → `.nav-bar` (logo + burger) → `#nav-backdrop` → `#nav-drawer`.
- Open state: class **`open`** on `#nav-drawer` + `aria-hidden="false"` + `body.nav-open`.
- Shop submenu: `.nav-acc-btn` + `#nav-shop-sub` (or `.nav-acc-panel`); toggled in `site.js` via `hidden` + `aria-expanded`.

### Scripts
| File     | Role |
|----------|------|
| `site.js` | **Only** JS runtime: bubbles, menu, countdown, dive depth, wheel, forms, lightbox, hash scroll |
| `style.css` | Single stylesheet; do not append a second competing nav layer |
| no `nav.js` | Removed on purpose |

### Homepage background
```html
<div class="bg dive" data-bg="dive" style="--d:0">
  <picture class="bg-pic bg-surface">…hero.png…</picture>
  <picture class="bg-pic bg-deep">…bg/v2-underwater-1920.jpg…</picture>
  … grade, shade, water, caustics, rays, #bubbles …
</div>
```
- Dive scroll sets CSS variable `--d` on `.bg` from `site.js`.
- Keep `hero.png` and `bg/v2-underwater-1920.jpg` available.

### Countdown
- Target: **19 November 2026** (`new Date(2026, 10, 19, 0, 0, 0)` — month is 0-based).
- Elements: `#count` → `#d` `#h` `#m` `#s`.
- Never invent live server status data.

### Category wheel
- `#wheel` starts at `opacity:0`, gains class `.in` via IntersectionObserver (fallback timeout in `site.js`).
- Do not remove the fallback timeout.

---

## 3. File integrity rules

1. **Never ship a truncated JS file.** After editing `site.js`, run:
   ```bash
   node --check site.js
   ```
   Must exit 0.
2. **One nav controller.** If you touch the menu, change only `site.js` + matching CSS classes (`.open`), not a second script.
3. **Do not reintroduce** `#site-nav` high-specificity override blocks that fight the base `.nav-drawer` rules.
4. **Overwrite deploy:** replace whole tree carefully; keep large binaries (`gta6-launch.mp4`, full `bg/`) if a lean ZIP omitted them.
5. **English UI** on public pages; German **filenames** may stay for SEO/backlinks (`datenschutz.html`, etc.).

---

## 4. Sanity checklist before every commit

- [ ] `node --check site.js`
- [ ] No `nav.js` reference in HTML
- [ ] Index has `.bg.dive` and loads `site.js` only
- [ ] Burger opens drawer (class `open`, visible)
- [ ] Countdown numbers change each second
- [ ] Wheel becomes visible within ~1s
- [ ] Hard-refresh after deploy (CDN/browser cache)

---

## 5. What this foundation deliberately does not do

- No live online/offline claims for game services
- No second navigation framework
- No build step (pure static)
- No automatic Google Translate injection

---

## 6. Handoff note for the next AI

Treat the package that ships with this `FOUNDATION.md` as the **baseline**.  
If the menu, timer, or wheel break again, check **in this order**:

1. `node --check site.js` → syntax  
2. Is `nav.js` back? → remove it and script tags  
3. Does CSS still use `.nav-drawer.open` / `visibility` correctly?  
4. Does index still have `.bg.dive`?  
5. Cache: hard-refresh / purge CDN  

Document any intentional architecture change in `HANDOFF-REPORT.md` and update this file.

**Foundation locked:** 2026-11-09  
**Version label:** post-break recovery (working bg-fix + repaired site.js)
