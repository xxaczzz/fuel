/* =============================================
   FUEL — Smart Nutrition Journal
   Photo-based food tracking, smart meal plans,
   and auto-adjusting calorie targets.
============================================= */

// ============== STATE ==============
const STATE = {
  profile: null,         // { sex, age, height, startWeight, goal, activity, apiKey, ... }
  log: {},               // { 'YYYY-MM-DD': { meals: [...], weight: 0, steps: 0, trained: false, notes: '' } }
  customFoods: [],       // user-saved foods: same shape as FOODS, macros per 100g, id prefixed 'custom-'
  view: 'today',
  currentDate: todayKey(),
  lastBackup: 0,
  storagePersistent: false,
  daysSinceBackup: 0,
  // Targets recalibrate weekly:
  lastCalibration: 0,    // timestamp of last auto-target adjustment
  customTarget: null     // override if user manually sets target
};

function todayKey(date) {
  const d = date || new Date();
  return d.toISOString().slice(0, 10);
}

function dayKey(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + (offsetDays || 0));
  return todayKey(d);
}

// ============== STORAGE ==============
function save() {
  try {
    localStorage.setItem('fuel-data', JSON.stringify({
      profile: STATE.profile,
      log: STATE.log,
      customFoods: STATE.customFoods,
      lastBackup: STATE.lastBackup,
      lastCalibration: STATE.lastCalibration,
      customTarget: STATE.customTarget
    }));
  } catch(e) {
    console.error(e);
    if (e.name === 'QuotaExceededError') {
      toast('Storage is full. Make a backup and clear old logs.', 'danger');
    }
  }
}

function load() {
  try {
    const raw = localStorage.getItem('fuel-data');
    if (raw) {
      const d = JSON.parse(raw);
      STATE.profile = d.profile || null;
      STATE.log = d.log || {};
      STATE.customFoods = Array.isArray(d.customFoods) ? d.customFoods : [];
      STATE.lastBackup = d.lastBackup || 0;
      STATE.lastCalibration = d.lastCalibration || 0;
      STATE.customTarget = d.customTarget || null;
    }
  } catch(e) { console.error(e); }
}

async function requestPersistentStorage() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (isPersisted) { STATE.storagePersistent = true; return true; }
      const granted = await navigator.storage.persist();
      STATE.storagePersistent = granted;
      return granted;
    } catch(e) { return false; }
  }
  return false;
}

// ============== HELPERS ==============
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => [...(el || document).querySelectorAll(s)];

function render(html) {
  const s = document.getElementById('screen');
  s.innerHTML = html;
  return s;
}

function showNav(show) {
  document.getElementById('nav').classList.toggle('hidden', !show);
}

function toast(msg, kind) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (kind === 'danger' ? ' danger' : '');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2400);
}

