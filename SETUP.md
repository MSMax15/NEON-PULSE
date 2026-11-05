# Status-Alarm einrichten (ca. 20 Minuten)

1. **Buttondown-Konto** anlegen (buttondown.com). Username notieren. Unter Settings den **API-Key** kopieren.
   Prüfe dort: Double Opt-in ist aktiv, Absendername ist gesetzt, und schau dir Tarif-Limits an
   (Anzahl Abonnenten und Mails pro Tag), denn jede Alarm-Mail geht an ALLE auf einmal.
2. In `site.js` ganz unten `DEIN-USERNAME` durch deinen Buttondown-Username ersetzen.
3. Im GitHub-Repo: **Settings > Secrets and variables > Actions > New repository secret**
   Name `BUTTONDOWN_API_KEY`, Wert = dein API-Key. (Den Key niemals in eine Datei schreiben.)
4. **Settings > Actions > General > Workflow permissions**: "Read and write permissions" wählen.
5. Dateien hochladen:
   - `bot/monitor.py`
   - `status-monitor.yml` nach `.github/workflows/status-monitor.yml` (beim Anlegen den ganzen Pfad als Dateinamen tippen)
   - alle Seiten: `index.html`, `alarm.html`, `impressum.html`, `datenschutz.html`, die sechs Kategorie-Seiten, `style.css`, `site.js`
6. **Test:** Actions > status-monitor > Run workflow > bei `simulate` z. B. `up` eintragen.
   Im Log steht "DRY RUN, would send ..." (es wird dabei NIE eine echte Mail verschickt).
   Ein Lauf ohne `simulate` zeigt in der Zeile "seen around the name", was der Bot auf der Rockstar-Seite sieht.
7. **Impressum und Datenschutz** ausfüllen und prüfen lassen. Ohne beides keine E-Mail-Adressen sammeln.

## Wichtig
- Das Repo muss **öffentlich** sein, sonst verbrauchen die Läufe alle 5 Minuten deine Gratis-Actions-Minuten.
- GitHub kann Läufe um mehrere Minuten verzögern oder bei sehr wenig Aktivität pausieren. Schau nach einigen Wochen in den Actions-Tab.
- Der Bot kann die Rockstar-Seite von hier aus nicht getestet werden. Prüfe am Launch-Tag (oder früher) das Log und passe `NAMES` in `monitor.py` an.
- Bis `ALERT_FROM` (Standard: 18. November 2026) verschickt der Bot keine Mails, damit keine Fehlalarme vor dem Launch rausgehen.
