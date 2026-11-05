# Neon Pulse – Status & Alarm

## Status-Chip
- Liest `status.json` aus dem gleichen Repo (GitHub Pages).
- Fallback-Text vor dem 19.11.2026: **„Noch nicht live – Release 19.11.2026“** (kein „nicht abrufbar“).
- Optional später: Branch `status-data` + `monitor.py` (siehe SETUP.md) für automatische Updates.

## Server-Alarm (Formspree)
- Formulare posten an `https://formspree.io/f/xaeeklye`.
- Anmeldungen erscheinen im Formspree-Dashboard.
- Automatische „Server online“-Mails brauchen zusätzlich Buttondown + GitHub Action (SETUP.md).

## status.json pflegen
Datei im Repo anpassen, z.B. nach Launch:
```json
{ "status": "up", "detail": "Rockstar meldet operational", "updated": "..." }
```
Erlaubte `status`-Werte: `unlisted` | `up` | `limited` | `down` | `maintenance`
