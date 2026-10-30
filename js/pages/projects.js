/* ===========================
   LifeOS – Projects & Innovation Page
   =========================== */

let currentProjectFilter = 'all';

function renderProjects() {
  let projects = Store.get('projects') || [];
  
  // Seed sample projects if empty
  if (projects.length === 0) {
    projects = [
      {
        id: 'p_lifeos',
        name: 'LifeOS – Personal Growth Engine',
        desc: 'All-in-one personal productivity, academics, career, and habits dashboard tailored for 20+ LPA engineering target.',
        stack: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'LocalStorage', 'Gemini API'],
        startDate: '2026-10-01',
        deadline: '2026-11-15',
        progress: 85,
        status: 'in-progress',
        github: 'https://github.com/vasanthm/lifeos',
        live: 'https://lifeos-vasanth.web.app',
        tasks: [
          { text: 'Design high-conversion dark-mode UI with purple & cyan accents', done: true },
          { text: 'Implement LocalStorage persistence & Store reactivity', done: true },
          { text: 'Build real-time habit streak calculation & calendar grid', done: true },
          { text: 'Integrate Gemini 3.8 Flash AI personal growth assistant', done: true },
          { text: 'Final responsive polish for mobile & tablet', done: false }
        ],
        notes: 'Targeting showcase on LinkedIn and tech portfolio.'
      },
      {
        id: 'p_dsa_engine',
        name: 'Java DSA Algorithm Visualizer',
        desc: 'Interactive visual tool for sorting, graphs, trees, and dynamic programming implementations in core Java.',
        stack: ['Java 21', 'JavaFX', 'Data Structures', 'Algorithms'],
        startDate: '2026-09-15',
        deadline: '2026-12-20',
        progress: 45,
        status: 'in-progress',
        github: 'https://github.com/vasanthm/java-dsa-visualizer',
        live: '',
        tasks: [
          { text: 'Implement binary tree traversal animations', done: true },
          { text: 'Graph shortest path visualizer (Dijkstra, BFS)', done: true },
          { text: 'DP grid memoization step-by-step debugger', done: false },
          { text: 'Export benchmark report in PDF', done: false }
        ],
        notes: 'Prepping this as primary placement project.'
      },
      {
        id: 'p_freelance_agency',
        name: 'Client Freelancing Web Starter',
        desc: 'Reusable component kit and landing page boilerplate to rapidly pitch and deliver websites to local Indian businesses.',
        stack: ['HTML', 'TailwindCSS', 'JavaScript', 'Formspree'],
        startDate: '2026-08-01',
        deadline: '2026-10-20',
        progress: 100,
        status: 'completed',
        github: 'https://github.com/vasanthm/freelance-client-template',
        live: 'https://demo-agency-template.vercel.app',
        tasks: [
          { text: 'SEO metadata optimization', done: true },
          { text: 'Contact form setup with WhatsApp direct chat', done: true },
          { text: 'Responsive testing across mobile devices', done: true }
        ],
        notes: 'Used to close first freelancing gig!'
      }
    ];
    Store.set('projects', projects);
  }

  const filtered = currentProjectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.status === currentProjectFilter);

  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in-progress').length;
  const planningCount = projects.filter(p => p.status === 'planning').length;

  return `
  <div class="page" id="projectsPage">
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">🚀 Projects & Innovation</h1>
        <p class="page-subtitle">Track personal tech projects, college innovations, hackathons, and open source</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="addProjectModal()">
          <i data-lucide="folder-plus"></i> New Project
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="stat-card purple">
        <div class="stat-icon purple"><i data-lucide="layers"></i></div>
        <div class="stat-value">${projects.length}</div>
        <div class="stat-label">Total Projects</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon blue"><i data-lucide="play-circle"></i></div>
        <div class="stat-value">${inProgressCount}</div>
        <div class="stat-label">In Active Development</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green"><i data-lucide="check-circle-2"></i></div>
        <div class="stat-value">${completedCount}</div>
        <div class="stat-label">Completed & Shipped</div>
      </div>
      <div class="stat-card orange">
        <div class="stat-icon orange"><i data-lucide="clock"></i></div>
        <div class="stat-value">${planningCount}</div>
        <div class="stat-label">Planning / Research</div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="tab-bar" style="margin-bottom: 20px;">
      <button class="tab-btn ${currentProjectFilter === 'all' ? 'active' : ''}" onclick="setProjectFilter('all')">
        <i data-lucide="grid"></i> All (${projects.length})
      </button>
      <button class="tab-btn ${currentProjectFilter === 'in-progress' ? 'active' : ''}" onclick="setProjectFilter('in-progress')">
        <i data-lucide="loader"></i> In Progress (${inProgressCount})
      </button>
      <button class="tab-btn ${currentProjectFilter === 'completed' ? 'active' : ''}" onclick="setProjectFilter('completed')">
        <i data-lucide="check"></i> Completed (${completedCount})
      </button>
      <button class="tab-btn ${currentProjectFilter === 'planning' ? 'active' : ''}" onclick="setProjectFilter('planning')">
        <i data-lucide="compass"></i> Planning (${planningCount})
      </button>
    </div>

    <!-- Projects Grid -->
    ${filtered.length === 0 ? `
      <div class="card empty-state">
        <div class="empty-state-icon">🚀</div>
        <h3>No projects found in this category</h3>
        <p>Start a new technical project to strengthen your portfolio for 20+ LPA engineering placements.</p>
        <button class="btn btn-primary" onclick="addProjectModal()"><i data-lucide="plus"></i> Add Project</button>
      </div>
    ` : `
      <div class="grid-3">
        ${filtered.map(p => renderProjectCard(p)).join('')}
      </div>
    `}
  </div>`;
}

