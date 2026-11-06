# Neon Pulse – Status-Alarm einrichten

## Architektur

1. Die drei Website-Formulare senden an Formspree (`xaeeklye`).
2. Formspree Simple Webhook sendet die Formularübermittlung an einen Cloudflare Worker.
3. Der Worker validiert Honeypot, Einwilligung und E-Mail-Adresse und leitet sie serverseitig an Buttondown weiter.
4. Buttondown legt neue Adressen als `unactivated` an und sendet eine Double-Opt-in-Bestätigung.
5. Erst bestätigte Abonnenten erhalten spätere Statusmeldungen.
6. GitHub Actions führt `monitor.py` regelmäßig aus und löst bei bestätigter Statusänderung eine Buttondown-Mail aus.

## A. Cloudflare Worker

Die vollständige Anleitung und der Worker-Code liegen in `cloudflare-worker/README.md`
und `cloudflare-worker/worker.js`.

Benötigte verschlüsselte Worker-Secrets:
- `BUTTONDOWN_API_KEY`
- `FORMSPREE_WEBHOOK_TOKEN`

Optionale Variable:
- `SITE_URL=https://pulseneon.de`

## B. Formspree

Im Formspree-Dashboard für Formular `xaeeklye`:
- Webhooks / Plugins öffnen.
- **Simple Webhook** auswählen.
- Worker-URL eintragen:
  `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/formspree/YOUR_TOKEN`

Formspree dokumentiert Webhooks derzeit für Professional- und Business-Pläne.
Ohne diese Funktion kann Formspree die Anmeldung nicht an den Worker weiterleiten.

## C. Buttondown

- API-Key erzeugen.
- Double Opt-in aktiviert lassen.
- API-Key als `BUTTONDOWN_API_KEY` im Cloudflare Worker und als GitHub Actions Secret speichern.
- Niemals den API-Key in `site.js`, HTML oder öffentliche Repository-Dateien schreiben.

Der Worker verwendet `type: unactivated`. Die Bestätigung muss durch den Besucher erfolgen.

## D. GitHub Actions

Die aktive Workflow-Datei liegt unter:
`.github/workflows/status-monitor.yml`

In GitHub unter **Settings → Secrets and variables → Actions**:
- `BUTTONDOWN_API_KEY` als Repository Secret hinzufügen.

Der Workflow läuft nach Zeitplan (alle fünf Minuten; GitHub kann verzögern).
Die Standard-E-Mail-Sperre `ALERT_FROM` in `monitor.py` steht auf
`2026-11-18T00:00:00+00:00`. Vor diesem Zeitpunkt werden echte Statusmails
unterdrückt. Der Workflow ist kein garantierter Echtzeitdienst.

## E. End-to-End-Test

1. Worker deployen und beide Secrets setzen.
2. Formspree Simple Webhook einrichten.
3. Auf der Live-Seite eine eigene Testadresse anmelden.
4. Prüfen, dass die Submission bei Formspree ankommt.
5. Prüfen, dass die Adresse in Buttondown als **Unactivated** erscheint.
6. Bestätigungs-E-Mail öffnen und Anmeldung bestätigen.
7. In GitHub Actions `status-monitor` manuell starten und `simulate=up` setzen.
8. Im Log muss `DRY RUN, would send` stehen. Der Simulationslauf darf keine echte E-Mail senden.

## Sicherheit & Datenschutz

- Der Buttondown-Key bleibt serverseitig.
- Der Worker akzeptiert nur POST, JSON, gültige E-Mail und `consent=yes`.
- Der Honeypot `_gotcha` wird geprüft.
- Die Worker-URL enthält ein zufälliges Geheimnis. Bei Offenlegung rotieren.
- Formspree Simple Webhooks sind laut Dokumentation nicht als signierte Requests beschrieben; der URL-Token schützt den Endpunkt.
- Datenschutzhinweise, Anbieterbedingungen, Aufbewahrungsfristen und internationale Datentransfers vor dem Live-Betrieb prüfen.
