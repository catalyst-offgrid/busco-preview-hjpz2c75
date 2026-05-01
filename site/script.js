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
