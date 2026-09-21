/**
 * REVO - DRAGGABLE & RESPONSIVE SLIDER COMPONENT
 * Handles mouse drag, mouse wheel horizontal translation, touch swipe,
 * momentum scrolling, dynamic active card tracking, and navigation buttons.
 */

class HorizontalCarousel {
  constructor(trackElement, prevBtn, nextBtn, options = {}) {
    this.track = trackElement;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.options = Object.assign({
      cardSelector: null,
      onScroll: null,
      scrollStepRatio: 0.75
    }, options);

    this.isDown = false;
    this.startX = 0;
    this.startScrollLeft = 0;
    this.hasMoved = false;
    this.velocity = 0;
    this.lastX = 0;
    this.lastTime = 0;
    this.momentumRAF = null;

    if (this.track) {
      this.init();
    }
  }

  init() {
    // 1. Mouse Dragging (window-level tracking for smooth release outside bounds)
    this.track.addEventListener('mousedown', (e) => {
      // Don't drag if middle or right click
      if (e.button !== 0) return;
      this.isDown = true;
      this.hasMoved = false;
      this.track.dataset.hasMoved = 'false';
      this.startX = e.pageX;
      this.startScrollLeft = this.track.scrollLeft;
      this.lastX = e.pageX;
      this.lastTime = performance.now();
      this.velocity = 0;
      
      if (this.momentumRAF) {
        cancelAnimationFrame(this.momentumRAF);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDown) return;
      const x = e.pageX;
      const diff = x - this.startX;

      if (Math.abs(diff) > 5) {
        this.hasMoved = true;
        this.track.dataset.hasMoved = 'true';
        this.track.classList.add('is-dragging');
      }

      if (this.hasMoved) {
        e.preventDefault();
        const now = performance.now();
        const dt = now - this.lastTime || 16;
        this.velocity = (x - this.lastX) / dt;
        this.lastX = x;
        this.lastTime = now;

        this.track.scrollLeft = this.startScrollLeft - diff;
        this.updateButtonStates();
      }
    });

    window.addEventListener('mouseup', () => {
      if (!this.isDown) return;
      this.isDown = false;
      this.track.classList.remove('is-dragging');

      if (this.hasMoved) {
        // Apply smooth momentum glide
        this.applyMomentum();
        
        // Keep hasMoved flag for a short delay to prevent accidental click triggers
        setTimeout(() => {
          this.hasMoved = false;
          if (this.track) this.track.dataset.hasMoved = 'false';
        }, 80);
      }
    });

    // 2. Prevent clicks on inner elements if user was dragging
    this.track.addEventListener('click', (e) => {
      if (this.hasMoved || this.track.dataset.hasMoved === 'true') {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // 3. Mouse Wheel Horizontal Translation
    // Converts vertical mouse wheel delta into horizontal scroll over the slider
    this.track.addEventListener('wheel', (e) => {
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      const maxScrollLeft = this.track.scrollWidth - this.track.clientWidth;
      const atLeft = this.track.scrollLeft <= 1 && delta < 0;
      const atRight = this.track.scrollLeft >= maxScrollLeft - 1 && delta > 0;

      // If there is room to scroll horizontally, scroll smoothly and prevent full-page jump
      if (!atLeft && !atRight && maxScrollLeft > 10) {
        e.preventDefault();
        this.track.scrollLeft += delta * 0.9;
        this.updateButtonStates();
        if (typeof this.options.onScroll === 'function') {
          this.options.onScroll(this.track.scrollLeft, maxScrollLeft);
        }
      }
    }, { passive: false });

    // 4. Button Navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollPrev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollNext();
      });
    }

    // 5. Scroll Event Listener (Throttled via RAF)
    let isScrolling = false;
    this.track.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          this.updateButtonStates();
          const maxScrollLeft = this.track.scrollWidth - this.track.clientWidth;
          if (typeof this.options.onScroll === 'function') {
            this.options.onScroll(this.track.scrollLeft, maxScrollLeft);
          }
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, { passive: true });

