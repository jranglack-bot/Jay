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
  `npm audit` gegenprüfen. Am 13.11.2026 meldete `npm audit` fünf neue Punkte gegen Vite bis
  6.4.3 (wieder nur der Entwicklungsserver), behoben mit Vite 6.4.6 per `npm audit fix` (nur
  Sperrdatei, gebaute Seite unverändert).
- **Die esbuild-Meldung kommt nach jedem Deploy wieder (13.11.2026):** Hostinger schickte
  sie erneut per Mail, als „hoch“ (CVSS 8,1) und „nicht automatisch behebbar“. Es ist weiter
  nur der zurückgezogene Hinweis GHSA-gv7w-rqvm-qjhr, `npm audit` und das Build-Protokoll
  zeigen 0. Abfragen lässt sich die Liste über den Hostinger-Connector
  (`hosting_nodejs_list-vulnerabilities`). Weg geht sie erst mit esbuild ab 0.28.1, und das
  gibt es nur mit Vite 7 (7.3.8 bringt esbuild 0.28.2) oder Vite 8 (kein esbuild mehr), beide
  brauchen Node 20.19+. Am 13.11.2026 in einer Kopie getestet: Vite 7.3.8 baut unter Node 22
  alle fünf Seiten, und mit `build.target: ['es2020', 'edge88', 'firefox78', 'chrome87',
  'safari14']` in `vite.config.js` (der Vorgabe von Vite 6) ist die gebaute Seite Byte für
  Byte gleich. Ohne diese Zeile fasst Vite 7 im CSS `top/right/bottom/left` zu `inset`
  zusammen (erst ab Safari 14.1). Reihenfolge, falls Julian es will: zuerst die Node-Version
  des Builds bei Hostinger auf 22 stellen, dann Vite 7 mit der Zeile auf den Branch, zeigen,
  nach `main`. Nicht umgekehrt, mit Node 18 schlägt der Build von Vite 7 fehl.
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
  Umsatz-Screenshots von anderen, kein künstlicher Zeitdruck. Julian erzählt ehrlich, wie es
  bei ihm läuft, und zeigt, wie das Ganze funktioniert.
- **Julians eigene Umsatzbelege (seit 13.11.2026):** erlaubt sind nur seine eigenen, mit
  sichtbarem Betrag, je Stelle genau ein Bild, direkt darunter „mein Ergebnis, kein
  Versprechen“ und der Aufwand. Auf der Seite stehen zwei, beide in „Mein Weg“:
  `assets/beleg-erster-verkauf.jpg` (Mail von secret-creators, Provision 1.722,38 €, Kapitel
  05) und `assets/beleg-auszahlung.jpg` (Mail von ablefy vom 16. März 2026, 2.049,63 €,
  Kapitel „Heute“). Am Handy als kleine Karte im Gold-Rahmen (höchstens eine halbe
  Bildschirmhöhe), Antippen vergrößert (`#lightbox`, „Belege vergrößern“ in
  `public/js/main.js`). Die Dateien sind ohne EXIF-Daten gespeichert (Handymodell,
  Aufnahmezeit), neue Belege genauso behandeln. **Wird die Seite je mit bezahlter Werbung
  beworben, kommen die Belege vorher raus**, weil Meta dann die Zielseite prüft.
  Rückmeldungen von anderen gibt es nicht, `#stimmen` bleibt auskommentiert, nichts erfinden.
- **Texte (neu geschrieben 25.09.2026 nach Recherche):** Verbindlich sind Julians
  Regeln im Vault `Claude Gehirn\00 Kontext\Schreibstil.md`, `Schmerzpunkte.md`,
  `ICP.md` und `Über Mich.md` (Fakten). Kurz: konkrete Szenen und Zahlen statt
  Schlagworten, fröhlich und selbstironisch statt schwer, ganze Sätze, keine
  Dreierreihen, kein „Kein X, kein Y“. Nicht verwenden: „ehrlich“ (so nennen sich
  die Spam-Testberichte), „Hamsterrad“, „mehr Zeit für die Familie“, „ohne
  Vorerfahrung“ und ähnliche Wörter, die die Konkurrenzseiten wortgleich benutzen.
  Belege: `~/.agent-reach/recherche/webseite-text/notizen.md`.
