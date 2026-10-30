/* ===========================
   LifeOS – Skills & Career Development Page
   =========================== */

function renderSkills() {
  const skills = Store.get('skills') || [];
  const avgProgress = skills.length ? Math.round(skills.reduce((a, s) => a + s.progress, 0) / skills.length) : 0;
  const completedSkills = skills.filter(s => s.progress >= 100).length;
  const codingGoals = Store.get('settings.codingGoals') || { dailyTarget: 1, solved: 0, githubGoal: 365 };

  return `
<div class="page" id="skillsPage">
  <div class="page-header">
    <div>
      <h1 class="page-title"><i data-lucide="code-2"></i> Skills & Career</h1>
      <p class="page-subtitle">Track your technical skills and placement readiness</p>
    </div>
    <button class="btn btn-primary btn-sm" onclick="addSkillModal()">
      <i data-lucide="plus"></i> Add Skill
    </button>
  </div>

  <!-- Quick Stats -->
  <div class="grid-4" style="margin-bottom:20px">
    <div class="stat-card purple">
      <div class="stat-icon purple"><i data-lucide="trending-up"></i></div>
      <div class="stat-value">${avgProgress}%</div>
      <div class="stat-label">Avg. Progress</div>
    </div>
    <div class="stat-card green">
      <div class="stat-icon green"><i data-lucide="check-circle"></i></div>
      <div class="stat-value">${completedSkills}</div>
      <div class="stat-label">Skills Mastered</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue"><i data-lucide="zap"></i></div>
      <div class="stat-value">${skills.filter(s => s.status === 'current').length}</div>
      <div class="stat-label">In Progress</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon orange"><i data-lucide="code"></i></div>
      <div class="stat-value">${codingGoals.solved || 0}</div>
      <div class="stat-label">Problems Solved</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn active" onclick="switchSkillsTab('skills',this)"><i data-lucide="layers"></i> Skills</button>
    <button class="tab-btn" onclick="switchSkillsTab('roadmap',this)"><i data-lucide="map"></i> Roadmap</button>
    <button class="tab-btn" onclick="switchSkillsTab('coding',this)"><i data-lucide="terminal"></i> Coding Goals</button>
    <button class="tab-btn" onclick="switchSkillsTab('interview',this)"><i data-lucide="mic"></i> Interview Prep</button>
    <button class="tab-btn" onclick="switchSkillsTab('placement',this)"><i data-lucide="briefcase"></i> Placement</button>
  </div>

  <div id="skillsTabContent">
    ${renderSkillsListTab()}
  </div>
</div>`;
}

function switchSkillsTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('skillsTabContent');
  const renderers = {
    skills: renderSkillsListTab,
    roadmap: renderRoadmapTab,
    coding: renderCodingGoalsTab,
    interview: renderInterviewPrepTab,
    placement: renderPlacementTab,
  };
  content.innerHTML = (renderers[tab] || renderSkillsListTab)();
  lucide.createIcons();
  if (tab === 'placement') setTimeout(() => drawSkillRadarChart(), 100);
}

function renderSkillsListTab() {
  const skills = Store.get('skills') || [];
  if (skills.length === 0) {
    return `<div class="empty-state"><div class="empty-state-icon">💻</div><h3>No skills added</h3><p>Start tracking your technical skills</p><button class="btn btn-primary" onclick="addSkillModal()"><i data-lucide="plus"></i> Add Skill</button></div>`;
  }
  const categories = [...new Set(skills.map(s => s.category))];
  return `
  <div style="margin-top:16px">
    ${categories.map(cat => {
      const catSkills = skills.filter(s => s.category === cat);
      return `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <h3 class="card-title" style="text-transform:capitalize">${cat}</h3>
          <span style="font-size:12px;color:var(--text-muted)">${catSkills.length} skill${catSkills.length !== 1 ? 's' : ''}</span>
        </div>
        ${catSkills.map(s => `
        <div class="skill-row" style="padding:12px 0;border-bottom:1px solid var(--border)">
          <div class="skill-row-header" style="margin-bottom:6px">
            <div style="display:flex;align-items:center;gap:8px">
              <span class="skill-name" style="font-weight:500">${escapeHtml(s.name)}</span>
              ${statusBadge(s.status)}
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:12px;color:var(--text-muted)">⏱ ${s.hoursSpent}h / ${s.targetHours}h</span>
              <span class="skill-pct" style="font-weight:700;color:var(--accent-purple-light)">${s.progress}%</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="progress-bar" style="flex:1">
              <div class="progress-fill" style="width:${s.progress}%"></div>
            </div>
            <input type="range" min="0" max="100" value="${s.progress}" style="width:80px;accent-color:var(--accent-purple)"
              onchange="updateSkillProgress('${s.id}', this.value)" />
            <button class="icon-btn" onclick="deleteSkill('${s.id}')" title="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        </div>`).join('')}
      </div>`;
    }).join('')}
  </div>`;
}

