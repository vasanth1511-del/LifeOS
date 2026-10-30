/* ===========================
   LifeOS – Academic Growth Page
   =========================== */

function renderAcademic() {
  return `
<div class="page" id="academicPage">
  <div class="page-header">
    <div>
      <h1 class="page-title"><i data-lucide="graduation-cap"></i> Academic Growth</h1>
      <p class="page-subtitle">Track your subjects, assignments, and performance</p>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="addSubjectModal()">
        <i data-lucide="plus"></i> Add Subject
      </button>
      <button class="btn btn-primary btn-sm" onclick="editCGPA()">
        <i data-lucide="edit-3"></i> Update CGPA
      </button>
    </div>
  </div>

  <!-- CGPA Banner -->
  <div class="card" style="background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.1));margin-bottom:20px">
    <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
      <div style="text-align:center">
        <div style="font-size:52px;font-weight:800;font-family:var(--font-display);background:linear-gradient(135deg,var(--accent-purple-light),var(--accent-blue-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${Store.get('user.cgpa')}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Current CGPA</div>
      </div>
      <div style="flex:1;min-width:200px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:13px;color:var(--text-secondary)">Progress to 9.5 CGPA</span>
          <span style="font-size:13px;font-weight:600">${Math.min(100,Math.round((Store.get('user.cgpa')/9.5)*100))}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.min(100,Math.round((Store.get('user.cgpa')/9.5)*100))}%"></div>
        </div>
        <div style="display:flex;gap:16px;margin-top:12px;font-size:12.5px;color:var(--text-muted)">
          <span>🎓 ${Store.get('user.university')}</span>
          <span>📅 ${Store.get('user.degree')}</span>
          <span>🏆 Target: 9.5+</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn active" onclick="switchAcademicTab('subjects',this)">
      <i data-lucide="book-open"></i> Subjects
    </button>
    <button class="tab-btn" onclick="switchAcademicTab('assignments',this)">
      <i data-lucide="clipboard-list"></i> Assignments
    </button>
    <button class="tab-btn" onclick="switchAcademicTab('performance',this)">
      <i data-lucide="bar-chart-3"></i> Performance
    </button>
  </div>

  <div id="academicTabContent">
    ${renderSubjectsTab()}
  </div>
</div>`;
}

function switchAcademicTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('academicTabContent');
  if (tab === 'subjects') content.innerHTML = renderSubjectsTab();
  else if (tab === 'assignments') content.innerHTML = renderAssignmentsTab();
  else if (tab === 'performance') {
    content.innerHTML = renderPerformanceTab();
    setTimeout(() => drawSubjectChart(), 100);
  }
  lucide.createIcons();
}

function renderSubjectsTab() {
  const subjects = Store.get('subjects') || [];
  if (subjects.length === 0) {
    return `<div class="empty-state">
      <div class="empty-state-icon">📚</div>
      <h3>No subjects yet</h3>
      <p>Add your current semester subjects to track grades and attendance</p>
      <button class="btn btn-primary" onclick="addSubjectModal()"><i data-lucide="plus"></i> Add Subject</button>
    </div>`;
  }
  return `
  <div class="grid-3" style="margin-top:16px">
    ${subjects.map(s => `
    <div class="card subject-card" style="position:relative">
      <button class="icon-btn" style="position:absolute;top:12px;right:12px" onclick="deleteSubject('${s.id}')" title="Delete">
        <i data-lucide="trash-2"></i>
      </button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--accent-purple),var(--accent-blue));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;flex-shrink:0">
          ${s.grade || 'A'}
        </div>
        <div style="min-width:0">
          <div style="font-weight:600;font-size:14px;truncate">${escapeHtml(s.name)}</div>
          <div style="font-size:12px;color:var(--text-muted)">${escapeHtml(s.code)} • ${s.credits} credits</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:var(--bg-glass);border-radius:8px;padding:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:var(--accent-blue-light)">${s.attendance}%</div>
          <div style="font-size:11px;color:var(--text-muted)">Attendance</div>
        </div>
        <div style="background:var(--bg-glass);border-radius:8px;padding:8px;text-align:center">
          <div style="font-size:18px;font-weight:700;color:var(--accent-purple-light)">${s.marks}/100</div>
          <div style="font-size:11px;color:var(--text-muted)">Marks</div>
        </div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:4px">
          <span>Marks Progress</span><span>${s.marks}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${s.marks >= 90 ? 'green' : s.marks >= 75 ? '' : 'orange'}" style="width:${s.marks}%"></div>
        </div>
      </div>
      ${s.attendance < 75 ? `<div style="margin-top:8px;font-size:11.5px;color:var(--accent-red);background:rgba(239,68,68,0.1);border-radius:6px;padding:4px 8px">⚠️ Low attendance</div>` : ''}
    </div>`).join('')}
  </div>`;
}

