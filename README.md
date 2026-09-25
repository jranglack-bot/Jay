# Julians Way — Persönliche Brand-Seite

Dunkle, goldene One-Page-Site (Hero, Story, Ergebnisse, Werte, Webinar, CTA)
plus Impressum und Datenschutz. Gehostet bei **Hostinger** per Git-Import.

## Struktur

| Datei | Zweck |
|---|---|
| `index.html` | Die komplette Startseite |
| `impressum.html`, `datenschutz.html` | Rechtliche Seiten |
| `css/style.css` | Design: Dunkel `#1E1E1E`, Gold `#BC965F`, Oswald + Open Sans |
| `public/js/main.js` | Animationen, Partikel, Counter **und die Konfiguration** |
| `assets/` | Bilder und das Rooftop-Video (Quelle für die Einzelbilder) |
| `public/frames/rooftop/` | 61 Einzelbilder der Scroll-Animation „Rooftop“ |
| `fonts/` | Oswald und Open Sans, lokal eingebunden (keine Google-Server) |
| `package.json`, `vite.config.js` | Build-Setup, damit Hostinger die Seite erkennt |

## Webinar-Link, Hinweis-Banner & Co. ändern

Ganz oben in `public/js/main.js` im Block `DEFAULTS`:

- `webinarUrl` — Ziel des Buttons „Zur Anmeldung"
- `note` + `noteActive: true` — goldener Hinweis-Banner oben auf der Seite
- `eventDate` + `eventActive: true` — Live-Event-Modus mit Countdown
- `links` — Extra-Buttons („Mehr von mir"), z. B. `{ label: "5 Reel-Hooks", url: "https://…" }`

Einfacher: Claude sagen, was geändert werden soll.

## Hosting (Hostinger)

Hostinger erkennt das Projekt am `package.json` als **Vite**-App, baut mit
`npm run build` und veröffentlicht den Ordner `dist/` vom Branch `main`.

Lokal testen: `npm install` → `npm run dev` (Vorschau) bzw. `npm run build`.
