/* ===========================
   LifeOS – Daily Routine Page
   =========================== */

function renderRoutine() {
  const routine = (Store.get('routine') || []).slice().sort((a, b) => a.time.localeCompare(b.time));
  const now = DateUtil.currentTimeHHMM();
  const dayOfWeek = new Date().getDay() || 7;
  const dayNames = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentBlock = routine.find(r => (!r.days || r.days.includes(dayOfWeek)) && r.time <= now && now < (r.endTime || '23:59'));

  return `
<div class="page" id="routinePage">
  <div class="page-header">
    <div>
      <h1 class="page-title"><i data-lucide="clock"></i> Daily Routine</h1>
      <p class="page-subtitle">Manage your daily time blocks and schedule</p>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-secondary btn-sm" onclick="toggleRoutineView()">
        <i data-lucide="calendar"></i> Weekly View
      </button>
      <button class="btn btn-primary btn-sm" onclick="addRoutineModal()">
        <i data-lucide="plus"></i> Add Block
      </button>
    </div>
  </div>

  ${currentBlock ? `
  <div style="background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(59,130,246,0.15));border-radius:12px;padding:16px;margin-bottom:20px;border:1px solid rgba(124,58,237,0.4);display:flex;align-items:center;gap:12px">
    <div style="width:12px;height:12px;border-radius:50%;background:${currentBlock.color};animation:pulse 1.5s infinite;flex-shrink:0"></div>
    <div>
      <div style="font-weight:600;font-size:14px">🕐 Current Block: ${escapeHtml(currentBlock.label)}</div>
      <div style="font-size:12.5px;color:var(--text-muted)">${currentBlock.time} – ${currentBlock.endTime}</div>
    </div>
    <span class="badge badge-purple" style="margin-left:auto">NOW</span>
  </div>` : ''}

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn active" id="routineTab_daily" onclick="showRoutineTab('daily',this)"><i data-lucide="sun"></i> Today's Schedule</button>
    <button class="tab-btn" id="routineTab_weekly" onclick="showRoutineTab('weekly',this)"><i data-lucide="calendar-days"></i> Weekly View</button>
    <button class="tab-btn" id="routineTab_all" onclick="showRoutineTab('all',this)"><i data-lucide="list"></i> All Blocks</button>
  </div>

  <div id="routineTabContent" style="margin-top:16px">
    ${renderDailyScheduleView(routine, now, dayOfWeek)}
  </div>
</div>`;
}

function showRoutineTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const routine = (Store.get('routine') || []).slice().sort((a, b) => a.time.localeCompare(b.time));
  const now = DateUtil.currentTimeHHMM();
  const dayOfWeek = new Date().getDay() || 7;
  const content = document.getElementById('routineTabContent');
  if (tab === 'daily') content.innerHTML = renderDailyScheduleView(routine, now, dayOfWeek);
  else if (tab === 'weekly') content.innerHTML = renderWeeklyView(routine);
  else content.innerHTML = renderAllBlocksView(routine);
  lucide.createIcons();
}

function toggleRoutineView() {
  const weeklyBtn = document.getElementById('routineTab_weekly');
  if (weeklyBtn) weeklyBtn.click();
}

