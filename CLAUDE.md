# Projekt: Julians Way (persönliche Brand-Seite)

Statische Seite (Startseite + Impressum + Datenschutz), die **bei Hostinger per
Git-Import deployt** wird. Hostinger erkennt das Projekt am `package.json` in der
Repo-Wurzel, baut es als **Vite**-App und veröffentlicht, was auf `main` liegt.

## Arbeitsweise – immer erst zeigen, dann veröffentlichen

- **Nie direkt nach `main` pushen.** Änderungen zuerst auf einem eigenen Branch
  ablegen und dem Nutzer zeigen (Link zum Branch und/oder Screenshots der Seite).
- Erst nach ausdrücklicher Zustimmung nach `main` bringen. Danach geht es live.

## Hostinger-Kompatibilität immer erhalten

- `package.json`, `vite.config.js` und die HTML-Seiten liegen in der **Repo-Wurzel**.
- Jede HTML-Seite muss in `vite.config.js` unter `rollupOptions.input` stehen,
  sonst fehlt sie im Build. Neue Seite = dort eintragen.
- `js/main.js` liegt unter `public/js/` (klassisches Skript ohne `type="module"`,
  Vite kopiert `public/` 1:1). Nicht nach `js/` zurückverschieben.
- `npm run build` muss ein vollständiges `dist/` erzeugen (alle 3 HTML-Seiten,
  `js/main.js`, CSS, Bilder, Schriften, `frames/rooftop/`). Vor dem Pushen immer
  bauen und prüfen.

## Schriften und Rooftop-Animation

- Oswald und Open Sans liegen lokal in `fonts/` und werden per `@font-face` in
  `css/style.css` eingebunden. **Keine Google Fonts mehr per Link einbinden**
  (Datenschutz, siehe LG München I, Az. 3 O 17493/20).
- Die Scroll-Animation im Abschnitt „Mein Weg“ ist eine Bildsequenz auf einem
  Canvas, kein Video (Video-Scrubbing ruckelt, vor allem auf dem iPhone). Die
  Einzelbilder in `public/frames/rooftop/` stammen aus `assets/rooftop-assemble.mp4`:
  `ffmpeg -i assets/rooftop-assemble.mp4 -vf "select='not(mod(n\,2))'" -vsync vfr -c:v libwebp -quality 72 public/frames/rooftop/%03d.webp`
  Bei geänderter Bildanzahl `FRAMES` in `public/js/main.js` anpassen.

## Tonalität

- Keine Versprechen, keine Einkommens- oder Erfolgsaussagen über andere, keine
  Umsatz-Screenshots, kein künstlicher Zeitdruck. Julian erzählt ehrlich, wie es
  bei ihm läuft, und zeigt, wie das Ganze funktioniert.
- **Julian zeigt sein Gesicht.** Er zeigt anderen, wie es auch ohne eigenes
  Gesicht geht. Nie „ohne mein Gesicht zu zeigen“ über Julian schreiben.
- Einladen statt verkaufen: Einstieg über Julians Geschichte (goldener Button).
  Der zweite Hero-Button „Direkt zum Videotraining“ (Rahmen, nicht gefüllt)
  springt nur zum Abschluss (`#angebot`), nicht auf die externe Seite. Das Videotraining steht nicht in der Navigation. Kein
  fixierter Handy-Button, Button-Texte sagen ehrlich, wohin sie führen. Als
  leichtere Option gibt es Instagram (@julians.way).
- **Affiliate-Links kennzeichnen:** Julian bekommt über Videotraining und
  Live-Event eine Provision. Werbelinks gibt es im Abschluss, im
  Live-Event-Abschnitt und (Julian, 25.09.2026) als zwei **leise** Links
  (`.softlink`, kein Button) nach der Geschichte und nach den Zahlen. Jeder trägt
  ein Sternchen, und die Erklärung („*Werbung: Wenn du über meinen Link später
  etwas kaufst, bekomme ich eine Provision.“) steht direkt darunter, damit sie
  vor dem Klick sichtbar ist. Mehr als diese zwei leisen Links nicht ohne Julian.
- **Der Funnel ist ein Test, kein Video.** `FUNNEL_URL` führt auf einen Eignungstest
  (ein paar Klickfragen, anderes Design, danach das Video, bei Eignung ein Anruf).
  Das wird vor dem Klick angesagt (`#ctaSteps`, Linktext „Zu den Fragen und zum
  Video*“). Nie einen Knopftext versprechen, der nur „Video“ sagt.
