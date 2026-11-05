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


## Änderungen (Assistent, Stand 5.11.)
- Bilder: Seiten und Waffenrad finden jetzt .jpg, .jpeg, .png und .webp automatisch (nichts umbenennen). Das Waffenrad nimmt als Ersatz das erste Foto der Kategorie (images/cars/01.*), falls images/cars.* fehlt.
- Status-Chip: liest zuerst die Live-Datei des Bots (Branch status-data), erst danach die statische status.json. Nach dem Launch zeigt "unlisted" nicht mehr "vor Release".
- Partner-Seite: "Offizieller Hosting-Partner" geändert in "Hosting-Partner (Affiliate)".
- Datenschutz: Abschnitte zu ZAP-Bannern (werden beim Laden der Seite abgerufen), Google Fonts und Statusanzeige ergänzt. Bitte rechtlich prüfen lassen.
