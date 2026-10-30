/* ===========================
   LifeOS – Dashboard Page
   =========================== */

function renderDashboard() {
  const user = Store.get('user');
  const habits = HabitUtil.todayCompletion();
  const today = DateUtil.today();
  const quote = getDailyQuote();
  const tasks = TaskUtil.todayTasks();
  const doneTasks = tasks.filter(t => t.done).length;
  const goals = [...(Store.get('goals.short') || []), ...(Store.get('goals.medium') || []), ...(Store.get('goals.long') || [])];
  const activeGoals = goals.filter(g => g.progress < 100).length;
  const skills = Store.get('skills');
  const avgSkill = skills.length ? Math.round(skills.reduce((a, b) => a + b.progress, 0) / skills.length) : 0;

  return `
<div class="page" id="dashboardPage">
  <!-- Header Row -->
  <div class="page-header" style="margin-bottom:20px">
    <div>
      <h1 class="dashboard-greeting">
        ${DateUtil.greeting()}, <span class="highlight">${user.name.split(' ')[0]}</span> 👋
      </h1>
      <div class="clock-display">
        <span id="liveClock">${DateUtil.currentTime()}</span>
        &bull;
        <span>${DateUtil.format(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="addTaskModal()">
        <i data-lucide="plus"></i> Add Task
      </button>
      <button class="btn btn-primary btn-sm" onclick="App.navigate('goals')">
        <i data-lucide="target"></i> My Goals
      </button>
    </div>
  </div>

  <!-- Today's Mission -->
  <div class="mission-card">
    <div class="mission-header">
      <span style="font-size:20px">🎯</span>
      <h3>Today's Mission</h3>
      <span class="badge badge-purple">TOP 3</span>
    </div>
    <div id="missionItems">${renderMissionItems()}</div>
  </div>

  <!-- Stat Cards -->
  <div class="grid-4" style="margin-bottom:20px">
    <div class="stat-card purple">
      <div class="stat-icon purple"><i data-lucide="check-square"></i></div>
      <div class="stat-value">${doneTasks}/${tasks.length}</div>
      <div class="stat-label">Tasks Done Today</div>
      <div class="stat-change ${doneTasks === tasks.length && tasks.length > 0 ? 'up' : ''}">
        ${tasks.length === 0 ? 'No tasks yet' : doneTasks === tasks.length ? '✓ All done!' : `${tasks.length - doneTasks} remaining`}
      </div>
    </div>
    <div class="stat-card green">
      <div class="stat-icon green"><i data-lucide="heart"></i></div>
      <div class="stat-value">${habits.done}/${habits.total}</div>
      <div class="stat-label">Habits Completed</div>
      <div class="stat-change ${habits.pct >= 80 ? 'up' : ''}">
        ${habits.pct}% completion
      </div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue"><i data-lucide="code-2"></i></div>
      <div class="stat-value">${avgSkill}%</div>
      <div class="stat-label">Avg. Skill Progress</div>
      <div class="stat-change">${skills.filter(s=>s.status==='current').length} active skills</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon orange"><i data-lucide="target"></i></div>
      <div class="stat-value">${activeGoals}</div>
      <div class="stat-label">Active Goals</div>
      <div class="stat-change">${goals.length} total goals</div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="dashboard-main">
    <div class="dashboard-left">
      <!-- Today's Tasks -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="list-checks"></i> Today's Tasks</h3>
          <button class="btn btn-sm btn-ghost" onclick="addTaskModal()">
            <i data-lucide="plus"></i> Add
          </button>
        </div>
        <div id="dashboardTasks">${renderDashboardTasks()}</div>
      </div>

      <!-- Today's Schedule -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="clock"></i> Today's Schedule</h3>
          <button class="btn btn-sm btn-ghost" onclick="App.navigate('routine')">View All</button>
        </div>
        <div class="today-schedule">${renderTodaySchedule()}</div>
      </div>

      <!-- Skills Quick View -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="trending-up"></i> Learning Progress</h3>
          <button class="btn btn-sm btn-ghost" onclick="App.navigate('skills')">Details</button>
        </div>
        ${renderSkillsQuick()}
      </div>
    </div>

    <div class="dashboard-right">
      <!-- Habit Tracker -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="zap"></i> Today's Habits</h3>
          <div class="streak-display">
            <i data-lucide="flame"></i>
            <span>${habits.pct}%</span>
          </div>
        </div>
        <div id="dashboardHabits">${renderDashboardHabits()}</div>
        <div class="progress-bar" style="margin-top:12px">
          <div class="progress-fill green" style="width:${habits.pct}%"></div>
        </div>
      </div>

      <!-- CGPA Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="graduation-cap"></i> Academic Status</h3>
          <button class="btn btn-sm btn-ghost" onclick="App.navigate('academic')">View</button>
        </div>
        <div style="text-align:center;padding:10px 0">
          <div style="font-size:48px;font-weight:800;font-family:var(--font-display);background:linear-gradient(135deg,var(--accent-purple-light),var(--accent-blue-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
            ${Store.get('user.cgpa')}
          </div>
          <div style="font-size:13px;color:var(--text-secondary)">Current CGPA • Vel Tech University</div>
          <div style="margin-top:12px;display:flex;gap:12px;justify-content:center;font-size:12.5px;color:var(--text-muted)">
            <span>🎓 2nd Year</span>
            <span>📅 Grad 2029</span>
            <span>🏆 Target: 9.5+</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="alert-circle"></i> Upcoming Deadlines</h3>
        </div>
        ${renderUpcomingDeadlines()}
      </div>

      <!-- Quote -->
      <div class="motivational-quote">
        "${escapeHtml(quote.text)}"
        <strong>— ${escapeHtml(quote.author)}</strong>
      </div>
    </div>
  </div>
</div>`;
}

