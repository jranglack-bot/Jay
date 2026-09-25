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
  `js/main.js`, CSS, Bilder, Video). Vor dem Pushen immer bauen und prüfen.

## Inhalte ändern

- Webinar-Link, Hinweis-Banner, Live-Event (Datum/Countdown) und Extra-Links:
  Block `DEFAULTS` oben in `public/js/main.js`.
- Funnel-Link: Konstante `FUNNEL_URL` in `public/js/main.js`.
- Es gibt kein Admin-Cockpit und kein Backend (früher Netlify-Funktion, bei
  Hostinger nicht verfügbar) – Änderungen laufen über den Code.
- Datenschutz nennt Hostinger als Hoster; bei neuen Diensten (Tracking, Formulare,
  eingebettete Inhalte) die Datenschutzerklärung mit anpassen.
