/* ===================================
   Chinara Botanica — MARIS
   Main JS
   =================================== */

(function () {
  'use strict';

  // --- Scroll-based fade-in animations ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in, .fade-up').forEach((el) => observer.observe(el));

  // --- Header: hide on scroll down, show on scroll up, border on scroll ---
  const header = document.getElementById('header');
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const current = window.scrollY;

        if (current > 120 && current > lastScroll) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }

        if (current > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        lastScroll = current;
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Mobile menu toggle ---
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuBtn.classList.remove('active');
      });
    });
  }

  // --- Accordion ---
  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const content = item.querySelector('.accordion__content');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion__item').forEach((i) => {
        i.classList.remove('active');
        i.querySelector('.accordion__content').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- Quantity selector ---
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');

  if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
      const current = parseInt(qtyValue.textContent, 10);
      if (current > 1) qtyValue.textContent = current - 1;
    });

    qtyPlus.addEventListener('click', () => {
      const current = parseInt(qtyValue.textContent, 10);
      if (current < 10) qtyValue.textContent = current + 1;
    });
  }

  // --- Subtle parallax on hero ambient ---
  const heroAmbient = document.querySelector('.hero__ambient');
  if (heroAmbient) {
    window.addEventListener('scroll', () => {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroAmbient.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
        }
      });
    });
  }

  // --- "Add to Cart" button confirmation ---
  function createConfirmation() {
    let el = document.querySelector('.pdp-hero__confirmation');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pdp-hero__confirmation';
      el.textContent = 'Added to your cart';
      document.body.appendChild(el);
    }
    return el;
  }

  function showAddConfirmation() {
    const confirmation = createConfirmation();
    confirmation.classList.add('show');

    // Update cart count
    const cartCounts = document.querySelectorAll('.header__cart-count');
    cartCounts.forEach((count) => {
      const current = parseInt(count.textContent, 10) || 0;
      const qty = qtyValue ? parseInt(qtyValue.textContent, 10) : 1;
      count.textContent = current + qty;
    });

    setTimeout(() => {
      confirmation.classList.remove('show');
    }, 2400);
  }

  const addBtn = document.getElementById('addToCart');
  const addBtnBottom = document.getElementById('addToCartBottom');

  if (addBtn) addBtn.addEventListener('click', showAddConfirmation);
  if (addBtnBottom) addBtnBottom.addEventListener('click', showAddConfirmation);
})();