function renderProjectCard(p) {
  const statusMap = {
    'in-progress': { label: 'In Progress', class: 'badge-blue' },
    'completed': { label: 'Completed', class: 'badge-green' },
    'planning': { label: 'Planning', class: 'badge-orange' }
  };
  const badgeInfo = statusMap[p.status] || { label: p.status, class: 'badge-gray' };
  const doneTasks = (p.tasks || []).filter(t => t.done).length;
  const totalTasks = (p.tasks || []).length;

  return `
  <div class="project-card" onclick="openProjectDetail('${p.id}')">
    <div class="project-card-header">
      <div style="flex:1; min-width:0;">
        <h3 class="project-name truncate" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</h3>
        <div style="display:flex; gap:6px; align-items:center; margin-top:4px;">
          <span class="badge ${badgeInfo.class}">${badgeInfo.label}</span>
          ${p.deadline ? `<span style="font-size:11px; color:var(--text-muted);">Due ${DateUtil.format(p.deadline)}</span>` : ''}
        </div>
      </div>
      <button class="icon-btn" onclick="event.stopPropagation(); deleteProject('${p.id}')" title="Delete project">
        <i data-lucide="trash-2"></i>
      </button>
    </div>

    <p class="project-desc">${escapeHtml(p.desc || 'No description provided.')}</p>

    <!-- Tech Stack -->
    <div class="project-stack">
      ${(p.stack || []).map(s => `<span class="project-tag">${escapeHtml(s)}</span>`).join('')}
    </div>

    <!-- Progress -->
    <div class="project-progress-row">
      <span style="color:var(--text-secondary); font-size:12px;">Development Progress</span>
      <span style="font-weight:700; color:var(--accent-purple-light); font-size:12.5px;">${p.progress}%</span>
    </div>
    <div class="progress-bar" style="margin-bottom: 12px;">
      <div class="progress-fill ${p.progress === 100 ? 'green' : 'purple'}" style="width: ${p.progress}%"></div>
    </div>

    <!-- Mini tasks progress -->
    ${totalTasks > 0 ? `
      <div style="font-size:11.5px; color:var(--text-muted); display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>Milestone Tasks</span>
        <span>${doneTasks}/${totalTasks} done</span>
      </div>
    ` : ''}

    <!-- Links -->
    <div class="project-links" onclick="event.stopPropagation()">
      ${p.github ? `
        <a href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View Source Code">
          <i data-lucide="github"></i> Code
        </a>
      ` : ''}
      ${p.live ? `
        <a href="${escapeHtml(p.live)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="color:var(--accent-cyan-light); border-color:rgba(6,182,212,0.3);" title="View Live Deployment">
          <i data-lucide="external-link"></i> Live Demo
        </a>
      ` : ''}
      <button class="btn btn-sm btn-ghost" style="margin-left:auto;" onclick="openProjectDetail('${p.id}')">
        Manage <i data-lucide="chevron-right"></i>
      </button>
    </div>
  </div>`;
}

