/* Safe Harbor Maritime — shared.js */

// ---- NAV scroll state ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav && (window.scrollY > 20 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled'));
}, { passive: true });

// ---- Mobile hamburger ----
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".nav__hamburger");
  const mobileMenu = document.querySelector(".nav__mobile");

  if (!hamburger || !mobileMenu) return;

  function closeMobileMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    mobileMenu.querySelectorAll("details").forEach((details) => {
      details.removeAttribute("open");
    });
  }

  function openMobileMenu() {
    closeMobileMenu();
    hamburger.classList.add("open");
    mobileMenu.classList.add("open");
  }

  function navigateToHref(href) {
    if (!href) return;

    const url = new URL(href, window.location.href);
    const samePage =
        url.pathname === window.location.pathname &&
        url.origin === window.location.origin;

    if (url.hash && samePage) {
      const target = document.querySelector(url.hash);

      history.replaceState(null, "", window.location.pathname + window.location.search);

      requestAnimationFrame(() => {
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", url.pathname + url.hash);
        } else {
          window.location.href = url.pathname + url.hash;
        }
      });

      return;
    }

    window.location.href = url.pathname + url.search + url.hash;
  }

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("open");
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link) {
      event.preventDefault();
      const href = link.getAttribute("href");
      closeMobileMenu();
      navigateToHref(href);
      return;
    }

    const summary = event.target.closest("summary");
    if (summary) {
      event.preventDefault();

      const details = summary.parentElement;
      const firstLink = details?.querySelector("a");
      const href = firstLink?.getAttribute("href");

      closeMobileMenu();
      navigateToHref(href);
    }
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