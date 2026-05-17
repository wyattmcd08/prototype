/* ============================================
   DIALED DAWG - APP LOGIC
   ============================================ */

// ============ STATE ============
const state = {
  currentPage: 'home',
  workoutActive: false,
  workoutTimer: 0,
  workoutTimerInterval: null,
  waterCups: 0,
  maxWaterCups: 8,
  data: {}
};

// ============ MOCK DATA ============
const mockData = {
  user: { name: 'Alex', goal: 'Build Muscle', weight: 195, bodyFat: 14, streak: 12 },
  nutrition: {
    calorieGoal: 3200, caloriesEaten: 2140, caloriesBurned: 380,
    protein: { eaten: 178, goal: 220 },
    carbs: { eaten: 245, goal: 320 },
    fat: { eaten: 68, goal: 85 },
    meals: {
      breakfast: { cals: 640, foods: [
        { name: 'Eggs & Whites', serving: '3 eggs + 4 whites', cals: 260 },
        { name: 'Oatmeal', serving: '1 cup dry', cals: 300 },
        { name: 'Blueberries', serving: '1 cup', cals: 80 }
      ]},
      lunch: { cals: 720, foods: [
        { name: 'Chicken Breast', serving: '8oz', cals: 370 },
        { name: 'White Rice', serving: '1.5 cups cooked', cals: 300 },
        { name: 'Broccoli', serving: '2 cups', cals: 50 }
      ]},
      dinner: { cals: 580, foods: [
        { name: 'Ground Beef 90/10', serving: '6oz', cals: 330 },
        { name: 'Sweet Potato', serving: '1 large', cals: 180 },
        { name: 'Asparagus', serving: '1 cup', cals: 70 }
      ]},
      snacks: { cals: 200, foods: [
        { name: 'Greek Yogurt', serving: '1 cup', cals: 130 },
        { name: 'Almonds', serving: '1oz', cals: 70 }
      ]}
    }
  },
  workout: {
    todayName: 'Push Day A',
    todayType: 'CHEST / SHOULDERS / TRIS',
    exercises: ['Bench Press', 'Incline DB Press', 'Shoulder Press', 'Lateral Raises', 'Tricep Pushdown']
  },
  prs: {
    bench: { weight: 275, unit: 'lbs', date: '3 days ago' },
    squat: { weight: 365, unit: 'lbs', date: '1 week ago' },
    deadlift: { weight: 405, unit: 'lbs', date: '2 weeks ago' }
  },
  recovery: {
    score: 76,
    muscles: [
      { name: 'Chest', fatigue: 72, level: 'moderate', lastTrained: '1 day' },
      { name: 'Back', fatigue: 20, level: 'fresh', lastTrained: '4 days' },
      { name: 'Quads', fatigue: 85, level: 'fatigued', lastTrained: '2 days' },
      { name: 'Hamstrings', fatigue: 60, level: 'moderate', lastTrained: '2 days' },
      { name: 'Shoulders', fatigue: 30, level: 'fresh', lastTrained: '3 days' },
      { name: 'Biceps', fatigue: 15, level: 'fresh', lastTrained: '5 days' },
      { name: 'Triceps', fatigue: 72, level: 'moderate', lastTrained: '1 day' },
      { name: 'Core', fatigue: 10, level: 'fresh', lastTrained: '5 days' }
    ]
  },
  splits: [
    {
      id: 'push-pull-legs',
      name: 'Push / Pull / Legs',
      days: [
        {
          day: 'Mon', label: 'Push A', icon: '💪', type: 'active-day', exercises: [
            { name: 'Bench Press', icon: '🏋️', sets: '4 × 6-8', pr: '275 lbs' },
            { name: 'Incline DB Press', icon: '💪', sets: '3 × 10-12', pr: null },
            { name: 'Shoulder Press', icon: '🔝', sets: '4 × 8-10', pr: null },
            { name: 'Lateral Raises', icon: '↔️', sets: '4 × 15', pr: null },
            { name: 'Tricep Pushdown', icon: '⬇️', sets: '3 × 12', pr: null }
          ]
        },
        {
          day: 'Tue', label: 'Pull A', icon: '🏋', type: 'active-day', exercises: [
            { name: 'Barbell Row', icon: '🏋️', sets: '4 × 6-8', pr: null },
            { name: 'Pull-Ups', icon: '🔼', sets: '4 × 8', pr: null },
            { name: 'Cable Row', icon: '💪', sets: '3 × 12', pr: null },
            { name: 'Face Pulls', icon: '🔴', sets: '4 × 15', pr: null },
            { name: 'Bicep Curls', icon: '💪', sets: '3 × 12', pr: null }
          ]
        },
        {
          day: 'Wed', label: 'Legs A', icon: '🦵', type: 'active-day', exercises: [
            { name: 'Barbell Squat', icon: '🏋️', sets: '4 × 6-8', pr: '365 lbs' },
            { name: 'Romanian DL', icon: '🔩', sets: '3 × 10', pr: null },
            { name: 'Leg Press', icon: '🦵', sets: '3 × 12', pr: null },
            { name: 'Leg Curl', icon: '🔄', sets: '3 × 12', pr: null },
            { name: 'Calf Raises', icon: '⬆️', sets: '4 × 15', pr: null }
          ]
        },
        { day: 'Thu', label: 'Rest', icon: '😴', type: 'rest', exercises: [] },
        {
          day: 'Fri', label: 'Push B', icon: '💪', type: 'active-day', exercises: [
            { name: 'Bench Press', icon: '🏋️', sets: '4 × 4-6', pr: '275 lbs' },
            { name: 'Cable Fly', icon: '↔️', sets: '3 × 15', pr: null },
            { name: 'Arnold Press', icon: '🔝', sets: '3 × 10', pr: null },
            { name: 'Skull Crushers', icon: '💀', sets: '3 × 12', pr: null }
          ]
        },
        {
          day: 'Sat', label: 'Pull B', icon: '🏋', type: 'done', exercises: [
            { name: 'Deadlift', icon: '🏋️', sets: '4 × 4-5', pr: '405 lbs' },
            { name: 'Lat Pulldown', icon: '⬇️', sets: '4 × 10', pr: null },
            { name: 'Seated Row', icon: '🪑', sets: '3 × 12', pr: null },
            { name: 'Hammer Curls', icon: '🔨', sets: '3 × 12', pr: null }
          ]
        },
        { day: 'Sun', label: 'Rest', icon: '😴', type: 'rest', exercises: [] }
      ]
    }
  ],
  peptides: [
    { name: 'BPC-157', dose: '250mcg', schedule: 'AM / PM', color: '#4f8ef7', nextDose: '8:00 PM', vialLeft: '72%' },
    { name: 'TB-500', dose: '2.5mg', schedule: 'Every 3 days', color: '#3dd68c', nextDose: 'Tomorrow 9 AM', vialLeft: '45%' },
    { name: 'CJC-1295', dose: '1mg', schedule: 'Weekly', color: '#f5c842', nextDose: 'Sat 10 PM', vialLeft: '30%' }
  ],
  muscleGroups: [
    { name: 'Chest', icon: '🫁', topSet: '275 × 6', volume: '14,400 lbs this week', pr: 275 },
    { name: 'Back', icon: '🔙', topSet: '405 × 5', volume: '18,200 lbs this week', pr: 405 },
    { name: 'Legs', icon: '🦵', topSet: '365 × 8', volume: '22,100 lbs this week', pr: 365 },
    { name: 'Shoulders', icon: '💪', topSet: '185 × 6', volume: '8,400 lbs this week', pr: 185 },
    { name: 'Arms', icon: '💪', topSet: '145 × 8', volume: '6,200 lbs this week', pr: 145 },
    { name: 'Core', icon: '🔲', topSet: 'BW × 30', volume: '12 sets this week', pr: null }
  ],
  quotes: [
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "Pain is temporary. Results are forever.", author: "Arnold Schwarzenegger" },
    { text: "Success is usually the culmination of controlling failure.", author: "Sylvester Stallone" },
    { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
    { text: "It never gets easier. You just get stronger.", author: "Unknown" }
  ]
};

