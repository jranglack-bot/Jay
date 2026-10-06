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
- `js/main.js` (Startseite), `js/sub.js` (Unterseiten) und `js/sparks.js` (Gold-Funken,
  überall) liegen unter `public/js/` (klassische Skripte ohne `type="module"`, Vite kopiert
  `public/` 1:1). Nicht nach `js/` zurückverschieben. `js/sparks.js` immer nach `js/main.js`
  bzw. `js/sub.js` laden (es braucht die schon gesetzten Klassen der Scroll-Szenen).
- Hostinger liefert Dateien aus `public/` mit 7 Tagen Browser-Cache aus. Deshalb hängt
  das Plugin in `vite.config.js` bei jedem Build `?v=<Zeitstempel>` an jedes `js/*.js`,
  sonst sehen wiederkehrende Besucher neues HTML mit altem Skript (25.09.2026). Nicht
  entfernen. Ändert sich ein Bild in `public/` (z. B. `og-bild.jpg`), den Dateinamen ändern.
- **Vite 6, nicht neuer (05.10.2026):** Hostinger meldete fünf Schwachstellen, alle in Vite 5
  und esbuild. Sie betreffen nur den Entwicklungsserver (`npm run dev`), nicht die fertige
  Seite. Behoben mit Vite 6.4.3 (`npm audit`: 0). Vite 7 und 8 brauchen Node 20.19+, Hostinger
  baut aber mit Node 18 (Build-Log). Erst nach Umstellung auf Node 22 im hPanel auf Vite 7/8
  gehen. Den Entwicklungsserver nie mit `--host` ins Netz stellen.
- **Sicherheitsmeldungen von Hostinger (06.10.2026):** `source-map-js` mit `npm audit fix` auf
  1.2.2 gehoben (nur Sperrdatei). Die Meldung zu `esbuild` (GHSA-gv7w-rqvm-qjhr, „Withdrawn
  Advisory“) ist von GitHub zurückgezogen, sie betrifft nur das Deno-Modul von esbuild. Nicht
  per `overrides` auf esbuild 0.28 zwingen, Vite 6 braucht 0.25. Neue Meldungen immer mit
  `npm audit` gegenprüfen.
- `npm run build` muss ein vollständiges `dist/` erzeugen (alle 5 HTML-Seiten,
  `js/main.js`, `js/sub.js`, `js/sparks.js`, CSS, Bilder, Schriften).
  Vor dem Pushen immer bauen und prüfen.

## Schriften und Splitter-Animation

- Oswald und Open Sans liegen lokal in `fonts/` und werden per `@font-face` in
  `css/style.css` eingebunden. **Keine Google Fonts mehr per Link einbinden**
  (Datenschutz, siehe LG München I, Az. 3 O 17493/20).
- **Splitter-Animation im Abschnitt „Mein Weg“ (seit 06.10.2026):** Julian wollte, dass
  die Splitter „komplett von außen kommen, über die komplette Webseite reingeflogen“. Darum
  keine Bildsequenz mehr (die 61 Einzelbilder aus `assets/rooftop-assemble.mp4` blieben im
  Rahmen), sondern Code: `public/js/main.js` („Splitter-Animation“) zerlegt das Foto
  `assets/julian-rooftop-sonnenuntergang.webp` (letztes Bild des Videos) in ein Bruchmuster
  um einen Einschlagpunkt (Handy 70, Computer 123 Splitter). Sie starten
  außerhalb des Bildschirms, fliegen in Bögen über die ganze Seite in den Rahmen, die äußeren
  zuerst, landen mit goldenen Fugen, dann blendet das ganze Foto darüber ein. Beim
  Weiterscrollen löst es sich wieder auf, beim Hochscrollen genauso (Julian, 06.10.2026), aber
  das Bild soll „einmal klar zu sehen sein“: Es bleibt ganz, solange die Rahmenmitte zwischen
  knapp unter der Bildschirmmitte und 30 % der Bildschirmhöhe steht (`HOLD`, `UP_HOLD`), und
  einmal fertig mindestens 1,2 s (`MIN_WHOLE`), auch wenn jemand schnell vorbeiscrollt. Danach
  geht es erst mit dem nächsten Scrollen weiter, nie von selbst. Ist der Rahmen nicht zu
  sehen, schaltet es ohne Flug um. Fliegende Splitter liegen auf einer festen Leinwand
  über der Seite (`.shards-layer`, z-index 40, unter Navigation und Handy-Menü), gelandete auf
  einer Leinwand im Rahmen, sonst wackeln sie beim Scrollen nach. Ohne Skript und mit
  reduzierter Bewegung steht nur das Foto da. Das Foto lädt erst, wenn der Abschnitt in die
  Nähe kommt (47 KB statt vorher 2,1 MB Einzelbilder).

