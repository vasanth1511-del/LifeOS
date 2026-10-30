/* ===========================
   LifeOS – Freelancing & Financial Growth Page
   =========================== */

function renderFreelancing() {
  const fl = Store.get('freelancing') || {};
  const income = fl.income || [];
  const expenses = fl.expenses || [];
  const clients = fl.clients || [];

  const totalIncome = income.reduce((a, i) => a + (i.amount || 0), 0);
  const totalExpenses = expenses.reduce((a, e) => a + (e.amount || 0), 0);
  const net = totalIncome - totalExpenses;
  const savings = fl.currentSavings || 0;
  const savingsGoal = fl.savingsGoal || 5000;

  return `
<div class="page" id="freelancingPage">
  <div class="page-header">
    <div>
      <h1 class="page-title"><i data-lucide="briefcase"></i> Freelancing & Finance</h1>
      <p class="page-subtitle">Track income, clients and financial growth</p>
    </div>
    <button class="btn btn-primary btn-sm" onclick="addIncomeModal()">
      <i data-lucide="plus"></i> Log Income
    </button>
  </div>

  <!-- Stat Cards -->
  <div class="grid-4" style="margin-bottom:20px">
    <div class="stat-card green">
      <div class="stat-icon green"><i data-lucide="trending-up"></i></div>
      <div class="stat-value">${formatINR(totalIncome)}</div>
      <div class="stat-label">Total Income</div>
    </div>
    <div class="stat-card red" style="--stat-color:var(--accent-red)">
      <div class="stat-icon" style="background:rgba(239,68,68,0.15)"><i data-lucide="trending-down" style="color:var(--accent-red)"></i></div>
      <div class="stat-value" style="color:var(--accent-red)">${formatINR(totalExpenses)}</div>
      <div class="stat-label">Total Expenses</div>
    </div>
    <div class="stat-card ${net >= 0 ? 'purple' : 'orange'}">
      <div class="stat-icon ${net >= 0 ? 'purple' : 'orange'}"><i data-lucide="wallet"></i></div>
      <div class="stat-value">${net >= 0 ? '+' : ''}${formatINR(net)}</div>
      <div class="stat-label">Net Balance</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue"><i data-lucide="users"></i></div>
      <div class="stat-value">${clients.length}</div>
      <div class="stat-label">Total Clients</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn active" onclick="switchFreelancingTab('overview',this)"><i data-lucide="layout-dashboard"></i> Overview</button>
    <button class="tab-btn" onclick="switchFreelancingTab('income',this)"><i data-lucide="indian-rupee"></i> Income/Expenses</button>
    <button class="tab-btn" onclick="switchFreelancingTab('clients',this)"><i data-lucide="users"></i> Clients</button>
    <button class="tab-btn" onclick="switchFreelancingTab('skills',this)"><i data-lucide="code-2"></i> FL Skills</button>
    <button class="tab-btn" onclick="switchFreelancingTab('portfolio',this)"><i data-lucide="folder-kanban"></i> Portfolio</button>
  </div>

  <div id="freelancingTabContent" style="margin-top:16px">
    ${renderFreelancingOverview()}
  </div>
</div>`;
}

function switchFreelancingTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('freelancingTabContent');
  const renderers = {
    overview: renderFreelancingOverview,
    income: renderIncomeExpensesTab,
    clients: renderClientsTab,
    skills: renderFreelancingSkillsTab,
    portfolio: renderPortfolioTab,
  };
  content.innerHTML = (renderers[tab] || renderFreelancingOverview)();
  lucide.createIcons();
  if (tab === 'overview') setTimeout(() => drawIncomeChart(), 100);
}

