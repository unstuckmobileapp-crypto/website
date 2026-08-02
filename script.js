// ── Scroll-triggered animations with staggered delays ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu toggle ──
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
mobileToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const icon = mobileToggle.querySelector('.material-icons-round');
  icon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileToggle.querySelector('.material-icons-round').textContent = 'menu';
  });
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Animated number counters ──
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (!target) return;
      const duration = 1500;
      const start = performance.now();
      const suffix = target === 45 ? '+' : target === 247 ? '' : '';

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (target === 247) {
          el.textContent = '24/7';
        } else {
          el.textContent = current + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          if (target === 247) {
            el.textContent = '24/7';
          } else {
            el.textContent = target + suffix;
          }
        }
      }

      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── App gallery carousel: arrows + drag-to-swipe + snap ──
const galleryScroll = document.getElementById('galleryScroll');
if (galleryScroll) {
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const step = () => {
    const item = galleryScroll.querySelector('.gallery-item');
    return item ? (item.offsetWidth + 28) * 2 : 540;
  };
  const updateNav = () => {
    const max = galleryScroll.scrollWidth - galleryScroll.clientWidth;
    prevBtn.toggleAttribute('disabled', galleryScroll.scrollLeft <= 4);
    nextBtn.toggleAttribute('disabled', galleryScroll.scrollLeft >= max - 4);
  };
  prevBtn.addEventListener('click', () => galleryScroll.scrollBy({ left: -step(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => galleryScroll.scrollBy({ left: step(), behavior: 'smooth' }));
  galleryScroll.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  // Drag / swipe with the mouse (touch scrolling already works natively)
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragging = false;
  let moved = false;
  galleryScroll.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    dragging = true;
    moved = false;
    dragStartX = e.clientX;
    dragStartScroll = galleryScroll.scrollLeft;
    galleryScroll.classList.add('dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 4) moved = true;
    galleryScroll.scrollLeft = dragStartScroll - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    galleryScroll.classList.remove('dragging');
    if (moved) {
      // settle on the nearest snap point
      const item = galleryScroll.querySelector('.gallery-item');
      const unit = item ? item.offsetWidth + 28 : 268;
      const target = Math.round(galleryScroll.scrollLeft / unit) * unit;
      galleryScroll.scrollTo({ left: target, behavior: 'smooth' });
    }
  });
  // Also allow horizontal scrolling with a vertical mouse wheel while hovering
  galleryScroll.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      galleryScroll.scrollBy({ left: e.deltaY, behavior: 'auto' });
    }
  }, { passive: false });
}

// ── Parallax effect on hero phone ──
const heroPhone = document.querySelector('.hero-phone-wrapper');
if (heroPhone) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.15;
    if (scrollY < 800) {
      heroPhone.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });
}
