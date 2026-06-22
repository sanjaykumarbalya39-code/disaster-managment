
(function () {
  "use strict";


  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        preloader.classList.add("preloader--hide");
      }, 1500);
    });
  }


  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  
  function onScrollHeader() {
    if (!header) return;
    const hero = document.querySelector(".hero");
    if (hero) {
      if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    } else {
      header.classList.add("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          navToggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
          document.body.style.overflow = "";
        }
      });
    });
  }

  
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          (header ? header.offsetHeight : 0) -
          12;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  
  function setActiveNav() {
    var seg = window.location.pathname.split("/").pop();
    var normalized = seg && seg.length ? seg : "index.html";
    if (normalized === "" || normalized === "/") normalized = "index.html";
    document.querySelectorAll(".nav__link").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const file = href.split("/").pop();
      if (file === normalized) {
        link.classList.add("is-active");
      }
    });
  }
  setActiveNav();

  
  (function productDetailFromQuery() {
    const root = document.querySelector("[data-product-root]");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id") || "patient-monitor";
    var blocks = root.querySelectorAll("[data-product-detail]");
    if (!blocks.length) return;
    var found = false;
    blocks.forEach(function (el) {
      var match = el.getAttribute("data-product-detail") === id;
      el.hidden = !match;
      if (match) found = true;
    });
    if (!found) {
      blocks.forEach(function (el) {
        el.hidden = el.getAttribute("data-product-detail") !== "patient-monitor";
      });
    }
  })();

  function applyAosPreset(selector, animation, options) {
    document.querySelectorAll(selector).forEach(function (el, index) {
      if (el.hidden || el.hasAttribute("data-aos") || el.closest("[data-no-aos]")) return;
      el.setAttribute("data-aos", animation);

      var delay =
        options && typeof options.delayStep === "number"
          ? (options.delayStart || 0) + index * options.delayStep
          : 0;
      if (delay > 0) {
        el.setAttribute("data-aos-delay", String(Math.min(delay, 360)));
      }
      if (options && options.anchorPlacement) {
        el.setAttribute("data-aos-anchor-placement", options.anchorPlacement);
      }
    });
  }

  function initAos() {
    if (typeof window.AOS === "undefined") return;

    applyAosPreset("main > section, .auth-card, .error-page", "fade-up", {
      anchorPlacement: "top-bottom",
    });
    applyAosPreset(".hero__content > *", "fade-up", {
      delayStep: 80,
      anchorPlacement: "top-bottom",
    });
    applyAosPreset(
      ".split > *, .cards-grid > *, .why-grid > *, .process-linear > *, .feature-list > *, .blog-grid > *, .stats-grid > *, .pricing-grid > *, .pricing-comparison__cards > *, .comparison-grid > *, .contact-grid > *, .contact-cards > *, .compliance-panel > *, .faq-list > *, .service-grid > *",
      "fade-up",
      {
        delayStart: 40,
        delayStep: 70,
        anchorPlacement: "top-bottom",
      }
    );
    applyAosPreset(
      ".hero__actions > *, .btn-row > *, .cta-band, .subscribe-form, .form-grid > .form-group, .form-grid > fieldset",
      "zoom-in",
      {
        delayStart: 80,
        delayStep: 60,
        anchorPlacement: "top-bottom",
      }
    );

    window.AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 72,
      disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }

  initAos();

  
  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = value.toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const obs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-counter"), 10);
          if (!isNaN(target)) {
            animateCounter(el, target, 2000);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach(function (c) {
      obs.observe(c);
    });
  }

  
  const track = document.querySelector(".testimonial-slides");
  const slides = track ? track.querySelectorAll(".testimonial-slide") : [];
  const dotsWrap = document.querySelector(".testimonial-dots");

  if (track && slides.length) {
    const outer = track.parentElement;
    let index = 0;
    let auto = null;
    var layoutRetries = 0;

    function trackWidth() {
      if (!outer) return 0;
      var r = outer.getBoundingClientRect();
      return Math.max(0, Math.round(r.width));
    }

    function layoutSlides() {
      if (!outer) return;
      var w = trackWidth();
      if (w < 2) {
        if (layoutRetries < 12) {
          layoutRetries += 1;
          window.requestAnimationFrame(function () {
            layoutSlides();
          });
        }
        return;
      }
      layoutRetries = 0;
      slides.forEach(function (slide) {
        slide.style.flex = "0 0 " + w + "px";
        slide.style.width = w + "px";
        slide.style.maxWidth = w + "px";
      });
      goTo(index);
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      if (!outer) return;
      var w = trackWidth();
      if (w < 2) w = outer.offsetWidth || 0;
      track.style.transform = "translateX(-" + index * w + "px)";
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (dot, di) {
          dot.classList.toggle("is-active", di === index);
        });
      }
    }

    if (dotsWrap && !dotsWrap.children.length) {
      slides.forEach(function (_, i) {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Slide " + (i + 1));
        if (i === 0) b.classList.add("is-active");
        b.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(b);
      });
    } else if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach(function (dot, i) {
        dot.addEventListener("click", function () { goTo(i); });
      });
    }

    layoutSlides();
    window.addEventListener("resize", function () {
      layoutSlides();
    });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(function () {
        layoutSlides();
      }).observe(outer);
    }

    auto = setInterval(function () { goTo(index + 1); }, 6000);
    track.addEventListener("mouseenter", function () {
      if (auto) clearInterval(auto);
      auto = null;
    });
    track.addEventListener("mouseleave", function () {
      auto = setInterval(function () { goTo(index + 1); }, 6000);
    });
  }

  
  function showFieldError(input, message) {
    input.classList.add("is-invalid");
    let err = input.parentElement.querySelector(".form-error");
    if (!err) {
      err = document.createElement("p");
      err.className = "form-error";
      err.setAttribute("role", "alert");
      input.parentElement.appendChild(err);
    }
    err.textContent = message;
    err.style.display = "block";
  }

  function clearFieldError(input) {
    input.classList.remove("is-invalid");
    const err = input.parentElement.querySelector(".form-error");
    if (err) err.style.display = "none";
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;
      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const service = contactForm.querySelector('[name="service"]');
      const message = contactForm.querySelector('[name="message"]');

      [name, email, service, message].forEach(function (f) {
        if (f) clearFieldError(f);
      });

      if (name && !name.value.trim()) {
        showFieldError(name, "Please enter your name.");
        ok = false;
      }
      if (email) {
        if (!email.value.trim()) {
          showFieldError(email, "Please enter your email.");
          ok = false;
        } else if (!validateEmail(email.value.trim())) {
          showFieldError(email, "Please enter a valid email address.");
          ok = false;
        }
      }
      if (service && !service.value) {
        showFieldError(service, "Please choose a service topic.");
        ok = false;
      }
      if (message && !message.value.trim()) {
        showFieldError(message, "Please enter your message.");
        ok = false;
      }

      if (ok) {
        contactForm.reset();
        let successMsg = document.getElementById("contact-success-msg");
        if (!successMsg) {
          successMsg = document.createElement("div");
          successMsg.id = "contact-success-msg";
          successMsg.style.cssText = "margin-top:16px;padding:14px 20px;background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:6px;font-size:15px;text-align:center;";
          contactForm.parentElement.insertBefore(successMsg, contactForm.nextSibling);
        }
        successMsg.textContent = "Thank you! Your message has been sent successfully. Redirecting you shortly\u2026";
        successMsg.style.display = "block";
        setTimeout(function () {
          window.location.href = "404.html";
        }, 3000);
      }
    });

   
    var serviceSelect = contactForm.querySelector("#contact-service");
    if (serviceSelect) {
      serviceSelect.addEventListener("focus", function () {
        serviceSelect.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }
  }

 
const homeSubscribeForm = document.getElementById("home-subscribe-form");

if (homeSubscribeForm) {
  homeSubscribeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = homeSubscribeForm.querySelector('[name="email"]');
    const feedback = document.getElementById("home-subscribe-feedback");

    if (feedback) {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.classList.remove("is-success");
    }

    if (!emailInput) return;

    emailInput.classList.remove("is-invalid");
    const v = emailInput.value.trim();

    if (!v) {
      emailInput.classList.add("is-invalid");
      if (feedback) {
        feedback.textContent = "Please enter your email.";
        feedback.hidden = false;
      }
      return;
    }

    if (!validateEmail(v)) {
      emailInput.classList.add("is-invalid");
      if (feedback) {
        feedback.textContent = "Please enter a valid email address.";
        feedback.hidden = false;
      }
      return;
    }

    homeSubscribeForm.reset();
    window.location.href = "404.html";
  });
}

  
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let ok = true;
      const fullName = registerForm.querySelector('[name="fullName"]');
      const email = registerForm.querySelector('[name="email"]');
      const password = registerForm.querySelector('[name="password"]');
      const confirm = registerForm.querySelector('[name="confirmPassword"]');

      [fullName, email, password, confirm].forEach(function (f) {
        if (f) clearFieldError(f);
      });

      if (fullName && !fullName.value.trim()) {
        showFieldError(fullName, "Name is required.");
        ok = false;
      }
      if (email) {
        if (!email.value.trim()) {
          showFieldError(email, "Email is required.");
          ok = false;
        } else if (!validateEmail(email.value.trim())) {
          showFieldError(email, "Invalid email.");
          ok = false;
        }
      }
      if (password) {
        if (password.value.length < 8) {
          showFieldError(password, "Password must be at least 8 characters.");
          ok = false;
        }
      }
      if (password && confirm && password.value !== confirm.value) {
        showFieldError(confirm, "Passwords do not match.");
        ok = false;
      }

      if (ok) {
        registerForm.reset();
        let successMsg = document.getElementById("register-success-msg");
        if (!successMsg) {
          successMsg = document.createElement("div");
          successMsg.id = "register-success-msg";
          successMsg.style.cssText = "margin-top:16px;padding:14px 20px;background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:6px;font-size:15px;text-align:center;";
          registerForm.parentElement.insertBefore(successMsg, registerForm.nextSibling);
        }
        successMsg.textContent = "Registration successful! Welcome aboard. Redirecting you shortly\u2026";
        successMsg.style.display = "block";
        setTimeout(function () {
          window.location.href = "404.html";
        }, 3000);
      }
    });
  }

  
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = loginForm.querySelector('[name="email"]');
      const password = loginForm.querySelector('[name="password"]');
      const role = loginForm.querySelector('input[name="role"]:checked');

      [email, password].forEach(function (f) {
        if (f) clearFieldError(f);
      });

      let ok = true;
      if (email) {
        if (!email.value.trim()) {
          showFieldError(email, "Email is required.");
          ok = false;
        } else if (!validateEmail(email.value.trim())) {
          showFieldError(email, "Invalid email.");
          ok = false;
        }
      }
      if (password) {
        if (!password.value) {
          showFieldError(password, "Password is required.");
          ok = false;
        } else if (password.value.length < 8) {
          showFieldError(password, "Password must be at least 8 characters.");
          ok = false;
        }
      }

      if (!ok) return;

      let successMsg = document.getElementById("login-success-msg");
      if (!successMsg) {
        successMsg = document.createElement("div");
        successMsg.id = "login-success-msg";
        successMsg.style.cssText = "margin-top:16px;padding:14px 20px;background:#d4edda;color:#155724;border:1px solid #c3e6cb;border-radius:6px;font-size:15px;text-align:center;";
        loginForm.parentElement.insertBefore(successMsg, loginForm.nextSibling);
      }
      successMsg.textContent = "Login successful! Redirecting you to your dashboard\u2026";
      successMsg.style.display = "block";

      const r = role ? role.value : "customer";
      setTimeout(function () {
        if (r === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "customer-dashboard.html";
        }
      }, 3000);
    });
  }

  
  document.querySelectorAll("video[data-autoplay-on-scroll]").forEach(function (video) {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            video.play().catch(function () {});
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.15, 0.3, 0.5] }
    );
    obs.observe(video);
  });


  (function setFooterYear() {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("#year").forEach(function (el) {
      el.textContent = year;
    });
  })();
})();

