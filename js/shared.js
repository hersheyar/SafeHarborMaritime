/* Safe Harbor Maritime — shared.js */

// ---- NAV scroll state ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav && (window.scrollY > 20 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'));
}, { passive: true });

// reset body scroll state on page load
document.body.style.top = '';
document.body.classList.remove('menu-open');

/// ---- Mobile hamburger ----
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
  setTimeout(() => {
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }, 10);
}

let scrollY = 0;

hamburger && hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  }
});

mobileMenu && mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
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
// ---- Slideshow ----
const slideshow = document.querySelector('.slideshow');
if (slideshow) {
  const slides = slideshow.querySelectorAll('.slide');
  const dots = slideshow.querySelectorAll('.slideshow__dot');
  let current = 0;

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

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const end = parseInt(el.dataset.end, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * end).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
if (!isIOS) {
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }
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