function renderFreelancingOverview() {
  const fl = Store.get('freelancing') || {};
  const income = fl.income || [];
  const expenses = fl.expenses || [];
  const savings = fl.currentSavings || 0;
  const savingsGoal = fl.savingsGoal || 5000;
  const savingsPct = Math.min(100, Math.round((savings / savingsGoal) * 100));

  const milestones = [
    { label: 'First freelance earning', done: income.length > 0, target: '₹1' },
    { label: 'Earn ₹1,000', done: income.reduce((a,i) => a + i.amount, 0) >= 1000, target: '₹1K' },
    { label: 'Earn ₹5,000', done: income.reduce((a,i) => a + i.amount, 0) >= 5000, target: '₹5K' },
    { label: 'Earn ₹10,000', done: income.reduce((a,i) => a + i.amount, 0) >= 10000, target: '₹10K' },
    { label: '3 Clients', done: (fl.clients || []).length >= 3, target: '3' },
    { label: 'Monthly ₹5,000', done: false, target: '₹5K/mo' },
  ];

  return `
  <div class="grid-2" style="margin-bottom:20px">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="piggy-bank"></i> Savings Progress</h3>
        <button class="btn btn-sm btn-ghost" onclick="editSavingsGoal()"><i data-lucide="edit-3"></i></button>
      </div>
      <div style="text-align:center;padding:12px 0">
        <div style="font-size:36px;font-weight:800;color:var(--accent-green)">${formatINR(savings)}</div>
        <div style="font-size:13px;color:var(--text-muted)">of ${formatINR(savingsGoal)} goal</div>
      </div>
      <div class="progress-bar" style="height:10px;margin-bottom:8px">
        <div class="progress-fill green" style="width:${savingsPct}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted)">
        <span>${savingsPct}% saved</span>
        <span>${formatINR(savingsGoal - savings)} remaining</span>
      </div>
      <button class="btn btn-sm btn-secondary" style="margin-top:12px;width:100%" onclick="updateSavingsModal()">
        <i data-lucide="edit-3"></i> Update Savings
      </button>
    </div>

    <div class="card">
      <div class="card-header"><h3 class="card-title"><i data-lucide="trophy"></i> Financial Milestones</h3></div>
      ${milestones.map(m => `
      <div class="list-item" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:18px">${m.done ? '✅' : '⬜'}</span>
        <div style="flex:1;font-size:13.5px;${m.done ? 'text-decoration:line-through;opacity:0.6' : ''}">${m.label}</div>
        <span class="badge badge-${m.done ? 'green' : 'gray'}">${m.target}</span>
      </div>`).join('')}
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="line-chart"></i> Income Trend (Monthly)</h3>
    </div>
    <div style="height:240px;position:relative"><canvas id="incomeChart"></canvas></div>
  </div>`;
}

