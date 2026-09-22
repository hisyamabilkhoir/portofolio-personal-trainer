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
        const selOpt = e.target.selectedOptions[0];
        const dispTitle = document.getElementById('dispRoutineGoal');
        if (dispTitle && selOpt) {
          dispTitle.textContent = selOpt.getAttribute('data-title') || selOpt.text;
        }
        this.generateRoutine();
      });
    }

    if (this.levelSelect) {
      this.levelSelect.addEventListener('change', (e) => {
        this.selectedLevel = e.target.value;
        const selOpt = e.target.selectedOptions[0];
        const dispTitle = document.getElementById('dispRoutineLevel');
        if (dispTitle && selOpt) {
          dispTitle.textContent = selOpt.getAttribute('data-title') || selOpt.text;
        }
        this.generateRoutine();
      });
    }

    this.dayButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.dayButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDays = parseInt(btn.dataset.days, 10);
        this.generateRoutine();
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
    setTimeout(() => this.generateBtn.classList.remove('pulse-anim'), 600);
  }

  copyToClipboard() {
    const goalCategory = workoutDatabase[this.selectedGoal] || workoutDatabase.muscle;
    const schedule = goalCategory[this.selectedDays] || goalCategory[4];

    let text = `REVO SPORTS SCIENCE LAB — CUSTOM SPLIT ROUTINE\n`;
    text += `Target: ${this.selectedGoal.toUpperCase()} | Level: ${this.selectedLevel.toUpperCase()} | Frekuensi: ${this.selectedDays} Hari/Minggu\n\n`;
    
    schedule.forEach(item => {
      text += `• ${item.day}: ${item.focus}\n`;
    });
    
    text += `\nCurated by Coach Revo — Science-Backed Performance.\nKonsultasi gratis: https://revotrainer.com`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) {
        window.showToast("Training split routine berhasil disalin ke clipboard!");
      }
    }).catch(() => {
      if (window.showToast) {
        window.showToast("Routine tersalin!");
      }
    });
  }
}

// ============================================================================
// 3. Metabolic & Macro Target Engine (Mifflin-St Jeor Science Formula)
// ============================================================================
class MetabolicMacroCalculator {
  constructor() {
    this.genderInput = document.getElementById('macroGender');
    this.btnGenderMale = document.getElementById('btnGenderMale');
    this.btnGenderFemale = document.getElementById('btnGenderFemale');

    this.ageInput = document.getElementById('macroAge');
    this.weightInput = document.getElementById('macroWeight');
    this.heightInput = document.getElementById('macroHeight');

    this.dispAge = document.getElementById('dispAge');
    this.dispWeight = document.getElementById('dispWeight');
    this.dispHeight = document.getElementById('dispHeight');

    this.activitySelect = document.getElementById('macroActivity');
    this.goalSelect = document.getElementById('macroGoal');

    this.dispActivityTitle = document.getElementById('dispActivityTitle');
    this.dispActivitySub = document.getElementById('dispActivitySub');
    this.dispGoalTitle = document.getElementById('dispGoalTitle');
    this.dispGoalSub = document.getElementById('dispGoalSub');

    this.calculateBtn = document.getElementById('calculateMacroBtn');
    this.resetBtn = document.getElementById('resetMacroBtn');

    // Outputs
    this.outBmr = document.getElementById('macroBmr');
    this.outTdee = document.getElementById('macroTdee');
    this.outCalories = document.getElementById('macroCalories');
    this.outCalDesc = document.getElementById('macroCalDesc');
    this.outDonutVal = document.getElementById('macroDonutVal');
    this.outDonutRing = document.getElementById('macroDonutRing');
    this.outTargetName = document.getElementById('dispTargetName');
    this.outTotalLabel = document.getElementById('macroTotalLabel');

    this.outProteinVal = document.getElementById('macroProteinVal');
    this.outProteinPct = document.getElementById('macroProteinPct');
    this.barProtein = document.getElementById('macroProteinBar');

    this.outCarbsVal = document.getElementById('macroCarbsVal');
    this.outCarbsPct = document.getElementById('macroCarbsPct');
    this.barCarbs = document.getElementById('macroCarbsBar');

    this.outFatsVal = document.getElementById('macroFatsVal');
    this.outFatsPct = document.getElementById('macroFatsPct');
    this.barFats = document.getElementById('macroFatsBar');

    this.outWater = document.getElementById('macroWater');

    this.init();
  }