## Tonalität

- Keine Versprechen, keine Einkommens- oder Erfolgsaussagen über andere, keine
  Umsatz-Screenshots, kein künstlicher Zeitdruck. Julian erzählt ehrlich, wie es
  bei ihm läuft, und zeigt, wie das Ganze funktioniert.
- **Texte (neu geschrieben 25.09.2026 nach Recherche):** Verbindlich sind Julians
  Regeln im Vault `Claude Gehirn\00 Kontext\Schreibstil.md`, `Schmerzpunkte.md`,
  `ICP.md` und `Über Mich.md` (Fakten). Kurz: konkrete Szenen und Zahlen statt
  Schlagworten, fröhlich und selbstironisch statt schwer, ganze Sätze, keine
  Dreierreihen, kein „Kein X, kein Y“. Nicht verwenden: „ehrlich“ (so nennen sich
  die Spam-Testberichte), „Hamsterrad“, „mehr Zeit für die Familie“, „ohne
  Vorerfahrung“ und ähnliche Wörter, die die Konkurrenzseiten wortgleich benutzen.
  Belege: `~/.agent-reach/recherche/webseite-text/notizen.md`.
- **Story-Fakten** (Geldsorgen 2025, Satz seiner Frau, erster Verkauf nach einem Monat,
  Augenzucken weg, Schuhe ohne Blick aufs Konto) stehen im Vault `Über Mich.md`,
  „Nachtrag 25.09.2026“. Das neue Auto bewusst nicht auf die Seite (Coach-Optik), nie
  „Geld verdienen, ohne was zu tun“. Hinweise „kein Versprechen“ nur an zwei Stellen
  (Kapitel „Heute“ und Zahlen), jeder weitere kühlt die Emotion ab. Direkt vor dem
  Abschluss-Knopf steht das Echo „Letztes Jahr … Heute ist dieser Druck weg.“
- **Die Seite passt zu @julians.way (Julian, 25.09.2026):** Hero und Laufband nennen die
  drei Themen seiner Reels (auf Instagram wachsen, verkaufen ohne eigenes Produkt, KI), dann
  Julian als Papa mit Job. Abschnitt `#gelernt` („Woher ich das weiß“) sagt klar, dass er
  dieses Wissen im SCB-System gelernt hat; KI ist sein eigener Teil (er betreut im
  Programm den Bereich KI). Oben im Abschnitt steht „Woher ich das weiß.“ groß und fließt
  beim Scrollen von links herein, „Was mir das SCB-System beigebracht hat“ von rechts
  (`data-flow`, `.flowhead`); darunter vier Kacheln in Ich-Form (Julian, 25.09.2026). Die
  Erklärung „Was ist das SCB-System?“ steht seit 06.10.2026 oben in `#scb`. Der **Look bleibt** schwarz und gold, weil er so zum
  SCB-Funnel passt (Julian, 25.09.2026).
- **Julian zeigt sein Gesicht.** Er zeigt anderen, wie es auch ohne eigenes
  Gesicht geht. Nie „ohne mein Gesicht zu zeigen“ über Julian schreiben.
