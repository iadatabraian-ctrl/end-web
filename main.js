/* El Núcleo Digital — v3
   Reglas: script clásico (sin modules), cada init aislado con safe(),
   contenido siempre visible si el JS falla. */
(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[nucleo] " + name + ":", e); }
  }

  /* ---------- reveals ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal:not([data-split])");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });

    // red de seguridad: nada queda invisible pase lo que pase
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------- nav móvil ---------- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!btn || !links) return;

    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- parallax suave de la foto del hero ---------- */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var img = document.querySelector(".hero-fig img");
    if (img && window.matchMedia("(min-width:1081px)").matches) {
      gsap.to(img, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
      });
    }

    var bandImg = document.querySelector(".band-fig img");
    if (bandImg) {
      gsap.fromTo(bandImg, { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: ".band", start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    }
  }

  /* ---------- entrada del hero ---------- */
  function initHeroIntro() {
    if (!window.gsap) return;
    var t = document.querySelectorAll(".hero-txt > *");
    var f = document.querySelector(".hero-fig img");
    if (t.length) {
      gsap.from(t, { y: 26, opacity: 0, duration: .95, stagger: .09, ease: "power3.out", clearProps: "all" });
    }
    if (f) {
      gsap.to(f, { scale: 1, duration: 1.6, ease: "power3.out" });
    }
  }

  /* ---------- nav: hairline más marcada al hacer scroll ---------- */
  function initNavScroll() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.style.borderBottomColor = window.scrollY > 12 ? "rgba(11,12,13,.18)" : "rgba(11,12,13,.09)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function boot() {
    safe(initReveal, "reveal");
    safe(initNav, "nav");
    safe(initNavScroll, "navScroll");
    safe(initHeroIntro, "heroIntro");
    safe(initHeroParallax, "heroParallax");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