// DisasterResponse HQ — Custom enhancements
// Always ensure logo is visible on dark backgrounds
(function() {
  var logoImgs = document.querySelectorAll('.logo__img');
  logoImgs.forEach(function(img) {
    img.style.filter = 'brightness(0) invert(1)';
  });
  
  // Footer logo - keep white too
  var footerLogos = document.querySelectorAll('.site-footer .logo__img, .dashboard-sidebar .logo__img');
  footerLogos.forEach(function(img) {
    img.style.filter = 'brightness(0) invert(1)';
  });
})();

// Animate hero stats with counter on scroll
(function() {
  var counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  
  var observed = new Set();
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting || observed.has(e.target)) return;
      observed.add(e.target);
      var target = parseInt(e.target.getAttribute('data-counter'), 10);
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        // Format large numbers
        if (target >= 1000000) {
          e.target.textContent = (current / 1000000).toFixed(1) + 'M';
        } else if (target >= 1000) {
          e.target.textContent = current.toLocaleString();
        } else {
          e.target.textContent = current;
        }
        if (progress < 1) requestAnimationFrame(step);
        else {
          if (target >= 1000000) e.target.textContent = (target / 1000000).toFixed(1) + 'M';
          else if (target >= 1000) e.target.textContent = target.toLocaleString();
          else e.target.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.3 });
  
  counters.forEach(function(c) { io.observe(c); });
})();