function renderIncomeExpensesTab() {
  const fl = Store.get('freelancing') || {};
  const income = (fl.income || []).slice().reverse();
  const expenses = (fl.expenses || []).slice().reverse();

  let balance = 0;
  const allTxns = [
    ...income.map(i => ({ ...i, type: 'income' })),
    ...expenses.map(e => ({ ...e, type: 'expense' })),
  ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return `
  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="plus-circle"></i> Add Income</h3>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="addIncomeModal()"><i data-lucide="plus"></i> Log Income</button>
    </div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="minus-circle"></i> Add Expense</h3>
      </div>
      <button class="btn btn-secondary" style="width:100%" onclick="addExpenseModal()"><i data-lucide="plus"></i> Log Expense</button>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="list"></i> Transaction History</h3>
    </div>
    ${allTxns.length === 0 ? `<div class="empty-state" style="padding:24px"><p>No transactions yet</p></div>` :
    allTxns.map(t => `
    <div class="list-item" style="padding:12px 0;border-bottom:1px solid var(--border)">
      <div style="width:36px;height:36px;border-radius:50%;background:${t.type === 'income' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <i data-lucide="${t.type === 'income' ? 'arrow-down-left' : 'arrow-up-right'}" style="color:${t.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)'}"></i>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:500;font-size:14px">${escapeHtml(t.source || t.category || 'Transaction')}</div>
        <div style="font-size:12px;color:var(--text-muted)">${t.date ? DateUtil.format(t.date) : '–'} ${t.description ? '• ' + escapeHtml(t.description) : ''}</div>
      </div>
      <div style="font-weight:700;font-size:15px;color:${t.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)'};flex-shrink:0">
        ${t.type === 'income' ? '+' : '-'}${formatINR(t.amount || 0)}
      </div>
      <button class="icon-btn" onclick="delete${t.type === 'income' ? 'Income' : 'Expense'}('${t.id}')"><i data-lucide="trash-2"></i></button>
    </div>`).join('')}
  </div>`;
}

function renderClientsTab() {
  const clients = Store.get('freelancing.clients') || [];
  return `
  <div class="card">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="users"></i> Client Tracker</h3>
      <button class="btn btn-primary btn-sm" onclick="addClientModal()"><i data-lucide="plus"></i> Add Client</button>
    </div>
    ${clients.length === 0 ? `<div class="empty-state" style="padding:32px"><div class="empty-state-icon">👥</div><h3>No clients yet</h3><p>Start reaching out and track your clients here</p></div>` : `
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;min-width:600px">
        <thead>
          <tr style="border-bottom:1px solid var(--border)">
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500">Client</th>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500">Project</th>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500">Status</th>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500">Amount</th>
            <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500">Deadline</th>
            <th style="padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500"></th>
          </tr>
        </thead>
        <tbody>
          ${clients.map(c => `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:10px 12px;font-weight:500;font-size:13.5px">${escapeHtml(c.name)}</td>
            <td style="padding:10px 12px;font-size:13px;color:var(--text-secondary)">${escapeHtml(c.project || '–')}</td>
            <td style="padding:10px 12px">
              <span class="badge badge-${c.status === 'Active' ? 'green' : c.status === 'Completed' ? 'blue' : c.status === 'Prospect' ? 'orange' : 'gray'}">${escapeHtml(c.status || 'Prospect')}</span>
            </td>
            <td style="padding:10px 12px;font-weight:600;color:var(--accent-green)">${c.amount ? formatINR(c.amount) : '–'}</td>
            <td style="padding:10px 12px;font-size:13px;color:var(--text-muted)">${c.deadline ? DateUtil.format(c.deadline) : '–'}</td>
            <td style="padding:10px 12px">
              <button class="icon-btn" onclick="deleteClient('${c.id}')"><i data-lucide="trash-2"></i></button>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`}
  </div>`;
}

function renderFreelancingSkillsTab() {
  const fl = Store.get('freelancing') || {};
  const skills = fl.skills || [
    { name: 'HTML/CSS/JS', level: 40 },
    { name: 'React / Frontend', level: 10 },
    { name: 'Portfolio Building', level: 25 },
    { name: 'Client Communication', level: 30 },
    { name: 'Proposal Writing', level: 20 },
    { name: 'Figma / Design', level: 15 },
  ];

  return `
  <div class="card">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="code-2"></i> Freelancing Skills</h3>
      <button class="btn btn-sm btn-ghost" onclick="addFreelancingSkillModal()"><i data-lucide="plus"></i></button>
    </div>
    ${skills.map((s, idx) => `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-weight:500;font-size:13.5px">${escapeHtml(s.name)}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-weight:700;color:var(--accent-purple-light)">${s.level}%</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="progress-bar" style="flex:1">
          <div class="progress-fill" style="width:${s.level}%"></div>
        </div>
        <input type="range" min="0" max="100" value="${s.level}" style="width:80px;accent-color:var(--accent-purple)"
          onchange="updateFreelancingSkill(${idx}, this.value)" />
      </div>
    </div>`).join('')}
  </div>`;
}

function renderPortfolioTab() {
  const fl = Store.get('freelancing') || {};
  const portfolio = fl.portfolio || {};
  const items = [
    { key: 'website', label: 'Portfolio Website Live', icon: '🌐', tip: 'Host on GitHub Pages or Netlify for free' },
    { key: 'github', label: 'GitHub Profile Active (10+ repos)', icon: '🐙', tip: 'Pin your best projects' },
    { key: 'linkedin', label: 'LinkedIn Profile Optimized', icon: '💼', tip: 'Add skills, projects, and education' },
    { key: 'projects', label: `5+ Projects Showcased (${portfolio.projects || 0}/5)`, icon: '🚀', tip: 'Include web apps, tools, and college projects' },
    { key: 'freelanceJob', label: 'First Freelance Job Completed', icon: '🎯', tip: 'Even small jobs count - Fiverr, Upwork, or direct' },
    { key: 'resume', label: 'Updated Resume (2-page max)', icon: '📄', tip: 'Tailor for each job application' },
  ];

  const done = items.filter(i => i.key === 'projects' ? (portfolio.projects || 0) >= 5 : portfolio[i.key]).length;

  return `
  <div class="card">
    <div class="card-header">
      <h3 class="card-title"><i data-lucide="folder-kanban"></i> Portfolio Checklist</h3>
      <span class="badge badge-${done === items.length ? 'green' : 'purple'}">${done}/${items.length}</span>
    </div>
    <div class="progress-bar" style="margin-bottom:16px;height:8px">
      <div class="progress-fill green" style="width:${Math.round((done/items.length)*100)}%"></div>
    </div>
    ${items.map(item => {
      const checked = item.key === 'projects' ? (portfolio.projects || 0) >= 5 : !!portfolio[item.key];
      return `
      <div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);align-items:flex-start">
        <span style="font-size:22px;flex-shrink:0;margin-top:2px">${item.icon}</span>
        <div style="flex:1">
          <div style="font-weight:500;font-size:14px;${checked ? 'text-decoration:line-through;opacity:0.6' : ''}">${item.label}</div>
          <div style="font-size:12px;color:var(--text-muted)">${item.tip}</div>
        </div>
        <button class="btn btn-sm ${checked ? 'btn-primary' : 'btn-secondary'}" onclick="togglePortfolioItem('${item.key}')">
          ${checked ? '✓ Done' : 'Mark Done'}
        </button>
      </div>`;
    }).join('')}
    <div style="margin-top:16px">
      <label class="form-label">Projects Count</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="number" class="form-input" id="portfolio_projects" value="${portfolio.projects || 0}" min="0" style="width:100px" />
        <button class="btn btn-primary btn-sm" onclick="savePortfolioProjects()">Save</button>
      </div>
    </div>
  </div>`;
}

function drawIncomeChart() {
  const canvas = document.getElementById('incomeChart');
  if (!canvas) return;
  if (App._charts['incomeChart']) { App._charts['incomeChart'].destroy(); }

  const income = Store.get('freelancing.income') || [];
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({ label: d.toLocaleString('en-IN', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() });
  }

  const data = months.map(m => {
    return income
      .filter(i => {
        if (!i.date) return false;
        const d = new Date(i.date + 'T00:00:00');
        return d.getFullYear() === m.year && d.getMonth() === m.month;
      })
      .reduce((a, i) => a + (i.amount || 0), 0);
  });

  App._charts['incomeChart'] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: months.map(m => m.label),
      datasets: [{
        label: 'Income (₹)',
        data,
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.greenFill,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.green,
        pointBorderColor: '#fff',
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `₹${ctx.raw}` } }
      },
      scales: { y: { min: 0 } }
    }
  });
}

function addIncomeModal() {
  Modal.open('Log Income', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount (₹) *</label>
        <input type="number" class="form-input" id="inc_amount" placeholder="500" min="0" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-input" id="inc_date" value="${DateUtil.today()}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Source *</label>
      <input type="text" class="form-input" id="inc_source" placeholder="e.g. Fiverr project, Tutoring" />
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <input type="text" class="form-input" id="inc_desc" placeholder="Additional details..." />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveIncome()"><i data-lucide="save"></i> Save Income</button>
    </div>
  `);
}

function saveIncome() {
  const amount = parseFloat(document.getElementById('inc_amount')?.value);
  const source = document.getElementById('inc_source')?.value.trim();
  if (isNaN(amount) || amount <= 0) { Toast.error('Enter a valid amount'); return; }
  if (!source) { Toast.error('Source is required'); return; }

  Store.push('freelancing.income', {
    id: uid(),
    amount,
    source,
    date: document.getElementById('inc_date')?.value || DateUtil.today(),
    description: document.getElementById('inc_desc')?.value.trim() || '',
  });
  Modal.close();
  Toast.success('Income logged!');
  document.getElementById('pageContainer').innerHTML = renderFreelancing();
  setTimeout(() => drawIncomeChart(), 100);
  lucide.createIcons();
}

function addExpenseModal() {
  Modal.open('Log Expense', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount (₹) *</label>
        <input type="number" class="form-input" id="exp_amount" placeholder="200" min="0" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Date</label>
        <input type="date" class="form-input" id="exp_date" value="${DateUtil.today()}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Category *</label>
      <select class="form-select" id="exp_category">
        <option value="Tools & Software">Tools & Software</option>
        <option value="Learning">Learning/Courses</option>
        <option value="Internet">Internet/Data</option>
        <option value="Equipment">Equipment</option>
        <option value="Marketing">Marketing</option>
        <option value="Other">Other</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <input type="text" class="form-input" id="exp_desc" placeholder="What was this for?" />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveExpense()"><i data-lucide="save"></i> Save Expense</button>
    </div>
  `);
}

function saveExpense() {
  const amount = parseFloat(document.getElementById('exp_amount')?.value);
  if (isNaN(amount) || amount <= 0) { Toast.error('Enter a valid amount'); return; }

  Store.push('freelancing.expenses', {
    id: uid(),
    amount,
    category: document.getElementById('exp_category')?.value || 'Other',
    date: document.getElementById('exp_date')?.value || DateUtil.today(),
    description: document.getElementById('exp_desc')?.value.trim() || '',
  });
  Modal.close();
  Toast.success('Expense logged!');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderIncomeExpensesTab(); lucide.createIcons(); }
}

function addClientModal() {
  Modal.open('Add Client', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Client Name *</label>
        <input type="text" class="form-input" id="cl_name" placeholder="e.g. John Doe" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select class="form-select" id="cl_status">
          <option value="Prospect">Prospect</option>
          <option value="Active" selected>Active</option>
          <option value="Completed">Completed</option>
          <option value="Paused">Paused</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Project Description</label>
      <input type="text" class="form-input" id="cl_project" placeholder="e.g. Landing page design" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Amount (₹)</label>
        <input type="number" class="form-input" id="cl_amount" placeholder="2000" min="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Deadline</label>
        <input type="date" class="form-input" id="cl_deadline" />
      </div>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveClient()"><i data-lucide="save"></i> Save Client</button>
    </div>
  `);
}

function saveClient() {
  const name = document.getElementById('cl_name')?.value.trim();
  if (!name) { Toast.error('Client name required'); return; }

  Store.push('freelancing.clients', {
    id: uid(),
    name,
    status: document.getElementById('cl_status')?.value || 'Active',
    project: document.getElementById('cl_project')?.value.trim() || '',
    amount: parseFloat(document.getElementById('cl_amount')?.value) || 0,
    deadline: document.getElementById('cl_deadline')?.value || '',
    startDate: DateUtil.today(),
  });
  Modal.close();
  Toast.success('Client added!');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderClientsTab(); lucide.createIcons(); }
}

