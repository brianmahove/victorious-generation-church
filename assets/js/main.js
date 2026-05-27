/* ============================================================
   VGIC Main JS
   ============================================================ */

// ---- Loading screen ----
const loader = document.querySelector('.loader');
if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 400);
  });
}

// ---- Page transition ----
const overlay = document.querySelector('.page-transition');
document.querySelectorAll('a[href]').forEach(a => {
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.includes('_blank') || a.target === '_blank') return;
  a.addEventListener('click', e => {
    e.preventDefault();
    if (overlay) {
      overlay.classList.add('out');
      setTimeout(() => { window.location.href = href; }, 400);
    } else {
      window.location.href = href;
    }
  });
});

// ---- Announcement banner ----
const announcement = document.querySelector('.announcement');
const DISMISS_KEY = 'vgic_announcement_dismissed_v1';
if (announcement) {
  const close = announcement.querySelector('.announcement__close');
  const dismissed = sessionStorage.getItem(DISMISS_KEY);
  if (!dismissed) {
    document.body.classList.add('has-announcement');
  } else {
    announcement.classList.add('hidden');
  }
  if (close) {
    close.addEventListener('click', () => {
      announcement.classList.add('hidden');
      document.body.classList.remove('has-announcement');
      sessionStorage.setItem(DISMISS_KEY, '1');
    });
  }
}

// ---- Nav scroll effect ----
const nav = document.querySelector('.nav');
function updateNav() {
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
    nav.classList.remove('transparent');
  } else {
    nav.classList.add('transparent');
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---- Hero BG parallax + loaded class ----
const hero = document.querySelector('.hero');
if (hero) {
  setTimeout(() => hero.classList.add('loaded'), 100);
  window.addEventListener('scroll', () => {
    const bg = hero.querySelector('.hero__bg');
    if (bg) bg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
}

// ---- Hamburger menu ----
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (nav && !nav.contains(e.target)) mobileNav.classList.remove('open');
  });
}

// ---- Scroll-reveal (IntersectionObserver) ----
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => io.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('in-view'));
}

// ---- Back-to-top + WhatsApp FABs ----
const fabTop = document.querySelector('.fab-top');
if (fabTop) {
  window.addEventListener('scroll', () => {
    fabTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- Gallery lightbox ----
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbClose = lightbox.querySelector('.lightbox__close');
  const lbPrev = lightbox.querySelector('.lightbox__nav--prev');
  const lbNext = lightbox.querySelector('.lightbox__nav--next');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let current = 0;

  function openLightbox(index) {
    current = index;
    const item = items[index];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-item__caption');
    if (img) lbImg.src = img.src;
    if (lbCaption) lbCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  if (lbPrev) lbPrev.addEventListener('click', () => openLightbox((current - 1 + items.length) % items.length));
  if (lbNext) lbNext.addEventListener('click', () => openLightbox((current + 1) % items.length));
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox((current - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') openLightbox((current + 1) % items.length);
  });
}

// ---- Sermon / gallery filter tabs ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.sermons-filter, .gallery-filter');
    if (group) group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    if (!filter || filter === 'all') {
      document.querySelectorAll('[data-category]').forEach(el => el.style.display = '');
    } else {
      document.querySelectorAll('[data-category]').forEach(el => {
        el.style.display = el.dataset.category === filter ? '' : 'none';
      });
    }
  });
});

// ---- Form submit placeholder ----
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = 'Sent! ✓';
    btn.disabled = true;
    btn.style.background = '#22c55e';
    setTimeout(() => { btn.textContent = original; btn.disabled = false; btn.style.background = ''; }, 3000);
  });
});

// ---- Active nav link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});