function openModal(html) {
  const m = document.getElementById('modal');
  document.getElementById('modal-content').innerHTML = html;
  m.classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// Close modal on backdrop click
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// ---- Custom foods: resolve catalog + user-saved foods uniformly ----
function allFoods() {
  return FOODS.concat(STATE.customFoods || []);
}
function foodById(id) {
  if (FOOD_BY_ID[id]) return FOOD_BY_ID[id];
  return (STATE.customFoods || []).find(f => f.id === id) || null;
}

function fmtDate(key) {
  const d = new Date(key);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ============== NUTRITION MATH ==============
// Mifflin-St Jeor BMR formula — most accurate for general population
function calcBMR(profile) {
  const w = profile.currentWeight || profile.startWeight;
  const h = profile.height;
  const a = profile.age;
  if (profile.sex === 'male') {
    return 10 * w + 6.25 * h - 5 * a + 5;
  }
  return 10 * w + 6.25 * h - 5 * a - 161;
}

// Activity multipliers (sedentary -> very active)
const ACTIVITY_MULT = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9
};

function calcTDEE(profile) {
  const bmr = calcBMR(profile);
  return Math.round(bmr * (ACTIVITY_MULT[profile.activity] || 1.55));
}

// Daily calorie target based on goal
function calcCalorieTarget(profile) {
  if (STATE.customTarget) return STATE.customTarget;
  const tdee = calcTDEE(profile);
  if (profile.goal === 'cut') return Math.round(tdee * 0.8); // 20% deficit
  if (profile.goal === 'bulk') return Math.round(tdee * 1.1); // 10% surplus
  return tdee; // maintain
}

// Macro splits per goal: { proteinPerKg, fatPctOfKcal, restAsCarbs }
function calcMacroTargets(profile) {
  const w = profile.currentWeight || profile.startWeight;
  const target = calcCalorieTarget(profile);

  let proteinG, fatG;
  if (profile.goal === 'cut') {
    proteinG = Math.round(w * 2.2);  // higher protein in deficit to spare muscle
    fatG = Math.round(target * 0.25 / 9);
  } else if (profile.goal === 'bulk') {
    proteinG = Math.round(w * 1.8);
    fatG = Math.round(target * 0.25 / 9);
  } else {
    proteinG = Math.round(w * 1.6);
    fatG = Math.round(target * 0.3 / 9);
  }

  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = Math.max(0, target - proteinKcal - fatKcal);
  const carbsG = Math.round(carbKcal / 4);

  return { kcal: target, p: proteinG, c: carbsG, f: fatG };
}

// Get day's totals
function dayTotals(date) {
  const day = STATE.log[date];
  if (!day || !day.meals) return { kcal: 0, p: 0, c: 0, f: 0 };
  return day.meals.reduce((sum, m) => ({
    kcal: sum.kcal + m.kcal,
    p: Math.round((sum.p + m.p) * 10) / 10,
    c: Math.round((sum.c + m.c) * 10) / 10,
    f: Math.round((sum.f + m.f) * 10) / 10
  }), { kcal: 0, p: 0, c: 0, f: 0 });
}

// Adjustment: training day grants extra ~250 kcal (depending on goal)
function adjustedTarget(date) {
  const day = STATE.log[date] || {};
  const base = calcMacroTargets(STATE.profile);
  if (day.trained) {
    const bonus = STATE.profile.goal === 'cut' ? 150 : 250;
    return { ...base, kcal: base.kcal + bonus };
  }
  return base;
}

// ============== AUTO-CALIBRATION ==============
// Run weekly: compare actual weight trend vs intended trajectory.
// If deviation > 0.3% body weight per week, nudge calorie target by ±100 kcal.
function maybeRecalibrate() {
  if (!STATE.profile || STATE.customTarget) return;

  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  if (now - STATE.lastCalibration < week) return;

  const weights = [];
  for (let i = 0; i < 14; i++) {
    const k = dayKey(-i);
    if (STATE.log[k]?.weight) weights.push({ date: k, w: STATE.log[k].weight, daysAgo: i });
  }
  if (weights.length < 4) return; // need at least 4 weigh-ins

  // Linear regression on weight over last 14 days -> kg/week trend
  const xs = weights.map(w => -w.daysAgo);
  const ys = weights.map(w => w.w);
  const xMean = xs.reduce((a,b) => a+b, 0) / xs.length;
  const yMean = ys.reduce((a,b) => a+b, 0) / ys.length;
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  if (den === 0) return;
  const slope = num / den; // kg per day
  const kgPerWeek = slope * 7;

  // Update current weight
  STATE.profile.currentWeight = ys[0]; // most recent

  // Expected trend per goal (kg/week):
  // cut -> -0.5, bulk -> +0.3, maintain -> 0
  const goal = STATE.profile.goal;
  const expected = goal === 'cut' ? -0.5 : goal === 'bulk' ? 0.3 : 0;
  const dev = kgPerWeek - expected;
  // 1 kg ≈ 7700 kcal. So adjust target by -1100 kcal/day to lose extra 1 kg/week.
  // But we cap nudges at ±100 kcal/recalibration to be safe.

  let nudge = 0;
  if (Math.abs(dev) > 0.15) { // significant deviation
    if (goal === 'cut') {
      // losing too slow -> reduce calories; losing too fast -> increase
      nudge = dev > 0 ? -100 : 100;
    } else if (goal === 'bulk') {
      nudge = dev < 0 ? 100 : -100;
    } else {
      nudge = dev > 0 ? -100 : 100; // maintain — push back to zero
    }

    const tdee = calcTDEE(STATE.profile);
    const currentTarget = calcCalorieTarget(STATE.profile);
    const newTarget = currentTarget + nudge;

    // safety bounds: never below BMR, never absurdly high
    const bmr = calcBMR(STATE.profile);
    const bounded = Math.max(Math.round(bmr * 1.05), Math.min(newTarget, Math.round(tdee * 1.3)));

    STATE.customTarget = bounded;
    STATE.lastCalibration = now;
    save();

    setTimeout(() => {
      toast(`Daily target adjusted: ${nudge > 0 ? '+' : ''}${nudge} kcal`);
    }, 800);
  } else {
    STATE.lastCalibration = now;
    save();
  }
}

// ============== ONBOARDING ==============
let onboardData = {
  step: 0,
  sex: null,
  age: null,
  height: null,
  weight: null,
  goal: null,
  activity: null
};

function onboardSteps() {
  return [
    { type: 'welcome' },
    { type: 'choice', field: 'sex', title: 'Are you...', sub: 'We use this to calculate your metabolic rate.',
      options: [
        { id: 'male', label: 'Male', icon: '♂' },
        { id: 'female', label: 'Female', icon: '♀' }
      ]
    },
    { type: 'number', field: 'age', title: 'How old are you?', sub: 'In years.', placeholder: '25', min: 14, max: 100 },
    { type: 'number', field: 'height', title: 'Your height?', sub: 'In centimeters.', placeholder: '175', min: 120, max: 230 },
    { type: 'number', field: 'weight', title: 'Your weight?', sub: 'In kilograms. Be honest — this is for the math.', placeholder: '75', min: 35, max: 250, step: 0.1 },
    { type: 'choice', field: 'goal', title: 'What\'s the goal?', sub: 'You can change this any time.',
      options: [
        { id: 'cut', label: 'Lose fat', desc: '~0.5 kg per week — 20% calorie deficit', icon: '🔥' },
        { id: 'maintain', label: 'Maintain', desc: 'Keep current weight, fuel your training', icon: '⚖️' },
        { id: 'bulk', label: 'Build muscle', desc: '~0.3 kg per week — 10% surplus', icon: '💪' }
      ]
    },
    { type: 'choice', field: 'activity', title: 'How active are you?', sub: 'Outside of structured workouts.',
      options: [
        { id: 'sedentary', label: 'Sedentary', desc: 'Office work, mostly sitting', icon: '🪑' },
        { id: 'light', label: 'Light', desc: '1-3 workouts/week, some walking', icon: '🚶' },
        { id: 'moderate', label: 'Moderate', desc: '3-5 workouts/week, on your feet often', icon: '🏃' },
        { id: 'active', label: 'Very active', desc: '6-7 workouts/week, physical job', icon: '⚡' }
      ]
    },
    { type: 'finish' }
  ];
}

function renderOnboarding() {
  showNav(false);

  const steps = onboardSteps();

  const step = steps[onboardData.step];

  if (step.type === 'welcome') {
    render(`
      <div class="onboard">
        <div class="onboard-step" style="text-align:center;">
          <h1 class="onboard-title" style="font-size:96px;letter-spacing:-0.04em;line-height:1;margin-bottom:8px;">FUEL</h1>
          <p class="eyebrow" style="margin-bottom:32px;">Smart Nutrition Journal</p>
          <p class="onboard-sub" style="text-align:left;">
            Track your calories with photos, get meal plans tailored to your budget and time, and watch your daily target self-adjust as you progress.
          </p>
          <button class="btn btn-primary btn-block btn-lg" onclick="onboardData.step=1;renderOnboarding()">
            Get started
          </button>
        </div>
      </div>
    `);
    return;
  }

  if (step.type === 'finish') {
    finishOnboarding();
    return;
  }

  let inner = '';
  const totalSteps = steps.length - 2; // exclude welcome and finish
  const progress = (onboardData.step / (steps.length - 1)) * 100;

  if (step.type === 'choice') {
    inner = step.options.map(opt => `
      <button class="option-btn ${onboardData[step.field] === opt.id ? 'selected' : ''}"
              onclick="selectOnboard('${step.field}', '${opt.id}')">
        <span class="option-icon">${opt.icon}</span>
        <div style="flex:1;">
          <div>${opt.label}</div>
          ${opt.desc ? `<span class="option-desc">${opt.desc}</span>` : ''}
        </div>
      </button>
    `).join('');
  } else if (step.type === 'number') {
    const val = onboardData[step.field] || '';
    inner = `
      <div style="margin:20px 0 32px;">
        <input type="number"
               id="onboard-num-input"
               value="${val}"
               placeholder="${step.placeholder}"
               min="${step.min}"
               max="${step.max}"
               ${step.step ? `step="${step.step}"` : ''}
               style="font-size:48px;padding:24px;"
               oninput="onboardData['${step.field}'] = this.value ? parseFloat(this.value) : null"
               onkeydown="if(event.key==='Enter'){event.preventDefault();tryAdvanceOnboard();}">
      </div>
    `;
  }

  render(`
    <div class="onboard">
      <div class="progress-bar"><div class="progress-bar-fill" style="width:${progress}%"></div></div>
      <div class="onboard-step">
        <div class="eyebrow" style="margin-bottom:8px;">Step ${onboardData.step} of ${totalSteps}</div>
        <h1 class="onboard-title">${step.title}</h1>
        <p class="onboard-sub">${step.sub}</p>
        ${inner}
      </div>
      <div style="display:flex;gap:10px;margin-top:24px;">
        <button class="btn btn-ghost" onclick="onboardData.step--;renderOnboarding()">Back</button>
        <button class="btn btn-primary" style="flex:1;" onclick="tryAdvanceOnboard()">
          Continue
        </button>
      </div>
    </div>
  `);

  // Auto-focus number inputs
  setTimeout(() => {
    const inp = document.getElementById('onboard-num-input');
    if (inp) inp.focus();
  }, 100);
}

function selectOnboard(field, value) {
  onboardData[field] = value;
  renderOnboarding();
  // Auto-advance after a brief delay so the user sees the selection
  setTimeout(() => {
    if (onboardData[field] === value) {
      onboardData.step++;
      renderOnboarding();
    }
  }, 250);
}

// Validates the current onboarding step before advancing.
// Reads number inputs directly from the DOM so the value can't be stale.
function tryAdvanceOnboard() {
  const steps = onboardSteps();
  const step = steps[onboardData.step];
  if (!step) return;

  if (step.type === 'number') {
    // Always read live from DOM — the oninput handler may not have fired yet
    const inp = document.getElementById('onboard-num-input');
    const raw = inp ? inp.value : '';
    const num = raw ? parseFloat(raw) : NaN;
    if (isNaN(num)) {
      toast('Please enter a number', 'danger');
      return;
    }
    if (step.min !== undefined && num < step.min) {
      toast(`Minimum is ${step.min}`, 'danger');
      return;
    }
    if (step.max !== undefined && num > step.max) {
      toast(`Maximum is ${step.max}`, 'danger');
      return;
    }
    onboardData[step.field] = num;
  } else if (step.type === 'choice') {
    if (!onboardData[step.field]) {
      toast('Please pick an option', 'danger');
      return;
    }
  }

  onboardData.step++;
  renderOnboarding();
}

function finishOnboarding() {
  STATE.profile = {
    sex: onboardData.sex,
    age: onboardData.age,
    height: onboardData.height,
    startWeight: onboardData.weight,
    currentWeight: onboardData.weight,
    goal: onboardData.goal,
    activity: onboardData.activity,
    apiKey: null,
    createdAt: Date.now()
  };

  // Log starting weight for the trend
  const today = todayKey();
  if (!STATE.log[today]) STATE.log[today] = {};
  STATE.log[today].weight = onboardData.weight;

  save();
  requestPersistentStorage();

  STATE.view = 'today';
  renderApp();
  toast('Welcome to FUEL!');
}

// ============== SCREEN: TODAY ==============
function renderToday() {
  const date = STATE.currentDate;
  const day = STATE.log[date] || { meals: [] };
  const totals = dayTotals(date);
  const target = adjustedTarget(date);
  const isToday = date === todayKey();

  // Calorie ring math
  const pct = Math.min(150, (totals.kcal / target.kcal) * 100);
  const ringClass = totals.kcal > target.kcal * 1.1 ? 'way-over'
                  : totals.kcal > target.kcal ? 'over' : '';

  // Group meals by type
  const mealGroups = { breakfast: [], lunch: [], dinner: [], snack: [] };
  (day.meals || []).forEach(m => {
    if (mealGroups[m.type]) mealGroups[m.type].push(m);
    else mealGroups.snack.push(m);
  });

  const mealEmoji = { breakfast: '☀️', lunch: '🍽️', dinner: '🌙', snack: '🥨' };
  const mealLabel = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snacks' };

  render(`
    <div class="screen">
      <div class="header">
        <div class="logo">FUEL</div>
        <button class="btn-icon" onclick="openSettings()" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
        </button>
      </div>

      ${renderDateNav(date)}

      ${renderCalorieRing(totals.kcal, target.kcal, ringClass)}

      ${renderMacroBars(totals, target)}

      ${day.trained ? `<div class="notice notice-success">💪 Training day — +${target.kcal - calcMacroTargets(STATE.profile).kcal} kcal granted</div>` : ''}

      ${['breakfast','lunch','dinner','snack'].map(type => {
        const items = mealGroups[type];
        const groupKcal = items.reduce((s,m) => s + m.kcal, 0);
        return `
          <div class="meal-section">
            <div class="meal-section-head">
              <div class="meal-section-title">${mealEmoji[type]} ${mealLabel[type]}</div>
              <div class="meal-section-cals">${groupKcal > 0 ? groupKcal + ' kcal' : ''}</div>
            </div>
            ${items.map((m, i) => renderMealItem(m, day.meals.indexOf(m))).join('')}
            <button class="add-meal-btn" onclick="openAddFood('${type}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add food
            </button>
          </div>
        `;
      }).join('')}

      ${isToday ? renderQuickEntry(date) : ''}
    </div>
  `);
}

function renderDateNav(date) {
  const isToday = date === todayKey();
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;background:var(--bg-elev);border:1px solid var(--border);border-radius:12px;padding:8px;">
      <button class="btn-icon" style="background:transparent;border:none;" onclick="changeDate(-1)" aria-label="Previous day">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div style="text-align:center;">
        <div style="font-family:var(--font-display);font-size:14px;letter-spacing:0.02em;">${isToday ? 'Today' : fmtDate(date)}</div>
        ${!isToday ? `<button onclick="goToToday()" style="background:none;border:none;color:var(--accent);font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;cursor:pointer;text-transform:uppercase;margin-top:2px;">Jump to today</button>` : `<div class="eyebrow" style="margin-top:2px;">${fmtDate(date)}</div>`}
      </div>
      <button class="btn-icon" style="background:transparent;border:none;${date >= todayKey() ? 'opacity:0.3;pointer-events:none;' : ''}" onclick="changeDate(1)" aria-label="Next day">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  `;
}

function changeDate(delta) {
  const d = new Date(STATE.currentDate);
  d.setDate(d.getDate() + delta);
  STATE.currentDate = todayKey(d);
  renderApp();
}

function goToToday() {
  STATE.currentDate = todayKey();
  renderApp();
}

function renderCalorieRing(consumed, target, extraClass) {
  const r = 88;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, consumed / target);
  const offset = circ * (1 - pct);
  const remaining = target - consumed;

  return `
    <div class="card-hero card" style="padding:16px 20px;">
      <div class="macro-ring-wrap">
        <svg class="macro-ring" viewBox="0 0 200 200">
          <circle class="macro-ring-bg" cx="100" cy="100" r="${r}"/>
          <circle class="macro-ring-fg ${extraClass}" cx="100" cy="100" r="${r}"
                  stroke-dasharray="${circ}"
                  stroke-dashoffset="${offset}"/>
        </svg>
        <div class="macro-ring-center">
          <div class="macro-ring-value">${consumed}</div>
          <div class="macro-ring-target">/ ${target} kcal</div>
          <div class="macro-ring-label">${remaining > 0 ? remaining + ' left' : Math.abs(remaining) + ' over'}</div>
        </div>
      </div>
    </div>
  `;
}

function renderMacroBars(totals, target) {
  const macros = [
    { key: 'p', label: 'Protein', cls: 'protein' },
    { key: 'c', label: 'Carbs', cls: 'carbs' },
    { key: 'f', label: 'Fat', cls: 'fat' }
  ];
  return `
    <div class="macro-bars">
      ${macros.map(m => {
        const value = Math.round(totals[m.key]);
        const pct = Math.min(100, (totals[m.key] / target[m.key]) * 100);
        return `
          <div class="macro-bar">
            <div class="macro-bar-head">
              <div class="macro-bar-label">${m.label}</div>
              <div class="macro-bar-target">${target[m.key]}g</div>
            </div>
            <div class="macro-bar-value">${value}<span style="color:var(--text-muted);font-size:11px;font-family:var(--font-mono);font-weight:400;"> g</span></div>
            <div class="macro-bar-track">
              <div class="macro-bar-fill ${m.cls}" style="width:${pct}%"></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderMealItem(meal, idx) {
  return `
    <div class="meal-item" onclick="editMeal(${idx})">
      <div class="meal-thumb">${meal.photo ? `<img src="${meal.photo}" alt="">` : (meal.emoji || '🍽️')}</div>
      <div class="meal-info">
        <div class="meal-name">${escapeHtml(meal.name)}</div>
        <div class="meal-meta">
          <span>${meal.amount}${meal.unit}</span>
          <span>P ${Math.round(meal.p)}</span>
          <span>C ${Math.round(meal.c)}</span>
          <span>F ${Math.round(meal.f)}</span>
        </div>
      </div>
      <div class="meal-cals">${meal.kcal}</div>
    </div>
  `;
}

function renderQuickEntry(date) {
  const day = STATE.log[date] || {};
  return `
    <h3 class="section-title">Today's stats</h3>
    <div class="stat-grid stat-grid-3" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat" onclick="openLogWeight()" style="cursor:pointer;">
        <div class="stat-value muted">${day.weight ? day.weight + 'kg' : '—'}</div>
        <div class="stat-label">Weight</div>
      </div>
      <div class="stat" onclick="openLogSteps()" style="cursor:pointer;">
        <div class="stat-value muted">${day.steps ? formatNum(day.steps) : '—'}</div>
        <div class="stat-label">Steps</div>
      </div>
      <div class="stat" onclick="toggleTraining()" style="cursor:pointer;">
        <div class="stat-value ${day.trained ? '' : 'muted'}" style="${day.trained ? '' : 'color:var(--text-muted);'}">${day.trained ? 'YES' : 'NO'}</div>
        <div class="stat-label">Trained</div>
      </div>
    </div>
  `;
}

function formatNum(n) {
  if (n >= 10000) return (n / 1000).toFixed(1) + 'k';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

// ============== ADD FOOD MODAL ==============
let addFoodState = {
  mealType: null,
  query: '',
  category: 'all',
  // photo state
  photoBase64: null,
  photoLoading: false,
  // selected food before quantity confirmation
  pendingFood: null,
  pendingAmount: null,
  // edit mode
  editingIdx: null
};

function openAddFood(mealType) {
  addFoodState = {
    mealType,
    query: '',
    category: 'all',
    photoBase64: null,
    photoLoading: false,
    pendingFood: null,
    pendingAmount: null,
    editingIdx: null
  };
  renderAddFoodModal();
}

function renderAddFoodModal() {
  if (addFoodState.pendingFood) {
    return renderQuantityConfirm();
  }

  const mealLabel = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snacks' }[addFoodState.mealType] || 'Food';
  const hasApi = !!STATE.profile.apiKey;

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">Add to ${mealLabel}</h2>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
        <button class="btn btn-secondary" onclick="capturePhoto()" style="padding:14px;font-size:13px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Photo ${hasApi ? '' : '<span style="color:var(--text-muted);font-size:10px;">·offline</span>'}
        </button>
        <button class="btn btn-secondary" onclick="openManualEntry()" style="padding:14px;font-size:13px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Manual
        </button>
      </div>

      <div class="search-input-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" id="food-search" placeholder="Search 150+ foods..." value="${escapeHtml(addFoodState.query)}" oninput="onSearchInput(this.value)" autocomplete="off">
      </div>

      <div class="scroll-x" style="margin-bottom:12px;">
        ${FOOD_CATEGORIES.map(c => `
          <span class="pill ${addFoodState.category === c.id ? 'active' : ''}" onclick="setCategory('${c.id}')">${c.name}</span>
        `).join('')}
      </div>

      <div id="food-results" style="max-height:50vh;overflow-y:auto;">
        ${renderFoodResults()}
      </div>
    </div>
  `);

  // Focus search input
  setTimeout(() => {
    const inp = document.getElementById('food-search');
    if (inp) inp.focus();
  }, 100);
}

function renderFoodResults() {
  const results = searchFoods(addFoodState.query, addFoodState.category);
  if (results.length === 0) {
    return `<div class="empty"><div class="empty-icon">🔎</div><div>No foods found.</div><div style="margin-top:8px;font-size:12px;">Try different keywords or use Manual entry.</div></div>`;
  }
  return results.map(f => `
    <div class="food-result" onclick="pickFood('${f.id}')">
      <div class="meal-thumb" style="background:var(--bg-elev-2);">${f.emoji}</div>
      <div class="food-result-info">
        <div class="food-result-name">${f.name}${f.custom ? ' <span class="recipe-tag" style="font-size:9px;vertical-align:middle;">MINE</span>' : ''}</div>
        <div class="food-result-meta">
          per ${f.unit === 'piece' ? '1 pc' : '100' + f.unit} ·
          P ${f.p}g · C ${f.c}g · F ${f.f}g
        </div>
      </div>
      <div class="food-result-cals">${f.kcal}</div>
    </div>
  `).join('');
}

function onSearchInput(value) {
  addFoodState.query = value;
  document.getElementById('food-results').innerHTML = renderFoodResults();
}

function setCategory(catId) {
  addFoodState.category = catId;
  renderAddFoodModal();
}

function pickFood(foodId) {
  const food = foodById(foodId);
  if (!food) return;
  addFoodState.pendingFood = food;
  addFoodState.pendingAmount = defaultAmount(food);
  renderAddFoodModal();
}

function renderQuantityConfirm() {
  const food = addFoodState.pendingFood;
  const amount = addFoodState.pendingAmount;
  const macros = computeMacros(food.id, amount);
  const isPiece = food.unit === 'piece';

  // Suggested portions
  let presets;
  if (isPiece) {
    presets = [1, 2, 3, 4];
  } else if (food.cat === 'drink') {
    presets = [100, 200, 250, 500];
  } else if (food.cat === 'fat' && food.tags?.includes('oil')) {
    presets = [5, 10, 15, 20];
  } else {
    presets = [50, 100, 150, 200];
  }

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="addFoodState.pendingFood=null;renderAddFoodModal()" aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <div class="meal-thumb" style="width:56px;height:56px;font-size:28px;background:var(--bg-elev-2);">${food.emoji}</div>
        <div>
          <div style="font-weight:700;font-size:16px;">${food.name}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);">${food.kcal} kcal per ${isPiece ? 'piece' : '100' + food.unit}</div>
        </div>
      </div>

      <label>Amount</label>
      <div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;margin-bottom:16px;">
        <input type="number" id="qty-input" value="${amount}" min="0" step="${isPiece ? 1 : 5}"
               oninput="updateQty(this.value)">
        <div style="font-family:var(--font-mono);font-size:14px;color:var(--text-dim);padding:0 6px;">${isPiece ? 'pc' : food.unit}</div>
      </div>

      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:24px;">
        ${presets.map(p => `
          <button class="pill ${amount === p ? 'active' : ''}" onclick="document.getElementById('qty-input').value=${p};updateQty(${p})">${p}${isPiece ? '' : food.unit}</button>
        `).join('')}
      </div>

      <div class="card" style="margin-bottom:20px;">
        <div class="eyebrow" style="margin-bottom:8px;">Will add</div>
        <div style="display:grid;grid-template-columns:auto 1fr 1fr 1fr;gap:8px;align-items:baseline;">
          <div style="font-family:var(--font-display);font-size:32px;color:var(--accent);" id="qc-kcal">${macros.kcal}</div>
          <div><div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.1em;">PROTEIN</div><div style="font-family:var(--font-display);font-size:14px;" id="qc-p">${macros.p}g</div></div>
          <div><div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.1em;">CARBS</div><div style="font-family:var(--font-display);font-size:14px;" id="qc-c">${macros.c}g</div></div>
          <div><div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.1em;">FAT</div><div style="font-family:var(--font-display);font-size:14px;" id="qc-f">${macros.f}g</div></div>
        </div>
      </div>

      <button class="btn btn-primary btn-block btn-lg" onclick="confirmAddFood()">
        Add to ${({breakfast:'breakfast',lunch:'lunch',dinner:'dinner',snack:'snacks'})[addFoodState.mealType]}
      </button>
    </div>
  `);
}

function updateQty(value) {
  const n = parseFloat(value) || 0;
  addFoodState.pendingAmount = n;
  const food = addFoodState.pendingFood;
  const macros = computeMacros(food.id, n);
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set('qc-kcal', macros.kcal);
  set('qc-p', macros.p + 'g');
  set('qc-c', macros.c + 'g');
  set('qc-f', macros.f + 'g');
  // Update active pill
  const pills = document.querySelectorAll('.pill');
  // (not critical — pills visual stays consistent enough)
}

function confirmAddFood() {
  const food = addFoodState.pendingFood;
  const amount = addFoodState.pendingAmount;
  if (!food || !amount || amount <= 0) {
    toast('Enter a valid amount', 'danger');
    return;
  }
  const macros = computeMacros(food.id, amount);
  const meal = {
    foodId: food.id,
    name: food.name,
    emoji: food.emoji,
    type: addFoodState.mealType,
    amount,
    unit: food.unit === 'piece' ? 'pc' : food.unit,
    kcal: macros.kcal,
    p: macros.p,
    c: macros.c,
    f: macros.f,
    addedAt: Date.now()
  };

  if (addFoodState.editingIdx !== null) {
    // edit existing
    STATE.log[STATE.currentDate].meals[addFoodState.editingIdx] = meal;
  } else {
    if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
    if (!STATE.log[STATE.currentDate].meals) STATE.log[STATE.currentDate].meals = [];
    STATE.log[STATE.currentDate].meals.push(meal);
  }

  save();
  closeModal();
  renderApp();
  toast(`Added ${macros.kcal} kcal`);
}

function editMeal(idx) {
  const meal = STATE.log[STATE.currentDate]?.meals?.[idx];
  if (!meal) return;

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <div class="meal-thumb" style="width:56px;height:56px;font-size:28px;background:var(--bg-elev-2);">${meal.emoji || '🍽️'}</div>
        <div>
          <div style="font-weight:700;font-size:16px;">${escapeHtml(meal.name)}</div>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);">${meal.kcal} kcal · ${meal.amount}${meal.unit}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button class="btn btn-secondary" onclick="closeModal();reEditMeal(${idx})">Edit</button>
        <button class="btn btn-danger" onclick="deleteMeal(${idx})">Delete</button>
      </div>
    </div>
  `);
}

function reEditMeal(idx) {
  const meal = STATE.log[STATE.currentDate].meals[idx];
  if (!meal) return;
  // If we have a foodId, open the quantity confirm with prefilled values
  if (meal.foodId && foodById(meal.foodId)) {
    addFoodState = {
      mealType: meal.type,
      query: '',
      category: 'all',
      photoBase64: null,
      photoLoading: false,
      pendingFood: foodById(meal.foodId),
      pendingAmount: meal.amount,
      editingIdx: idx
    };
    renderAddFoodModal();
  } else {
    // Manual / AI entry — open manual editor
    openManualEntry(meal, idx);
  }
}

function deleteMeal(idx) {
  STATE.log[STATE.currentDate].meals.splice(idx, 1);
  save();
  closeModal();
  renderApp();
  toast('Removed');
}


// ============== PHOTO CAPTURE & AI RECOGNITION ==============
function capturePhoto() {
  // Open native file picker with camera capture preferred
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Resize and convert to base64 (resize to max 1024px to keep API payload reasonable)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 1024;
        let { width, height } = img;
        if (width > max || height > max) {
          if (width > height) {
            height = Math.round(height * max / width);
            width = max;
          } else {
            width = Math.round(width * max / height);
            height = max;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        addFoodState.photoBase64 = base64;
        renderPhotoPreview();

        if (STATE.profile.apiKey) {
          recognizePhoto(base64);
        } else {
          renderPhotoNoKey();
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function renderPhotoPreview() {
  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">Analyzing...</h2>
      <div class="photo-preview">
        <img src="${addFoodState.photoBase64}" alt="Captured food">
        <div class="photo-preview-loader">
          <div class="spinner"></div>
          <div style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Identifying food...</div>
        </div>
      </div>
    </div>
  `);
}

function renderPhotoNoKey() {
  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">No API key set</h2>
      <div class="photo-preview" style="aspect-ratio:1.5/1;">
        <img src="${addFoodState.photoBase64}" alt="Captured food">
      </div>
      <p style="color:var(--text-dim);font-size:14px;margin-bottom:16px;line-height:1.5;">
        To recognize food from photos, add your Anthropic API key in Settings. The photo is sent directly from your phone — nothing is stored on any server.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button class="btn btn-secondary" onclick="closeModal();openSettings()">Add API key</button>
        <button class="btn btn-primary" onclick="closeModal();openManualEntry({photo:addFoodState.photoBase64})">Enter manually</button>
      </div>
    </div>
  `);
}

async function recognizePhoto(base64) {
  const apiKey = STATE.profile.apiKey;
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `Analyze this food photo. Respond with ONLY a valid JSON object (no markdown fences, no commentary), in this exact shape:

{
  "name": "Short dish name (e.g. 'Chicken caesar salad')",
  "estimatedGrams": 350,
  "kcal": 450,
  "protein_g": 28,
  "carbs_g": 22,
  "fat_g": 26,
  "confidence": "high" | "medium" | "low",
  "clarifyingQuestions": [
    {
      "id": "cooking_method",
      "question": "How was it cooked?",
      "options": [
        { "label": "Grilled / baked", "kcal_delta": 0 },
        { "label": "Pan-fried with oil", "kcal_delta": 80 },
        { "label": "Deep-fried", "kcal_delta": 180 }
      ]
    }
  ]
}

Rules:
- estimatedGrams = total food weight on plate
- kcal/protein/carbs/fat = totals for the whole dish (not per 100g)
- Include 1-3 clarifying questions ONLY for things that meaningfully change calories (cooking method, sauce/dressing, oil added, portion size if unclear). Skip if photo is fully clear.
- kcal_delta is added to base kcal if user picks that option (0 for the assumed default)
- If image is not food, return: {"error": "not_food"}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Data } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = `API error ${res.status}`;
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.error?.message || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const data = await res.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');

    // Extract JSON from possible markdown fences
    let jsonStr = text.trim();
    jsonStr = jsonStr.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      throw new Error('Could not parse response. Try again.');
    }

    if (parsed.error === 'not_food') {
      closeModal();
      toast('No food detected in photo', 'danger');
      return;
    }

    renderRecognitionResult(parsed);
  } catch (err) {
    console.error(err);
    openModal(`
      <div style="position:relative;">
        <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <h2 class="modal-title">Recognition failed</h2>
        <div class="notice notice-warn" style="margin-bottom:16px;">
          ${escapeHtml(err.message || 'Unknown error')}
        </div>
        <p style="color:var(--text-dim);font-size:13px;margin-bottom:16px;">Common causes: invalid API key, no credits, or network error.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <button class="btn btn-secondary" onclick="closeModal();openSettings()">Check key</button>
          <button class="btn btn-primary" onclick="closeModal();openManualEntry({photo:addFoodState.photoBase64})">Enter manually</button>
        </div>
      </div>
    `);
  }
}

// Result with clarifying questions
let recognitionState = null;

function renderRecognitionResult(result) {
  recognitionState = {
    base: result,
    answers: {} // questionId -> selectedOption
  };
  renderRecognitionUI();
}

function renderRecognitionUI() {
  const r = recognitionState.base;
  const answers = recognitionState.answers;

  const baseGrams = r.estimatedGrams || 0;
  if (recognitionState.grams === undefined || recognitionState.grams === null) {
    recognitionState.grams = baseGrams || 100;
  }
  const grams = Math.max(1, Math.round(recognitionState.grams));
  // AI estimate is the default: when grams === estimatedGrams, wScale = 1
  const wScale = baseGrams > 0 ? grams / baseGrams : 1;
  const edited = baseGrams > 0 && grams !== baseGrams;

  // Clarifying-question kcal delta (absolute for the estimated portion), scaled with weight
  let kcalDelta = 0;
  for (const q of r.clarifyingQuestions || []) {
    const sel = answers[q.id];
    if (sel !== undefined) {
      kcalDelta += q.options[sel].kcal_delta || 0;
    }
  }
  const scaledDelta = Math.round(kcalDelta * wScale);

  const totalKcal = Math.round((r.kcal || 0) * wScale) + scaledDelta;
  const totalP = Math.round((r.protein_g || 0) * wScale);
  const totalC = Math.round((r.carbs_g || 0) * wScale);
  const totalF = Math.round((r.fat_g || 0) * wScale + scaledDelta / 9 * 0.85);

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      ${addFoodState.photoBase64 ? `<div class="photo-preview" style="aspect-ratio:2/1;margin-bottom:16px;"><img src="${addFoodState.photoBase64}" alt=""></div>` : ''}

      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px;">
        <h2 class="modal-title" style="margin:0;font-size:20px;">${escapeHtml(r.name || 'Unknown food')}</h2>
        ${r.confidence ? `<span class="recipe-tag">${r.confidence}</span>` : ''}
      </div>
      <div class="eyebrow" style="margin-bottom:12px;">${edited ? `AI est. ~${baseGrams}g · adjusted` : 'AI estimate'}</div>

      <label>Weight (g)</label>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:18px;">
        <button class="btn btn-secondary" style="width:48px;flex-shrink:0;" onclick="bumpRecogGrams(-10)" aria-label="Less">−</button>
        <input type="number" id="recog-grams" value="${grams}" min="1" inputmode="numeric"
               style="text-align:center;font-family:var(--font-mono);font-size:18px;font-weight:600;"
               onchange="setRecogGrams(this.value)">
        <button class="btn btn-secondary" style="width:48px;flex-shrink:0;" onclick="bumpRecogGrams(10)" aria-label="More">+</button>
      </div>

      ${(r.clarifyingQuestions || []).map((q, qi) => `
        <div style="margin-bottom:18px;">
          <label>${escapeHtml(q.question)}</label>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${q.options.map((opt, oi) => `
              <button class="option-btn ${answers[q.id] === oi ? 'selected' : ''}"
                      style="padding:12px 14px;font-size:14px;"
                      onclick="answerQuestion('${q.id}', ${oi})">
                <span style="flex:1;">${escapeHtml(opt.label)}</span>
                ${opt.kcal_delta ? `<span style="font-family:var(--font-mono);font-size:11px;color:${opt.kcal_delta > 0 ? 'var(--warning)' : 'var(--success)'};">${opt.kcal_delta > 0 ? '+' : ''}${opt.kcal_delta} kcal</span>` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div class="card" style="margin-bottom:16px;">
        <div style="display:grid;grid-template-columns:auto 1fr 1fr 1fr;gap:8px;align-items:baseline;">
          <div style="font-family:var(--font-display);font-size:32px;color:var(--accent);">${totalKcal}</div>
          <div><div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.1em;">PROTEIN</div><div style="font-family:var(--font-display);font-size:14px;">${totalP}g</div></div>
          <div><div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.1em;">CARBS</div><div style="font-family:var(--font-display);font-size:14px;">${totalC}g</div></div>
          <div><div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);letter-spacing:0.1em;">FAT</div><div style="font-family:var(--font-display);font-size:14px;">${totalF}g</div></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button class="btn btn-secondary" onclick="closeModal();openManualEntry({name:'${escapeHtml(r.name || '')}',kcal:${totalKcal},p:${totalP},c:${totalC},f:${totalF},photo:addFoodState.photoBase64})">Tweak</button>
        <button class="btn btn-primary" onclick="confirmRecognized(${totalKcal}, ${totalP}, ${totalC}, ${totalF})">Add</button>
      </div>
    </div>
  `);
}

function setRecogGrams(v) {
  const n = parseFloat(v);
  recognitionState.grams = (!isFinite(n) || n < 1) ? 1 : Math.round(n);
  renderRecognitionUI();
}

function bumpRecogGrams(delta) {
  const cur = Math.round(recognitionState.grams || 0);
  recognitionState.grams = Math.max(1, cur + delta);
  renderRecognitionUI();
}

function answerQuestion(qid, optIdx) {
  recognitionState.answers[qid] = optIdx;
  renderRecognitionUI();
}

function confirmRecognized(kcal, p, c, f) {
  const r = recognitionState.base;
  const meal = {
    foodId: null, // not from catalog
    name: r.name || 'Photo meal',
    emoji: null,
    photo: addFoodState.photoBase64,
    type: addFoodState.mealType,
    amount: Math.round(recognitionState.grams || r.estimatedGrams || 0),
    unit: 'g',
    kcal,
    p, c, f,
    addedAt: Date.now()
  };

  if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
  if (!STATE.log[STATE.currentDate].meals) STATE.log[STATE.currentDate].meals = [];
  STATE.log[STATE.currentDate].meals.push(meal);

  save();
  closeModal();
  renderApp();
  toast(`Added ${kcal} kcal`);
  recognitionState = null;
}

// ============== MANUAL ENTRY ==============
function openManualEntry(prefill, editIdx) {
  prefill = prefill || {};
  const isEdit = editIdx !== undefined;

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">${isEdit ? 'Edit meal' : 'Manual entry'}</h2>

      ${prefill.photo ? `<div class="photo-preview" style="aspect-ratio:2/1;margin-bottom:16px;"><img src="${prefill.photo}" alt=""></div>` : ''}

      <label>Name</label>
      <input type="text" id="me-name" placeholder="e.g. Grandma's stew" value="${escapeHtml(prefill.name || '')}" style="text-align:left;font-size:15px;font-weight:500;font-family:var(--font-body);">

      <label style="margin-top:16px;">Calories (kcal)</label>
      <input type="number" id="me-kcal" placeholder="0" value="${prefill.kcal || ''}" min="0">

      <div class="qty-row" style="margin-top:16px;">
        <div class="qty-input-group">
          <label>Protein g</label>
          <input type="number" id="me-p" placeholder="0" value="${prefill.p || ''}" min="0" step="0.1">
        </div>
        <div class="qty-input-group">
          <label>Carbs g</label>
          <input type="number" id="me-c" placeholder="0" value="${prefill.c || ''}" min="0" step="0.1">
        </div>
      </div>

      <div class="qty-input-group" style="margin-bottom:16px;">
        <label>Fat g</label>
        <input type="number" id="me-f" placeholder="0" value="${prefill.f || ''}" min="0" step="0.1">
      </div>

      ${isEdit ? '' : `
      <div id="save-food-toggle" class="toggle-card" onclick="toggleSaveFood()" style="margin-bottom:12px;">
        <div class="toggle-icon">★</div>
        <div class="toggle-info">
          <div class="toggle-title">Save to my foods</div>
          <div class="toggle-sub">REUSE IT FROM SEARCH LATER</div>
        </div>
      </div>
      <div id="save-food-weight-wrap" style="display:none;margin-bottom:16px;">
        <label>Portion weight (g) — the macros above are for this weight</label>
        <input type="number" id="me-weight" placeholder="100" value="100" min="1">
      </div>
      `}

      <button class="btn btn-primary btn-block btn-lg" onclick="confirmManual(${editIdx === undefined ? 'null' : editIdx}, ${prefill.photo ? "'" + prefill.photo + "'" : 'null'})">${isEdit ? 'Save' : 'Add'}</button>
    </div>
  `);

  setTimeout(() => {
    const inp = document.getElementById('me-name');
    if (inp && !prefill.name) inp.focus();
  }, 100);
}

function confirmManual(editIdx, photoData) {
  const name = document.getElementById('me-name').value.trim();
  const kcal = parseFloat(document.getElementById('me-kcal').value) || 0;
  const p = parseFloat(document.getElementById('me-p').value) || 0;
  const c = parseFloat(document.getElementById('me-c').value) || 0;
  const f = parseFloat(document.getElementById('me-f').value) || 0;

  if (!name) { toast('Enter a name', 'danger'); return; }
  if (kcal <= 0) { toast('Enter calories', 'danger'); return; }

  const meal = {
    foodId: null,
    name,
    emoji: null,
    photo: photoData || null,
    type: addFoodState.mealType,
    amount: 1,
    unit: 'serv',
    kcal,
    p, c, f,
    addedAt: Date.now()
  };

  if (editIdx !== null && editIdx !== undefined) {
    // preserve original meal type
    const orig = STATE.log[STATE.currentDate].meals[editIdx];
    if (orig) meal.type = orig.type;
    STATE.log[STATE.currentDate].meals[editIdx] = meal;
  } else {
    if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
    if (!STATE.log[STATE.currentDate].meals) STATE.log[STATE.currentDate].meals = [];
    STATE.log[STATE.currentDate].meals.push(meal);
  }

  // Save to my foods (only on new manual entries)
  let savedToFoods = false;
  const toggle = document.getElementById('save-food-toggle');
  if (toggle && toggle.classList.contains('on')) {
    const wEl = document.getElementById('me-weight');
    const w = Math.max(1, parseFloat(wEl && wEl.value) || 100);
    const per = x => Math.round((x / w) * 100 * 10) / 10;
    const food = {
      id: 'custom-' + Date.now().toString(36),
      name,
      emoji: '⭐',
      cat: 'mixed',
      kcal: Math.round((kcal / w) * 100),
      p: per(p), c: per(c), f: per(f),
      unit: 'g',
      custom: true,
      tags: ['my-food']
    };
    if (!Array.isArray(STATE.customFoods)) STATE.customFoods = [];
    const dupIdx = STATE.customFoods.findIndex(
      cf => cf.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (dupIdx >= 0) {
      food.id = STATE.customFoods[dupIdx].id;
      STATE.customFoods[dupIdx] = food;
    } else {
      STATE.customFoods.push(food);
    }
    savedToFoods = true;
  }

  save();
  closeModal();
  renderApp();
  toast(editIdx !== null ? 'Updated' : (savedToFoods ? `Added · saved to my foods` : `Added ${kcal} kcal`));
}

function toggleSaveFood() {
  const card = document.getElementById('save-food-toggle');
  if (!card) return;
  const on = card.classList.toggle('on');
  const wrap = document.getElementById('save-food-weight-wrap');
  if (wrap) wrap.style.display = on ? '' : 'none';
}

// ============== QUICK ENTRY: WEIGHT, STEPS, TRAINING ==============
function openLogWeight() {
  const day = STATE.log[STATE.currentDate] || {};
  const current = day.weight || STATE.profile.currentWeight || STATE.profile.startWeight;

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">Log weight</h2>
      <p style="color:var(--text-dim);font-size:13px;margin-bottom:16px;">Weigh in the morning, after the bathroom, before food. Most reliable trend.</p>
      <input type="number" id="weight-input" value="${current}" step="0.1" min="30" max="300" style="font-size:48px;padding:24px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px;">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmWeight()">Save</button>
      </div>
    </div>
  `);
  setTimeout(() => document.getElementById('weight-input')?.focus(), 100);
}

function confirmWeight() {
  const w = parseFloat(document.getElementById('weight-input').value);
  if (!w || w < 30 || w > 300) { toast('Enter a valid weight', 'danger'); return; }
  if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
  STATE.log[STATE.currentDate].weight = w;
  STATE.profile.currentWeight = w;
  save();
  closeModal();
  renderApp();
  toast(`Logged ${w} kg`);
  // Trigger recalibration check (it'll be a noop unless a week has passed)
  setTimeout(maybeRecalibrate, 600);
}

function openLogSteps() {
  const day = STATE.log[STATE.currentDate] || {};
  const current = day.steps || 0;

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">Log steps</h2>
      <input type="number" id="steps-input" value="${current}" step="100" min="0" max="50000" style="font-size:48px;padding:24px;">
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;margin-bottom:20px;">
        ${[3000, 5000, 8000, 10000, 12000, 15000].map(p => `
          <button class="pill" onclick="document.getElementById('steps-input').value=${p}">${formatNum(p)}</button>
        `).join('')}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmSteps()">Save</button>
      </div>
    </div>
  `);
  setTimeout(() => document.getElementById('steps-input')?.focus(), 100);
}

function confirmSteps() {
  const s = parseInt(document.getElementById('steps-input').value);
  if (isNaN(s) || s < 0) { toast('Enter a valid number', 'danger'); return; }
  if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
  STATE.log[STATE.currentDate].steps = s;
  save();
  closeModal();
  renderApp();
  toast(`Logged ${formatNum(s)} steps`);
}

function toggleTraining() {
  if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
  STATE.log[STATE.currentDate].trained = !STATE.log[STATE.currentDate].trained;
  save();
  renderApp();
  toast(STATE.log[STATE.currentDate].trained ? 'Training day on — extra kcal granted' : 'Training day off');
}


// ============== SCREEN: BODY ==============
function renderBody() {
  // Collect weight history
  const weights = [];
  Object.keys(STATE.log).sort().forEach(k => {
    if (STATE.log[k].weight) weights.push({ date: k, w: STATE.log[k].weight });
  });

  const profile = STATE.profile;
  const start = profile.startWeight;
  const current = profile.currentWeight || start;
  const change = current - start;
  const changePct = (change / start) * 100;

  // Last 30 days for chart
  const last30 = weights.slice(-30);

  render(`
    <div class="screen">
      <div class="header">
        <div class="logo">FUEL</div>
        <button class="btn-icon" onclick="openSettings()" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
      </div>

      <div class="today-banner">
        <div class="eyebrow">Body</div>
        <h1 class="today-title">${current} kg</h1>
        <p class="today-sub">
          ${change === 0 ? 'No change yet' :
            change > 0 ? `+${change.toFixed(1)} kg from start (${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}%)` :
            `${change.toFixed(1)} kg from start (${changePct.toFixed(1)}%)`}
        </p>
        <button class="btn btn-primary" onclick="openLogWeight()" style="position:relative;z-index:1;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Log today's weight
        </button>
      </div>

      <h3 class="section-title">Weight trend <span class="count">${last30.length} entries</span></h3>
      ${last30.length >= 2 ? renderWeightChart(last30) : `<div class="card"><div class="empty"><div class="empty-icon">📊</div><div>Need at least 2 weigh-ins to plot a trend.</div></div></div>`}

      <h3 class="section-title">Body stats</h3>
      <div class="card">
        <div class="list-row">
          <span class="list-row-label">Starting weight</span>
          <span class="list-row-value">${start} kg</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">Current weight</span>
          <span class="list-row-value">${current} kg</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">Total change</span>
          <span class="list-row-value" style="color:${change > 0 ? 'var(--success)' : change < 0 ? 'var(--macro-protein)' : ''};">${change >= 0 ? '+' : ''}${change.toFixed(1)} kg</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">Height</span>
          <span class="list-row-value">${profile.height} cm</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">BMI</span>
          <span class="list-row-value">${(current / Math.pow(profile.height / 100, 2)).toFixed(1)}</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">BMR</span>
          <span class="list-row-value">${Math.round(calcBMR(profile))} kcal</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">TDEE</span>
          <span class="list-row-value">${calcTDEE(profile)} kcal</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">Daily target</span>
          <span class="list-row-value" style="color:var(--accent);">${calcCalorieTarget(profile)} kcal${STATE.customTarget ? ' *' : ''}</span>
        </div>
      </div>
      ${STATE.customTarget ? `<div class="notice notice-info" style="margin-top:8px;">* Auto-adjusted by FUEL based on your real progress</div>` : ''}
    </div>
  `);
}

function renderWeightChart(entries) {
  const w = 440;
  const h = 200;
  const pad = { top: 16, right: 12, bottom: 24, left: 36 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const weights = entries.map(e => e.w);
  let min = Math.min(...weights);
  let max = Math.max(...weights);
  const range = max - min || 1;
  // Pad min/max for visual breathing room
  min -= range * 0.2;
  max += range * 0.2;
  if (min < 0) min = 0;

  const xStep = innerW / (entries.length - 1);
  const points = entries.map((e, i) => ({
    x: pad.left + i * xStep,
    y: pad.top + innerH - ((e.w - min) / (max - min)) * innerH,
    e
  }));

  const linePath = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const areaPath = linePath + ` L ${points[points.length - 1].x.toFixed(1)},${(pad.top + innerH).toFixed(1)} L ${points[0].x.toFixed(1)},${(pad.top + innerH).toFixed(1)} Z`;

  // Y-axis ticks
  const ticks = 4;
  const tickValues = [];
  for (let i = 0; i <= ticks; i++) {
    const v = min + (range + range * 0.4) * (i / ticks);
    const y = pad.top + innerH - (i / ticks) * innerH;
    tickValues.push({ v: v.toFixed(1), y });
  }

  return `
    <div class="card">
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:200px;">
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${tickValues.map(t => `
          <line x1="${pad.left}" y1="${t.y}" x2="${w - pad.right}" y2="${t.y}" stroke="var(--bg-elev-3)" stroke-width="1" stroke-dasharray="2,3"/>
          <text x="${pad.left - 6}" y="${t.y + 3}" fill="var(--text-muted)" font-family="JetBrains Mono" font-size="9" text-anchor="end">${t.v}</text>
        `).join('')}
        <path d="${areaPath}" fill="url(#weightGrad)"/>
        <path d="${linePath}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/>
        ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="var(--accent)"/>`).join('')}
        <text x="${pad.left}" y="${h - 6}" fill="var(--text-muted)" font-family="JetBrains Mono" font-size="9">${fmtDate(entries[0].date)}</text>
        <text x="${w - pad.right}" y="${h - 6}" fill="var(--text-muted)" font-family="JetBrains Mono" font-size="9" text-anchor="end">${fmtDate(entries[entries.length - 1].date)}</text>
      </svg>
    </div>
  `;
}

// ============== SCREEN: PLAN ==============
let planFilters = {
  cuisine: 'any',
  maxTime: null,
  maxComplexity: null,
  maxCost: null
};
let currentPlan = null;

function renderPlan() {
  const target = calcCalorieTarget(STATE.profile);

  render(`
    <div class="screen">
      <div class="header">
        <div class="logo">FUEL</div>
        <div class="eyebrow">Plan</div>
      </div>

      <div class="today-banner">
        <div class="eyebrow">Meal generator</div>
        <h1 class="today-title">Plan a day</h1>
        <p class="today-sub">Choose filters, get a full day of meals at ~${target} kcal.</p>
      </div>

      <h3 class="section-title">Cuisine</h3>
      <div class="pill-row">
        ${[
          { id: 'any', label: 'Any' },
          { id: 'russian', label: 'Russian' },
          { id: 'caucasian', label: 'Caucasian' }
        ].map(c => `<span class="pill ${planFilters.cuisine === c.id ? 'active' : ''}" onclick="setPlanFilter('cuisine','${c.id}')">${c.label}</span>`).join('')}
      </div>

      <h3 class="section-title">Max time per meal</h3>
      <div class="pill-row">
        ${[
          { id: null, label: 'Any' },
          { id: 15, label: '≤15 min' },
          { id: 30, label: '≤30 min' },
          { id: 60, label: '≤60 min' }
        ].map(c => `<span class="pill ${planFilters.maxTime === c.id ? 'active' : ''}" onclick="setPlanFilter('maxTime', ${c.id})">${c.label}</span>`).join('')}
      </div>

      <h3 class="section-title">Difficulty</h3>
      <div class="pill-row">
        ${[
          { id: null, label: 'Any' },
          { id: 1, label: 'Easy only' },
          { id: 2, label: '≤Medium' }
        ].map(c => `<span class="pill ${planFilters.maxComplexity === c.id ? 'active' : ''}" onclick="setPlanFilter('maxComplexity', ${c.id})">${c.label}</span>`).join('')}
      </div>

      <h3 class="section-title">Budget</h3>
      <div class="pill-row">
        ${[
          { id: null, label: 'Any' },
          { id: 1, label: '$' },
          { id: 2, label: '$$' },
          { id: 3, label: '$$$' }
        ].map(c => `<span class="pill ${planFilters.maxCost === c.id ? 'active' : ''}" onclick="setPlanFilter('maxCost', ${c.id})">${c.label}</span>`).join('')}
      </div>

      <button class="btn btn-primary btn-block btn-lg" onclick="generatePlan()" style="margin-top:16px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        Generate day plan
      </button>

      ${currentPlan ? renderPlanResult(currentPlan, target) : ''}
    </div>
  `);
}

function setPlanFilter(key, value) {
  planFilters[key] = value;
  renderApp();
}

function generatePlan() {
  const target = calcCalorieTarget(STATE.profile);
  const plan = generateDayPlan(planFilters, target);
  if (!plan) {
    toast('No combination matches these filters. Loosen them up.', 'danger');
    return;
  }
  currentPlan = plan;
  renderApp();
  // Scroll to result
  setTimeout(() => {
    const el = document.getElementById('plan-result');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function renderPlanResult(plan, target) {
  const meals = [
    { key: 'breakfast', label: 'Breakfast', emoji: '☀️', recipe: plan.breakfast },
    { key: 'lunch', label: 'Lunch', emoji: '🍽️', recipe: plan.lunch },
    { key: 'dinner', label: 'Dinner', emoji: '🌙', recipe: plan.dinner }
  ];
  if (plan.snack) meals.push({ key: 'snack', label: 'Snack', emoji: '🥨', recipe: plan.snack });

  return `
    <div id="plan-result">
      <h3 class="section-title">Your day <span class="count">${plan.totalKcal} / ${target} kcal</span></h3>
      ${meals.map(m => renderRecipeCard(m.recipe, m.emoji, m.label, m.key)).join('')}
      <button class="btn btn-secondary btn-block" onclick="addPlanToToday()" style="margin-top:12px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        Add full plan to today's log
      </button>
    </div>
  `;
}

let expandedRecipeId = null;

function renderRecipeCard(recipe, emoji, mealLabel, mealKey) {
  const macros = recipeMacros(recipe);
  const isExpanded = expandedRecipeId === recipe.id;
  return `
    <div class="recipe-card">
      <div class="recipe-card-head" onclick="toggleRecipe('${recipe.id}')">
        <div class="recipe-emoji">${recipe.emoji}</div>
        <div class="recipe-info">
          <div class="recipe-name">
            ${escapeHtml(recipe.name)}
            ${recipe.cuisine && recipe.cuisine !== 'universal' ? `<span class="recipe-tag cuisine">${recipe.cuisine}</span>` : ''}
          </div>
          <div class="recipe-meta">
            <span>⏱ ${recipe.time}m</span>
            <span>${complexityLabel(recipe.complexity)}</span>
            <span>${recipeCostLabel(recipe.cost)}</span>
            <span style="color:var(--accent);">${macros.kcal} kcal</span>
            <span>P${Math.round(macros.p)} C${Math.round(macros.c)} F${Math.round(macros.f)}</span>
          </div>
        </div>
      </div>
      ${isExpanded ? `
        <div class="recipe-card-body">
          <div class="eyebrow" style="margin-bottom:8px;">Ingredients</div>
          ${recipe.ingredients.map(ing => {
            const food = foodById(ing.foodId);
            const unit = food?.unit === 'piece' ? (ing.amount === 1 ? ' pc' : ' pcs') : food?.unit || 'g';
            return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;"><span>${food?.emoji || ''} ${food?.name || ing.foodId}</span><span class="mono" style="color:var(--text-dim);">${ing.amount}${unit}</span></div>`;
          }).join('')}
          <div class="eyebrow" style="margin:14px 0 8px;">Steps</div>
          <ol style="padding-left:20px;font-size:13px;line-height:1.6;">
            ${recipe.steps.map(s => `<li style="margin-bottom:6px;color:var(--text);">${escapeHtml(s)}</li>`).join('')}
          </ol>
          <div class="recipe-actions">
            <button class="btn btn-secondary btn-sm" onclick="addRecipeToLog('${recipe.id}', '${mealKey}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Add to log
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function toggleRecipe(id) {
  expandedRecipeId = expandedRecipeId === id ? null : id;
  renderApp();
}

function addRecipeToLog(recipeId, mealType) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  const macros = recipeMacros(recipe);
  const meal = {
    foodId: null,
    name: recipe.name,
    emoji: recipe.emoji,
    type: mealType || 'lunch',
    amount: 1,
    unit: 'serv',
    kcal: macros.kcal,
    p: macros.p,
    c: macros.c,
    f: macros.f,
    addedAt: Date.now()
  };
  if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
  if (!STATE.log[STATE.currentDate].meals) STATE.log[STATE.currentDate].meals = [];
  STATE.log[STATE.currentDate].meals.push(meal);
  save();
  toast(`Added "${recipe.name}" to today`);
}

function addPlanToToday() {
  if (!currentPlan) return;
  const items = [
    { recipe: currentPlan.breakfast, type: 'breakfast' },
    { recipe: currentPlan.lunch, type: 'lunch' },
    { recipe: currentPlan.dinner, type: 'dinner' }
  ];
  if (currentPlan.snack) items.push({ recipe: currentPlan.snack, type: 'snack' });

  if (!STATE.log[STATE.currentDate]) STATE.log[STATE.currentDate] = {};
  if (!STATE.log[STATE.currentDate].meals) STATE.log[STATE.currentDate].meals = [];

  for (const item of items) {
    const macros = recipeMacros(item.recipe);
    STATE.log[STATE.currentDate].meals.push({
      foodId: null,
      name: item.recipe.name,
      emoji: item.recipe.emoji,
      type: item.type,
      amount: 1,
      unit: 'serv',
      kcal: macros.kcal,
      p: macros.p,
      c: macros.c,
      f: macros.f,
      addedAt: Date.now()
    });
  }
  save();
  toast(`Added ${items.length} meals to today`);
  STATE.view = 'today';
  renderApp();
}

// ============== SCREEN: LOG (history) ==============
function renderLog() {
  const dates = Object.keys(STATE.log)
    .filter(k => STATE.log[k].meals?.length > 0 || STATE.log[k].weight || STATE.log[k].trained)
    .sort()
    .reverse();

  render(`
    <div class="screen">
      <div class="header">
        <div class="logo">FUEL</div>
        <div class="eyebrow">Log</div>
      </div>

      <div class="today-banner">
        <div class="eyebrow">History</div>
        <h1 class="today-title">${dates.length} ${dates.length === 1 ? 'day' : 'days'}</h1>
        <p class="today-sub">Tap any day to view or edit it.</p>
      </div>

      ${dates.length === 0 ? `
        <div class="card"><div class="empty">
          <div class="empty-icon">📖</div>
          <div>No log entries yet.</div>
          <div style="margin-top:8px;font-size:12px;">Start tracking on the Today tab.</div>
        </div></div>
      ` : dates.map(d => {
        const day = STATE.log[d];
        const totals = dayTotals(d);
        const target = calcMacroTargets(STATE.profile);
        const pct = (totals.kcal / target.kcal) * 100;
        const isToday = d === todayKey();
        const dt = new Date(d);
        return `
          <div class="card" style="cursor:pointer;padding:14px 16px;" onclick="goToDate('${d}')">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="text-align:center;min-width:48px;">
                <div style="font-family:var(--font-display);font-size:22px;line-height:1;">${dt.getDate()}</div>
                <div class="eyebrow" style="font-size:9px;margin-top:2px;">${dt.toLocaleDateString('en-US',{month:'short'})}</div>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:14px;margin-bottom:2px;">${isToday ? 'Today' : dt.toLocaleDateString('en-US',{weekday:'long'})}</div>
                <div style="display:flex;gap:8px;font-family:var(--font-mono);font-size:11px;color:var(--text-dim);flex-wrap:wrap;">
                  ${totals.kcal > 0 ? `<span>${totals.kcal} kcal</span>` : ''}
                  ${day.weight ? `<span>⚖ ${day.weight}kg</span>` : ''}
                  ${day.trained ? `<span style="color:var(--accent);">💪 trained</span>` : ''}
                  ${day.steps ? `<span>👟 ${formatNum(day.steps)}</span>` : ''}
                </div>
              </div>
              ${totals.kcal > 0 ? `
                <div style="font-family:var(--font-display);font-size:14px;color:${pct > 110 ? 'var(--warning)' : pct > 90 ? 'var(--accent)' : 'var(--text-dim)'};">
                  ${Math.round(pct)}%
                </div>
              ` : ''}
              <button class="btn-icon-sm" onclick="event.stopPropagation();openShareDay('${d}')" aria-label="Share day" style="background:transparent;border:none;color:var(--text-dim);padding:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `);
}

function goToDate(date) {
  STATE.currentDate = date;
  STATE.view = 'today';
  renderApp();
}

// ============== SHARE: DAY SUMMARY ==============
// Renders the day into a 1080x1350 PNG and triggers Web Share API or download.

async function openShareDay(date) {
  // Show loading modal first
  openModal(`
    <div style="position:relative;text-align:center;padding:20px 0;">
      <div class="spinner" style="margin:0 auto 16px;"></div>
      <div style="font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-dim);">
        Generating share card...
      </div>
    </div>
  `);

  try {
    // Make sure fonts are loaded before drawing — otherwise canvas falls back to system fonts
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const blob = await renderShareCard(date);
    const url = URL.createObjectURL(blob);

    const dt = new Date(date);
    const filename = `fuel-${date}.png`;

    // Detect Web Share API with file support
    const file = new File([blob], filename, { type: 'image/png' });
    const canShareFiles = navigator.canShare && navigator.canShare({ files: [file] });

    openModal(`
      <div style="position:relative;">
        <button class="modal-close-btn" onclick="closeShareModal()" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <h2 class="modal-title">Share day</h2>
        <div style="background:var(--bg-elev-2);border-radius:12px;overflow:hidden;margin-bottom:16px;">
          <img src="${url}" alt="Day summary" style="width:100%;display:block;">
        </div>
        <div style="display:grid;grid-template-columns:${canShareFiles ? '1fr 1fr' : '1fr'};gap:10px;">
          ${canShareFiles ? `
            <button class="btn btn-secondary" onclick="downloadShareImage()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download
            </button>
            <button class="btn btn-primary" onclick="shareDayImage()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Share
            </button>
          ` : `
            <button class="btn btn-primary" onclick="downloadShareImage()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download image
            </button>
          `}
        </div>
        ${!canShareFiles ? `<div style="margin-top:12px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-align:center;letter-spacing:0.05em;">On mobile: long-press image to save</div>` : ''}
      </div>
    `);

    // Stash the blob/url so the share button can grab it
    window._shareBlob = blob;
    window._shareUrl = url;
    window._shareFilename = filename;
  } catch (err) {
    console.error(err);
    closeModal();
    toast('Could not generate share card', 'danger');
  }
}

function closeShareModal() {
  if (window._shareUrl) {
    URL.revokeObjectURL(window._shareUrl);
    window._shareUrl = null;
    window._shareBlob = null;
    window._shareFilename = null;
  }
  closeModal();
}

function downloadShareImage() {
  if (!window._shareUrl) return;
  const a = document.createElement('a');
  a.href = window._shareUrl;
  a.download = window._shareFilename || 'fuel-day.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast('Downloaded');
}

async function shareDayImage() {
  const blob = window._shareBlob;
  const filename = window._shareFilename;
  if (!blob) return;
  try {
    const file = new File([blob], filename, { type: 'image/png' });
    await navigator.share({
      files: [file],
      title: 'FUEL — Day summary',
      text: 'My nutrition log'
    });
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      toast('Sharing failed', 'danger');
    }
  }
}

// Calculate streak ending on a given date (consecutive days with logged meals, looking backwards)
function streakEndingOn(date) {
  let streak = 0;
  const startDate = new Date(date);
  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() - i);
    const k = todayKey(d);
    const t = dayTotals(k);
    if (t.kcal > 0) streak++;
    else break;
  }
  return streak;
}

async function renderShareCard(date) {
  const W = 1080;
  const H = 1350;

  const day = STATE.log[date] || { meals: [] };
  const totals = dayTotals(date);
  const target = adjustedTarget(date);
  const pct = Math.round((totals.kcal / target.kcal) * 100);
  const mealCount = (day.meals || []).length;
  const streak = streakEndingOn(date);

  const dt = new Date(date);
  const isToday = date === todayKey();

  // Color palette (mirrors CSS variables)
  const C = {
    bg: '#0a0a0a',
    bgElev: '#141414',
    bgElev2: '#1c1c1c',
    bgElev3: '#242424',
    border: '#262626',
    text: '#f5f5f5',
    textDim: '#9a9a9a',
    textMuted: '#5a5a5a',
    accent: '#d4ff3a',
    warning: '#ffb83a',
    danger: '#ff4d4d',
    macroP: '#ff6b9d',
    macroC: '#4dc4ff',
    macroF: '#ffb83a'
  };

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // === BACKGROUND ===
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow top-right (like FORGE hero)
  const grd = ctx.createRadialGradient(W * 0.85, H * 0.05, 0, W * 0.85, H * 0.05, 600);
  grd.addColorStop(0, 'rgba(212, 255, 58, 0.10)');
  grd.addColorStop(1, 'rgba(212, 255, 58, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // === HEADER ===
  // FUEL wordmark — large, no mark
  const headerY = 100;
  ctx.fillStyle = C.text;
  ctx.font = 'bold 64px "Archivo Black", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('FUEL', 80, headerY);

  // Date (top right)
  ctx.fillStyle = C.textDim;
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const monthDay = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  ctx.fillText(`${weekday} · ${monthDay}`, W - 80, headerY);

  // === CALORIE RING ===
  const ringCX = W / 2;
  const ringCY = 470;
  const ringR = 200;
  const ringWidth = 22;

  // Background ring
  ctx.strokeStyle = C.bgElev3;
  ctx.lineWidth = ringWidth;
  ctx.beginPath();
  ctx.arc(ringCX, ringCY, ringR, 0, Math.PI * 2);
  ctx.stroke();

  // Foreground ring
  const ringPct = Math.min(1, totals.kcal / target.kcal);
  let ringColor = C.accent;
  if (totals.kcal > target.kcal * 1.1) ringColor = C.danger;
  else if (totals.kcal > target.kcal) ringColor = C.warning;

  ctx.strokeStyle = ringColor;
  ctx.lineWidth = ringWidth;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(ringCX, ringCY, ringR, -Math.PI / 2, -Math.PI / 2 + ringPct * Math.PI * 2);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Ring center text — big number
  ctx.fillStyle = C.text;
  ctx.font = 'bold 110px "Archivo Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(String(totals.kcal), ringCX, ringCY + 10);

  // " / target kcal" below
  ctx.fillStyle = C.textDim;
  ctx.font = '500 26px "JetBrains Mono", monospace';
  ctx.fillText(`/ ${target.kcal} KCAL`, ringCX, ringCY + 50);

  // Percentage label below ring
  ctx.fillStyle = ringColor;
  ctx.font = 'bold 32px "Archivo Black", sans-serif';
  ctx.fillText(`${pct}% OF TARGET`, ringCX, ringCY + ringR + 70);

  // === MACRO BARS ===
  const macroY = 800;
  const macroW = 280;
  const macroGap = 30;
  const macroStartX = (W - 3 * macroW - 2 * macroGap) / 2;

  const macros = [
    { key: 'p', label: 'PROTEIN', color: C.macroP, value: Math.round(totals.p), target: target.p },
    { key: 'c', label: 'CARBS', color: C.macroC, value: Math.round(totals.c), target: target.c },
    { key: 'f', label: 'FAT', color: C.macroF, value: Math.round(totals.f), target: target.f }
  ];

  macros.forEach((m, i) => {
    const x = macroStartX + i * (macroW + macroGap);

    // Card background
    ctx.fillStyle = C.bgElev;
    drawRoundedRect(ctx, x, macroY, macroW, 130, 18);
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label
    ctx.fillStyle = C.textMuted;
    ctx.font = '500 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(m.label, x + 22, macroY + 32);

    // Target on right
    ctx.fillStyle = C.textDim;
    ctx.font = '400 16px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${m.target}g`, x + macroW - 22, macroY + 32);

    // Value
    ctx.fillStyle = C.text;
    ctx.font = 'bold 38px "Archivo Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const valueY = macroY + 78;
    ctx.fillText(`${m.value}`, x + 22, valueY);
    const valueWidth = ctx.measureText(`${m.value}`).width;
    // " g" suffix — slightly smaller, baseline-aligned to value
    ctx.fillStyle = C.textMuted;
    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillText(' g', x + 22 + valueWidth + 4, valueY);

    // Progress bar
    const barX = x + 22;
    const barY = macroY + 102;
    const barW = macroW - 44;
    const barH = 8;
    ctx.fillStyle = C.bgElev3;
    drawRoundedRect(ctx, barX, barY, barW, barH, 4);
    ctx.fill();
    const fillPct = Math.min(1, m.value / m.target);
    if (fillPct > 0) {
      ctx.fillStyle = m.color;
      drawRoundedRect(ctx, barX, barY, barW * fillPct, barH, 4);
      ctx.fill();
    }
  });

  // === SUMMARY ROWS ===
  const rows = [];
  if (mealCount > 0) rows.push({ icon: '🍽️', text: `${mealCount} ${mealCount === 1 ? 'meal' : 'meals'} logged` });
  if (day.trained) rows.push({ icon: '💪', text: 'Training day', color: C.accent });
  if (day.weight) rows.push({ icon: '⚖️', text: `${day.weight} kg` });
  if (day.steps) rows.push({ icon: '👟', text: `${day.steps.toLocaleString('en-US')} steps` });
  if (streak >= 2) rows.push({ icon: '🔥', text: `${streak}-day streak`, color: C.accent });

  const rowsStartY = 1010;
  const rowHeight = 50;
  const rowsX = 130;
  rows.forEach((r, i) => {
    const y = rowsStartY + i * rowHeight;
    ctx.font = '32px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(r.icon, rowsX, y);

    ctx.fillStyle = r.color || C.text;
    ctx.font = '600 26px "Inter Tight", sans-serif';
    ctx.fillText(r.text, rowsX + 60, y);
  });

  // === FOOTER ===
  // Divider
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, H - 100);
  ctx.lineTo(W - 80, H - 100);
  ctx.stroke();

  // Footer text
  ctx.fillStyle = C.textMuted;
  ctx.font = '500 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('FUEL — 100% FREE FOREVER', W - 80, H - 60);

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => {
      if (b) resolve(b);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png', 0.95);
  });
}

// Canvas helper: rounded rectangle with all four corners equal
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Canvas helper: rounded rectangle with per-corner radii (for the flame logo shape)
function drawRoundedRectAsymmetric(ctx, x, y, w, h, rTL, rTR, rBR, rBL) {
  ctx.beginPath();
  ctx.moveTo(x + rTL, y);
  ctx.lineTo(x + w - rTR, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rTR);
  ctx.lineTo(x + w, y + h - rBR);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rBR, y + h);
  ctx.lineTo(x + rBL, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rBL);
  ctx.lineTo(x, y + rTL);
  ctx.quadraticCurveTo(x, y, x + rTL, y);
  ctx.closePath();
}

// ============== SCREEN: STATS ==============
function renderStats() {
  // Weekly averages over last 4 weeks
  const weeks = [];
  for (let w = 0; w < 4; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const k = dayKey(-(w * 7 + d));
      const t = dayTotals(k);
      const day = STATE.log[k] || {};
      days.push({ date: k, kcal: t.kcal, p: t.p, c: t.c, f: t.f, weight: day.weight, trained: day.trained });
    }
    const tracked = days.filter(d => d.kcal > 0);
    const trainings = days.filter(d => d.trained).length;
    weeks.push({
      label: w === 0 ? 'This week' : `${w} week${w > 1 ? 's' : ''} ago`,
      avgKcal: tracked.length > 0 ? Math.round(tracked.reduce((s,d) => s + d.kcal, 0) / tracked.length) : 0,
      trackedDays: tracked.length,
      trainings
    });
  }

  const target = calcCalorieTarget(STATE.profile);

  // 7-day kcal bar chart
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const k = dayKey(-i);
    const t = dayTotals(k);
    last7.push({ date: k, kcal: t.kcal });
  }

  // Streak
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const k = dayKey(-i);
    const t = dayTotals(k);
    if (t.kcal > 0) streak++;
    else break;
  }

  // Macro distribution last 7 days
  const macroSum = last7.reduce((s, d) => {
    const day = dayTotals(d.date);
    return { p: s.p + day.p, c: s.c + day.c, f: s.f + day.f, kcal: s.kcal + day.kcal };
  }, { p: 0, c: 0, f: 0, kcal: 0 });
  const macroPctP = macroSum.kcal > 0 ? Math.round((macroSum.p * 4 / macroSum.kcal) * 100) : 0;
  const macroPctC = macroSum.kcal > 0 ? Math.round((macroSum.c * 4 / macroSum.kcal) * 100) : 0;
  const macroPctF = macroSum.kcal > 0 ? Math.round((macroSum.f * 9 / macroSum.kcal) * 100) : 0;

  render(`
    <div class="screen">
      <div class="header">
        <div class="logo">FUEL</div>
        <div class="eyebrow">Progress</div>
      </div>

      <div class="today-banner">
        <div class="eyebrow">Streak</div>
        <h1 class="today-title">${streak} ${streak === 1 ? 'day' : 'days'}</h1>
        <p class="today-sub">${streak >= 7 ? '🔥 Keep it up!' : streak === 0 ? 'Track today to start a streak.' : 'Building consistency.'}</p>
      </div>

      <h3 class="section-title">Last 7 days</h3>
      <div class="card">
        ${render7DayChart(last7, target)}
      </div>

      <h3 class="section-title">Macro split <span class="count">last 7d</span></h3>
      ${macroSum.kcal > 0 ? `
        <div class="card">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px;">
            <div style="text-align:center;">
              <div style="font-family:var(--font-display);font-size:28px;color:var(--macro-protein);">${macroPctP}%</div>
              <div class="eyebrow" style="margin-top:4px;">PROTEIN</div>
            </div>
            <div style="text-align:center;">
              <div style="font-family:var(--font-display);font-size:28px;color:var(--macro-carbs);">${macroPctC}%</div>
              <div class="eyebrow" style="margin-top:4px;">CARBS</div>
            </div>
            <div style="text-align:center;">
              <div style="font-family:var(--font-display);font-size:28px;color:var(--macro-fat);">${macroPctF}%</div>
              <div class="eyebrow" style="margin-top:4px;">FAT</div>
            </div>
          </div>
          <div style="display:flex;height:12px;border-radius:6px;overflow:hidden;background:var(--bg-elev-3);">
            <div style="width:${macroPctP}%;background:var(--macro-protein);"></div>
            <div style="width:${macroPctC}%;background:var(--macro-carbs);"></div>
            <div style="width:${macroPctF}%;background:var(--macro-fat);"></div>
          </div>
        </div>
      ` : `<div class="card"><div class="empty"><div>No meals logged in the past week.</div></div></div>`}

      <h3 class="section-title">Weekly summary</h3>
      <div class="card" style="padding:0;">
        ${weeks.map((w, i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;${i < weeks.length - 1 ? 'border-bottom:1px solid var(--border);' : ''}">
            <div>
              <div style="font-weight:600;font-size:13px;">${w.label}</div>
              <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-top:2px;">
                ${w.trackedDays} days tracked · ${w.trainings} ${w.trainings === 1 ? 'training' : 'trainings'}
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--font-display);font-size:18px;color:var(--accent);">${w.avgKcal || '—'}</div>
              <div class="eyebrow">AVG KCAL</div>
            </div>
          </div>
        `).join('')}
      </div>

      <h3 class="section-title">Profile</h3>
      <div class="card">
        <div class="list-row">
          <span class="list-row-label">Goal</span>
          <span class="list-row-value">${({cut:'Lose fat', maintain:'Maintain', bulk:'Build muscle'})[STATE.profile.goal]}</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">Activity</span>
          <span class="list-row-value">${STATE.profile.activity}</span>
        </div>
        <div class="list-row">
          <span class="list-row-label">Daily target</span>
          <span class="list-row-value" style="color:var(--accent);">${target} kcal</span>
        </div>
      </div>
    </div>
  `);
}

function render7DayChart(days, target) {
  const w = 440;
  const h = 180;
  const pad = { top: 16, right: 12, bottom: 30, left: 36 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const maxKcal = Math.max(target * 1.3, ...days.map(d => d.kcal), 100);
  const barW = innerW / days.length * 0.7;
  const gap = innerW / days.length * 0.3;

  const targetY = pad.top + innerH - (target / maxKcal) * innerH;

  return `
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:180px;">
      <line x1="${pad.left}" y1="${targetY}" x2="${w - pad.right}" y2="${targetY}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>
      <text x="${w - pad.right}" y="${targetY - 4}" fill="var(--accent)" font-family="JetBrains Mono" font-size="9" text-anchor="end">target ${target}</text>
      ${days.map((d, i) => {
        const x = pad.left + i * (innerW / days.length) + gap / 2;
        const barH = (d.kcal / maxKcal) * innerH;
        const y = pad.top + innerH - barH;
        const overTarget = d.kcal > target * 1.1;
        const underTarget = d.kcal > 0 && d.kcal < target * 0.7;
        const fill = d.kcal === 0 ? 'var(--bg-elev-3)' : overTarget ? 'var(--warning)' : underTarget ? 'var(--macro-protein)' : 'var(--accent)';
        const dt = new Date(d.date);
        return `
          <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="${fill}"/>
          ${d.kcal > 0 ? `<text x="${x + barW/2}" y="${y - 4}" fill="var(--text)" font-family="JetBrains Mono" font-size="9" text-anchor="middle">${d.kcal}</text>` : ''}
          <text x="${x + barW/2}" y="${h - 14}" fill="var(--text-muted)" font-family="JetBrains Mono" font-size="9" text-anchor="middle">${dt.toLocaleDateString('en-US',{weekday:'short'}).slice(0,3)}</text>
          <text x="${x + barW/2}" y="${h - 4}" fill="var(--text-muted)" font-family="JetBrains Mono" font-size="9" text-anchor="middle">${dt.getDate()}</text>
        `;
      }).join('')}
    </svg>
  `;
}


// ============== SETTINGS ==============
function openSettings() {
  const profile = STATE.profile;
  const customTarget = STATE.customTarget;
  const autoTarget = profile ? (() => {
    const saved = STATE.customTarget;
    STATE.customTarget = null;
    const t = calcCalorieTarget(profile);
    STATE.customTarget = saved;
    return t;
  })() : 0;

  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="closeModal()" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">Settings</h2>

      <div class="eyebrow" style="margin-bottom:8px;">Photo recognition</div>
      <p style="color:var(--text-dim);font-size:12px;margin-bottom:10px;line-height:1.5;">
        Paste your Anthropic API key to enable photo-based food recognition. Photos go directly to api.anthropic.com — nothing is stored on any server.
        Get a key at <span style="color:var(--accent);">console.anthropic.com</span>.
      </p>
      <input type="password" id="api-key-input" placeholder="sk-ant-api03-..." value="${profile?.apiKey ? '••••••••••••' + profile.apiKey.slice(-4) : ''}" style="text-align:left;font-family:var(--font-mono);font-size:13px;font-weight:400;">
      <div style="display:flex;gap:8px;margin-top:8px;margin-bottom:24px;">
        <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="saveApiKey()">Save key</button>
        ${profile?.apiKey ? `<button class="btn btn-ghost btn-sm" onclick="clearApiKey()">Remove</button>` : ''}
      </div>

      <div class="eyebrow" style="margin-bottom:8px;">Goal</div>
      <div class="pill-row">
        ${[
          { id: 'cut', label: 'Lose fat' },
          { id: 'maintain', label: 'Maintain' },
          { id: 'bulk', label: 'Build muscle' }
        ].map(g => `<span class="pill ${profile?.goal === g.id ? 'active' : ''}" onclick="changeGoal('${g.id}')">${g.label}</span>`).join('')}
      </div>

      <div class="eyebrow" style="margin:24px 0 8px;">Activity level</div>
      <div class="pill-row">
        ${[
          { id: 'sedentary', label: 'Sedentary' },
          { id: 'light', label: 'Light' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'active', label: 'Active' },
          { id: 'very', label: 'Very active' }
        ].map(a => `<span class="pill ${profile?.activity === a.id ? 'active' : ''}" onclick="changeActivity('${a.id}')">${a.label}</span>`).join('')}
      </div>

      <div class="eyebrow" style="margin:24px 0 8px;">Daily calorie target</div>
      <div class="card" style="padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
          <div>
            <div style="font-family:var(--font-display);font-size:22px;color:var(--accent);">${calcCalorieTarget(profile)} kcal</div>
            <div class="eyebrow" style="margin-top:2px;">${customTarget ? 'CUSTOM OVERRIDE' : 'AUTO-CALCULATED'}</div>
          </div>
          ${customTarget ? `<button class="btn btn-ghost btn-sm" onclick="resetTarget()">Reset to auto</button>` : ''}
        </div>
        ${customTarget ? `<div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);">Auto would be: ${autoTarget} kcal</div>` : ''}
      </div>
      <button class="btn btn-secondary btn-sm btn-block" style="margin-top:8px;" onclick="openCustomTarget()">Set custom target</button>

      <div class="eyebrow" style="margin:24px 0 8px;">My foods</div>
      ${(STATE.customFoods && STATE.customFoods.length)
        ? STATE.customFoods.map((cf, i) => `
          <div class="food-result" style="cursor:default;">
            <div class="meal-thumb" style="background:var(--bg-elev-2);">${cf.emoji || '⭐'}</div>
            <div class="food-result-info">
              <div class="food-result-name">${escapeHtml(cf.name)}</div>
              <div class="food-result-meta">per 100g · ${cf.kcal} kcal · P ${cf.p} · C ${cf.c} · F ${cf.f}</div>
            </div>
            <button class="btn-icon" onclick="editCustomFood(${i})" aria-label="Edit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon" onclick="deleteCustomFood(${i})" aria-label="Delete" style="color:var(--danger);">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        `).join('')
        : `<p style="color:var(--text-dim);font-size:12px;line-height:1.5;">No saved foods yet. When you add a meal manually, flip <strong>Save to my foods</strong> to reuse it from search.</p>`
      }

      <div class="eyebrow" style="margin:24px 0 8px;">Data</div>
      <button class="btn btn-secondary btn-block btn-sm" onclick="exportData()" style="margin-bottom:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        Export backup (JSON)
      </button>
      <button class="btn btn-secondary btn-block btn-sm" onclick="importData()" style="margin-bottom:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        Import backup
      </button>
      <button class="btn btn-secondary btn-block btn-sm" onclick="checkPersistent()" style="margin-bottom:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8C4 5.6 7.6 2 12 2s8 3.6 8 8.2C20 17.5 12 22 12 22z"/></svg>
        Storage: ${STATE.storagePersistent ? 'Persistent ✓' : 'Tap to make persistent'}
      </button>

      <div class="eyebrow" style="margin:24px 0 8px;">Danger</div>
      <button class="btn btn-danger btn-block btn-sm" onclick="confirmReset()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        Reset all data
      </button>

      <div style="text-align:center;margin-top:24px;color:var(--text-muted);font-family:var(--font-mono);font-size:10px;letter-spacing:0.1em;">FUEL · v1.0.1</div>
    </div>
  `);
}

function editCustomFood(idx) {
  const cf = (STATE.customFoods || [])[idx];
  if (!cf) return;
  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="openSettings()" aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <h2 class="modal-title">Edit food</h2>
      <p style="color:var(--text-dim);font-size:12px;margin-bottom:16px;line-height:1.5;">Values are per 100 g — they scale to any portion when you add this food.</p>

      <label>Name</label>
      <input type="text" id="cf-name" value="${escapeHtml(cf.name)}" style="text-align:left;font-size:15px;font-weight:500;font-family:var(--font-body);">

      <label style="margin-top:16px;">Calories (kcal / 100g)</label>
      <input type="number" id="cf-kcal" value="${cf.kcal}" min="0">

      <div class="qty-row" style="margin-top:16px;">
        <div class="qty-input-group">
          <label>Protein g</label>
          <input type="number" id="cf-p" value="${cf.p}" min="0" step="0.1">
        </div>
        <div class="qty-input-group">
          <label>Carbs g</label>
          <input type="number" id="cf-c" value="${cf.c}" min="0" step="0.1">
        </div>
      </div>
      <div class="qty-input-group" style="margin:16px 0;">
        <label>Fat g</label>
        <input type="number" id="cf-f" value="${cf.f}" min="0" step="0.1">
      </div>

      <button class="btn btn-primary btn-block btn-lg" onclick="saveCustomFood(${idx})">Save</button>
    </div>
  `);
}