- **Erst erklären, dann anbieten (Umbau 06.10.2026):** Direkt unter dem Hero steht „Was ist
  das SCB-System?“ (`#scb`): ein Satz, was es ist, Julians Satz dazu (dort gelernt, betreut
  den Bereich KI) und ein Kasten mit vier Punkten. Der goldene Hero-Knopf „Was ist das
  SCB-System?“ springt dorthin, der Knopf „Zum Videotraining ↓“ in `#scb` springt zum
  Abschluss (`#angebot`, `data-jump="scb"`). Der frühere Angebotskasten `#videotraining`
  (05.10.2026, mit „So geht's nach dem Klick weiter“ und Anruf) ist raus, Julian: Das würde
  ihn direkt nach dem Hero abschrecken. Den Ablauf nach dem Klick erst im Abschluss zeigen,
  wenn die Leute wissen, wer Julian ist. Der zweite Hero-Knopf „Erst mal wissen, wer ich
  bin“ führt zu `#gelernt`. Das Videotraining steht nicht in der Navigation, kein fixierter
  Handy-Button, Button-Texte sagen ehrlich, wohin sie führen. Als leichtere Optionen gibt es
  Instagram (@julians.way) und die Anleitungen.
- **Affiliate-Links kennzeichnen:** Julian bekommt über Videotraining, Live-Event und
  die Tools eine Provision. Werbelinks gibt es nur im Abschluss, im Live-Event-Abschnitt und
  auf `tools.html`. Jeder trägt ein Sternchen, und die Erklärung („*Werbung:
  Wenn du über meinen Link später etwas kaufst, bekomme ich eine Provision.“) steht
  direkt darunter, damit sie vor dem Klick sichtbar ist. Ausnahme `tools.html`, siehe unten.
- **Zwei leise Links** (`.softlink`, kein Button) nach „Woher ich das weiß“ und nach
  den Zahlen springen zum Abschluss (`#angebot`, `data-jump`), nicht nach draußen.
  So sieht jeder vor dem Klick die drei Schritte, und „Werbung“ steht nur einmal da;
  dreimal derselbe Werbelink wirkte wie eine Verkaufsseite (Julian, 25.09.2026).
  Mehr leise Links nicht ohne Julian.
- **Der Funnel ist ein Test, kein Video.** `FUNNEL_URL` führt auf einen Eignungstest
  (ein paar Klickfragen, anderes Design, danach das Video, bei Eignung ein Anruf).
  Das wird vor dem Klick angesagt (`#ctaSteps`, Linktext „Zu den Fragen und zum
  Video*“). Nie einen Knopftext versprechen, der nur „Video“ sagt.
- **Fragen-Abschnitt (`#fragen`):** nur Hürden, die der Besucher bei sich selbst
  sieht (Zeit, Gesicht, Vorwissen, Kosten, Anruf). Keine Antworten auf Vorwürfe
  gegen Julian oder das Modell (Schneeball, Network Marketing, „ist das seriös“),
  das hat Julian für allen öffentlichen Content ausgeschlossen. Preis: nie einen
  Betrag nennen und nicht betonen („Das Programm kostet Geld“ fand Julian
  schlecht). Das Gespräch ist eine Entscheidung des Besuchers: „Wenn es für dich
  passt, kannst du dich für ein persönliches Gespräch entscheiden. Dann ruft dich
  jemand vom Team an …“ (Julian, 25.09.2026). Nie „wir rufen dich an“, und eine
  Antwort nicht mit „Nur wenn du das möchtest“ beginnen lassen.
- Messung ohne Cookies: jeder Werbelink zum Funnel hängt ein eigenes
  `utm_content` an (`abschluss`, `abschluss-event`), über `funnelUrl()` in
  `public/js/main.js`. Wer über den Knopf in `#scb` oder einen leisen Link zum Abschluss
  gesprungen ist, klickt dort mit `abschluss-via-scb`, `abschluss-via-gelernt` bzw.
  `abschluss-via-zahlen`.
- **Reihenfolge (seit 06.10.2026):** Hero, „Was ist das SCB-System?“ (`#scb`),
  „Woher ich das weiß“ (`#gelernt`), „So ist ein Reel aufgebaut“ (`#aufbau`), „Die Anleitung
  dazu“ (`#anleitungen-start`), „Meine KI-Tools“ (`#ki-tools`), Geschichte (`#weg`), Zahlen,
  „So läuft's bei mir konkret“, Fragen, Abschluss (`#angebot`, drei Schritte dort nur als
  ein Satz). Im Live-Event-Modus steht der Event-Abschnitt direkt unter dem Hero, vor `#scb`. Anleitungen und Tools stehen bewusst früh und groß, Julian: „die gehen hier
  komplett unter“ (05.10.2026).