function renderDailyScheduleView(routine, now, dayOfWeek) {
  const todayRoutine = routine.filter(r => !r.days || r.days.includes(dayOfWeek));
  const currentBlock = todayRoutine.find(r => r.time <= now && now < (r.endTime || '23:59'));

  if (todayRoutine.length === 0) {
    return `<div class="empty-state"><div class="empty-state-icon">📅</div><h3>No blocks for today</h3><p>Add routine blocks to structure your day</p><button class="btn btn-primary" onclick="addRoutineModal()"><i data-lucide="plus"></i> Add Block</button></div>`;
  }

  return `
  <div class="card">
    <div style="position:relative">
      ${todayRoutine.map(r => {
        const isCurrent = r === currentBlock;
        const duration = calcDuration(r.time, r.endTime);
        return `
        <div class="schedule-block ${isCurrent ? 'current' : ''}" style="display:flex;gap:0;margin-bottom:4px;border-radius:10px;overflow:hidden;${isCurrent ? 'box-shadow:0 0 0 2px rgba(124,58,237,0.5)' : ''}">
          <div style="width:4px;background:${r.color};flex-shrink:0"></div>
          <div style="flex:1;padding:12px 14px;background:${isCurrent ? 'rgba(124,58,237,0.08)' : 'var(--bg-glass)'}">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-weight:700;font-size:13px;color:var(--text-muted);min-width:90px">${r.time} – ${r.endTime}</span>
                <span style="font-weight:600;font-size:14px">${escapeHtml(r.label)}</span>
                ${isCurrent ? `<span class="badge badge-purple" style="animation:pulse 2s infinite">● LIVE</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:12px;color:var(--text-muted)">${duration}</span>
                <div style="display:flex;gap:4px">
                  ${[1,2,3,4,5,6,7].map(d => `<span style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;background:${(r.days||[1,2,3,4,5,6,7]).includes(d) ? r.color : 'var(--bg-glass)'};color:${(r.days||[1,2,3,4,5,6,7]).includes(d) ? '#fff' : 'var(--text-muted)'}">${['M','T','W','T','F','S','S'][d-1]}</span>`).join('')}
                </div>
                <button class="icon-btn" onclick="editRoutineModal('${r.id}')"><i data-lucide="edit-3"></i></button>
                <button class="icon-btn" onclick="deleteRoutineBlock('${r.id}')"><i data-lucide="trash-2"></i></button>
              </div>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function renderWeeklyView(routine) {
  const days = [
    { num: 1, name: 'Monday' },
    { num: 2, name: 'Tuesday' },
    { num: 3, name: 'Wednesday' },
    { num: 4, name: 'Thursday' },
    { num: 5, name: 'Friday' },
    { num: 6, name: 'Saturday' },
    { num: 7, name: 'Sunday' },
  ];
  const todayDow = new Date().getDay() || 7;

  return `
  <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;min-width:700px">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 12px;font-size:12px;color:var(--text-muted);font-weight:500;border-bottom:1px solid var(--border)">Time</th>
          ${days.map(d => `<th style="text-align:center;padding:8px;font-size:12px;font-weight:600;color:${d.num === todayDow ? 'var(--accent-purple-light)' : 'var(--text-secondary)'};border-bottom:1px solid var(--border)">${d.name.slice(0,3)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${routine.map(r => `
        <tr>
          <td style="padding:8px 12px;font-size:12px;color:var(--text-muted);white-space:nowrap;border-bottom:1px solid var(--border)">${r.time}–${r.endTime}</td>
          ${days.map(d => {
            const applies = (r.days || [1,2,3,4,5,6,7]).includes(d.num);
            return `<td style="padding:4px;border-bottom:1px solid var(--border);text-align:center">
              ${applies ? `<div style="background:${r.color}22;border-left:3px solid ${r.color};border-radius:4px;padding:4px 6px;font-size:11px;font-weight:500;color:${r.color}">${escapeHtml(r.label)}</div>` : ''}
            </td>`;
          }).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderAllBlocksView(routine) {
  if (routine.length === 0) {
    return `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No routine blocks</h3><button class="btn btn-primary" onclick="addRoutineModal()"><i data-lucide="plus"></i> Add Block</button></div>`;
  }
  return `
  <div class="card">
    ${routine.map(r => `
    <div class="list-item" style="padding:12px 0;border-bottom:1px solid var(--border)">
      <div style="width:14px;height:14px;border-radius:50%;background:${r.color};flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:500;font-size:14px">${escapeHtml(r.label)}</div>
        <div style="font-size:12px;color:var(--text-muted)">${r.time} – ${r.endTime} • ${calcDuration(r.time, r.endTime)}</div>
        <div style="display:flex;gap:3px;margin-top:4px">
          ${[1,2,3,4,5,6,7].map(d => `<span style="width:20px;height:20px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;background:${(r.days||[1,2,3,4,5,6,7]).includes(d) ? r.color : 'var(--bg-glass)'};color:${(r.days||[1,2,3,4,5,6,7]).includes(d) ? '#fff' : 'var(--text-muted)'}">${['M','T','W','T','F','S','S'][d-1]}</span>`).join('')}
        </div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="icon-btn" onclick="editRoutineModal('${r.id}')"><i data-lucide="edit-3"></i></button>
        <button class="icon-btn" onclick="deleteRoutineBlock('${r.id}')"><i data-lucide="trash-2"></i></button>
      </div>
    </div>`).join('')}
  </div>`;
}

function calcDuration(start, end) {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
}

function addRoutineModal() {
  Modal.open('Add Routine Block', `
    <div class="form-group">
      <label class="form-label">Label *</label>
      <input type="text" class="form-input" id="rb_label" placeholder="e.g. Morning Exercise" autofocus />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Start Time *</label>
        <input type="time" class="form-input" id="rb_time" value="06:00" />
      </div>
      <div class="form-group">
        <label class="form-label">End Time *</label>
        <input type="time" class="form-input" id="rb_endTime" value="07:00" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Color</label>
      <input type="color" class="form-input" id="rb_color" value="#7c3aed" style="height:44px;cursor:pointer" />
    </div>
    <div class="form-group">
      <label class="form-label">Applies on Days</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        ${[1,2,3,4,5,6,7].map((d, i) => `
        <label style="cursor:pointer">
          <input type="checkbox" id="rb_day_${d}" value="${d}" checked style="display:none" />
          <span class="rb-day-btn day-${d}" style="display:inline-flex;width:36px;height:36px;border-radius:8px;align-items:center;justify-content:center;font-size:12px;font-weight:600;background:var(--accent-purple);color:#fff;cursor:pointer"
            onclick="toggleDayBtn(${d})">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
        </label>`).join('')}
      </div>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveRoutineBlock()"><i data-lucide="save"></i> Save Block</button>
    </div>
  `);
}

function toggleDayBtn(d) {
  const cb = document.getElementById(`rb_day_${d}`);
  const btn = document.querySelector(`.day-${d}`);
  if (cb && btn) {
    cb.checked = !cb.checked;
    btn.style.background = cb.checked ? 'var(--accent-purple)' : 'var(--bg-glass)';
    btn.style.color = cb.checked ? '#fff' : 'var(--text-muted)';
  }
}

function saveRoutineBlock() {
  const label = document.getElementById('rb_label')?.value.trim();
  const time = document.getElementById('rb_time')?.value;
  const endTime = document.getElementById('rb_endTime')?.value;
  if (!label) { Toast.error('Label is required'); return; }
  if (!time || !endTime) { Toast.error('Start and end time are required'); return; }

  const days = [1,2,3,4,5,6,7].filter(d => document.getElementById(`rb_day_${d}`)?.checked);

  const block = {
    id: uid(),
    time,
    endTime,
    label,
    color: document.getElementById('rb_color')?.value || '#7c3aed',
    days: days.length > 0 ? days : [1,2,3,4,5,6,7],
  };
  Store.push('routine', block);
  Modal.close();
  Toast.success('Routine block added!');
  document.getElementById('pageContainer').innerHTML = renderRoutine();
  lucide.createIcons();
}

function editRoutineModal(id) {
  const routine = Store.get('routine') || [];
  const block = routine.find(r => r.id === id);
  if (!block) return;

  Modal.open('Edit Routine Block', `
    <div class="form-group">
      <label class="form-label">Label *</label>
      <input type="text" class="form-input" id="rb_label" value="${escapeHtml(block.label)}" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Start Time</label>
        <input type="time" class="form-input" id="rb_time" value="${block.time}" />
      </div>
      <div class="form-group">
        <label class="form-label">End Time</label>
        <input type="time" class="form-input" id="rb_endTime" value="${block.endTime}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Color</label>
      <input type="color" class="form-input" id="rb_color" value="${block.color}" style="height:44px;cursor:pointer" />
    </div>
    <div class="form-group">
      <label class="form-label">Applies on Days</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        ${[1,2,3,4,5,6,7].map((d, i) => {
          const checked = (block.days || [1,2,3,4,5,6,7]).includes(d);
          return `
          <label style="cursor:pointer">
            <input type="checkbox" id="rb_day_${d}" value="${d}" ${checked ? 'checked' : ''} style="display:none" />
            <span class="rb-day-btn day-${d}" style="display:inline-flex;width:36px;height:36px;border-radius:8px;align-items:center;justify-content:center;font-size:12px;font-weight:600;background:${checked ? 'var(--accent-purple)' : 'var(--bg-glass)'};color:${checked ? '#fff' : 'var(--text-muted)'};cursor:pointer"
              onclick="toggleDayBtn(${d})">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
          </label>`;
        }).join('')}
      </div>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="updateRoutineBlock('${id}')"><i data-lucide="save"></i> Update</button>
    </div>
  `);
}

function updateRoutineBlock(id) {
  const label = document.getElementById('rb_label')?.value.trim();
  if (!label) { Toast.error('Label is required'); return; }
  const days = [1,2,3,4,5,6,7].filter(d => document.getElementById(`rb_day_${d}`)?.checked);
  Store.update('routine', id, {
    label,
    time: document.getElementById('rb_time')?.value || '06:00',
    endTime: document.getElementById('rb_endTime')?.value || '07:00',
    color: document.getElementById('rb_color')?.value || '#7c3aed',
    days: days.length > 0 ? days : [1,2,3,4,5,6,7],
  });
  Modal.close();
  Toast.success('Block updated!');
  document.getElementById('pageContainer').innerHTML = renderRoutine();
  lucide.createIcons();
}

function deleteRoutineBlock(id) {
  Store.remove('routine', id);
  Toast.success('Block removed');
  document.getElementById('pageContainer').innerHTML = renderRoutine();
  lucide.createIcons();
}