function renderAssignmentsTab() {
  const tasks = (Store.get('tasks') || []).filter(t => t.category === 'college');
  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);
  return `
  <div style="margin-top:16px">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="clock"></i> Pending Assignments (${pending.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="addAssignmentModal()"><i data-lucide="plus"></i> Add</button>
      </div>
      ${pending.length === 0 ? `<div class="empty-state" style="padding:24px"><div class="empty-state-icon">✅</div><p>No pending assignments!</p></div>` :
      pending.map(t => `
      <div class="list-item" style="padding:12px 0;border-bottom:1px solid var(--border)">
        <div class="quick-task-check ${t.done ? 'checked' : ''}" onclick="toggleAcademicTask('${t.id}')"></div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:500;font-size:14px">${escapeHtml(t.title)}</div>
          <div style="font-size:12px;color:var(--text-muted)">${t.date ? DateUtil.format(t.date) : 'No deadline'} • <span class="badge badge-${priorityColor(t.priority)}">${priorityLabel(t.priority)}</span></div>
        </div>
        <button class="icon-btn" onclick="deleteAcademicTask('${t.id}')"><i data-lucide="trash-2"></i></button>
      </div>`).join('')}
    </div>
    ${done.length > 0 ? `
    <div class="card" style="margin-top:16px">
      <div class="card-header"><h3 class="card-title"><i data-lucide="check-circle"></i> Completed (${done.length})</h3></div>
      ${done.map(t => `
      <div class="list-item" style="padding:10px 0;opacity:0.6">
        <div class="quick-task-check checked" onclick="toggleAcademicTask('${t.id}')"></div>
        <div style="flex:1;text-decoration:line-through;font-size:13.5px">${escapeHtml(t.title)}</div>
        <button class="icon-btn" onclick="deleteAcademicTask('${t.id}')"><i data-lucide="x"></i></button>
      </div>`).join('')}
    </div>` : ''}
  </div>`;
}

function renderPerformanceTab() {
  const subjects = Store.get('subjects') || [];
  const avgMarks = subjects.length ? Math.round(subjects.reduce((a, s) => a + s.marks, 0) / subjects.length) : 0;
  const avgAttendance = subjects.length ? Math.round(subjects.reduce((a, s) => a + s.attendance, 0) / subjects.length) : 0;
  return `
  <div style="margin-top:16px">
    <div class="grid-3" style="margin-bottom:20px">
      <div class="stat-card purple">
        <div class="stat-icon purple"><i data-lucide="star"></i></div>
        <div class="stat-value">${Store.get('user.cgpa')}</div>
        <div class="stat-label">Current CGPA</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon blue"><i data-lucide="percent"></i></div>
        <div class="stat-value">${avgMarks}%</div>
        <div class="stat-label">Avg. Marks</div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green"><i data-lucide="calendar-check"></i></div>
        <div class="stat-value">${avgAttendance}%</div>
        <div class="stat-label">Avg. Attendance</div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="bar-chart-2"></i> Marks by Subject</h3>
      </div>
      ${subjects.length === 0 ? `<div class="empty-state" style="padding:24px"><p>Add subjects to see chart</p></div>` :
      `<div style="height:280px;position:relative"><canvas id="subjectMarksChart"></canvas></div>`}
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><h3 class="card-title"><i data-lucide="calendar"></i> Attendance by Subject</h3></div>
      ${subjects.map(s => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
          <span>${escapeHtml(s.name)}</span>
          <span style="font-weight:600;color:${s.attendance < 75 ? 'var(--accent-red)' : 'var(--accent-green)'}">${s.attendance}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${s.attendance < 75 ? 'orange' : 'green'}" style="width:${Math.min(100,s.attendance)}%"></div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}

function drawSubjectChart() {
  const canvas = document.getElementById('subjectMarksChart');
  if (!canvas) return;
  const subjects = Store.get('subjects') || [];
  if (subjects.length === 0) return;

  if (App._charts['subjectMarksChart']) { App._charts['subjectMarksChart'].destroy(); }

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 280);
  gradient.addColorStop(0, 'rgba(124,58,237,0.85)');
  gradient.addColorStop(1, 'rgba(59,130,246,0.6)');

  App._charts['subjectMarksChart'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: subjects.map(s => s.name.length > 16 ? s.name.slice(0, 14) + '…' : s.name),
      datasets: [{
        label: 'Marks',
        data: subjects.map(s => s.marks),
        backgroundColor: gradient,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Marks: ${ctx.raw}/100 | Grade: ${subjects[ctx.dataIndex]?.grade || '–'}`
          }
        }
      },
      scales: {
        y: { min: 0, max: 100, ticks: { stepSize: 20 } }
      }
    }
  });
}