## Bewegung (seit 05.10.2026)

Julian wollte die Seite durchgängig in Bewegung, im Stand und beim Hoch- und Runterscrollen,
„Apple-Style“. Alles respektiert `prefers-reduced-motion` und funktioniert ohne Skript.

- **Explosionszeichnung `#aufbau`** („So ist ein Reel aufgebaut“): Abschnitt 380vh hoch,
  Inhalt klebt (sticky). Aus dem goldenen Instagram-Symbol wird ein Handy, es kippt in die
  Schrägansicht und zerlegt sich in sechs Ebenen, die nacheinander aufleuchten: 1 erster
  Satz, 2 Satz danach, 3 Text im Bild, 4 Video, 5 Caption, 6 Aufruf am Ende (Legende in
  der gleichen Reihenfolge). Phasen und Größen in `public/js/main.js` („Explosionszeichnung“),
  Startwerte in `css/style.css` zeigen ohne Skript das fertige, zerlegte Bild. Das Foto auf
  der Video-Ebene ist `assets/julian-hero-cinematic.jpg`. Der Abschnitt nutzt
  `overflow-x: clip`, nie `hidden` (sonst klebt nichts mehr). Julian findet die Szene
  „ultra krass“, sie bleibt so; Änderungen nur fürs Handy (Leistung, Größe).
- **Anleitungen-Block `#anleitungen-start`** direkt danach: vier PDF-Karten fächern beim
  Scrollen auf (`--f`, „Fächer“ in `public/js/main.js`), Knopf „Zu den Anleitungen“. Steht
  außerhalb von `#aufbau`, sonst schiebt er sich über das klebende Handy.
- **KI-Tools-Szene `#ki-tools`** (330vh, sticky): drei Chips (i10x, Higgsfield, ChatPlace)
  kreisen ums Handy und docken nacheinander an. i10x schreibt Text, Higgsfield legt per Scan
  einen neuen Hintergrund in Vulkan-Farben über das Video, ChatPlace zeigt einen Kommentar
  mit Keyword und schickt die Nachricht mit dem PDF raus. Legende nur mit Julians belegten
  Einsätzen (wie `tools.html`). Kein Werbelink in der Szene, der Knopf führt auf
  `tools.html`. Am Handy erscheint der Knopf erst am Ende anstelle der Legende.
- **Gold-Funken** (`js/sparks.js`): jedes Element mit `data-sparks="hero"` oder `"soft"`
  bekommt eine Leinwand mit aufsteigenden Punkten und Funken mit Schweif, `data-sparks-front`
  legt sie vor den Inhalt (Hero-Foto). Gezeichnet wird nur, was im Bild ist; am Handy
  weniger Teilchen. Ein Element mit `data-sparks` darf nicht `position: static` sein, wenn es
  per Skript sticky wird (sonst setzt das Modul `relative` und das Kleben ist weg).
- **Hero-Foto** bewegt sich ohne Maus (Julian: die meisten kommen mit dem Handy): langsamer
  Zoom, Lichtstreifen, Ecken leuchten, Funken davor, leichtes Wandern beim Scrollen. Das
  Kippen per Maus bleibt nur am Computer. `fetchpriority="high"`, damit es zuerst lädt.
