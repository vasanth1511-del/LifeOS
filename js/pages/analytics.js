/* ===========================
   LifeOS – Analytics & Progress Page
   =========================== */

function renderAnalytics() {
  const tasks = Store.get('tasks') || [];
  const habits = Store.get('habits') || [];
  const skills = Store.get('skills') || [];
  const studyLogs = Store.get('analytics.studyHours') || [];

  // Seed study logs if empty
  if (studyLogs.length === 0) {
    const dates = DateUtil.getLast7Days();
    const seeded = [
      { date: dates[0], hours: 4.5, subject: 'Java Core & Collections' },
      { date: dates[1], hours: 5.0, subject: 'Data Structures & DBMS' },
      { date: dates[2], hours: 3.5, subject: 'Computer Networks' },
      { date: dates[3], hours: 6.0, subject: 'Java OOP & LeetCode' },
      { date: dates[4], hours: 4.0, subject: 'Machine Learning' },
      { date: dates[5], hours: 5.5, subject: 'Algorithms & Tree Traversal' },
      { date: dates[6], hours: 6.5, subject: 'Java Practice (8:30-9:30 PM) & Projects' }
    ];
    Store.set('analytics.studyHours', seeded);
  }

  const completedTasks = tasks.filter(t => t.done).length;
  
  // Total habit check-ins across history
  let totalHabitCheckins = 0;
  let maxStreak = 0;
  habits.forEach(h => {
    totalHabitCheckins += (h.completedDates || []).length;
    if ((h.streak || 0) > maxStreak) maxStreak = h.streak;
  });

  const totalStudyHours = (Store.get('analytics.studyHours') || []).reduce((acc, curr) => acc + (Number(curr.hours) || 0), 0);

  // Overall productivity rating (0-100)
  const habitRate = habits.length ? Math.round((HabitUtil.todayCompletion().done / habits.length) * 100) : 0;
  const avgSkillRate = skills.length ? Math.round(skills.reduce((sum, s) => sum + (s.progress || 0), 0) / skills.length) : 0;
  const productivityScore = Math.min(100, Math.round((habitRate * 0.4) + (avgSkillRate * 0.4) + (completedTasks > 0 ? 20 : 10)));

  return `
  <div class="page" id="analyticsPage">
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">📊 Analytics & Performance Insights</h1>
        <p class="page-subtitle">Real-time metrics, calculated trends, consistency indices, and study time allocation</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="logStudyHoursModal()">
          <i data-lucide="clock"></i> Log Study Session
        </button>
      </div>
    </div>

    <!-- Key Metrics Summary Row -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="stat-card purple">
        <div class="stat-icon purple"><i data-lucide="check-circle-2"></i></div>
        <div class="stat-value">${completedTasks}</div>
        <div class="stat-label">Tasks Accomplished</div>
        <div class="stat-change up">${tasks.length} total captured</div>
      </div>

      <div class="stat-card green">
        <div class="stat-icon green"><i data-lucide="flame"></i></div>
        <div class="stat-value">${maxStreak} Days</div>
        <div class="stat-label">Best Active Habit Streak</div>
        <div class="stat-change up">${totalHabitCheckins} lifetime check-ins</div>
      </div>

      <div class="stat-card blue">
        <div class="stat-icon blue"><i data-lucide="book-open"></i></div>
        <div class="stat-value">${totalStudyHours.toFixed(1)} hrs</div>
        <div class="stat-label">Logged Study Time</div>
        <div class="stat-change">Tracked focus sessions</div>
      </div>

      <div class="stat-card cyan">
        <div class="stat-icon cyan"><i data-lucide="activity"></i></div>
        <div class="stat-value">${productivityScore}</div>
        <div class="stat-label">Productivity Index (0-100)</div>
        <div class="stat-change up">${productivityScore >= 75 ? '🔥 High Momentum' : 'Solid Progress'}</div>
      </div>
    </div>

    <!-- 4 Core Analytical Charts Grid -->
    <div class="grid-2" style="margin-bottom: 24px;">
      <!-- Chart 1: Weekly Task Productivity -->
      <div class="card analytics-chart-card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="trending-up"></i> Weekly Task Completion Momentum</h3>
          <span class="badge badge-purple">Last 7 Days</span>
        </div>
        <div class="chart-container" style="height: 260px;">
          <canvas id="weeklyProductivityChart"></canvas>
        </div>
      </div>

      <!-- Chart 2: Study Hours Trajectory -->
      <div class="card analytics-chart-card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="clock"></i> Daily Self-Study Hours (Core & CS)</h3>
          <button class="btn btn-sm btn-ghost" onclick="logStudyHoursModal()">+ Log Hours</button>
        </div>
        <div class="chart-container" style="height: 260px;">
          <canvas id="studyHoursChart"></canvas>
        </div>
      </div>

      <!-- Chart 3: Habit Consistency (30 Days) -->
      <div class="card analytics-chart-card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="calendar"></i> 30-Day Habit Discipline Rate (%)</h3>
          <span class="badge badge-green">Daily Consistency</span>
        </div>
        <div class="chart-container" style="height: 260px;">
          <canvas id="monthlyHabitChart"></canvas>
        </div>
      </div>

      <!-- Chart 4: Technical Skills Mastery Bar -->
      <div class="card analytics-chart-card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="code"></i> Technical Stack Proficiency (Goal: 100%)</h3>
          <span class="badge badge-blue">Roadmap Distribution</span>
        </div>
        <div class="chart-container" style="height: 260px;">
          <canvas id="skillDevChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Study Sessions Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="list"></i> Recent Focused Study Logs</h3>
        <button class="btn btn-sm btn-secondary" onclick="logStudyHoursModal()"><i data-lucide="plus"></i> Log Today</button>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13.5px; text-align:left;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-color); color:var(--text-muted); font-size:12px; text-transform:uppercase;">
              <th style="padding:10px 14px;">Date</th>
              <th style="padding:10px 14px;">Subject / Focus Area</th>
              <th style="padding:10px 14px;">Duration</th>
              <th style="padding:10px 14px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${(Store.get('analytics.studyHours') || []).slice().reverse().slice(0, 8).map((log, idx) => `
              <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:12px 14px; font-weight:600;">${DateUtil.format(log.date)}</td>
                <td style="padding:12px 14px;">${escapeHtml(log.subject || 'Engineering Study')}</td>
                <td style="padding:12px 14px;"><span class="badge badge-cyan">${log.hours} Hours</span></td>
                <td style="padding:12px 14px;">
                  <button class="icon-btn" onclick="deleteStudyLog(${idx})" title="Remove"><i data-lucide="trash-2"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function drawAllCharts() {
  applyChartDefaults();

  // 1. Weekly Task Productivity Chart
  const last7Days = DateUtil.getLast7Days();
  const tasks = Store.get('tasks') || [];
  const completedByDay = last7Days.map(date => {
    return tasks.filter(t => t.done && (t.date === date || (t.completedAt && t.completedAt.startsWith(date)))).length;
  });

  const ctxWeekly = document.getElementById('weeklyProductivityChart');
  if (ctxWeekly) {
    if (App._charts['weeklyProductivityChart']) App._charts['weeklyProductivityChart'].destroy();
    App._charts['weeklyProductivityChart'] = new Chart(ctxWeekly, {
      type: 'line',
      data: {
        labels: last7Days.map(d => DateUtil.dayName(d)),
        datasets: [{
          label: 'Tasks Completed',
          data: completedByDay,
          borderColor: 'rgba(124, 58, 237, 1)',
          backgroundColor: 'rgba(124, 58, 237, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2.5,
          pointBackgroundColor: 'rgba(167, 139, 250, 1)',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  // 2. Study Hours Chart
  const studyLogs = Store.get('analytics.studyHours') || [];
  const hoursMap = {};
  studyLogs.forEach(l => {
    hoursMap[l.date] = (hoursMap[l.date] || 0) + Number(l.hours);
  });
  const studyData = last7Days.map(d => hoursMap[d] || 0);

  const ctxStudy = document.getElementById('studyHoursChart');
  if (ctxStudy) {
    if (App._charts['studyHoursChart']) App._charts['studyHoursChart'].destroy();
    App._charts['studyHoursChart'] = new Chart(ctxStudy, {
      type: 'bar',
      data: {
        labels: last7Days.map(d => DateUtil.dayName(d)),
        datasets: [{
          label: 'Study Hours',
          data: studyData,
          backgroundColor: 'rgba(6, 182, 212, 0.75)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => v + 'h' }
          }
        }
      }
    });
  }

  // 3. Monthly Habit Completion Chart (Last 30 Days)
  const last30Days = DateUtil.getLast30Days();
  const habits = Store.get('habits') || [];
  const habitPct30 = last30Days.map(date => {
    if (habits.length === 0) return 0;
    const done = habits.filter(h => (h.completedDates || []).includes(date)).length;
    return Math.round((done / habits.length) * 100);
  });

  const ctxMonthly = document.getElementById('monthlyHabitChart');
  if (ctxMonthly) {
    if (App._charts['monthlyHabitChart']) App._charts['monthlyHabitChart'].destroy();
    App._charts['monthlyHabitChart'] = new Chart(ctxMonthly, {
      type: 'bar',
      data: {
        labels: last30Days.map(d => d.slice(8)), // day numbers
        datasets: [{
          label: 'Habit Completion %',
          data: habitPct30,
          backgroundColor: habitPct30.map(v => v >= 75 ? 'rgba(16, 185, 129, 0.8)' : v >= 50 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(124, 58, 237, 0.5)'),
          borderRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, ticks: { callback: v => v + '%' } },
          x: { ticks: { maxTicksLimit: 15 } }
        }
      }
    });
  }

  // 4. Skill Development Chart (Horizontal Bar)
  const skills = Store.get('skills') || [];
  const ctxSkills = document.getElementById('skillDevChart');
  if (ctxSkills && skills.length > 0) {
    if (App._charts['skillDevChart']) App._charts['skillDevChart'].destroy();
    App._charts['skillDevChart'] = new Chart(ctxSkills, {
      type: 'bar',
      data: {
        labels: skills.map(s => s.name.length > 18 ? s.name.slice(0, 18) + '...' : s.name),
        datasets: [{
          label: 'Mastery Progress %',
          data: skills.map(s => s.progress),
          backgroundColor: 'rgba(59, 130, 246, 0.75)',
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 100, ticks: { callback: v => v + '%' } }
        }
      }
    });
  }
}

function logStudyHoursModal() {
  Modal.open('Log Study Session', `
    <div class="form-group">
      <label class="form-label">Subject / Learning Focus *</label>
      <input type="text" class="form-input" id="studySubject" placeholder="e.g. Java Concurrency & Multithreading (8:30 PM session)" autofocus required />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-input" id="studyDate" value="${DateUtil.today()}" />
      </div>
      <div class="form-group">
        <label class="form-label">Duration (Hours) *</label>
        <input type="number" step="0.5" min="0.5" max="16" class="form-input" id="studyHours" value="2.0" required />
      </div>
    </div>

    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveStudyHours()"><i data-lucide="check"></i> Save Study Log</button>
    </div>
  `);
}

function saveStudyHours() {
  const subject = document.getElementById('studySubject')?.value.trim();
  const date = document.getElementById('studyDate')?.value || DateUtil.today();
  const hours = parseFloat(document.getElementById('studyHours')?.value || '1');

  if (!subject) {
    Toast.error('Please enter a subject or topic.');
    return;
  }

  const logs = Store.get('analytics.studyHours') || [];
  logs.push({ date, hours, subject, createdAt: new Date().toISOString() });
  Store.set('analytics.studyHours', logs);

  Modal.close();
  Toast.success(`Logged ${hours}h study session!`);
  App.navigate('analytics');
}

function deleteStudyLog(reverseIdx) {
  const logs = Store.get('analytics.studyHours') || [];
  const actualIdx = logs.length - 1 - reverseIdx;
  if (actualIdx >= 0 && actualIdx < logs.length) {
    logs.splice(actualIdx, 1);
    Store.set('analytics.studyHours', logs);
    Toast.success('Log deleted');
    App.navigate('analytics');
  }
}
