/* ==========================================================================
   GLOWENCE SALON & SPA — HIGH-PERFORMANCE INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initServiceFilters();
  initPricingTabs();
  initBookingModal();
  initScrollAnimations();
  initArcCarousel();
  checkSavedBookings();
});

/* Sticky Header Shrink & Glassmorphism on 45px Scroll */
function initNavbarScroll() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 45) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* Mobile Hamburger Drawer & Backdrop UX */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const sidebarCloseBtn = document.querySelector('.mobile-sidebar-close');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');

  function openMenu() {
    navLinks.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }
  }

  function closeMenu() {
    navLinks.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('mobile-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (sidebarCloseBtn) {
      sidebarCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    const links = navLinks.querySelectorAll('a.nav-link, .open-booking-modal');
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && navLinks.classList.contains('mobile-open')) {
        closeMenu();
      }
    }, { passive: true });
  }
}

/* Filterable Service Cards */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Pricing Package Tabs */
function initPricingTabs() {
  const pricingTabs = document.querySelectorAll('.pricing-tabs .tab-btn');
  const packageCards = document.querySelectorAll('.package-card');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      packageCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Comprehensive Booking Wizard Engine */
function initBookingModal() {
  const modalOverlay = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const serviceSelect = document.getElementById('serviceSelect');
  const slotBtns = document.querySelectorAll('.slot-btn');
  let selectedSlot = '12:00 PM';

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }

  // Global delegate click handler for ALL "Book Now", "Book Service", "Book Package", etc.
  document.addEventListener('click', (e) => {
    const bookBtn = e.target.closest('.open-booking-modal, [data-service]');
    if (bookBtn) {
      e.preventDefault();

      let targetService = bookBtn.getAttribute('data-service');
      
      // Fallback: try reading title from parent card if data-service isn't directly on element
      if (!targetService) {
        const cardTitle = bookBtn.closest('.service-card, .package-card')?.querySelector('.service-card-title, h4')?.innerText;
        if (cardTitle) targetService = cardTitle.trim();
      }

      if (targetService && serviceSelect) {
        // Find matching option in select or dynamically add option
        let matched = false;
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(targetService.toLowerCase()) || 
              serviceSelect.options[i].value.toLowerCase().includes(targetService.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          // Add dynamic option if not found
          const newOpt = document.createElement('option');
          newOpt.value = targetService;
          newOpt.text = targetService;
          newOpt.selected = true;
          serviceSelect.appendChild(newOpt);
        }
      }

      // Reset form view & open modal
      if (bookingForm && bookingSuccess) {
        bookingForm.style.display = 'block';
        bookingSuccess.style.display = 'none';
      }
      modalOverlay.scrollTop = 0;
      modalOverlay.classList.add('active');
    }
  });

  // Close Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  // Time Slot Picker
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(s => s.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.getAttribute('data-time');
    });
  });

  // Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value;
      const phone = document.getElementById('clientPhone').value;
      const city = document.getElementById('branchSelect').value;
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      const date = document.getElementById('bookingDate').value;
      const stylist = document.getElementById('stylistSelect')?.value || 'Master Stylist';
      
      const bookingId = 'SHIVA-' + Math.floor(100000 + Math.random() * 900000);

      // Save to localStorage
      const bookingObj = { id: bookingId, name, phone, city, service, date, slot: selectedSlot, stylist, timestamp: new Date().toISOString() };
      saveBookingToStorage(bookingObj);

      const waMsg = encodeURIComponent(`Hello Shiva Hair Studio! I've booked an appointment.\nRef #${bookingId}\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date} at ${selectedSlot}\nLocation: ${city}`);

      // Render Confirmation Receipt with Direct WhatsApp Action
      document.getElementById('summaryDetails').innerHTML = `
        <div class="receipt-box">
          <div class="receipt-header">
            <span class="booking-ref">Booking Ref: <strong>#${bookingId}</strong></span>
            <span class="booking-status-tag">Confirmed</span>
          </div>
          <div class="receipt-body">
            <p><strong>Client:</strong> ${name} (+91 ${phone})</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Location:</strong> ${city}</p>
            <p><strong>Date & Time:</strong> ${date} at ${selectedSlot}</p>
            <p><strong>Stylist Preference:</strong> ${stylist}</p>
          </div>
          <div class="receipt-footer" style="margin-top: 14px; text-align: center;">
            <p style="margin-bottom: 10px;">Instant confirmation sent to <strong>+91 ${phone}</strong>.</p>
            <a href="https://wa.me/918853064616?text=${waMsg}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #25D366; border-color: #25D366; color: #fff;">
              <i class="fa-brands fa-whatsapp" style="font-size: 1.2rem;"></i> Open Confirmation on WhatsApp
            </a>
          </div>
        </div>
      `;

      bookingForm.style.display = 'none';
      bookingSuccess.style.display = 'block';

      // Confetti burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#FAF5EB', '#1A1715', '#E0C189']
        });
      }
    });
  }
}

/* Save appointment to LocalStorage */
function saveBookingToStorage(booking) {
  try {
    let bookings = JSON.parse(localStorage.getItem('shiva_bookings') || '[]');
    bookings.unshift(booking);
    localStorage.setItem('shiva_bookings', JSON.stringify(bookings));
    checkSavedBookings();
  } catch(e) {
    console.error(e);
  }
}