- **Goldschrift** (`.grad`): ein heller Glanzstreifen läuft gut sichtbar durch (Julian: der
  alte Farbwechsel fiel kaum auf).
- **Leistung am Handy:** Scroll-Szenen schreiben CSS-Variablen nur bei Änderung (`setVar`),
  am Handy laufen kein Glanz auf den Handy-Rahmen und keine Weichzeichner-Schatten.
- Startseite außerdem: goldene Lesefortschritts-Linie oben (auch auf den Unterseiten),
  Laufband läuft im Stand langsam, beim Scrollen schneller und beim Hochscrollen andersherum,
  Hero tritt auf breiten Bildschirmen beim Wegscrollen zurück, Partikel pausieren außerhalb
  des Bildes.
- Neue Bewegung immer auf echtem Handy prüfen; Bildfolgen im Test (Playwright) zeigen nur,
  ob es richtig aussieht, nicht ob es flüssig läuft.

## Unterseiten (seit 05.10.2026)

- `anleitungen.html` „Meine Anleitungen“ (bis 05.10.2026 `prompts.html`): Julian: „Es sind
  ja keine Gratis-Prompts, es sind Anleitungen.“ Deshalb nie „Gratis-Prompts“ schreiben,
  Linktexte heißen „Zu den Anleitungen“ (nicht „Gratis-Anleitungen“). Inhalt: die Freebies
  aus dem Drive-Ordner
  „Freebies julians.way“ zum direkten Öffnen (Google-Drive-Links, Freigabe „jeder mit
  Link“), gruppiert nach „Prompts“ und „Content & Reels“. Jedes PDF vor dem Aufnehmen
  lesen: keine Einkommensversprechen, keine riskanten Tipps. Welche zurückgehalten sind
  und warum, steht als Kommentar in der Datei. Auf der Seite nicht erwähnen, dass es die
  PDFs auf Instagram über Keywords gibt, das interessiert Besucher nicht. Sie sind
  „Anleitungen, die ich selbst gerne nutze“. **Übersicht nach Themen** (Julian: „Das ist so
  viel … dass die Leute sich schneller durchklicken können“): oben „Wo stehst du gerade?“
  mit vier Themen-Knöpfen (Loslegen, Dein Thema finden, Reels & Bilder, Mehr Kommentare),
  die per `js/sub.js` filtern; je Karte nur ein kurzer Satz, die ganze Karte ist der Link.
  Neue PDFs einem Thema zuordnen und die Zahl im Knopf anpassen.
- `tools.html` „Meine Tools“: nur Tools, deren Einsatz in Julians eigenen Unterlagen
  belegt ist, mit seinem Werbelink aus dem Drive-Dokument „Affiliate Links“. Sternchen im
  Knopftext und `rel="sponsored"` an jedem Link. Die Erklärung steht auf Julians Wunsch
  dezent ganz unten (`.sub-fineprint`, 05.10.2026), nicht als Kasten oben. Das Sternchen
  im Knopf bleibt deshalb Pflicht, es ist die einzige Markierung vor dem Klick.
- Sechs Tools seit 05.10.2026, in der Reihenfolge, in der ein Reel bei Julian entsteht:
  ViralityAI (virale Ideen), i10x (ChatGPT, Claude, Gemini und Grok in einer App), Higgsfield
  (die neuesten Video- und Bildmodelle), HeyGen (KI-Avatare, z. B. Julians KI-Podcast-Avatarin,
  Stimme ändern, Reels übersetzen), ElevenLabs (Text zu Sprache und zurück, Stimmen, Musik,
  Soundeffekte), ChatPlace (Keyword-Automationen). Julian: Karten müssen erklären, was das Tool
  ist, nicht nur seinen Insider-Fall („Vulkan-Trick“ versteht keiner). Modellnamen bei
  Higgsfield (Stand 05.10.2026: Seedance 2.5, Kling 3.0, Nano Banana) veralten, vor
  Textänderungen prüfen. Nie empfehlen, fremde Reels zu übersetzen und wiederzuverwenden
  (Urheberrecht). Woher jeder Satz stammt, steht als Kommentar in `tools.html`. Ein neues
  Tool erst aufnehmen, wenn Julian gesagt hat, wofür er es nutzt.