- **Erzählen statt erklären (Julian, 13.11.2026):** Die erste Fassung der Texte vom selben
  Tag fand er „total kalt“ und „nicht menschlich“: „Du versuchst es hier auf eine logische
  Art und Weise zu erklären, aber wichtig ist immer, du musst bei jemandem eine Emotion
  auslösen.“ Deshalb erzählt jeder Text, was Julian passiert ist und wie es sich angefühlt
  hat, wie einem Kumpel (Vault `Schreibstil.md`, Korrektur 30.10.2026 „Kumpel, nicht
  Mentor“): lange Sätze mit und, denn, weil, danach ein kurzer Satz zum Gefühl, „hab“,
  „kriegst“, „gecheckt“, keine Lehrsätze („Wichtiger ist, dass …“), kein Passiv („wird
  erklärt“, „wird gerechnet“), keine Sätze über „du lernst“. Der Vault liegt auch in Google
  Drive (`Schreibstil.md`, `Über Mich.md`, `Schmerzpunkte.md`, `ICP.md`, Ordner
  `Schreibstil-Beispiele`), vor jedem Text dort lesen. **Gefühle und Erlebnisse nie
  erfinden**, nur die aus `Über Mich.md` nehmen und alles Neue für Julian markieren. Beruf
  und Branche nie nennen, öffentlich nur „ganz normaler Job“.
- **Story-Fakten** (Geldsorgen 2025, Satz seiner Frau, erster Verkauf nach einem Monat,
  Augenzucken weg, Schuhe ohne Blick aufs Konto) stehen im Vault `Über Mich.md`,
  „Nachtrag 25.09.2026“. **Zeitleiste (Julian, 13.11.2026):** über ein Jahr gezögert, 2025
  Geldsorgen, Start im SCB-System im Januar 2026, erster Verkauf im Februar 2026, Auszahlung
  am 16. März 2026 mit diesem Verkauf und dem, was danach dazukam. Die 6 Millionen Aufrufe in
  `#ergebnisse` (18. Januar bis 16. Februar) sind genau dieser erste Monat. Das neue Auto
  bewusst nicht auf die Seite (Coach-Optik), nie „Geld verdienen, ohne was zu tun“. Hinweise
  „kein Versprechen“ stehen seit 13.11.2026 an vier Stellen: unter beiden Belegen, bei den
  Zahlen und im Block `#gewartet`. Die unter den Belegen sind Pflicht, weitere nicht
  dazusetzen, jeder kühlt die Emotion ab. Direkt vor dem
  Abschluss-Knopf steht das Echo „2025 … Heute ist dieser Druck weg.“
- **Nichts doppelt erzählen (Julian, 13.11.2026: „teilweise steht manches doppelt drin“):**
  Jede Tatsache hat genau einen Platz, an dem sie ausführlich steht. Gefloppte Reels und
  Live-Calls: `#scb`. Network Marketing, die verschlossene Tür, die Frage der Tochter, über
  ein Jahr gezögert, keinem Screenshot geglaubt, der Satz seiner Frau, Erleichterung, Urlaub
  und Schuhe: die Kapitel in `#weg`. „Reichweite allein bringt mir gar nichts“: `#ergebnisse`.
  Der Kontrast Jahr gegen Monat und „Das Jahr hätt ich mir echt sparen können“: `#gewartet`.
  Gewollte Wiederholungen sind nur: der erste Verkauf nach einem Monat (Hero, Kapitel 05,
  Zahlen, `#gewartet`, jeweils mit anderer Aufgabe), das Echo „2025 … Heute ist dieser Druck
  weg.“ vor dem Abschluss-Knopf, und der Ablauf nach dem Klick vor jedem Werbelink. Deshalb
  ist der Abschnitt „So läuft's bei mir konkret“ (`#werte`) seit 13.11.2026 raus: Alle vier
  Kacheln standen inzwischen im SCB-Abschnitt. Vor jedem neuen Satz prüfen, ob er schon
  dasteht.
- **Keine Jahresangaben, die veralten:** nie „dieses Jahr“ oder „letztes Jahr“ schreiben,
  immer die Jahreszahl (zum Jahreswechsel wären die Sätze falsch).
