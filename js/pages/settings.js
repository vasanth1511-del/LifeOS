/* ===========================
   LifeOS – Settings Page
   =========================== */

function renderSettings() {
  const user = Store.get('user') || {};
  const settings = Store.get('settings') || {};
  const apiKey = settings.geminiApiKey || '';

  return `
  <div class="page" id="settingsPage">
    <div class="page-header">
      <div class="page-title-group">
        <h1 class="page-title">⚙️ Settings & System Configuration</h1>
        <p class="page-subtitle">Personal profile, cloud AI keys, theme preferences, and data backup controls</p>
      </div>
    </div>

    <!-- Account & Cross-Device Cloud Sync Card -->
    <div class="card settings-section" style="background:linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.06)); border-color:rgba(124,58,237,0.25);">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="cloud"></i> Multi-User Account & Mobile ↔ Laptop Sync</h3>
        <span class="badge ${AuthManager?.supabaseClient ? 'badge-green' : 'badge-blue'}">
          ${AuthManager?.supabaseClient ? '☁️ Cloud Database Active' : '💻 Device Local Mode'}
        </span>
      </div>
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:14px; line-height:1.6;">
        Signed in as: <strong>${escapeHtml(AuthManager?.currentUser?.name || user.name || 'Vasanth M')}</strong> (${escapeHtml(AuthManager?.currentUser?.email || (AuthManager?.currentUser?.username ? '@' + AuthManager?.currentUser?.username : 'Local'))}).
        You and your friends can each create personal accounts. Any new account starts with a <strong>clean, empty dashboard</strong>. Connect Supabase to automatically continue your exact progress on mobile or any other device.
      </p>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" onclick="AuthManager.signOut()">
          <i data-lucide="lock"></i> Lock & Switch Account
        </button>
        ${AuthManager?.supabaseClient ? `
          <button class="btn btn-secondary btn-sm" onclick="AuthManager.syncToCloud(true)">
            <i data-lucide="refresh-cw"></i> Sync to Cloud Now
          </button>
        ` : ''}
      </div>
    </div>

    <!-- Section 1: Personal Profile -->
    <div class="card settings-section">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="user"></i> Academic & Career Identity</h3>
        <button class="btn btn-sm btn-primary" onclick="saveProfile()"><i data-lucide="save"></i> Save Profile</button>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="settingName" value="${escapeHtml(user.name || 'Vasanth M')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Current CGPA</label>
          <input type="number" step="0.01" min="0" max="10" class="form-input" id="settingCgpa" value="${user.cgpa || 9.1}" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Degree & Department</label>
          <input type="text" class="form-input" id="settingDegree" value="${escapeHtml(user.degree || 'B.Tech CSE (AI & ML)')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Current Academic Year</label>
          <select class="form-select" id="settingYear">
            <option value="1" ${user.year === 1 ? 'selected' : ''}>1st Year</option>
            <option value="2" ${user.year === 2 ? 'selected' : ''}>2nd Year</option>
            <option value="3" ${user.year === 3 ? 'selected' : ''}>3rd Year</option>
            <option value="4" ${user.year === 4 ? 'selected' : ''}>4th Year</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">University / Institution</label>
          <input type="text" class="form-input" id="settingUniversity" value="${escapeHtml(user.university || 'Vel Tech University')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Graduation Year</label>
          <input type="number" class="form-input" id="settingGraduation" value="${user.graduation || 2029}" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Target Placement Package</label>
          <input type="text" class="form-input" id="settingTargetPackage" value="${escapeHtml(user.targetPackage || '20+ LPA')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Primary Career Ambition</label>
          <input type="text" class="form-input" id="settingGoal" value="${escapeHtml(user.goal || 'Highly skilled Software Engineer')}" />
        </div>
      </div>
    </div>

    <!-- Section 2: Gemini Cloud AI Configuration -->
    <div class="card settings-section">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="bot"></i> Google Gemini AI Integration (Global for All Users)</h3>
        <span class="badge badge-green">⚡ Active for Everyone</span>
      </div>

      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">
        LifeOS has <strong>Google Gemini 3.8 Flash</strong> built in globally so that you and all your friends have instant, zero-setup access to AI coaching, study planning, and accountability checks. You can also specify an optional custom key below.
      </p>

      <div class="form-group">
        <label class="form-label">Custom Gemini API Key (Optional Override)</label>
        <div style="display:flex; gap:8px;">
          <input type="password" class="form-input" id="settingGeminiKey" value="${escapeHtml(apiKey)}" placeholder="Using platform default Gemini key" style="flex:1;" />
          <button class="btn btn-secondary" onclick="toggleApiKeyVisibility()" title="Toggle Show/Hide" style="padding:0 12px;">
            <i data-lucide="eye" id="keyEyeIcon"></i>
          </button>
          <button class="btn btn-primary" onclick="saveApiKey()">Save</button>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:var(--accent-purple-light); text-decoration:underline;">
            Google AI Studio API Dashboard →
          </a>
          <button class="btn btn-sm btn-ghost" onclick="testGeminiKey()" style="font-size:12px;">
            <i data-lucide="check-circle"></i> Test Connection
          </button>
        </div>
      </div>
    </div>

    <!-- Section 3: App Preferences -->
    <div class="card settings-section">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="sliders"></i> App Preferences & Themes</h3>
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-row-label">Interface Theme</div>
          <div class="settings-row-desc">Switch between deep dark mode and clean daylight interface</div>
        </div>
        <div>
          <button class="btn btn-secondary btn-sm" onclick="App.toggleTheme()">
            <i data-lucide="${settings.theme === 'light' ? 'moon' : 'sun'}"></i>
            <span>${settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-row-label">Daily Night Review Reminder</div>
          <div class="settings-row-desc">Reminder prompt for your 8:30 PM Java session and 9:30 PM review</div>
        </div>
        <div>
          <input type="time" class="form-input" id="settingReminderTime" value="${settings.dailyReminder || '21:00'}" onchange="Store.set('settings.dailyReminder', this.value); Toast.success('Reminder time saved');" style="width:auto;" />
        </div>
      </div>

      <div class="settings-row">
        <div>
          <div class="settings-row-label">Motivational Philosophy Banner</div>
          <div class="settings-row-desc">Display daily high-performance software engineering quotes</div>
        </div>
        <div>
          <label class="toggle">
            <input type="checkbox" ${settings.motivationalQuotes !== false ? 'checked' : ''} onchange="Store.set('settings.motivationalQuotes', this.checked); Toast.success('Preference updated');" />
            <span class="toggle-switch"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Section 4: Data Management & Backup -->
    <div class="card settings-section">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="database"></i> Data Management & Privacy</h3>
      </div>
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:16px;">
        All your habits, subjects, projects, goals, and notes are securely stored offline in your browser's local storage. Backup your data regularly or restore it on another laptop.
      </p>

      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <button class="btn btn-secondary" onclick="exportDataFile()">
          <i data-lucide="download"></i> Export Data Backup (JSON)
        </button>

        <label class="btn btn-secondary" style="cursor:pointer;">
          <i data-lucide="upload"></i> Restore from Backup
          <input type="file" id="importFileInput" accept=".json" style="display:none;" onchange="importDataFile(event)" />
        </label>

        <button class="btn btn-danger" onclick="resetAllData()" style="margin-left:auto;">
          <i data-lucide="alert-triangle"></i> Reset to Default
        </button>
      </div>
    </div>
  </div>`;
}

