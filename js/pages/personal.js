/* ===========================
   LifeOS – Personal Development Page
   =========================== */

function renderPersonal() {
  const categories = Store.get('personal.categories') || [];
  const habits = Store.get('habits') || [];
  const today = DateUtil.today();
  const habitCompletion = HabitUtil.todayCompletion();
  const avgScore = categories.length ? Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length * 10) / 10 : 0;

  return `
<div class="page" id="personalPage">
  <div class="page-header">
    <div>
      <h1 class="page-title"><i data-lucide="heart"></i> Personal Development</h1>
      <p class="page-subtitle">Track personal scores, habits and growth</p>
    </div>
    <button class="btn btn-primary btn-sm" onclick="addHabitModal()">
      <i data-lucide="plus"></i> Add Habit
    </button>
  </div>

  <!-- Quick Stats -->
  <div class="grid-4" style="margin-bottom:20px">
    <div class="stat-card purple">
      <div class="stat-icon purple"><i data-lucide="star"></i></div>
      <div class="stat-value">${avgScore}/10</div>
      <div class="stat-label">Avg. Self Score</div>
    </div>
    <div class="stat-card green">
      <div class="stat-icon green"><i data-lucide="zap"></i></div>
      <div class="stat-value">${habitCompletion.done}/${habitCompletion.total}</div>
      <div class="stat-label">Habits Today</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon orange"><i data-lucide="flame"></i></div>
      <div class="stat-value">${Math.max(...habits.map(h => h.streak || 0), 0)}</div>
      <div class="stat-label">Best Streak</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue"><i data-lucide="percent"></i></div>
      <div class="stat-value">${habitCompletion.pct}%</div>
      <div class="stat-label">Today's Rate</div>
    </div>
  </div>

  <div class="grid-2" style="align-items:start;margin-bottom:20px">
    <!-- Personal Scores -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="sliders"></i> Personal Scores</h3>
      </div>
      ${categories.map(cat => `
      <div style="margin-bottom:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:20px">${cat.icon}</span>
            <span style="font-weight:500;font-size:13.5px">${cat.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-weight:700;font-size:16px;color:${cat.score >= 8 ? 'var(--accent-green)' : cat.score >= 6 ? 'var(--accent-purple-light)' : 'var(--accent-orange)'}">${cat.score}/10</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="progress-bar" style="flex:1;height:6px">
            <div class="progress-fill ${cat.score >= 8 ? 'green' : cat.score >= 5 ? '' : 'orange'}" style="width:${cat.score * 10}%"></div>
          </div>
          <input type="range" min="1" max="10" value="${cat.score}" style="width:80px;accent-color:var(--accent-purple)"
            onchange="updatePersonalScore('${cat.id}', this.value)" />
        </div>
      </div>`).join('')}
    </div>

    <!-- Weekly Habit Chart -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="bar-chart-3"></i> Weekly Habit Stats</h3>
      </div>
      <div style="height:220px;position:relative"><canvas id="habitWeekChart"></canvas></div>
      <div style="margin-top:16px">
        ${renderMonthlyCompletionRate()}
      </div>
    </div>
  </div>

  <!-- Habits Full List -->
  <div class="card" style="margin-bottom:20px">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="list-checks"></i> All Habits</h3>
      <button class="btn btn-sm btn-ghost" onclick="addHabitModal()"><i data-lucide="plus"></i> Add</button>
    </div>
    <div id="personalHabitsList">
      ${renderAllHabits()}
    </div>
  </div>

  <!-- Habit History Grid -->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="calendar"></i> 30-Day Habit History</h3>
    </div>
    ${renderHabitHistory()}
  </div>
</div>`;
}

function renderMonthlyCompletionRate() {
  const habits = Store.get('habits') || [];
  const last30 = DateUtil.getLast30Days();
  const rates = last30.map(d => {
    const done = habits.filter(h => (h.completedDates || []).includes(d)).length;
    return habits.length ? Math.round((done / habits.length) * 100) : 0;
  });
  const avgRate = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;

  return `
  <div style="background:var(--bg-glass);border-radius:10px;padding:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-size:13px;font-weight:500">Monthly Completion Rate</span>
      <span style="font-size:20px;font-weight:700;color:${avgRate >= 80 ? 'var(--accent-green)' : avgRate >= 60 ? 'var(--accent-purple-light)' : 'var(--accent-orange)'}">${avgRate}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill ${avgRate >= 80 ? 'green' : avgRate >= 60 ? '' : 'orange'}" style="width:${avgRate}%"></div>
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-top:6px">Based on last 30 days average</div>
  </div>`;
}