// ============ LOCAL STORAGE ============
function saveData(key, val) {
  try { localStorage.setItem('dd_' + key, JSON.stringify(val)); } catch(e) {}
}

function loadData(key, fallback) {
  try {
    const v = localStorage.getItem('dd_' + key);
    return v ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

// ============ NAVIGATION ============
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  const navItem = document.querySelector(`[data-nav="${page}"]`);
  if (navItem) navItem.classList.add('active');
  state.currentPage = page;
}

// ============ TOAST ============
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ============ MODAL ============
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// ============ WATER TRACKER ============
function initWater() {
  state.waterCups = loadData('water', 0);
  renderWaterCups();
}

function renderWaterCups() {
  const container = document.querySelector('.water-cups');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < state.maxWaterCups; i++) {
    const cup = document.createElement('div');
    cup.className = 'water-cup' + (i < state.waterCups ? ' filled' : '');
    cup.addEventListener('click', () => {
      state.waterCups = (i < state.waterCups) ? i : i + 1;
      saveData('water', state.waterCups);
      renderWaterCups();
      document.querySelector('.water-val').textContent = (state.waterCups * 8) + ' oz';
    });
    container.appendChild(cup);
  }
  const waterValEl = document.querySelector('.water-val');
  if (waterValEl) waterValEl.textContent = (state.waterCups * 8) + ' oz';
}

// ============ PROGRESS RINGS ============
function setRingProgress(svgId, pct, color) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const fill = svg.querySelector('.progress-ring-fill');
  const bg = svg.querySelector('.progress-ring-bg');
  const r = parseInt(fill.getAttribute('r'));
  const circ = 2 * Math.PI * r;
  fill.style.stroke = color || 'var(--accent-red)';
  fill.style.strokeDasharray = circ;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  setTimeout(() => {
    fill.style.strokeDashoffset = offset;
  }, 100);
}

