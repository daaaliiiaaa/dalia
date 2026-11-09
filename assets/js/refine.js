/* Gray Matter AI: refinements (services, projects, process scrollers). No libraries.
   Horizontal scrolling is always native (touch, trackpad, keyboard); arrows and
   mouse-drag are additions. Vertical page scroll is never intercepted. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const $ = (s, r = document) => r.querySelector(s);
  const behavior = () => (reduce.matches ? "auto" : "smooth");

  /* ---------- shared: edge state, drag-to-scroll (mouse only) ---------- */
  function wireScroller(scroller, { frame, prev, next, onUpdate }) {
    function update() {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const x = scroller.scrollLeft;
      const rtl = getComputedStyle(scroller).direction === "rtl";
      const pos = rtl ? Math.abs(x) : x;
      const atStart = pos <= 8;
      const atEnd = pos >= max - 8;
      if (frame) {
        frame.classList.toggle("can-prev", !atStart);
        frame.classList.toggle("can-next", !atEnd && max > 4);
      }
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd || max <= 4;
      if (onUpdate) onUpdate({ pos, max, atStart, atEnd });
    }
    let raf = 0;
    scroller.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(scroller);
    const by = (dir) => {
      const rtl = getComputedStyle(scroller).direction === "rtl" ? -1 : 1;
      // one card per step when the track holds cards, otherwise most of a viewport
      const first = scroller.querySelector(".svc-card, .jr-step");
      const step = first ? first.offsetWidth + 22 : Math.max(scroller.clientWidth * 0.8, 240);
      scroller.scrollBy({ left: dir * rtl * step, behavior: behavior() });
    };
    if (prev) prev.addEventListener("click", () => by(-1));
    if (next) next.addEventListener("click", () => by(1));

    // mouse drag (touch and pen already scroll natively)
    let down = false, startX = 0, startLeft = 0, moved = false;
    scroller.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = scroller.scrollLeft;
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) { moved = true; scroller.classList.add("is-dragging"); }
      if (moved) scroller.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      if (moved) {
        scroller.classList.remove("is-dragging");
        const stop = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
        scroller.addEventListener("click", stop, { capture: true, once: true });
        setTimeout(() => scroller.removeEventListener("click", stop, true), 0);
      }
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    update();
    return { update, by };
  }

  /* ---------- Services ---------- */
  (() => {
    const scroller = $("#svcScroller");
    if (!scroller) return;
    const fill = $("#svcFill");
    wireScroller(scroller, {
      frame: scroller.closest(".svc-frame"),
      prev: $("#svcPrev"),
      next: $("#svcNext"),
      onUpdate: ({ pos, max }) => {
        if (fill) {
          const visible = scroller.clientWidth / scroller.scrollWidth;
          fill.style.transform = `scaleX(${max > 4 ? visible + (1 - visible) * (pos / max) : 1})`;
        }
      },
    });
  })();

  /* ---------- Projects ---------- */
  (() => {
    const root = $("#pj");
    if (!root) return;
    const DATA = [
      { key: "innovationAI", cat: "AI Education", title: "Innovation AI", media: "assets/videos/Innovation AI.mp4",
        desc: "An AI-powered CMA learning platform combining structured course content, progress tracking, assessments, and an intelligent tutor experience.",
        focus: "AI education, course structure, student progress, payment integration, and personalized learning." },
      { key: "odooAI", cat: "AI Education", title: "Innovation Odoo AI", media: "assets/videos/Innovation Odoo AI.mp4",
        desc: "An AI education platform that helps users master Odoo ERP through structured lessons, study plans, assessments, and AI guidance.",
        focus: "ERP training, AI tutoring, structured lessons, assessments, and personalized learning flows." },
      { key: "recruitment", cat: "Recruitment & HR", title: "Innovation Recruitment Services", media: "assets/videos/Innovation Recruitment Services.mp4",
        desc: "A recruitment and HR platform focused on connecting employers with vetted candidates through a structured hiring experience.",
        focus: "Candidate database, recruitment workflows, application forms, HR tools, and employer dashboards." },
      { key: "meshoo", cat: "Rental Platform", title: "Meshoo Pictures", media: "assets/videos/Meshoo Pictures.mp4",
        desc: "A rental platform where customers browse equipment, choose rental dates, place orders, and track delivery while admins manage operations.",
        focus: "Rental availability, barcode dispatch and return, order tracking, and admin ERP control." },
      { key: "innovationERP", cat: "ERP & Finance", title: "Innovation ERP", media: "assets/videos/Innovation ERP.mp4",
        desc: "An AI-first ERP and financial operating system for SMBs with accounting, invoicing, inventory, document automation, and compliance flows.",
        focus: "AI document extraction, OCR pipeline, accounting, invoicing, inventory, and business automation." },
      { key: "kawader", cat: "AI Recruitment", title: "Kawader JO", media: "assets/videos/Kawader JO.mp4",
        desc: "An AI-powered recruitment ecosystem for the MENA region, designed to transform candidate data into a verified and searchable hiring platform.",
        focus: "AI CV search, recruiter dashboard, candidate verification, WhatsApp flows, and MENA recruitment." },
      { key: "candera", cat: "E-commerce", title: "Candera Cake", media: "assets/videos/Candera Cake.mp4",
        desc: "A full online cake shop platform with product browsing, cart, custom cake requests, admin controls, and a modern ordering experience.",
        focus: "E-commerce, bakery products, custom orders, product management, cart flow, and admin dashboard." },
      { key: "pipo3", cat: "Robotics R&D", title: "PIPO3", planned: true, media: "assets/videos/PIP03.mp4",
        desc: "A planned humanoid robotics project focused on building a 32DOF AI-powered robot with advanced motion and AI control.",
        focus: "Humanoid design, robotics, AI control, movement systems, and future R&D." },
      { key: "cookie", cat: "AI Agents", title: "Cookie", planned: true, media: "assets/videos/Cookie.mp4",
        desc: "A planned AI secretary system using multiple AI agents to help businesses manage operations automatically.",
        focus: "AI secretary concept, multi-agent system, scheduling, automation, and business workflows." },
      { key: "goatCheese", cat: "AI Development", title: "Goat Cheese", planned: true, media: "assets/videos/Goat Cheese.mp4",
        desc: "A planned autonomous AI web development agent that turns a user idea into a website or application through a guided build pipeline.",
        focus: "Idea-to-product pipeline, autonomous coding agent, deployment automation, and AI web development." },
      { key: "nashmi", cat: "AI Chatbot", title: "Nashmi", planned: true, media: "assets/videos/Nashmi.mp4",
        desc: "A planned Jordanian AI chatbot made for Jordanians, built to represent local culture, Arabic language, and Jordan-focused knowledge.",
        focus: "Jordanian Arabic support, localized AI assistant, local knowledge, and cultural UX." },
    ];
    const pad = (n) => String(n).padStart(2, "0");
    const video = $("#pjVideo");
    const fallback = $("#pjFallback");
    const strip = $("#pjStrip");
    const el = { cat: $("#pjCat"), status: $("#pjStatus"), title: $("#pjTitle"), desc: $("#pjDesc"), focus: $("#pjFocus"), counter: $("#pjCounter") };
    const prevBtn = $("#pjPrev");
    const nextBtn = $("#pjNext");
    let index = 0;
    let inView = false;

    strip.innerHTML = DATA.map((p, i) => `
      <button type="button" class="pj-thumb" role="tab" id="pjTab${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
        <span class="pj-thumb-media"><video muted playsinline preload="none" tabindex="-1" aria-hidden="true" data-src="${encodeURI(p.media)}"></video><span class="pj-thumb-n" aria-hidden="true">${pad(i + 1)}</span></span>
        <span class="pj-thumb-name">${p.title}</span>
        <span class="pj-thumb-cat">${p.cat}</span>
      </button>`).join("");
    const thumbs = Array.from(strip.querySelectorAll(".pj-thumb"));

    // thumbnail frames load only when the strip approaches the viewport
    function loadThumbs() {
      thumbs.forEach((t) => {
        const v = t.querySelector("video");
        if (v && !v.getAttribute("src")) { v.preload = "metadata"; v.src = `${v.dataset.src}#t=0.8`; }
      });
    }
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { loadThumbs(); io.disconnect(); }
      }, { rootMargin: "400px 0px" });
      io.observe(strip);
    } else loadThumbs();

    const stripScroller = wireScroller(strip, { frame: strip.parentElement });

    function paint(i) {
      const p = DATA[i];
      el.cat.textContent = p.cat;
      el.status.hidden = !p.planned;
      el.title.textContent = p.title;
      el.desc.textContent = p.desc;
      el.focus.textContent = p.focus;
      el.counter.textContent = `${pad(i + 1)} / ${pad(DATA.length)}`;
      fallback.hidden = true;
      video.src = encodeURI(p.media);
      video.load();
      if (inView || !("IntersectionObserver" in window)) video.play().catch(() => {});
      thumbs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === DATA.length - 1;
    }
    function select(i, { focus = false } = {}) {
      i = Math.max(0, Math.min(DATA.length - 1, i));
      if (i === index && video.getAttribute("src")) return;
      index = i;
      const t = thumbs[i];
      // keep the active thumbnail in view without moving the page vertically
      const left = t.offsetLeft - (strip.clientWidth - t.offsetWidth) / 2;
      strip.scrollTo({ left, behavior: behavior() });
      if (focus) t.focus({ preventScroll: true });
      if (reduce.matches) { paint(i); return; }
      root.classList.add("is-swapping");
      setTimeout(() => { paint(i); requestAnimationFrame(() => root.classList.remove("is-swapping")); }, 200);
    }
    thumbs.forEach((t, i) => t.addEventListener("click", () => select(i)));
    strip.addEventListener("keydown", (e) => {
      const map = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
      if (!(e.key in map)) return;
      e.preventDefault();
      const d = map[e.key];
      select(Number.isFinite(d) ? index + d : d < 0 ? 0 : DATA.length - 1, { focus: true });
    });
    prevBtn.addEventListener("click", () => select(index - 1));
    nextBtn.addEventListener("click", () => select(index + 1));
    video.addEventListener("error", () => { if (video.getAttribute("src")) fallback.hidden = false; });

    // play only while the showcase is on screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        inView = entries.some((e) => e.isIntersecting);
        if (inView) video.play().catch(() => {}); else video.pause();
      }, { threshold: 0.25 }).observe($(".pj-media"));
    }
    paint(0);
    stripScroller.update();
  })();

  /* ---------- Process journey ---------- */
  (() => {
    const scroller = $("#jrScroller");
    const track = $("#jrTrack");
    if (!scroller || !track) return;
    const steps = Array.from(track.children);
    function mark({ pos } = {}) {
      const edge = (pos ?? scroller.scrollLeft) + scroller.clientWidth - 24;
      let lastOn = null;
      steps.forEach((s) => {
        const on = s.offsetLeft + 7 <= edge;
        s.classList.toggle("is-on", on);
        if (on) lastOn = s;
      });
      track.style.setProperty("--jr-fill", lastOn ? `${lastOn.offsetLeft + 7}px` : "0px");
    }
    wireScroller(scroller, { frame: scroller.closest(".jr-frame"), prev: $("#jrPrev"), next: $("#jrNext"), onUpdate: mark });
    mark();
  })();

  /* ---------- Header: scrolled state + current section ---------- */
  (() => {
    const header = $(".site-header");
    if (header) {
      let tick = false;
      const on = () => { tick = false; header.classList.toggle("is-scrolled", window.scrollY > 12); };
      window.addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(on); } }, { passive: true });
      on();
    }
    const links = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]:not(.nav-cta)'));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map();
    links.forEach((a) => { const s = document.getElementById(a.getAttribute("href").slice(1)); if (s) map.set(s, a); });
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      let best = null, d = Infinity;
      seen.forEach((s) => { const k = Math.abs(s.getBoundingClientRect().top - 100); if (k < d) { d = k; best = s; } });
      links.forEach((a) => {
        const on = map.get(best) === a;
        a.classList.toggle("is-current", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -50% 0px" });
    map.forEach((_, s) => io.observe(s));
  })();
})();
