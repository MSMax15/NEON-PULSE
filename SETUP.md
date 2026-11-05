# GTA 6 Status-Alarm einrichten

## Voraussetzungen

- Ein Buttondown-Konto mit bestätigter Absenderadresse.
- GitHub Actions für dieses Repository aktiviert.
- Ein Repository-Secret namens `BUTTONDOWN_API_KEY`.

## Einrichtung

1. Lege bei Buttondown den Verteiler an und aktiviere Double Opt-in. Prüfe Absender, Datenschutz und Tarif-/Versandlimits.
2. Öffne im GitHub-Repository **Settings → Secrets and variables → Actions**.
3. Lege unter **Repository secrets** das Secret `BUTTONDOWN_API_KEY` an. Trage ausschließlich dort den Buttondown-API-Key ein. Niemals den Key in `site.js`, HTML, YAML, ZIP oder einen Commit schreiben.
4. Prüfe unter **Settings → Actions → General → Workflow permissions**, dass GitHub Actions Schreibrechte für `GITHUB_TOKEN` erhalten darf. Das Workflow-YAML begrenzt `contents: write` auf den Statusmonitor-Job und nutzt den Token nur in den Push-Schritten.
5. Lade die Projektdateien in das Repository hoch. Wichtig sind:
   - `monitor.py`
   - `requirements.txt`
   - `.github/workflows/status-monitor.yml`
   - `.github/workflows/security-audit.yml`
   - `.github/dependabot.yml`
   - `status.json`
   - die Website-Dateien und Assets
6. Öffne **Actions → status-monitor**. Starte **Run workflow** zunächst mit `simulate` leer, damit ein normaler Lauf den Status nur prüft. Für einen Trockenlauf kannst du `up`, `limited`, `down` oder `maintenance` eintragen. Simulationen ändern den gespeicherten Status nicht und versenden keine echte E-Mail.
7. Prüfe die Actions-Logs. Nach dem ersten Lauf sollte der Branch `status-data` automatisch erstellt worden sein. Der Statusmonitor aktualisiert dort `status.json`.
8. Mache vor dem Launch einen echten Test mit einem Testverteiler und bestätige, dass Formspree-Anmeldungen und Buttondown-E-Mails korrekt ankommen.

## Sicherheitsregeln

- `BUTTONDOWN_API_KEY` gehört ausschließlich in GitHub Repository Secrets.
- Der Workflow benötigt Schreibrechte, um den Branch `status-data` zu aktualisieren. Gib keine zusätzlichen Rechte frei.
- Prüfe Dependabot-Pull-Requests und den Workflow `security-audit` regelmäßig.
- Der Monitor verschickt keine E-Mail vor `ALERT_FROM` (Standard: `2026-11-18T00:00:00+00:00`).
- Ohne `BUTTONDOWN_API_KEY` bricht ein echter Versandversuch ab, statt den Status als erfolgreich versendet zu speichern.
- Simulationen verschicken keine echten E-Mails und schreiben keinen Status.
- Formspree-Anmeldungen allein aktivieren noch keinen automatischen Alarmdienst.

## Grenzen

- GitHub Actions können sich verzögern; der 5-Minuten-Zeitplan ist keine Echtzeitgarantie.
- Rockstar kann seine Statusseite ändern. Prüfe am Launch-Tag die Logs und passe `NAMES`/die Status-Erkennung in `monitor.py` nur anhand bestätigter Seitenelemente an.
- Impressum und Datenschutzerklärung müssen vollständig und rechtlich geprüft sein, bevor du personenbezogene Daten sammelst oder E-Mails verschickst.
