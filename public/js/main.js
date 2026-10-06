/* ============================================================
   JULIANS WAY — Interaktion, Animationen, Konfiguration
   ============================================================ */
(() => {
  "use strict";

  /* ---------- Konfiguration ---------- */
  // Hier Webinar-Link, Hinweis-Banner, Live-Event und Extra-Links einstellen.
  const DEFAULTS = {
    webinarUrl:
      "https://live.secretcreators.de/recsJErrJAYNx46PE?utm_source=recsJErrJAYNx46PE&utm_medium=affiliate&utm_campaign=webinar",
    // Live-Event-Abschnitt anzeigen (aktuell findet keins statt).
    // eventActive: true zeigt ihn automatisch mit an.
    webinarActive: false,
    note: "",
    noteActive: false,
    eventActive: false,
    // Startzeit IMMER mit Zeitzone eintragen, sonst rechnet jeder Besucher in seiner
    // eigenen: Sommerzeit "+02:00", Winterzeit "+01:00" (Umstellung am 25.10.2026).
    // Beispiel: "2026-11-05T19:00:00+01:00"
    eventDate: "",
    // Nach Start + Dauer gilt das Event als vorbei, die Seite schaltet von selbst zurück.
    eventDurationMin: 120,
    links: [],
  };
  const FUNNEL_URL =
    "https://julians-way.de/videotraining/?utm_source=instagram&utm_medium=bio&utm_campaign=julians-way";
  // Eigener utm_content je Knopf: zeigt in der Auswertung des Funnels, welcher Knopf
  // die Anmeldungen bringt (abschluss, abschluss-via-scb, abschluss-via-gelernt,
  // abschluss-via-zahlen, abschluss-event).
  const funnelUrl = (knopf) => FUNNEL_URL + "&utm_content=" + knopf;

  const $ = (sel) => document.querySelector(sel);
  // CSS-Variable nur schreiben, wenn sich der Wert ändert: spart dem Browser bei jedem
  // Bild das Neuberechnen aller Elemente darunter (wichtig für die Scroll-Szenen am Handy)
  const setVar = (el, name, val) => {
    const cache = el.varCache || (el.varCache = {});
    if (cache[name] !== val) {
      cache[name] = val;
      el.style.setProperty(name, val);
    }
  };

  /* ---------- Leise Links in der Mitte ----------
     Sie springen zum Abschluss (#angebot), damit jeder vor dem Klick nach draußen die
     drei Schritte sieht. Welcher leise Link benutzt wurde, landet trotzdem in der
     Auswertung: als utm_content des Abschluss-Knopfs, z. B. "abschluss-via-zahlen". */
  document.querySelectorAll("[data-jump]").forEach((a) => {
    a.addEventListener("click", () => {
      const cta = $("#ctaFunnel");
      if (cta.href.startsWith(FUNNEL_URL)) cta.href = funnelUrl("abschluss-via-" + a.dataset.jump);
    });
  });

  /* ---------- Live-Event-Konfiguration anwenden ---------- */
  let cdTimer = null;

  // "Donnerstag, 5. November, 19:00 Uhr", immer in deutscher Zeit
  function formatEventDate(ms) {
    const tz = { timeZone: "Europe/Berlin" };
    const tag = new Intl.DateTimeFormat("de-DE", { ...tz, weekday: "long", day: "numeric", month: "long" }).format(ms);
    const zeit = new Intl.DateTimeFormat("de-DE", { ...tz, hour: "2-digit", minute: "2-digit" }).format(ms);
    return tag + ", " + zeit + " Uhr";
  }

  function applyConfig(cfg) {
    const c = { ...DEFAULTS, ...cfg };
    const eventStart = c.eventActive && c.eventDate ? new Date(c.eventDate).getTime() : NaN;
    const eventEnd = eventStart + (Number(c.eventDurationMin) || 120) * 6e4;
    // Vorbei ist vorbei: kein Countdown und kein „WIR SIND LIVE“ nach dem Event
    if (!isNaN(eventStart) && Date.now() >= eventEnd) c.eventActive = false;
    const webinarBtn = $("#webinarBtn");
    webinarBtn.href = c.webinarUrl;

    /* Hinweis-Banner */
    const bar = $("#announceBar");
    const update = $("#webinarUpdate");
    if (c.noteActive && c.note) {
      $("#announceText").textContent = c.note;
      $("#webinarUpdateText").textContent = c.note;
      bar.hidden = false;
      update.hidden = false;
      setTimeout(() => {
        bar.classList.add("is-visible");
        document.body.classList.add("has-announce");
      }, 50);
    } else {
      bar.classList.remove("is-visible");
      document.body.classList.remove("has-announce");
      update.hidden = true;
      setTimeout(() => (bar.hidden = true), 600);
    }

    /* Live-Event-Abschnitt nur zeigen, wenn eingeschaltet oder ein Event ansteht */
    const webinarSec = $("#webinar");
    webinarSec.hidden = !(c.webinarActive || c.eventActive);
    // Link im Hinweis-Banner zeigt sonst ins Leere
    $("#announceLink").hidden = webinarSec.hidden;

    /* Der goldene Hero-Knopf springt normal zur Erklärung des SCB-Systems (#scb) direkt
       unter dem Hero, im Live-Event-Modus zum Event, das dann dort steht. Werbelinks gibt es
       nur im Abschluss und im Event, jeweils mit Sternchen und Erklärung direkt darunter.
       Der Knopf in #scb und die leisen Links in der Mitte springen zum Abschluss. */
    const heroLink = $("#heroOffer");
    const pillText = $("#webinarPillText");

    if (c.eventActive) {
      heroLink.href = "#webinar";
      heroLink.innerHTML = 'Zum kostenlosen Live-Event <span class="btn__arrow btn__arrow--down">↓</span>';
      // Finale CTA unten ebenfalls aufs Live-Event drehen
      $("#ctaFunnel").href = c.webinarUrl;
      $("#ctaFunnel").innerHTML = 'Zum kostenlosen Live-Event* <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Das nächste Live-Event steht an. Dort siehst du live, wie das System funktioniert, und kannst deine Fragen direkt stellen.";
      // Die drei Schritte beschreiben den Funnel, nicht das Event
      $("#ctaSteps").hidden = true;
      const ctaAlt = $("#ctaAlt");
      ctaAlt.href = funnelUrl("abschluss-event");
      ctaAlt.hidden = false;
      // Event-Sektion direkt unter den Hero, vor die Erklärung des SCB-Systems
      $(".hero").after(webinarSec);
    } else {
      heroLink.href = "#scb";
      heroLink.innerHTML = 'Was ist das SCB-System? <span class="btn__arrow btn__arrow--down">↓</span>';
      // Finale CTA unten zurück aufs Videotraining
      $("#ctaFunnel").href = funnelUrl("abschluss");
      $("#ctaFunnel").innerHTML = 'Zu den Fragen und zum Video* <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Letztes Jahr hab ich mich noch oft gefragt, wie ich meine Familie über die Runden bringen soll. Heute ist dieser Druck weg. Wenn du sehen willst, wo ich das alles gelernt hab, zeigt dir das Videotraining das System, mit dem ich arbeite.";
      $("#ctaSteps").hidden = false;
      $("#ctaAlt").hidden = true;
      // Event-Sektion zurück an ihren Platz (vor die finale CTA)
      $("#angebot").before(webinarSec);
    }

    /* Extra-Buttons („Mehr von mir") */
    const extras = $("#extras");
    const grid = $("#extrasGrid");
    const links = (Array.isArray(c.links) ? c.links : []).filter(
      (l) => l && l.label && l.url
    );
    grid.innerHTML = "";
    links.forEach((l) => {
      const a = document.createElement("a");
      a.className = "extra-link";
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      const label = document.createElement("span");
      label.textContent = l.label;
      const arrow = document.createElement("span");
      arrow.className = "extra-link__arrow";
      arrow.textContent = "→";
      a.append(label, arrow);
      grid.appendChild(a);
    });
    extras.hidden = links.length === 0;

    /* Countdown */
    clearInterval(cdTimer);
    const cd = $("#countdown");
    const when = $("#eventWhen");
    const target = c.eventActive ? eventStart : NaN;
    when.hidden = isNaN(target);
    if (!isNaN(target)) {
      when.textContent = formatEventDate(target);
      const pad = (n) => String(n).padStart(2, "0");
      const tick = () => {
        const now = Date.now();
        if (now >= eventEnd) {
          // Event vorbei: Seite zurück in den Normalzustand
          clearInterval(cdTimer);
          applyConfig({ ...cfg, eventActive: false });
          return;
        }
        const diff = target - now;
        if (diff <= 0) {
          // Das Event läuft gerade (weiter ticken, damit das Ende erkannt wird)
          cd.hidden = true;
          pillText.textContent = "WIR SIND LIVE";
          webinarBtn.innerHTML = 'Jetzt live dazukommen* <span class="btn__arrow">→</span>';
          return;
        }
        cd.hidden = false;
        pillText.textContent = "LIVE-EVENT";
        $("#cdDays").textContent = Math.floor(diff / 864e5);
        $("#cdHours").textContent = pad(Math.floor(diff / 36e5) % 24);
        $("#cdMins").textContent = pad(Math.floor(diff / 6e4) % 60);
        $("#cdSecs").textContent = pad(Math.floor(diff / 1e3) % 60);
      };
      tick();
      cdTimer = setInterval(tick, 1000);
    } else {
      cd.hidden = true;
      pillText.textContent = "LIVE-EVENT";
      webinarBtn.innerHTML = 'Zur Anmeldung* <span class="btn__arrow">→</span>';
    }
    return c;
  }

  applyConfig(DEFAULTS);

  /* ---------- Navigation ---------- */
  const nav = $("#nav");
  addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", scrollY > 40);
  }, { passive: true });

  const burger = $("#burger");
  const mobileMenu = $("#mobileMenu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    mobileMenu.classList.toggle("is-open");
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("is-open");
      mobileMenu.classList.remove("is-open");
    })
  );

  /* ---------- Scroll-Reveals ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-img");
  revealEls.forEach((el) => {
    const d = el.dataset.delay;
    if (d) el.style.setProperty("--rdelay", d + "ms");
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-inview");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ---------- Zähler-Animation ---------- */
  const counters = document.querySelectorAll(".stat__num");
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        const t0 = performance.now();
        const dur = 1600;
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));

  /* ---------- Timeline-Fortschritt ---------- */
  const tlLine = $("#timelineLine");
  if (tlLine) {
    addEventListener("scroll", () => {
      const r = tlLine.parentElement.getBoundingClientRect();
      const vh = innerHeight;
      const progress = Math.min(Math.max((vh * 0.75 - r.top) / r.height, 0), 1);
      tlLine.style.setProperty("--progress", progress.toFixed(3));
    }, { passive: true });
  }

  /* ---------- Überschriften, die beim Scrollen von der Seite hereinfließen ----------
     data-flow="left" kommt von links, "right" von rechts. Die Bewegung hängt direkt an
     der Scrollposition: Oberkante unten im Bild = ganz draußen, bei gut der Hälfte des
     Bildschirms = an ihrem Platz. Rückwärts scrollen schiebt sie wieder hinaus. */
  const flows = document.querySelectorAll("[data-flow]");
  if (flows.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let flowTicking = false;
    const updateFlows = () => {
      flowTicking = false;
      const vh = innerHeight;
      flows.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        const p = Math.min(Math.max((vh - top) / (vh * 0.5), 0), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const dir = el.dataset.flow === "right" ? 1 : -1;
        el.style.setProperty("--fx", (dir * (1 - eased) * 70).toFixed(2) + "vw");
        el.style.setProperty("--fo", (0.1 + 0.9 * eased).toFixed(3));
      });
    };
    const onFlowScroll = () => {
      if (!flowTicking) {
        flowTicking = true;
        requestAnimationFrame(updateFlows);
      }
    };
    addEventListener("scroll", onFlowScroll, { passive: true });
    addEventListener("resize", onFlowScroll);
    updateFlows();
  }

  /* ---------- Splitter-Animation „Mein Weg“ (scrollgesteuert) ----------
     Das Foto auf dem Dach ist in Glassplitter zerlegt. Ist der Rahmen weit weg von der
     Bildschirmmitte, liegen die Splitter außerhalb des Bildschirms. Beim Scrollen fliegen
     sie in Bögen über die ganze Seite in den Rahmen, die äußeren zuerst, und setzen sich
     mit goldenen Fugen zum Foto zusammen; danach blendet das ganze Foto darüber ein.
     Beim Weiterscrollen bleibt es eine Weile ganz und fliegt erst auseinander, wenn der
     Rahmen oben aus dem Bild geht; beim Hochscrollen genauso, nur andersherum.
     Einmal ganz zu sehen, bleibt das Foto mindestens MIN_WHOLE stehen, auch wenn jemand
     schnell weiterscrollt (Julian: es soll „einmal klar zu sehen sein“).
     Fliegende Splitter liegen auf einer Leinwand über der ganzen Seite (fixed),
     gelandete auf einer Leinwand im Rahmen, damit sie beim Scrollen nicht nachwackeln.
     Ohne Skript oder mit reduzierter Bewegung steht einfach das Foto da. */
  const asmBox = $("#assemble");
  const asmImg = asmBox && asmBox.querySelector("img");
  if (asmImg && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const small = innerWidth <= 900;
    const RATIO = 9 / 16; // Höhe des Fotos in Breiten-Einheiten
    const HOLD = 0.1; // unter der Bildschirmmitte: so nah an der Mitte ist das Foto ganz
    const REACH = 0.95; // ab hier (Rahmen fast am unteren Rand) sind alle Splitter draußen
    const UP_HOLD = 0.3; // über der Mitte: ganz, bis die Rahmenmitte bei 30 % der Höhe ist
    const MIN_WHOLE = 1200; // ms, so lange bleibt das fertige Foto mindestens stehen
    const SPAN = 0.5; // Flugdauer eines Splitters, Anteil am Fortschritt
    const LAND = 0.9; // bis hier sind alle gelandet, danach blendet das Foto ein
    const follow = matchMedia("(pointer: coarse)").matches ? 0.24 : 0.16;
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    // Gleiche Zufallszahlen bei jedem Besuch: die Splitter sehen immer gleich aus
    let seed = 20250925;
    const rnd = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const rand = (a, b) => a + rnd() * (b - a);

    // Vieleck auf das Foto (0..1 x 0..RATIO) zuschneiden (Sutherland-Hodgman)
    const clipPoly = (pts) => {
      const edges = [
        (p) => p[0] >= 0, (p) => p[0] <= 1, (p) => p[1] >= 0, (p) => p[1] <= RATIO,
      ];
      const cut = [
        (a, b) => a[1] + ((b[1] - a[1]) * (0 - a[0])) / (b[0] - a[0]),
        (a, b) => a[1] + ((b[1] - a[1]) * (1 - a[0])) / (b[0] - a[0]),
        (a, b) => a[0] + ((b[0] - a[0]) * (0 - a[1])) / (b[1] - a[1]),
        (a, b) => a[0] + ((b[0] - a[0]) * (RATIO - a[1])) / (b[1] - a[1]),
      ];
      const at = [
        (a, b) => [0, cut[0](a, b)], (a, b) => [1, cut[1](a, b)],
        (a, b) => [cut[2](a, b), 0], (a, b) => [cut[3](a, b), RATIO],
      ];
      let out = pts;
      for (let e = 0; e < 4 && out.length; e++) {
        const inp = out;
        out = [];
        for (let i = 0; i < inp.length; i++) {
          const cur = inp[i];
          const prev = inp[(i + inp.length - 1) % inp.length];
          const ci = edges[e](cur);
          const pi = edges[e](prev);
          if (ci) {
            if (!pi) out.push(at[e](prev, cur));
            out.push(cur);
          } else if (pi) out.push(at[e](prev, cur));
        }
      }
      return out;
    };

    // Bruchmuster wie bei einer Scheibe: Strahlen und Ringe um einen Einschlagpunkt,
    // innen kleine, außen große Splitter. Große Vierecke teilweise in Dreiecke geteilt.
    const shards = [];
    (() => {
      const IX = 0.5;
      const IY = 0.27;
      const NS = small ? 11 : 15;
      const RINGS = small
        ? [0.06, 0.15, 0.27, 0.42, 0.6, 0.82]
        : [0.035, 0.085, 0.15, 0.23, 0.33, 0.46, 0.62, 0.82];
      const base = rand(0, Math.PI * 2);
      const ang = [];
      for (let i = 0; i < NS; i++) ang.push(base + ((i + rand(-0.3, 0.3)) / NS) * Math.PI * 2);
      const P = RINGS.map((r) =>
        ang.map((a) => {
          const rr = r * rand(0.86, 1.14);
          const aa = a + rand(-0.07, 0.07);
          return [IX + Math.cos(aa) * rr, IY + Math.sin(aa) * rr];
        })
      );
      const polys = [];
      for (let i = 0; i < NS; i++) {
        const j = (i + 1) % NS;
        polys.push([[IX, IY], P[0][i], P[0][j]]);
        for (let k = 1; k < RINGS.length; k++) {
          const quad = [P[k - 1][i], P[k - 1][j], P[k][j], P[k][i]];
          if (rnd() < (k > 2 ? 0.55 : 0.25)) {
            if (rnd() < 0.5) polys.push([quad[0], quad[1], quad[2]], [quad[0], quad[2], quad[3]]);
            else polys.push([quad[0], quad[1], quad[3]], [quad[1], quad[2], quad[3]]);
          } else polys.push(quad);
        }
      }
      let maxDist = 0;
      for (const poly of polys) {
        const pts = clipPoly(poly);
        if (pts.length < 3) continue;
        let area = 0;
        let cx = 0;
        let cy = 0;
        let x0 = 1;
        let y0 = RATIO;
        let x1 = 0;
        let y1 = 0;
        for (let i = 0; i < pts.length; i++) {
          const [ax, ay] = pts[i];
          const [bx, by] = pts[(i + 1) % pts.length];
          const cr = ax * by - bx * ay;
          area += cr;
          cx += (ax + bx) * cr;
          cy += (ay + by) * cr;
          x0 = Math.min(x0, ax);
          y0 = Math.min(y0, ay);
          x1 = Math.max(x1, ax);
          y1 = Math.max(y1, ay);
        }
        if (Math.abs(area) < 1e-5) continue;
        cx /= 3 * area;
        cy /= 3 * area;
        const dist = Math.hypot(cx - IX, cy - IY);
        maxDist = Math.max(maxDist, dist);
        shards.push({ pts, cx, cy, x0, y0, x1, y1, dist, dir: Math.atan2(cy - IY, cx - IX) });
      }
      for (const s of shards) {
        // Außen zuerst, der Einschlagpunkt schließt sich zuletzt
        s.d = (LAND - SPAN) * clamp01(0.55 * (1 - s.dist / maxDist) + 0.45 * rnd());
        // Start außerhalb des Bildschirms, ungefähr aus der Richtung, in die er beim
        // Zerspringen geflogen wäre; Bogen über einen Punkt irgendwo auf der Seite
        s.ang = s.dir + rand(-1, 1);
        s.far = rand(0.68, 1.0);
        s.qx = rand(0.08, 0.92);
        s.qy = rand(0.1, 0.9);
        s.rot = (rnd() < 0.5 ? -1 : 1) * rand(2.5, 6);
        s.flip = (rnd() < 0.5 ? -1 : 1) * rand(3, 9);
        s.ph = rand(0, Math.PI);
        s.grow = rand(0.15, small ? 0.9 : 0.6);
      }
      shards.sort((a, b) => a.d - b.d); // Reihenfolge = Landereihenfolge
    })();

    // Jeden Splitter einmal als kleines Bild vorbereiten (spart beim Fliegen das Zuschneiden)
    let unit = 0; // Breite des Rahmens in CSS-Pixeln
    let scale = 1; // Bildpunkte je CSS-Pixel der vorbereiteten Splitter
    const prepare = () => {
      unit = asmBox.clientWidth;
      if (!unit) return false;
      scale = Math.min(unit * Math.min(devicePixelRatio || 1, 2), asmImg.naturalWidth || 1280) / unit;
      for (const s of shards) {
        const bx = s.x0 * unit - 1;
        const by = s.y0 * unit - 1;
        const bw = (s.x1 - s.x0) * unit + 2;
        const bh = (s.y1 - s.y0) * unit + 2;
        const c = s.bmp || document.createElement("canvas");
        c.width = Math.max(Math.ceil(bw * scale), 1);
        c.height = Math.max(Math.ceil(bh * scale), 1);
        const g = c.getContext("2d");
        g.setTransform(scale, 0, 0, scale, -bx * scale, -by * scale);
        g.beginPath();
        s.pts.forEach(([x, y], i) => (i ? g.lineTo(x * unit, y * unit) : g.moveTo(x * unit, y * unit)));
        g.closePath();
        g.clip();
        g.drawImage(asmImg, 0, 0, unit, unit * RATIO);
        s.bmp = c;
        s.bx = bx;
        s.by = by;
        s.bw = c.width / scale;
        s.bh = c.height / scale;
      }
      return true;
    };

    // Umriss eines Splitters als Pfad (Koordinaten relativ zu seinem Schwerpunkt)
    const outline = (g, s) => {
      g.beginPath();
      s.pts.forEach(([x, y], i) => {
        const px = (x - s.cx) * unit;
        const py = (y - s.cy) * unit;
        if (i) g.lineTo(px, py);
        else g.moveTo(px, py);
      });
      g.closePath();
    };

    // Leinwand im Rahmen für die gelandeten Splitter
    const landed = document.createElement("canvas");
    landed.className = "assemble__landed";
    landed.setAttribute("aria-hidden", "true");
    const lg = landed.getContext("2d");
    let landedCount = -1;
    const drawLanded = (n) => {
      if (n === landedCount) return;
      landedCount = n;
      const w = Math.round(unit * scale);
      const h = Math.round(unit * RATIO * scale);
      if (landed.width !== w || landed.height !== h) {
        landed.width = w;
        landed.height = h;
      }
      lg.setTransform(1, 0, 0, 1, 0, 0);
      lg.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        const s = shards[i];
        lg.setTransform(scale, 0, 0, scale, 0, 0);
        lg.drawImage(s.bmp, s.bx, s.by, s.bw, s.bh);
      }
      // Goldene Fugen zwischen den gelandeten Splittern
      lg.strokeStyle = "rgba(231, 191, 107, 0.5)";
      lg.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        const s = shards[i];
        lg.setTransform(scale, 0, 0, scale, s.cx * unit * scale, s.cy * unit * scale);
        outline(lg, s);
        lg.stroke();
      }
    };

    // Leinwand über der ganzen Seite für die fliegenden Splitter
    const layer = document.createElement("canvas");
    layer.className = "shards-layer";
    layer.setAttribute("aria-hidden", "true");
    const fg = layer.getContext("2d");
    // Fliegende Splitter brauchen keine volle Schärfe: höchstens 1,5-fache Pixeldichte,
    // das spart auf Retina-Bildschirmen über die Hälfte der Bildpunkte
    const LDPR = Math.min(devicePixelRatio || 1, 1.5);
    let layerOn = false;
    const drawFlying = (p) => {
      const flying = p > 0 && p < LAND;
      if (flying !== layerOn) {
        layerOn = flying;
        layer.classList.toggle("is-on", flying);
      }
      if (!flying) return;
      const vw = layer.clientWidth;
      const vh = layer.clientHeight;
      if (layer.width !== Math.round(vw * LDPR) || layer.height !== Math.round(vh * LDPR)) {
        layer.width = Math.round(vw * LDPR);
        layer.height = Math.round(vh * LDPR);
      }
      fg.setTransform(1, 0, 0, 1, 0, 0);
      fg.clearRect(0, 0, layer.width, layer.height);
      const r = asmBox.getBoundingClientRect();
      const diag = Math.hypot(vw, vh);
      fg.lineJoin = "round";
      // Früh landende zuerst malen, die noch weit fliegenden liegen obendrauf
      for (const s of shards) {
        const t = (p - s.d) / SPAN;
        if (t >= 1) continue; // schon gelandet, liegt im Rahmen
        if (t <= 0) break; // alle weiteren sind noch draußen
        const e = 1 - (1 - t) * (1 - t) * (1 - t); // bremst zum Landen ab
        const k = 1 - e;
        const sx = vw / 2 + Math.cos(s.ang) * s.far * diag;
        const sy = vh / 2 + Math.sin(s.ang) * s.far * diag;
        const qx = s.qx * vw;
        const qy = s.qy * vh;
        const tx = r.left + s.cx * unit;
        const ty = r.top + s.cy * unit;
        const x = k * k * sx + 2 * k * e * qx + e * e * tx;
        const y = k * k * sy + 2 * k * e * qy + e * e * ty;
        const rot = s.rot * k;
        const flip = s.flip * k;
        const sc = 1 + s.grow * k; // weiter weg = näher an der Kamera
        const fx = Math.cos(flip) * sc; // Kippen um die eigene Achse
        const c = Math.cos(rot);
        const sn = Math.sin(rot);
        fg.setTransform(LDPR * c * fx, LDPR * sn * fx, -LDPR * sn * sc, LDPR * c * sc, LDPR * x, LDPR * y);
        const ox = s.bx - s.cx * unit;
        const oy = s.by - s.cy * unit;
        fg.globalAlpha = 1;
        fg.drawImage(s.bmp, ox, oy, s.bw, s.bh);
        // Lichtblitz, wenn der Splitter sich zur Seite dreht
        const glint = Math.pow(Math.abs(Math.sin(flip + s.ph)), 10) * Math.min(1, k * 2.5);
        if (glint > 0.04) {
          fg.globalCompositeOperation = "lighter";
          fg.globalAlpha = glint * 0.4;
          fg.drawImage(s.bmp, ox, oy, s.bw, s.bh);
          fg.globalCompositeOperation = "source-over";
        }
        // Glaskante, verschwindet kurz vor dem Landen
        const edge = Math.min(1, 0.5 + glint) * Math.min(1, k * 4);
        if (edge > 0.03) {
          fg.globalAlpha = edge;
          fg.strokeStyle = "rgb(255, 232, 186)";
          fg.lineWidth = 1.3 / sc;
          outline(fg, s);
          fg.stroke();
        }
      }
      fg.globalAlpha = 1;
    };

    let ready = false;
    let target = 0;
    let shown = 0;
    let raf = 0;
    let wholeSince = 0; // seit wann das Foto ganz zu sehen ist (0 = gerade nicht)
    const render = () => {
      raf = 0;
      const r = asmBox.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < innerHeight;
      const now = performance.now();
      // Schnell vorbeigescrollt: das fertige Foto bleibt trotzdem kurz stehen. Danach geht
      // es erst mit dem nächsten Scrollen weiter, nie von selbst.
      const goal = wholeSince && visible && now - wholeSince < MIN_WHOLE ? 1 : target;
      if (!visible) {
        shown = goal; // Rahmen nicht zu sehen: ohne Flug umschalten
      } else {
        const d = goal - shown;
        shown = Math.abs(d) < 0.0005 ? goal : shown + d * follow;
      }
      if (shown >= 1 && visible && !wholeSince) wholeSince = now;
      if (shown < LAND) wholeSince = 0;
      let n = 0;
      while (n < shards.length && shards[n].d + SPAN <= shown) n++;
      drawLanded(n);
      drawFlying(shown);
      setVar(asmBox, "--asm-img", clamp01((shown - LAND) / (1 - LAND)).toFixed(3));
      if (shown !== goal) raf = requestAnimationFrame(render);
    };
    // Neues Bild nur, wenn sich etwas bewegt: Fortschritt ändert sich, oder Splitter
    // fliegen gerade (die gelandeten im Rahmen scrollen von selbst mit)
    const kick = () => {
      if (ready && !raf && (target !== shown || layerOn)) raf = requestAnimationFrame(render);
    };

    const updateTarget = () => {
      const r = asmBox.getBoundingClientRect();
      const vh = innerHeight;
      const cy = r.top + r.height / 2; // Mitte des Rahmens im Bildschirm
      if (r.top > 2 * vh || r.bottom < -vh) target = 0;
      else if (cy >= vh / 2) {
        // Von unten: zusammensetzen, bis der Rahmen fast in der Mitte ist
        target = 1 - clamp01(((cy - vh / 2) / ((vh + r.height) / 2) - HOLD) / (REACH - HOLD));
      } else {
        // Nach oben: erst ganz lassen, dann auflösen, bis der Rahmen oben raus ist
        target = clamp01((cy + r.height / 2) / (UP_HOLD * vh + r.height / 2));
      }
      kick();
    };

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (ready && asmBox.clientWidth !== unit && prepare()) {
          landedCount = -1;
          shown = target;
          render();
        }
        updateTarget();
      }, 150);
    };

    const start = () => {
      if (ready || !prepare()) return;
      ready = true;
      asmBox.prepend(landed);
      document.body.appendChild(layer);
      asmBox.classList.add("is-shards");
      updateTarget();
      shown = target; // beim ersten Mal nicht von 0 hochlaufen, wenn man mittendrin lädt
      render();
      addEventListener("scroll", updateTarget, { passive: true });
      addEventListener("resize", onResize);
    };

    // Foto erst laden, wenn der Abschnitt in die Nähe kommt (spart mobiles Datenvolumen)
    const asmIo = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        asmIo.disconnect();
        asmImg.loading = "eager";
        asmImg
          .decode()
          .then(start)
          .catch(() => {}); // Foto bleibt dann einfach ohne Animation stehen
      },
      { rootMargin: "150% 0px" }
    );
    asmIo.observe(asmBox);
  }

  /* ---------- Explosionszeichnung: So ist ein Reel aufgebaut ----------
     Der Abschnitt ist 380vh hoch, sein Inhalt klebt. Scrollfortschritt p von 0 bis 1:
     bis 0,08 schwebt das Instagram-Symbol, bis 0,26 wird daraus ein Handy, ab 0,2 geht der
     Bildschirm an, bis 0,5 kippt es in die Schrägansicht, bis 0,66 gehen die Ebenen
     auseinander, danach leuchtet eine nach der anderen auf (1 bis 6), ab 0,92 sind alle
     durch. Rückwärts scrollen setzt das Handy wieder zusammen. Ohne Skript oder mit
     reduzierter Bewegung bleibt das fertige, zerlegte Bild aus dem CSS stehen. */
  const explode = $("#aufbau");
  if (explode && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ex = explode.querySelector(".ex");
    const stage = explode.querySelector(".explode__stage");
    const legend = explode.querySelector(".ex__legend");
    const layers = [...explode.querySelectorAll(".ex__layer[data-n]")]; // Nummer 1 bis 6
    const items = [...legend.children];
    const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
    const seg = (p, a, b) => clamp01((p - a) / (b - a));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const lerp = (a, b, t) => a + (b - a) * t;
    const px = (v) => v.toFixed(1) + "px";
    // Beim Einschalten erscheint zuerst das Video, dann der Text von oben nach unten
    const inOrder = [3, 0, 1, 2, 4, 5];
    let pw = 200;
    let narrow = false;
    let target = 0;
    let shown = -1;
    let raf = 0;
    let active = -2;
    let lastW = 0;
    let lastH = 0;

    explode.classList.add("is-live");

    const render = (p) => {
      const m = ease(seg(p, 0.08, 0.26));
      const s = seg(p, 0.2, 0.38);
      const t = ease(seg(p, 0.32, 0.5));
      const e = ease(seg(p, 0.44, 0.66));
      const ph = pw * 2;
      const icon = pw * 0.8;
      const lens = icon * 0.46;
      setVar(ex, "--m", m.toFixed(3));
      setVar(ex, "--e", e.toFixed(3));
      setVar(ex, "--rx", (56 * t).toFixed(2) + "deg");
      setVar(ex, "--rz", (-36 * t - 4 * e).toFixed(2) + "deg");
      setVar(ex, "--gap", px(e * pw * 0.3));
      setVar(ex, "--fw", px(lerp(icon, pw, m)));
      setVar(ex, "--fh", px(lerp(icon, ph, m)));
      setVar(ex, "--fr", px(lerp(icon * 0.29, pw * 0.16, m)));
      setVar(ex, "--fs", px(lerp(icon * 0.075, 2.5, m)));
      setVar(ex, "--lw", px(lerp(lens, pw * 0.3, m)));
      setVar(ex, "--lh", px(lerp(lens, pw * 0.075, m)));
      setVar(ex, "--lt", px(lerp((icon - lens) / 2, pw * 0.05, m)));
      setVar(ex, "--ls", px(lerp(icon * 0.075, 1.5, m)));
      setVar(ex, "--dd", px(icon * 0.1));
      setVar(ex, "--dr", px(icon * 0.15));
      setVar(explode, "--hint-out", seg(p, 0.03, 0.12).toFixed(3));
      inOrder.forEach((li, k) => {
        setVar(layers[li], "--in", seg(s, k * 0.11, k * 0.11 + 0.45).toFixed(3));
      });

      // Welche Ebene gerade dran ist: -1 noch keine, 0 bis 5, 6 = alle durch
      const a = p >= 0.92 ? 6 : p >= 0.6 ? Math.min(5, Math.floor(seg(p, 0.6, 0.92) * 6)) : -1;
      if (a !== active) {
        active = a;
        layers.forEach((l, i) => l.classList.toggle("is-active", i === a));
        items.forEach((it, i) => {
          // Schmal steht unten immer nur ein Punkt: am Ende bleibt der letzte stehen
          it.classList.toggle("is-active", i === a || (a === 6 && narrow && i === 5));
          it.classList.toggle("is-done", a === 6 || (a >= 0 && i < a));
        });
      }
      legend.classList.toggle("is-shown", e > 0.3);
    };

    // Handygröße an den freien Platz anpassen: zerlegt und gekippt braucht es gut
    // 2,7 Handybreiten in der Höhe
    const size = () => {
      if (Math.abs(innerWidth - lastW) < 1 && Math.abs(innerHeight - lastH) < 120) return;
      lastW = innerWidth;
      lastH = innerHeight;
      narrow = innerWidth <= 900;
      const r = stage.getBoundingClientRect();
      pw = Math.round(Math.max(110, Math.min(230, r.height / 2.75, (narrow ? innerWidth : r.width) * 0.42)));
      explode.style.setProperty("--pw", pw + "px");
      active = -2;
      render(shown < 0 ? target : shown);
    };

    const progress = () => {
      const r = explode.getBoundingClientRect();
      return clamp01(-r.top / Math.max(r.height - innerHeight, 1));
    };

    // Weich hinterherlaufen statt springen. Mausrad springt grob und braucht mehr Glättung,
    // Wischen am Handy ist schon weich und soll sich direkt anfühlen.
    const follow = matchMedia("(pointer: coarse)").matches ? 0.24 : 0.14;
    const tick = () => {
      const d = target - shown;
      shown = Math.abs(d) < 0.0005 ? target : shown + d * follow;
      render(shown);
      raf = shown === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const r = explode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      target = progress();
      if (shown < 0) {
        shown = target;
        render(shown);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    // Schwebe- und Glanz-Animationen nur laufen lassen, wenn die Szene in der Nähe ist
    new IntersectionObserver(
      (entries) => explode.classList.toggle("is-near", entries[0].isIntersecting),
      { rootMargin: "50% 0px" }
    ).observe(explode);

    size();
    target = progress();
    shown = target;
    render(shown);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", () => {
      size();
      onScroll();
    });
  }

  /* ---------- KI-Tools-Szene ----------
     Abschnitt 330vh, Inhalt klebt. Scrollfortschritt p von 0 bis 1: Erst kreisen die drei
     Chips ums Handy (auch im Stand). Ab 0,1 dockt i10x an und der Text schreibt sich, ab
     0,38 Higgsfield (Video erscheint, ein Scan legt den neuen Hintergrund drüber), ab 0,64
     ChatPlace (Kommentar mit Keyword, die Nachricht mit dem PDF fliegt raus). Ab 0,9 ist
     alles fertig, am Handy erscheint dann der Knopf „Zu meinen Tools“. Rückwärts genauso. */
  const toolScene = $("#ki-tools");
  if (toolScene && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const tsStage = toolScene.querySelector(".toolscene__stage");
    const chips = [...toolScene.querySelectorAll(".ts__chip")];
    const tItems = [...toolScene.querySelectorAll(".ts__legend li")];
    const START = [0.1, 0.38, 0.64]; // ab hier dockt Chip i an
    const DOCK = [[-0.78, -0.34], [0.78, -0.02], [-0.78, 0.3]]; // in Handybreiten/-höhen
    const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
    const seg = (p, a, b) => clamp01((p - a) / (b - a));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const lerp = (a, b, t) => a + (b - a) * t;
    const follow = matchMedia("(pointer: coarse)").matches ? 0.24 : 0.14;
    let pw = 180;
    let ph = 360;
    let half = 400;
    let target = 0;
    let shown = 0;
    let near = false;
    let raf = 0;
    let step = -2;
    let lastW = 0;
    let lastH = 0;

    toolScene.classList.add("is-live");

    const size = () => {
      if (Math.abs(innerWidth - lastW) < 1 && Math.abs(innerHeight - lastH) < 120) return;
      lastW = innerWidth;
      lastH = innerHeight;
      const r = tsStage.getBoundingClientRect();
      half = (innerWidth <= 900 ? innerWidth : r.width) / 2;
      // Chips kreisen gut eine halbe Handyhöhe über und unter der Mitte
      pw = Math.round(Math.max(110, Math.min(210, (r.height - 40) / 2.4, half * 0.76)));
      ph = pw * 2;
      toolScene.style.setProperty("--pw", pw + "px");
      chips.forEach((c) => (c.w = c.offsetWidth));
      step = -2;
    };

    const render = (p, time) => {
      chips.forEach((c, i) => {
        const lim = half - c.w / 2 - 8; // nie über den Bildschirmrand hinaus
        // Kreisbahn wie ein schräger Ring: unten vor dem Handy, oben dahinter
        const ang = time * 0.45 + i * ((Math.PI * 2) / 3);
        const depth = Math.sin(ang);
        const ox = Math.cos(ang) * Math.min(pw * 1.05, lim);
        const oy = depth * ph * 0.42;
        const os = 0.82 + 0.18 * (depth + 1) / 2;
        const d = ease(seg(p, START[i], START[i] + 0.1));
        const dx = Math.sign(DOCK[i][0]) * Math.min(Math.abs(DOCK[i][0]) * pw, lim);
        setVar(c, "--cx", lerp(ox, dx, d).toFixed(1) + "px");
        setVar(c, "--cy", lerp(oy, DOCK[i][1] * ph, d).toFixed(1) + "px");
        setVar(c, "--cs", lerp(os, 1, d).toFixed(3));
        c.style.opacity = lerp(0.55 + 0.45 * (depth + 1) / 2, 1, d).toFixed(3);
        c.style.zIndex = d > 0.5 || depth > 0 ? 5 : 2;
        c.classList.toggle("is-docked", d > 0.97);
      });
      const a1 = seg(p, 0.18, 0.36); // i10x schreibt
      setVar(toolScene, "--t1", seg(a1, 0, 0.4).toFixed(3));
      setVar(toolScene, "--t2", seg(a1, 0.25, 0.6).toFixed(3));
      setVar(toolScene, "--t3", seg(a1, 0.5, 0.8).toFixed(3));
      setVar(toolScene, "--t4", seg(a1, 0.7, 1).toFixed(3));
      const a2 = seg(p, 0.46, 0.62); // Higgsfield: Video, dann Scan
      const k = seg(a2, 0.3, 1);
      setVar(toolScene, "--v", seg(a2, 0, 0.3).toFixed(3));
      setVar(toolScene, "--k", k.toFixed(3));
      setVar(toolScene, "--so", Math.sin(k * Math.PI).toFixed(3));
      const a3 = seg(p, 0.72, 0.9); // ChatPlace: Kommentar, dann Nachricht
      setVar(toolScene, "--c", seg(a3, 0, 0.3).toFixed(3));
      setVar(toolScene, "--m", ease(seg(a3, 0.35, 1)).toFixed(3));

      const s = p >= START[2] ? 2 : p >= START[1] ? 1 : p >= START[0] ? 0 : -1;
      if (s !== step) {
        step = s;
        tItems.forEach((it, i) => {
          it.classList.toggle("is-active", i === s);
          it.classList.toggle("is-done", i < s);
        });
      }
      toolScene.classList.toggle("is-done", p >= 0.9);
    };

    const progress = () => {
      const r = toolScene.getBoundingClientRect();
      return clamp01(-r.top / Math.max(r.height - innerHeight, 1));
    };

    // Läuft nur, solange die Szene in der Nähe ist: Chips kreisen, Scrollwert läuft weich nach
    const loop = (now) => {
      const d = target - shown;
      shown = Math.abs(d) < 0.0005 ? target : shown + d * follow;
      render(shown, now / 1000);
      raf = near ? requestAnimationFrame(loop) : 0;
    };

    new IntersectionObserver(
      (entries) => {
        near = entries[0].isIntersecting;
        toolScene.classList.toggle("is-near", near);
        if (near && !raf) {
          target = shown = progress();
          raf = requestAnimationFrame(loop);
        }
      },
      { rootMargin: "30% 0px" }
    ).observe(toolScene);

    size();
    target = shown = progress();
    render(shown, performance.now() / 1000);
    addEventListener("scroll", () => {
      if (near) target = progress();
    }, { passive: true });
    addEventListener("resize", () => {
      size();
      target = progress();
    });
    if (document.fonts) document.fonts.ready.then(() => {
      lastW = 0;
      size();
    });
  }

  /* ---------- Fächer der Anleitungen ----------
     Die vier PDF-Karten liegen als Stapel, solange der Block unten am Rand steht, und
     fächern auf, je weiter er ins Bild kommt. Hochscrollen schiebt sie wieder zusammen. */
  const fan = $(".guides__fan");
  if (fan && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let fanTicking = false;
    const updateFan = () => {
      fanTicking = false;
      const r = fan.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const p = Math.min(Math.max((innerHeight - r.top) / (innerHeight * 0.7), 0), 1);
      fan.style.setProperty("--f", (1 - Math.pow(1 - p, 3)).toFixed(3));
    };
    addEventListener("scroll", () => {
      if (!fanTicking) {
        fanTicking = true;
        requestAnimationFrame(updateFan);
      }
    }, { passive: true });
    addEventListener("resize", updateFan);
    updateFan();
  }

  /* ---------- 3D-Karussell: Ergebnisse ----------
     Dreht sich automatisch im Kreis, vorderstes Bild scharf und hell,
     die übrigen abgedunkelt dahinter. Hover pausiert, Punkte springen. */
  const proofCarousel = $("#proofCarousel");
  // Ab 3 Bildern als Karussell, darunter bleibt das normale Raster
  if (
    proofCarousel &&
    $("#carouselRing").children.length >= 3 &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const ring = $("#carouselRing");
    const cards = [...ring.children];
    const N = cards.length;
    const step = 360 / N;
    const dotsBox = $("#carouselDots");
    let angle = 0;
    let timer = null;

    proofCarousel.classList.add("carousel--3d");

    const dots = cards.map((_, i) => {
      const d = document.createElement("button");
      d.className = "carousel__dot";
      d.setAttribute("aria-label", "Ergebnis " + (i + 1) + " anzeigen");
      d.addEventListener("click", () => {
        angle = -i * step;
        update();
        restart();
      });
      dotsBox.appendChild(d);
      return d;
    });

    const layout = () => {
      const w = Math.min(proofCarousel.offsetWidth * 0.55, 340);
      const radius = Math.round((w / 2 / Math.tan(Math.PI / N)) * 1.3);
      const cardH = Math.round(w * (1124 / 900) + 56);
      // Das vordere Bild wird durch die Perspektive optisch größer —
      // Bühne höher machen und Karten mittig setzen, damit nichts überlappt
      const stageH = Math.round(cardH * 1.3);
      const topOffset = Math.round((stageH - cardH) / 2);
      proofCarousel.style.setProperty("--cardW", w + "px");
      ring.parentElement.style.height = stageH + "px";
      cards.forEach((c, i) => {
        c.style.top = topOffset + "px";
        c.style.transform = `rotateY(${step * i}deg) translateZ(${radius}px)`;
      });
    };

    const update = () => {
      ring.style.transform = `rotateY(${angle}deg)`;
      const active = ((Math.round(-angle / step) % N) + N) % N;
      cards.forEach((c, i) => c.classList.toggle("is-front", i === active));
      dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
    };

    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => {
        angle -= step;
        update();
      }, 2300);
    };

    layout();
    update();
    restart();
    addEventListener("resize", layout);
  }

  /* ---------- Karten-Spotlight ---------- */
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  });

  /* ---------- Magnetische Buttons (Desktop) ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn--magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });

    /* ---------- Portrait-Tilt ---------- */
    const portrait = $("#portrait");
    if (portrait) {
      portrait.addEventListener("pointermove", (e) => {
        const r = portrait.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        portrait.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      portrait.addEventListener("pointerleave", () => (portrait.style.transform = ""));
    }
  }

  /* Gold-Funken im Hero und in anderen Abschnitten: js/sparks.js (data-sparks) */

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lesefortschritt: dünne goldene Linie ganz oben ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let barTicking = false;
  const updateBar = () => {
    barTicking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0).toFixed(4) + ")";
  };
  addEventListener("scroll", () => {
    if (!barTicking) {
      barTicking = true;
      requestAnimationFrame(updateBar);
    }
  }, { passive: true });
  addEventListener("resize", updateBar);
  updateBar();

  /* ---------- Laufband folgt dem Scrollen ----------
     Läuft im Stand langsam weiter, beim Scrollen schneller, und dreht beim Hochscrollen
     die Richtung um. Steht still, solange die Maus darauf liegt oder es nicht zu sehen ist. */
  const marquee = $("#marquee");
  if (marquee && !reducedMotion) {
    const track = marquee.querySelector(".marquee__track");
    const BASE = 45; // Pixel pro Sekunde im Stand
    let half = 0;
    let x = 0;
    let dir = 1;
    let boost = 0;
    let lastY = scrollY;
    let last = 0;
    let running = false;
    let hover = false;
    const measure = () => (half = track.scrollWidth / 2);
    const step = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      boost *= Math.pow(0.05, dt); // Schwung klingt in gut einer Sekunde ab
      if (!hover) x -= (BASE * dir + boost) * dt;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
      if (running) requestAnimationFrame(step);
      else last = 0;
    };
    marquee.classList.add("is-js");
    measure();
    if (document.fonts) document.fonts.ready.then(measure);
    addEventListener("resize", measure);
    addEventListener("scroll", () => {
      const dy = scrollY - lastY;
      lastY = scrollY;
      if (!dy) return;
      dir = dy > 0 ? 1 : -1;
      boost = Math.max(-1400, Math.min(1400, boost + dy * 5));
    }, { passive: true });
    marquee.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hover = true; });
    marquee.addEventListener("pointerleave", () => (hover = false));
    new IntersectionObserver((entries) => {
      const vis = entries[0].isIntersecting;
      if (vis && !running) {
        running = true;
        requestAnimationFrame(step);
      } else if (!vis) {
        running = false;
      }
    }).observe(marquee);
  }

  /* ---------- Foto im Hero wandert beim Scrollen leicht im Rahmen ----------
     Funktioniert ohne Maus, also auch am Handy. Der langsame Zoom (CSS) gibt dafür Rand. */
  const pan = $(".portrait__pan");
  if (pan && !reducedMotion) {
    let panTicking = false;
    const updatePan = () => {
      panTicking = false;
      const r = pan.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const d = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      pan.style.transform = "translate3d(0," + (Math.max(-1, Math.min(1, d)) * -10).toFixed(1) + "px,0)";
    };
    addEventListener("scroll", () => {
      if (!panTicking) {
        panTicking = true;
        requestAnimationFrame(updatePan);
      }
    }, { passive: true });
    updatePan();
  }

  /* ---------- Hero tritt beim Wegscrollen zurück (nur breite Bildschirme) ----------
     Text zieht etwas schneller nach oben und blendet aus, das Foto bleibt etwas zurück. */
  const heroContent = $(".hero__content");
  const heroVisual = $(".hero__visual");
  if (heroContent && heroVisual && !reducedMotion) {
    let heroTicking = false;
    const updateHero = () => {
      heroTicking = false;
      if (innerWidth <= 900) {
        heroContent.style.transform = heroContent.style.opacity = heroVisual.style.transform = "";
        return;
      }
      const y = Math.min(scrollY, innerHeight * 1.2);
      const k = y / innerHeight;
      heroContent.style.transform = "translate3d(0," + (-y * 0.14).toFixed(1) + "px,0)";
      heroContent.style.opacity = Math.max(1 - k * 1.1, 0).toFixed(3);
      heroVisual.style.transform = "translate3d(0," + (y * 0.1).toFixed(1) + "px,0) scale(" + (1 - k * 0.06).toFixed(4) + ")";
    };
    addEventListener("scroll", () => {
      if (!heroTicking) {
        heroTicking = true;
        requestAnimationFrame(updateHero);
      }
    }, { passive: true });
    addEventListener("resize", updateHero);
    updateHero();
  }

  /* ---------- Hero-Foto zoomt am Handy über die ganze Seite herein ----------
     Julian, 06.10.2026: Am Handy sieht man oben erst nur den Text. Beim Runterscrollen
     erscheint das Foto leicht durchsichtig und groß über dem ganzen Bildschirm, zoomt dann
     in seinen Rahmen und ist erst dort klar zu sehen. Hochscrollen spielt es rückwärts ab.
     Das große Foto liegt hinter dem Text, damit Text und Knöpfe lesbar bleiben.
     Nur im Handy-Layout (bis 900 px, Foto unter dem Text); am Computer steht das Foto neben
     dem Text und bleibt wie es ist. Bewegt wird nur das Foto (.portrait__clip), Rahmen und
     Funken blenden zum Schluss ein. Ohne Skript und mit reduzierter Bewegung: wie bisher. */
  const zPortrait = $("#portrait");
  const zClip = zPortrait && zPortrait.querySelector(".portrait__clip");
  const zVisual = $(".hero__visual");
  const zHero = $(".hero");
  if (zClip && zVisual && zHero && !reducedMotion) {
    const FADE = 0.15; // erstes Stück Scrollweg: Foto taucht durchsichtig auf
    const START_OPACITY = 0.35; // so durchsichtig liegt es anfangs über der Seite
    const LAND_AT = 0.55; // fertig, wenn die Fotomitte bei 55 % der Bildschirmhöhe ist
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let zOn = false;
    let zTicking = false;
    const zReset = () => {
      zClip.style.transform = zClip.style.opacity = "";
      zClip.varCache = null;
      zPortrait.style.removeProperty("--hz-ui");
      zPortrait.varCache = null;
    };
    const updateZoom = () => {
      zTicking = false;
      const mobile = innerWidth <= 900;
      if (mobile !== zOn) {
        zOn = mobile;
        zHero.classList.toggle("hero--zoomfx", mobile);
        zVisual.classList.toggle("is-zoomfx", mobile);
        zPortrait.classList.toggle("is-zoomfx", mobile);
        if (!mobile) zReset();
      }
      if (!mobile) return;
      // .portrait selbst wird nicht verschoben: seine Lage ist der Platz des Fotos im Rahmen
      const r = zPortrait.getBoundingClientRect();
      const vw = innerWidth;
      const vh = innerHeight;
      const cy = r.top + r.height / 2;
      const range = Math.max(cy + scrollY - vh * LAND_AT, vh * 0.35);
      const q = clamp01(scrollY / range);
      if (q >= 1 || r.bottom < -vh) {
        setVar(zClip, "transform", "translateZ(0)"); // wie im CSS: Safari behält die Rundung
        setVar(zClip, "opacity", "1");
        setVar(zPortrait, "--hz-ui", "1");
        return;
      }
      const shown = clamp01(q / FADE);
      const e = ease(clamp01((q - FADE) / (1 - FADE)));
      const k = 1 - e;
      // Anfangs so groß, dass es den ganzen Bildschirm bedeckt, mittig im Bild
      const big = Math.max(vw / r.width, vh / r.height) * 1.05;
      const sc = 1 + (big - 1) * k;
      const dx = (vw / 2 - (r.left + r.width / 2)) * k;
      const dy = (vh / 2 - cy) * k;
      setVar(zClip, "transform", "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px,0) scale(" + sc.toFixed(4) + ")");
      setVar(zClip, "opacity", (shown * (START_OPACITY + (1 - START_OPACITY) * e)).toFixed(3));
      setVar(zPortrait, "--hz-ui", clamp01((e - 0.7) / 0.3).toFixed(3));
    };
    const onZoomScroll = () => {
      if (!zTicking) {
        zTicking = true;
        requestAnimationFrame(updateZoom);
      }
    };
    addEventListener("scroll", onZoomScroll, { passive: true });
    addEventListener("resize", onZoomScroll);
    updateZoom();
  }
})();
