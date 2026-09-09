/**
 * Continuum — front-end behaviour.
 *
 * Three independent, self-contained features:
 *   1. revealOnScroll        — fades single elements in as they enter view.
 *   2. staggerChildrenOnScroll — fades a container's children in sequence.
 *   3. parallaxHeroPanels    — nudges the hero panels while the hero is in view.
 *
 * Each feature is initialised in isolation and guards against a missing DOM,
 * so a page that lacks a given element simply skips that feature.
 */

'use strict';

const CONFIG = Object.freeze({
  reveal: {
    threshold: 0.1,
    rootMargin: '0px 0px -160px 0px',
    visibleClass: 'is-visible',
  },
  stagger: {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
    stepMs: 75,
  },
  parallax: {
    // Base rotations mirror the CSS transforms so JS can add translation
    // without discarding the resting angle of each panel.
    baseRotationsDeg: [-18, -3, 12],
    // Vertical drift rate per panel: the rear panel travels most, the front
    // panel drifts slightly against the scroll for depth.
    verticalRates: [0.18, 0.09, -0.07],
    horizontalRatio: 0.3,
  },
});

/**
 * Reveal each `.reveal` element once, the first time it scrolls into view.
 */
function revealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(CONFIG.reveal.visibleClass);
      self.unobserve(entry.target);
    });
  }, { threshold: CONFIG.reveal.threshold, rootMargin: CONFIG.reveal.rootMargin });

  elements.forEach((element) => observer.observe(element));
}

/**
 * Reveal the children of each `.reveal-stagger` container in sequence,
 * producing a cascade as the group scrolls into view.
 */
function staggerChildrenOnScroll() {
  const groups = document.querySelectorAll('.reveal-stagger');
  if (groups.length === 0) return;

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      revealChildrenInSequence(entry.target);
      self.unobserve(entry.target);
    });
  }, { threshold: CONFIG.stagger.threshold, rootMargin: CONFIG.stagger.rootMargin });

  groups.forEach((group) => observer.observe(group));
}

function revealChildrenInSequence(container) {
  Array.from(container.children).forEach((child, index) => {
    const delayMs = index * CONFIG.stagger.stepMs;
    window.setTimeout(() => child.classList.add(CONFIG.reveal.visibleClass), delayMs);
  });
}

/**
 * Apply a subtle parallax to the hero's geometric panels while the hero
 * remains on screen, then hold their position once scrolled past.
 */
function parallaxHeroPanels() {
  const hero = document.querySelector('.hero');
  const geo = document.querySelector('.geo--hero');
  if (!hero || !geo) return;

  const panels = geo.querySelectorAll('.geo__panel');
  if (panels.length === 0) return;

  const applyParallax = () => {
    const scrolled = clampScrollToHero(hero);
    panels.forEach((panel, index) => panel.style.transform = panelTransform(index, scrolled));
  };

  window.addEventListener('scroll', applyParallax, { passive: true });
  applyParallax();
}

function clampScrollToHero(hero) {
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  return Math.min(window.scrollY, heroBottom);
}

function panelTransform(index, scrolled) {
  const { baseRotationsDeg, verticalRates, horizontalRatio } = CONFIG.parallax;
  const offsetY = scrolled * verticalRates[index];
  const offsetX = offsetY * horizontalRatio;
  return `rotate(${baseRotationsDeg[index]}deg) translate(${offsetX}px, ${offsetY}px)`;
}

function initSite() {
  revealOnScroll();
  staggerChildrenOnScroll();
  parallaxHeroPanels();
}

document.addEventListener('DOMContentLoaded', initSite);