function deleteClient(id) {
  Store.remove('freelancing.clients', id);
  Toast.success('Client removed');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderClientsTab(); lucide.createIcons(); }
}

function deleteIncome(id) {
  const income = (Store.get('freelancing.income') || []).filter(i => i.id !== id);
  Store.set('freelancing.income', income);
  Toast.success('Income entry removed');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderIncomeExpensesTab(); lucide.createIcons(); }
}

function deleteExpense(id) {
  const expenses = (Store.get('freelancing.expenses') || []).filter(e => e.id !== id);
  Store.set('freelancing.expenses', expenses);
  Toast.success('Expense removed');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderIncomeExpensesTab(); lucide.createIcons(); }
}

function editSavingsGoal() {
  const fl = Store.get('freelancing') || {};
  Modal.open('Edit Savings Goal', `
    <div class="form-group">
      <label class="form-label">Savings Goal (₹)</label>
      <input type="number" class="form-input" id="sg_goal" value="${fl.savingsGoal || 5000}" min="0" />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveSavingsGoal()">Save</button>
    </div>
  `);
}

function saveSavingsGoal() {
  const goal = parseFloat(document.getElementById('sg_goal')?.value);
  if (isNaN(goal) || goal < 0) { Toast.error('Enter a valid amount'); return; }
  Store.set('freelancing.savingsGoal', goal);
  Modal.close();
  Toast.success('Goal updated!');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderFreelancingOverview(); setTimeout(() => drawIncomeChart(), 100); lucide.createIcons(); }
}