- **Die Seite passt zu @julians.way (Julian, 25.09.2026):** Das Laufband nennt die drei
  Themen seiner Reels (auf Instagram wachsen, verkaufen ohne eigenes Produkt, KI), dann
  Julian als Papa mit Job. Dass er sein Wissen im SCB-System gelernt hat, steht in `#scb` im
  Kasten „Das hab ich dort gelernt“ (vier Punkte in Ich-Form). Julian am 13.11.2026: Er hat
  nicht selbst festgelegt, für wen er postet, ihm wurde im Programm geholfen, das
  herauszufinden, und zwar so, dass es ihm Spaß macht und für ihn Sinn ergibt. Der Kasten
  erzählt deshalb, wobei ihm geholfen wurde („Da bin ich nicht selbst drauf gekommen“, „Mir
  hat erst jemand zeigen müssen“), nie „ich hab festgelegt“ oder „ich weiß jetzt“ als
  Alleingang. Nur bei der KI ist es umgekehrt, da hilft er inzwischen selbst und hält im
  Programm die Calls zu KI. Bis 13.11.2026 war das der eigene Abschnitt `#gelernt`
  („Woher ich das weiß“), er ist in `#scb` aufgegangen. Der **Look bleibt** schwarz und gold,
  weil er so zum SCB-Funnel passt (Julian, 25.09.2026).
- **Hero (seit 13.11.2026):** Der Absatz nennt gleich den Grund zu bleiben. Er ist aus
  Julians Einstieg in „Mein Weg“ gebaut (Job und Gehaltserhöhung), dazu „2025 hat bei uns
  das Geld ohne Ende gefehlt“ (seine Worte) und der belegte Fakt: Start im Januar 2026,
  erster Verkauf einen Monat später. Er endet mit „und wie das geht, hab ich im SCB-System
  gelernt“, damit der goldene Knopf direkt darunter und die Überschrift von `#scb` flüssig
  anschließen (Julian, 13.11.2026: der Übergang zum SCB-System fehlte, im Hero kam es nicht
  vor). **Nie auf Belege verweisen** („die Mail dazu zeig ich dir weiter unten“, „das siehst
  du an meinen Zahlen“), Julian am 13.11.2026: „Das ist eine Rechtfertigung. Wenn du dich
  rechtfertigst, hast du verloren.“ Die Belege stehen an ihrer Stelle in der Geschichte und
  werden nirgends angekündigt. Nicht länger
  machen: Auf einem kleinen Handy (375 × 667) muss der goldene Knopf noch im ersten
  Bildschirm stehen, das sind höchstens zehn Zeilen. Goldener Knopf „Was ist das SCB-System? ↓“ (`#scb`), zweiter Knopf „Erst meine
  Geschichte ↓“ (`#weg`). `meta description` und `og:description` sagen dasselbe, die
  Vorschau in Instagram-DMs ist oft der erste Eindruck. **Überschriften und erste Sätze nie
  neu erfinden**, nur aus Sätzen bauen, die schon von Julian sind.
- **Julian zeigt sein Gesicht.** Er zeigt anderen, wie es auch ohne eigenes
  Gesicht geht. Nie „ohne mein Gesicht zu zeigen“ über Julian schreiben.
- **Erst erklären, dann anbieten:** Direkt unter dem Hero steht „Was ist das SCB-System?“
  (`#scb`). Seit 13.11.2026 konkret statt „Schritt für Schritt“ (das schreibt jede
  Konkurrenzseite): was es ist, was bei Julian den Unterschied gemacht hat (das Team sagt in
  den Live-Calls, was er an seinen Reels ändern soll), für wen es nichts ist („keine Stunde
  am Tag“ oder „was von allein läuft“) und der Kasten „Das hab ich dort gelernt“. Darunter
  ein echter Werbelink mit Ablauf nach dem Klick. Der frühere Angebotskasten `#videotraining`
  (05.10.2026) bleibt raus. Das Video steht nicht in der Navigation, kein fixierter
  Handy-Button, Button-Texte sagen ehrlich, wohin sie führen. Als leichtere Optionen gibt es
  Instagram (@julians.way) und die Anleitungen.
- **Wer im Video spricht:** „Wie das System genau aufgebaut ist, erklären dir Jacky und
  Julez im Video, die beiden haben es gebaut.“ steht in `#scb`, im Abschluss fast gleich,
  jeweils vor dem Knopf. Nur nennen,
  kein Foto (Julian, 12.11.2026: „nennen ja, zeigen nicht direkt“). Die Firma steht nur im
  Werbehinweis des Live-Events.
