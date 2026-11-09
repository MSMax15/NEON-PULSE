# AGENTS.md — Neon Pulse / Pulseneon

**Mandatory reading before any edit:** [FOUNDATION.md](FOUNDATION.md)

## Non-negotiables
1. Website UI language: **English**
2. **Never** invent live server status numbers
3. **Only one** nav controller: `site.js` (class `open` on `#nav-drawer`). **No `nav.js`.**
4. After every `site.js` change: `node --check site.js` must pass
5. Homepage background must stay `.bg.dive` with surface + deep pictures
6. Do not append conflicting `#site-nav` CSS override layers

## Deploy
Overwrite repo root with the foundation package. Keep `gta6-launch.mp4` / full `bg/` if omitted from a lean ZIP. Hard-refresh after GitHub Pages deploy.

## Continuity
Update `HANDOFF-REPORT.md` when you change architecture. Keep `FOUNDATION.md` accurate.
