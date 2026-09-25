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
  Live-Event eine Provision. Werbelinks gibt es nur im Abschluss und im
  Live-Event-Abschnitt. Jeder trägt ein Sternchen, und die Erklärung
  („*Werbung: Wenn du über meinen Link später etwas kaufst, bekomme ich eine
  Provision.“) steht direkt darunter, damit sie vor dem Klick sichtbar ist.

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
  `webinarActive: false` in `DEFAULTS` ausgeblendet. Beim nächsten Event wieder
  einschalten (oder `eventActive` mit `eventDate` für den Countdown).
- **Claude-Code-Kurs:** Julian erstellt gerade einen Kurs zu Claude Code, der
  später auf der Seite eingebunden werden soll. Erst einbauen, wenn Julian es sagt.
- **Persönliche Webseiten:** Links zu Julians weiteren Seiten fehlen noch
  (URLs von Julian erfragen). Dafür gibt es den Abschnitt „Mehr von mir“ über
  `links` in `DEFAULTS`.

## Inhalte ändern

- Domain: **julians-way.net** (Hostinger, Node.js-Web-App, baut automatisch bei
  jedem Push auf `main`). `og:url` und `og:image` in `index.html` nutzen die volle
  Adresse; bei einem Domainwechsel dort anpassen. Das Vorschaubild für geteilte
  Links ist `public/og-image.jpg` (1200 × 630, aus `assets/julian-rooftop-gold.jpg`).

- Webinar-Link, Hinweis-Banner, Live-Event (Datum/Countdown) und Extra-Links:
  Block `DEFAULTS` oben in `public/js/main.js`.
- Funnel-Link: Konstante `FUNNEL_URL` in `public/js/main.js`.
- Es gibt kein Admin-Cockpit und kein Backend (früher Netlify-Funktion, bei
  Hostinger nicht verfügbar) – Änderungen laufen über den Code.
- Datenschutz nennt Hostinger als Hoster; bei neuen Diensten (Tracking, Formulare,
  eingebettete Inhalte) die Datenschutzerklärung mit anpassen.
