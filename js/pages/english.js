/* ===========================
   LifeOS – English & Communication Page
   =========================== */

function renderEnglish() {
  const today = DateUtil.today();
  const vocab = Store.get('vocabulary') || [];
  const todayWords = vocab.filter(v => v.date === today);
  const learnedTotal = vocab.filter(v => v.learned).length;
  const streak = calcEnglishStreak(vocab);

  return `
<div class="page" id="englishPage">
  <div class="page-header">
    <div>
      <h1 class="page-title"><i data-lucide="message-square"></i> English & Communication</h1>
      <p class="page-subtitle">Build vocabulary, fluency and communication skills</p>
    </div>
    <button class="btn btn-primary btn-sm" onclick="addVocabModal()">
      <i data-lucide="plus"></i> Add Word
    </button>
  </div>

  <!-- Stats Row -->
  <div class="grid-4" style="margin-bottom:20px">
    <div class="stat-card purple">
      <div class="stat-icon purple"><i data-lucide="book-open"></i></div>
      <div class="stat-value">${todayWords.length}</div>
      <div class="stat-label">Words Today</div>
    </div>
    <div class="stat-card green">
      <div class="stat-icon green"><i data-lucide="check-circle"></i></div>
      <div class="stat-value">${learnedTotal}</div>
      <div class="stat-label">Words Learned</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue"><i data-lucide="flame"></i></div>
      <div class="stat-value">${streak}</div>
      <div class="stat-label">Day Streak</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon orange"><i data-lucide="library"></i></div>
      <div class="stat-value">${vocab.length}</div>
      <div class="stat-label">Total Vocab</div>
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar">
    <button class="tab-btn active" onclick="switchEnglishTab('vocab',this)"><i data-lucide="book-open"></i> Vocabulary</button>
    <button class="tab-btn" onclick="switchEnglishTab('practice',this)"><i data-lucide="mic"></i> Practice</button>
    <button class="tab-btn" onclick="switchEnglishTab('progress',this)"><i data-lucide="bar-chart-3"></i> Progress</button>
  </div>

  <div id="englishTabContent" style="margin-top:16px">
    ${renderVocabCards()}
  </div>
</div>`;
}

function switchEnglishTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('englishTabContent');
  if (tab === 'vocab') content.innerHTML = renderVocabCards();
  else if (tab === 'practice') content.innerHTML = renderPracticeTab();
  else {
    content.innerHTML = renderProgressTab();
    setTimeout(() => drawVocabChart(), 100);
  }
  lucide.createIcons();
}

function renderVocabCards() {
  const today = DateUtil.today();
  const vocab = Store.get('vocabulary') || [];
  const todayWords = vocab.filter(v => v.date === today);
  const allOther = vocab.filter(v => v.date !== today).slice().reverse().slice(0, 20);

  let html = `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
    <h3 style="font-size:14px;font-weight:600;color:var(--text-secondary)">📅 Today's Words (${todayWords.length})</h3>
    <button class="btn btn-sm btn-ghost" onclick="addVocabModal()"><i data-lucide="plus"></i> Add Word</button>
  </div>`;

  if (todayWords.length === 0) {
    html += `<div class="empty-state" style="padding:32px">
      <div class="empty-state-icon">📖</div>
      <h3>No words for today</h3>
      <p>Add at least 5 new vocabulary words to improve your English</p>
      <button class="btn btn-primary" onclick="addVocabModal()"><i data-lucide="plus"></i> Add First Word</button>
    </div>`;
  } else {
    html += `<div class="grid-2" style="margin-bottom:20px">
      ${todayWords.map(v => renderVocabCard(v)).join('')}
    </div>`;
  }

  if (allOther.length > 0) {
    html += `<h3 style="font-size:14px;font-weight:600;color:var(--text-secondary);margin-bottom:12px">📚 Recent Words</h3>
    <div class="grid-2">
      ${allOther.map(v => renderVocabCard(v)).join('')}
    </div>`;
  }

  return html;
}