- Beide stehen in `vite.config.js`, in der Navigation der Startseite und im Footer.
  Unterseiten laden `js/sub.js` statt `js/main.js`, deshalb dort keine `.reveal`-Klassen
  verwenden. `js/sub.js` sorgt dafür, dass die Seiten oben öffnen (Julian: die Anleitungen-Seite
  öffnete unten), und lässt Karten und Gruppentitel beim Scrollen nacheinander erscheinen.

## Geplant (noch nicht auf die Seite)

- **Abschnitt „Das Videotraining“ (wichtigste Lücke):** Besucher erfahren auf
  der Seite nicht, was das Videotraining ist. Vor dem Abschluss (`#angebot`)
  kurz erklären: Inhalt, Länge, ob kostenlos, was danach passiert (z. B. Quiz,
  Gespräch, Programm). Fakten von der Funnel-Seite (`FUNNEL_URL`) bzw. aus
  Julians Vault holen, nichts erfinden. Danach die Hero-Buttons prüfen:
  „Erst mal meine Geschichte“ sagt Besuchern noch nicht, was sie davon haben.
- **„So läuft's bei mir konkret“ ist seit 25.09.2026 der Abschnitt `#werte`:** vier
  Kacheln mit Antworten statt Versprechen, nur Julians eigene Fakten (Reels am Anfang
  gefloppt, Live-Calls vom Team, erster Umsatz nach einem Monat, circa eine Stunde am
  Tag, vieles per KI vom Handy, Kids sitzen manchmal daneben). Kacheln, die nur
  ankündigen („ich sag dir, was klappt“), ohne es zu zeigen, hat Julian abgelehnt.
  **Nicht zu viel erklären:** Julian: „Wenn man zu viel erklärt, macht man sich
  angreifbar.“ Darum ist die Frage „Was hast du davon?“ wieder raus.

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

## Google und Suche (seit 05.10.2026)

Julian fand die Seite bei Google nur über die genaue Adresse, mit Weltkugel statt Symbol und
„julians-way.net“ statt Seitenname.
- **Seitensymbol** als echte Dateien in `public/`: `favicon.ico` (16, 32, 48), `icon-192.png`,
  `icon-512.png`, `apple-touch-icon.png`. Motiv „J·W“ wie das Logo, gold auf dunkel. Kein
  `data:`-Symbol mehr, das zeigt Google nicht an. Neue Seiten bekommen dieselben drei Zeilen.
- **Seitenname:** JSON-LD (`WebSite` „Julians Way“, `Person` „Julian Ranglack“ mit Instagram)
  im `<head>` von `index.html`, dazu `og:site_name` auf allen Seiten. Den vollen Namen hat
  Julian ausdrücklich gewollt (05.10.2026), damit man die Seite auch darüber findet.
- `public/robots.txt` und `public/sitemap.xml` (nur die Startseite). Anleitungen und Tools
  haben `noindex, follow`: Julian will, dass Besucher über Google zuerst auf die Startseite
  kommen (06.10.2026). Neue Seite: mit Julian klären, ob sie in die Suche soll. Jede Seite
  hat `rel="canonical"`.
- Google Search Console: Domain-Property `julians-way.net`, bestätigt per DNS-TXT-Eintrag
  `google-site-verification=…` bei Hostinger (eingetragen 06.10.2026). Den TXT-Eintrag nie
  löschen, sonst verliert Julian den Zugriff. Sitemap einreichen und Indexierung beantragen
  macht Julian selbst, ebenso den Link in der Instagram-Bio.

## Inhalte ändern

- Domain: **julians-way.net** (Hostinger, Node.js-Web-App, baut automatisch bei
  jedem Push auf `main`). `og:url` und `og:image` in `index.html` nutzen die volle
  Adresse; bei einem Domainwechsel dort anpassen.

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