    // Initial button state check
    this.updateButtonStates();
  }

  applyMomentum() {
    if (Math.abs(this.velocity) < 0.15) return;
    
    let currentVelocity = this.velocity * 12; // Momentum magnitude
    const friction = 0.92;

    const step = () => {
      if (Math.abs(currentVelocity) > 0.5) {
        this.track.scrollLeft -= currentVelocity;
        currentVelocity *= friction;
        this.momentumRAF = requestAnimationFrame(step);
      } else {
        this.updateButtonStates();
      }
    };

    this.momentumRAF = requestAnimationFrame(step);
  }

  scrollPrev() {
    const cards = this.options.cardSelector ? this.track.querySelectorAll(this.options.cardSelector) : null;
    if (cards && cards.length > 0) {
      // Find previous card based on current scroll position
      const currentScroll = this.track.scrollLeft;
      let targetScroll = 0;
      for (let i = cards.length - 1; i >= 0; i--) {
        const cardLeft = cards[i].offsetLeft - this.track.offsetLeft;
        if (cardLeft < currentScroll - 10) {
          targetScroll = cardLeft;
          break;
        }
      }
      this.track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    } else {
      const scrollAmount = this.track.clientWidth * this.options.scrollStepRatio || 320;
      this.track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }

  scrollNext() {
    const cards = this.options.cardSelector ? this.track.querySelectorAll(this.options.cardSelector) : null;
    if (cards && cards.length > 0) {
      // Find next card based on current scroll position
      const currentScroll = this.track.scrollLeft;
      const maxScroll = this.track.scrollWidth - this.track.clientWidth;
      let targetScroll = maxScroll;
      for (let i = 0; i < cards.length; i++) {
        const cardLeft = cards[i].offsetLeft - this.track.offsetLeft;
        if (cardLeft > currentScroll + 10) {
          targetScroll = cardLeft;
          break;
        }
      }
      this.track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    } else {
      const scrollAmount = this.track.clientWidth * this.options.scrollStepRatio || 320;
      this.track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  updateButtonStates() {
    if (!this.track) return;
    const maxScrollLeft = this.track.scrollWidth - this.track.clientWidth;
    const isAtStart = this.track.scrollLeft <= 5;
    const isAtEnd = this.track.scrollLeft >= maxScrollLeft - 5;

    if (this.prevBtn) {
      this.prevBtn.disabled = isAtStart;
      this.prevBtn.classList.toggle('prog-prev-active', !isAtStart);
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = isAtEnd;
      this.nextBtn.classList.toggle('prog-next-active', !isAtEnd);
    }
  }
}

// Global initialization function called by app.js
window.initCarousels = () => {
  // 1. Programs Carousel
  const programsTrack = document.getElementById('programsTrack');
  const progPrevBtn = document.getElementById('progPrevBtn');
  const progNextBtn = document.getElementById('progNextBtn');
  const progCards = document.querySelectorAll('.programs-track .program-card');
  const currentProgNum = document.getElementById('currentProgNum');
  const progProgressFill = document.getElementById('progProgressFill');

  if (programsTrack && progCards.length > 0) {
    let currentActiveIdx = 1;
    const totalCards = progCards.length;

    const setActiveProgramUI = (index) => {
      if (index < 1) index = 1;
      if (index > totalCards) index = totalCards;
      if (currentActiveIdx === index) return;
      currentActiveIdx = index;

      progCards.forEach((card, idx) => {
        const isCurrent = (idx + 1) === currentActiveIdx;
        card.classList.toggle('featured', isCurrent);
        card.classList.toggle('active', isCurrent);
      });

      if (currentProgNum) {
        currentProgNum.textContent = String(currentActiveIdx).padStart(2, '0');
      }
    };

    // Update active card & continuous progress fill during scroll/drag/wheel
    const onProgramsScroll = (scrollLeft, maxScroll) => {
      // Find card closest to viewport left/focus area
      const trackRect = programsTrack.getBoundingClientRect();
      let closestIdx = 0;
      let minDistance = Infinity;

      progCards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        // Distance of card left edge from track left edge
        const distance = Math.abs(cardRect.left - trackRect.left);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveProgramUI(closestIdx + 1);

      // Continuous progress bar fill
      if (progProgressFill && maxScroll > 0) {
        const progressFraction = Math.max(0, Math.min(1, scrollLeft / maxScroll));
        // Interpolate width from 25% (card 1 of 4) to 100% (card 4 of 4)
        const percent = 25 + (progressFraction * 75);
        progProgressFill.style.width = `${percent}%`;
      }
    };

    // Initialize carousel with scroll synchronization
    new HorizontalCarousel(programsTrack, progPrevBtn, progNextBtn, {
      cardSelector: '.program-card',
      onScroll: onProgramsScroll
    });

    // Card click event: scroll to card and activate it
    progCards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (programsTrack.dataset.hasMoved === 'true') return;
        
        // If clicking the arrow button, allow modal trigger from app.js
        if (e.target.closest('.program-arrow-btn')) {
          return;
        }

        // Smoothly scroll clicked card into view
        const cardLeft = card.offsetLeft - programsTrack.offsetLeft;
        programsTrack.scrollTo({ left: cardLeft, behavior: 'smooth' });
        setActiveProgramUI(idx + 1);
      });
    });
  }

  // 2. Testimonials Carousel
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testPrevBtn = document.getElementById('testPrevBtn');
  const testNextBtn = document.getElementById('testNextBtn');
  if (testimonialsTrack) {
    new HorizontalCarousel(testimonialsTrack, testPrevBtn, testNextBtn, {
      cardSelector: '.testimonial-card',
      scrollStepRatio: 0.85
    });
  }
};

