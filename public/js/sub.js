/* ============================================================
   JULIANS WAY: Unterseiten (Anleitungen, Meine Tools)
   Startet oben, Lesefortschritt, Karten erscheinen nacheinander,
   Lichtfleck folgt der Maus. Klassisches Skript wie js/main.js.
   ============================================================ */
(() => {
  "use strict";

  /* ---------- Immer oben anfangen ----------
     Die Anleitungen-Seite öffnete bei Julian unten (05.10.2026). Ohne Sprungziel (#...) stellt
     der Browser deshalb keine alte Scrollposition wieder her. */
  if (!location.hash) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    scrollTo(0, 0);
  }

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lesefortschritt: dünne goldene Linie ganz oben ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  let ticking = false;
  const updateBar = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0).toFixed(4) + ")";
  };
  addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateBar);
    }
  }, { passive: true });
  addEventListener("resize", updateBar);
  updateBar();

  /* ---------- Karten und Gruppentitel erscheinen beim Scrollen ----------
     Was gleichzeitig ins Bild kommt, erscheint von oben links nach unten rechts
     nacheinander. Ohne Skript oder mit reduzierter Bewegung ist alles sofort da. */
  const items = document.querySelectorAll(".pdf-card, .tool-card, .sub-group__title");
  if (!reduced && "IntersectionObserver" in window && items.length) {
    document.documentElement.classList.add("sub-anim");
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return ra.top - rb.top || ra.left - rb.left;
          })
          .forEach((el, i) => {
            io.unobserve(el);
            el.style.setProperty("--d", i * 90 + "ms");
            el.classList.add("is-in");
            // Verzögerung danach entfernen, sonst reagiert der Hover-Effekt träge
            setTimeout(() => el.style.removeProperty("--d"), 900 + i * 90);
          });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Anleitungen nach Thema filtern ----------
     Ohne Skript springen die Themen-Knöpfe nur zum passenden Abschnitt. Mit Skript zeigen
     sie nur dieses Thema, „Alle“ zeigt wieder alles. */
  const chips = [...document.querySelectorAll(".gi__chip")];
  const groups = [...document.querySelectorAll("[data-group]")];
  if (chips.length && groups.length) {
    const show = (f, animate) => {
      chips.forEach((c) => {
        const on = c.dataset.filter === f;
        c.classList.toggle("is-on", on);
        if (on) c.setAttribute("aria-current", "true");
        else c.removeAttribute("aria-current");
      });
      groups.forEach((g) => {
        const on = f === "alle" || g.dataset.group === f;
        g.classList.toggle("is-hidden", !on);
        g.classList.remove("gi-enter");
        if (on && animate && !reduced) {
          void g.offsetWidth; // Animation neu starten
          g.classList.add("gi-enter");
        }
      });
    };
    chips.forEach((c) => {
      c.hidden = false;
      c.addEventListener("click", (e) => {
        e.preventDefault();
        show(c.dataset.filter, true);
      });
    });
    show("alle", false);
  }

  /* ---------- Lichtfleck auf den Karten folgt der Maus ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".pdf-card, .tool-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }
})();