function saveProfile() {
  const name = document.getElementById('settingName')?.value.trim() || 'Vasanth M';
  const cgpa = parseFloat(document.getElementById('settingCgpa')?.value || '9.1');
  const degree = document.getElementById('settingDegree')?.value.trim() || 'B.Tech CSE (AI & ML)';
  const year = parseInt(document.getElementById('settingYear')?.value || '2', 10);
  const university = document.getElementById('settingUniversity')?.value.trim() || 'Vel Tech University';
  const graduation = parseInt(document.getElementById('settingGraduation')?.value || '2029', 10);
  const targetPackage = document.getElementById('settingTargetPackage')?.value.trim() || '20+ LPA';
  const goal = document.getElementById('settingGoal')?.value.trim() || 'Highly skilled Software Engineer';

  Store.set('user', {
    ...Store.get('user'),
    name,
    cgpa,
    degree,
    year,
    university,
    graduation,
    targetPackage,
    goal
  });

  // Update user avatar initials in sidebar
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarEl = document.querySelector('.user-avatar');
  if (avatarEl) avatarEl.textContent = initials;
  const nameEl = document.querySelector('.user-name');
  if (nameEl) nameEl.textContent = name;

  Toast.success('Profile updated successfully!');
}

function saveApiKey() {
  const keyInput = document.getElementById('settingGeminiKey');
  const key = keyInput?.value.trim() || '';
  Store.set('settings.geminiApiKey', key);
  Toast.success(key ? 'Gemini API key saved securely!' : 'API key removed. Running in local mode.');
  App.navigate('settings');
}

function toggleApiKeyVisibility() {
  const input = document.getElementById('settingGeminiKey');
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  const icon = document.getElementById('keyEyeIcon');
  if (icon) {
    icon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
    lucide.createIcons();
  }
}

async function testGeminiKey() {
  const key = Store.get('settings.geminiApiKey');
  if (!key) {
    Toast.error('Please save an API key first.');
    return;
  }

  Toast.info('Testing connection with Google Gemini...');
  const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with the word "READY"' }] }]
        })
      });

      if (res.ok) {
        Toast.success(`✓ Connected to Google Gemini (${model}) successfully!`);
        return;
      }
    } catch (err) {
      // continue to next model
    }
  }

  Toast.error('Connection failed: Please verify your Gemini API key in Google AI Studio.');
}

function exportDataFile() {
  const data = Store.exportData();
  const dateStr = DateUtil.today();
  downloadText(data, `LifeOS-Vasanth-Backup-${dateStr}.json`);
  Toast.success('Backup exported!');
}

function importDataFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const content = evt.target?.result;
    if (content) {
      const success = Store.importData(content);
      if (success) {
        Toast.success('Data restored successfully! Refreshing...');
        setTimeout(() => location.reload(), 800);
      } else {
        Toast.error('Invalid backup JSON format.');
      }
    }
  };
  reader.readAsText(file);
}

function resetAllData() {
  if (confirm('⚠️ WARNING: This will reset all your stored progress, custom tasks, and routines back to initial defaults. Are you sure?')) {
    Store.reset();
    Toast.info('LifeOS reset to initial state.');
    setTimeout(() => location.reload(), 800);
  }
}
