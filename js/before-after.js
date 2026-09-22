/**
 * REVO - BEFORE & AFTER COMPARISON SLIDER & CLIENT TRANSFORMATION SHOWCASE
 * Handles interactive before/after split slider, client showcase switching,
 * card track navigation, and category filtering.
 */

const transformationData = [
  {
    key: "dimas",
    name: "Dimas Pratama, 28",
    program: "16 Weeks Fat Loss & Recomp",
    quote: "Turun 14.5 kg dan lingkar perut susut 12 cm tanpa lemas. Pola makan fleksibel dan sesi latihan sangat terukur.",
    m1Val: "-14.5 kg",
    m1Lbl: "Body Weight",
    m2Val: "-10.5%",
    m2Lbl: "Body Fat",
    m3Val: "DL 140kg",
    m3Lbl: "Strength Lifted",
    beforeImg: "assets/images/trans_back_before.jpg",
    afterImg: "assets/images/trans_back_after.jpg",
    category: "fatloss"
  },
  {
    key: "maya",
    name: "Maya Paramitha, 26",
    program: "12 Weeks Recomposition",
    quote: "Dulu takut angkat beban karena takut bulky. Coach Revo membuktikan kalau latihan beban justru bikin tubuh kencang dan proporsional.",
    m1Val: "-6.2 kg",
    m1Lbl: "Body Weight",
    m2Val: "-7.8%",
    m2Lbl: "Body Fat",
    m3Val: "Hip Thrust 95kg",
    m3Lbl: "Strength Lifted",
    beforeImg: "assets/images/trans_maya_before.jpg",
    afterImg: "assets/images/trans_maya_after.jpg",
    category: "recomp"
  },
  {
    key: "arif",
    name: "Arif Kurniawan, 30",
    program: "20 Weeks Transformation",
    quote: "Badan stuck bertahun-tahun. Bersama Revo, massa otot naik 7.8 kg bersih, nyeri bahu hilang total, dan deadlift tembus 165kg.",
    m1Val: "+7.8 kg",
    m1Lbl: "Body Weight",
    m2Val: "13%",
    m2Lbl: "Body Fat (Clean Bulk)",
    m3Val: "DL 165kg",
    m3Lbl: "Strength Lifted",
    beforeImg: "assets/images/trans_back_before.jpg",
    afterImg: "assets/images/trans_back_after.jpg",
    category: "hypertrophy"
  },
  {
    key: "raka",
    name: "Raka Wiratama, 27",
    program: "24 Weeks Strength Performance",
    quote: "Fokus pada progresif overload dan mobilitas sendi. Beban squat naik 40kg dengan teknik solid dan bebas cedera pinggang.",
    m1Val: "+40%",
    m1Lbl: "Total Strength",
    m2Val: "-8%",
    m2Lbl: "Body Fat",
    m3Val: "Squat 120kg",
    m3Lbl: "Strength Lifted",
    beforeImg: "assets/images/trans_back_before.jpg",
    afterImg: "assets/images/trans_back_after.jpg",
    category: "strength"
  }
];

class BeforeAfterSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.wrapper = document.getElementById('showcaseBeforeWrap');
    this.beforeImg = document.getElementById('showcaseBeforeImg');
    this.afterImg = document.getElementById('showcaseAfterImg');
    this.handle = document.getElementById('showcaseSliderHandle');
    this.tagBefore = this.container.querySelector('.ba-tag-before');
    this.tagAfter = this.container.querySelector('.ba-tag-after');
    
    this.isSliding = false;
    this.currentClientIdx = 2; // Match mockup default (Arif Kurniawan)
    
    this.initSliderEvents();
    this.initShowcaseControls();
    this.initCardsTrack();
    this.initCategoryFilters();
    this.renderClientStory(2); // Card 3 (Arif) initially active in showcase
  }

  updateLabelVisibility(percentage) {
    if (this.tagBefore) {
      // Hide BEFORE label when slider moves close to the left edge (<= 15%)
      this.tagBefore.classList.toggle('is-hidden', percentage <= 15);
    }
    if (this.tagAfter) {
      // Hide AFTER label when slider moves close to the right edge (>= 85%)
      this.tagAfter.classList.toggle('is-hidden', percentage >= 85);
    }
  }

  initSliderEvents() {
    const move = (clientX) => {
      if (!this.container || !this.wrapper || !this.handle) return;
      const rect = this.container.getBoundingClientRect();
      let x = clientX - rect.left;
      
      // Clamp between 0% and 100%
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      
      const percentage = (x / rect.width) * 100;
      this.wrapper.style.width = `${percentage}%`;
      this.handle.style.left = `${percentage}%`;
      this.updateLabelVisibility(percentage);
      
      if (this.beforeImg) {
        this.beforeImg.style.width = `${rect.width}px`;
      }
    };

    // Mouse Events
    if (this.handle) {
      this.handle.addEventListener('mousedown', () => { this.isSliding = true; });
    }
    this.container.addEventListener('mousedown', (e) => {
      this.isSliding = true;
      move(e.clientX);
    });

    window.addEventListener('mouseup', () => { this.isSliding = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.isSliding) return;
      move(e.clientX);
    });

    // Touch Events
    if (this.handle) {
      this.handle.addEventListener('touchstart', () => { this.isSliding = true; }, { passive: true });
    }
    this.container.addEventListener('touchstart', (e) => {
      this.isSliding = true;
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { this.isSliding = false; });
    window.addEventListener('touchmove', (e) => {
      if (!this.isSliding) return;
      move(e.touches[0].clientX);
    }, { passive: true });

    // Window Resize Sync
    window.addEventListener('resize', () => {
      if (!this.container || !this.beforeImg) return;
      const rect = this.container.getBoundingClientRect();
      this.beforeImg.style.width = `${rect.width}px`;
    });
  }

  initShowcaseControls() {
    const prevBtn = document.getElementById('transShowcasePrev');
    const nextBtn = document.getElementById('transShowcaseNext');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevIdx = (this.currentClientIdx - 1 + transformationData.length) % transformationData.length;
        this.renderClientStory(prevIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextIdx = (this.currentClientIdx + 1) % transformationData.length;
        this.renderClientStory(nextIdx);
      });
    }
  }

  initCardsTrack() {
    const track = document.getElementById('transCardsTrack');
    const cardsPrev = document.getElementById('transCardsPrev');
    const cardsNext = document.getElementById('transCardsNext');
    const cards = document.querySelectorAll('.trans-cards-track .trans-card');

    if (track) {
      // Horizontal draggable setup
      if (window.HorizontalCarousel) {
        new window.HorizontalCarousel(track, cardsPrev, cardsNext, {
          cardSelector: '.trans-card',
          scrollStepRatio: 0.8
        });
      }

      // Card click listener
      cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
          if (track.dataset.hasMoved === 'true') return;
          this.renderClientStory(idx);
          
          // Smooth scroll card into view
          const cardLeft = card.offsetLeft - track.offsetLeft - 10;
          track.scrollTo({ left: cardLeft, behavior: 'smooth' });
        });
      });
    }
  }

  initCategoryFilters() {
    const filterTabs = document.querySelectorAll('.trans-pill-tab[data-trans-filter]');
    const cards = document.querySelectorAll('.trans-cards-track .trans-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-trans-filter');

        // Update active tab UI
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        let firstMatchingIdx = -1;

        cards.forEach((card, idx) => {
          const cardCategory = card.getAttribute('data-trans-category');
          const isMatch = filter === 'all' || cardCategory === filter || (filter === 'fatloss' && cardCategory === 'recomp');
          
          if (isMatch) {
            card.style.display = 'flex';
            if (firstMatchingIdx === -1) firstMatchingIdx = idx;
          } else {
            card.style.display = 'none';
          }
        });

        if (firstMatchingIdx !== -1) {
          this.renderClientStory(firstMatchingIdx);
        }
      });
    });
  }

  renderClientStory(idx) {
    const data = transformationData[idx];
    if (!data) return;

    this.currentClientIdx = idx;

    // 1. Update Images & Reset Split to 50%
    if (this.beforeImg) this.beforeImg.src = data.beforeImg;
    if (this.afterImg) this.afterImg.src = data.afterImg;

    if (this.wrapper) this.wrapper.style.width = '50%';
    if (this.handle) this.handle.style.left = '50%';
    this.updateLabelVisibility(50);

    if (this.container && this.beforeImg) {
      const rect = this.container.getBoundingClientRect();
      if (rect.width > 0) {
        this.beforeImg.style.width = `${rect.width}px`;
      }
    }

    // 2. Update Showcase Text & Metrics
    const nameEl = document.getElementById('showcaseClientName');
    const progEl = document.getElementById('showcaseProgramDuration');
    const quoteEl = document.getElementById('showcaseQuoteText');
    const m1Val = document.getElementById('showcaseMetric1Val');
    const m1Lbl = document.getElementById('showcaseMetric1Lbl');
    const m2Val = document.getElementById('showcaseMetric2Val');
    const m2Lbl = document.getElementById('showcaseMetric2Lbl');
    const m3Val = document.getElementById('showcaseMetric3Val');
    const m3Lbl = document.getElementById('showcaseMetric3Lbl');

    if (nameEl) nameEl.textContent = data.name;
    if (progEl) progEl.textContent = data.program;
    if (quoteEl) quoteEl.innerHTML = `&ldquo;${data.quote}&rdquo;`;

    if (m1Val) m1Val.textContent = data.m1Val;
    if (m1Lbl) m1Lbl.textContent = data.m1Lbl;
    if (m2Val) m2Val.textContent = data.m2Val;
    if (m2Lbl) m2Lbl.textContent = data.m2Lbl;
    if (m3Val) m3Val.textContent = data.m3Val;
    if (m3Lbl) m3Lbl.textContent = data.m3Lbl;

    // 3. Highlight Matching Bottom Card
    const cards = document.querySelectorAll('.trans-cards-track .trans-card');
    cards.forEach((card, cIdx) => {
      const isActive = cIdx === idx;
      card.classList.toggle('featured', isActive);
      card.classList.toggle('active', isActive);
    });
  }
}

// Global initialization helper
window.initBeforeAfterSlider = () => {
  new BeforeAfterSlider('beforeAfterBox');
};