- **Affiliate-Links kennzeichnen:** Julian bekommt über Video, Live-Event und die Tools eine
  Provision. Werbelinks gibt es seit 13.11.2026 an drei Stellen der Startseite (`#scb`, im
  Block `#gewartet` nach den Zahlen, im Abschluss `#angebot`), dazu im Live-Event-Abschnitt
  und auf `tools.html`. Jeder trägt ein Sternchen, `rel="sponsored"` und einen eigenen
  `utm_content`, und die Erklärung („*Werbung: Wenn du über meinen Link später etwas kaufst,
  bekomme ich eine Provision.“) steht direkt darunter, damit sie vor dem Klick sichtbar ist.
  Ausnahme `tools.html`, siehe unten. Alle drei Stellen sind gleich gebaut (`.offer`,
  `data-offer`, `paintOffers` in `public/js/main.js`): Ablauf nach dem Klick, Knopf,
  im Live-Event-Modus darunter das Video als zweite Möglichkeit, Werbehinweis. Die Links
  stehen auch ohne Skript im HTML. Julian fand am 25.09.2026 drei gleiche Werbelinks zu
  werblich; die drei jetzt hat der Auftrag vom 12.11.2026 vorgesehen, weil am Handy der
  einzige Link nach draußen erst bei Bildschirm 24,9 von 25,7 lag.
- **Leise Links** (`.softlink`) gibt es auf der Startseite nicht mehr, nur noch auf den
  Unterseiten (`anleitungen.html` führt zu `index.html#scb`). Aus dem leisen Link nach den
  Zahlen wurde der Block `#gewartet`: „Über ein Jahr hab ich gebraucht, bis ich angefangen
  hab.“ (Julians Satz aus Kapitel 04, fließt beim Scrollen herein, `data-flow`), darunter
  sein eigener Kontrast statt künstlichem Druck: über ein Jahr gezögert, dann einen Monat
  nach dem Start der erste Verkauf.
- **Der Funnel ist ein Test, kein Video.** `FUNNEL_URL` führt auf einen Eignungstest
  (Seitentitel dort „Kostenloser Eignungstest“, anderes Design). Am 12.11.2026 durchgeklickt:
  sechs Klickfragen (Beruf, Zufriedenheit, Alter, Bereitschaft, Stunden pro Woche, gewünschter
  Nebenverdienst), laut Funnel „weniger als 2 Minuten“, danach Vorname und E-Mail, erst dann
  das Video (30 bis 40 Minuten, gehalten von Jacky und Julez), bei Eignung ruft laut Funnel
  das Team innerhalb von 48 Stunden an. Genau diese Fakten stehen vor jedem Werbelink, an
  jeder der drei Stellen etwas anders gesagt, weil derselbe Absatz dreimal wortgleich nach
  Formular klang. In `#scb`: „Nach dem Klick kommen erst mal sechs Fragen zum Anklicken, und
  da bist du in nicht mal zwei Minuten durch. Danach trägst du deinen Vornamen und deine
  E-Mail ein und kriegst das Video, das geht ungefähr 30 bis 40 Minuten. Und wenn es für
  dich passt, kannst du dich danach für ein persönliches Gespräch entscheiden.“ Linktext „Zu den Fragen und zum Video*“, nie nur „Video“ versprechen.
  Überall „Video“ sagen, nicht mehr „Videotraining“. **Nicht übernehmen** von der
  Funnel-Seite: Telegram-Bildschirmfotos und „31,5 Tage bis zum ersten Erfolg“
  (Erfolgsaussagen über andere), „Nur 7 Zugänge verfügbar“ (Verknappung), „ohne dein Gesicht“
  als Aussage über Julian, und „750+ Teilnehmer“, solange Julian die Zahl nicht bei Jacky und
  Julez bestätigt hat.
- **Fragen-Abschnitt (`#fragen`):** nur Hürden, die der Besucher bei sich selbst
  sieht (schon mal probiert, Kosten, Anruf, Gesicht, Zeit, Vorwissen). Keine Antworten auf
  Vorwürfe gegen Julian oder das Modell (Schneeball, Network Marketing, „ist das seriös“),
  das hat Julian für allen öffentlichen Content ausgeschlossen. Die Frage „Ich hab sowas
  schon mal probiert.“ (13.11.2026) erzählt Julians eigenen ersten Versuch von 2021, sie
  wehrt nichts ab. Die ersten zwei Antworten stehen offen da, am Handy klappt kaum jemand
  auf. Preis: nie einen Betrag nennen und nicht betonen („Das Programm kostet Geld“ fand
  Julian schlecht). „Kostet das was?“ sagt auch, dass für das Video Vorname und E-Mail
  gebraucht werden. Das Gespräch ist eine Entscheidung des Besuchers: „Wenn es für dich
  passt, kannst du dich für ein persönliches Gespräch entscheiden. Dann ruft dich
  jemand vom Team an …“ (Julian, 25.09.2026). Nie „wir rufen dich an“, und eine
  Antwort nicht mit „Nur wenn du das möchtest“ beginnen lassen.
