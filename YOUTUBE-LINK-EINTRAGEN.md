# YouTube-Livestream und Launch-Intro

Der Countdown auf der Startseite bleibt auf den offiziellen Release-Zeitpunkt eingestellt. Sobald er null erreicht, startet das Video `launch-video/gta6-launch.mp4`. Am Ende erscheint kurz „VICE CITY IS YOURS.“ und die Seite leitet anschließend zum geplanten YouTube-Livestream weiter. Als Sicherheitsgrenze erfolgt die Weiterleitung spätestens nach 40 Sekunden.

Öffentlicher Livestream-Link: https://www.youtube.com/watch?v=Mb1ktnaW00o

YouTube zeigt auf derselben Watch-Seite vor dem Start die geplante Übertragung bzw. den Wartebildschirm, sofern der Stream in YouTube Studio korrekt geplant und veröffentlicht wurde. Wenn der Link in YouTube Studio geändert wird, muss die URL zusätzlich in `site.js` in `YOUTUBE_STREAM_URL` aktualisiert werden.

Hinweis: Browser blockieren manchmal die automatische Wiedergabe mit Ton. In diesem Fall startet das Intro – sofern möglich – stumm und Besucher können über „Enable sound“ den Ton einschalten.

Zum erneuten Testen: `https://pulseneon.de/?replay=1` (zeigt das Intro erneut, ohne die offizielle Countdown-Zeit zu ändern).