function renderVocabCard(v) {
  return `
  <div class="card vocab-card" style="position:relative;${v.learned ? 'border-color:rgba(16,185,129,0.3)' : ''}">
    <button class="icon-btn" style="position:absolute;top:10px;right:10px" onclick="deleteVocab('${v.id}')"><i data-lucide="x"></i></button>
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
      <div style="flex:1">
        <div style="font-size:18px;font-weight:700;color:var(--accent-purple-light)">${escapeHtml(v.word)}</div>
        ${v.pronunciation ? `<div style="font-size:12px;color:var(--text-muted);font-style:italic">${escapeHtml(v.pronunciation)}</div>` : ''}
      </div>
      <button class="btn btn-sm ${v.learned ? 'btn-primary' : 'btn-secondary'}" onclick="toggleVocabLearned('${v.id}')" style="flex-shrink:0;font-size:11px">
        ${v.learned ? '✓ Known' : 'Mark Known'}
      </button>
    </div>
    <div style="font-size:13.5px;font-weight:500;margin-bottom:6px">${escapeHtml(v.meaning)}</div>
    ${v.example ? `<div style="font-size:12.5px;color:var(--text-muted);font-style:italic;border-left:2px solid var(--border);padding-left:8px">"${escapeHtml(v.example)}"</div>` : ''}
    ${v.sentence ? `<div style="font-size:12px;color:var(--accent-blue-light);margin-top:6px">Usage: ${escapeHtml(v.sentence)}</div>` : ''}
    <div style="font-size:11px;color:var(--text-muted);margin-top:8px">${DateUtil.format(v.date)}</div>
  </div>`;
}

function renderPracticeTab() {
  const challenges = Store.get('settings.speakingChallenges') || [
    { id: 'sp1', text: 'Introduce yourself in 2 minutes', done: false },
    { id: 'sp2', text: 'Describe your biggest goal and why it matters', done: false },
    { id: 'sp3', text: 'Explain a technical concept (e.g., OOP) in simple terms', done: false },
    { id: 'sp4', text: 'Talk about your daily routine for 1 minute', done: false },
    { id: 'sp5', text: 'Give feedback on a project you worked on', done: false },
  ];

  const fluencyTips = [
    { icon: '🗣️', tip: 'Read English articles aloud daily for 10 minutes', category: 'Speaking' },
    { icon: '🎧', tip: 'Listen to English podcasts during commute (Tech, Self-help)', category: 'Listening' },
    { icon: '✍️', tip: 'Write one paragraph in English every evening', category: 'Writing' },
    { icon: '📰', tip: 'Read one English news article and note 3 new words', category: 'Reading' },
    { icon: '🎤', tip: 'Record yourself speaking and listen back once/week', category: 'Self-assessment' },
    { icon: '💬', tip: 'Practice HR questions: "Tell me about yourself", "Strengths/Weaknesses"', category: 'Interview' },
  ];

  return `
  <div class="grid-2">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="mic"></i> Speaking Challenges</h3>
        <button class="btn btn-sm btn-ghost" onclick="addSpeakingChallenge()"><i data-lucide="plus"></i></button>
      </div>
      <div id="speakingChallengesList">
        ${challenges.map(c => `
        <div class="list-item" style="padding:10px 0;border-bottom:1px solid var(--border)">
          <div class="quick-task-check ${c.done ? 'checked' : ''}" onclick="toggleSpeakingChallenge('${c.id}')"></div>
          <div style="flex:1;font-size:13.5px;${c.done ? 'text-decoration:line-through;opacity:0.6' : ''}">${escapeHtml(c.text)}</div>
          <button class="icon-btn" onclick="deleteSpeakingChallenge('${c.id}')"><i data-lucide="x"></i></button>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i data-lucide="lightbulb"></i> Fluency Tips</h3>
      </div>
      ${fluencyTips.map(t => `
      <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:20px;flex-shrink:0">${t.icon}</span>
        <div>
          <div style="font-size:13px;font-weight:500">${t.tip}</div>
          <span class="badge badge-blue" style="font-size:10px;margin-top:4px">${t.category}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <div class="card-header"><h3 class="card-title"><i data-lucide="target"></i> HR Interview English Practice</h3></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:8px">
      ${[
        { q: 'Tell me about yourself', hint: 'Name, college, skills, goal (90 seconds)' },
        { q: 'What are your strengths?', hint: 'Pick 3 relevant strengths with examples' },
        { q: 'Where do you see yourself in 5 years?', hint: 'Align with career at the company' },
        { q: 'Why should we hire you?', hint: 'Unique value + passion + skills' },
        { q: 'What is your biggest weakness?', hint: 'Real weakness + improvement plan' },
        { q: 'Tell me about a challenge you overcame', hint: 'STAR method: Situation, Task, Action, Result' },
      ].map(q => `
      <div style="background:var(--bg-glass);border-radius:10px;padding:12px;border:1px solid var(--border)">
        <div style="font-weight:600;font-size:13px;margin-bottom:4px">❓ ${q.q}</div>
        <div style="font-size:12px;color:var(--text-muted)">${q.hint}</div>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderProgressTab() {
  const vocab = Store.get('vocabulary') || [];
  const commScore = Store.get('settings.communicationScore') || 5;
  const streak = calcEnglishStreak(vocab);

  const last30 = DateUtil.getLast30Days();
  const wordCounts = last30.map(d => vocab.filter(v => v.date === d).length);

  return `
  <div class="grid-3" style="margin-bottom:20px">
    <div class="stat-card purple">
      <div class="stat-icon purple"><i data-lucide="star"></i></div>
      <div class="stat-value">${commScore}/10</div>
      <div class="stat-label">Comm. Score</div>
      <button class="btn btn-sm btn-ghost" style="margin-top:8px;font-size:11px" onclick="editCommScore()">Update</button>
    </div>
    <div class="stat-card green">
      <div class="stat-icon green"><i data-lucide="flame"></i></div>
      <div class="stat-value">${streak}</div>
      <div class="stat-label">Day Streak</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue"><i data-lucide="check-circle"></i></div>
      <div class="stat-value">${vocab.filter(v => v.learned).length}</div>
      <div class="stat-label">Words Mastered</div>
    </div>
  </div>

  <div class="card" style="margin-bottom:16px">
    <div class="card-header"><h3 class="card-title"><i data-lucide="bar-chart-3"></i> 30-Day Vocabulary Growth</h3></div>
    <div style="height:240px;position:relative"><canvas id="vocabChart"></canvas></div>
  </div>

  <div class="card">
    <div class="card-header"><h3 class="card-title"><i data-lucide="trending-up"></i> Communication Score History</h3></div>
    <div style="display:flex;align-items:center;gap:16px;padding:12px 0">
      <div style="text-align:center;flex-shrink:0">
        <div style="font-size:48px;font-weight:800;background:linear-gradient(135deg,var(--accent-purple-light),var(--accent-blue-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${commScore}</div>
        <div style="font-size:12px;color:var(--text-muted)">out of 10</div>
      </div>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">
          <span>Speaking confidence</span>
          <span>${commScore >= 8 ? '🌟 Excellent' : commScore >= 6 ? '👍 Good' : commScore >= 4 ? '📈 Improving' : '📚 Keep practicing'}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${commScore * 10}%"></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px">Target: 9/10 by end of year</div>
      </div>
    </div>
  </div>`;
}

function drawVocabChart() {
  const canvas = document.getElementById('vocabChart');
  if (!canvas) return;
  if (App._charts['vocabChart']) { App._charts['vocabChart'].destroy(); }

  const vocab = Store.get('vocabulary') || [];
  const last30 = DateUtil.getLast30Days();
  const counts = last30.map(d => vocab.filter(v => v.date === d).length);

  App._charts['vocabChart'] = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: last30.map(d => DateUtil.dayName(d)),
      datasets: [{
        label: 'Words Added',
        data: counts,
        backgroundColor: CHART_COLORS.purple,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, ticks: { stepSize: 1 } }
      }
    }
  });
}

