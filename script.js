/* ARSHIL CONSTRUCTIONS — Vanilla JS
   Implements:
   - loader hide
   - mobile nav toggle
   - scroll reveal (fade in)
   - animated counters on visibility
   - testimonials slider
   - simple contact form UX
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -------------------- Loader --------------------
  window.addEventListener('load', () => {
    const loader = $('.loader');
    if (!loader) return;
    loader.style.transition = 'opacity 450ms ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500);
  });

  // -------------------- Mobile nav --------------------
  const hamburger = $('[data-hamburger]');
  const mobileMenu = $('[data-mobile-menu]');

  function setMobileMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);

    if (hamburger) {
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      setMobileMenu(isHidden);
    });

    $$('.mobileMenu__link', mobileMenu).forEach((a) => {
      a.addEventListener('click', () => setMobileMenu(false));
    });
  }

  // -------------------- Scroll reveal --------------------
  const revealEls = $$('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // -------------------- Counters --------------------
  const counterEls = $$('.js-counter');

  function animateCounter(el, to) {
    const from = 0;
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      el.textContent = value + '+';
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (counterEls.length) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const to = Number(el.getAttribute('data-to') || '0');
          if (!to) return;
          animateCounter(el, to);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.35 }
    );

    counterEls.forEach((el) => counterIO.observe(el));
  }

  // -------------------- Testimonials slider --------------------
  const slider = $('.testimonialsSlider');
  if (slider) {
    const slidesWrap = $('.slides', slider);
    const slideEls = $$('.slide', slider);
    const dotBtns = $$('.dotBtn', slider);
    const prevBtn = $('.sliderPrev', slider);
    const nextBtn = $('.sliderNext', slider);

    if (slidesWrap && slideEls.length && (dotBtns.length || prevBtn || nextBtn)) {
      let index = 0;
      let timer = null;

      function render() {
        slidesWrap.style.transform = `translateX(-${index * 100}%)`;
        dotBtns.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
      }

      function go(i) {
        index = (i + slideEls.length) % slideEls.length;
        render();
      }

      if (prevBtn) prevBtn.addEventListener('click', () => go(index - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => go(index + 1));

      dotBtns.forEach((d, i) => d.addEventListener('click', () => go(i)));

      function start() {
        stop();
        timer = setInterval(() => go(index + 1), 5200);
      }

      function stop() {
        if (timer) clearInterval(timer);
        timer = null;
      }

      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);

      start();
      render();
    }
  }

  // -------------------- Contact form UX --------------------
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = $('#name', form);
      const email = $('#email', form);
      const phone = $('#phone', form);
      const message = $('#message', form);
      const status = $('#formStatus', form);
      const submitBtn = $('.submitBtn', form);

      const errors = [];
      if (name && !name.value.trim()) errors.push('Name is required');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errors.push('Valid email is required');
      if (message && message.value.trim().length < 10) errors.push('Message must be at least 10 characters');

      if (errors.length) {
        if (status) status.textContent = errors.join('. ');
        return;
      }

      if (status) status.textContent = 'Sending request…';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      // Simulate network
      setTimeout(() => {
        if (status) status.textContent = 'Request received. Our team will contact you shortly.';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        form.reset();
      }, 1200);
    });
  }
})();