function saveCustomFood(idx) {
  const cf = (STATE.customFoods || [])[idx];
  if (!cf) return;
  const name = document.getElementById('cf-name').value.trim();
  const kcal = parseFloat(document.getElementById('cf-kcal').value) || 0;
  if (!name) { toast('Enter a name', 'danger'); return; }
  if (kcal <= 0) { toast('Enter calories', 'danger'); return; }
  cf.name = name;
  cf.kcal = Math.round(kcal);
  cf.p = parseFloat(document.getElementById('cf-p').value) || 0;
  cf.c = parseFloat(document.getElementById('cf-c').value) || 0;
  cf.f = parseFloat(document.getElementById('cf-f').value) || 0;
  save();
  toast('Saved');
  openSettings();
}

function deleteCustomFood(idx) {
  const cf = (STATE.customFoods || [])[idx];
  if (!cf) return;
  openModal(`
    <div style="position:relative;">
      <h2 class="modal-title">Delete food?</h2>
      <p style="color:var(--text-dim);font-size:13px;margin-bottom:20px;line-height:1.5;">Remove <strong>${escapeHtml(cf.name)}</strong> from your foods? Meals you already logged with it stay unchanged.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button class="btn btn-secondary" onclick="openSettings()">Cancel</button>
        <button class="btn btn-danger" onclick="confirmDeleteCustomFood(${idx})">Delete</button>
      </div>
    </div>
  `);
}

