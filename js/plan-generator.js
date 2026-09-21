/**
 * REVO SPORTS SCIENCE LAB & INTERACTIVE CALCULATOR SUITE
 * 1. Metabolic & Macro Target Engine (Mifflin-St Jeor Formula)
 * 2. 1-Rep Max & Training Load Zone Matrix (Brzycki & Epley Formula)
 * 3. Sample Split Routine Generator
 */

// ============================================================================
// 1. Routine Generator Database
// ============================================================================
const workoutDatabase = {
  muscle: {
    2: [
      { day: "Mon", focus: "Full Body A (Chest, Back, Quads, Arms)" },
      { day: "Thu", focus: "Full Body B (Shoulders, Lats, Hamstrings, Core)" }
    ],
    3: [
      { day: "Mon", focus: "Push Day (Chest, Shoulders, Triceps)" },
      { day: "Wed", focus: "Pull Day (Back, Rear Delts, Biceps)" },
      { day: "Fri", focus: "Legs & Core (Quads, Hamstrings, Calves)" }
    ],
    4: [
      { day: "Mon", focus: "Upper Body (Push Focus - Chest & Delts)" },
      { day: "Tue", focus: "Lower Body (Strength - Squat & Core)" },
      { day: "Thu", focus: "Upper Body (Pull Focus - Back & Arms)" },
      { day: "Fri", focus: "Lower Body (Hypertrophy - Deadlift & Hams)" }
    ],
    5: [
      { day: "Mon", focus: "Chest & Triceps (Heavy Compounds)" },
      { day: "Tue", focus: "Back & Biceps (Lat Width & Thickness)" },
      { day: "Wed", focus: "Legs (Quad Dominant & Calves)" },
      { day: "Fri", focus: "Shoulders & Traps (Overhead Strength)" },
      { day: "Sat", focus: "Posterior Chain & Core (Hamstrings & Glutes)" }
    ]
  },
  fatloss: {
    2: [
      { day: "Tue", focus: "Full Body Density Circuits & Core" },
      { day: "Fri", focus: "Full Body Strength & HIIT Finisher" }
    ],
    3: [
      { day: "Mon", focus: "Upper Body Strength + 15m Zone 2 Cardio" },
      { day: "Wed", focus: "Lower Body Power + Core Metabolic Circuit" },
      { day: "Fri", focus: "Full Body Hybrid Conditioning & Kettlebells" }
    ],
    4: [
      { day: "Mon", focus: "Upper Body Hypertrophy & Sprints" },
      { day: "Tue", focus: "Lower Body Strength & Prowler Push" },
      { day: "Thu", focus: "Full Body Metabolic Density Circuit" },
      { day: "Sat", focus: "Active Aerobic Capacity & Core Stability" }
    ],
    5: [
      { day: "Mon", focus: "Upper Push & High Intensity Intervals" },
      { day: "Tue", focus: "Lower Quad Focus & Caloric Burn" },
      { day: "Wed", focus: "Upper Pull & Rotational Core" },
      { day: "Fri", focus: "Lower Hinge & Functional Conditioning" },
      { day: "Sat", focus: "Full Body Kettlebell & Battle Rope Complex" }
    ]
  },
  strength: {
    2: [
      { day: "Mon", focus: "Heavy Squat & Bench Press Primary" },
      { day: "Thu", focus: "Heavy Deadlift & Overhead Press Primary" }
    ],
    3: [
      { day: "Mon", focus: "Squat Volume + Bench Heavy + Accessories" },
      { day: "Wed", focus: "Deadlift Heavy + Overhead Press + Pull-ups" },
      { day: "Fri", focus: "Squat Heavy + Bench Volume + Posterior Chain" }
    ],
    4: [
      { day: "Mon", focus: "Primary Bench Press & Upper Accessories" },
      { day: "Tue", focus: "Primary Squat & Quad/Core Strength" },
      { day: "Thu", focus: "Secondary Bench / Incline & Tricep Power" },
      { day: "Fri", focus: "Primary Deadlift & Back Thickness" }
    ],
    5: [
      { day: "Mon", focus: "Heavy Squat Focus & Glute Accessories" },
      { day: "Tue", focus: "Heavy Bench Press & Upper Density" },
      { day: "Wed", focus: "Heavy Conventional / Sumo Deadlift" },
      { day: "Fri", focus: "Overhead Press & Explosive Power" },
      { day: "Sat", focus: "Weak Point Correction & Heavy Carries" }
    ]
  }
};