function addSubjectModal() {
  Modal.open('Add Subject', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Subject Name *</label>
        <input type="text" class="form-input" id="subName" placeholder="e.g. Data Structures" />
      </div>
      <div class="form-group">
        <label class="form-label">Code</label>
        <input type="text" class="form-input" id="subCode" placeholder="e.g. CS301" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Credits</label>
        <input type="number" class="form-input" id="subCredits" value="3" min="1" max="6" />
      </div>
      <div class="form-group">
        <label class="form-label">Semester</label>
        <input type="number" class="form-input" id="subSemester" value="3" min="1" max="8" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Attendance %</label>
        <input type="number" class="form-input" id="subAttendance" value="85" min="0" max="100" />
      </div>
      <div class="form-group">
        <label class="form-label">Marks (out of 100)</label>
        <input type="number" class="form-input" id="subMarks" value="80" min="0" max="100" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Grade</label>
      <select class="form-select" id="subGrade">
        <option value="O">O (Outstanding)</option>
        <option value="A+">A+</option>
        <option value="A" selected>A</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveSubject()"><i data-lucide="save"></i> Save Subject</button>
    </div>
  `);
  setTimeout(() => document.getElementById('subName')?.focus(), 100);
}

function saveSubject() {
  const name = document.getElementById('subName')?.value.trim();
  if (!name) { Toast.error('Subject name is required'); return; }
  const subject = {
    id: uid(),
    name,
    code: document.getElementById('subCode')?.value.trim() || '',
    credits: parseInt(document.getElementById('subCredits')?.value) || 3,
    semester: parseInt(document.getElementById('subSemester')?.value) || 3,
    attendance: parseInt(document.getElementById('subAttendance')?.value) || 85,
    marks: parseInt(document.getElementById('subMarks')?.value) || 80,
    grade: document.getElementById('subGrade')?.value || 'A',
  };
  Store.push('subjects', subject);
  Modal.close();
  Toast.success('Subject added!');
  document.getElementById('pageContainer').innerHTML = renderAcademic();
  lucide.createIcons();
}

function deleteSubject(id) {
  Store.remove('subjects', id);
  Toast.success('Subject removed');
  document.getElementById('pageContainer').innerHTML = renderAcademic();
  lucide.createIcons();
}

function toggleAcademicTask(taskId) {
  TaskUtil.toggleDone(taskId);
  const content = document.getElementById('academicTabContent');
  if (content) { content.innerHTML = renderAssignmentsTab(); lucide.createIcons(); }
}

function deleteAcademicTask(taskId) {
  TaskUtil.delete(taskId);
  Toast.success('Assignment removed');
  const content = document.getElementById('academicTabContent');
  if (content) { content.innerHTML = renderAssignmentsTab(); lucide.createIcons(); }
}

function addAssignmentModal() {
  Modal.open('Add Assignment', `
    <div class="form-group">
      <label class="form-label">Assignment Title *</label>
      <input type="text" class="form-input" id="taskTitle" placeholder="What needs to be done?" autofocus />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Deadline</label>
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
      <label class="form-label">Notes</label>
      <textarea class="form-textarea" id="taskDesc" placeholder="Additional details..." style="min-height:70px"></textarea>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveAssignment()"><i data-lucide="plus"></i> Add Assignment</button>
    </div>
  `);
}

function saveAssignment() {
  const title = document.getElementById('taskTitle')?.value.trim();
  if (!title) { Toast.error('Title required'); return; }
  TaskUtil.addTask({
    title,
    date: document.getElementById('taskDate')?.value || DateUtil.today(),
    priority: document.getElementById('taskPriority')?.value || 'medium',
    category: 'college',
    desc: document.getElementById('taskDesc')?.value || '',
  });
  Modal.close();
  Toast.success('Assignment added!');
  const content = document.getElementById('academicTabContent');
  if (content) { content.innerHTML = renderAssignmentsTab(); lucide.createIcons(); }
}

function editCGPA() {
  const current = Store.get('user.cgpa');
  Modal.open('Update CGPA', `
    <div class="form-group">
      <label class="form-label">Current CGPA (out of 10)</label>
      <input type="number" class="form-input" id="cgpaInput" value="${current}" min="0" max="10" step="0.1" />
    </div>
    <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Target: 9.5+ CGPA</div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCGPA()"><i data-lucide="save"></i> Save</button>
    </div>
  `);
}

function saveCGPA() {
  const val = parseFloat(document.getElementById('cgpaInput')?.value);
  if (isNaN(val) || val < 0 || val > 10) { Toast.error('Enter a valid CGPA between 0 and 10'); return; }
  Store.set('user.cgpa', val);
  Modal.close();
  Toast.success('CGPA updated!');
  document.getElementById('pageContainer').innerHTML = renderAcademic();
  lucide.createIcons();
}
