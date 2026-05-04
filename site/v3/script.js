/* ============================================================
   BUSCO v3 — CYBERPUNK SCRIPT
   Bootstrap → Cursor → Pagination → Per-section animations
   ============================================================ */

(function () {
  'use strict';

  /* ── REDUCED MOTION CHECK ──────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── LENIS SMOOTH SCROLL ───────────────────────────────── */
  let lenis;
  if (!prefersReduced) {
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    function lenisRaf(time) {
      lenis.raf(time);
      requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── GSAP REGISTER ─────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── CURSOR FOLLOWER ───────────────────────────────────── */
  (function initCursor() {
    const dot = document.getElementById('cursor-dot');
    if (!dot) return;
    const isTouchDevice = window.matchMedia('(hover: none)').matches ||
                          window.innerWidth <= 640;
    if (isTouchDevice) return;

    let mouseX = -100, mouseY = -100;
    let dotX = -100, dotY = -100;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.classList.add('is-active');
    });

    document.addEventListener('mouseleave', () => {
      dot.classList.remove('is-active');
    });

    const hoverables = 'a, button, .mode-card, .principle-card, .node__card, .cta-pill, .hex-cell';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) {
        dot.classList.add('is-hovered');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) {
        dot.classList.remove('is-hovered');
      }
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;
      dot.style.left = dotX + 'px';
      dot.style.top  = dotY + 'px';
      raf = requestAnimationFrame(animateCursor);
    }
    animateCursor();
  })();

  /* ── PAGINATION HUD ────────────────────────────────────── */
  (function initPagination() {
    const currentEl = document.getElementById('pagination-current');
    if (!currentEl) return;

    const sections = document.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const num = entry.target.dataset.section;
          currentEl.textContent = num.padStart(2, '0');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  })();

  /* ── HERO TYPING EFFECT ────────────────────────────────── */
  (function initHeroTyping() {
    const typedEl  = document.querySelector('.hero__typed');
    const headline = document.getElementById('hero-headline');
    const subline  = document.querySelector('.hero__subline');
    if (!typedEl || !headline) return;

    const text = 'initializing back-up servicer...';

    if (prefersReduced) {
      typedEl.textContent = text;
      gsap.set([headline, subline], { opacity: 1 });
      return;
    }

    let i = 0;
    function type() {
      if (i < text.length) {
        typedEl.textContent = text.slice(0, i + 1);
        i++;
        setTimeout(type, 55 + Math.random() * 30);
      } else {
        // Remove blinking cursor after typing, reveal headline
        setTimeout(() => {
          const cursorEl = document.querySelector('.hero__cursor');
          if (cursorEl) cursorEl.style.display = 'none';
          gsap.to(headline, { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.1 });
          gsap.to(subline,  { opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.5 });
        }, 400);
      }
    }
    // Small delay before typing starts
    setTimeout(type, 800);
  })();

  /* ── VULNERABILITY MAP: NODE + LINE ANIMATIONS ─────────── */
  (function initVulnerabilityMap() {
    const nodes = document.querySelectorAll('.node');
    const lines = document.querySelectorAll('.node-line');
    if (!nodes.length) return;

    // Animate nodes in sequence on scroll
    ScrollTrigger.create({
      trigger: '#vulnerability',
      start: 'top 60%',
      onEnter: () => {
        nodes.forEach((node, i) => {
          gsap.to(node, {
            opacity: 1,
            duration: 0.5,
            delay: i * 0.2,
            onComplete: () => node.classList.add('is-visible'),
          });
        });

        // Light up lines in sequence
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.classList.add('is-lit');
          }, 400 + i * 180);
        });
      },
      once: true,
    });
  })();

  /* ── SOLUTION TERMINAL: SEQUENTIAL LINE REVEAL ─────────── */
  (function initTerminal() {
    const lines = document.querySelectorAll('#solution-terminal .terminal__line');
    if (!lines.length) return;

    if (prefersReduced) {
      lines.forEach(l => l.classList.add('is-visible'));
      return;
    }

    ScrollTrigger.create({
      trigger: '#solution-terminal',
      start: 'top 65%',
      onEnter: () => {
        lines.forEach((line, i) => {
          setTimeout(() => {
            line.classList.add('is-visible');
          }, i * 350);
        });
      },
      once: true,
    });
  })();

  /* ── STAT GLITCH EFFECT ────────────────────────────────── */
  (function initStatGlitch() {
    const digits = document.getElementById('stat-digits');
    if (!digits) return;

    digits.setAttribute('data-text', digits.textContent);

    if (prefersReduced) return;

    ScrollTrigger.create({
      trigger: '#stat',
      start: 'top 60%',
      onEnter: () => {
        // Run glitch 3 times
        let count = 0;
        function runGlitch() {
          digits.classList.add('is-glitching');
          setTimeout(() => {
            digits.classList.remove('is-glitching');
            count++;
            if (count < 3) {
              setTimeout(runGlitch, 300 + Math.random() * 200);
            }
          }, 500);
        }
        setTimeout(runGlitch, 200);
      },
      once: true,
    });
  })();

  /* ── DASHBOARD: PINNED SCROLL PHASES ───────────────────── */
  (function initDashboard() {
    const scroller = document.getElementById('how-scroller');
    const sticky   = document.getElementById('how-sticky');
    if (!scroller || !sticky) return;

    // On mobile, skip pinning
    if (window.innerWidth <= 640) return;

    const statusVal  = document.getElementById('dashboard-val');
    const statusDesc = document.getElementById('dashboard-desc');
    const phaseDots  = document.querySelectorAll('.dashboard__phase');
    const stepCards  = document.querySelectorAll('.dashboard__step');

    const phases = [
      {
        val: 'STANDBY',
        cls: 'status-standby',
        desc: 'Triggers, mandates, step-in rights defined. Data pipelines validated.',
        dot: 0,
      },
      {
        val: 'TRANSITION',
        cls: 'status-transition',
        desc: 'Pre-agreed triggers hit. Insolvency, covenant breach, PAR threshold.',
        dot: 1,
      },
      {
        val: 'ACTIVE',
        cls: 'status-active',
        desc: 'BUS assumes full control: data, payments, field, call centre.',
        dot: 2,
      },
      {
        val: 'REVERSION',
        cls: 'status-reversion',
        desc: 'Portfolio handed back, transferred, or wound down.',
        dot: 3,
      },
    ];

    let currentPhase = -1;

    function setPhase(idx) {
      if (idx === currentPhase) return;
      currentPhase = idx;
      const p = phases[idx];

      // Status text
      statusVal.className = 'dashboard__status-val ' + p.cls;
      statusVal.textContent = p.val;
      statusDesc.textContent = p.desc;

      // Phase dots
      phaseDots.forEach((dot, i) => {
        dot.textContent = i <= idx ? '●' : '○';
        dot.classList.toggle('is-active', i <= idx);
      });

      // Step cards
      stepCards.forEach((card, i) => {
        card.classList.toggle('is-active', i === idx);
      });
    }

    // Initialize
    setPhase(0);

    ScrollTrigger.create({
      trigger: scroller,
      start: 'top top',
      end: 'bottom bottom',
      pin: sticky,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const idx = Math.min(3, Math.floor(progress * 4));
        setPhase(idx);
      },
    });
  })();

  /* ── PRINCIPLE CARDS: TILT ON HOVER ───────────────────── */
  (function initPrincipleTilt() {
    const cards = document.querySelectorAll('.principle-card');
    if (!cards.length) return;
    if (window.innerWidth <= 640) return;
    if (prefersReduced) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

  /* ── HEX MESH: TOGGLE DETAIL TOOLTIP ──────────────────── */
  (function initHexMesh() {
    const hexButtons = document.querySelectorAll('.hex-cell');
    if (!hexButtons.length) return;

    hexButtons.forEach(btn => {
      const detailId = btn.getAttribute('aria-controls');
      const detail   = detailId ? document.getElementById(detailId) : null;

      function open() {
        btn.setAttribute('aria-expanded', 'true');
        if (detail) {
          detail.setAttribute('aria-hidden', 'false');
        }
      }

      function close() {
        btn.setAttribute('aria-expanded', 'false');
        if (detail) {
          detail.setAttribute('aria-hidden', 'true');
        }
      }

      // Desktop: hover
      const wrap = btn.closest('.hex-wrap');
      if (wrap) {
        wrap.addEventListener('mouseenter', open);
        wrap.addEventListener('mouseleave', close);
      }

      // Mobile / keyboard: click/toggle
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        // Close all others
        hexButtons.forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const otherId = other.getAttribute('aria-controls');
            if (otherId) {
              const otherDetail = document.getElementById(otherId);
              if (otherDetail) otherDetail.setAttribute('aria-hidden', 'true');
            }
          }
        });
        isOpen ? close() : open();
      });
    });
  })();

  /* ── CTA STEPS: STAGGER REVEAL ─────────────────────────── */
  (function initCtaSteps() {
    const steps = document.querySelectorAll('.cta-step');
    if (!steps.length) return;

    if (prefersReduced) {
      steps.forEach(s => gsap.set(s, { opacity: 1 }));
      return;
    }

    gsap.set(steps, { opacity: 0, x: -20 });

    ScrollTrigger.create({
      trigger: '#cta-steps',
      start: 'top 70%',
      onEnter: () => {
        gsap.to(steps, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power2.out',
        });
      },
      once: true,
    });
  })();

  /* ── SECTION FADE-IN ────────────────────────────────────── */
  (function initSectionFadeIns() {
    if (prefersReduced) return;

    const targets = [
      '.section__tag',
      '.section__headline',
      '.node-graph',
      '.terminal',
      '.stat__caption',
      '.modes-grid',
      '.frontier-badges',
      '.team-grid',
      '.backers-strip',
      '.cta__subline',
      '.cta-contacts',
    ];

    targets.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              once: true,
            },
          }
        );
      });
    });
  })();

  /* ── PRINCIPLES GRID: STAGGER ───────────────────────────── */
  (function initPrinciplesReveal() {
    const grid  = document.querySelector('.principles-grid');
    const cards = document.querySelectorAll('.principle-card');
    if (!grid || !cards.length) return;

    if (prefersReduced) return;

    gsap.set(cards, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 70%',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
        });
      },
      once: true,
    });
  })();

  /* ── TEAM CARDS: SLIDE IN ──────────────────────────────── */
  (function initTeamReveal() {
    const cards = document.querySelectorAll('.team-card');
    if (!cards.length) return;
    if (prefersReduced) return;

    gsap.set(cards, { opacity: 0, x: -30 });

    ScrollTrigger.create({
      trigger: '.team-grid',
      start: 'top 75%',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
        });
      },
      once: true,
    });
  })();

  /* ── LIVE TIMESTAMP ─────────────────────────────────────── */
  (function initTimestamp() {
    const tsEl = document.querySelector('.hud-bar__right .hud-label--dim');
    if (!tsEl) return;

    function updateTs() {
      const now  = new Date();
      const yyyy = now.getUTCFullYear();
      const mm   = String(now.getUTCMonth() + 1).padStart(2, '0');
      const dd   = String(now.getUTCDate()).padStart(2, '0');
      const hh   = String(now.getUTCHours()).padStart(2, '0');
      const min  = String(now.getUTCMinutes()).padStart(2, '0');
      const ss   = String(now.getUTCSeconds()).padStart(2, '0');
      tsEl.textContent = `[${yyyy}.${mm}.${dd} — ${hh}:${min}:${ss} UTC]`;
    }

    updateTs();
    setInterval(updateTs, 1000);
  })();

})();