function confirmDeleteCustomFood(idx) {
  if (Array.isArray(STATE.customFoods)) STATE.customFoods.splice(idx, 1);
  save();
  toast('Deleted');
  openSettings();
}

function saveApiKey() {
  const inp = document.getElementById('api-key-input');
  const value = inp.value.trim();
  if (!value || value.startsWith('••')) return;
  if (!value.startsWith('sk-ant-')) {
    toast('Key should start with sk-ant-', 'danger');
    return;
  }
  STATE.profile.apiKey = value;
  save();
  toast('API key saved');
  openSettings();
}

function clearApiKey() {
  STATE.profile.apiKey = null;
  save();
  toast('API key removed');
  openSettings();
}

function changeGoal(goal) {
  STATE.profile.goal = goal;
  STATE.customTarget = null; // reset auto calibration on goal change
  STATE.lastCalibration = 0;
  save();
  toast(`Goal: ${({cut:'Lose fat', maintain:'Maintain', bulk:'Build muscle'})[goal]}`);
  openSettings();
}

function changeActivity(activity) {
  STATE.profile.activity = activity;
  STATE.customTarget = null;
  save();
  toast(`Activity updated`);
  openSettings();
}

function openCustomTarget() {
  const current = calcCalorieTarget(STATE.profile);
  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="openSettings()" aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h2 class="modal-title">Custom target</h2>
      <p style="color:var(--text-dim);font-size:13px;margin-bottom:16px;">
        Override the auto-calculated target. Once set, FUEL won't auto-adjust this number based on your weight trend.
      </p>
      <input type="number" id="ct-input" value="${current}" step="50" min="800" max="6000" style="font-size:48px;padding:24px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px;">
        <button class="btn btn-secondary" onclick="openSettings()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmCustomTarget()">Save</button>
      </div>
    </div>
  `);
  setTimeout(() => document.getElementById('ct-input')?.focus(), 100);
}

function confirmCustomTarget() {
  const v = parseInt(document.getElementById('ct-input').value);
  if (!v || v < 800 || v > 6000) { toast('Enter 800-6000', 'danger'); return; }
  STATE.customTarget = v;
  save();
  toast(`Target: ${v} kcal/day`);
  openSettings();
}

function resetTarget() {
  STATE.customTarget = null;
  STATE.lastCalibration = 0;
  save();
  toast('Reset to auto');
  openSettings();
}

function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: STATE.profile,
    log: STATE.log,
    customFoods: STATE.customFoods || [],
    customTarget: STATE.customTarget
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fuel-backup-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  STATE.lastBackup = Date.now();
  save();
  toast('Backup exported');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.profile || !data.log) throw new Error('Invalid backup file');

        if (!confirm('This will replace all your current data. Continue?')) return;

        STATE.profile = data.profile;
        STATE.log = data.log;
        STATE.customFoods = Array.isArray(data.customFoods) ? data.customFoods : (STATE.customFoods || []);
        STATE.customTarget = data.customTarget || null;
        save();
        closeModal();
        renderApp();
        toast('Backup restored');
      } catch (err) {
        toast('Invalid backup file', 'danger');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

async function checkPersistent() {
  const granted = await requestPersistentStorage();
  toast(granted ? 'Storage is now persistent ✓' : 'Browser declined persistent storage');
  openSettings();
}

function confirmReset() {
  openModal(`
    <div style="position:relative;">
      <button class="modal-close-btn" onclick="openSettings()" aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h2 class="modal-title" style="color:var(--danger);">Reset all data?</h2>
      <p style="color:var(--text-dim);font-size:14px;margin-bottom:20px;line-height:1.5;">
        This will permanently delete your profile, all logs, weight history, and settings. This cannot be undone.
      </p>
      <p style="color:var(--text-dim);font-size:13px;margin-bottom:20px;">
        Consider exporting a backup first.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <button class="btn btn-secondary" onclick="openSettings()">Cancel</button>
        <button class="btn btn-danger" onclick="doReset()">Delete all</button>
      </div>
    </div>
  `);
}

function doReset() {
  localStorage.removeItem('fuel-data');
  STATE.profile = null;
  STATE.log = {};
  STATE.customTarget = null;
  STATE.lastCalibration = 0;
  closeModal();
  renderApp();
  toast('All data cleared');
}

// ============== ROUTER & INIT ==============
function renderApp() {
  if (!STATE.profile) {
    onboardData = { step: 0, sex: null, age: null, height: null, weight: null, goal: null, activity: null };
    renderOnboarding();
    return;
  }

  showNav(true);

  switch (STATE.view) {
    case 'today': renderToday(); break;
    case 'log': renderLog(); break;
    case 'plan': renderPlan(); break;
    case 'body': renderBody(); break;
    case 'stats': renderStats(); break;
    default: renderToday();
  }

  // Update active nav
  $$('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === STATE.view);
  });
}

function setupNav() {
  $$('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.view = btn.dataset.tab;
      // Reset to today's date when re-entering Today
      if (STATE.view === 'today') STATE.currentDate = todayKey();
      renderApp();
      window.scrollTo(0, 0);
    });
  });
}

function init() {
  load();
  setupNav();
  renderApp();
  requestPersistentStorage();

  // Run weekly calibration check
  setTimeout(maybeRecalibrate, 1000);

  // Save on tab close / app suspend
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) save();
  });
}

document.addEventListener('DOMContentLoaded', init);