// ============================================================================
// 2. Training Plan Generator Handler
// ============================================================================
class TrainingPlanGenerator {
  constructor() {
    this.goalSelect = document.getElementById('planGoalSelect');
    this.levelSelect = document.getElementById('planLevelSelect');
    this.dayButtons = document.querySelectorAll('.day-pill-btn');
    this.generateBtn = document.getElementById('generatePlanBtn');
    this.planDaysContainer = document.getElementById('planDaysList');
    this.planTitle = document.getElementById('planBoxTitle');
    this.copyPlanBtn = document.getElementById('copyPlanBtn');

    this.selectedGoal = 'muscle';
    this.selectedLevel = 'intermediate';
    this.selectedDays = 4;

    this.init();
  }

  init() {
    if (!this.generateBtn) return;

    if (this.goalSelect) {
      this.goalSelect.addEventListener('change', (e) => {
        this.selectedGoal = e.target.value;
      });
    }

    if (this.levelSelect) {
      this.levelSelect.addEventListener('change', (e) => {
        this.selectedLevel = e.target.value;
      });
    }

    this.dayButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.dayButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDays = parseInt(btn.dataset.days, 10);
      });
    });

    this.generateBtn.addEventListener('click', () => {
      this.generateRoutine();
    });

    if (this.copyPlanBtn) {
      this.copyPlanBtn.addEventListener('click', () => {
        this.copyToClipboard();
      });
    }

    this.generateRoutine();
  }

  generateRoutine() {
    const goalCategory = workoutDatabase[this.selectedGoal] || workoutDatabase.muscle;
    const schedule = goalCategory[this.selectedDays] || goalCategory[4];

    const goalNames = {
      muscle: 'Muscle Building',
      fatloss: 'Fat Loss & Conditioning',
      strength: 'Maximal Strength'
    };

    if (this.planTitle) {
      this.planTitle.textContent = `${this.selectedDays}-Day ${goalNames[this.selectedGoal]} (${this.selectedLevel.toUpperCase()})`;
    }

    if (this.planDaysContainer) {
      this.planDaysContainer.innerHTML = '';
      
      schedule.forEach(item => {
        const row = document.createElement('div');
        row.className = 'plan-day-row';
        row.innerHTML = `
          <span class="plan-day-name">${item.day}</span>
          <span class="plan-day-focus">${item.focus}</span>
        `;
        this.planDaysContainer.appendChild(row);
      });
    }

    this.generateBtn.classList.add('pulse-anim');
    setTimeout(() => this.generateBtn.classList.remove('pulse-anim'), 800);
  }

  copyToClipboard() {
    const goalCategory = workoutDatabase[this.selectedGoal] || workoutDatabase.muscle;
    const schedule = goalCategory[this.selectedDays] || goalCategory[4];

    let text = `REVO PERSONAL TRAINER - SAMPLE TRAINING PLAN\n`;
    text += `Goal: ${this.selectedGoal.toUpperCase()} | Level: ${this.selectedLevel.toUpperCase()} | Frequency: ${this.selectedDays} Days/Week\n\n`;
    
    schedule.forEach(item => {
      text += `• ${item.day}: ${item.focus}\n`;
    });
    
    text += `\nCurated by Coach Revo — Ready to start? Book your free session at https://revotrainer.com`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) {
        window.showToast("Training plan copied to clipboard!");
      }
    });
  }
}

