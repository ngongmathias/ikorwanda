/* ========================================
   IkoRwanda Ltd — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Navbar scroll behavior ---
  const navbar = document.querySelector('.navbar');
  const scrollThreshold = 80;

  function handleNavScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll();

  // --- 2. Hamburger menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- 3. Scroll reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Animated counters ---
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // --- 5. Smooth scroll for nav links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- 6. Contact form validation ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = this.querySelector('#name');
      const email = this.querySelector('#email');
      const message = this.querySelector('#message');
      let valid = true;

      // Reset
      this.querySelectorAll('.form-error').forEach(el => el.remove());
      this.querySelectorAll('input, select, textarea').forEach(el => el.style.borderColor = '');

      // Name
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        valid = false;
      }

      // Email
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        valid = false;
      }

      // Message
      if (!message.value.trim()) {
        showError(message, 'Please enter a message');
        valid = false;
      }

      if (valid) {
        const btn = this.querySelector('.form-submit');
        btn.textContent = 'Message Sent!';
        btn.style.background = '#217A45';
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          this.reset();
        }, 3000);
      }
    });
  }

  function showError(input, msg) {
    input.style.borderColor = '#ef4444';
    const error = document.createElement('span');
    error.className = 'form-error';
    error.style.cssText = 'color:#ef4444;font-size:13px;margin-top:4px;display:block;';
    error.textContent = msg;
    input.parentNode.appendChild(error);
  }

  // --- 7. Gallery lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  if (lightbox && galleryItems.length) {
    const images = Array.from(galleryItems).map(item => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt,
      caption: item.querySelector('.gallery-caption')?.textContent || ''
    }));

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        currentIndex = i;
        showLightbox(currentIndex);
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });

    function showLightbox(index) {
      lightboxImg.src = images[index].src;
      lightboxImg.alt = images[index].alt;
      lightboxCaption.textContent = images[index].caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      showLightbox(currentIndex);
    }
  }

});
