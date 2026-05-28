/* =============================================================================
   Natasha Vaidya — site interactions
   Vanilla JS, no dependencies
   ============================================================================= */
(function () {
  'use strict';

  // ---------- Fade-in on scroll ----------
  // Adds .is-visible to .fade-in elements as they enter the viewport.
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    fadeEls.forEach((el) => io.observe(el));
  } else {
    // graceful fallback: just show everything
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Collaborations horizontal carousel ----------
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const prevBtn = document.querySelector('[data-carousel-prev]');
    const nextBtn = document.querySelector('[data-carousel-next]');

    const scrollAmount = () => {
      const item = carousel.querySelector('.collab-item');
      if (!item) return carousel.clientWidth * 0.8;
      const styles = window.getComputedStyle(carousel);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return item.getBoundingClientRect().width + gap;
    };

    const updateButtonState = () => {
      if (!prevBtn || !nextBtn) return;
      const atStart = carousel.scrollLeft <= 2;
      const atEnd =
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
      prevBtn.disabled = atStart;
      nextBtn.disabled = atEnd;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      });
    }

    carousel.addEventListener('scroll', updateButtonState, { passive: true });
    window.addEventListener('resize', updateButtonState);
    updateButtonState();

    // Allow mouse wheel to scroll horizontally on desktop hover
    carousel.addEventListener(
      'wheel',
      (e) => {
        // only convert vertical wheel to horizontal if user is hovering over carousel
        // and the scroll has more vertical than horizontal component
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
          // only on devices that aren't touch (rough heuristic)
          if (window.matchMedia('(hover: hover)').matches) {
            e.preventDefault();
            carousel.scrollLeft += e.deltaY;
          }
        }
      },
      { passive: false }
    );
  }

  // ---------- Smooth scroll for in-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
