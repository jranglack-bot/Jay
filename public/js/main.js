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
  // die Anmeldungen bringt (oben, abschluss, abschluss-via-gelernt, abschluss-via-zahlen,
  // abschluss-event).
  const funnelUrl = (knopf) => FUNNEL_URL + "&utm_content=" + knopf;

  const $ = (sel) => document.querySelector(sel);

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

    /* Der goldene Hero-Knopf springt zum Angebot direkt unter dem Hero: normal zum
       Angebotskasten (#videotraining), im Live-Event-Modus zum Event, das dann an dieser
       Stelle steht. Werbelinks gibt es nur dort und im Abschluss, jeweils mit Sternchen und
       Erklärung direkt darunter. Die leisen Links in der Mitte springen zum Abschluss. */
    const heroLink = $("#heroOffer");
    const offerSec = $("#videotraining");
    const pillText = $("#webinarPillText");

    if (c.eventActive) {
      heroLink.href = "#webinar";
      heroLink.innerHTML = 'Zum kostenlosen Live-Event <span class="btn__arrow btn__arrow--down">↓</span>';
      offerSec.hidden = true;
      // Finale CTA unten ebenfalls aufs Live-Event drehen
      $("#ctaFunnel").href = c.webinarUrl;
      $("#ctaFunnel").innerHTML = 'Zum kostenlosen Live-Event* <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Das nächste Live-Event steht an. Dort siehst du live, wie das System funktioniert, und kannst deine Fragen direkt stellen.";
      // Die drei Schritte beschreiben den Funnel, nicht das Event
      $("#ctaSteps").hidden = true;
      const ctaAlt = $("#ctaAlt");
      ctaAlt.href = funnelUrl("abschluss-event");
      ctaAlt.hidden = false;
      // Event-Sektion an die Stelle des Angebotskastens direkt unter den Hero
      $(".hero").after(webinarSec);
    } else {
      heroLink.href = "#videotraining";
      heroLink.innerHTML = 'Zum kostenlosen Videotraining <span class="btn__arrow btn__arrow--down">↓</span>';
      offerSec.hidden = false;
      $("#offerFunnel").href = funnelUrl("oben");
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

  /* ---------- Zusammensetz-Animation (Bildsequenz, scrollgesteuert) ----------
     61 Einzelbilder aus dem Seedance-Video (public/frames/rooftop/) werden auf ein
     Canvas gemalt: weit weg = Scherben, Bildschirmmitte = fertiges Foto,
     Rückwärtsscrollen = zerfällt wieder. Einzelbilder statt Video, weil Browser
     (vor allem Safari auf dem iPhone) beim ständigen Springen im Video ruckeln. */
  const asmCanvas = $("#assembleCanvas");
  if (asmCanvas) {
    const FRAMES = 61;
    const HOLD = 0.12; // Zone um die Mitte, in der das Bild komplett bleibt
    const frameSrc = (i) => "frames/rooftop/" + String(i + 1).padStart(3, "0") + ".webp";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const actx = asmCanvas.getContext("2d");
    const imgs = new Array(FRAMES);
    const ready = new Array(FRAMES).fill(false);
    let target = reduced ? FRAMES - 1 : 0; // Ziel-Bild laut Scrollposition
    let shown = target; // aktuell gezeigtes Bild (läuft weich hinterher)
    let raf = 0;

    // Nächstgelegenes schon geladenes Bild, solange noch nicht alle da sind
    const nearest = (i) => {
      for (let d = 0; d < FRAMES; d++) {
        if (i - d >= 0 && ready[i - d]) return i - d;
        if (i + d < FRAMES && ready[i + d]) return i + d;
      }
      return -1;
    };

    const draw = (pos) => {
      const a = Math.floor(pos);
      const ia = nearest(a);
      if (ia < 0) return;
      const W = asmCanvas.width;
      const H = asmCanvas.height;
      actx.globalAlpha = 1;
      actx.drawImage(imgs[ia], 0, 0, W, H);
      // Zwischen zwei benachbarten Bildern weich überblenden
      const b = Math.min(a + 1, FRAMES - 1);
      const f = pos - a;
      if (ia === a && b !== a && ready[b] && f > 0.02) {
        actx.globalAlpha = f;
        actx.drawImage(imgs[b], 0, 0, W, H);
        actx.globalAlpha = 1;
      }
    };

    // Canvas-Auflösung an Anzeigegröße und Pixeldichte anpassen (Bilder sind 1280 breit)
    const sizeCanvas = () => {
      const w = Math.max(Math.min(Math.round(asmCanvas.clientWidth * devicePixelRatio), 1280), 1);
      const h = Math.round((w * 9) / 16);
      if (asmCanvas.width !== w || asmCanvas.height !== h) {
        asmCanvas.width = w;
        asmCanvas.height = h;
        draw(shown);
      }
    };

    // Weich hinterherlaufen statt springen (glättet Mausrad- und Touch-Sprünge)
    const tick = () => {
      const diff = target - shown;
      shown = Math.abs(diff) < 0.01 ? target : shown + diff * 0.2;
      draw(shown);
      raf = shown === target ? 0 : requestAnimationFrame(tick);
    };

    const updateTarget = () => {
      const r = asmCanvas.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const midDist =
        Math.abs(r.top + r.height / 2 - innerHeight / 2) / ((innerHeight + r.height) / 2);
      const p = Math.min(Math.max((midDist * 1.7 - HOLD) / (1 - HOLD), 0), 1);
      target = (1 - p) * (FRAMES - 1);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // Ladereihenfolge: erstes und letztes Bild zuerst, dann grob nach fein.
    // So läuft die Animation schon mit wenigen Bildern und wird immer feiner.
    const loadOrder = () => {
      if (reduced) return [FRAMES - 1];
      const seq = [0, FRAMES - 1];
      for (let step = 32; step >= 1; step >>= 1) {
        for (let i = 0; i < FRAMES; i += step) if (!seq.includes(i)) seq.push(i);
      }
      return seq;
    };

    const loadFrames = () => {
      const seq = loadOrder();
      let next = 0;
      const loadNext = () => {
        if (next >= seq.length) return;
        const i = seq[next++];
        const img = new Image();
        img.src = frameSrc(i);
        img
          .decode()
          .then(() => {
            imgs[i] = img;
            ready[i] = true;
            draw(shown);
          })
          .catch(() => {})
          .finally(loadNext);
      };
      for (let k = 0; k < 4; k++) loadNext(); // 4 Bilder parallel laden
    };

    sizeCanvas();
    addEventListener("resize", sizeCanvas);
    if (!reduced) {
      addEventListener("scroll", updateTarget, { passive: true });
      updateTarget();
    }

    // Bilder erst laden, wenn die Sektion in die Nähe scrollt (spart mobiles Datenvolumen)
    const asmIo = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          asmIo.disconnect();
          loadFrames();
        }
      },
      { rootMargin: "200% 0px" }
    );
    asmIo.observe(asmCanvas);
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
      const st = ex.style;
      st.setProperty("--m", m.toFixed(3));
      st.setProperty("--e", e.toFixed(3));
      st.setProperty("--rx", (56 * t).toFixed(2) + "deg");
      st.setProperty("--rz", (-36 * t - 4 * e).toFixed(2) + "deg");
      st.setProperty("--gap", px(e * pw * 0.3));
      st.setProperty("--fw", px(lerp(icon, pw, m)));
      st.setProperty("--fh", px(lerp(icon, ph, m)));
      st.setProperty("--fr", px(lerp(icon * 0.29, pw * 0.16, m)));
      st.setProperty("--fs", px(lerp(icon * 0.075, 2.5, m)));
      st.setProperty("--lw", px(lerp(lens, pw * 0.3, m)));
      st.setProperty("--lh", px(lerp(lens, pw * 0.075, m)));
      st.setProperty("--lt", px(lerp((icon - lens) / 2, pw * 0.05, m)));
      st.setProperty("--ls", px(lerp(icon * 0.075, 1.5, m)));
      st.setProperty("--dd", px(icon * 0.1));
      st.setProperty("--dr", px(icon * 0.15));
      explode.style.setProperty("--hint-out", seg(p, 0.03, 0.12).toFixed(3));
      inOrder.forEach((li, k) => {
        layers[li].style.setProperty("--in", seg(s, k * 0.11, k * 0.11 + 0.45).toFixed(3));
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

    // Weich hinterherlaufen statt springen (glättet Mausrad und Touch)
    const tick = () => {
      const d = target - shown;
      shown = Math.abs(d) < 0.0005 ? target : shown + d * 0.14;
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

  /* ---------- Gold-Partikel im Hero ---------- */
  const canvas = $("#particles");
  if (canvas && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let W, H, parts;
    const N = 70;
    function resize() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function spawn() {
      parts = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: (Math.random() * 2 + 0.6) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
        vy: (-Math.random() * 0.25 - 0.05) * devicePixelRatio,
        a: Math.random() * 0.55 + 0.25,
        tw: Math.random() * Math.PI * 2,
      }));
    }
    resize();
    spawn();
    addEventListener("resize", () => { resize(); spawn(); });
    // Partikel nur zeichnen, solange der Hero zu sehen ist
    let heroLoop = null;
    let heroVisible = true;
    (function loop(t) {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.02;
        if (p.y < -10 || p.x < -10 || p.x > W + 10) {
          p.x = Math.random() * W;
          p.y = H + 10;
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 191, 107, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
      if (heroVisible) requestAnimationFrame(loop);
      else heroLoop = loop;
    })(0);
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && heroLoop) {
        const l = heroLoop;
        heroLoop = null;
        requestAnimationFrame(l);
      }
    }).observe(canvas);
  }

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
})();