function calcEnglishStreak(vocab) {
  if (!vocab || vocab.length === 0) return 0;
  const dates = [...new Set(vocab.map(v => v.date))].sort().reverse();
  const today = DateUtil.today();
  let streak = 0;
  let check = today;
  for (const d of dates) {
    if (d === check) {
      streak++;
      const prev = new Date(check + 'T00:00:00');
      prev.setDate(prev.getDate() - 1);
      check = prev.toISOString().split('T')[0];
    } else if (d < check) break;
  }
  return streak;
}

function addVocabModal() {
  Modal.open('Add Vocabulary Word', `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Word *</label>
        <input type="text" class="form-input" id="vw_word" placeholder="e.g. Eloquent" autofocus />
      </div>
      <div class="form-group">
        <label class="form-label">Pronunciation</label>
        <input type="text" class="form-input" id="vw_pron" placeholder="e.g. /ˈel.ə.kwənt/" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Meaning *</label>
      <input type="text" class="form-input" id="vw_meaning" placeholder="Fluent or persuasive in speaking or writing" />
    </div>
    <div class="form-group">
      <label class="form-label">Example sentence</label>
      <input type="text" class="form-input" id="vw_example" placeholder="She gave an eloquent speech." />
    </div>
    <div class="form-group">
      <label class="form-label">Your own sentence</label>
      <input type="text" class="form-input" id="vw_sentence" placeholder="Write your own sentence using the word..." />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveVocab()"><i data-lucide="save"></i> Save Word</button>
    </div>
  `);
}