// ============================================================================
// 3. Metabolic & Macro Target Engine (Mifflin-St Jeor Science Formula)
// ============================================================================
class MetabolicMacroCalculator {
  constructor() {
    this.genderSelect = document.getElementById('calcGender');
    this.ageInput = document.getElementById('calcAge');
    this.weightInput = document.getElementById('calcWeight');
    this.heightInput = document.getElementById('calcHeight');
    this.activitySelect = document.getElementById('calcActivity');
    this.goalSelect = document.getElementById('calcGoal');
    this.calculateBtn = document.getElementById('calculateMacrosBtn');

    // Outputs
    this.outBmr = document.getElementById('outBmr');
    this.outTdee = document.getElementById('outTdee');
    this.outCalories = document.getElementById('outCalories');
    this.outProtein = document.getElementById('outProtein');
    this.outFats = document.getElementById('outFats');
    this.outCarbs = document.getElementById('outCarbs');
    this.outProteinPct = document.getElementById('outProteinPct');
    this.outFatsPct = document.getElementById('outFatsPct');
    this.outCarbsPct = document.getElementById('outCarbsPct');
    this.barProtein = document.getElementById('barProtein');
    this.barFats = document.getElementById('barFats');
    this.barCarbs = document.getElementById('barCarbs');
    this.exportMacroBtn = document.getElementById('exportMacroBtn');

    this.init();
  }

  init() {
    if (!this.calculateBtn) return;

    this.calculateBtn.addEventListener('click', () => {
      this.calculate();
    });

    if (this.exportMacroBtn) {
      this.exportMacroBtn.addEventListener('click', () => {
        this.exportToBooking();
      });
    }

    // Auto calculate initial default values
    this.calculate();
  }

  calculate() {
    const gender = this.genderSelect ? this.genderSelect.value : 'male';
    const age = parseFloat(this.ageInput ? this.ageInput.value : 28) || 28;
    const weight = parseFloat(this.weightInput ? this.weightInput.value : 75) || 75;
    const height = parseFloat(this.heightInput ? this.heightInput.value : 175) || 175;
    const activityMultiplier = parseFloat(this.activitySelect ? this.activitySelect.value : 1.55) || 1.55;
    const goal = this.goalSelect ? this.goalSelect.value : 'fatloss_moderate';

    // Mifflin-St Jeor BMR Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // TDEE
    const tdee = Math.round(bmr * activityMultiplier);

    // Goal Calorie Adjustments
    let targetCalories = tdee;
    if (goal === 'fatloss_aggressive') {
      targetCalories = Math.round(tdee * 0.78); // 22% deficit
    } else if (goal === 'fatloss_moderate') {
      targetCalories = Math.round(tdee * 0.85); // 15% deficit
    } else if (goal === 'maintenance') {
      targetCalories = tdee;
    } else if (goal === 'lean_bulk') {
      targetCalories = Math.round(tdee * 1.10); // 10% surplus
    } else if (goal === 'mass_gain') {
      targetCalories = Math.round(tdee * 1.18); // 18% surplus
    }

    // Macro Partitioning
    // Protein: 2.2g per kg bodyweight
    const proteinGrams = Math.round(weight * 2.2);
    const proteinCalories = proteinGrams * 4;

    // Fats: 25% of target calories
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: Remaining calories
    const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const carbGrams = Math.round(carbCalories / 4);

    // Percentages
    const proteinPct = Math.round((proteinCalories / targetCalories) * 100) || 30;
    const fatPct = Math.round((fatCalories / targetCalories) * 100) || 25;
    const carbPct = Math.max(0, 100 - proteinPct - fatPct);

    // Display
    if (this.outBmr) this.outBmr.textContent = `${Math.round(bmr).toLocaleString()} kcal`;
    if (this.outTdee) this.outTdee.textContent = `${tdee.toLocaleString()} kcal`;
    if (this.outCalories) this.outCalories.textContent = `${targetCalories.toLocaleString()}`;
    if (this.outProtein) this.outProtein.textContent = `${proteinGrams}g`;
    if (this.outFats) this.outFats.textContent = `${fatGrams}g`;
    if (this.outCarbs) this.outCarbs.textContent = `${carbGrams}g`;

    if (this.outProteinPct) this.outProteinPct.textContent = `${proteinPct}%`;
    if (this.outFatsPct) this.outFatsPct.textContent = `${fatPct}%`;
    if (this.outCarbsPct) this.outCarbsPct.textContent = `${carbPct}%`;

    if (this.barProtein) this.barProtein.style.width = `${proteinPct}%`;
    if (this.barFats) this.barFats.style.width = `${fatPct}%`;
    if (this.barCarbs) this.barCarbs.style.width = `${carbPct}%`;

    this.lastCalculation = {
      bmr: Math.round(bmr),
      tdee,
      calories: targetCalories,
      protein: proteinGrams,
      fats: fatGrams,
      carbs: carbGrams,
      weight,
      goal
    };
  }

