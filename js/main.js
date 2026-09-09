// ── Scroll-reveal ────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -160px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const staggerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        Array.from(entry.target.children).forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), i * 75);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.reveal-stagger').forEach((el) => staggerObserver.observe(el));


// ── Hero panel parallax ──────────────────────────────
const heroGeo = document.querySelector('.hero-geo');
if (heroGeo) {
  const panels = heroGeo.querySelectorAll('.geo-panel');
  const heroSection = document.querySelector('.hero');

  // Base rotations matching CSS
  const rotations = [-18, -3, 12];
  // Parallax rates: back panel moves most, front moves least (opposite dir)
  const rates = [0.18, 0.09, -0.07];

  const onScroll = () => {
    const scrollY = window.scrollY;
    // Stop parallax once hero is scrolled past
    const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 9999;
    const clamped = Math.min(scrollY, heroBottom);

    panels.forEach((panel, i) => {
      const dy = clamped * rates[i];
      const dx = clamped * (rates[i] * 0.3);
      panel.style.transform = `rotate(${rotations[i]}deg) translate(${dx}px, ${dy}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init
}
