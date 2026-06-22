
(function () {
  "use strict";

  function q(sel) {
    return document.querySelector(sel);
  }

 
  var toggle = q("[data-dash-toggle]");
  var side = q(".dash__side");
  var overlay = q(".dash__overlay");

  function closeMenu() {
    if (side) side.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  if (toggle && side) {
    toggle.addEventListener("click", function () {
      var open = !side.classList.contains("is-open");
      side.classList.toggle("is-open", open);
      if (overlay) overlay.classList.toggle("is-visible", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
  }
  if (overlay) overlay.addEventListener("click", closeMenu);

  // Smooth scroll for sidebar anchor links
  if (side) {
    side.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (window.matchMedia("(max-width: 1024px)").matches) closeMenu();
      });
    });
    side.querySelectorAll('a[href$=".html"]').forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1024px)").matches) closeMenu();
      });
    });
  }

  // Highlight active sidebar link on scroll via IntersectionObserver
  (function () {
    if (!side || typeof IntersectionObserver === "undefined") return;
    var navLinks = side.querySelectorAll('a[href^="#"]');
    if (!navLinks.length) return;
    var sectionIds = [];
    navLinks.forEach(function (a) { sectionIds.push(a.getAttribute("href").slice(1)); });
    var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!sections.length) return;

    function setActive(id) {
      navLinks.forEach(function (a) {
        if (a.getAttribute("href") === "#" + id) {
          a.setAttribute("aria-current", "page");
        } else {
          a.removeAttribute("aria-current");
        }
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  })();

  
  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && v.trim()) || fallback;
  }

  function initCharts() {
    if (typeof window.Chart === "undefined") return;

    var primary = cssVar("--color-primary", "#1e6bb8");
    var accent = cssVar("--color-accent", "#0d9488");
    var muted = cssVar("--color-text-muted", "#5c6b7a");
    var border = cssVar("--color-border", "#e2e8f0");

    Chart.defaults.color = muted;
    Chart.defaults.borderColor = border;
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;

    function mkLine(canvas, labels, datasets) {
      return new Chart(canvas, {
        type: "line",
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: { legend: { position: "top" } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { precision: 0 } },
          },
        },
      });
    }

    function mkDoughnut(canvas, labels, values, colors) {
      return new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{ data: values, backgroundColor: colors, borderColor: "#fff", borderWidth: 2 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: { legend: { position: "bottom" } },
        },
      });
    }

    function mkBar(canvas, labels, datasets) {
      return new Chart(canvas, {
        type: "bar",
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "top" } },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, ticks: { precision: 0 } },
          },
        },
      });
    }

    
    var a1 = document.getElementById("adm_orders");
    if (a1) {
      mkLine(
        a1,
        ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
        [
          {
            label: "Shipped",
            data: [8, 10, 9, 12, 11, 13, 14, 16, 15, 17, 18, 19],
            borderColor: primary,
            backgroundColor: "rgba(30,107,184,0.12)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: "Delivered",
            data: [7, 9, 9, 11, 10, 12, 13, 15, 14, 16, 17, 18],
            borderColor: accent,
            backgroundColor: "rgba(13,148,136,0.10)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ]
      );
    }

    var a2 = document.getElementById("adm_inventory");
    if (a2) {
      mkDoughnut(a2, ["In stock", "Low stock", "Backorder"], [72, 18, 10], [primary, "#f59e0b", "#ef4444"]);
    }

    
    var c1 = document.getElementById("cus_quotes");
    if (c1) {
      mkLine(
        c1,
        ["Q2", "Q3", "Q4", "Q1"],
        [
          {
            label: "Quotes",
            data: [2, 4, 3, 3],
            borderColor: primary,
            backgroundColor: "rgba(30,107,184,0.12)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
          {
            label: "Orders",
            data: [1, 2, 1, 2],
            borderColor: accent,
            backgroundColor: "rgba(13,148,136,0.10)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ]
      );
    }

    var c2 = document.getElementById("cus_support");
    if (c2) {
      mkBar(c2, ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"], [
        { label: "Training", data: [0, 1, 0, 1, 0, 1], backgroundColor: "rgba(30,107,184,0.75)" },
        { label: "Maintenance", data: [1, 0, 1, 0, 1, 0], backgroundColor: "rgba(13,148,136,0.75)" },
        { label: "Parts", data: [0, 0, 1, 0, 1, 0], backgroundColor: "rgba(245,158,11,0.8)" },
      ]);
    }
  }

  function applyAosPreset(selector, animation, options) {
    document.querySelectorAll(selector).forEach(function (el, index) {
      if (el.hidden || el.hasAttribute("data-aos") || el.closest("[data-no-aos]")) return;
      el.setAttribute("data-aos", animation);

      var delay =
        options && typeof options.delayStep === "number"
          ? (options.delayStart || 0) + index * options.delayStep
          : 0;
      if (delay > 0) {
        el.setAttribute("data-aos-delay", String(Math.min(delay, 320)));
      }
    });
  }

  function initDashboardAos() {
    if (typeof window.AOS === "undefined") return;

    applyAosPreset(".dash__top, .kpi, .panel", "fade-up", {
      delayStep: 60,
    });
    applyAosPreset(".dashSearch, .dashUser, .panel .btn", "zoom-in", {
      delayStart: 40,
      delayStep: 50,
    });

    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }

  initCharts();
  initDashboardAos();
})();

