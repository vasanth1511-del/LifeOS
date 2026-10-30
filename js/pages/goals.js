/* ===========================
   LifeOS – Goal Management Page
   =========================== */

let currentGoalsTab = 'short';

function renderGoals() {
  const shortGoals = Store.get('goals.short') || [];
  const mediumGoals = Store.get('goals.medium') || [];
  const longGoals = Store.get('goals.long') || [];

  // Seed default goals if completely empty
  if (shortGoals.length === 0 && mediumGoals.length === 0 && longGoals.length <= 2) {
    if (shortGoals.length === 0) {
      Store.set('goals.short', [
        {
          id: 'sg_1',
          title: 'Complete Java OOP Polymorphism & Abstract Classes review',
          deadline: '2026-11-03',
          priority: 'high',
          progress: 70,
          desc: 'Revise core concepts and implement 3 demonstration problems.',
          milestones: [
            { text: 'Read class notes & documentation', done: true },
            { text: 'Write Java example for interfaces vs abstract classes', done: true },
            { text: 'Solve 2 HackerRank inheritance challenges', done: false }
          ]
        },
        {
          id: 'sg_2',
          title: 'Solve 15 LeetCode Array & String problems this week',
          deadline: '2026-11-06',
          priority: 'high',
          progress: 40,
          desc: 'Build strong intuition for sliding window & two pointers.',
          milestones: [
            { text: 'Two Sum & 3Sum', done: true },
            { text: 'Longest Substring Without Repeating Characters', done: true },
            { text: 'Trapping Rain Water', done: false },
            { text: 'Minimum Window Substring', done: false }
          ]
        },
        {
          id: 'sg_3',
          title: 'Draft freelancing service profile & GitHub README',
          deadline: '2026-11-05',
          priority: 'medium',
          progress: 50,
          desc: 'Create clean portfolio assets for prospective clients.',
          milestones: [
            { text: 'Design profile header & skills banner', done: true },
            { text: 'List 3 featured projects with live links', done: false }
          ]
        }
      ]);
    }

    if (mediumGoals.length === 0) {
      Store.set('goals.medium', [
        {
          id: 'mg_1',
          title: 'Maintain 9.2+ Semester SGPA in 3rd Semester exams',
          deadline: '2026-12-20',
          priority: 'high',
          progress: 65,
          desc: 'Keep academic aggregate strong for top-tier placement eligibility.',
          milestones: [
            { text: 'Complete internal exam 1 & 2 with 90%+', done: true },
            { text: 'Submit all lab records on time', done: true },
            { text: 'Prepare Math & CS theory revision notes', done: false },
            { text: 'Solve previous 3 years question papers', done: false }
          ]
        },
        {
          id: 'mg_2',
          title: 'Build full-stack Java Spring Boot + React portfolio app',
          deadline: '2027-01-15',
          priority: 'high',
          progress: 25,
          desc: 'End-to-end full stack application showcasing RESTful APIs, JWT auth, and clean frontend.',
          milestones: [
            { text: 'Design DB schema in MySQL', done: true },
            { text: 'Implement backend API with Spring Boot', done: false },
            { text: 'Create React frontend UI', done: false },
            { text: 'Deploy on cloud with CI/CD', done: false }
          ]
        },
        {
          id: 'mg_3',
          title: 'Earn first ₹15,000 through freelance website work',
          deadline: '2027-02-28',
          priority: 'medium',
          progress: 20,
          desc: 'Take on initial freelance gigs to build financial autonomy.',
          milestones: [
            { text: 'Publish portfolio website', done: true },
            { text: 'Pitch to 10 local business owners', done: false },
            { text: 'Deliver 1st paid project with 5-star rating', done: false }
          ]
        }
      ]);
    }
  }

  const sGoals = Store.get('goals.short') || [];
  const mGoals = Store.get('goals.medium') || [];
  const lGoals = Store.get('goals.long') || [];

  const allGoals = [...sGoals, ...mGoals, ...lGoals];
  const totalCount = allGoals.length;
  const completedCount = allGoals.filter(g => g.progress === 100).length;
  const avgOverallProgress = totalCount > 0 ? Math.round(allGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / totalCount) : 0;

  let activeList = [];
  if (currentGoalsTab === 'short') activeList = sGoals;
  else if (currentGoalsTab === 'medium') activeList = mGoals;
  else activeList = lGoals;

  return `
  <div class="page" id="goalsPage">
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">🎯 Goal Management System</h1>
        <p class="page-subtitle">Hierarchical growth architecture: daily sprints, semester milestones, and 20+ LPA ambition</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="addGoalModal('${currentGoalsTab}')">
          <i data-lucide="plus-circle"></i> Add ${currentGoalsTab.charAt(0).toUpperCase() + currentGoalsTab.slice(1)} Goal
        </button>
      </div>
    </div>

    <!-- Overview Statistics -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="stat-card purple">
        <div class="stat-icon purple"><i data-lucide="target"></i></div>
        <div class="stat-value">${totalCount}</div>
        <div class="stat-label">Total System Goals</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon blue"><i data-lucide="trending-up"></i></div>
        <div class="stat-value">${avgOverallProgress}%</div>
        <div class="stat-label">Overall Progress Rate</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green"><i data-lucide="check-check"></i></div>
        <div class="stat-value">${completedCount}</div>
        <div class="stat-label">Accomplished Goals</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon orange"><i data-lucide="award"></i></div>
        <div class="stat-value">20+ LPA</div>
        <div class="stat-label">North Star Target</div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="tab-bar" style="margin-bottom: 20px;">
      <button class="tab-btn ${currentGoalsTab === 'short' ? 'active' : ''}" onclick="setGoalsTab('short')">
        <i data-lucide="zap"></i> Short-Term (Daily & Weekly) <span class="badge badge-purple" style="margin-left:6px;">${sGoals.length}</span>
      </button>
      <button class="tab-btn ${currentGoalsTab === 'medium' ? 'active' : ''}" onclick="setGoalsTab('medium')">
        <i data-lucide="calendar"></i> Medium-Term (Monthly & Semester) <span class="badge badge-blue" style="margin-left:6px;">${mGoals.length}</span>
      </button>
      <button class="tab-btn ${currentGoalsTab === 'long' ? 'active' : ''}" onclick="setGoalsTab('long')">
        <i data-lucide="compass"></i> Long-Term (Career & 20+ LPA) <span class="badge badge-orange" style="margin-left:6px;">${lGoals.length}</span>
      </button>
    </div>

    <!-- Goals Container -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <i data-lucide="${currentGoalsTab === 'short' ? 'zap' : currentGoalsTab === 'medium' ? 'calendar' : 'compass'}"></i>
          ${currentGoalsTab === 'short' ? 'Short-Term Targets (Next 1–14 Days)' : currentGoalsTab === 'medium' ? 'Medium-Term Objectives (1–6 Months)' : 'Long-Term Strategic Ambitions (1–4 Years)'}
        </h3>
        <button class="btn btn-sm btn-ghost" onclick="addGoalModal('${currentGoalsTab}')">
          <i data-lucide="plus"></i> Add Goal
        </button>
      </div>

      ${activeList.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🎯</div>
          <h3>No goals defined in this category</h3>
          <p>Define clear, actionable targets to track steady growth every single day.</p>
          <button class="btn btn-primary btn-sm" onclick="addGoalModal('${currentGoalsTab}')">Set Goal</button>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${activeList.map(g => renderGoalItem(currentGoalsTab, g)).join('')}
        </div>
      `}
    </div>
  </div>`;
}

function renderGoalItem(type, g) {
  const pColor = priorityColor(g.priority);
  const milestones = g.milestones || [];
  const completedMilestones = milestones.filter(m => typeof m === 'object' ? m.done : false).length;
  const isDone = g.progress === 100;

  return `
  <div class="card" style="background:var(--bg-card-hover); border-color:${isDone ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'};">
    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px;">
      <div style="flex:1;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
          <span class="badge badge-${pColor}">${priorityLabel(g.priority)} Priority</span>
          ${isDone ? '<span class="badge badge-green">✓ Completed</span>' : ''}
          ${g.deadline ? `<span style="font-size:12px; color:var(--text-muted);"><i data-lucide="calendar" style="width:12px; height:12px; vertical-align:middle;"></i> Due ${DateUtil.format(g.deadline)}</span>` : ''}
        </div>
        <h3 style="font-size:16px; font-weight:700; color:var(--text-primary); ${isDone ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${escapeHtml(g.title)}</h3>
        ${g.desc ? `<p style="font-size:13px; color:var(--text-secondary); margin-top:4px;">${escapeHtml(g.desc)}</p>` : ''}
      </div>

      <div style="display:flex; gap:6px;">
        <button class="icon-btn" onclick="editGoalModal('${type}', '${g.id}')" title="Edit goal">
          <i data-lucide="edit-3"></i>
        </button>
        <button class="icon-btn" onclick="deleteGoal('${type}', '${g.id}')" title="Delete goal">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>

    <!-- Progress Slider & Bar -->
    <div style="margin: 12px 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:12.5px;">
        <span style="color:var(--text-secondary);">Completion: <strong style="color:var(--accent-purple-light);">${g.progress}%</strong></span>
        ${milestones.length > 0 ? `<span style="color:var(--text-muted); font-size:11.5px;">${completedMilestones}/${milestones.length} milestones complete</span>` : ''}
      </div>
      <div class="progress-bar">
        <div class="progress-fill ${isDone ? 'green' : 'purple'}" style="width: ${g.progress}%"></div>
      </div>
    </div>

    <!-- Milestones Checkboxes -->
    ${milestones.length > 0 ? `
      <div style="background:var(--bg-input); padding:10px 14px; border-radius:var(--radius-md); margin-top:10px;">
        <div style="font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:8px;">
          Key Action Milestones
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${milestones.map((m, idx) => {
            const isObj = typeof m === 'object';
            const text = isObj ? m.text : m;
            const done = isObj ? m.done : false;
            return `
              <label class="checkbox-label" style="font-size:13px;">
                <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleMilestone('${type}', '${g.id}', ${idx})" />
                <span style="${done ? 'text-decoration:line-through; color:var(--text-muted);' : 'color:var(--text-primary);'}">${escapeHtml(text)}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}
  </div>`;
}

function setGoalsTab(tab) {
  currentGoalsTab = tab;
  App.navigate('goals');
}

function addGoalModal(type) {
  Modal.open(`Add ${type.charAt(0).toUpperCase() + type.slice(1)} Goal`, `
    <div class="form-group">
      <label class="form-label">Goal Title *</label>
      <input type="text" class="form-input" id="goalTitle" placeholder="e.g. Master Binary Search & Sliding Window in Java" autofocus required />
    </div>

    <div class="form-group">
      <label class="form-label">Description / Strategic Purpose</label>
      <textarea class="form-textarea" id="goalDesc" placeholder="Why does this goal matter for your 20+ LPA career or life improvement?"></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Target Deadline</label>
        <input type="date" class="form-input" id="goalDeadline" value="${DateUtil.today()}" />
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="goalPriority">
          <option value="high" selected>🔴 High Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="low">🟢 Low Priority</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Action Milestones (one per line)</label>
      <textarea class="form-textarea" id="goalMilestones" placeholder="Step 1: Read standard documentation&#10;Step 2: Solve 5 practice problems&#10;Step 3: Document edge cases in notes" style="min-height:90px;"></textarea>
    </div>

    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveGoal('${type}')"><i data-lucide="check"></i> Create Goal</button>
    </div>
  `);
}

function saveGoal(type) {
  const title = document.getElementById('goalTitle')?.value.trim();
  if (!title) {
    Toast.error('Please enter a goal title.');
    return;
  }

  const milestonesRaw = document.getElementById('goalMilestones')?.value || '';
  const milestones = milestonesRaw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(text => ({ text, done: false }));

  const newGoal = {
    id: 'g_' + uid(),
    title,
    desc: document.getElementById('goalDesc')?.value.trim() || '',
    deadline: document.getElementById('goalDeadline')?.value || '',
    priority: document.getElementById('goalPriority')?.value || 'medium',
    progress: 0,
    milestones,
    createdAt: new Date().toISOString()
  };

  const path = `goals.${type}`;
  const list = Store.get(path) || [];
  list.unshift(newGoal);
  Store.set(path, list);
  Modal.close();
  Toast.success('Goal established!');
  App.navigate('goals');
}

function editGoalModal(type, id) {
  const path = `goals.${type}`;
  const list = Store.get(path) || [];
  const g = list.find(item => item.id === id);
  if (!g) return;

  const milestonesText = (g.milestones || []).map(m => typeof m === 'object' ? m.text : m).join('\n');

  Modal.open('Edit Goal', `
    <div class="form-group">
      <label class="form-label">Goal Title *</label>
      <input type="text" class="form-input" id="editGoalTitle" value="${escapeHtml(g.title)}" required />
    </div>

    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-textarea" id="editGoalDesc">${escapeHtml(g.desc || '')}</textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Target Deadline</label>
        <input type="date" class="form-input" id="editGoalDeadline" value="${g.deadline || ''}" />
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="editGoalPriority">
          <option value="high" ${g.priority === 'high' ? 'selected' : ''}>🔴 High Priority</option>
          <option value="medium" ${g.priority === 'medium' ? 'selected' : ''}>🟡 Medium Priority</option>
          <option value="low" ${g.priority === 'low' ? 'selected' : ''}>🟢 Low Priority</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Completion Progress: <strong id="editGoalProgVal" style="color:var(--accent-purple-light);">${g.progress}%</strong></label>
      <input type="range" class="form-input" id="editGoalProgress" min="0" max="100" value="${g.progress}" oninput="document.getElementById('editGoalProgVal').innerText = this.value + '%'" />
    </div>

    <div class="form-group">
      <label class="form-label">Action Milestones (one per line)</label>
      <textarea class="form-textarea" id="editGoalMilestones">${escapeHtml(milestonesText)}</textarea>
    </div>

    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="updateGoalDetails('${type}', '${g.id}')"><i data-lucide="check"></i> Save Changes</button>
    </div>
  `);
}

function updateGoalDetails(type, id) {
  const path = `goals.${type}`;
  const list = Store.get(path) || [];
  const g = list.find(item => item.id === id);
  if (!g) return;

  const title = document.getElementById('editGoalTitle')?.value.trim();
  if (!title) {
    Toast.error('Goal title cannot be empty.');
    return;
  }

  const milestonesRaw = document.getElementById('editGoalMilestones')?.value || '';
  const currentMap = new Map();
  (g.milestones || []).forEach(m => {
    if (typeof m === 'object') currentMap.set(m.text, m.done);
  });

  const newMilestones = milestonesRaw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(text => ({
      text,
      done: currentMap.has(text) ? currentMap.get(text) : false
    }));

  g.title = title;
  g.desc = document.getElementById('editGoalDesc')?.value.trim() || '';
  g.deadline = document.getElementById('editGoalDeadline')?.value || '';
  g.priority = document.getElementById('editGoalPriority')?.value || 'medium';
  g.progress = parseInt(document.getElementById('editGoalProgress')?.value || '0', 10);
  g.milestones = newMilestones;

  Store.set(path, list);
  Modal.close();
  Toast.success('Goal updated!');
  App.navigate('goals');
}

function deleteGoal(type, id) {
  if (!confirm('Are you sure you want to delete this goal?')) return;
  const path = `goals.${type}`;
  const list = Store.get(path) || [];
  const filtered = list.filter(g => g.id !== id);
  Store.set(path, filtered);
  Toast.success('Goal removed');
  App.navigate('goals');
}

function toggleMilestone(type, goalId, milestoneIdx) {
  const path = `goals.${type}`;
  const list = Store.get(path) || [];
  const g = list.find(item => item.id === goalId);
  if (g && g.milestones && g.milestones[milestoneIdx]) {
    if (typeof g.milestones[milestoneIdx] === 'string') {
      g.milestones[milestoneIdx] = { text: g.milestones[milestoneIdx], done: true };
    } else {
      g.milestones[milestoneIdx].done = !g.milestones[milestoneIdx].done;
    }

    // Auto update progress based on milestone completion
    const total = g.milestones.length;
    const done = g.milestones.filter(m => m.done).length;
    if (total > 0) {
      g.progress = Math.round((done / total) * 100);
    }

    Store.set(path, list);
    App.navigate('goals');
  }
}