- Messung ohne Cookies: jeder Werbelink hängt ein eigenes `utm_content` an. Zu den Fragen
  und zum Video (`funnelUrl()`): `scb`, `geschichte` (Block `#gewartet`), `abschluss`. Im
  Live-Event-Modus ist das Video nur die zweite Möglichkeit unter dem Knopf: `scb-event`,
  `geschichte-event`, `abschluss-event`. Anmeldung zum Live-Event (`eventUrl()`): `event`
  (Event-Abschnitt), `event-scb`, `event-geschichte`, `event-abschluss`. Die früheren
  `abschluss-via-…` gibt es nicht mehr, weil keine Sprunglinks zum Abschluss mehr da sind.
  Julian holt die Zahlen je Messwert bei Jacky und Julez. Erst danach weiter umbauen, sonst
  bleibt jede Änderung geraten. Vor dem ersten Event bei ihnen nachfragen, ob `utm_content`
  am Event-Link bei ihnen ankommt.
- **Reihenfolge (seit 13.11.2026):** Hero, „Was ist das SCB-System?“ (`#scb`, mit
  Werbelink), Geschichte (`#weg`, mit beiden Belegen), Zahlen (`#ergebnisse`), „Über ein
  Jahr hab ich gebraucht …“ (`#gewartet`, mit Werbelink), „So ist ein Reel aufgebaut“
  (`#aufbau`), „Die Anleitung dazu“
  (`#anleitungen-start`), „Meine KI-Tools“ (`#ki-tools`), Fragen, Abschluss (`#angebot`).
  Im Live-Event-Modus steht der Event-Abschnitt direkt unter dem Hero, vor `#scb`. Das hebt
  Julians Reihenfolge vom 05.10.2026 auf (Anleitungen und Tools früh): Skeptische Besucher
  klicken über Sympathie und Beweis, und beides steht in der Geschichte. Vorher lagen
  zwischen Interesse und Geschichte elf Handy-Bildschirme Anleitung und Tools. Die
  Navigation folgt der Reihenfolge (Das SCB-System, Mein Weg, Fragen, Anleitungen, Meine
  Tools).
- **Abschluss (`#angebot`):** Überschrift „DAS KANN DOCH NICHT ALLES SEIN.“ (Julians Satz
  aus Kapitel 01; „SCHAU DIR DAS IN RUHE AN.“ gab keinen Grund). Davor steht in ganzen
  Sätzen: wer im Video spricht, dass Fragen und Video kostenlos sind, und der Ablauf.

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
- **Hero-Foto zoomt am Handy herein (Julian, 06.10.2026):** Nur im Handy-Layout (bis 900 px).
  Oben steht erst nur der Text; beim Runterscrollen erscheint das Foto groß und leicht
  durchsichtig über den ganzen Bildschirm, zoomt in seinen Rahmen und ist erst dort klar
  (fertig, wenn die Fotomitte bei 55 % der Bildschirmhöhe steht). Hochscrollen spielt es
  rückwärts ab. Das große Foto liegt hinter dem Text (`.hero--zoomfx`), sonst waren die Knöpfe
  kaum zu lesen. Bewegt wird nur `.portrait__clip`, Rahmen und Funken blenden zum Schluss ein
  (`--hz-ui`). Code: „Hero-Foto zoomt am Handy“ in `public/js/main.js`.
- **Goldschrift** (`.grad`): ein heller Glanzstreifen läuft gut sichtbar durch (Julian: der
  alte Farbwechsel fiel kaum auf).
- **Fließende Überschrift** (`.flowhead`, `data-flow`): große Zeile kommt beim Scrollen von
  links herein, die zweite von rechts. Seit 13.11.2026 im Block `#gewartet` („ÜBER EIN JAHR“
  / „HAB ICH GEBRAUCHT, BIS ICH ANGEFANGEN HAB.“), vorher in „Woher ich das weiß“.
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

