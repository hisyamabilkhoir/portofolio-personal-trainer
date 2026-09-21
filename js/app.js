/**
 * REVO PERSONAL TRAINER - MAIN APPLICATION CONTROLLER
 * Handles navigation, scroll-spy, animated counters, modals, and toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sub-modules
  if (window.initCarousels) window.initCarousels();
  if (window.initBeforeAfterSlider) window.initBeforeAfterSlider();
  if (window.initPlanGenerator) window.initPlanGenerator();

  // 2. Navigation & Header Scroll State
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-spy active link
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // 3. Mobile Navigation Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (open) => {
    const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    mobileDrawer.classList.toggle('open', isOpen);
    mobileBackdrop.classList.toggle('open', isOpen);
    hamburgerBtn.classList.toggle('active', isOpen);
    document.body.classList.toggle('modal-open', isOpen);
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileNav());
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleMobileNav(false));
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-val');
  let countersStarted = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, stepTime);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counterElements.forEach(el => countUp(el));
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) counterObserver.observe(statsSection);

  // 6. Modal Management System
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  };

  const closeModal = (modal) => {
    if (typeof modal === 'string') {
      modal = document.getElementById(modal);
    }
    if (modal) {
      modal.classList.remove('active');
      // If no other modals are active, remove modal-open from body
      const remainingActiveModals = document.querySelectorAll('.modal-backdrop.active');
      if (remainingActiveModals.length <= 1) {
        document.body.classList.remove('modal-open');
      }
    }
  };

  window.openModal = openModal;
  window.closeModal = closeModal;

  // Close buttons and backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
  });

  // Global ESC Key Close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m));
      toggleMobileNav(false);
    }
  });

  // Modal Triggers
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = trigger.getAttribute('data-open-modal');
      // Close other active modals if switching modals
      document.querySelectorAll('.modal-backdrop.active').forEach(m => {
        if (m.id !== targetModalId) m.classList.remove('active');
      });
      openModal(targetModalId);
    });
  });

  // 7. Vector Icons Library
  const ICONS = {
    target: `<svg class="modal-section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    science: `<svg class="modal-section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.89 20a2 2 0 0 0 1.74 3h14.74a2 2 0 0 0 1.74-3L18 9.31V2"></path><path d="M8 2h8"></path><path d="M6.5 15h11"></path></svg>`,
    clipboard: `<svg class="modal-section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg>`,
    zap: `<svg class="modal-zap-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    chart: `<svg class="modal-section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    check: `<span class="perk-check-wrap"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`
  };

  // Articles Data & Modal Handler
  const articlesData = {
    "1": {
      title: "5 Common Mistakes Beginners Make at the Gym",
      tag: "Training",
      date: "Sep 12, 2024 &bull; 4 min read",
      image: "assets/images/blog_training.jpg",
      content: `
        <p>Walking into a gym for the first time is exciting, but without a clear strategy, it's easy to waste time, get frustrated, or even end up injured. Over the past 8+ years coaching beginners into confident lifters, I've seen these same 5 mistakes repeated constantly.</p>
        
        <h3>1. Ego Lifting Over Form Mastery</h3>
        <p>The number one roadblock to long-term gains is adding weight before mastering movement mechanics. Heavy weights mean nothing if the tension is placed on your lower back or tendons instead of the target muscle. Prioritize full range of motion, controlled tempos (2-3 seconds on the eccentric/lowering phase), and clean technique before adding another plate.</p>
        
        <h3>2. Program Hopping Every Week</h3>
        <p>Changing your workout split every week because of something you saw on social media destroys progressive overload. Real muscle growth and strength adaptations require doing the same compound lifts week after week, tracking your numbers, and progressively adding load or reps.</p>

        <div class="article-pro-tip">
          <div class="article-pro-tip-title">${ICONS.zap} Coach Revo's Pro Tip</div>
          <p>Stick to one structured 3-5 day workout routine for at least 8 to 12 weeks. Consistency on a simple, well-designed program always beats random complexity.</p>
        </div>

        <h3>3. Neglecting Recovery &amp; Sleep</h3>
        <p>You don't grow muscle in the gym &mdash; you break muscle tissue down in the gym. Muscle synthesis and hormonal recovery occur while you sleep (specifically stages 3 and 4 of deep sleep). Getting less than 7 hours of quality sleep reduces protein synthesis and spikes cortisol, making fat loss and hypertrophy significantly harder.</p>

        <h3>4. Under-Eating Protein</h3>
        <p>Many beginners think training hard is enough. If you don't supply your body with adequate amino acids, your muscles simply cannot repair and grow denser. Aim for roughly 1.6 to 2.2 grams of protein per kilogram of body weight spread across 3&ndash;4 meals daily.</p>

        <h3>5. Skipping the Warm-Up &amp; Mobility</h3>
        <p>Jumping straight onto a heavy bench press or squat rack with cold joints is an invitation for shoulder impingements and hip pain. Spend 5&ndash;8 minutes doing dynamic stretches, hip openers, and progressive warm-up sets with an empty barbell.</p>
      `
    },
    "2": {
      title: "A Simple Guide to Better Meal Prep",
      tag: "Nutrition",
      date: "Sep 5, 2024 • 6 min read",
      image: "assets/images/blog_nutrition.jpg",
      content: `
        <p>You can't out-train a chaotic diet. But meal prepping shouldn't mean spending your entire Sunday afternoon cooking dry chicken and soggy broccoli. Here is a simple, realistic meal prep blueprint designed for busy professionals.</p>

        <h3>1. The 3-Component Meal Formula</h3>
        <p>Every balanced fitness meal comes down to three building blocks:</p>
        <ul>
          <li><strong>Lean Protein (Palm-sized):</strong> Chicken breast, lean ground beef, tofu, tempeh, eggs, salmon, or Greek yogurt.</li>
          <li><strong>Complex Carbohydrates (Fist-sized):</strong> Brown rice, sweet potatoes, oats, quinoa, or whole-wheat pasta.</li>
          <li><strong>Fiber &amp; Micronutrients (Two cupped hands):</strong> Broccoli, asparagus, spinach, bell peppers, or mixed salad greens.</li>
        </ul>

        <div class="article-pro-tip">
          <div class="article-pro-tip-title">${ICONS.zap} Coach Revo's Pro Tip</div>
          <p>Instead of cooking complete single-portion meals, prep "components" in bulk (e.g. 1kg cooked chicken + tray of roasted vegetables + pot of rice). This allows you to mix and match with different seasonings during the week so you never get bored.</p>
        </div>

        <h3>2. Flavor Hacks: Sauces Under 30 Calories</h3>
        <p>The biggest reason people quit meal prep is bland food. You don't need heavy mayo or high-sugar BBQ sauces. Use low-calorie flavor enhancers:</p>
        <ul>
          <li>Sriracha &amp; Sambal with fresh lime juice</li>
          <li>Garlic powder, smoked paprika, and Italian herb blends</li>
          <li>Balsamic vinegar or apple cider glaze</li>
          <li>Dijon mustard mixed with a splash of soy sauce</li>
        </ul>

        <h3>3. Proper Storage &amp; Freshness</h3>
        <p>Keep 3 days of meals in airtight glass containers in the fridge, and freeze the remaining portions immediately. Reheat in a microwave with a damp paper towel on top to keep poultry tender and moist.</p>
      `
    },
    "3": {
      title: "Why Consistency Beats Motivation Every Time",
      tag: "Lifestyle",
      date: "Aug 28, 2024 • 5 min read",
      image: "assets/images/blog_lifestyle.jpg",
      content: `
        <p>Motivation is an emotion. It comes in waves when you watch an inspiring video or set a New Year's resolution. But feelings are volatile. The clients who achieve dramatic, permanent transformations aren't the ones who are motivated 365 days a year &mdash; they are the ones who show up on the days they don't feel like it.</p>

        <h3>1. The Myth of Feeling "Ready"</h3>
        <p>If you only workout when you feel 100% energized, you will only train 20% of the time. High performers understand that <em>action precedes motivation</em>. Once you start moving for 5 minutes, endorphins kick in and momentum takes over.</p>

        <div class="article-pro-tip">
          <div class="article-pro-tip-title">${ICONS.zap} Coach Revo's Pro Tip</div>
          <p>Establish a "Minimum Baseline Workout" for rough days. If you only have 20 minutes and low energy, do 3 sets of pushups and bodyweight squats. Maintaining the habit streak is 10x more valuable than skipping entirely.</p>
        </div>

        <h3>2. Shift from Outcome Goals to Identity Habits</h3>
        <p>Instead of saying "I want to lose 10 kg," reframe your mindset to "I am the type of person who never misses two days in a row." When fitness becomes part of your identity rather than a temporary chore, discipline becomes natural.</p>

        <h3>3. Protect Your Environment</h3>
        <p>Willpower is a finite resource. Remove friction that stops you from training: pack your gym bag the night before, keep healthy snacks ready, and schedule workouts into your calendar like an unmissable business meeting.</p>
      `
    }
  };

  const openArticleModal = (articleId) => {
    const article = articlesData[articleId];
    if (!article) return;

    const modalTitle = document.getElementById('articleModalTitle');
    const modalTag = document.getElementById('articleModalTag');
    const modalDate = document.getElementById('articleModalDate');
    const modalImg = document.getElementById('articleModalImage');
    const modalBody = document.getElementById('articleModalBody');

    if (modalTitle) modalTitle.textContent = article.title;
    if (modalTag) modalTag.textContent = article.tag;
    if (modalDate) modalDate.innerHTML = article.date;
    if (modalImg) {
      modalImg.src = article.image;
      modalImg.alt = article.title;
    }
    if (modalBody) modalBody.innerHTML = article.content;

    openModal('articleModal');
  };

  // Blog Card Click Listeners
  document.querySelectorAll('.blog-card[data-article-id]').forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.getAttribute('data-article-id');
      openArticleModal(articleId);
    });
  });

  // Close Article Button
  const closeArticleBtn = document.getElementById('closeArticleBtn');
  if (closeArticleBtn) {
    closeArticleBtn.addEventListener('click', () => {
      closeModal('articleModal');
    });
  }

  // 8. Programs Data & Modal Handler
  const programsData = {
    "fatloss": {
      title: "Fat Loss & Metabolic Recomposition",
      badge: "12 - 16 Weeks",
      tag: "Body Recomposition & Conditioning",
      subtitle: "Drop 5–15+ kg of pure body fat, preserve athletic muscle tissue, and lock in permanent metabolic vitality without starvation diets.",
      image: "assets/images/program_fatloss.jpg",
      stats: {
        duration: "12 - 16 Weeks",
        frequency: "3 - 5 Days / Wk",
        intensity: "RPE 7 - 9 (Moderate-High)",
        format: "In-Person & Hybrid"
      },
      selectValue: "fatloss",
      content: `
        <div class="program-detail-block">
          <h3>${ICONS.target} Target Audience &amp; Who This Is For</h3>
          <p>Designed for busy executives, working professionals, and everyday individuals who want to shed stubborn visceral fat, tighten their midsection, and break the cycle of restrictive yo-yo dieting. Tailored specifically whether you have 5 kg or 20+ kg to lose.</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.science} Sports-Science Methodology &amp; Core Pillars</h3>
          <ul>
            <li><strong>Non-Starvation Caloric Deficit:</strong> Calculated macro periodization with structured carbohydrate refeeds to safeguard leptin levels, thyroid health, and resting metabolic rate (RMR).</li>
            <li><strong>Hypertrophy-Preserving Resistance Training:</strong> Heavy multi-joint compound lifts (Squats, RDLs, Presses, Rows) to provide the hormonal stimulus needed to keep 100% of your muscle while burning fat.</li>
            <li><strong>Zone 2 Aerobic Base &amp; NEAT Optimization:</strong> Daily 8,000–10,000 step targets and low-impact Zone 2 sessions that tap directly into adipose fat stores without causing nervous system exhaustion.</li>
            <li><strong>Metabolic Conditioning Finishers:</strong> High-density 8-10 minute interval complexes (sled pushes, kettlebells, rowers) for maximum Excess Post-Exercise Oxygen Consumption (EPOC).</li>
          </ul>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.clipboard} What's Included in the Coaching</h3>
          <div class="program-perks-grid">
            <div class="program-perk-item">${ICONS.check} <div><strong>Bi-Weekly InBody / Caliper Scans:</strong> Objective body composition &amp; circumference tracking.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Custom Nutrition &amp; Macro Guide:</strong> Tailored meal blueprints and restaurant eating strategies.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Private App Workout Portal:</strong> HD video execution guides with exact tempo and rest timers.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Direct Coach WhatsApp Access:</strong> Daily accountability, habit check-ins, and rapid feedback.</div></div>
          </div>
        </div>

        <div class="program-callout-box">
          <div class="program-callout-title">${ICONS.zap} Coach Revo's Coaching Philosophy</div>
          <p>"Fat loss is not about doing endless cardio and eating lettuce. It's about training like an athlete, lifting with intention, and eating enough protein to force your body to burn fat for fuel while sculpting clean, defined muscle lines."</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.chart} 12-16 Week Milestone Roadmap</h3>
          <div class="program-roadmap-timeline">
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 1 - 4</span>
              <strong>Adaptation &amp; Water Shed:</strong> Master movement patterns, drop 2–4 kg of bloat/fat, and establish unbreakable daily routine habits.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 5 - 8</span>
              <strong>Accelerated Fat Oxidation:</strong> Noticeable waist slimming, core tightening, increased muscular definition in shoulders and back.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 9 - 16</span>
              <strong>Peak Leanness &amp; Habit Mastery:</strong> Final body recomposition phase, metabolic stabilization, and permanent lifestyle graduation.
            </div>
          </div>
        </div>
      `
    },
    "muscle": {
      title: "Hypertrophy & Muscle Building (Mass & Aesthetics)",
      badge: "16 - 24 Weeks",
      tag: "Hypertrophy & Physique Architecture",
      subtitle: "Pack on 3–7+ kg of dense lean muscle tissue, develop classic aesthetic V-taper proportions, and master progressive overload mechanics.",
      image: "assets/images/program_muscle.jpg",
      stats: {
        duration: "16 - 24 Weeks",
        frequency: "4 - 5 Days Split",
        intensity: "RPE 8 - 10 (Proximity to Failure)",
        format: "In-Person, Hybrid & Online"
      },
      selectValue: "hypertrophy",
      content: `
        <div class="program-detail-block">
          <h3>${ICONS.target} Target Audience &amp; Who This Is For</h3>
          <p>Lifters looking to break through plateaued physiques, hardgainers struggling to add mass, or anyone wanting a sculpted, athletic build with capped shoulders, wide back, fuller chest, and powerful legs.</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.science} Sports-Science Methodology &amp; Core Pillars</h3>
          <ul>
            <li><strong>Mechanical Tension &amp; Volume Periodization:</strong> Systematic progressive overload tracking (12–18 direct sets per muscle group/week) structured into 4-week accumulating mesocycles.</li>
            <li><strong>Stretch-Mediated Hypertrophy:</strong> Prioritizing exercises that maximize mechanical tension at long muscle lengths with controlled 3-second eccentric (lowering) tempos.</li>
            <li><strong>Lean Bulking Caloric Surplus:</strong> Tailored hyper-caloric nutrition (+250 to 400 kcal/day) paired with 2.0g/kg protein distributed across 4 daily meals for 24/7 muscle protein synthesis (MPS).</li>
            <li><strong>Auto-Regulated Deload Weeks:</strong> Scheduled nervous system and joint recovery phases every 5th or 6th week to clear systemic fatigue and reset muscle sensitivity to training volume.</li>
          </ul>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.clipboard} What's Included in the Coaching</h3>
          <div class="program-perks-grid">
            <div class="program-perk-item">${ICONS.check} <div><strong>Periodized Training Logs:</strong> Custom spreadsheet &amp; mobile app with RPE weight target calculators.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Biomechanical Form Audits:</strong> In-depth video analysis of execution and muscle fiber alignment.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Lean Bulking Nutrition Strategy:</strong> Calorie scaling protocols to gain muscle without excess belly fat.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Evidence-Based Supplement Stack:</strong> Clinical dosages of Creatine, Whey, Electrolytes &amp; Micronutrients.</div></div>
          </div>
        </div>

        <div class="program-callout-box">
          <div class="program-callout-title">${ICONS.zap} Coach Revo's Coaching Philosophy</div>
          <p>"Muscle is expensive tissue — your body won't build it unless you give it a clear reason through progressive overload, and the raw materials through adequate protein and calories. We take the guesswork out of both."</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.chart} 16-24 Week Milestone Roadmap</h3>
          <div class="program-roadmap-timeline">
            <div class="roadmap-step">
              <span class="roadmap-badge">Month 1</span>
              <strong>Neuromuscular Priming:</strong> Perfect mind-muscle connection, establish baseline volume tolerance, and optimize caloric intake.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Months 2 - 4</span>
              <strong>Hypertrophy Acceleration:</strong> 15–25% strength surges on key lifts, visible arm/chest/back thickness, and fuller muscle bellies.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Months 5 - 6</span>
              <strong>Physique Refinement:</strong> Detail work on lagging muscle groups, symmetry balance, and consolidation of new dense lean mass.
            </div>
          </div>
        </div>
      `
    },
    "strength": {
      title: "Maximal Strength & Powerlifting (The Big 3 Total)",
      badge: "Custom 12-Wk Cycles",
      tag: "Strength, Biomechanics & Power",
      subtitle: "Maximize your 1-Rep Max across the Squat, Bench Press, and Deadlift with world-class periodization and lever-specific biomechanics.",
      image: "assets/images/program_strength.jpg",
      stats: {
        duration: "12-Week Cycles",
        frequency: "3 - 4 Days / Wk",
        intensity: "75% - 95% 1RM (High Neural)",
        format: "In-Person & Online"
      },
      selectValue: "strength",
      content: `
        <div class="program-detail-block">
          <h3>${ICONS.target} Target Audience &amp; Who This Is For</h3>
          <p>Intermediate to advanced lifters, strength enthusiasts, or athletes aiming to break through long-standing PR barriers, build immense tendon durability, and master the technical intricacies of heavy barbell movements.</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.science} Sports-Science Methodology &amp; Core Pillars</h3>
          <ul>
            <li><strong>Block Periodization Model:</strong> Accumulation (Volume &amp; Hypertrophy) &rarr; Transmutation (Specific Strength &amp; Technique) &rarr; Realization/Peaking (1RM Expressive Testing).</li>
            <li><strong>Individualized Lever Biomechanics:</strong> Stance, grip, and bar placement tailored specifically to your femur length, arm span, and hip anatomy for maximum mechanical leverage.</li>
            <li><strong>Rate of Force Development (RFD):</strong> Dynamic effort work and velocity optimization to eliminate common sticking points off the floor and off the chest.</li>
            <li><strong>Spinal &amp; Core Bracing Integrity:</strong> Intra-abdominal pressure mastery (Valsalva), heavy upper back work, and unilateral anti-rotation drills to keep the spine 100% resilient.</li>
          </ul>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.clipboard} What's Included in the Coaching</h3>
          <div class="program-perks-grid">
            <div class="program-perk-item">${ICONS.check} <div><strong>Calculated 1RM Percentage Sheets:</strong> Exact daily working weights based on RPE and percentages.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Frame-by-Frame Video Bar Path Analysis:</strong> Ensuring zero energy leak and vertical bar trajectories.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Peaking &amp; Mock Meet Protocol:</strong> Comprehensive warm-up timing and attempt selection strategy.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Joint Care &amp; Flossing Routines:</strong> Elbow, shoulder, and knee tendon health maintenance.</div></div>
          </div>
        </div>

        <div class="program-callout-box">
          <div class="program-callout-title">${ICONS.zap} Coach Revo's Coaching Philosophy</div>
          <p>"Strength is a skill before it is a physical attribute. When you clean up your bracing, bar path, and leg drive, weight that used to feel impossible suddenly flies off the floor."</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.chart} 12-Week Peaking Roadmap</h3>
          <div class="program-roadmap-timeline">
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 1 - 4</span>
              <strong>Accumulation Block:</strong> High-rep compound volume (70-75% 1RM) building muscular work capacity and technical consistency.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 5 - 8</span>
              <strong>Transmutation Block:</strong> Heavy doubles and triples (80-88% 1RM) targeting weak points with pause variations.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 9 - 12</span>
              <strong>Peaking &amp; Test Week:</strong> CNS realization, taper, and official PR testing with +15–40 kg expected total increase.
            </div>
          </div>
        </div>
      `
    },
    "online": {
      title: "1-on-1 Online Video & App Coaching",
      badge: "Flexible Monthly / Quarterly",
      tag: "Global Online Mentorship",
      subtitle: "Elite personal training and nutritional guidance from Coach Revo delivered anywhere in the world through custom app workouts and weekly video coaching.",
      image: "assets/images/program_online.jpg",
      stats: {
        duration: "Monthly / Quarterly",
        frequency: "Custom (2 - 6 Days/Wk)",
        intensity: "Custom to Fitness Level",
        format: "100% Online (iOS & Android App)"
      },
      selectValue: "online",
      content: `
        <div class="program-detail-block">
          <h3>${ICONS.target} Target Audience &amp; Who This Is For</h3>
          <p>Clients living outside Jakarta, expats, frequent business travelers, or self-motivated individuals who want elite coach guidance, custom programming, and 100% daily accountability at a fraction of offline private gym costs.</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.science} Sports-Science Methodology &amp; Core Pillars</h3>
          <ul>
            <li><strong>Custom Equipment Adaptation:</strong> Routines tailored to whatever you have access to — full commercial gym, boutique hotel gym, home garage rack, or travel resistance bands.</li>
            <li><strong>Weekly Video Deep-Dive Check-Ins:</strong> 30-minute structured Zoom calls to review nutrition logs, body composition, sleep data, and upcoming week periodization.</li>
            <li><strong>Asynchronous Voiceover Form Correction:</strong> Upload your workout videos in the app and receive voice and visual markup on your lifting technique within 24 hours.</li>
            <li><strong>Habit Loop Architecture:</strong> Focus on hydration, daily steps, circadian sleep rhythms, and stress management for complete lifestyle transformation.</li>
          </ul>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.clipboard} What's Included in the Coaching</h3>
          <div class="program-perks-grid">
            <div class="program-perk-item">${ICONS.check} <div><strong>Dedicated Mobile Coaching App:</strong> Exercise video demonstrations, logging, and timer.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Weekly 1-on-1 Video Strategy Call:</strong> Deep dive progress review and mental coaching.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Direct 24/7 WhatsApp Access:</strong> Ask nutrition or workout questions anytime from anywhere.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Travel &amp; Restaurant Survival Guides:</strong> Stay 100% on track even during business trips and vacations.</div></div>
          </div>
        </div>

        <div class="program-callout-box">
          <div class="program-callout-title">${ICONS.zap} Coach Revo's Coaching Philosophy</div>
          <p>"Online coaching isn't just sending you a PDF workout plan. It's a living partnership. You get my eyes on your form, my brain optimizing your nutrition, and relentless accountability right in your pocket every single day."</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.chart} What to Expect Month by Month</h3>
          <div class="program-roadmap-timeline">
            <div class="roadmap-step">
              <span class="roadmap-badge">Month 1</span>
              <strong>Calibration &amp; Screening:</strong> Complete movement screen, app setup, baseline strength audit, and nutrition baseline setting.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Month 2 - 3</span>
              <strong>Momentum &amp; Habit Lock:</strong> Consistent progression on all lifts, noticeable physique shifts, effortless meal tracking.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Ongoing</span>
              <strong>Total Autonomy &amp; Mastery:</strong> High-level periodization cycles, body recomposition, and lifelong fitness confidence.
            </div>
          </div>
        </div>
      `
    },
    "mobility": {
      title: "Functional Mobility, Posture & Joint Longevity",
      badge: "8 - 12 Weeks",
      tag: "Mobility, Posture & Injury Prevention",
      subtitle: "Eliminate chronic desk-work stiffness, fix forward-head posture and anterior pelvic tilt, and build bulletproof, pain-free joint durability.",
      image: "assets/images/hero_trainer.jpg",
      stats: {
        duration: "8 - 12 Weeks",
        frequency: "3 - 4 Sessions / Wk (30 min)",
        intensity: "Low - Moderate (Restorative)",
        format: "In-Person, Hybrid & Online"
      },
      selectValue: "mobility",
      content: `
        <div class="program-detail-block">
          <h3>${ICONS.target} Target Audience &amp; Who This Is For</h3>
          <p>Desk-bound corporate professionals, remote software developers, and lifters suffering from chronic neck tension, shoulder impingement, lower back aching, or tight, immobile hips that limit squat and deadlift depth.</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.science} Sports-Science Methodology &amp; Core Pillars</h3>
          <ul>
            <li><strong>Postural Restoration &amp; Muscle Balancing:</strong> Strengthening neglected phasic stabilizers (lower trapezius, serratus anterior, deep glute rotators) while lengthening shortened tonic muscles (hip flexors, anterior deltoids, suboccipitals).</li>
            <li><strong>Functional Range Conditioning (FRC) &amp; CARs:</strong> Expanding usable active joint range through Controlled Articular Rotations, building resilient cartilage and joint capsules.</li>
            <li><strong>The McGill Big 3 Spinal Stability Protocol:</strong> Enhancing isometric core endurance (Modified Curl-up, Side Plank, Bird-Dog) to spare the lumbar spine from compressive and shear stress.</li>
            <li><strong>Diaphragmatic Breathing &amp; Autonomic Down-Regulation:</strong> Resetting the central nervous system out of chronic fight-or-flight posture into restorative parasympathetic states.</li>
          </ul>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.clipboard} What's Included in the Coaching</h3>
          <div class="program-perks-grid">
            <div class="program-perk-item">${ICONS.check} <div><strong>Comprehensive Postural Assessment:</strong> Photographic and movement screening of spinal curvature and joint ranges.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>10-Min "Desk Worker Reset" Routine:</strong> Quick mobility drills you can perform right in the office.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Full Pain-Free Movement Library:</strong> Video guides for thoracic spine, hip opener, and ankle dorsiflexion.</div></div>
            <div class="program-perk-item">${ICONS.check} <div><strong>Ergonomic Workspace Audit:</strong> Personalized recommendations for desk height, monitor angle, and chair setup.</div></div>
          </div>
        </div>

        <div class="program-callout-box">
          <div class="program-callout-title">${ICONS.zap} Coach Revo's Coaching Philosophy</div>
          <p>"You can't build a strong house on a cracked foundation. Freeing up your tight hips and strengthening your postural stabilizers doesn't just eliminate daily aches — it unlocks massive strength gains on your heavy lifts."</p>
        </div>

        <div class="program-detail-block">
          <h3>${ICONS.chart} 8-12 Week Recovery Roadmap</h3>
          <div class="program-roadmap-timeline">
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 1 - 3</span>
              <strong>Decompression &amp; Pain Relief:</strong> Quick reduction in neck, upper back, and lower lumbar stiffness through daily CARs and gentle traction.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 4 - 7</span>
              <strong>Active Range Expansion:</strong> Noticeable improvement in hip mobility, deeper squat depth without butt-wink, and upright resting posture.
            </div>
            <div class="roadmap-step">
              <span class="roadmap-badge">Weeks 8 - 12</span>
              <strong>Full Kinetic Integration:</strong> Seamlessly load heavy barbell movements with pristine biomechanics and zero recurring joint pain.
            </div>
          </div>
        </div>
      `
    }
  };

  let currentLoadedProgramKey = 'fatloss';

  const openProgramModal = (programId) => {
    const program = programsData[programId];
    if (!program) return;

    currentLoadedProgramKey = programId;

    const modalTitle = document.getElementById('programModalTitle');
    const modalBadge = document.getElementById('programModalBadge');
    const modalTag = document.getElementById('programModalTag');
    const modalSubtitle = document.getElementById('programModalSubtitle');
    const modalImg = document.getElementById('programModalImage');
    const modalBody = document.getElementById('programModalBody');

    const statDuration = document.getElementById('progStatDuration');
    const statFrequency = document.getElementById('progStatFrequency');
    const statIntensity = document.getElementById('progStatIntensity');
    const statFormat = document.getElementById('progStatFormat');

    if (modalTitle) modalTitle.textContent = program.title;
    if (modalBadge) modalBadge.textContent = program.badge;
    if (modalTag) modalTag.textContent = program.tag;
    if (modalSubtitle) modalSubtitle.textContent = program.subtitle;
    if (modalImg) {
      modalImg.src = program.image;
      modalImg.alt = program.title;
    }
    if (statDuration) statDuration.textContent = program.stats.duration;
    if (statFrequency) statFrequency.textContent = program.stats.frequency;
    if (statIntensity) statIntensity.textContent = program.stats.intensity;
    if (statFormat) statFormat.textContent = program.stats.format;

    if (modalBody) modalBody.innerHTML = program.content;

    openModal('programModal');
  };

  window.openProgramModal = openProgramModal;
  window.openArticleModal = openArticleModal;

  // Program Cards Click Listeners (Direct + Event Delegation)
  document.querySelectorAll('.program-card[data-program-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const programId = card.getAttribute('data-program-id');
      openProgramModal(programId);
    });
  });

  // 9. Certificates Data & Modal Handler
  const certificatesData = {
    "nasm-cpt": {
      acronym: "NASM — CPT",
      title: "Certified Personal Trainer (Optima™ Model)",
      issuer: "National Academy of Sports Medicine",
      issuerLocation: "Chandler, Arizona, USA",
      code: "NASM-9842104",
      status: "Verified & Active",
      issueDate: "2019 • Renewed 2023",
      accreditingOrg: "NCCA Accredited",
      tag: "Core Personal Training",
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
      description: "The premier international benchmark in evidence-based exercise prescription, functional kinesiology, and structured kinetic chain periodization.",
      pillars: [
        "Optimum Performance Training (OPT™) 5-phase periodization (Stabilization Endurance &rarr; Strength Endurance &rarr; Hypertrophy &rarr; Max Strength &rarr; Power)",
        "Overhead Squat Assessment (OHSA) & kinetic chain checkpoint fault screening",
        "Targeted corrective exercise strategies for lumbar lordosis, valgus collapse, and upper crossed posture",
        "Aerobic heart rate training zone prescription (Zone 1 Recovery to Zone 3 Anaerobic Power)"
      ],
      clientImpact: "Ensures that your workout regimen is anatomically safe and scientifically matched to your structural levers, preventing overuse injuries and guaranteeing consistent progressive overload."
    },
    "nsca-cscs": {
      acronym: "NSCA — CSCS",
      title: "Certified Strength & Conditioning Specialist",
      issuer: "National Strength & Conditioning Association",
      issuerLocation: "Colorado Springs, Colorado, USA",
      code: "CSCS-2021-88410",
      status: "Verified & Active",
      issueDate: "2021 • Active Standing",
      accreditingOrg: "NCCA Accredited",
      tag: "Athlete Performance",
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`,
      description: "Gold standard athletic performance credential for strength coaches training high-performance athletes in collegiate, Olympic, and professional sports.",
      pillars: [
        "Advanced biomechanics of multi-joint resistance movements & force-velocity profiling",
        "Olympic weightlifting kinematics (Clean & Jerk, Snatch) and plyometric stretch-shortening cycles (SSC)",
        "Block and conjugate periodization models designed for simultaneous strength and hypertrophy accrual",
        "Energy system development (ESD), anaerobic threshold testing, and neuromuscular fatigue monitoring"
      ],
      clientImpact: "Transfers pro-level strength and conditioning protocols to everyday lifters, giving you explosive athletic power, resilient joints, and an undeniably muscular frame."
    },
    "precision-nutrition": {
      acronym: "PN1 — CNC",
      title: "Certified Nutrition & Metabolic Coach",
      issuer: "Precision Nutrition",
      issuerLocation: "Toronto, Canada",
      code: "PN1-MET-48192",
      status: "Verified & Active",
      issueDate: "2020 • Active Standing",
      accreditingOrg: "PN Global Institute",
      tag: "Clinical Nutrition & Habits",
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
      description: "Globally acclaimed behavioral nutrition methodology blending macronutrient biochemistry with deep cognitive habit transformation.",
      pillars: [
        "Calculated energy balance, metabolic rate adaptation, and structured carbohydrate refeed protocols",
        "Customized macronutrient partitioning calibrated for body composition goals and training volume",
        "Behavioral adherence psychology, environmental food management, and social dining strategies",
        "Hydration, electrolyte balance, and evidence-based micronutrient supplementation"
      ],
      clientImpact: "Eliminates restrictive yo-yo starvation diets forever by building sustainable eating habits that effortlessly fit into your career and social lifestyle."
    },
    "fms-level2": {
      acronym: "FMS Level 2",
      title: "Functional Movement Screen Specialist",
      issuer: "Functional Movement Systems",
      issuerLocation: "Chatham, Virginia, USA",
      code: "FMS-L2-60193",
      status: "Verified & Active",
      issueDate: "2022 • Active Standing",
      accreditingOrg: "FMS Global",
      tag: "Movement & Mobility",
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
      description: "Standardized movement diagnostic system designed to identify physical asymmetries, neuromuscular inhibitions, and mobility limitations.",
      pillars: [
        "7-step standardized movement test (Deep Squat, Hurdle Step, In-Line Lunge, Shoulder Mobility, Active Straight-Leg Raise, Trunk Stability, Rotary Stability)",
        "Corrective movement algorithms to restore bilateral symmetry before loading",
        "Myofascial release, joint capsule decompression, and neuromuscular reactivation drills",
        "Safe regression and progression pathways for pain-free compound lifting"
      ],
      clientImpact: "Unlocks stiff hips, tight thoracic spines, and aching knees so you can train with maximum intensity without waking up with debilitating aches."
    },
    "exos-xps": {
      acronym: "EXOS — XPS",
      title: "Athletic Performance Specialist",
      issuer: "EXOS Human Performance Institute",
      issuerLocation: "Phoenix, Arizona, USA",
      code: "EXOS-PS-10943",
      status: "Verified & Active",
      issueDate: "2022 • Active Standing",
      accreditingOrg: "EXOS Institute",
      tag: "Elite Conditioning",
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      description: "World-class athletic conditioning methodology utilized by NFL, military special operations, and top Olympic training facilities.",
      pillars: [
        "Linear acceleration, multi-directional COD (change of direction), and deceleration mechanics",
        "Work capacity engineering and targeted alactic, lactic, and aerobic conditioning intervals",
        "Pillar Strength™ development (integrated core, hip, and shoulder complex stabilization)",
        "Advanced recovery protocols, central nervous system regeneration, and sleep architecture optimization"
      ],
      clientImpact: "Builds a high-output cardiovascular engine and explosive agility, ensuring you never run out of gas during high-intensity sessions."
    },
    "aha-bls": {
      acronym: "AHA — BLS",
      title: "Basic Life Support / CPR & AED Provider",
      issuer: "American Heart Association",
      issuerLocation: "Dallas, Texas, USA",
      code: "AHA-BLS-772910",
      status: "Verified & Active",
      issueDate: "2023 • Valid Thru 2025",
      accreditingOrg: "American Heart Association",
      tag: "Safety Protocol",
      iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
      description: "Professional healthcare-grade life safety and medical emergency certification, ensuring unconditional safety during maximum-effort training.",
      pillars: [
        "Adult, child, and infant Cardiopulmonary Resuscitation (CPR) with high-efficiency chest compressions",
        "Immediate Automated External Defibrillator (AED) rapid operation and cardiac rhythm recovery",
        "Exercise-induced acute distress, heat exhaustion, and syncope emergency triage",
        "Facility emergency action planning (EAP) and pre-exercise health questionnaire (PAR-Q+) adherence"
      ],
      clientImpact: "Provides absolute peace of mind that every intense workout is executed in a medically sound, rigorously safe training environment."
    }
  };

  let currentLoadedCertKey = 'nasm-cpt';

  // SVG Certificate Vector Artwork Generator
  const generateCertSvg = (certKey, width = "100%", height = "auto") => {
    const cert = certificatesData[certKey] || certificatesData['nasm-cpt'];
    if (!cert) return '';

    const colors = {
      "nasm-cpt": { primary: "#d2ff00", secondary: "#a0cc00", bg: "#0d0f14", accent: "rgba(210,255,0,0.15)" },
      "nsca-cscs": { primary: "#00f0ff", secondary: "#0099ff", bg: "#0b1017", accent: "rgba(0,240,255,0.15)" },
      "precision-nutrition": { primary: "#ffaa00", secondary: "#ff6600", bg: "#130f0a", accent: "rgba(255,170,0,0.15)" },
      "fms-level2": { primary: "#39ff14", secondary: "#00cc44", bg: "#0a130b", accent: "rgba(57,255,20,0.15)" },
      "exos-xps": { primary: "#ff2a6d", secondary: "#ff007f", bg: "#140a10", accent: "rgba(255,42,109,0.15)" },
      "aha-bls": { primary: "#ff4d4d", secondary: "#cc0000", bg: "#140a0a", accent: "rgba(255,77,77,0.15)" }
    }[certKey] || { primary: "#d2ff00", secondary: "#a0cc00", bg: "#0d0f14", accent: "rgba(210,255,0,0.15)" };

    return `
      <svg class="cert-rendered-svg" viewBox="0 0 640 400" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradBg-${certKey}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1a1e27" />
            <stop offset="50%" stop-color="${colors.bg}" />
            <stop offset="100%" stop-color="#080a0d" />
          </linearGradient>
          <linearGradient id="gradGold-${certKey}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.primary}" />
            <stop offset="50%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="${colors.secondary}" />
          </linearGradient>
          <pattern id="guilloche-${certKey}" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="14" fill="none" stroke="${colors.primary}" stroke-width="0.35" stroke-opacity="0.1" />
            <path d="M0,15 Q7.5,0 15,15 T30,15" fill="none" stroke="${colors.primary}" stroke-width="0.3" stroke-opacity="0.08" />
          </pattern>
        </defs>

        <!-- Background with subtle security pattern -->
        <rect width="640" height="400" rx="10" fill="url(#gradBg-${certKey})" />
        <rect x="8" y="8" width="624" height="384" rx="6" fill="url(#guilloche-${certKey})" />

        <!-- Ornate Outer Border -->
        <rect x="14" y="14" width="612" height="372" rx="4" fill="none" stroke="${colors.primary}" stroke-width="1.2" stroke-opacity="0.6" />
        <rect x="20" y="20" width="600" height="360" rx="3" fill="none" stroke="${colors.primary}" stroke-width="0.6" stroke-dasharray="6,4" stroke-opacity="0.4" />

        <!-- Corner Rosettes -->
        <g stroke="${colors.primary}" fill="none" stroke-width="1.2">
          <path d="M 20 42 L 42 20 M 20 20 L 46 20 M 20 20 L 20 46" />
          <path d="M 620 42 L 598 20 M 620 20 L 594 20 M 620 20 L 620 46" />
          <path d="M 20 358 L 42 380 M 20 380 L 46 380 M 20 380 L 20 354" />
          <path d="M 620 358 L 598 380 M 620 380 L 594 380 M 620 380 L 620 354" />
        </g>

        <!-- Watermark Emblem in Background -->
        <circle cx="320" cy="200" r="100" fill="none" stroke="${colors.primary}" stroke-width="1" stroke-opacity="0.05" />
        <polygon points="320,125 345,175 400,180 360,220 372,275 320,245 268,275 280,220 240,180 295,175" fill="${colors.primary}" fill-opacity="0.03" />

        <!-- Header Authority -->
        <text x="320" y="52" font-family="'Outfit', 'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="${colors.primary}" letter-spacing="3.5" text-anchor="middle">
          ${cert.issuer.toUpperCase()}
        </text>
        <text x="320" y="68" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#8b949e" letter-spacing="1.5" text-anchor="middle">
          ${cert.issuerLocation.toUpperCase()} &bull; ${cert.accreditingOrg.toUpperCase()}
        </text>

        <line x1="160" y1="80" x2="480" y2="80" stroke="url(#gradGold-${certKey})" stroke-width="1" stroke-opacity="0.5" />

        <!-- Title Main -->
        <text x="320" y="108" font-family="'Outfit', sans-serif" font-size="17" font-weight="900" fill="#ffffff" letter-spacing="1.5" text-anchor="middle">
          CERTIFICATE OF ACCREDITATION
        </text>
        <text x="320" y="126" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#a0aec0" letter-spacing="1" text-anchor="middle">
          THIS OFFICIAL CREDENTIAL IS PROUDLY CONFERRED UPON
        </text>

        <!-- Recipient Name -->
        <text x="320" y="164" font-family="'Outfit', sans-serif" font-size="23" font-weight="900" fill="url(#gradGold-${certKey})" letter-spacing="1" text-anchor="middle">
          COACH REVO
        </text>
        <line x1="200" y1="175" x2="440" y2="175" stroke="${colors.primary}" stroke-width="1" stroke-opacity="0.3" />

        <!-- Credential Conferred -->
        <text x="320" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-size="9.5" fill="#cbd5e1" text-anchor="middle">
          for demonstrating mastery in the sports science curriculum &amp; practical clinical standards of
        </text>
        <text x="320" y="222" font-family="'Outfit', sans-serif" font-size="13.5" font-weight="800" fill="#ffffff" letter-spacing="0.5" text-anchor="middle">
          ${cert.title.toUpperCase()}
        </text>
        <text x="320" y="240" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" fill="${colors.primary}" font-weight="700" letter-spacing="1" text-anchor="middle">
          CREDENTIAL ID: ${cert.code} &bull; ${cert.status.toUpperCase()}
        </text>

        <!-- Bottom Authority & Official Seal -->
        <!-- Left Signature -->
        <g transform="translate(50, 280)">
          <path d="M 10 25 Q 35 5, 60 22 T 110 18 T 135 28" fill="none" stroke="${colors.primary}" stroke-width="1.3" stroke-opacity="0.8" />
          <line x1="0" y1="36" x2="140" y2="36" stroke="#4a5568" stroke-width="0.8" />
          <text x="70" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#a0aec0" text-anchor="middle">Board of Certification Director</text>
          <text x="70" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#718096" text-anchor="middle">Official Registrar Signature</text>
        </g>

        <!-- Center Gold Embossed Seal -->
        <g transform="translate(285, 260)">
          <!-- Ribbon Tails -->
          <polygon points="20,50 5,85 20,77 35,85 30,50" fill="${colors.primary}" fill-opacity="0.7" />
          <polygon points="40,50 32,85 45,77 58,85 50,50" fill="${colors.primary}" fill-opacity="0.5" />
          <!-- Seal Outer Star -->
          <circle cx="35" cy="30" r="28" fill="#12151c" stroke="${colors.primary}" stroke-width="1.8" />
          <circle cx="35" cy="30" r="23" fill="none" stroke="${colors.primary}" stroke-width="0.7" stroke-dasharray="3,2" />
          <circle cx="35" cy="30" r="19" fill="url(#gradBg-${certKey})" stroke="${colors.primary}" stroke-width="0.8" />
          <text x="35" y="27" font-family="'Outfit', sans-serif" font-size="6" font-weight="900" fill="${colors.primary}" text-anchor="middle" letter-spacing="1">OFFICIAL</text>
          <text x="35" y="36" font-family="'Outfit', sans-serif" font-size="5.5" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">ACCREDITED</text>
          <polygon points="35,16 36.5,19 40,19 37.5,21.5 38.5,25 35,23 31.5,25 32.5,21.5 30,19 33.5,19" fill="${colors.primary}" />
        </g>

        <!-- Right Security Stamp / Barcode -->
        <g transform="translate(460, 280)">
          <!-- Micro Barcode -->
          <rect x="15" y="8" width="2" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="20" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="26" y="8" width="1" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="30" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="36" y="8" width="2" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="41" y="8" width="4" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="48" y="8" width="2" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="53" y="8" width="1" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="57" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="63" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="69" y="8" width="2" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="74" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="80" y="8" width="1" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="84" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="90" y="8" width="2" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <rect x="95" y="8" width="3" height="22" fill="${colors.primary}" fill-opacity="0.7" />
          <line x1="0" y1="36" x2="120" y2="36" stroke="#4a5568" stroke-width="0.8" />
          <text x="60" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" fill="#a0aec0" text-anchor="middle">Digital Registry Hash</text>
          <text x="60" y="56" font-family="'Plus Jakarta Sans', sans-serif" font-size="6.5" fill="#718096" text-anchor="middle">VALIDATED &bull; ACTIVE</text>
        </g>
      </svg>
    `;
  };

  // Render certificate preview graphics on cards
  const renderCardPreviews = () => {
    document.querySelectorAll('.cert-card-preview[data-cert-render]').forEach(preview => {
      const certKey = preview.getAttribute('data-cert-render');
      if (certKey) {
        preview.innerHTML = generateCertSvg(certKey);
      }
    });
  };

  renderCardPreviews();

  const renderCertTabs = (activeCertId) => {
    const tabsContainer = document.getElementById('certModalTabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = Object.keys(certificatesData).map(key => {
      const c = certificatesData[key];
      const isActive = key === activeCertId ? 'active' : '';
      return `<button type="button" class="cert-modal-tab ${isActive}" data-cert-tab="${key}">${c.acronym}</button>`;
    }).join('');

    tabsContainer.querySelectorAll('[data-cert-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetCert = tab.getAttribute('data-cert-tab');
        openCertModal(targetCert);
      });
    });
  };

  const openCertModal = (certId) => {
    const cert = certificatesData[certId] || certificatesData['nasm-cpt'];
    if (!cert) return;
    currentLoadedCertKey = certId;

    const modalSeal = document.getElementById('certModalSeal');
    const modalTag = document.getElementById('certModalTag');
    const modalAcronym = document.getElementById('certModalAcronym');
    const modalStatus = document.getElementById('certModalStatus');
    const modalTitle = document.getElementById('certModalTitle');
    const modalIssuer = document.getElementById('certModalIssuer');
    const modalId = document.getElementById('certModalId');
    const modalDate = document.getElementById('certModalDate');
    const modalOrg = document.getElementById('certModalOrg');
    const modalBody = document.getElementById('certModalBody');
    const modalCanvas = document.getElementById('certModalCanvas');

    if (modalSeal) modalSeal.innerHTML = cert.iconSvg;
    if (modalTag) modalTag.textContent = cert.tag;
    if (modalAcronym) modalAcronym.textContent = cert.acronym;
    if (modalStatus) modalStatus.textContent = cert.status;
    if (modalTitle) modalTitle.textContent = cert.title;
    if (modalIssuer) modalIssuer.innerHTML = `${cert.issuer} &bull; ${cert.issuerLocation}`;
    if (modalId) modalId.textContent = cert.code;
    if (modalDate) modalDate.textContent = cert.issueDate;
    if (modalOrg) modalOrg.textContent = cert.accreditingOrg;
    if (modalCanvas) modalCanvas.innerHTML = generateCertSvg(certId);

    renderCertTabs(certId);

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="cert-modal-block">
          <h3>${ICONS.target} Overview &amp; Accreditation Scope</h3>
          <p>${cert.description}</p>
        </div>

        <div class="cert-modal-block">
          <h3>${ICONS.science} Tested Clinical Curriculum &amp; Core Disciplines</h3>
          <ul class="cert-curriculum-list">
            ${cert.pillars.map(p => `
              <li class="cert-curriculum-item">
                ${ICONS.check}
                <div>${p}</div>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="cert-impact-box">
          <div class="cert-impact-title">${ICONS.zap} Practical Application in Your Coaching Program</div>
          <p>"${cert.clientImpact}"</p>
        </div>
      `;
    }

    openModal('certModal');
  };

  window.openCertModal = openCertModal;

  // Direct Card Click Bindings for Certifications
  document.querySelectorAll('.cert-card[data-cert-id]').forEach(card => {
    card.addEventListener('click', () => {
      const certId = card.getAttribute('data-cert-id');
      openCertModal(certId);
    });
  });

  // Open Cert Triggers
  document.querySelectorAll('[data-open-cert]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certId = btn.getAttribute('data-open-cert') || 'nasm-cpt';
      openCertModal(certId);
    });
  });

  // Verify on Registry Button
  const verifyCertBtn = document.getElementById('verifyCertBtn');
  if (verifyCertBtn) {
    verifyCertBtn.addEventListener('click', () => {
      const currentCert = certificatesData[currentLoadedCertKey];
      if (currentCert) {
        window.showToast(`Official Registry: ${currentCert.code} (${currentCert.acronym}) is verified and in active standing.`);
      }
    });
  }

  // Cert Book Button -> Opens Consultation Form
  const certBookBtn = document.getElementById('certBookBtn');
  if (certBookBtn) {
    certBookBtn.addEventListener('click', () => {
      closeModal('certModal');
      openModal('bookingModal');
    });
  }

  // ============================================================================
  // 10. Transformation Case Studies Data & Modal Handler
  // ============================================================================
  const caseStudiesData = {
    "dimas": {
      name: "Dimas Pratama",
      age: 28,
      occupation: "Tech Lead / Software Engineer",
      program: "Fat Loss & Metabolic Conditioning",
      duration: "16 Weeks (4 Months)",
      badge: "Fat Loss & Recomp",
      category: "fatloss",
      beforeImg: "assets/images/trans_before_1789966355483.jpg",
      afterImg: "assets/images/client_dimas.jpg",
      quote: "Gue kerja 50+ jam seminggu di depan laptop dan metabolisme sempat ancur karena begadang. Dengan bimbingan Coach Revo, gue bisa turun 14 kg tanpa lemas dan lingkar pinggang berkurang drastis.",
      stats: {
        weightChange: "-14.2 kg (88 kg &rarr; 73.8 kg)",
        bodyFatChange: "-12.8% (26.5% &rarr; 13.7%)",
        waistChange: "-14 cm (96 cm &rarr; 82 cm)",
        strengthGain: "Squat 60kg &rarr; 125kg"
      },
      challenge: "Jadwal kerja padat dengan meeting malam, pola makan pesan antar tinggi sodium, dan postur forward head/anterior pelvic tilt akibat 8+ jam duduk setiap hari.",
      strategy: [
        "<strong>Non-Restrictive Macro Budgeting:</strong> Strategi 2.0g protein/kg dengan karbohidrat tinggi saat hari latihan dan buffer kalori saat weekend.",
        "<strong>Hypertrophy-Preserving Full Body Split:</strong> 3x seminggu latihan compound lift 45 menit fokus pada progressive overload.",
        "<strong>NEAT & Zone 2 Optimization:</strong> Target 8.500 langkah harian dan 20 menit incline walking pasca latihan beban.",
        "<strong>Postural Restoration:</strong> Latihan aktivasi glutes & rhomboids untuk memperbaiki postur bungkuk."
      ]
    },
    "maya": {
      name: "Maya Indira",
      age: 26,
      occupation: "Management Consultant",
      program: "Lean Athletic Physique & Glute Hypertrophy",
      duration: "12 Weeks (3 Months)",
      badge: "Body Recomposition",
      category: "fatloss",
      beforeImg: "assets/images/trans_maya_before.jpg",
      afterImg: "assets/images/trans_maya_after.jpg",
      quote: "Dulu gue takut angkat beban karena takut 'berotot kekar'. Ternyata latihan beban terstruktur malah bikin badan gue kencang, pinggang ramping, dan stamina kerja naik 2x lipat!",
      stats: {
        weightChange: "-6.5 kg (61 kg &rarr; 54.5 kg)",
        bodyFatChange: "-8.4% (27.2% &rarr; 18.8%)",
        waistChange: "-9 cm (78 cm &rarr; 69 cm)",
        strengthGain: "Hip Thrust 30kg &rarr; 95kg"
      },
      challenge: "Sering dinas luar kota, trauma diet ekstrem 800 kalori yang membuat metabolisme melambat, dan ketakutan mitos bahwa wanita tidak boleh angkat beban berat.",
      strategy: [
        "<strong>Reverse Dieting & Metabolic Reset:</strong> Menaikkan asupan kalori secara bertahap dari 1.100 kcal ke 1.750 kcal per hari untuk memulihkan resting metabolic rate.",
        "<strong>Lower Body & Glute Specialization:</strong> Fokus pada Hip Thrust, Romanian Deadlift (RDL), dan Bulgarian Split Squats dengan tempo terkontrol.",
        "<strong>Hotel Gym Workout Protocols:</strong> Panduan workout dumbbell & resistance band saat tugas luar kota."
      ]
    },
    "arif": {
      name: "Arif Kurniawan",
      age: 30,
      occupation: "Corporate Finance Manager",
      program: "Strength & Hypertrophy Periodization",
      duration: "20 Weeks (5 Months)",
      badge: "Muscle Building & Strength",
      category: "hypertrophy",
      beforeImg: "assets/images/trans_back_before.jpg",
      afterImg: "assets/images/trans_back_after.jpg",
      quote: "Gue udah nge-gym 2 tahun sendiri tapi badan stuck gitu-gitu aja. Setelah ikut coaching Revo, dalam 5 bulan otot punggung dan dada gue berkembang pesat dan teknik angkatan jauh lebih aman.",
      stats: {
        weightChange: "+7.8 kg Lean Mass (64 kg &rarr; 71.8 kg)",
        bodyFatChange: "Stabil di ~13% (Clean Bulk)",
        waistChange: "+1 cm (V-Taper Ratio Meningkat)",
        strengthGain: "Deadlift 80kg &rarr; 165kg"
      },
      challenge: "Tipe tubuh 'hardgainer' (metabolisme sangat cepat), kesulitan memenuhi target kalori harian, dan sering mengalami nyeri bahu saat bench press.",
      strategy: [
        "<strong>Calculated Caloric Surplus (+350 kcal):</strong> Nutrient-dense liquid meals & karbohidrat kompleks untuk mempermudah surplus kalori tanpa begah.",
        "<strong>Scapular Biomechanics Correction:</strong> Mengoreksi rotasi scapula pada bench press sehingga nyeri bahu hilang total.",
        "<strong>RPE-Based Volume Periodization:</strong> 4-day Upper/Lower split dengan tracking RPE 7-9 untuk memaksimalkan hipertrofi mekanis."
      ]
    }
  };

  const openCaseStudyModal = (clientKey) => {
    const data = caseStudiesData[clientKey] || caseStudiesData['dimas'];
    if (!data) return;

    const nameEl = document.getElementById('caseStudyName');
    const badgeEl = document.getElementById('caseStudyBadge');
    const metaEl = document.getElementById('caseStudyMeta');
    const beforeImg = document.getElementById('caseStudyBeforeImg');
    const afterImg = document.getElementById('caseStudyAfterImg');
    const quoteEl = document.getElementById('caseStudyQuote');
    const statsGrid = document.getElementById('caseStudyStatsGrid');
    const challengeEl = document.getElementById('caseStudyChallenge');
    const strategyEl = document.getElementById('caseStudyStrategy');

    if (nameEl) nameEl.textContent = data.name;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (metaEl) metaEl.innerHTML = `${data.occupation} &bull; ${data.age} Thn &bull; ${data.duration}`;
    if (beforeImg) beforeImg.src = data.beforeImg;
    if (afterImg) afterImg.src = data.afterImg;
    if (quoteEl) quoteEl.textContent = `"${data.quote}"`;

    if (statsGrid) {
      statsGrid.innerHTML = `
        <div class="stat-box-mini">
          <span class="stat-lbl">Perubahan Berat</span>
          <span class="stat-val-neon">${data.stats.weightChange}</span>
        </div>
        <div class="stat-box-mini">
          <span class="stat-lbl">Body Fat %</span>
          <span class="stat-val-neon">${data.stats.bodyFatChange}</span>
        </div>
        <div class="stat-box-mini">
          <span class="stat-lbl">Lingkar Pinggang</span>
          <span class="stat-val-neon">${data.stats.waistChange}</span>
        </div>
        <div class="stat-box-mini">
          <span class="stat-lbl">Kenaikan Kekuatan</span>
          <span class="stat-val-neon">${data.stats.strengthGain}</span>
        </div>
      `;
    }

    if (challengeEl) challengeEl.textContent = data.challenge;
    if (strategyEl) {
      strategyEl.innerHTML = data.strategy.map(item => `
        <li class="case-study-strat-item">
          ${ICONS.check}
          <div>${item}</div>
        </li>
      `).join('');
    }

    openModal('transformationModal');
  };

  window.openCaseStudyModal = openCaseStudyModal;

  // Direct bindings for case study buttons
  document.querySelectorAll('[data-open-casestudy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-casestudy');
      openCaseStudyModal(key);
    });
  });

  // Transformation Filters
  const filterBtns = document.querySelectorAll('.trans-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-trans-filter');
      
      const cards = document.querySelectorAll('.transformation-card-item');
      cards.forEach(card => {
        const cat = card.getAttribute('data-trans-category');
        if (filterValue === 'all' || cat === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============================================================================
  // 11. FAQ Accordion Handler
  // ============================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header') || item.querySelector('.faq-question');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });

  // Global Event Delegation fallback for cards
  document.addEventListener('click', (e) => {
    const certCard = e.target.closest('.cert-card[data-cert-id]');
    if (certCard) {
      const certId = certCard.getAttribute('data-cert-id');
      if (certId) {
        openCertModal(certId);
      }
      return;
    }

    const programCard = e.target.closest('.program-card[data-program-id]');
    if (programCard) {
      const programId = programCard.getAttribute('data-program-id');
      if (programId) {
        openProgramModal(programId);
      }
      return;
    }

    const blogCard = e.target.closest('.blog-card[data-article-id]');
    if (blogCard) {
      const articleId = blogCard.getAttribute('data-article-id');
      if (articleId) {
        openArticleModal(articleId);
      }
      return;
    }
  });

  // Close Program Button
  const closeProgramBtn = document.getElementById('closeProgramBtn');
  if (closeProgramBtn) {
    closeProgramBtn.addEventListener('click', () => {
      closeModal('programModal');
    });
  }

  // Close Case Study Dossier Button
  const closeCaseStudyBtn = document.getElementById('closeCaseStudyBtn');
  if (closeCaseStudyBtn) {
    closeCaseStudyBtn.addEventListener('click', () => {
      closeModal('transformationModal');
    });
  }

  // Case Study Consult CTA Button
  const caseStudyConsultBtn = document.getElementById('caseStudyConsultBtn');
  if (caseStudyConsultBtn) {
    caseStudyConsultBtn.addEventListener('click', () => {
      closeModal('transformationModal');
      openModal('bookingModal');
    });
  }

  // Enroll in Program Button -> Pre-selects in Consultation Form & Opens Booking Modal
  const programEnrollBtn = document.getElementById('programEnrollBtn');
  if (programEnrollBtn) {
    programEnrollBtn.addEventListener('click', () => {
      closeModal('programModal');
      const clientProgramSelect = document.getElementById('clientProgramType');
      if (clientProgramSelect && programsData[currentLoadedProgramKey]) {
        clientProgramSelect.value = programsData[currentLoadedProgramKey].selectValue;
      }
      openModal('bookingModal');
    });
  }

  // 9. Toast Notification Handler
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  window.showToast = (msg, duration = 3500) => {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // 10. Consultation Booking Form Submission
  const bookingForm = document.getElementById('consultationForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Request...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        closeModal('bookingModal');
        bookingForm.reset();
        window.showToast("Booking request received! Coach Revo will contact you within 24 hours.");
      }, 1200);
    });
  }

  // 10. Back To Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 11. Smooth Scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
