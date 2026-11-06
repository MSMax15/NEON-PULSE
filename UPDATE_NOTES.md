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

## Neu (Assistent)
- Zwei Ratgeber-Seiten: `teamspeak-server-mieten.html`, `minecraft-server-mieten.html` (dauerhaft gesucht, auch nach dem GTA-Launch). Verlinkt in Menü, Sitemap und untereinander.
- Alle Seiten: canonical, Open Graph und Social-Vorschaubild ergänzt.
- `site.js`: optionales, cookiefreies Klick-Zählen für Affiliate-Links (aus, bis ein GoatCounter-Code gesetzt ist).
- `LAUNCH-DAY.md`: Checkliste bis und nach dem 19.11.

## Live-Modus V1 (Assistent)
- Neuer Block `#live` auf der Startseite: erscheint, wenn der Countdown auf null geht, oder wenn `live.json` auf `"mode": "live"` steht.
- Der YouTube-Player lädt erst nach Klick ("Ich bin 18+ ..."). Kanal: @FeedErrorclipz.
- `live.json` ist dein Schalter (auch per GitHub-App am Handy änderbar):
  - `"mode": "auto"`    zeigt "STREAM" und den Player (YouTube zeigt selbst, ob gerade ein Stream läuft)
  - `"mode": "live"`    zeigt "LIVE" mit rotem Punkt (nur setzen, wenn du wirklich live bist)
  - `"mode": "offline"` zeigt "Gerade offline" und den Kanal-Link
  - `"note"`: kurzer Text (z. B. nächster Stream), `"videoId"`: optional die 11-stellige ID eines bestimmten Videos oder Mitschnitts
- CSP: `frame-src` erlaubt nur `https://www.youtube-nocookie.com`. Datenschutz um den YouTube-Absatz ergänzt.
- Hero-Text ohne die unbestätigte Angabe "midnight in your time zone".
