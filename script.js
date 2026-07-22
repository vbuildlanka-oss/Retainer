/* =========================================================
   Cadence — interactions
   Crafted by VBUILD™
   ========================================================= */
(function () {
  "use strict";

  /* ---- Render Lucide icons ---- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---- Footer year ---- */
  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---- Sticky header shadow on scroll ---- */
  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Scroll reveal via IntersectionObserver ---- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    // Stagger siblings a touch for a refined cascade
    items.forEach(function (el) {
      var parent = el.parentElement;
      if (parent) {
        var sibs = Array.prototype.slice.call(parent.querySelectorAll(":scope > [data-reveal]"));
        var idx = sibs.indexOf(el);
        if (idx > 0) el.style.transitionDelay = Math.min(idx * 80, 320) + "ms";
      }
      io.observe(el);
    });
  }

  /* ---- Comparison toggle (table / cards) ---- */
  function initCompareToggle() {
    var buttons = document.querySelectorAll(".toggle-btn");
    var panels = document.querySelectorAll(".compare-panel");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var view = btn.getAttribute("data-view");

        buttons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });

        panels.forEach(function (panel) {
          var show = panel.getAttribute("data-panel") === view;
          panel.classList.toggle("is-hidden", !show);
          // A hidden panel never triggers the reveal observer, so ensure it's visible on show.
          if (show) panel.classList.add("is-visible");
        });

        renderIcons(); // re-draw icons in the newly shown panel
      });
    });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector(".faq-q");
      var ans = item.querySelector(".faq-a");
      if (!btn || !ans) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");

        // Close all (single-open accordion)
        items.forEach(function (other) {
          other.classList.remove("is-open");
          var oa = other.querySelector(".faq-a");
          var ob = other.querySelector(".faq-q");
          if (oa) oa.style.maxHeight = null;
          if (ob) ob.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          ans.style.maxHeight = ans.scrollHeight + 40 + "px";
        }
      });
    });

    // Recompute open panel height on resize
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var open = document.querySelector(".faq-item.is-open .faq-a");
        if (open) open.style.maxHeight = open.scrollHeight + 40 + "px";
      }, 150);
    });
  }

  /* ---- Smooth anchor scroll with sticky-header offset ---- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 82;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---- Init ---- */
  function init() {
    renderIcons();
    setYear();
    initHeader();
    initReveal();
    initCompareToggle();
    initFaq();
    initAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