function setProjectFilter(status) {
  currentProjectFilter = status;
  App.navigate('projects');
}

function addProjectModal() {
  Modal.open('Add New Project', `
    <div class="form-group">
      <label class="form-label">Project Name *</label>
      <input type="text" class="form-input" id="projName" placeholder="e.g. Java Microservices E-Commerce" autofocus required />
    </div>

    <div class="form-group">
      <label class="form-label">Description & Goal</label>
      <textarea class="form-textarea" id="projDesc" placeholder="What does this project solve? How does it demonstrate high engineering skill?"></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Tech Stack (comma-separated)</label>
        <input type="text" class="form-input" id="projStack" placeholder="Java, Spring Boot, MySQL, Docker" />
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="projStatus">
          <option value="in-progress" selected>In Progress</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-input" id="projStartDate" value="${DateUtil.today()}" />
      </div>
      <div class="form-group">
        <label class="form-label">Target Deadline</label>
        <input type="date" class="form-input" id="projDeadline" />
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Initial Progress (%)</label>
      <input type="range" class="form-input" id="projProgress" min="0" max="100" value="10" oninput="document.getElementById('projProgVal').innerText = this.value + '%'" />
      <span id="projProgVal" style="font-size:12px; font-weight:600; color:var(--accent-purple-light);">10%</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label">GitHub Repository URL</label>
        <input type="url" class="form-input" id="projGithub" placeholder="https://github.com/vasanthm/..." />
      </div>
      <div class="form-group">
        <label class="form-label">Live Deployment URL</label>
        <input type="url" class="form-input" id="projLive" placeholder="https://yourproject.vercel.app" />
      </div>
    </div>

    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveProject()"><i data-lucide="check"></i> Create Project</button>
    </div>
  `);
}

function saveProject() {
  const name = document.getElementById('projName')?.value.trim();
  if (!name) {
    Toast.error('Please enter a project name.');
    return;
  }

  const stackRaw = document.getElementById('projStack')?.value || '';
  const stack = stackRaw.split(',').map(s => s.trim()).filter(Boolean);

  const newProj = {
    id: 'proj_' + uid(),
    name,
    desc: document.getElementById('projDesc')?.value.trim() || '',
    stack,
    status: document.getElementById('projStatus')?.value || 'in-progress',
    startDate: document.getElementById('projStartDate')?.value || DateUtil.today(),
    deadline: document.getElementById('projDeadline')?.value || '',
    progress: parseInt(document.getElementById('projProgress')?.value || '0', 10),
    github: document.getElementById('projGithub')?.value.trim() || '',
    live: document.getElementById('projLive')?.value.trim() || '',
    tasks: [],
    notes: ''
  };

  const projects = Store.get('projects') || [];
  projects.unshift(newProj);
  Store.set('projects', projects);
  Modal.close();
  Toast.success('Project added successfully!');
  App.navigate('projects');
}

function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  const projects = Store.get('projects') || [];
  const filtered = projects.filter(p => p.id !== id);
  Store.set('projects', filtered);
  Toast.success('Project removed');
  App.navigate('projects');
}

