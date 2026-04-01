/* Safe Harbor Maritime — shared.js */

// ---- NAV scroll state ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav && (window.scrollY > 20 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'));
}, { passive: true });

// ---- Mobile hamburger ----
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');
hamburger && hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu && mobileMenu.classList.toggle('open');
});

// ---- Fade-in on scroll ----
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));
}

// ---- Active nav link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__dropdown a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ---- Animated counters (TrustSection) ----


// ---- Slideshow ----
const slideshow = document.querySelector('.slideshow');
if (slideshow) {
  const slides = slideshow.querySelectorAll('.slide');
  const dots = slideshow.querySelectorAll('.slideshow__dot');
  let current = 0;
  // ---- Animated counters (TrustSection) ----
  document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll("[data-counter]");

    if (!counters.length) return;

    function formatCounterValue(el) {
      const end = parseInt(el.dataset.end || "0", 10);
      const suffix = el.dataset.suffix || "";
      el.textContent = end.toLocaleString() + suffix;
    }

    function animateCounter(el) {
      if (el.dataset.animated === "true") return;
      el.dataset.animated = "true";

      const end = parseInt(el.dataset.end || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 2000;
      let start = null;

      const step = (ts) => {
        if (!start) start = ts;

        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);

        el.textContent = Math.floor(ease * end).toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          formatCounterValue(el);
        }
      };

      requestAnimationFrame(step);
    }

    const isSmallScreen = window.innerWidth <= 1024;

    if (isSmallScreen) {
      counters.forEach(formatCounterValue);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(formatCounterValue);
      return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  });
  function showSlide(idx) {
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  slideshow.querySelector('.slideshow__prev') && slideshow.querySelector('.slideshow__prev').addEventListener('click', () => showSlide(current - 1));
  slideshow.querySelector('.slideshow__next') && slideshow.querySelector('.slideshow__next').addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
}

// ---- News category filter ----
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card[data-category]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    newsCards.forEach(card => {
      card.parentElement.style.display = (cat === 'All' || card.dataset.category === cat) ? '' : 'none';
    });
  });
});