- **„So läuft's bei mir konkret“ war vom 25.09. bis 13.11.2026 der Abschnitt `#werte`:**
  vier Kacheln mit Antworten statt Versprechen, nur Julians eigene Fakten (Reels am Anfang
  gefloppt, Live-Calls vom Team, erster Umsatz nach einem Monat, circa eine Stunde am
  Tag, vieles per KI vom Handy, Kids sitzen manchmal daneben). Seit dem Umbau stehen diese
  Fakten in `#scb` und in der Geschichte, der Abschnitt ist raus (er steht noch im Verlauf,
  Stand `7f64f24`). Mit ihm ging der Satz „Ich bin kein Coach auf der Yacht, sondern ein
  Papa mit Job, der nebenbei Content macht.“ Kacheln, die nur
  ankündigen („ich sag dir, was klappt“), ohne es zu zeigen, hat Julian abgelehnt.
  **Nicht zu viel erklären:** Julian: „Wenn man zu viel erklärt, macht man sich
  angreifbar.“ Darum ist die Frage „Was hast du davon?“ wieder raus.

- **Live-Event:** Aktuell findet keins statt, der Termin ist offen. Läuft eins, ist es
  immer das erste Ziel (Julian, 12.11.2026: es verkauft stärker), sonst das Video. Der
  Abschnitt ist per `webinarActive: false` in `DEFAULTS` ausgeblendet. Beim nächsten Event
  `eventActive: true`, `eventDate` **mit Zeitzone** (`+02:00` Sommerzeit, `+01:00`
  Winterzeit) und `eventDurationMin` setzen. Dann steht der Event-Abschnitt direkt unter dem
  Hero mit Datum in Worten und Countdown, der goldene Hero-Knopf heißt „Zum Live-Event ↓“,
  und in `#scb`, `#gewartet` und im Abschluss ist die Anmeldung der Hauptknopf („Zum
  Live-Event anmelden*“), davor stehen Termin und Fakten, darunter leiser „Oder schau dir
  zuerst das Video an*“. Während des Events „WIR SIND LIVE“ und „Jetzt live dazukommen*“,
  nach Start + Dauer schaltet alles von selbst zurück. Weitere Felder, nur Gefülltes wird
  gezeigt: `eventHosts` („Jacky und Julez“, daraus wird „… halten es selbst.“), `eventLengthText` (ganzer Satz
  zur Dauer, noch leer) und `eventReplay` („In der Regel gibt es danach eine
  Aufzeichnung.“). Nur echte Termine, nie einen Timer, der neu startet oder immer „morgen“
  ist (irreführende Verknappung, UWG). Zum Testen `eventActive` und ein Testdatum nur im
  gebauten `dist/js/main.js` setzen, nie in der Quelle.
- **Später, erst nach Julians Wort (Auftrag 12.11.2026):** ein Feld „Sag mir Bescheid, wenn
  das nächste Live-Event ansteht“ über ein Systeme.io-Formular (dann `datenschutz.html`
  ergänzen); eine eigene, belegte Zahl als Ersatz für Rückmeldungen, zum Beispiel wie oft
  das Reel-Drehbuch verschickt wurde (aus ChatPlace, nur wenn Julian sie nennt); ein kurzes
  Video im Abschluss (60 bis 90 Sekunden hochkant, Julian in die Kamera, ohne Zahlen), lokal
  eingebunden statt über YouTube, mit Vorschaubild und erst auf Antippen geladen.
- **Fehlt noch von Julian:** Datum, Uhrzeit und Dauer des nächsten Live-Events; zwei bis
  drei Punkte, was man im Video sieht (dann unter den Satz zu Jacky und Julez, nichts
  erfinden); sein eigener erster Satz für „Mein Weg“ (der alte Einstieg steht jetzt im Hero,
  als Einstieg steht dort die Frage seiner Tochter, sein eigenes Beispiel aus
  `Schreibstil.md`); drei Momente, die nur er kennt und die die Seite wärmer machen würden:
  was er gemacht hat, als die Mail zum ersten Verkauf kam, ein Moment aus 2025, in dem das
  Geld gefehlt hat, und ob ihn die gefloppten Reels am Anfang wirklich „angepisst“ haben
  (das Wort stammt aus seinem abgenommenen Reel über die B-Rolls); optional die Zahl 750 von Jacky und
  Julez, sonst bleibt sie weg.
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