function renderMissionItems() {
  const today = DateUtil.today();
  const tasks = TaskUtil.todayTasks().filter(t => t.priority === 'high').slice(0, 3);

  if (tasks.length === 0) {
    // Generate mission from goals/skills if no high-priority tasks
    const defaults = [
      { title: 'Complete Java practice session (8:30–9:30 PM)', done: false },
      { title: 'Solve 1 DSA problem on LeetCode / HackerRank', done: false },
      { title: 'Review today\'s college subjects', done: false },
    ];
    return defaults.map((m, i) => `
      <div class="mission-item" id="mission-${i}">
        <span class="mission-number">${i + 1}</span>
        <span>${m.title}</span>
      </div>`).join('');
  }

  return tasks.map((t, i) => `
    <div class="mission-item ${t.done ? 'done' : ''}" id="mission-task-${t.id}">
      <span class="mission-number">${i + 1}</span>
      <span>${escapeHtml(t.title)}</span>
    </div>`).join('');
}

function renderDashboardTasks() {
  const tasks = TaskUtil.todayTasks();
  if (tasks.length === 0) {
    return `<div class="empty-state" style="padding:24px 16px">
      <div class="empty-state-icon">✅</div>
      <h3>No tasks yet</h3>
      <p>Add tasks to track your progress today</p>
      <button class="btn btn-primary btn-sm" onclick="addTaskModal()">
        <i data-lucide="plus"></i> Add First Task
      </button>
    </div>`;
  }

  return tasks.map(t => `
    <div class="quick-task-item" id="task-row-${t.id}">
      <div class="quick-task-check ${t.done ? 'checked' : ''}" onclick="toggleTask('${t.id}')"></div>
      <div class="quick-task-body">
        <div class="quick-task-title ${t.done ? 'done' : ''}">${escapeHtml(t.title)}</div>
        <div class="quick-task-meta">
          <span class="badge badge-${priorityColor(t.priority)}" style="font-size:10.5px">${priorityLabel(t.priority)}</span>
          ${t.category ? `<span style="color:var(--text-muted);font-size:11.5px">• ${t.category}</span>` : ''}
        </div>
      </div>
      <button class="icon-btn" onclick="deleteTask('${t.id}')" title="Delete">
        <i data-lucide="x"></i>
      </button>
    </div>`).join('');
}

