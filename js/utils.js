/* ===========================
   LifeOS – Utilities
   =========================== */

// ── ID Generator ─────────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Date Utilities ────────────────────────────────────────────────────────────
const DateUtil = {
  today() { return new Date().toISOString().split('T')[0]; },

  format(dateStr, opts = {}) {
    if (!dateStr) return '';
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', ...opts
    });
  },

  daysDiff(from, to) {
    const a = new Date(from), b = new Date(to);
    return Math.round((b - a) / 86400000);
  },

  getWeekDates(offset = 0) {
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((day === 0 ? 7 : day) - 1) + offset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  },

  getMonthDates(year, month) {
    const dates = [];
    const d = new Date(year, month, 1);
    while (d.getMonth() === month) {
      dates.push(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }
    return dates;
  },

  greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  },

  dayName(dateStr) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[new Date(dateStr + 'T00:00:00').getDay()];
  },

  monthName(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleString('en-IN', { month: 'long' });
  },

  isToday(dateStr) { return dateStr === this.today(); },

  currentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  },

  currentTimeHHMM() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  },

  getLast7Days() {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
  },

  getLast30Days() {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });
  },
};

// ── Habit Utilities ───────────────────────────────────────────────────────────
const HabitUtil = {
  isCompleted(habit, date = DateUtil.today()) {
    return (habit.completedDates || []).includes(date);
  },

  toggle(habitId, date = DateUtil.today()) {
    const habits = Store.get('habits');
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const dates = habit.completedDates || [];
    const idx = dates.indexOf(date);
    if (idx === -1) {
      dates.push(date);
    } else {
      dates.splice(idx, 1);
    }

    habit.completedDates = dates;
    habit.streak = this.calcStreak(dates);
    Store.set('habits', habits);
    Store.save();
  },

  calcStreak(dates) {
    if (!dates || dates.length === 0) return 0;
    const sorted = [...dates].sort().reverse();
    let streak = 0;
    const today = DateUtil.today();
    let check = today;

    for (const d of sorted) {
      if (d === check) {
        streak++;
        const prev = new Date(check + 'T00:00:00');
        prev.setDate(prev.getDate() - 1);
        check = prev.toISOString().split('T')[0];
      } else if (d < check) {
        break;
      }
    }
    return streak;
  },

  todayCompletion() {
    const habits = Store.get('habits');
    const today = DateUtil.today();
    const done = habits.filter(h => (h.completedDates || []).includes(today)).length;
    return { done, total: habits.length, pct: habits.length ? Math.round(done / habits.length * 100) : 0 };
  },
};

// ── Task Utilities ────────────────────────────────────────────────────────────
const TaskUtil = {
  todayTasks() {
    const today = DateUtil.today();
    return Store.get('tasks').filter(t => t.date === today || (!t.date && t.type === 'daily'));
  },

  overdueTasks() {
    const today = DateUtil.today();
    return Store.get('tasks').filter(t => t.date && t.date < today && !t.done);
  },

  addTask(task) {
    const newTask = {
      id: uid(),
      title: '',
      desc: '',
      date: DateUtil.today(),
      priority: 'medium',
      category: 'general',
      done: false,
      createdAt: new Date().toISOString(),
      ...task,
    };
    Store.push('tasks', newTask);
    return newTask;
  },

  toggleDone(taskId) {
    const tasks = Store.get('tasks');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      task.completedAt = task.done ? new Date().toISOString() : null;
      Store.set('tasks', tasks);
      Store.save();
    }
    return task;
  },

  delete(taskId) {
    Store.remove('tasks', taskId);
  },
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = {
  show(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✓', error: '✗', info: 'ℹ', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg)   { this.show(msg, 'error'); },
  info(msg)    { this.show(msg, 'info'); },
  warning(msg) { this.show(msg, 'warning'); },
};

// ── Modal ─────────────────────────────────────────────────────────────────────
const Modal = {
  open(title, bodyHtml, opts = {}) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    const backdrop = document.getElementById('modalBackdrop');
    backdrop.classList.add('open');
    lucide.createIcons();
    if (opts.onOpen) opts.onOpen(document.getElementById('modalBody'));
  },

  close() {
    document.getElementById('modalBackdrop').classList.remove('open');
  },
};

// ── DOM Helpers ───────────────────────────────────────────────────────────────
function $(selector, parent = document) { return parent.querySelector(selector); }
function $$(selector, parent = document) { return [...parent.querySelectorAll(selector)]; }

function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') element.className = v;
    else if (k === 'html') element.innerHTML = v;
    else if (k.startsWith('on')) element.addEventListener(k.slice(2), v);
    else element.setAttribute(k, v);
  }
  children.forEach(c => {
    if (typeof c === 'string') element.appendChild(document.createTextNode(c));
    else if (c) element.appendChild(c);
  });
  return element;
}

// ── Chart Defaults ────────────────────────────────────────────────────────────
function getChartDefaults() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    color: isDark ? '#8888a8' : '#5a5a7a',
    gridColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
    tickColor: isDark ? '#555570' : '#9999b8',
  };
}

function applyChartDefaults() {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  const d = getChartDefaults();
  Chart.defaults.color = d.color;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
  Chart.defaults.scale.grid.color = d.gridColor;
  Chart.defaults.scale.ticks.color = d.tickColor;
}

// ── Export Utilities ──────────────────────────────────────────────────────────
function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Color Palette for Charts ──────────────────────────────────────────────────
const CHART_COLORS = {
  purple: 'rgba(124, 58, 237, 0.8)',
  blue:   'rgba(59, 130, 246, 0.8)',
  cyan:   'rgba(6, 182, 212, 0.8)',
  green:  'rgba(16, 185, 129, 0.8)',
  orange: 'rgba(245, 158, 11, 0.8)',
  pink:   'rgba(236, 72, 153, 0.8)',
  red:    'rgba(239, 68, 68, 0.8)',

  purpleFill: 'rgba(124, 58, 237, 0.1)',
  blueFill:   'rgba(59, 130, 246, 0.1)',
  cyanFill:   'rgba(6, 182, 212, 0.1)',
  greenFill:  'rgba(16, 185, 129, 0.1)',
};

// ── Number Formatting ─────────────────────────────────────────────────────────
function formatINR(num) {
  if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
  if (num >= 1000)   return '₹' + (num / 1000).toFixed(1) + 'K';
  return '₹' + num;
}

function formatPct(num) { return Math.round(num) + '%'; }

// ── Priority Color ────────────────────────────────────────────────────────────
function priorityColor(p) {
  return { high: 'red', medium: 'orange', low: 'green' }[p] || 'gray';
}

function priorityLabel(p) {
  return { high: 'High', medium: 'Medium', low: 'Low' }[p] || p;
}

// ── Skill status ──────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    current:  { label: 'In Progress', cls: 'badge-blue' },
    done:     { label: 'Completed',   cls: 'badge-green' },
    upcoming: { label: 'Upcoming',    cls: 'badge-orange' },
    planned:  { label: 'Planned',     cls: 'badge-gray' },
  };
  const s = map[status] || map['planned'];
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

// ── Random Quote ──────────────────────────────────────────────────────────────
function getDailyQuote() {
  const today = DateUtil.today();
  const motivation = Store.get('motivation');
  if (motivation.lastGenerated === today && motivation.daily) {
    return motivation.daily;
  }
  const quotes = motivation.quotes;
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  Store.set('motivation.daily', q);
  Store.set('motivation.lastGenerated', today);
  return q;
}

// ── Sanitize HTML ─────────────────────────────────────────────────────────────
function escapeHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