/* Display saved booking counter in header if present */
function checkSavedBookings() {
  try {
    let bookings = JSON.parse(localStorage.getItem('shiva_bookings') || '[]');
    const badge = document.getElementById('myBookingsCount');
    if (badge && bookings.length > 0) {
      badge.innerText = bookings.length;
      badge.style.display = 'inline-block';
    }
  } catch(e){}
}

/* Advanced Scroll Reveal & Stagger Animation Observer */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const targets = document.querySelectorAll(
    '.animate-reveal, .service-card, .why-card, .package-card, .testimonial-card, .portfolio-card, .section-badge, .section-title, .about-card-dark, .about-details'
  );

  targets.forEach((el) => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-zoom')) {
      el.classList.add('reveal-up');
    }
    observer.observe(el);
  });

  // Stagger delays for grid children
  document.querySelectorAll('.services-grid, .why-grid, .pricing-grid, .testimonial-grid, .portfolio-grid').forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, idx) => {
      child.style.transitionDelay = `${(idx % 4) * 0.12}s`;
    });
  });
}

/* ==========================================================================
   PREMIUM 3D PERSPECTIVE COVERFLOW / CURVED CAROUSEL ENGINE
   ========================================================================== */
function initArcCarousel() {
  const container = document.getElementById('arcCarouselContainer') || document.getElementById('arcCarouselWrapper');
  const track = document.getElementById('arcCarouselTrack');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.arc-card'));
  const prevBtn = document.getElementById('arcPrevBtn') || document.querySelector('.arc-nav-btn.prev-btn');
  const nextBtn = document.getElementById('arcNextBtn') || document.querySelector('.arc-nav-btn.next-btn');
  const dotsContainer = document.getElementById('arcDots');
  
  let currentIndex = 3; // Center card (Master Styling) by default
  const total = cards.length;

  // Build Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = cards.map((_, i) => 
      `<span class="arc-dot ${i === currentIndex ? 'active' : ''}" data-index="${i}" title="Slide ${i+1}"></span>`
    ).join('');
  }

  function updateCoverflow() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

    // Responsive Spacing Config
    const spacing = isMobile ? 140 : (isTablet ? 200 : 255);
    const maxVisible = isMobile ? 1 : (isTablet ? 2 : 3);

    cards.forEach((card, index) => {
      // Calculate shortest distance in circular wrap
      let offset = index - currentIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset === 0) {
        // Active Center Card: Large, sharp, elevated, closest to user
        card.style.transform = `translateX(0px) translateZ(80px) rotateY(0deg) scale(1.05)`;
        card.style.zIndex = 10;
        card.style.opacity = 1;
        card.style.filter = 'brightness(1)';
        card.style.pointerEvents = 'auto';
        card.classList.add('active');
      } else if (absOffset <= maxVisible) {
        // Side Cards: Natural 3D Y-axis Angle, Progressive Overlap, Depth Scale
        const translateX = sign * (spacing * Math.pow(absOffset, 0.92));
        const translateZ = -absOffset * (isMobile ? 40 : 65); // perspective depth
        const rotateY = -sign * (isMobile ? 10 : (absOffset === 1 ? 14 : 22)); // subtle 3D Y-axis perspective
        const scale = Math.max(0.74, 1 - absOffset * (isMobile ? 0.12 : 0.08));
        const opacity = Math.max(0.38, 1 - absOffset * 0.26);
        const brightness = Math.max(0.48, 1 - absOffset * 0.22);

        card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.zIndex = 10 - absOffset;
        card.style.opacity = opacity;
        card.style.filter = `brightness(${brightness})`;
        card.style.pointerEvents = 'auto';
        card.classList.remove('active');
      } else {
        // Hidden outer cards
        const translateX = sign * (spacing * 3.2);
        card.style.transform = `translateX(${translateX}px) translateZ(-200px) scale(0.5)`;
        card.style.zIndex = 0;
        card.style.opacity = 0;
        card.style.pointerEvents = 'none';
        card.classList.remove('active');
      }
    });

    // Update Dots
    if (dotsContainer) {
      const dots = Array.from(dotsContainer.querySelectorAll('.arc-dot'));
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + total) % total;
    updateCoverflow();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.arc-dot');
      if (dot) {
        goToSlide(parseInt(dot.dataset.index, 10));
      }
    });
  }

  // Click any side card to bring it to center
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (currentIndex !== idx) {
        goToSlide(idx);
      }
    });
  });

  // Touch Swipe Support
  let startX = 0;
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Mouse Drag Support
  let isMouseDown = false;
  let mouseStartX = 0;
  track.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    mouseStartX = e.clientX;
  });
  window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  });

  // Keyboard Navigation (ArrowLeft / ArrowRight when in viewport)
  window.addEventListener('keydown', (e) => {
    const rect = track.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    }
  });

  // Responsive resize
  window.addEventListener('resize', updateCoverflow, { passive: true });

  // Auto-play timer with hover pause
  let autoTimer = setInterval(nextSlide, 4500);
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoTimer));
    container.addEventListener('mouseleave', () => { autoTimer = setInterval(nextSlide, 4500); });
  }

  updateCoverflow();
}
