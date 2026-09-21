/**
 * REVO - BEFORE & AFTER COMPARISON SLIDER & CLIENT STORY SWITCHER
 */

const transformationData = [
  {
    key: "dimas",
    name: "Dimas Pratama, 28",
    program: "16 Weeks Fat Loss & Recomposition",
    quote: "Turun 14.5 kg dan lingkar perut susut 12 cm tanpa lemas. Pola makan fleksibel dan sesi latihan sangat terukur.",
    weight: "- 14.5 kg",
    fat: "- 10.5%",
    strength: "+ 45%",
    beforeImg: "assets/images/trans_back_before.jpg",
    afterImg: "assets/images/trans_back_after.jpg"
  },
  {
    key: "maya",
    name: "Maya Paramitha, 26",
    program: "12 Weeks Lean Physique & Core",
    quote: "Dulu takut angkat beban karena takut bulky. Coach Revo membuktikan kalau latihan beban justru bikin tubuh kencang dan proporsional.",
    weight: "- 6.2 kg",
    fat: "- 7.8%",
    strength: "Hip Thrust 95kg",
    beforeImg: "assets/images/trans_maya_before.jpg",
    afterImg: "assets/images/trans_maya_after.jpg"
  },
  {
    key: "arif",
    name: "Arif Kurniawan, 30",
    program: "20 Weeks Hypertrophy & Strength",
    quote: "Badan stuck bertahun-tahun. Bersama Revo, massa otot naik 7.8 kg bersih, nyeri bahu bench press hilang total, dan deadlift tembus 165kg.",
    weight: "+ 7.8 kg",
    fat: "13% (Clean Bulk)",
    strength: "DL 165kg",
    beforeImg: "assets/images/trans_back_before.jpg",
    afterImg: "assets/images/trans_back_after.jpg"
  }
];

class BeforeAfterSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.wrapper = this.container.querySelector('.ba-before-wrapper');
    this.beforeImg = this.container.querySelector('.ba-before-img');
    this.afterImg = this.container.querySelector('.ba-after-img');
    this.handle = this.container.querySelector('.ba-slider-handle');
    
    this.isSliding = false;
    this.currentClientIdx = 0;
    
    this.initSliderEvents();
    this.initStoryControls();
    this.renderClientStory(0);
  }

  initSliderEvents() {
    const move = (clientX) => {
      const rect = this.container.getBoundingClientRect();
      let x = clientX - rect.left;
      
      // Clamp between 0% and 100%
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      
      const percentage = (x / rect.width) * 100;
      this.wrapper.style.width = `${percentage}%`;
      this.handle.style.left = `${percentage}%`;
      
      // Keep before image fixed at 100% of container width so it doesn't squish
      this.beforeImg.style.width = `${rect.width}px`;
    };

    // Mouse Events
    this.handle.addEventListener('mousedown', () => { this.isSliding = true; });
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
    this.handle.addEventListener('touchstart', () => { this.isSliding = true; }, { passive: true });
    this.container.addEventListener('touchstart', (e) => {
      this.isSliding = true;
      move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { this.isSliding = false; });
    window.addEventListener('touchmove', (e) => {
      if (!this.isSliding) return;
      move(e.touches[0].clientX);
    }, { passive: true });

    // Resize sync
    window.addEventListener('resize', () => {
      const rect = this.container.getBoundingClientRect();
      this.beforeImg.style.width = `${rect.width}px`;
    });
  }

  initStoryControls() {
    const prevBtn = document.getElementById('transPrevBtn');
    const nextBtn = document.getElementById('transNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentClientIdx = (this.currentClientIdx - 1 + transformationData.length) % transformationData.length;
        this.renderClientStory(this.currentClientIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentClientIdx = (this.currentClientIdx + 1) % transformationData.length;
        this.renderClientStory(this.currentClientIdx);
      });
    }
  }

  renderClientStory(idx) {
    const data = transformationData[idx];
    if (!data) return;

    // Update images
    this.beforeImg.src = data.beforeImg;
    this.afterImg.src = data.afterImg;

    // Reset position to center 50%
    this.wrapper.style.width = '50%';
    this.handle.style.left = '50%';
    const rect = this.container.getBoundingClientRect();
    if (rect.width > 0) {
      this.beforeImg.style.width = `${rect.width}px`;
    }

    // Update text elements
    const idxEl = document.getElementById('transCurrentIndex');
    const totalEl = document.getElementById('transTotalCount');
    const nameEl = document.getElementById('transClientName');
    const progEl = document.getElementById('transProgramDuration');
    const quoteEl = document.getElementById('transQuoteText');
    const weightEl = document.getElementById('transMetricWeight');
    const fatEl = document.getElementById('transMetricFat');
    const strengthEl = document.getElementById('transMetricStrength');

    if (idxEl) idxEl.textContent = String(idx + 1).padStart(2, '0');
    if (totalEl) totalEl.textContent = String(transformationData.length).padStart(2, '0');
    if (nameEl) nameEl.textContent = data.name;
    if (progEl) progEl.textContent = data.program;
    if (quoteEl) quoteEl.textContent = `"${data.quote}"`;
    if (weightEl) weightEl.textContent = data.weight;
    if (fatEl) fatEl.textContent = data.fat;
    if (strengthEl) strengthEl.textContent = data.strength;

    const caseStudyBtn = document.getElementById('viewActiveCaseStudyBtn');
    if (caseStudyBtn) {
      caseStudyBtn.setAttribute('data-open-casestudy', data.key || 'dimas');
    }
  }
}

// Export initialization
window.initBeforeAfterSlider = () => {
  new BeforeAfterSlider('beforeAfterBox');
};