  exportToBooking() {
    if (!this.lastCalculation) this.calculate();
    const c = this.lastCalculation;
    const notesInput = document.getElementById('clientNotes');
    if (notesInput) {
      notesInput.value = `[Sports Science Calculator Export] Target: ${c.calories} kcal/day | Protein: ${c.protein}g | Fats: ${c.fats}g | Carbs: ${c.carbs}g | TDEE: ${c.tdee} kcal (Weight: ${c.weight}kg, Goal: ${c.goal})`;
    }
    if (window.openModal) {
      window.openModal('bookingModal');
    }
  }
}

// ============================================================================
// 4. 1-Rep Max & Training Load Zone Calculator (Brzycki Formula)
// ============================================================================
class OneRepMaxCalculator {
  constructor() {
    this.liftSelect = document.getElementById('ormLift');
    this.weightInput = document.getElementById('ormWeight');
    this.repsInput = document.getElementById('ormReps');
    this.calculateBtn = document.getElementById('calculateOrmBtn');

    // Outputs
    this.out1rm = document.getElementById('out1rm');
    this.outTierBadge = document.getElementById('outTierBadge');
    this.out95 = document.getElementById('out95');
    this.out85 = document.getElementById('out85');
    this.out75 = document.getElementById('out75');
    this.out65 = document.getElementById('out65');

    this.init();
  }

  init() {
    if (!this.calculateBtn) return;

    this.calculateBtn.addEventListener('click', () => {
      this.calculate();
    });

    this.calculate();
  }

  calculate() {
    const weight = parseFloat(this.weightInput ? this.weightInput.value : 80) || 80;
    const reps = parseInt(this.repsInput ? this.repsInput.value : 5, 10) || 5;

    // Brzycki Formula: 1RM = Weight / (1.0278 - 0.0278 * Reps)
    let estimated1rm = weight;
    if (reps > 1) {
      estimated1rm = weight / (1.0278 - (0.0278 * Math.min(reps, 15)));
    }
    const final1rm = Math.round(estimated1rm);

    // Zones
    const load95 = Math.round(final1rm * 0.95);
    const load85 = Math.round(final1rm * 0.85);
    const load75 = Math.round(final1rm * 0.75);
    const load65 = Math.round(final1rm * 0.65);

    if (this.out1rm) this.out1rm.textContent = `${final1rm} kg`;
    if (this.out95) this.out95.textContent = `${load95} kg`;
    if (this.out85) this.out85.textContent = `${load85} kg`;
    if (this.out75) this.out75.textContent = `${load75} kg`;
    if (this.out65) this.out65.textContent = `${load65} kg`;

    // Classification Tier
    if (this.outTierBadge) {
      let tier = "Intermediate Lifter";
      if (final1rm < 70) tier = "Novice Strength Level";
      else if (final1rm >= 70 && final1rm < 110) tier = "Solid Intermediate Strength";
      else if (final1rm >= 110 && final1rm < 150) tier = "Advanced Power Athlete";
      else tier = "Elite High-Performance Level";
      this.outTierBadge.textContent = tier;
    }
  }
}

// ============================================================================
// 5. Interactive Lab Tab Switcher
// ============================================================================
const initLabTabs = () => {
  const tabs = document.querySelectorAll('.lab-tab-btn');
  const panels = document.querySelectorAll('.lab-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-lab-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
};

// Export Unified Initialization
window.initPlanGenerator = () => {
  new TrainingPlanGenerator();
  new MetabolicMacroCalculator();
  new OneRepMaxCalculator();
  initLabTabs();
};
