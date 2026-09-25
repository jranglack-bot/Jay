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
    note: "",
    noteActive: false,
    eventActive: false,
    eventDate: "",
    links: [],
  };
  const FUNNEL_URL =
    "https://julians-way.de/videotraining/?utm_source=instagram&utm_medium=bio&utm_campaign=julians-way";

  const $ = (sel) => document.querySelector(sel);

  /* ---------- Funnel-Links setzen ---------- */
  ["navFunnel", "mobileFunnel", "heroFunnel", "ctaFunnel"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = FUNNEL_URL;
  });

  /* ---------- Live-Event-Konfiguration anwenden ---------- */
  let cdTimer = null;

  function applyConfig(cfg) {
    const c = { ...DEFAULTS, ...cfg };
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

    /* Live-Event-Modus: Event steht überall an erster Stelle */
    const webinarSec = $("#webinar");
    const heroBtn = $("#heroFunnel");
    const heroAlt = $("#heroSecondary");
    const navBtn = $("#navFunnel");
    const mobBtn = $("#mobileFunnel");
    const pillText = $("#webinarPillText");

    if (c.eventActive) {
      heroBtn.href = c.webinarUrl;
      heroBtn.innerHTML = 'Sichere dir deinen Platz im Live-Event <span class="btn__arrow">→</span>';
      heroAlt.href = FUNNEL_URL;
      heroAlt.textContent = "Oder zum Videotraining";
      navBtn.href = c.webinarUrl;
      navBtn.textContent = "Zum Live-Event";
      mobBtn.href = c.webinarUrl;
      mobBtn.textContent = "Zum Live-Event";
      // Finale CTA unten ebenfalls aufs Live-Event drehen
      $("#ctaFunnel").href = c.webinarUrl;
      $("#ctaFunnel").innerHTML = 'Sichere dir deinen Platz im Live-Event <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Das nächste Live-Event steht an. Schnapp dir deinen Platz, bevor es voll ist.";
      const ctaAlt = $("#ctaAlt");
      ctaAlt.href = FUNNEL_URL;
      ctaAlt.hidden = false;
      // Event-Sektion direkt unter den Hero ziehen
      $("#marquee").after(webinarSec);
    } else {
      heroBtn.href = FUNNEL_URL;
      heroBtn.innerHTML = 'Teste, ob du geeignet bist <span class="btn__arrow">→</span>';
      heroAlt.href = "#weg";
      heroAlt.textContent = "Meine Story";
      navBtn.href = FUNNEL_URL;
      navBtn.textContent = "Zum Videotraining";
      mobBtn.href = FUNNEL_URL;
      mobBtn.textContent = "Zum Videotraining";
      // Finale CTA unten zurück aufs Videotraining
      $("#ctaFunnel").href = FUNNEL_URL;
      $("#ctaFunnel").innerHTML = 'Teste jetzt, ob du geeignet bist <span class="btn__arrow">→</span>';
      $("#ctaLead").textContent = "Teste in 10 Sekunden, ob das SCB-System zu dir passt. 6 Fragen, fertig. Keine Vorkenntnisse nötig.";
      $("#ctaAlt").hidden = true;
      // Event-Sektion zurück an ihren Platz (vor die finale CTA)
      document.querySelector(".cta").before(webinarSec);
    }

    /* Sticky-CTA (Handy) folgt dem aktiven Modus */
    const stickyBtn = $("#stickyBtn");
    if (c.eventActive) {
      stickyBtn.href = c.webinarUrl;
      stickyBtn.innerHTML = 'Platz sichern: Live-Event <span class="btn__arrow">→</span>';
    } else {
      stickyBtn.href = FUNNEL_URL;
      stickyBtn.innerHTML = 'Teste, ob du geeignet bist <span class="btn__arrow">→</span>';
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
    const target = c.eventActive && c.eventDate ? new Date(c.eventDate).getTime() : NaN;
    if (!isNaN(target)) {
      const pad = (n) => String(n).padStart(2, "0");
      const tick = () => {
        const diff = target - Date.now();
        if (diff <= 0) {
          // Das Event läuft gerade
          cd.hidden = true;
          pillText.textContent = "WIR SIND LIVE";
          webinarBtn.innerHTML = 'Jetzt live dazukommen <span class="btn__arrow">→</span>';
          clearInterval(cdTimer);
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
      webinarBtn.innerHTML = 'Jetzt Platz sichern <span class="btn__arrow">→</span>';
    }
    return c;
  }

  applyConfig(DEFAULTS);

  /* ---------- Nav + Sticky-CTA ---------- */
  const nav = $("#nav");
  const stickyCta = $("#stickyCta");
  const footer = document.querySelector(".footer");
  addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", scrollY > 40);
    // Sticky-CTA ausblenden, sobald der Footer sichtbar wird,
    // damit Impressum & Datenschutz nicht verdeckt werden
    const footerInView = footer.getBoundingClientRect().top < innerHeight;
    stickyCta.classList.toggle(
      "is-visible",
      scrollY > innerHeight * 0.9 && !footerInView
    );
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

  /* ---------- Zusammensetz-Animation (Seedance-Video, scrollgesteuert) ----------
     Das Video zeigt Scherben, die sich zum Rooftop-Foto zusammensetzen.
     Scrollposition steuert die Videozeit: weit weg = Anfang (Scherben),
     Bildschirmmitte = Ende (fertiges Foto). Rückwärtsscrollen = zerfällt wieder. */
  const vid = $("#assembleVid");
  if (vid) {
    let vidDur = 0;
    const HOLD = 0.12; // Zone um die Mitte, in der das Bild komplett bleibt

    const updateAssemble = () => {
      if (!vidDur) return;
      const r = vid.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const midDist =
        Math.abs(r.top + r.height / 2 - innerHeight / 2) / ((innerHeight + r.height) / 2);
      const p = Math.min(Math.max((midDist * 1.7 - HOLD) / (1 - HOLD), 0), 1);
      const t = (1 - p) * (vidDur - 0.05);
      if (Math.abs(vid.currentTime - t) > 0.02) vid.currentTime = t;
    };

    const initVid = () => {
      vidDur = vid.duration || 0;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Ohne Animation: direkt das fertige Foto zeigen
        vid.currentTime = Math.max(vidDur - 0.05, 0);
        return;
      }
      addEventListener("scroll", updateAssemble, { passive: true });
      addEventListener("resize", updateAssemble);
      updateAssemble();
    };
    if (vid.readyState >= 1) initVid();
    else vid.addEventListener("loadedmetadata", initVid, { once: true });

    // Video erst laden, wenn die Sektion in die Nähe scrollt (spart mobiles Datenvolumen)
    const vidIo = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          vid.preload = "auto";
          vid.load();
          vidIo.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    vidIo.observe(vid);
  }

  /* ---------- 3D-Karussell: Ergebnisse ----------
     Dreht sich automatisch im Kreis, vorderstes Bild scharf und hell,
     die übrigen abgedunkelt dahinter. Hover pausiert, Punkte springen. */
  const proofCarousel = $("#proofCarousel");
  if (proofCarousel && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
