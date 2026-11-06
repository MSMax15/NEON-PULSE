# E-Mail-Statusalarm – Integration

## Was jetzt im Repository vorbereitet ist
- Cloudflare Worker als serverseitige Brücke Formspree → Buttondown.
- Buttondown API-Key wird nur als verschlüsseltes Worker-/GitHub-Secret verwendet.
- Neue Abonnenten werden mit `type: unactivated` angelegt (Double Opt-in).
- Aktiver GitHub Actions Workflow unter `.github/workflows/status-monitor.yml`.
- Alle drei Website-Formulare bleiben bei Formspree `xaeeklye`.

## Was der Website-Code nicht selbst erledigen kann
Die externe Verbindung muss in den jeweiligen Dashboards aktiviert werden:
- Cloudflare: Worker deployen und Secrets setzen.
- Formspree: Simple Webhook auf die Worker-URL konfigurieren (Planvoraussetzung beachten).
- Buttondown: API-Key erzeugen und Double Opt-in beibehalten.
- GitHub: `BUTTONDOWN_API_KEY` als Actions Secret setzen.

Ohne diese Dashboard-Schritte ist der Versandweg noch nicht live. Die Website kann
keine geheimen API-Schlüssel sicher selbst speichern, weil GitHub Pages nur
statische Dateien ausliefert.

## Testkriterium
Eine Testadresse muss in Buttondown zunächst als `Unactivated` auftauchen,
eine Bestätigungs-E-Mail erhalten und nach Klick als aktiver Abonnent erscheinen.
Erst danach ist sie Empfänger für Statusmails.
