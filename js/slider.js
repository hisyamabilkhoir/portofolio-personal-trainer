/**
 * REVO - DRAGGABLE & RESPONSIVE SLIDER COMPONENT
 * Handles mouse drag, touch swipe, momentum, and navigation buttons
 */

class HorizontalCarousel {
  constructor(trackElement, prevBtn, nextBtn, cardWidth = 300) {
    this.track = trackElement;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.cardWidth = cardWidth;
    
    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;
    
    if (this.track) {
      this.init();
    }
  }

  init() {
    this.hasMoved = false;

    // Mouse Dragging
    this.track.addEventListener('mousedown', (e) => {
      this.isDown = true;
      this.hasMoved = false;
      this.startX = e.pageX - this.track.offsetLeft;
      this.scrollLeft = this.track.scrollLeft;
    });

    this.track.addEventListener('mouseleave', () => {
      this.isDown = false;
      this.track.classList.remove('is-dragging');
    });

    this.track.addEventListener('mouseup', () => {
      this.isDown = false;
      this.track.classList.remove('is-dragging');
    });

    this.track.addEventListener('mousemove', (e) => {
      if (!this.isDown) return;
      const x = e.pageX - this.track.offsetLeft;
      const diff = x - this.startX;
      if (Math.abs(diff) > 10) {
        this.hasMoved = true;
        this.track.classList.add('is-dragging');
        e.preventDefault();
        this.track.scrollLeft = this.scrollLeft - (diff * 1.3);
        this.updateButtonStates();
      }
    });

    // Prevent click only if user was actually dragging
    this.track.addEventListener('click', (e) => {
      if (this.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        this.hasMoved = false;
      }
    }, true);

    // Button Navigation
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollPrev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollNext());
    }

    // Scroll listener for button disable state
    this.track.addEventListener('scroll', () => {
      this.updateButtonStates();
    }, { passive: true });

    // Initial state
    this.updateButtonStates();
  }

  scrollPrev() {
    const scrollAmount = this.track.clientWidth * 0.8 || 320;
    this.track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  scrollNext() {
    const scrollAmount = this.track.clientWidth * 0.8 || 320;
    this.track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  updateButtonStates() {
    if (!this.prevBtn || !this.nextBtn) return;
    
    const maxScrollLeft = this.track.scrollWidth - this.track.clientWidth;
    this.prevBtn.disabled = this.track.scrollLeft <= 5;
    this.nextBtn.disabled = this.track.scrollLeft >= maxScrollLeft - 5;
  }
}

// Export initialization helper
window.initCarousels = () => {
  // Programs Carousel
  const programsTrack = document.getElementById('programsTrack');
  const progPrevBtn = document.getElementById('progPrevBtn');
  const progNextBtn = document.getElementById('progNextBtn');
  if (programsTrack) {
    new HorizontalCarousel(programsTrack, progPrevBtn, progNextBtn);
  }

  // Testimonials Carousel
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testPrevBtn = document.getElementById('testPrevBtn');
  const testNextBtn = document.getElementById('testNextBtn');
  if (testimonialsTrack) {
    new HorizontalCarousel(testimonialsTrack, testPrevBtn, testNextBtn);
  }
};
