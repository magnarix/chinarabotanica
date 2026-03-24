/* ===================================
   Chinara Botanica — Main JS
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

  // --- Collection dual filter (Time of Day + Feeling) ---
  const collGrid = document.getElementById('collectionGrid');
  const collEmpty = document.getElementById('collectionEmpty');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const timeFilters = document.querySelectorAll('#filterTime .coll-filter');
  const feelingFilters = document.querySelectorAll('#filterFeeling .coll-filter');
  const collCards = collGrid ? collGrid.querySelectorAll('.coll-card') : [];

  let activeTime = 'all';
  let activeFeeling = 'all';

  function applyCollectionFilters() {
    let visibleCount = 0;

    collCards.forEach((card) => {
      const matchTime = activeTime === 'all' || card.dataset.time === activeTime;
      const matchFeeling = activeFeeling === 'all' || card.dataset.feeling === activeFeeling;

      if (matchTime && matchFeeling) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (collEmpty) {
      if (visibleCount === 0) {
        collEmpty.classList.add('show');
      } else {
        collEmpty.classList.remove('show');
      }
    }
  }

  timeFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      timeFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeTime = btn.dataset.time;
      applyCollectionFilters();
    });
  });

  feelingFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      feelingFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFeeling = btn.dataset.feeling;
      applyCollectionFilters();
    });
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      activeTime = 'all';
      activeFeeling = 'all';
      timeFilters.forEach((b) => b.classList.remove('active'));
      feelingFilters.forEach((b) => b.classList.remove('active'));
      timeFilters[0].classList.add('active');
      feelingFilters[0].classList.add('active');
      applyCollectionFilters();
    });
  }

  // Legacy filter support (for any pages still using .filter-btn)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.collection__grid .product-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

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

  // --- "Add to Ritual" button confirmation ---
  function createConfirmation() {
    let el = document.querySelector('.pdp-hero__confirmation');
    if (!el) {
      el = document.createElement('div');
      el.className = 'pdp-hero__confirmation';
      el.textContent = 'Added to your ritual';
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

  const addBtn = document.getElementById('addToRitual');
  const addBtnBottom = document.getElementById('addToRitualBottom');

  if (addBtn) addBtn.addEventListener('click', showAddConfirmation);
  if (addBtnBottom) addBtnBottom.addEventListener('click', showAddConfirmation);
})();