function openProjectDetail(id) {
  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === id);
  if (!p) return;

  const tasks = p.tasks || [];

  Modal.open(p.name, `
    <div style="margin-bottom:16px;">
      <p style="color:var(--text-secondary); line-height:1.6; font-size:14px;">${escapeHtml(p.desc || 'No description.')}</p>
    </div>

    <!-- Tech tags -->
    <div class="project-stack" style="margin-bottom:16px;">
      ${(p.stack || []).map(s => `<span class="project-tag">${escapeHtml(s)}</span>`).join('')}
    </div>

    <!-- Quick controls -->
    <div class="card" style="margin-bottom:16px; padding:14px; background:var(--bg-input);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:600; font-size:13px;">Progress: <span id="detailProgTxt">${p.progress}%</span></span>
        <select class="form-select" style="width:auto; padding:4px 28px 4px 10px; font-size:12px;" onchange="updateProjectStatus('${p.id}', this.value)">
          <option value="in-progress" ${p.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="planning" ${p.status === 'planning' ? 'selected' : ''}>Planning</option>
          <option value="completed" ${p.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </div>
      <input type="range" class="form-input" min="0" max="100" value="${p.progress}" onchange="updateProjectProgress('${p.id}', this.value)" oninput="document.getElementById('detailProgTxt').innerText = this.value + '%'" />
    </div>

    <!-- Links -->
    <div class="form-row" style="margin-bottom:16px;">
      <div class="form-group">
        <label class="form-label" style="font-size:11px;">GitHub URL</label>
        <input type="text" class="form-input" value="${escapeHtml(p.github || '')}" onchange="updateProjectLink('${p.id}', 'github', this.value)" placeholder="Add GitHub repository link" />
      </div>
      <div class="form-group">
        <label class="form-label" style="font-size:11px;">Live Deployment</label>
        <input type="text" class="form-input" value="${escapeHtml(p.live || '')}" onchange="updateProjectLink('${p.id}', 'live', this.value)" placeholder="Add live link" />
      </div>
    </div>

    <!-- Milestone Tasks -->
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="font-size:13px; font-weight:700;">Subtasks & Deliverables (${tasks.filter(t=>t.done).length}/${tasks.length})</h4>
      </div>

      <div id="projectTasksList" style="display:flex; flex-direction:column; gap:8px;">
        ${tasks.map((t, idx) => `
          <div style="display:flex; align-items:center; gap:10px; padding:6px 10px; background:var(--bg-glass); border-radius:var(--radius-sm); border:1px solid var(--border-color);">
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleProjectTask('${p.id}', ${idx})" style="accent-color:var(--accent-purple); cursor:pointer;" />
            <span style="flex:1; font-size:13px; ${t.done ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${escapeHtml(t.text)}</span>
            <button class="icon-btn" onclick="deleteProjectTask('${p.id}', ${idx})" title="Delete subtask" style="width:22px; height:22px;">
              <i data-lucide="x"></i>
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Add Subtask input -->
      <div style="display:flex; gap:8px; margin-top:10px;">
        <input type="text" class="form-input" id="newSubtaskInput" placeholder="Add subtask / feature..." onkeydown="if(event.key==='Enter') addProjectTask('${p.id}')" />
        <button class="btn btn-secondary btn-sm" onclick="addProjectTask('${p.id}')"><i data-lucide="plus"></i> Add</button>
      </div>
    </div>

    <div class="form-footer">
      <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id}'); Modal.close();"><i data-lucide="trash"></i> Delete Project</button>
      <button class="btn btn-primary" onclick="Modal.close(); App.navigate('projects');">Done</button>
    </div>
  `);
}

function updateProjectProgress(id, pct) {
  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === id);
  if (p) {
    p.progress = parseInt(pct, 10);
    if (p.progress === 100) p.status = 'completed';
    Store.set('projects', projects);
  }
}

function updateProjectStatus(id, status) {
  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === id);
  if (p) {
    p.status = status;
    if (status === 'completed') p.progress = 100;
    Store.set('projects', projects);
    Toast.success('Status updated');
  }
}

function updateProjectLink(id, field, val) {
  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === id);
  if (p) {
    p[field] = val.trim();
    Store.set('projects', projects);
  }
}

function addProjectTask(projId) {
  const input = document.getElementById('newSubtaskInput');
  const text = input?.value.trim();
  if (!text) return;

  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === projId);
  if (p) {
    if (!p.tasks) p.tasks = [];
    p.tasks.push({ text, done: false });
    Store.set('projects', projects);
    openProjectDetail(projId);
  }
}

function toggleProjectTask(projId, taskIdx) {
  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === projId);
  if (p && p.tasks && p.tasks[taskIdx] !== undefined) {
    p.tasks[taskIdx].done = !p.tasks[taskIdx].done;
    
    // Auto calculate progress percentage from tasks if tasks exist
    const total = p.tasks.length;
    const done = p.tasks.filter(t => t.done).length;
    if (total > 0) {
      p.progress = Math.round((done / total) * 100);
      if (p.progress === 100) p.status = 'completed';
    }
    Store.set('projects', projects);
    openProjectDetail(projId);
  }
}

function deleteProjectTask(projId, taskIdx) {
  const projects = Store.get('projects') || [];
  const p = projects.find(item => item.id === projId);
  if (p && p.tasks) {
    p.tasks.splice(taskIdx, 1);
    Store.set('projects', projects);
    openProjectDetail(projId);
  }
}
