/* =====================================================
   BUSco v2 — script.js
   Password gate · Lenis smooth scroll · Pagination
   GSAP ScrollTrigger fade-ins
   ===================================================== */

/* ── 1. PASSWORD GATE ── */
(function () {
  var lock  = document.getElementById('lock-screen');
  var form  = document.getElementById('lock-form');
  var input = document.getElementById('lock-input');
  var error = document.getElementById('lock-error');
  var PWD   = 'getondabus';

  if (sessionStorage.getItem('busco-auth') === '1') {
    lock.classList.add('is-hidden');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value === PWD) {
      sessionStorage.setItem('busco-auth', '1');
      lock.classList.add('is-hidden');
      input.value = '';
      error.textContent = '';
      initSite();
    } else {
      error.textContent = 'Incorrect password. Try again.';
      input.classList.add('is-error');
      input.select();
      setTimeout(function () {
        input.classList.remove('is-error');
      }, 500);
    }
  });

  // If already authed, boot immediately
  if (sessionStorage.getItem('busco-auth') === '1') {
    initSite();
  }
})();

/* ── 2. SITE INIT (called after auth) ── */
function initSite() {
  initLenis();
  initPagination();
  initFadeIns();
}

// If auth was already set on page load (lock screen hidden inline),
// run init after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  if (sessionStorage.getItem('busco-auth') === '1') {
    initSite();
  }
});

/* ── 3. LENIS SMOOTH SCROLL ── */
function initLenis() {
  if (typeof Lenis === 'undefined') return;

  var lenis = new Lenis({
    duration: 1.1,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hook Lenis into GSAP ScrollTrigger if both are loaded
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ── 4. PAGINATION ── */
function initPagination() {
  var paginationEl  = document.getElementById('pagination');
  var currentEl     = document.getElementById('pagination-current');
  if (!paginationEl || !currentEl) return;

  var sections = Array.from(document.querySelectorAll('.section[data-index]'));
  if (!sections.length) return;

  // Show pagination once first section enters view
  var shownOnce = false;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = parseInt(entry.target.getAttribute('data-index'), 10);
          var padded = String(idx).padStart(3, '0');
          currentEl.textContent = padded;

          if (!shownOnce) {
            paginationEl.classList.add('is-visible');
            shownOnce = true;
          }
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  sections.forEach(function (s) { observer.observe(s); });
}

/* ── 5. SCROLL FADE-INS ── */
function initFadeIns() {
  // Check reduced-motion preference
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Make everything visible immediately
    document.querySelectorAll('.js-fade').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  // Use GSAP ScrollTrigger if available, otherwise use IntersectionObserver
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    var fadeEls = document.querySelectorAll('.js-fade');
    fadeEls.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: function () {
          el.classList.add('is-visible');
        },
      });
    });
  } else {
    // Fallback: IntersectionObserver
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.js-fade').forEach(function (el) {
      observer.observe(el);
    });
  }
}