function saveVocab() {
  const word = document.getElementById('vw_word')?.value.trim();
  const meaning = document.getElementById('vw_meaning')?.value.trim();
  if (!word) { Toast.error('Word is required'); return; }
  if (!meaning) { Toast.error('Meaning is required'); return; }

  const vocab = {
    id: uid(),
    word,
    pronunciation: document.getElementById('vw_pron')?.value.trim() || '',
    meaning,
    example: document.getElementById('vw_example')?.value.trim() || '',
    sentence: document.getElementById('vw_sentence')?.value.trim() || '',
    date: DateUtil.today(),
    learned: false,
  };
  Store.push('vocabulary', vocab);
  Modal.close();
  Toast.success('Word added!');
  const content = document.getElementById('englishTabContent');
  if (content) { content.innerHTML = renderVocabCards(); lucide.createIcons(); }
}

function toggleVocabLearned(id) {
  const vocab = Store.get('vocabulary') || [];
  const item = vocab.find(v => v.id === id);
  if (item) {
    item.learned = !item.learned;
    Store.set('vocabulary', vocab);
    Toast.success(item.learned ? 'Marked as learned!' : 'Marked as learning');
    const content = document.getElementById('englishTabContent');
    if (content) { content.innerHTML = renderVocabCards(); lucide.createIcons(); }
  }
}

function deleteVocab(id) {
  Store.remove('vocabulary', id);
  Toast.success('Word removed');
  const content = document.getElementById('englishTabContent');
  if (content) { content.innerHTML = renderVocabCards(); lucide.createIcons(); }
}

function editCommScore() {
  const current = Store.get('settings.communicationScore') || 5;
  Modal.open('Update Communication Score', `
    <div class="form-group">
      <label class="form-label">Communication Score (1–10)</label>
      <input type="range" id="comm_score" min="1" max="10" value="${current}" style="width:100%;accent-color:var(--accent-purple)" oninput="document.getElementById('comm_score_val').textContent=this.value" />
      <div style="text-align:center;font-size:32px;font-weight:800;margin:8px 0" id="comm_score_val">${current}</div>
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveCommScore()"><i data-lucide="save"></i> Save</button>
    </div>
  `);
}

function saveCommScore() {
  const val = parseInt(document.getElementById('comm_score')?.value);
  Store.set('settings.communicationScore', val);
  Modal.close();
  Toast.success('Score updated!');
  const content = document.getElementById('englishTabContent');
  if (content) { content.innerHTML = renderProgressTab(); setTimeout(() => drawVocabChart(), 100); lucide.createIcons(); }
}

function addSpeakingChallenge() {
  Modal.open('Add Speaking Challenge', `
    <div class="form-group">
      <label class="form-label">Challenge *</label>
      <input type="text" class="form-input" id="sc_text" placeholder="e.g. Speak for 2 minutes on a tech topic" autofocus />
    </div>
    <div class="form-footer">
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="saveSpeakingChallenge()">Add</button>
    </div>
  `);
}

function saveSpeakingChallenge() {
  const text = document.getElementById('sc_text')?.value.trim();
  if (!text) { Toast.error('Challenge text required'); return; }
  const challenges = Store.get('settings.speakingChallenges') || [];
  challenges.push({ id: uid(), text, done: false });
  Store.set('settings.speakingChallenges', challenges);
  Modal.close();
  Toast.success('Challenge added!');
  const content = document.getElementById('englishTabContent');
  if (content) { content.innerHTML = renderPracticeTab(); lucide.createIcons(); }
}

function toggleSpeakingChallenge(id) {
  const challenges = Store.get('settings.speakingChallenges') || [];
  const c = challenges.find(x => x.id === id);
  if (c) { c.done = !c.done; Store.set('settings.speakingChallenges', challenges); }
  const content = document.getElementById('englishTabContent');
  if (content) { content.innerHTML = renderPracticeTab(); lucide.createIcons(); }
}

function deleteSpeakingChallenge(id) {
  const challenges = (Store.get('settings.speakingChallenges') || []).filter(x => x.id !== id);
  Store.set('settings.speakingChallenges', challenges);
  const content = document.getElementById('englishTabContent');
  if (content) { content.innerHTML = renderPracticeTab(); lucide.createIcons(); }
}