- **Fragen-Abschnitt (`#fragen`):** nur Hürden, die der Besucher bei sich selbst
  sieht (Zeit, Gesicht, Vorwissen, Kosten, Anruf). Keine Antworten auf Vorwürfe
  gegen Julian oder das Modell (Schneeball, Network Marketing, „ist das seriös“),
  das hat Julian für allen öffentlichen Content ausgeschlossen. Preis: „wird im
  Gespräch erklärt“ (Julian, 25.09.2026), nie einen Betrag nennen.
- Messung ohne Cookies: jeder Werbelink zum Funnel hängt ein eigenes
  `utm_content` an (`story`, `zahlen`, `abschluss`, `abschluss-event`), über
  `funnelUrl()` in `public/js/main.js`. Leise Links bekommen es per `data-funnel`.

## Geplant (noch nicht auf die Seite)

- **Abschnitt „Das Videotraining“ (wichtigste Lücke):** Besucher erfahren auf
  der Seite nicht, was das Videotraining ist. Vor dem Abschluss (`#angebot`)
  kurz erklären: Inhalt, Länge, ob kostenlos, was danach passiert (z. B. Quiz,
  Gespräch, Programm). Fakten von der Funnel-Seite (`FUNNEL_URL`) bzw. aus
  Julians Vault holen, nichts erfinden. Danach die Hero-Buttons prüfen:
  „Erst mal meine Geschichte“ sagt Besuchern noch nicht, was sie davon haben.
- **Abschnitt „So läuft's bei mir konkret“:** Julians Arbeitsalltag (welche
  Reels, Zeitaufwand, Keywords und Gratis-Prompts), Kosten des SCB-Programms
  und, falls Julian das will, eine ehrliche Gesamtrechnung (Zeitraum,
  Provisionen, Kosten, Zeitaufwand, erster Euro) statt Umsatz-Screenshots.
  Alles von Julian bestätigen lassen. Offen: Ist Julian auch auf TikTok aktiv?

- **Live-Event:** Aktuell findet keins statt, der Abschnitt ist per
  `webinarActive: false` in `DEFAULTS` ausgeblendet. Beim nächsten Event
  `eventActive: true`, `eventDate` **mit Zeitzone** (`+02:00` Sommerzeit, `+01:00`
  Winterzeit) und `eventDurationMin` setzen. Dann zeigt die Seite Datum in Worten und
  Countdown, während des Events „WIR SIND LIVE“, und nach Start + Dauer schaltet sie
  von selbst zurück. Nur echte Termine, nie einen Timer, der neu startet oder immer
  „morgen“ ist (irreführende Verknappung, UWG).
- **Claude-Code-Kurs:** Julian erstellt gerade einen Kurs zu Claude Code, der
  später auf der Seite eingebunden werden soll. Erst einbauen, wenn Julian es sagt.
- **Persönliche Webseiten:** Links zu Julians weiteren Seiten fehlen noch
  (URLs von Julian erfragen). Dafür gibt es den Abschnitt „Mehr von mir“ über
  `links` in `DEFAULTS`.

## Inhalte ändern

- Webinar-Link, Hinweis-Banner, Live-Event (Datum/Countdown) und Extra-Links:
  Block `DEFAULTS` oben in `public/js/main.js`.
- Funnel-Link: Konstante `FUNNEL_URL` in `public/js/main.js`.
- Vorschaubild für geteilte Links: `public/og-bild.jpg` (1200 × 630), im `<head>`
  absolut verlinkt. Bilder unter `assets/` taugen dafür nicht, sie bekommen beim
  Build einen Hash im Namen.
- Lokale Vorschau: Eintrag `julians-way-net` in `D:\Instagram Content\.claude\launch.json`
  (Vite auf Port 5183).
- Es gibt kein Admin-Cockpit und kein Backend (früher Netlify-Funktion, bei
  Hostinger nicht verfügbar) – Änderungen laufen über den Code.
- Datenschutz nennt Hostinger als Hoster; bei neuen Diensten (Tracking, Formulare,
  eingebettete Inhalte) die Datenschutzerklärung mit anpassen.