function renderAllHabits() {
  const habits = Store.get('habits') || [];
  const today = DateUtil.today();
  if (habits.length === 0) {
    return `<div class="empty-state" style="padding:24px"><div class="empty-state-icon">🌱</div><h3>No habits yet</h3><p>Build powerful daily habits</p><button class="btn btn-primary btn-sm" onclick="addHabitModal()">Add Habit</button></div>`;
  }
  return habits.map(h => {
    const done = HabitUtil.isCompleted(h, today);
    return `
    <div class="habit-tracker-item" id="personal-habit-${h.id}" style="padding:12px 0;border-bottom:1px solid var(--border)">
      <div class="habit-icon-wrap" style="background:rgba(${colorRGB(h.color)},0.12)">${h.icon}</div>
      <div class="habit-info" style="flex:1;min-width:0">
        <div class="habit-name">${escapeHtml(h.name)}</div>
        <div class="habit-streak">
          ${h.streak > 0 ? `🔥 ${h.streak} day streak` : 'No streak yet'}
          <span style="color:var(--text-muted);margin-left:8px">• ${h.category}</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="habit-check-btn ${done ? 'done' : ''}" onclick="togglePersonalHabit('${h.id}')" title="${done ? 'Undo' : 'Mark done'}">
          <i data-lucide="check"></i>
        </button>
        <button class="icon-btn" onclick="deleteHabit('${h.id}')"><i data-lucide="trash-2"></i></button>
      </div>
    </div>`;
  }).join('');
}

function renderHabitHistory() {
  const habits = Store.get('habits') || [];
  const last30 = DateUtil.getLast30Days();

  if (habits.length === 0) {
    return `<div class="empty-state" style="padding:16px"><p>Add habits to see history</p></div>`;
  }

  return habits.map(h => `
  <div style="margin-bottom:16px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
      <span>${h.icon}</span>
      <span style="font-weight:500;font-size:13px">${escapeHtml(h.name)}</span>
      <span class="badge badge-${h.streak > 0 ? 'green' : 'gray'}" style="font-size:10px">🔥 ${h.streak}</span>
    </div>
    <div style="display:flex;gap:3px;flex-wrap:wrap">
      ${last30.map(d => {
        const done = (h.completedDates || []).includes(d);
        return `<div title="${d}" style="width:18px;height:18px;border-radius:3px;background:${done ? (h.color ? `rgba(${colorRGB(h.color)},0.85)` : 'var(--accent-green)') : 'var(--bg-glass)'};border:1px solid var(--border);cursor:default"></div>`;
      }).join('')}
    </div>
  </div>`).join('');
}

function drawHabitWeekChart() {
  const canvas = document.getElementById('habitWeekChart');
  if (!canvas) return;
  if (App._charts['habitWeekChart']) { App._charts['habitWeekChart'].destroy(); }

  const habits = Store.get('habits') || [];
  const week = DateUtil.getWeekDates();
  const dayLabels = week.map(d => DateUtil.dayName(d));
  const data = week.map(d => habits.filter(h => (h.completedDates || []).includes(d)).length);

  App._charts['habitWeekChart'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dayLabels,
      datasets: [{
        label: 'Habits Completed',
        data,
        backgroundColor: week.map((d, i) => d === DateUtil.today() ? CHART_COLORS.purple : CHART_COLORS.blue),
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: Math.max(habits.length, 1), ticks: { stepSize: 1 } }
      }
    }
  });
}

function updatePersonalScore(id, score) {
  const categories = Store.get('personal.categories') || [];
  const cat = categories.find(c => c.id === id);
  if (cat) {
    cat.score = parseInt(score);
    Store.set('personal.categories', categories);
    Toast.success(`${cat.name} score updated to ${score}/10`);
  }
}

function togglePersonalHabit(habitId) {
  HabitUtil.toggle(habitId, DateUtil.today());
  const list = document.getElementById('personalHabitsList');
  if (list) { list.innerHTML = renderAllHabits(); lucide.createIcons(); }
  Toast.success('Habit updated!');
}

function addHabitModal() {
  Modal.open('Add New Habit', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Habit Name *</label>
        <input type="text" class="form-input" id="habit_name" placeholder="e.g. Morning Exercise" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Icon (emoji)</label>
        <input type="text" class="form-input" id="habit_icon" placeholder="🌅" maxlength="2" value="⭐" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="habit_category">
          <option value="personal">Personal</option>
          <option value="skills">Skills</option>
          <option value="health">Health</option>
          <option value="english">English</option>
          <option value="academic">Academic</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Color</label>
        <select class="form-select" id="habit_color">
          <option value="purple">Purple</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="orange">Orange</option>
          <option value="cyan">Cyan</option>
          <option value="pink">Pink</option>
          <option value="red">Red</option>
        </select>
      </div>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveHabit()"><i data-lucide="save"></i> Save Habit</button>
    </div>
  `);
}

function saveHabit() {
  const name = document.getElementById('habit_name')?.value.trim();
  if (!name) { Toast.error('Habit name is required'); return; }

  const habit = {
    id: uid(),
    name,
    icon: document.getElementById('habit_icon')?.value || '⭐',
    category: document.getElementById('habit_category')?.value || 'personal',
    color: document.getElementById('habit_color')?.value || 'purple',
    target: 'daily',
    streak: 0,
    completedDates: [],
  };
  Store.push('habits', habit);
  Modal.close();
  Toast.success('Habit added!');
  document.getElementById('pageContainer').innerHTML = renderPersonal();
  setTimeout(() => drawHabitWeekChart(), 100);
  lucide.createIcons();
}

function deleteHabit(id) {
  Store.remove('habits', id);
  Toast.success('Habit removed');
  const list = document.getElementById('personalHabitsList');
  if (list) { list.innerHTML = renderAllHabits(); lucide.createIcons(); }
}
