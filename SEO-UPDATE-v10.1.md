# NEON PULSE – SEO-Update auf Basis Version 10

Stand: 08.11.2026. Diese Version behält Layout, CSS, Bilder, SVG-Waffenrad, bestehende Navigation und JavaScript-Funktionen aus v10 bei.

## Umgesetzte technische/on-page Änderungen
- Individuelle deutsche Seitentitel und Meta-Descriptions für alle 22 bearbeiteten HTML-Seiten; 20 URLs bleiben indexierbar, zwei Rechtsseiten und die alte Pre-Server-Hub-Seite sind noindex.
- Open-Graph-Titel und -Beschreibungen an die jeweiligen Seiten angepasst.
- Twitter-Titel/-Beschreibungen ergänzt bzw. aktualisiert.
- `og:locale=de_DE` ergänzt.
- Startseite erhält ein schlichtes `WebSite`-JSON-LD ohne erfundene Bewertungen oder Suchfunktion.
- Sitemap automatisch aus den Canonical-URLs aller 20 indexierbaren HTML-Seiten neu erstellt; `gta6-pre-server-hub.html` bleibt wegen inhaltlicher Überschneidung und abweichendem Alt-Branding `noindex,follow`. Impressum und Datenschutz behalten ihr bestehendes `noindex` und sind nicht in der Sitemap.
- Sitemap-`lastmod` auf 2026-11-08 gesetzt, weil Metadaten/SEO an diesem Tag überarbeitet wurden.
- UTF-8 bleibt erhalten.

## Keyword-Zuordnung (eine Hauptintention pro URL)
- `/`: GTA 6, GTA 6 Countdown, GTA 6 News
- `/cheats.html`: GTA 6 Cheats
- `/cars.html`: GTA 6 Autos / Fahrzeuge
- `/weapons.html`: GTA 6 Waffen
- `/map.html`: GTA 6 Map / Leonida / Vice City
- `/gameplay.html`: GTA 6 Gameplay / Trailer
- `/gta6-server-status.html`: GTA 6 Server Status
- `/gta6-server-hosting.html`: GTA 6 Server mieten / Hosting-Guide
- `/fivem-server-hosting.html`: FiveM Server mieten
- `/sixm-server-mieten.html`: SixM Server mieten (Begriff ausdrücklich als nicht offiziell bestätigt einordnen)
- Blogartikel: jeweils enges Long-Tail-Thema statt dieselben Keywords wie die Haupt-Landingpages.

## Vor dem nächsten SEO-Schritt wichtig
1. Die Bereiche mit Platzhaltern (`CODE-HERE`, `Car name 05`, `Weapon name 07`, leere Video-/Karten-Slots) mit echten, belegten Informationen füllen oder sichtbar als „noch nicht verfügbar“ kennzeichnen. Keine erfundenen Cheat-Codes, Fahrzeugnamen, Waffen oder Kartenorte veröffentlichen.
2. Jede Faktenseite braucht Quellenlinks zu Rockstar-News/Trailern oder anderen Primärquellen und ein sichtbares „Zuletzt geprüft am“-Datum.
3. Keine Fake-Reviews, keine selbst erfundenen Trustpilot-Sterne und kein `AggregateRating`-Schema. Trustpilot erst nach echter Verifizierung und mit offiziellem Widget/echten Bewertungen zeigen.
4. Internationale SEO-Seiten erst veröffentlichen, wenn vollständige redaktionelle EN-/PT-Inhalte vorliegen. Dann `/en/` und `/pt-br/` mit gegenseitigen `hreflang`-Tags und passenden Canonicals ergänzen. Keine automatische IP-Weiterleitung.
5. Nach Upload: Search Console → Sitemap `https://pulseneon.de/sitemap.xml` erneut einreichen; danach URL-Prüfung für Startseite, Status- und Hosting-Seite.

## Realistische Erwartung
Diese Änderungen verbessern technische Klarheit, Snippets und Seitenzuordnung. Sie garantieren keine Top-Position. Rankings hängen auch von Konkurrenz, Suchintention, Inhaltstiefe, Erwähnungen/Links, Ladezeit und Nutzersignalen ab.