  init() {
    if (!this.calculateBtn) return;

    // 1. Gender Toggles
    if (this.btnGenderMale && this.btnGenderFemale) {
      this.btnGenderMale.addEventListener('click', () => {
        this.btnGenderMale.classList.add('active');
        this.btnGenderFemale.classList.remove('active');
        if (this.genderInput) this.genderInput.value = 'male';
        this.calculate();
      });

      this.btnGenderFemale.addEventListener('click', () => {
        this.btnGenderFemale.classList.add('active');
        this.btnGenderMale.classList.remove('active');
        if (this.genderInput) this.genderInput.value = 'female';
        this.calculate();
      });
    }

    // 2. Stepper Buttons
    document.querySelectorAll('.stepper-btn[data-stepper="age"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.dataset.delta, 10) || 0;
        let val = (parseInt(this.ageInput.value, 10) || 28) + delta;
        val = Math.max(15, Math.min(85, val));
        this.ageInput.value = val;
        if (this.dispAge) this.dispAge.textContent = val;
        this.calculate();
      });
    });

    document.querySelectorAll('.stepper-btn[data-stepper="weight"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.dataset.delta) || 0;
        let val = (parseFloat(this.weightInput.value) || 75) + delta;
        val = Math.max(35, Math.min(220, Math.round(val)));
        this.weightInput.value = val;
        if (this.dispWeight) this.dispWeight.textContent = val;
        this.calculate();
      });
    });

    document.querySelectorAll('.stepper-btn[data-stepper="height"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.dataset.delta) || 0;
        let val = (parseFloat(this.heightInput.value) || 175) + delta;
        val = Math.max(120, Math.min(230, Math.round(val)));
        this.heightInput.value = val;
        if (this.dispHeight) this.dispHeight.textContent = val;
        this.calculate();
      });
    });

    // 3. Dropdown Sync
    if (this.activitySelect) {
      this.activitySelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt) {
          if (this.dispActivityTitle) this.dispActivityTitle.textContent = opt.getAttribute('data-title') || opt.text;
          if (this.dispActivitySub) this.dispActivitySub.textContent = opt.getAttribute('data-sub') || '';
        }
        this.calculate();
      });
    }

    if (this.goalSelect) {
      this.goalSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt) {
          if (this.dispGoalTitle) this.dispGoalTitle.textContent = opt.getAttribute('data-title') || opt.text;
          if (this.dispGoalSub) this.dispGoalSub.textContent = opt.getAttribute('data-sub') || '';
        }
        this.calculate();
      });
    }

    // 4. Calculate Button
    this.calculateBtn.addEventListener('click', () => {
      this.calculate();
      this.calculateBtn.classList.add('pulse-anim');
      setTimeout(() => this.calculateBtn.classList.remove('pulse-anim'), 600);
    });

    // 5. Reset Form
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.resetForm();
      });
    }

    // Initial Calculation
    this.calculate();
  }

  resetForm() {
    if (this.genderInput) this.genderInput.value = 'male';
    if (this.btnGenderMale) this.btnGenderMale.classList.add('active');
    if (this.btnGenderFemale) this.btnGenderFemale.classList.remove('active');

    if (this.ageInput) this.ageInput.value = '28';
    if (this.dispAge) this.dispAge.textContent = '28';

    if (this.weightInput) this.weightInput.value = '75';
    if (this.dispWeight) this.dispWeight.textContent = '75';

    if (this.heightInput) this.heightInput.value = '175';
    if (this.dispHeight) this.dispHeight.textContent = '175';

    if (this.activitySelect) {
      this.activitySelect.value = 'moderate';
      if (this.dispActivityTitle) this.dispActivityTitle.textContent = 'Moderately Active';
      if (this.dispActivitySub) this.dispActivitySub.textContent = 'Latihan 3–5 hari/minggu';
    }

    if (this.goalSelect) {
      this.goalSelect.value = 'cut';
      if (this.dispGoalTitle) this.dispGoalTitle.textContent = 'Defisit Kalori';
      if (this.dispGoalSub) this.dispGoalSub.textContent = 'Fat Loss & Shredding (−20%)';
    }

    this.calculate();
    if (window.showToast) {
      window.showToast("Form kalkulator di-reset ke nilai standar.");
    }
  }

  calculate() {
    const gender = this.genderInput ? this.genderInput.value : 'male';
    const age = parseFloat(this.ageInput ? this.ageInput.value : 28) || 28;
    const weight = parseFloat(this.weightInput ? this.weightInput.value : 75) || 75;
    const height = parseFloat(this.heightInput ? this.heightInput.value : 175) || 175;
    const activityKey = this.activitySelect ? this.activitySelect.value : 'moderate';
    const goal = this.goalSelect ? this.goalSelect.value : 'cut';

    // Activity multiplier
    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725
    };
    const multiplier = activityMap[activityKey] || 1.55;

    // 1. Mifflin-St Jeor BMR Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    const finalBmr = Math.round(bmr);

    // 2. TDEE
    const tdee = Math.round(finalBmr * multiplier);

    // 3. Goal Adjustment & Text
    let targetCalories = tdee;
    let targetName = "Fat Loss";
    let desc = "Asupan energi harian yang disesuaikan untuk mencapai target defisit tanpa mengorbankan massa otot.";

    if (goal === 'cut') {
      targetCalories = Math.round(tdee * 0.80); // 20% deficit
      targetName = "Fat Loss";
      desc = "Asupan energi harian yang disesuaikan untuk mencapai target defisit tanpa mengorbankan massa otot.";
    } else if (goal === 'maintenance') {
      targetCalories = tdee;
      targetName = "Body Recomposition";
      desc = "Keseimbangan energi harian untuk mempertahankan berat badan sambil memadatkan komposisi massa otot.";
    } else if (goal === 'bulk') {
      targetCalories = Math.round(tdee * 1.12); // 12% surplus
      targetName = "Clean Muscle Hypertrophy";
      desc = "Surplus kalori terukur untuk memicu sintesis protein myofibrilar maksimal tanpa penumpukan lemak berlebih.";
    }

    // 4. Macro Partitioning
    // Protein: 2.2g per kg bodyweight
    const proteinGrams = Math.round(weight * 2.2);
    const proteinKcal = proteinGrams * 4;

    // Fats: 27% of target calories (hormone optimization)
    const fatKcal = Math.round(targetCalories * 0.27);
    const fatGrams = Math.round(fatKcal / 9);

    // Carbs: Remaining calories
    const carbKcal = Math.max(0, targetCalories - proteinKcal - fatKcal);
    const carbGrams = Math.round(carbKcal / 4);

    // Pct
    const proteinPct = Math.round((proteinKcal / targetCalories) * 100);
    const fatPct = Math.round((fatKcal / targetCalories) * 100);
    const carbPct = Math.max(0, 100 - proteinPct - fatPct);

    // 5. Water Hydration: 35-42ml / kg
    const waterMin = (weight * 0.035).toFixed(1);
    const waterMax = (weight * 0.043).toFixed(1);

    // 6. Update DOM Outputs
    if (this.outBmr) this.outBmr.textContent = `${finalBmr.toLocaleString()} kcal`;
    if (this.outTdee) this.outTdee.textContent = `${tdee.toLocaleString()} kcal`;
    if (this.outCalories) this.outCalories.textContent = `${targetCalories.toLocaleString()}`;
    if (this.outDonutVal) this.outDonutVal.textContent = `${targetCalories.toLocaleString()}`;
    if (this.outCalDesc) this.outCalDesc.textContent = desc;
    if (this.outTargetName) this.outTargetName.textContent = targetName;
    if (this.outTotalLabel) this.outTotalLabel.textContent = `Total: ${targetCalories.toLocaleString()} kcal`;

    if (this.outProteinVal) this.outProteinVal.textContent = `${proteinGrams} g (${proteinKcal} kcal)`;
    if (this.outProteinPct) this.outProteinPct.textContent = `${proteinPct}%`;
    if (this.barProtein) this.barProtein.style.width = `${proteinPct}%`;

    if (this.outCarbsVal) this.outCarbsVal.textContent = `${carbGrams} g (${carbKcal} kcal)`;
    if (this.outCarbsPct) this.outCarbsPct.textContent = `${carbPct}%`;
    if (this.barCarbs) this.barCarbs.style.width = `${carbPct}%`;

    if (this.outFatsVal) this.outFatsVal.textContent = `${fatGrams} g (${fatKcal} kcal)`;
    if (this.outFatsPct) this.outFatsPct.textContent = `${fatPct}%`;
    if (this.barFats) this.barFats.style.width = `${fatPct}%`;

    if (this.outWater) this.outWater.textContent = `${waterMin} – ${waterMax} Liter / hari`;

    // 7. Update SVG Donut Gauge Arc
    if (this.outDonutRing) {
      const circumference = 276.46; // 2 * pi * 44
      const progress = Math.min(1.0, targetCalories / 2800);
      const offset = circumference * (1 - (progress * 0.8));
      this.outDonutRing.style.strokeDashoffset = offset;
    }
  }
}