function renderDashboardHabits() {
  const habits = Store.get('habits');
  const today = DateUtil.today();
  return habits.map(h => {
    const done = HabitUtil.isCompleted(h, today);
    return `
      <div class="habit-tracker-item" id="habit-row-${h.id}">
        <div class="habit-icon-wrap" style="background:rgba(${colorRGB(h.color)},0.12)">${h.icon}</div>
        <div class="habit-info">
          <div class="habit-name">${escapeHtml(h.name)}</div>
          <div class="habit-streak">${h.streak > 0 ? `🔥 ${h.streak} day streak` : 'Start your streak!'}</div>
        </div>
        <button class="habit-check-btn ${done ? 'done' : ''}" onclick="toggleHabit('${h.id}')" title="${done ? 'Undo' : 'Mark done'}">
          <i data-lucide="check"></i>
        </button>
      </div>`;
  }).join('');
}

function renderTodaySchedule() {
  const routine = Store.get('routine');
  const now = DateUtil.currentTimeHHMM();
  const dayOfWeek = new Date().getDay() || 7; // 1=Mon, 7=Sun

  const todayRoutine = routine
    .filter(r => !r.days || r.days.includes(dayOfWeek))
    .sort((a, b) => a.time.localeCompare(b.time));

  const currentBlock = todayRoutine.find(r => r.time <= now && now < (r.endTime || '23:59'));

  return todayRoutine.map(r => {
    const isCurrent = r === currentBlock;
    return `
      <div class="schedule-item ${isCurrent ? 'current' : ''}">
        <div class="schedule-time">${r.time}–${r.endTime || '?'}</div>
        <div class="schedule-dot" style="background:${r.color}"></div>
        <div class="schedule-label">${escapeHtml(r.label)}</div>
        ${isCurrent ? '<span class="badge badge-purple" style="margin-left:auto;font-size:10px">NOW</span>' : ''}
      </div>`;
  }).join('');
}

