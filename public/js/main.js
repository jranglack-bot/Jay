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
  // die Anmeldungen bringt (abschluss, abschluss-via-gelernt, abschluss-via-zahlen, abschluss-event).
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

    /* Live-Event-Modus: Der Einstieg bleibt die Geschichte. Der zweite
       Hero-Button springt nur innerhalb der Seite. Werbelinks gibt es nur beim Event und im
       Abschluss, jeweils mit Sternchen und Erklärung direkt darunter. Die leisen Links in
       der Mitte springen zum Abschluss. */
    const heroLink = $("#heroSkipLink");
    const pillText = $("#webinarPillText");

    if (c.eventActive) {
      heroLink.href = "#webinar";
      heroLink.innerHTML = 'Zum Live-Event <span class="btn__arrow btn__arrow--down">↓</span>';
      // Finale CTA unten ebenfalls aufs Live-Event drehen
      $("#ctaFunnel").href = c.webinarUrl;
      $("#ctaFunnel").innerHTML = 'Zum kostenlosen Live-Event* <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Das nächste Live-Event steht an. Dort siehst du live, wie das System funktioniert, und kannst deine Fragen direkt stellen.";
      // Die drei Schritte beschreiben den Funnel, nicht das Event
      $("#ctaSteps").hidden = true;
      const ctaAlt = $("#ctaAlt");
      ctaAlt.href = funnelUrl("abschluss-event");
      ctaAlt.hidden = false;
      // Event-Sektion direkt unter den Hero ziehen
      $("#marquee").after(webinarSec);
    } else {
      heroLink.href = "#angebot";
      heroLink.innerHTML = 'Direkt zum Videotraining <span class="btn__arrow btn__arrow--down">↓</span>';
      // Finale CTA unten zurück aufs Videotraining
      $("#ctaFunnel").href = funnelUrl("abschluss");
      $("#ctaFunnel").innerHTML = 'Zu den Fragen und zum Video* <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Wenn du sehen willst, wo ich das alles gelernt hab, zeigt dir das Videotraining das System, mit dem ich arbeite. Das Video gibt's, aber erst nach ein paar Fragen. Die sind schnell beantwortet, wenn du weißt, was du willst.";
      $("#ctaSteps").hidden = false;
      $("#ctaAlt").hidden = true;
      // Event-Sektion zurück an ihren Platz (vor die finale CTA)
      document.querySelector(".cta").before(webinarSec);
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
      requestAnimationFrame(loop);
    })(0);
  }
})();