// ============================================================================
// 4. 1-Rep Max & Training Load Zone Calculator (Brzycki Formula)
// ============================================================================
class OneRepMaxCalculator {
  constructor() {
    this.liftSelect = document.getElementById('ormExercise');
    this.dispExercise = document.getElementById('dispOrmExercise');
    this.weightInput = document.getElementById('ormWeight');
    this.repsInput = document.getElementById('ormReps');
    this.dispWeight = document.getElementById('dispOrmWeight');
    this.dispReps = document.getElementById('dispOrmReps');
    this.calculateBtn = document.getElementById('calculateOrmBtn');

    // Outputs
    this.out1rm = document.getElementById('ormEstimatedMax');
    this.outDonutKg = document.getElementById('ormDonutKg');
    this.outTierBadge = document.getElementById('ormTierBadge');
    this.out95 = document.getElementById('ormLoad95');
    this.out85 = document.getElementById('ormLoad85');
    this.out75 = document.getElementById('ormLoad75');
    this.out65 = document.getElementById('ormLoad65');

    this.init();
  }

  init() {
    if (!this.calculateBtn) return;

    if (this.liftSelect) {
      this.liftSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        if (opt && this.dispExercise) {
          this.dispExercise.textContent = opt.getAttribute('data-title') || opt.text;
        }
        this.calculate();
      });
    }

    document.querySelectorAll('.stepper-btn[data-stepper="ormWeight"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.dataset.delta) || 0;
        let val = (parseFloat(this.weightInput.value) || 80) + delta;
        val = Math.max(10, Math.min(400, val));
        this.weightInput.value = val;
        if (this.dispWeight) this.dispWeight.textContent = val;
        this.calculate();
      });
    });

    document.querySelectorAll('.stepper-btn[data-stepper="ormReps"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.dataset.delta, 10) || 0;
        let val = (parseInt(this.repsInput.value, 10) || 6) + delta;
        val = Math.max(1, Math.min(15, val));
        this.repsInput.value = val;
        if (this.dispReps) this.dispReps.textContent = val;
        this.calculate();
      });
    });

    this.calculateBtn.addEventListener('click', () => {
      this.calculate();
      this.calculateBtn.classList.add('pulse-anim');
      setTimeout(() => this.calculateBtn.classList.remove('pulse-anim'), 600);
    });

    this.calculate();
  }

  calculate() {
    const weight = parseFloat(this.weightInput ? this.weightInput.value : 80) || 80;
    const reps = parseInt(this.repsInput ? this.repsInput.value : 6, 10) || 6;

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

    if (this.out1rm) this.out1rm.textContent = `${final1rm}`;
    if (this.outDonutKg) this.outDonutKg.textContent = `${final1rm} kg`;
    if (this.out95) this.out95.textContent = `${load95} kg`;
    if (this.out85) this.out85.textContent = `${load85} kg`;
    if (this.out75) this.out75.textContent = `${load75} kg`;
    if (this.out65) this.out65.textContent = `${load65} kg`;

    // Classification Tier
    if (this.outTierBadge) {
      let tier = "Solid Intermediate Strength";
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
  const tabs = document.querySelectorAll('.lab-tab-card');
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