// ============ HOME PAGE ============
function buildHome() {
  const d = mockData.nutrition;
  const remaining = d.calorieGoal - d.caloriesEaten + d.caloriesBurned;
  const pctEaten = Math.min((d.caloriesEaten / d.calorieGoal) * 100, 100);
  const quote = mockData.quotes[Math.floor(Math.random() * mockData.quotes.length)];

  document.getElementById('page-home').innerHTML = `
    <div class="greeting-block">
      <div class="greeting-sub">Good morning 👋</div>
      <div class="greeting-name">${mockData.user.name}.</div>
    </div>

    <!-- Calorie Hero -->
    <div class="calories-hero">
      <div class="cal-hero-top">
        <div>
          <div class="cal-hero-label">Calories Remaining</div>
          <div class="cal-hero-number">${remaining}</div>
          <div class="cal-hero-sub">
            Goal ${d.calorieGoal} · <span>${d.caloriesBurned} burned</span>
          </div>
        </div>
        <div class="cal-ring-wrap">
          <svg id="cal-ring" class="progress-ring-svg" width="72" height="72" viewBox="0 0 72 72">
            <circle class="progress-ring-bg" cx="36" cy="36" r="30" stroke-width="5"/>
            <circle class="progress-ring-fill" cx="36" cy="36" r="30" stroke-width="5"
              stroke-dasharray="188.5" stroke-dashoffset="188.5"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Macros -->
    <div class="macro-row">
      <div class="macro-item">
        <div class="macro-item-label">Protein</div>
        <div class="macro-item-val">${d.protein.eaten}<span style="font-size:12px;color:var(--text-muted)">g</span></div>
        <div class="macro-item-total">/ ${d.protein.goal}g</div>
        <div class="macro-bar-track">
          <div class="macro-bar-fill" style="background:var(--accent-blue);width:${(d.protein.eaten/d.protein.goal*100).toFixed(0)}%"></div>
        </div>
      </div>
      <div class="macro-item">
        <div class="macro-item-label">Carbs</div>
        <div class="macro-item-val">${d.carbs.eaten}<span style="font-size:12px;color:var(--text-muted)">g</span></div>
        <div class="macro-item-total">/ ${d.carbs.goal}g</div>
        <div class="macro-bar-track">
          <div class="macro-bar-fill" style="background:var(--accent-yellow);width:${(d.carbs.eaten/d.carbs.goal*100).toFixed(0)}%"></div>
        </div>
      </div>
      <div class="macro-item">
        <div class="macro-item-label">Fat</div>
        <div class="macro-item-val">${d.fat.eaten}<span style="font-size:12px;color:var(--text-muted)">g</span></div>
        <div class="macro-item-total">/ ${d.fat.goal}g</div>
        <div class="macro-bar-track">
          <div class="macro-bar-fill" style="background:var(--accent-orange);width:${(d.fat.eaten/d.fat.goal*100).toFixed(0)}%"></div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="action-btn primary" onclick="navigate('workout')">
        <div class="action-btn-icon">⚡</div>
        <div class="action-btn-text">
          <strong>Start Workout</strong>
          <span>Push Day A</span>
        </div>
      </div>
      <div class="action-btn secondary" onclick="navigate('nutrition')">
        <div class="action-btn-icon">🍽️</div>
        <div class="action-btn-text">
          <strong>Log Meal</strong>
          <span>Track food</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon">🔥</div>
        <div class="stat-card-val">${mockData.user.streak}</div>
        <div class="stat-card-label">Day Streak</div>
        <div class="stat-badge up">↑ On fire</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">💤</div>
        <div class="stat-card-val">7.2</div>
        <div class="stat-card-label">Sleep (hrs)</div>
        <div class="stat-badge neutral">Avg: 7.4</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">⚖️</div>
        <div class="stat-card-val">${mockData.user.weight}</div>
        <div class="stat-card-label">Body Weight (lbs)</div>
        <div class="stat-badge up">↑ +0.5 wk</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">🛡️</div>
        <div class="stat-card-val">76%</div>
        <div class="stat-card-label">Recovery</div>
        <div class="stat-badge up">Good</div>
      </div>
    </div>

    <!-- Today's Workout -->
    <div class="section-header">
      <div class="section-title">Today's Workout</div>
      <div class="section-action" onclick="navigate('workout')">View all</div>
    </div>
    <div class="workout-today-card">
      <div class="workout-today-header">
        <span class="workout-today-tag">${mockData.workout.todayType}</span>
        <span style="font-size:13px;color:var(--text-secondary)">~65 min</span>
      </div>
      <div class="workout-today-title">${mockData.workout.todayName}</div>
      <div class="workout-today-meta">5 exercises · 20 sets</div>
      <div class="exercise-preview-list">
        ${mockData.workout.exercises.map(e => `<div class="exercise-preview-item">${e}</div>`).join('')}
      </div>
    </div>

    <!-- Water Tracker -->
    <div class="water-tracker-row">
      <div class="water-icon">💧</div>
      <div class="water-info">
        <div class="water-label">Water Intake</div>
        <div class="water-val">${state.waterCups * 8} oz</div>
      </div>
      <div class="water-cups"></div>
    </div>

    <!-- Quote -->
    <div class="quote-card">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>

    <!-- PRs -->
    <div class="section-header">
      <div class="section-title">Top PRs</div>
      <div class="section-action" onclick="navigate('progress')">All lifts</div>
    </div>
    <div class="pr-hero-row">
      <div class="pr-card gold">
        <div class="pr-trophy">🥇</div>
        <div class="pr-exercise">Bench</div>
        <div class="pr-weight">${mockData.prs.bench.weight}<br><span class="pr-unit">${mockData.prs.bench.unit}</span></div>
      </div>
      <div class="pr-card gold">
        <div class="pr-trophy">🥇</div>
        <div class="pr-exercise">Squat</div>
        <div class="pr-weight">${mockData.prs.squat.weight}<br><span class="pr-unit">${mockData.prs.squat.unit}</span></div>
      </div>
      <div class="pr-card gold">
        <div class="pr-trophy">🥇</div>
        <div class="pr-exercise">Deadlift</div>
        <div class="pr-weight">${mockData.prs.deadlift.weight}<br><span class="pr-unit">${mockData.prs.deadlift.unit}</span></div>
      </div>
    </div>
  `;

  renderWaterCups();
  setTimeout(() => setRingProgress('cal-ring', pctEaten, 'var(--accent-red)'), 200);
}

// ============ WORKOUT PAGE ============
function buildWorkout() {
  const split = mockData.splits[0];
  document.getElementById('page-workout').innerHTML = `
    <div class="section-header" style="margin-top:8px">
      <div class="section-title">My Split</div>
      <div class="section-action" onclick="showToast('New split coming soon!')">+ New</div>
    </div>

    <div class="split-tabs">
      <div class="split-tab active">${split.name}</div>
      <div class="split-tab" onclick="showToast('Create a new split!')">+ Add Split</div>
    </div>

    <div class="start-workout-btn" onclick="startWorkout()" style="margin-bottom:16px">
      ⚡ Start Today's Workout
    </div>

    ${split.days.map((d, i) => `
      <div class="day-card" id="day-card-${i}">
        <div class="day-card-header" onclick="toggleDayCard(${i})">
          <div class="day-card-left">
            <div class="day-dot ${d.type}">${d.day}</div>
            <div>
              <div class="day-card-title">${d.label}</div>
              <div class="day-card-meta">${d.exercises.length > 0 ? d.exercises.length + ' exercises' : 'Rest day'}</div>
            </div>
          </div>
          ${d.exercises.length > 0 ? '<div class="day-card-chevron">▼</div>' : ''}
        </div>
        ${d.exercises.length > 0 ? `
          <div class="day-card-body">
            ${d.exercises.map(ex => `
              <div class="exercise-item">
                <div class="exercise-icon">${ex.icon}</div>
                <div>
                  <div class="exercise-name">${ex.name}</div>
                  <div class="exercise-sets">${ex.sets}</div>
                </div>
                ${ex.pr ? `<div class="exercise-pr">🏆 ${ex.pr}</div>` : ''}
              </div>
            `).join('')}
            <div class="add-exercise-btn" onclick="showToast('Exercise editor coming soon!')">+ Add Exercise</div>
          </div>
        ` : ''}
      </div>
    `).join('')}
  `;
}

function toggleDayCard(i) {
  const card = document.getElementById('day-card-' + i);
  if (card) card.classList.toggle('expanded');
}