function updateSavingsModal() {
  const fl = Store.get('freelancing') || {};
  Modal.open('Update Current Savings', `
    <div class="form-group">
      <label class="form-label">Current Savings (₹)</label>
      <input type="number" class="form-input" id="cs_amount" value="${fl.currentSavings || 0}" min="0" autofocus />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCurrentSavings()">Save</button>
    </div>
  `);
}

function saveCurrentSavings() {
  const amount = parseFloat(document.getElementById('cs_amount')?.value);
  if (isNaN(amount) || amount < 0) { Toast.error('Enter a valid amount'); return; }
  Store.set('freelancing.currentSavings', amount);
  Modal.close();
  Toast.success('Savings updated!');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderFreelancingOverview(); setTimeout(() => drawIncomeChart(), 100); lucide.createIcons(); }
}

function togglePortfolioItem(key) {
  const portfolio = Store.get('freelancing.portfolio') || {};
  portfolio[key] = !portfolio[key];
  Store.set('freelancing.portfolio', portfolio);
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderPortfolioTab(); lucide.createIcons(); }
}

function savePortfolioProjects() {
  const val = parseInt(document.getElementById('portfolio_projects')?.value) || 0;
  const portfolio = Store.get('freelancing.portfolio') || {};
  portfolio.projects = val;
  Store.set('freelancing.portfolio', portfolio);
  Toast.success('Projects count updated!');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderPortfolioTab(); lucide.createIcons(); }
}

