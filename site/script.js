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
