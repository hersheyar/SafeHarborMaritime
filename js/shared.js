/* Safe Harbor Maritime — shared.js */

// ---- NAV scroll state ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav && (window.scrollY > 20 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'));
}, { passive: true });

/// ---- Mobile hamburger ----
const hamburger = document.querySelector('.nav__hamburger');
const mobileMenu = document.querySelector('.nav__mobile');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
}

hamburger && hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    closeMobileMenu();
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
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const isPlus = el.textContent.includes('+');
  const isComma = target >= 1000;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    let display = isComma ? current.toLocaleString() : current.toString();
    if (isPlus) display += '+';
    el.textContent = display;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats-section');
if (statsSection && window.innerWidth >= 1024) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(el => {
          const raw = el.textContent.replace(/[^0-9]/g, '');
          const target = parseInt(raw, 10);
          if (!isNaN(target)) animateCounter(el, target);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
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