/* ============================================================
   JULIANS WAY: Gold-Funken
   Jedes Element mit data-sparks bekommt eine Leinwand mit langsam
   aufsteigenden Goldpunkten und ab und zu einem Funken, der mit
   Schweif durchfliegt. Gezeichnet wird nur, solange das Element zu
   sehen ist. Am Handy weniger Teilchen und geringere Auflösung.
   data-sparks="hero" (dicht), "soft" (ruhiger)
   data-sparks-front: Leinwand liegt vor dem Inhalt statt dahinter.
   ============================================================ */
(() => {
  "use strict";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const small = innerWidth <= 900;
  const DPR = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
  const KINDS = {
    hero: { per: 15000, max: small ? 45 : 85, streaks: 0.55 },
    soft: { per: 26000, max: small ? 26 : 50, streaks: 0.3 },
  };
  const fields = [];
  let raf = 0;
  let last = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  function makeField(host) {
    const kind = KINDS[host.dataset.sparks] || KINDS.soft;
    const front = host.hasAttribute("data-sparks-front");
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    if (!front) host.style.isolation = "isolate";
    const canvas = document.createElement("canvas");
    canvas.className = "sparks" + (front ? " sparks--front" : "");
    canvas.setAttribute("aria-hidden", "true");
    host.prepend(canvas);
    const f = { host, canvas, ctx: canvas.getContext("2d"), kind, dots: [], streaks: [], w: 0, h: 0, visible: false, next: rand(0.5, 2) };

    f.resize = () => {
      const w = Math.max(host.clientWidth, 1);
      const h = Math.max(host.clientHeight, 1);
      if (w === f.w && h === f.h) return;
      f.w = w;
      f.h = h;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      const n = Math.min(kind.max, Math.round((w * h) / kind.per));
      while (f.dots.length < n) f.dots.push(newDot(f, true));
      f.dots.length = n;
    };
    f.resize();
    if ("ResizeObserver" in window) new ResizeObserver(f.resize).observe(host);
    else addEventListener("resize", f.resize);

    new IntersectionObserver((entries) => {
      f.visible = entries[0].isIntersecting;
      if (f.visible) start();
    }, { rootMargin: "60px 0px" }).observe(host);
    fields.push(f);
  }

  function newDot(f, anywhere) {
    return {
      x: Math.random() * f.w,
      y: anywhere ? Math.random() * f.h : f.h + 8,
      r: rand(0.6, 2.2),
      vx: rand(-6, 6),
      vy: rand(-26, -6),
      a: rand(0.25, 0.8),
      tw: Math.random() * Math.PI * 2,
    };
  }

  // Ein Funke startet unten oder links und fliegt schräg nach oben durchs Bild
  function newStreak(f) {
    const fromLeft = Math.random() < 0.5;
    const speed = rand(260, 520);
    const ang = rand(-1.15, -0.45); // nach rechts oben
    return {
      x: fromLeft ? rand(-20, f.w * 0.3) : rand(0, f.w * 0.8),
      y: fromLeft ? rand(f.h * 0.3, f.h) : f.h + 10,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: 0,
      max: rand(0.7, 1.4),
      len: rand(0.06, 0.12),
    };
  }

  function draw(f, dt) {
    const { ctx, w, h } = f;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const p of f.dots) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.tw += dt * 1.6;
      if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, newDot(f, false));
      const al = p.a * (0.55 + 0.45 * Math.sin(p.tw));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(231,191,107," + al.toFixed(3) + ")";
      ctx.fill();
    }
    f.next -= dt;
    if (f.next <= 0) {
      f.streaks.push(newStreak(f));
      f.next = rand(0.6, 1.6) / f.kind.streaks;
    }
    f.streaks = f.streaks.filter((s) => s.life < s.max);
    for (const s of f.streaks) {
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const fade = Math.sin((s.life / s.max) * Math.PI); // an, hell, aus
      const tx = s.x - s.vx * s.len;
      const ty = s.y - s.vy * s.len;
      const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
      g.addColorStop(0, "rgba(236,167,20,0)");
      g.addColorStop(1, "rgba(255,226,160," + (0.9 * fade).toFixed(3) + ")");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,240,200," + fade.toFixed(3) + ")";
      ctx.fill();
    }
  }

  function loop(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;
    let any = false;
    for (const f of fields) {
      if (!f.visible) continue;
      any = true;
      draw(f, dt);
    }
    if (any) raf = requestAnimationFrame(loop);
    else {
      raf = 0;
      last = 0;
    }
  }

  function start() {
    if (!raf) raf = requestAnimationFrame(loop);
  }

  document.querySelectorAll("[data-sparks]").forEach(makeField);
})();