function startWorkout() {
  state.workoutActive = true;
  state.workoutTimer = 0;
  const bar = document.getElementById('active-workout-bar');
  if (bar) bar.classList.add('visible');
  clearInterval(state.workoutTimerInterval);
  state.workoutTimerInterval = setInterval(() => {
    state.workoutTimer++;
    const mins = String(Math.floor(state.workoutTimer / 60)).padStart(2, '0');
    const secs = String(state.workoutTimer % 60).padStart(2, '0');
    const timerEl = document.getElementById('workout-timer');
    if (timerEl) timerEl.textContent = mins + ':' + secs;
  }, 1000);
  showToast('🔥 Workout started! Let\'s go!');
}

function stopWorkout() {
  state.workoutActive = false;
  clearInterval(state.workoutTimerInterval);
  const bar = document.getElementById('active-workout-bar');
  if (bar) bar.classList.remove('visible');
  showToast('✅ Workout logged! Great session!');
}

// ============ PROGRESS PAGE ============
function buildProgress() {
  document.getElementById('page-progress').innerHTML = `
    <div class="section-header" style="margin-top:8px">
      <div class="section-title">Top PRs</div>
    </div>

    <div class="pr-hero-row">
      <div class="pr-card gold" onclick="showToast('Bench PR: 275 lbs × 6 reps')">
        <div class="pr-trophy">🥇</div>
        <div class="pr-exercise">Bench Press</div>
        <div class="pr-weight">${mockData.prs.bench.weight}</div>
        <div class="pr-unit">${mockData.prs.bench.unit}</div>
      </div>
      <div class="pr-card gold" onclick="showToast('Squat PR: 365 lbs × 6 reps')">
        <div class="pr-trophy">🥇</div>
        <div class="pr-exercise">Back Squat</div>
        <div class="pr-weight">${mockData.prs.squat.weight}</div>
        <div class="pr-unit">${mockData.prs.squat.unit}</div>
      </div>
      <div class="pr-card gold" onclick="showToast('Deadlift PR: 405 lbs × 5 reps')">
        <div class="pr-trophy">🥇</div>
        <div class="pr-exercise">Deadlift</div>
        <div class="pr-weight">${mockData.prs.deadlift.weight}</div>
        <div class="pr-unit">${mockData.prs.deadlift.unit}</div>
      </div>
    </div>

    <!-- Strength Chart -->
    <div class="chart-container">
      <div class="chart-header">
        <div class="chart-title">Bench Press Trend</div>
        <div class="chart-range-tabs">
          <div class="chart-range-tab active" onclick="switchChartRange(this,'1M')">1M</div>
          <div class="chart-range-tab" onclick="switchChartRange(this,'3M')">3M</div>
          <div class="chart-range-tab" onclick="switchChartRange(this,'All')">All</div>
        </div>
      </div>
      <div class="mini-chart">
        <svg id="bench-chart-svg" viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent-red)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--accent-red)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,85 L50,80 L100,72 L150,65 L200,55 L250,42 L300,25" fill="none" stroke="var(--accent-red)" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M0,85 L50,80 L100,72 L150,65 L200,55 L250,42 L300,25 L300,100 L0,100 Z" fill="url(#lineGrad)"/>
          <circle cx="300" cy="25" r="4" fill="var(--accent-red)"/>
        </svg>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <span style="font-size:11px;color:var(--text-muted)">6 weeks ago</span>
        <span style="font-size:11px;color:var(--accent-green);font-weight:600">+25 lbs ↑</span>
        <span style="font-size:11px;color:var(--text-muted)">Today</span>
      </div>
    </div>

    <!-- Volume Chart -->
    <div class="chart-container">
      <div class="chart-header">
        <div class="chart-title">Weekly Volume</div>
      </div>
      <div style="display:flex;align-items:flex-end;gap:8px;height:80px;padding:0 4px">
        ${[55, 70, 60, 85, 78, 92, 88].map((h, i) => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="width:100%;border-radius:4px 4px 0 0;background:${i===6?'var(--accent-red)':'rgba(232,56,61,0.3)'};height:${h}%"></div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:8px">
        ${['W1','W2','W3','W4','W5','W6','W7'].map(w => `<span style="flex:1;text-align:center;font-size:10px;color:var(--text-muted)">${w}</span>`).join('')}
      </div>
    </div>

    <!-- By Muscle Group -->
    <div class="section-header">
      <div class="section-title">By Muscle Group</div>
    </div>

    ${mockData.muscleGroups.map(m => `
      <div class="muscle-group-item" onclick="showToast('${m.name}: ${m.topSet}')">
        <div class="muscle-group-icon">${m.icon}</div>
        <div class="muscle-group-info">
          <div class="muscle-group-name">${m.name}</div>
          <div class="muscle-group-vol">${m.volume}</div>
        </div>
        <div>
          <div class="muscle-group-max">${m.topSet}</div>
          <div class="muscle-group-max-label">Top Set</div>
        </div>
      </div>
    `).join('')}
  `;
}

