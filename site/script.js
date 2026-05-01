// === BOOTSTRAP ===
(function() {
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const nav = document.querySelector('.site-nav');

  ScrollTrigger.create({
    trigger: '#problem',
    start: 'top 80%',
    onEnter: () => nav.classList.add('is-visible'),
    onLeaveBack: () => nav.classList.remove('is-visible'),
  });
})();

// === SECTION 6: USE CASES ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.utils.toArray('.usecase').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1, y: 0, duration: 0.7, delay: i * 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });
  }
})();

// === SECTION 5: HOW THE BUS WORKS ===
(function() {
  const section = document.querySelector('#how');
  const pin = section.querySelector('.how__pin');
  const steps = gsap.utils.toArray('.how__step');
  const phases = gsap.utils.toArray('.how__phase');
  const progressFill = section.querySelector('.how__progress-fill');
  const totalSteps = steps.length;

  function activate(stepIdx) {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === stepIdx));
    const activePhase = Number(steps[stepIdx].dataset.phase);
    phases.forEach((p, i) => p.classList.toggle('is-active', i <= activePhase));
  }
  activate(0);

  if (window.matchMedia('(min-width: 641px)').matches) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: pin,
      pinSpacing: false,
      onUpdate: (self) => {
        const progress = self.progress;
        progressFill.style.width = `${progress * 100}%`;
        const idx = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
        activate(idx);
      },
    });
  } else {
    steps.forEach((s) => s.classList.add('is-active'));
  }
})();

// === SECTION 4: STAT ===
(function() {
  const num = document.querySelector('.stat__number');
  const target = Number(num.dataset.target);
  const counter = { val: 0 };
  ScrollTrigger.create({
    trigger: '#stat',
    start: 'top 60%',
    onEnter: () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        num.textContent = target;
        return;
      }
      gsap.to(counter, {
        val: target, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { num.textContent = Math.round(counter.val); },
      });
    },
    onLeaveBack: () => { counter.val = 0; num.textContent = '0'; },
  });
})();

// === SECTION 3: SOLUTION ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('.safety-net__layer', { scale: 0.6 });

    gsap.timeline({
      scrollTrigger: { trigger: '#solution', start: 'top 60%', toggleActions: 'play none none reverse' },
      defaults: { duration: 0.8, ease: 'power3.out' },
    })
      .to('.safety-net__layer--3', { opacity: 1, scale: 1 })
      .to('.safety-net__layer--2', { opacity: 1, scale: 1 }, '-=0.5')
      .to('.safety-net__layer--1', { opacity: 1, scale: 1 }, '-=0.5')
      .to('.safety-net__caption',  { opacity: 1 }, '-=0.3');

    gsap.to('.solution__benefits li', {
      opacity: 1, stagger: 0.12, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.solution__benefits', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  }
})();

// === SECTION 2: PROBLEM ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.utils.toArray('.problem__card').forEach((card) => {
      gsap.to(card, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });
  }
})();

// === SECTION 1: HERO ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.timeline({ defaults: { ease: 'power2.out' } })
      .to('.hero__logo',     { opacity: 1, duration: 0.8 }, 0.3)
      .to('.hero__eyebrow',  { opacity: 1, duration: 0.6 }, 0.7)
      .to('.hero__headline', { opacity: 1, duration: 1.0 }, 0.9);

    gsap.to('.hero__bg', {
      scale: 1.12,
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
})();

// === SECTION 7: PRINCIPLES ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to('.principle', {
      opacity: 1, y: 0, stagger: { each: 0.1, from: 'start' }, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.principles__grid', start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  }
})();

// === SECTION 8: CAPABILITIES ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to('.hex', {
      opacity: 1, scale: 1, stagger: { each: 0.07, from: 'start' }, duration: 0.5, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.hex-grid', start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  }

  gsap.utils.toArray('.hex').forEach((hex) => {
    const face = hex.querySelector('.hex__face');
    face.addEventListener('click', () => {
      const isOpen = hex.classList.toggle('is-open');
      face.setAttribute('aria-expanded', String(isOpen));
      gsap.utils.toArray('.hex').forEach((other) => {
        if (other !== hex) {
          other.classList.remove('is-open');
          other.querySelector('.hex__face').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
})();

// === SECTION 9: TEAM ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to('.team__card', {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: '.team__grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  }
})();

// === SECTION 10: CTA ===
(function() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from('.cta__steps li', {
      opacity: 0, y: 30, stagger: 0.12, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.cta__steps', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    gsap.from('.cta__email', {
      opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '.cta__contacts', start: 'top 85%', toggleActions: 'play none none reverse' },
    });
  }
})();