function addFreelancingSkillModal() {
  Modal.open('Add Freelancing Skill', `
    <div class="form-group">
      <label class="form-label">Skill Name *</label>
      <input type="text" class="form-input" id="fsk_name" placeholder="e.g. WordPress" autofocus />
    </div>
    <div class="form-group">
      <label class="form-label">Level (%)</label>
      <input type="number" class="form-input" id="fsk_level" value="0" min="0" max="100" />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveFreelancingSkill()">Add</button>
    </div>
  `);
}

function saveFreelancingSkill() {
  const name = document.getElementById('fsk_name')?.value.trim();
  if (!name) { Toast.error('Name required'); return; }
  const skills = Store.get('freelancing.skills') || [];
  skills.push({ name, level: parseInt(document.getElementById('fsk_level')?.value) || 0 });
  Store.set('freelancing.skills', skills);
  Modal.close();
  Toast.success('Skill added!');
  const content = document.getElementById('freelancingTabContent');
  if (content) { content.innerHTML = renderFreelancingSkillsTab(); lucide.createIcons(); }
}

function updateFreelancingSkill(idx, level) {
  const skills = Store.get('freelancing.skills') || [];
  if (skills[idx]) {
    skills[idx].level = parseInt(level);
    Store.set('freelancing.skills', skills);
    Toast.success('Skill updated!');
  }
}