function renderSkillsQuick() {
  const skills = Store.get('skills').filter(s => s.status === 'current').slice(0, 5);
  if (skills.length === 0) return `<div class="text-muted text-sm" style="padding:12px 0">No active skills. <a href="#" onclick="App.navigate('skills')" style="color:var(--accent-purple-light)">Add skills →</a></div>`;

  return `<div>${skills.map(s => `
    <div class="skill-row">
      <div class="skill-row-header">
        <span class="skill-name">${escapeHtml(s.name)}</span>
        <span class="skill-pct">${s.progress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${s.progress}%"></div>
      </div>
    </div>`).join('')}</div>`;
}

function renderUpcomingDeadlines() {
  const today = DateUtil.today();
  const allGoals = [
    ...(Store.get('goals.short') || []),
    ...(Store.get('goals.medium') || []),
    ...(Store.get('goals.long') || []),
  ].filter(g => g.deadline && g.deadline >= today && g.progress < 100);

  const tasks = Store.get('tasks').filter(t => t.date && t.date >= today && !t.done);

  const items = [
    ...allGoals.map(g => ({ label: g.title, date: g.deadline, type: 'goal' })),
    ...tasks.map(t => ({ label: t.title, date: t.date, type: 'task' })),
  ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  if (items.length === 0) {
    return `<div class="text-muted text-sm" style="padding:12px 0">No upcoming deadlines. Great job staying on top! 🎉</div>`;
  }

  return items.map(item => {
    const days = DateUtil.daysDiff(today, item.date);
    const urgency = days <= 2 ? 'red' : days <= 7 ? 'orange' : 'green';
    return `
      <div class="list-item">
        <div class="priority-dot priority-${urgency}"></div>
        <div style="flex:1;min-width:0">
          <div class="truncate" style="font-size:13.5px;font-weight:500">${escapeHtml(item.label)}</div>
          <div style="font-size:12px;color:var(--text-muted)">${DateUtil.format(item.date)}</div>
        </div>
        <span class="badge badge-${urgency}" style="font-size:11px;flex-shrink:0">
          ${days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days + 'd'}
        </span>
      </div>`;
  }).join('');
}

function colorRGB(color) {
  const map = { purple: '124,58,237', blue: '59,130,246', green: '16,185,129', orange: '245,158,11', cyan: '6,182,212', pink: '236,72,153', red: '239,68,68' };
  return map[color] || '124,58,237';
}

// ── Dashboard Actions ─────────────────────────────────────────────────────────
function toggleTask(taskId) {
  TaskUtil.toggleDone(taskId);
  refreshDashboardTasks();
}

function deleteTask(taskId) {
  TaskUtil.delete(taskId);
  refreshDashboardTasks();
  Toast.success('Task deleted');
}

function refreshDashboardTasks() {
  const el = document.getElementById('dashboardTasks');
  if (el) { el.innerHTML = renderDashboardTasks(); lucide.createIcons(); }
  const mi = document.getElementById('missionItems');
  if (mi) { mi.innerHTML = renderMissionItems(); lucide.createIcons(); }
}

function toggleHabit(habitId) {
  HabitUtil.toggle(habitId, DateUtil.today());
  const el = document.getElementById('dashboardHabits');
  if (el) { el.innerHTML = renderDashboardHabits(); lucide.createIcons(); }
  const h = HabitUtil.todayCompletion();
  const bar = document.querySelector('.progress-fill.green');
  if (bar) bar.style.width = h.pct + '%';
  Toast.success('Habit updated!');
}

function addTaskModal() {
  Modal.open('Add New Task', `
    <div class="form-group">
      <label class="form-label">Task Title *</label>
      <input type="text" class="form-input" id="taskTitle" placeholder="What needs to be done?" autofocus />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-input" id="taskDate" value="${DateUtil.today()}" />
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="taskPriority">
          <option value="high">🔴 High</option>
          <option value="medium" selected>🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <select class="form-select" id="taskCategory">
        <option value="study">📚 Study</option>
        <option value="coding">💻 Coding</option>
        <option value="college">🏫 College</option>
        <option value="project">🚀 Project</option>
        <option value="english">🗣️ English</option>
        <option value="personal">❤️ Personal</option>
        <option value="freelancing">💼 Freelancing</option>
        <option value="general" selected>📌 General</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Notes (optional)</label>
      <textarea class="form-textarea" id="taskDesc" placeholder="Additional details..." style="min-height:70px"></textarea>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewTask()"><i data-lucide="plus"></i> Add Task</button>
    </div>
  `);

  // Focus title
  setTimeout(() => document.getElementById('taskTitle')?.focus(), 100);
}

function saveNewTask() {
  const title = document.getElementById('taskTitle')?.value.trim();
  if (!title) { Toast.error('Please enter a task title'); return; }

  TaskUtil.addTask({
    title,
    date: document.getElementById('taskDate')?.value || DateUtil.today(),
    priority: document.getElementById('taskPriority')?.value || 'medium',
    category: document.getElementById('taskCategory')?.value || 'general',
    desc: document.getElementById('taskDesc')?.value || '',
  });

  Modal.close();
  Toast.success('Task added!');
  refreshDashboardTasks();
}

// ── Live Clock ────────────────────────────────────────────────────────────────
let _clockInterval = null;

function startLiveClock() {
  clearInterval(_clockInterval);
  _clockInterval = setInterval(() => {
    const el = document.getElementById('liveClock');
    if (el) el.textContent = DateUtil.currentTime();
    else clearInterval(_clockInterval);
  }, 1000);
}