function renderRoadmapTab() {
  const roadmap = [
    { step: 'Java Fundamentals', desc: 'OOP, Collections, Exception Handling', icon: '☕', status: 'current' },
    { step: 'Data Structures & Algorithms', desc: 'Arrays, LinkedList, Trees, Graphs, DP', icon: '🧩', status: 'current' },
    { step: 'Git & GitHub', desc: 'Version control, branching, pull requests', icon: '🔀', status: 'current' },
    { step: 'HTML & CSS', desc: 'Responsive design, Flexbox, Grid', icon: '🎨', status: 'current' },
    { step: 'JavaScript', desc: 'ES6+, DOM, Async/Await, Fetch API', icon: '⚡', status: 'upcoming' },
    { step: 'React.js', desc: 'Components, hooks, state management', icon: '⚛️', status: 'upcoming' },
    { step: 'Backend Development', desc: 'Spring Boot / Node.js, REST APIs', icon: '🛠️', status: 'planned' },
    { step: 'SQL & Databases', desc: 'MySQL, PostgreSQL, query optimization', icon: '🗄️', status: 'current' },
    { step: 'CS Fundamentals', desc: 'OS, CN, DBMS – interview essentials', icon: '📖', status: 'current' },
  ];
  const skills = Store.get('skills') || [];

  return `
  <div style="margin-top:16px">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="map"></i> Learning Roadmap to 20 LPA</h3>
      </div>
      <div style="padding:8px 0">
        ${roadmap.map((item, idx) => {
          const skill = skills.find(s => s.name.toLowerCase().includes(item.step.split(' ')[0].toLowerCase()));
          const progress = skill ? skill.progress : 0;
          const isLast = idx === roadmap.length - 1;
          return `
          <div style="display:flex;gap:16px;padding:12px 0;${!isLast ? 'border-bottom:1px solid var(--border)' : ''}">
            <div style="display:flex;flex-direction:column;align-items:center;gap:0">
              <div style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;
                background:${item.status === 'done' ? 'rgba(16,185,129,0.2)' : item.status === 'current' ? 'rgba(124,58,237,0.2)' : 'var(--bg-glass)'};
                border:2px solid ${item.status === 'done' ? 'var(--accent-green)' : item.status === 'current' ? 'var(--accent-purple)' : 'var(--border)'}">
                ${item.status === 'done' ? '✓' : item.icon}
              </div>
              ${!isLast ? `<div style="width:2px;flex:1;min-height:12px;background:var(--border);margin:4px 0"></div>` : ''}
            </div>
            <div style="flex:1;padding-top:8px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <div>
                  <span style="font-weight:600;font-size:14px">${item.step}</span>
                  ${statusBadge(item.status)}
                </div>
                <span style="font-size:13px;font-weight:700;color:var(--accent-purple-light)">${progress}%</span>
              </div>
              <div style="font-size:12.5px;color:var(--text-muted);margin-bottom:6px">${item.desc}</div>
              ${progress > 0 ? `<div class="progress-bar" style="height:4px"><div class="progress-fill" style="width:${progress}%"></div></div>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function renderCodingGoalsTab() {
  const goals = Store.get('settings.codingGoals') || { dailyTarget: 1, solved: 0, githubGoal: 365, githubContributions: 0 };
  return `
  <div style="margin-top:16px">
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="target"></i> Daily Coding Target</h3>
          <button class="btn btn-sm btn-ghost" onclick="editCodingGoals()"><i data-lucide="edit-3"></i></button>
        </div>
        <div style="text-align:center;padding:20px 0">
          <div style="font-size:56px;font-weight:800;background:linear-gradient(135deg,var(--accent-purple-light),var(--accent-blue-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${goals.dailyTarget}</div>
          <div style="color:var(--text-muted);font-size:14px">problems/day target</div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-muted)">
          <span>📅 Daily goal</span>
          <span>🔥 Stay consistent!</span>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i data-lucide="code"></i> Problems Solved</h3>
          <button class="btn btn-sm btn-ghost" onclick="editSolvedCount()"><i data-lucide="edit-3"></i></button>
        </div>
        <div style="text-align:center;padding:20px 0">
          <div style="font-size:56px;font-weight:800;background:linear-gradient(135deg,var(--accent-green),var(--accent-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${goals.solved}</div>
          <div style="color:var(--text-muted);font-size:14px">total solved</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill green" style="width:${Math.min(100,Math.round((goals.solved/500)*100))}%"></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px">Goal: 500 problems for strong placement</div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="github"></i> GitHub Contribution Goal</h3>
        <button class="btn btn-sm btn-ghost" onclick="editGithubGoal()"><i data-lucide="edit-3"></i></button>
      </div>
      <div style="display:flex;align-items:center;gap:20px">
        <div style="text-align:center">
          <div style="font-size:40px;font-weight:700;color:var(--accent-green)">${goals.githubContributions || 0}</div>
          <div style="font-size:12px;color:var(--text-muted)">contributions</div>
        </div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
            <span>Progress to ${goals.githubGoal} contributions</span>
            <span style="font-weight:600">${Math.min(100,Math.round(((goals.githubContributions||0)/goals.githubGoal)*100))}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill green" style="width:${Math.min(100,Math.round(((goals.githubContributions||0)/goals.githubGoal)*100))}%"></div>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:6px">Target: ${goals.githubGoal} contributions this year</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><h3 class="card-title"><i data-lucide="list-checks"></i> Platforms to Practice</h3></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:8px">
        ${[
          { name: 'LeetCode', icon: '🟡', desc: 'DSA Problems', link: 'https://leetcode.com' },
          { name: 'HackerRank', icon: '🟢', desc: 'Java & DSA', link: 'https://hackerrank.com' },
          { name: 'GeeksforGeeks', icon: '🟠', desc: 'CS Theory + Code', link: 'https://geeksforgeeks.org' },
          { name: 'Codeforces', icon: '🔵', desc: 'Competitive', link: 'https://codeforces.com' },
        ].map(p => `
        <a href="${p.link}" target="_blank" rel="noopener" style="text-decoration:none">
          <div class="card" style="text-align:center;padding:12px;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''">
            <div style="font-size:24px;margin-bottom:4px">${p.icon}</div>
            <div style="font-weight:600;font-size:13px">${p.name}</div>
            <div style="font-size:11.5px;color:var(--text-muted)">${p.desc}</div>
          </div>
        </a>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderInterviewPrepTab() {
  const topics = [
    { name: 'Operating Systems', icon: '💻', subtopics: ['Process & Threads', 'Scheduling Algorithms', 'Memory Management', 'Deadlock', 'File Systems'], priority: 'high' },
    { name: 'Computer Networks', icon: '🌐', subtopics: ['OSI Model', 'TCP/IP', 'HTTP/HTTPS', 'DNS', 'Socket Programming'], priority: 'high' },
    { name: 'DBMS', icon: '🗄️', subtopics: ['Normalization', 'SQL Queries', 'Transactions', 'Indexing', 'NoSQL'], priority: 'high' },
    { name: 'Java OOP', icon: '☕', subtopics: ['Inheritance & Polymorphism', 'Interfaces & Abstractions', 'Collections', 'Exception Handling', 'Multithreading'], priority: 'high' },
    { name: 'DSA Patterns', icon: '🧩', subtopics: ['Arrays & Strings', 'LinkedList', 'Trees & Graphs', 'Dynamic Programming', 'Sliding Window'], priority: 'high' },
    { name: 'System Design Basics', icon: '🏗️', subtopics: ['Load Balancer', 'Database Sharding', 'Caching', 'REST API Design', 'Scalability'], priority: 'medium' },
  ];
  return `
  <div style="margin-top:16px">
    <div style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.1));border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid var(--border)">
      <div style="font-weight:600;margin-bottom:4px">🎯 Interview Prep Strategy</div>
      <div style="font-size:13px;color:var(--text-secondary)">Focus on fundamentals before advanced topics. Solve 2-3 LeetCode problems daily. Revise CS subjects weekly.</div>
    </div>
    <div class="grid-2">
      ${topics.map(topic => `
      <div class="card">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span style="font-size:24px">${topic.icon}</span>
          <div>
            <div style="font-weight:600;font-size:14px">${topic.name}</div>
            <span class="badge badge-${priorityColor(topic.priority)}">${priorityLabel(topic.priority)}</span>
          </div>
        </div>
        <ul style="margin:0;padding-left:16px;font-size:13px;color:var(--text-secondary);line-height:1.8">
          ${topic.subtopics.map(st => `<li>${st}</li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderPlacementTab() {
  const skills = Store.get('skills') || [];
  const avgProgress = skills.length ? Math.round(skills.reduce((a, s) => a + s.progress, 0) / skills.length) : 0;
  const codingGoals = Store.get('settings.codingGoals') || { solved: 0 };
  const internships = Store.get('settings.internships') || [];

  const readinessFactor = Math.round(
    (avgProgress * 0.4) +
    (Math.min(100, (codingGoals.solved / 500) * 100) * 0.3) +
    (Math.min(100, internships.length * 33) * 0.3)
  );

  return `
  <div style="margin-top:16px">
    <div class="grid-2" style="margin-bottom:20px">
      <div class="card" style="text-align:center">
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Placement Readiness</div>
        <div style="font-size:64px;font-weight:800;background:linear-gradient(135deg,var(--accent-purple-light),var(--accent-blue-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${readinessFactor}%</div>
        <div class="progress-bar" style="margin:12px 0">
          <div class="progress-fill ${readinessFactor < 40 ? 'orange' : readinessFactor < 70 ? '' : 'green'}" style="width:${readinessFactor}%"></div>
        </div>
        <div style="font-size:12.5px;color:var(--text-muted)">${readinessFactor < 40 ? '📚 Keep grinding!' : readinessFactor < 70 ? '🔥 Good progress!' : '🚀 Interview ready!'}</div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title" style="font-size:13px"><i data-lucide="briefcase"></i> Internship Tracker</h3>
          <button class="btn btn-sm btn-ghost" onclick="addInternshipModal()"><i data-lucide="plus"></i></button>
        </div>
        ${internships.length === 0 ? `<div class="empty-state" style="padding:16px"><p style="font-size:13px">No internships yet. Apply actively!</p></div>` :
        internships.map(i => `
        <div class="list-item" style="padding:8px 0">
          <div style="flex:1">
            <div style="font-weight:500;font-size:13.5px">${escapeHtml(i.company)}</div>
            <div style="font-size:12px;color:var(--text-muted)">${escapeHtml(i.role)} • ${escapeHtml(i.status)}</div>
          </div>
          <button class="icon-btn" onclick="deleteInternship('${i.id}')"><i data-lucide="x"></i></button>
        </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="bar-chart-2"></i> Skill Radar</h3>
      </div>
      <div style="height:300px;position:relative"><canvas id="skillRadarChart"></canvas></div>
    </div>
  </div>`;
}

function drawSkillRadarChart() {
  const canvas = document.getElementById('skillRadarChart');
  if (!canvas) return;
  if (App._charts['skillRadarChart']) { App._charts['skillRadarChart'].destroy(); }

  const skills = Store.get('skills') || [];
  const cats = ['language', 'cs', 'web', 'backend', 'tools'];
  const catNames = ['Languages', 'CS Theory', 'Web Dev', 'Backend', 'Tools'];
  const data = cats.map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    return catSkills.length ? Math.round(catSkills.reduce((a, s) => a + s.progress, 0) / catSkills.length) : 0;
  });

  App._charts['skillRadarChart'] = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: catNames,
      datasets: [{
        label: 'Skill Level',
        data,
        backgroundColor: 'rgba(124,58,237,0.2)',
        borderColor: CHART_COLORS.purple,
        pointBackgroundColor: CHART_COLORS.purple,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: CHART_COLORS.purple,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20 },
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function addSkillModal() {
  Modal.open('Add Skill', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Skill Name *</label>
        <input type="text" class="form-input" id="skillName" placeholder="e.g. React.js" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="skillCategory">
          <option value="language">Language</option>
          <option value="web">Web Dev</option>
          <option value="backend">Backend</option>
          <option value="cs">CS Theory</option>
          <option value="tools">Tools</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Current Progress (%)</label>
        <input type="number" class="form-input" id="skillProgress" value="0" min="0" max="100" />
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="skillStatus">
          <option value="current">In Progress</option>
          <option value="upcoming">Upcoming</option>
          <option value="planned">Planned</option>
          <option value="done">Completed</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Hours Spent</label>
        <input type="number" class="form-input" id="skillHours" value="0" min="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Target Hours</label>
        <input type="number" class="form-input" id="skillTargetHours" value="100" min="1" />
      </div>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveSkill()"><i data-lucide="save"></i> Save Skill</button>
    </div>
  `);
}

function saveSkill() {
  const name = document.getElementById('skillName')?.value.trim();
  if (!name) { Toast.error('Skill name is required'); return; }
  const skill = {
    id: uid(),
    name,
    category: document.getElementById('skillCategory')?.value || 'other',
    progress: parseInt(document.getElementById('skillProgress')?.value) || 0,
    status: document.getElementById('skillStatus')?.value || 'current',
    hoursSpent: parseInt(document.getElementById('skillHours')?.value) || 0,
    targetHours: parseInt(document.getElementById('skillTargetHours')?.value) || 100,
    priority: (Store.get('skills') || []).length + 1,
    notes: '',
  };
  Store.push('skills', skill);
  Modal.close();
  Toast.success('Skill added!');
  document.getElementById('pageContainer').innerHTML = renderSkills();
  lucide.createIcons();
}

function updateSkillProgress(id, pct) {
  Store.update('skills', id, { progress: parseInt(pct) });
  Toast.success('Progress updated!');
}

function deleteSkill(id) {
  Store.remove('skills', id);
  Toast.success('Skill removed');
  const content = document.getElementById('skillsTabContent');
  if (content) { content.innerHTML = renderSkillsListTab(); lucide.createIcons(); }
}

function editCodingGoals() {
  const goals = Store.get('settings.codingGoals') || { dailyTarget: 1, solved: 0, githubGoal: 365 };
  Modal.open('Edit Coding Goals', `
    <div class="form-group">
      <label class="form-label">Daily Problem Target</label>
      <input type="number" class="form-input" id="cg_daily" value="${goals.dailyTarget}" min="1" max="20" />
    </div>
    <div class="form-group">
      <label class="form-label">Total Problems Solved</label>
      <input type="number" class="form-input" id="cg_solved" value="${goals.solved}" min="0" />
    </div>
    <div class="form-group">
      <label class="form-label">GitHub Contribution Goal (yearly)</label>
      <input type="number" class="form-input" id="cg_github" value="${goals.githubGoal}" min="1" />
    </div>
    <div class="form-group">
      <label class="form-label">Current GitHub Contributions</label>
      <input type="number" class="form-input" id="cg_contrib" value="${goals.githubContributions || 0}" min="0" />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCodingGoals()"><i data-lucide="save"></i> Save</button>
    </div>
  `);
}

function saveCodingGoals() {
  Store.set('settings.codingGoals', {
    dailyTarget: parseInt(document.getElementById('cg_daily')?.value) || 1,
    solved: parseInt(document.getElementById('cg_solved')?.value) || 0,
    githubGoal: parseInt(document.getElementById('cg_github')?.value) || 365,
    githubContributions: parseInt(document.getElementById('cg_contrib')?.value) || 0,
  });
  Modal.close();
  Toast.success('Coding goals updated!');
  const content = document.getElementById('skillsTabContent');
  if (content) { content.innerHTML = renderCodingGoalsTab(); lucide.createIcons(); }
}

function editSolvedCount() { editCodingGoals(); }
function editGithubGoal() { editCodingGoals(); }

function addInternshipModal() {
  Modal.open('Add Internship', `
    <div class="form-group">
      <label class="form-label">Company *</label>
      <input type="text" class="form-input" id="intCompany" placeholder="e.g. Google" autofocus />
    </div>
    <div class="form-group">
      <label class="form-label">Role</label>
      <input type="text" class="form-input" id="intRole" placeholder="e.g. SWE Intern" />
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <select class="form-select" id="intStatus">
        <option value="Applied">Applied</option>
        <option value="OA Pending">OA Pending</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer Received</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveInternship()"><i data-lucide="save"></i> Save</button>
    </div>
  `);
}

function saveInternship() {
  const company = document.getElementById('intCompany')?.value.trim();
  if (!company) { Toast.error('Company name required'); return; }
  const internships = Store.get('settings.internships') || [];
  internships.push({
    id: uid(),
    company,
    role: document.getElementById('intRole')?.value.trim() || '',
    status: document.getElementById('intStatus')?.value || 'Applied',
  });
  Store.set('settings.internships', internships);
  Modal.close();
  Toast.success('Internship added!');
  const content = document.getElementById('skillsTabContent');
  if (content) { content.innerHTML = renderPlacementTab(); setTimeout(() => drawSkillRadarChart(), 100); lucide.createIcons(); }
}

function deleteInternship(id) {
  const list = (Store.get('settings.internships') || []).filter(i => i.id !== id);
  Store.set('settings.internships', list);
  Toast.success('Removed');
  const content = document.getElementById('skillsTabContent');
  if (content) { content.innerHTML = renderPlacementTab(); setTimeout(() => drawSkillRadarChart(), 100); lucide.createIcons(); }
}
