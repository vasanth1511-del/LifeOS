/* ===========================
   LifeOS – Data Store (localStorage)
   =========================== */

const STORAGE_KEY = 'lifeos_data_v2';

const DEFAULT_DATA = {
  user: {
    name: 'Vasanth M',
    degree: 'B.Tech CSE (AI & ML)',
    university: 'Vel Tech University',
    year: 2,
    graduation: 2029,
    cgpa: 9.1,
    targetPackage: '20+ LPA',
    goal: 'Highly skilled Software Engineer',
    avatar: 'VM',
  },

  tasks: [],
  habits: [
    { id: 'h1', name: 'Morning Routine', icon: '🌅', category: 'personal', target: 'daily', streak: 0, completedDates: [], color: 'orange' },
    { id: 'h2', name: 'Java Practice (1hr)', icon: '☕', category: 'skills', target: 'daily', streak: 0, completedDates: [], color: 'blue' },
    { id: 'h3', name: 'DSA Problem (1/day)', icon: '🧩', category: 'skills', target: 'daily', streak: 0, completedDates: [], color: 'purple' },
    { id: 'h4', name: 'English Practice', icon: '📖', category: 'english', target: 'daily', streak: 0, completedDates: [], color: 'cyan' },
    { id: 'h5', name: 'Exercise / Walk', icon: '🏃', category: 'personal', target: 'daily', streak: 0, completedDates: [], color: 'green' },
    { id: 'h6', name: 'Read 20 min', icon: '📚', category: 'personal', target: 'daily', streak: 0, completedDates: [], color: 'pink' },
    { id: 'h7', name: 'Night Review', icon: '🌙', category: 'personal', target: 'daily', streak: 0, completedDates: [], color: 'purple' },
    { id: 'h8', name: 'No Social Media > 2hr', icon: '📵', category: 'personal', target: 'daily', streak: 0, completedDates: [], color: 'red' },
  ],

  subjects: [
    { id: 's1', name: 'Data Structures', code: 'CS301', credits: 4, attendance: 88, marks: 92, grade: 'O', semester: 3 },
    { id: 's2', name: 'Object Oriented Programming', code: 'CS302', credits: 4, attendance: 90, marks: 89, grade: 'A+', semester: 3 },
    { id: 's3', name: 'Database Management Systems', code: 'CS303', credits: 3, attendance: 85, marks: 86, grade: 'A+', semester: 3 },
    { id: 's4', name: 'Computer Networks', code: 'CS304', credits: 3, attendance: 82, marks: 84, grade: 'A', semester: 3 },
    { id: 's5', name: 'Mathematics III', code: 'MA301', credits: 3, attendance: 91, marks: 88, grade: 'A+', semester: 3 },
    { id: 's6', name: 'Machine Learning Fundamentals', code: 'AI301', credits: 4, attendance: 94, marks: 91, grade: 'O', semester: 3 },
  ],

  skills: [
    { id: 'sk1', name: 'Java Programming', category: 'language', progress: 45, priority: 1, status: 'current', hoursSpent: 60, targetHours: 200, notes: '' },
    { id: 'sk2', name: 'Data Structures & Algorithms', category: 'cs', progress: 30, priority: 2, status: 'current', hoursSpent: 30, targetHours: 300, notes: '' },
    { id: 'sk3', name: 'Git & GitHub', category: 'tools', progress: 55, priority: 3, status: 'current', hoursSpent: 15, targetHours: 30, notes: '' },
    { id: 'sk4', name: 'HTML & CSS', category: 'web', progress: 40, priority: 4, status: 'current', hoursSpent: 20, targetHours: 60, notes: '' },
    { id: 'sk5', name: 'JavaScript', category: 'web', progress: 20, priority: 5, status: 'upcoming', hoursSpent: 8, targetHours: 150, notes: '' },
    { id: 'sk6', name: 'React', category: 'web', progress: 5, priority: 6, status: 'upcoming', hoursSpent: 2, targetHours: 120, notes: '' },
    { id: 'sk7', name: 'Spring Boot / Node.js', category: 'backend', progress: 0, priority: 7, status: 'planned', hoursSpent: 0, targetHours: 150, notes: '' },
    { id: 'sk8', name: 'SQL & Databases', category: 'backend', progress: 35, priority: 8, status: 'current', hoursSpent: 18, targetHours: 80, notes: '' },
    { id: 'sk9', name: 'CS Fundamentals (OS, CN, DBMS)', category: 'cs', progress: 50, priority: 9, status: 'current', hoursSpent: 40, targetHours: 100, notes: '' },
  ],

  projects: [],

  goals: {
    short: [],
    medium: [],
    long: [
      { id: 'lg1', title: 'Land 20+ LPA placement / internship', deadline: '2028-12-31', priority: 'high', progress: 15, milestones: ['Master Java + DSA', 'Build 3 strong projects', 'Clear 100+ DSA problems', 'Crack interview rounds'], notes: '' },
      { id: 'lg2', title: 'Start freelancing and earn first ₹10,000', deadline: '2027-06-30', priority: 'high', progress: 5, milestones: ['Learn web dev stack', 'Build portfolio website', 'Join freelancing platforms', 'Land first client'], notes: '' },
    ],
  },

  routine: [
    { id: 'r1', time: '05:30', endTime: '06:00', label: 'Wake Up & Fresh', color: '#f59e0b', days: [1,2,3,4,5,6,7] },
    { id: 'r2', time: '06:00', endTime: '06:30', label: 'Morning Exercise', color: '#10b981', days: [1,2,3,4,5,6,7] },
    { id: 'r3', time: '06:30', endTime: '07:00', label: 'Bath & Breakfast', color: '#f59e0b', days: [1,2,3,4,5,6,7] },
    { id: 'r4', time: '07:00', endTime: '08:00', label: 'Self Study / Reading', color: '#7c3aed', days: [1,2,3,4,5] },
    { id: 'r5', time: '08:00', endTime: '17:00', label: 'College Hours', color: '#3b82f6', days: [1,2,3,4,5] },
    { id: 'r6', time: '17:30', endTime: '18:30', label: 'Project Development', color: '#06b6d4', days: [1,2,3,4,5] },
    { id: 'r7', time: '18:30', endTime: '19:30', label: 'DSA / Problem Solving', color: '#ec4899', days: [1,2,3,4,5] },
    { id: 'r8', time: '19:30', endTime: '20:30', label: 'English & Communication', color: '#10b981', days: [1,2,3,4,5,6,7] },
    { id: 'r9', time: '20:30', endTime: '21:30', label: 'Java Learning (Core Time)', color: '#7c3aed', days: [1,2,3,4,5,6,7] },
    { id: 'r10', time: '21:30', endTime: '22:00', label: 'Night Review & Planning', color: '#a78bfa', days: [1,2,3,4,5,6,7] },
    { id: 'r11', time: '22:00', endTime: '22:30', label: 'Wind Down & Sleep Prep', color: '#f59e0b', days: [1,2,3,4,5,6,7] },
  ],

  vocabulary: [],
  englishLogs: [],

  freelancing: {
    income: [],
    expenses: [],
    clients: [],
    skills: [
      { name: 'HTML/CSS/JS', level: 40 },
      { name: 'React / Frontend', level: 10 },
      { name: 'Portfolio Building', level: 25 },
    ],
    portfolio: {
      website: false,
      github: false,
      linkedin: false,
      projects: 0,
      targetProjects: 5,
    },
    savingsGoal: 5000,
    currentSavings: 0,
  },

  personal: {
    categories: [
      { id: 'p1', name: 'Discipline', icon: '⚙️', score: 7, notes: '' },
      { id: 'p2', name: 'Consistency', icon: '🔁', score: 6, notes: '' },
      { id: 'p3', name: 'Confidence', icon: '💪', score: 6, notes: '' },
      { id: 'p4', name: 'Focus', icon: '🎯', score: 7, notes: '' },
      { id: 'p5', name: 'Reading', icon: '📖', score: 5, notes: '' },
      { id: 'p6', name: 'Physical Activity', icon: '🏃', score: 5, notes: '' },
      { id: 'p7', name: 'Sleep Quality', icon: '😴', score: 7, notes: '' },
    ],
    screenTimeGoal: 2,
  },

  analytics: {
    weeklyLogs: [],
    studyHours: [],
  },

  settings: {
    theme: 'dark',
    geminiApiKey: 'AQ.Ab8RN6JqX5pzkE1Iung94EHlkiit340QT1pXG3QggMBuYULVmg',
    notifications: true,
    dailyReminder: '21:00',
    weekStart: 'mon',
    motivationalQuotes: true,
    exportFormat: 'json',
  },

  chatHistory: [],
  motivation: {
    quotes: [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
      { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
      { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
      { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
      { text: "Your career is your responsibility, not your employer's.", author: "Anonymous" },
      { text: "Discipline is choosing between what you want now and what you want most.", author: "Augusta F. Kantra" },
      { text: "Every expert was once a beginner.", author: "Anonymous" },
      { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
      { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    ],
    daily: null,
    lastGenerated: null,
  },
};

// ── Store ─────────────────────────────────────────────────────────────────────
const Store = {
  _data: null,

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        this._data = this._deepMerge(DEFAULT_DATA, saved);
        if (!this._data.settings) this._data.settings = {};
        if (!this._data.settings.geminiApiKey) {
          this._data.settings.geminiApiKey = DEFAULT_DATA.settings.geminiApiKey;
        }
      } else {
        this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
    } catch (e) {
      console.error('Store: load error', e);
      this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return this;
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
      if (typeof AuthManager !== 'undefined' && AuthManager.scheduleSync) {
        AuthManager.scheduleSync();
      }
    } catch (e) {
      console.error('Store: save error', e);
    }
    return this;
  },

  get(path) {
    if (!path) return this._data;
    return path.split('.').reduce((obj, k) => obj?.[k], this._data);
  },

  set(path, value) {
    const keys = path.split('.');
    let obj = this._data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (obj[keys[i]] === undefined || obj[keys[i]] === null) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.save();
    return this;
  },

  push(path, item) {
    const arr = this.get(path) || [];
    arr.push(item);
    this.set(path, arr);
    return this;
  },

  update(path, id, updates) {
    const arr = this.get(path) || [];
    const idx = arr.findIndex(item => item.id === id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...updates };
      this.set(path, arr);
    }
    return this;
  },

  remove(path, id) {
    const arr = this.get(path) || [];
    this.set(path, arr.filter(item => item.id !== id));
    return this;
  },

  _deepMerge(defaults, saved) {
    const result = { ...defaults };
    for (const key of Object.keys(saved)) {
      if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key]) && typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
        result[key] = this._deepMerge(defaults[key] || {}, saved[key]);
      } else {
        result[key] = saved[key];
      }
    }
    return result;
  },

  reset() {
    this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
  },

  exportData() {
    return JSON.stringify(this._data, null, 2);
  },

  importData(jsonStr) {
    try {
      const imported = JSON.parse(jsonStr);
      this._data = this._deepMerge(DEFAULT_DATA, imported);
      this.save();
      return true;
    } catch (e) {
      return false;
    }
  }
};

// Initialize store
Store.load();