function switchChartRange(el, range) {
  el.closest('.chart-range-tabs').querySelectorAll('.chart-range-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  showToast(range + ' view selected');
}

// ============ NUTRITION PAGE ============
function buildNutrition() {
  const d = mockData.nutrition;
  const remaining = d.calorieGoal - d.caloriesEaten + d.caloriesBurned;
  const pctEaten = Math.min((d.caloriesEaten / d.calorieGoal) * 100, 100);
  const protPct = Math.min((d.protein.eaten / d.protein.goal * 100), 100);
  const carbPct = Math.min((d.carbs.eaten / d.carbs.goal * 100), 100);
  const fatPct = Math.min((d.fat.eaten / d.fat.goal * 100), 100);

  document.getElementById('page-nutrition').innerHTML = `
    <!-- Calorie Ring Hero -->
    <div class="cal-goal-hero">
      <div class="cal-goal-ring">
        <svg id="nut-ring" class="progress-ring-svg" width="88" height="88" viewBox="0 0 88 88">
          <circle class="progress-ring-bg" cx="44" cy="44" r="38" stroke-width="6"/>
          <circle class="progress-ring-fill" cx="44" cy="44" r="38" stroke-width="6"
            stroke-dasharray="238.8" stroke-dashoffset="238.8"/>
        </svg>
      </div>
      <div class="cal-goal-info">
        <div class="cal-goal-remaining">${remaining}</div>
        <div class="cal-goal-label">Calories Remaining</div>
        <div class="cal-goal-breakdown">
          <div class="cal-breakdown-item">
            <div class="cal-breakdown-val">${d.calorieGoal}</div>
            <div class="cal-breakdown-label">Goal</div>
          </div>
          <div style="width:1px;background:var(--border)"></div>
          <div class="cal-breakdown-item">
            <div class="cal-breakdown-val">${d.caloriesEaten}</div>
            <div class="cal-breakdown-label">Eaten</div>
          </div>
          <div style="width:1px;background:var(--border)"></div>
          <div class="cal-breakdown-item">
            <div class="cal-breakdown-val">${d.caloriesBurned}</div>
            <div class="cal-breakdown-label">Burned</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Macro Detail -->
    <div class="macro-detail-row">
      <div class="macro-detail-item">
        <div class="macro-detail-label">Protein</div>
        <div class="macro-detail-bar-wrap">
          <div class="macro-detail-bar" style="background:var(--accent-blue);width:${protPct}%"></div>
        </div>
        <div class="macro-detail-val">${d.protein.eaten}g / ${d.protein.goal}g</div>
      </div>
      <div class="macro-detail-item">
        <div class="macro-detail-label">Carbs</div>
        <div class="macro-detail-bar-wrap">
          <div class="macro-detail-bar" style="background:var(--accent-yellow);width:${carbPct}%"></div>
        </div>
        <div class="macro-detail-val">${d.carbs.eaten}g / ${d.carbs.goal}g</div>
      </div>
      <div class="macro-detail-item">
        <div class="macro-detail-label">Fat</div>
        <div class="macro-detail-bar-wrap">
          <div class="macro-detail-bar" style="background:var(--accent-orange);width:${fatPct}%"></div>
        </div>
        <div class="macro-detail-val">${d.fat.eaten}g / ${d.fat.goal}g</div>
      </div>
    </div>

    <!-- Calorie Calculator -->
    <div class="section-header">
      <div class="section-title">Calorie Calculator</div>
      <div class="section-action" onclick="openModal('modal-calc')">Open</div>
    </div>
    <div class="card" onclick="openModal('modal-calc')" style="cursor:pointer">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:28px">🧮</div>
        <div>
          <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:700">TDEE Calculator</div>
          <div style="font-size:13px;color:var(--text-secondary)">Set your calorie & macro targets</div>
        </div>
        <div style="margin-left:auto;font-size:18px;color:var(--text-muted)">›</div>
      </div>
    </div>

    <!-- Meals -->
    <div class="section-header">
      <div class="section-title">Today's Food</div>
    </div>

    ${Object.entries(d.meals).map(([mealName, meal]) => `
      <div class="meal-section">
        <div class="meal-section-header" onclick="toggleMealSection(this)">
          <div class="meal-section-title">${mealName.charAt(0).toUpperCase() + mealName.slice(1)}</div>
          <div class="meal-section-cal">${meal.cals} cal</div>
        </div>
        <div class="meal-section-body" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease">
          ${meal.foods.map(f => `
            <div class="meal-food-item">
              <div class="meal-food-name">${f.name}</div>
              <div class="meal-food-serving">${f.serving}</div>
              <div class="meal-food-cal">${f.cals}</div>
            </div>
          `).join('')}
          <div class="add-food-btn" onclick="showToast('Food search coming soon!')">
            <span>+</span> Add Food
          </div>
        </div>
      </div>
    `).join('')}

    <!-- Water -->
    <div class="section-header">
      <div class="section-title">Hydration</div>
    </div>
    <div class="water-tracker-row">
      <div class="water-icon">💧</div>
      <div class="water-info">
        <div class="water-label">Daily Water Goal: 64 oz</div>
        <div class="water-val">${state.waterCups * 8} oz</div>
      </div>
      <div class="water-cups"></div>
    </div>
  `;

  setTimeout(() => {
    setRingProgress('nut-ring', pctEaten, 'var(--accent-red)');
    renderWaterCups();
  }, 200);
}

function toggleMealSection(header) {
  const body = header.nextElementSibling;
  if (!body) return;
  const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
  body.style.maxHeight = isOpen ? '0px' : '1000px';
}

// ============ RECOVERY PAGE ============
function buildRecovery() {
  const r = mockData.recovery;
  const status = r.score >= 75 ? 'good' : r.score >= 50 ? 'moderate' : 'poor';
  const statusLabel = r.score >= 75 ? 'Well Recovered' : r.score >= 50 ? 'Moderate' : 'Fatigued';
  const statusDesc = r.score >= 75
    ? 'Your body is primed for a hard session. Hit a priority muscle group today.'
    : r.score >= 50
    ? 'Some fatigue detected. Keep volume moderate and focus on form.'
    : 'High fatigue. Consider an active recovery or rest day.';

  document.getElementById('page-recovery').innerHTML = `
    <!-- Recovery Score -->
    <div class="recovery-score-hero">
      <div class="recovery-ring-wrap">
        <svg id="rec-ring" class="progress-ring-svg" width="140" height="140" viewBox="0 0 140 140">
          <circle class="progress-ring-bg" cx="70" cy="70" r="60" stroke-width="8"/>
          <circle class="progress-ring-fill" cx="70" cy="70" r="60" stroke-width="8"
            stroke-dasharray="377" stroke-dashoffset="377"/>
        </svg>
        <div class="recovery-score-num">${r.score}</div>
        <div class="recovery-score-pct">/ 100</div>
      </div>
      <div class="recovery-status ${status}">${statusLabel}</div>
      <div class="recovery-desc">${statusDesc}</div>
    </div>

    <!-- Suggested Training -->
    <div class="card card-sm" style="background:var(--accent-green-dim);border-color:rgba(61,214,140,0.2)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">✅</span>
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--accent-green)">Suggested Today</div>
          <div style="font-size:13px;color:var(--text-secondary)">Back, Biceps — low fatigue, great gains</div>
        </div>
      </div>
    </div>

    <!-- Overtraining Warning -->
    <div class="card card-sm" style="background:rgba(245,200,66,0.06);border-color:rgba(245,200,66,0.2)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:20px">⚠️</span>
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--accent-yellow)">Monitor Legs</div>
          <div style="font-size:13px;color:var(--text-secondary)">Quads at 85% fatigue — wait 1 more day</div>
        </div>
      </div>
    </div>

    <!-- Muscle Fatigue -->
    <div class="section-header">
      <div class="section-title">Muscle Fatigue</div>
    </div>

    <div class="muscle-fatigue-grid">
      ${r.muscles.map(m => `
        <div class="muscle-fatigue-item">
          <div class="muscle-fatigue-name">${m.name}</div>
          <div class="fatigue-bar-track">
            <div class="fatigue-bar-fill ${m.level}" style="width:${m.fatigue}%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="fatigue-label ${m.level}">${m.level.charAt(0).toUpperCase() + m.level.slice(1)}</div>
            <div class="fatigue-days">${m.lastTrained} ago</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Recovery Inputs -->
    <div class="section-header">
      <div class="section-title">Log Recovery</div>
    </div>
    <div class="card">
      <div class="input-group" style="margin-bottom:12px">
        <div class="input-label">Sleep Last Night (hours)</div>
        <input type="number" class="styled-input" value="7.2" min="0" max="24" step="0.5"
          onchange="showToast('Sleep updated!')">
      </div>
      <div class="input-group" style="margin-bottom:0">
        <div class="input-label">Stress Level (1-10)</div>
        <input type="range" style="width:100%;accent-color:var(--accent-red)" min="1" max="10" value="4"
          onchange="showToast('Stress level: ' + this.value)">
      </div>
    </div>
  `;

  const recColor = r.score >= 75 ? 'var(--accent-green)' : r.score >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
  setTimeout(() => setRingProgress('rec-ring', r.score, recColor), 200);
}

// ============ CALENDAR PAGE ============
function buildCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = today.getDate();

  // Mock workout days
  const workoutDays = new Set([1,3,4,6,8,10,11,13,15,17,18,20,22,24,25]);
  const missedDays = new Set([5,12,19]);

  let calCells = '';
  for (let i = 0; i < firstDay; i++) calCells += '<div class="cal-day-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === todayDate;
    const isWorkout = workoutDays.has(d) && d < todayDate;
    const isMissed = missedDays.has(d) && d < todayDate;
    let cls = 'cal-day-cell';
    if (isToday) cls += ' today';
    else if (isWorkout) cls += ' workout';
    else if (isMissed) cls += ' missed';
    else if (d < todayDate) cls += ' rest-day';
    calCells += `<div class="${cls}">${d}</div>`;
  }

  // Consistency data
  const consistencyData = [
    { day: 'Mon', pct: 95 }, { day: 'Tue', pct: 88 }, { day: 'Wed', pct: 91 },
    { day: 'Thu', pct: 45 }, { day: 'Fri', pct: 89 }, { day: 'Sat', pct: 78 }, { day: 'Sun', pct: 30 }
  ];

  document.getElementById('page-calendar').innerHTML = `
    <!-- Streak -->
    <div class="streak-card">
      <div class="streak-icon">🔥</div>
      <div>
        <div class="streak-count">${mockData.user.streak}</div>
        <div class="streak-label">Day Workout Streak</div>
      </div>
      <div style="margin-left:auto;text-align:right">
        <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--text-primary)">87%</div>
        <div style="font-size:12px;color:var(--text-secondary)">Consistency</div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="card" style="padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700">${monthName} ${year}</div>
        <div style="display:flex;gap:4px">
          <div class="header-icon-btn" onclick="showToast('Previous month')">‹</div>
          <div class="header-icon-btn" onclick="showToast('Next month')">›</div>
        </div>
      </div>
      <div class="calendar-grid">
        ${['S','M','T','W','T','F','S'].map(d => `<div class="cal-day-header">${d}</div>`).join('')}
        ${calCells}
      </div>
      <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:10px;height:10px;border-radius:3px;background:var(--accent-red-dim);border:1px solid rgba(232,56,61,0.4)"></div>
          <span style="font-size:11px;color:var(--text-secondary)">Workout</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:10px;height:10px;border-radius:3px;background:rgba(255,255,255,0.04)"></div>
          <span style="font-size:11px;color:var(--text-secondary)">Rest</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:10px;height:10px;border-radius:3px;background:rgba(232,56,61,0.06)"></div>
          <span style="font-size:11px;color:var(--text-secondary)">Missed</span>
        </div>
      </div>
    </div>

    <!-- Habit Goals -->
    <div class="section-header">
      <div class="section-title">This Month</div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon">🏋️</div>
        <div class="stat-card-val">18</div>
        <div class="stat-card-label">Workouts Done</div>
        <div class="stat-badge up">/ 20 goal</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon">🎯</div>
        <div class="stat-card-val">14</div>
        <div class="stat-card-label">Calorie Goals Hit</div>
        <div class="stat-badge neutral">/ 18 tracked</div>
      </div>
    </div>

    <!-- Day Consistency -->
    <div class="section-header">
      <div class="section-title">Day of Week</div>
    </div>
    <div class="card">
      ${consistencyData.map(item => `
        <div class="consistency-item">
          <div class="consistency-day">${item.day}</div>
          <div class="consistency-bar-track">
            <div class="consistency-bar-fill" style="width:${item.pct}%"></div>
          </div>
          <div class="consistency-pct">${item.pct}%</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============ PEPTIDE PAGE ============
function buildPeptide() {
  document.getElementById('page-peptide').innerHTML = `
    <div class="section-header" style="margin-top:8px">
      <div class="section-title">Active Stack</div>
      <div class="section-action" onclick="showToast('Add peptide coming soon!')">+ Add</div>
    </div>

    ${mockData.peptides.map(p => `
      <div class="peptide-card">
        <div class="peptide-dot" style="background:${p.color}"></div>
        <div style="flex:1;min-width:0">
          <div class="peptide-name">${p.name}</div>
          <div class="peptide-meta">${p.dose} · ${p.schedule}</div>
          <div style="margin-top:6px;height:3px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden">
            <div style="height:100%;border-radius:99px;background:${p.color};width:${p.vialLeft}"></div>
          </div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:3px">Vial: ${p.vialLeft} remaining</div>
        </div>
        <div class="peptide-next">
          <div class="peptide-time">${p.nextDose}</div>
          <div class="peptide-due">Next dose</div>
        </div>
      </div>
    `).join('')}

    <!-- Reconstitution Calculator -->
    <div class="section-header">
      <div class="section-title">Reconstitution Calc</div>
    </div>
    <div class="recon-calc">
      <div class="input-group">
        <div class="input-label">Peptide Vial Size (mg)</div>
        <input type="number" class="styled-input" id="vial-size" value="5" min="0.1" step="0.1">
      </div>
      <div class="input-group">
        <div class="input-label">BAC Water Added (ml)</div>
        <input type="number" class="styled-input" id="bac-water" value="2" min="0.1" step="0.1">
      </div>
      <div class="input-group">
        <div class="input-label">Desired Dose (mcg)</div>
        <input type="number" class="styled-input" id="desired-dose" value="250" min="1">
      </div>
      <div class="input-group" style="margin-bottom:0">
        <div class="input-label">Syringe Size (units)</div>
        <select class="styled-select" id="syringe-size">
          <option value="100">100 unit (1ml)</option>
          <option value="50">50 unit (0.5ml)</option>
        </select>
      </div>

      <div class="calc-result-box" id="recon-result">
        <div class="calc-result-val" id="recon-val">—</div>
        <div class="calc-result-label">Units to draw on syringe</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px" id="recon-ml">Calculate to see result</div>
      </div>
      <button class="primary-btn" onclick="calcRecon()">Calculate Dose</button>
      <button class="secondary-btn" onclick="showToast('Dose saved to schedule!')">Save to Schedule</button>
    </div>

    <!-- Injection Schedule -->
    <div class="section-header">
      <div class="section-title">Today's Schedule</div>
    </div>
    <div class="card">
      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:32px;height:32px;border-radius:50%;background:rgba(79,142,247,0.15);border:2px solid var(--accent-blue);display:flex;align-items:center;justify-content:center;font-size:14px">✓</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:500;color:var(--text-secondary);text-decoration:line-through">BPC-157 · 250mcg</div>
            <div style="font-size:12px;color:var(--text-muted)">8:00 AM · Done</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--accent-red-dim);border:2px solid var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px">!</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600;color:var(--text-primary)">BPC-157 · 250mcg</div>
            <div style="font-size:12px;color:var(--accent-red)">8:00 PM · Due tonight</div>
          </div>
          <button style="padding:6px 12px;border-radius:8px;background:var(--accent-red);border:none;color:white;font-size:12px;font-weight:600;cursor:pointer" onclick="showToast('✅ Dose logged!')">Log</button>
        </div>
      </div>
    </div>
  `;
}

function calcRecon() {
  const vialMg = parseFloat(document.getElementById('vial-size').value) || 0;
  const bacMl = parseFloat(document.getElementById('bac-water').value) || 0;
  const doseMcg = parseFloat(document.getElementById('desired-dose').value) || 0;
  const syringeUnits = parseInt(document.getElementById('syringe-size').value) || 100;

  if (!vialMg || !bacMl || !doseMcg) {
    showToast('Please fill in all fields');
    return;
  }

  const vialUg = vialMg * 1000; // convert mg to mcg
  const concentration = vialUg / bacMl; // mcg per ml
  const mlToDraw = doseMcg / concentration; // ml to draw
  const unitsToDraw = mlToDraw * syringeUnits; // units on syringe

  document.getElementById('recon-val').textContent = unitsToDraw.toFixed(1);
  document.getElementById('recon-ml').textContent = `= ${mlToDraw.toFixed(3)} ml | Concentration: ${concentration.toFixed(0)} mcg/ml`;
}

// ============ SETTINGS PAGE ============
function buildSettings() {
  document.getElementById('page-settings').innerHTML = `
    <!-- Profile -->
    <div class="profile-card" style="margin-top:8px">
      <div class="profile-avatar-large">A</div>
      <div style="flex:1;min-width:0">
        <div class="profile-name">${mockData.user.name} M.</div>
        <div class="profile-meta">${mockData.user.goal} · ${mockData.user.weight} lbs</div>
        <div class="profile-stats-row">
          <div class="profile-stat">
            <div class="profile-stat-val">${mockData.user.streak}</div>
            <div class="profile-stat-label">Streak</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-val">${mockData.user.weight}</div>
            <div class="profile-stat-label">lbs</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-val">${mockData.user.bodyFat}%</div>
            <div class="profile-stat-label">BF%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Settings -->
    <div class="settings-section">
      <div class="settings-group-label">Profile</div>
      <div class="settings-list">
        <div class="settings-item" onclick="showToast('Edit profile')">
          <div class="settings-item-icon" style="background:rgba(79,142,247,0.15)">👤</div>
          <div class="settings-item-label">Edit Profile</div>
          <div class="settings-item-chevron">›</div>
        </div>
        <div class="settings-item" onclick="showToast('Notification settings')">
          <div class="settings-item-icon" style="background:rgba(245,200,66,0.12)">🔔</div>
          <div class="settings-item-label">Notifications</div>
          <div class="settings-item-chevron">›</div>
        </div>
        <div class="settings-item" onclick="showToast('Reminder preferences')">
          <div class="settings-item-icon" style="background:rgba(61,214,140,0.12)">⏰</div>
          <div class="settings-item-label">Reminders</div>
          <div class="settings-item-chevron">›</div>
        </div>
      </div>
    </div>

    <!-- App Settings -->
    <div class="settings-section">
      <div class="settings-group-label">App</div>
      <div class="settings-list">
        <div class="settings-item">
          <div class="settings-item-icon" style="background:rgba(232,56,61,0.12)">⚖️</div>
          <div class="settings-item-label">Units</div>
          <div class="settings-item-value">Imperial</div>
          <div class="settings-item-chevron">›</div>
        </div>
        <div class="settings-item">
          <div class="settings-item-icon" style="background:rgba(79,142,247,0.15)">🌑</div>
          <div class="settings-item-label">Dark Mode</div>
          <label class="toggle-wrap">
            <input type="checkbox" checked onchange="showToast('Always dark. You know it.')">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-item" onclick="openModal('modal-calc')">
          <div class="settings-item-icon" style="background:rgba(245,200,66,0.12)">🧮</div>
          <div class="settings-item-label">Calorie Calculator</div>
          <div class="settings-item-chevron">›</div>
        </div>
      </div>
    </div>

    <!-- Data -->
    <div class="settings-section">
      <div class="settings-group-label">Data</div>
      <div class="settings-list">
        <div class="settings-item" onclick="exportData()">
          <div class="settings-item-icon" style="background:rgba(61,214,140,0.12)">📤</div>
          <div class="settings-item-label">Export Backup</div>
          <div class="settings-item-chevron">›</div>
        </div>
        <div class="settings-item" onclick="showToast('Import feature coming soon!')">
          <div class="settings-item-icon" style="background:rgba(79,142,247,0.15)">📥</div>
          <div class="settings-item-label">Import Data</div>
          <div class="settings-item-chevron">›</div>
        </div>
        <div class="settings-item" onclick="showToast('☁️ Cloud sync coming soon!')">
          <div class="settings-item-icon" style="background:rgba(79,142,247,0.15)">☁️</div>
          <div class="settings-item-label">Cloud Sync</div>
          <div class="settings-item-value">Coming Soon</div>
          <div class="settings-item-chevron">›</div>
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="settings-section">
      <div class="settings-group-label">About</div>
      <div class="settings-list">
        <div class="settings-item">
          <div class="settings-item-icon" style="background:rgba(232,56,61,0.12)">🐾</div>
          <div class="settings-item-label">Dialed Dawg</div>
          <div class="settings-item-value">v1.0.0</div>
        </div>
      </div>
    </div>

    <div style="height:8px"></div>
  `;
}

function exportData() {
  const data = {
    user: mockData.user,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dialed-dawg-backup.json';
  a.click();
  showToast('📤 Backup exported!');
}

// ============ CALORIE CALCULATOR MODAL ============
function buildCalcModal() {
  document.getElementById('modal-calc').innerHTML = `
    <div class="modal-overlay" id="modal-calc-inner">
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-title">TDEE Calculator</div>

        <div class="input-group">
          <div class="input-label">Age</div>
          <input type="number" class="styled-input" id="calc-age" value="25" min="15" max="80">
        </div>
        <div class="input-group">
          <div class="input-label">Weight (lbs)</div>
          <input type="number" class="styled-input" id="calc-weight" value="195" min="80" max="400">
        </div>
        <div class="input-group">
          <div class="input-label">Height (inches)</div>
          <input type="number" class="styled-input" id="calc-height" value="72" min="48" max="96">
        </div>
        <div class="input-group">
          <div class="input-label">Gender</div>
          <select class="styled-select" id="calc-gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="input-group">
          <div class="input-label">Activity Level</div>
          <select class="styled-select" id="calc-activity">
            <option value="1.2">Sedentary (desk job)</option>
            <option value="1.375">Lightly Active (1-3 days/wk)</option>
            <option value="1.55" selected>Moderately Active (3-5 days/wk)</option>
            <option value="1.725">Very Active (6-7 days/wk)</option>
            <option value="1.9">Extremely Active (2x/day)</option>
          </select>
        </div>
        <div class="input-group">
          <div class="input-label">Goal</div>
          <select class="styled-select" id="calc-goal">
            <option value="-500">Lose Weight (-1 lb/wk)</option>
            <option value="-250">Slow Lose (-0.5 lb/wk)</option>
            <option value="0" selected>Maintain</option>
            <option value="250">Slow Bulk (+0.5 lb/wk)</option>
            <option value="500">Bulk (+1 lb/wk)</option>
          </select>
        </div>

        <div class="calc-result-box" id="tdee-result" style="margin-bottom:12px">
          <div class="calc-result-val" id="tdee-val">—</div>
          <div class="calc-result-label">Target Calories / Day</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px" id="tdee-macros">Calculate to see macros</div>
        </div>

        <button class="primary-btn" onclick="calcTDEE()">Calculate</button>
        <button class="secondary-btn" onclick="closeModal('modal-calc-inner')">Close</button>
      </div>
    </div>
  `;
  // Click overlay to close
  document.getElementById('modal-calc').addEventListener('click', function(e) {
    if (e.target === this.querySelector('.modal-overlay')) closeModal('modal-calc-inner');
  });
}

function calcTDEE() {
  const age = parseInt(document.getElementById('calc-age').value);
  const weightLbs = parseFloat(document.getElementById('calc-weight').value);
  const heightIn = parseFloat(document.getElementById('calc-height').value);
  const gender = document.getElementById('calc-gender').value;
  const activity = parseFloat(document.getElementById('calc-activity').value);
  const goalAdj = parseInt(document.getElementById('calc-goal').value);

  const weightKg = weightLbs * 0.453592;
  const heightCm = heightIn * 2.54;

  let bmr;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const tdee = Math.round(bmr * activity);
  const target = tdee + goalAdj;
  const protein = Math.round(weightLbs * 0.8);
  const fat = Math.round(target * 0.25 / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);

  document.getElementById('tdee-val').textContent = target;
  document.getElementById('tdee-macros').innerHTML = `
    TDEE: ${tdee} cal &nbsp;|&nbsp; P: ${protein}g &nbsp;C: ${carbs}g &nbsp;F: ${fat}g
  `;

  showToast('✅ Macros calculated!');
}

// ============ INIT ============
function init() {
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  // Build all pages
  buildHome();
  buildWorkout();
  buildProgress();
  buildNutrition();
  buildRecovery();
  buildCalendar();
  buildPeptide();
  buildSettings();
  buildCalcModal();

  // Init water
  initWater();

  // Navigate to home
  navigate('home');

  // Nav listeners
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.nav));
  });

  // Active workout bar close
  const bar = document.getElementById('active-workout-bar');
  if (bar) {
    bar.addEventListener('click', () => {
      if (confirm('End workout?')) stopWorkout();
    });
  }

  // Overlay close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
