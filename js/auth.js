/* ===========================
   LifeOS – Authentication & Multi-User Cloud Sync (Privacy Locked)
   =========================== */

const ACCOUNTS_KEY = 'lifeos_multi_accounts';
const CURRENT_SESSION_KEY = 'lifeos_active_session';
const SUPABASE_CONFIG_KEY = 'lifeos_supabase_config';

const DEFAULT_SUPABASE_URL = 'https://easdxpaygajwpmbwhdes.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhc2R4cGF5Z2Fqd3BtYndoZGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNjgwMzgsImV4cCI6MjEwODk0NDAzOH0.MepEP65ebnHZUrXeO0pf0PfCkznGe7BmiYLkE8uABzw';

// Clean empty starter template for friends/new users
function createCleanUserData(name, email) {
  return {
    user: {
      name: name || 'New User',
      email: email || '',
      degree: 'Degree / Major',
      university: 'My University',
      year: 1,
      graduation: new Date().getFullYear() + 4,
      cgpa: 0.0,
      targetPackage: 'Target Career Goal',
      goal: 'Achieve my full potential',
      avatar: (name || 'NU').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    },
    tasks: [],
    habits: [],
    subjects: [],
    skills: [
      { id: 'sk_1', name: 'Programming Fundamentals', category: 'language', progress: 0, priority: 1, status: 'planned', hoursSpent: 0, targetHours: 100, notes: '' },
      { id: 'sk_2', name: 'Data Structures & Algorithms', category: 'cs', progress: 0, priority: 2, status: 'planned', hoursSpent: 0, targetHours: 150, notes: '' },
      { id: 'sk_3', name: 'Git & Version Control', category: 'tools', progress: 0, priority: 3, status: 'planned', hoursSpent: 0, targetHours: 30, notes: '' },
      { id: 'sk_4', name: 'Web Development Basics', category: 'web', progress: 0, priority: 4, status: 'planned', hoursSpent: 0, targetHours: 80, notes: '' },
    ],
    projects: [],
    goals: {
      short: [],
      medium: [],
      long: [],
    },
    routine: [
      { id: 'r_clean_1', time: '07:00', endTime: '08:00', label: 'Morning Routine', color: '#f59e0b', days: [1,2,3,4,5,6,7] },
      { id: 'r_clean_2', time: '09:00', endTime: '17:00', label: 'Classes / Study Work', color: '#3b82f6', days: [1,2,3,4,5] },
      { id: 'r_clean_3', time: '18:00', endTime: '20:00', label: 'Skill Practice & Projects', color: '#7c3aed', days: [1,2,3,4,5,6,7] },
      { id: 'r_clean_4', time: '21:30', endTime: '22:00', label: 'Daily Review & Planning', color: '#10b981', days: [1,2,3,4,5,6,7] },
    ],
    vocabulary: [],
    englishLogs: [],
    freelancing: {
      income: [],
      expenses: [],
      clients: [],
      skills: [],
      portfolio: { website: false, github: false, linkedin: false, projects: 0, targetProjects: 3 },
      savingsGoal: 10000,
      currentSavings: 0,
    },
    personal: {
      categories: [
        { id: 'p1', name: 'Discipline', icon: '⚙️', score: 5, notes: '' },
        { id: 'p2', name: 'Consistency', icon: '🔁', score: 5, notes: '' },
        { id: 'p3', name: 'Focus', icon: '🎯', score: 5, notes: '' },
        { id: 'p4', name: 'Physical Health', icon: '🏃', score: 5, notes: '' },
        { id: 'p5', name: 'Sleep Quality', icon: '😴', score: 5, notes: '' },
      ],
      screenTimeGoal: 2,
    },
    analytics: {
      weeklyLogs: [],
      studyHours: [],
    },
    settings: {
      theme: 'dark',
      geminiApiKey: '',
      notifications: true,
      dailyReminder: '21:00',
      weekStart: 'mon',
      motivationalQuotes: true,
      exportFormat: 'json',
    },
    chatHistory: [],
    motivation: {
      quotes: [
        { text: "Consistency is what transforms average into excellence.", author: "Anonymous" },
        { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
      ],
      daily: null,
      lastGenerated: null,
    }
  };
}

const AuthManager = {
  currentUser: null,
  supabaseClient: null,
  syncTimeout: null,
  isSyncing: false,

  init() {
    this.initSupabase();
    this.loadSession();
  },

  initSupabase() {
    try {
      const savedConfig = localStorage.getItem(SUPABASE_CONFIG_KEY);
      let url = DEFAULT_SUPABASE_URL;
      let anonKey = DEFAULT_SUPABASE_ANON_KEY;

      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        url = parsed.url || DEFAULT_SUPABASE_URL;
        anonKey = parsed.anonKey || DEFAULT_SUPABASE_ANON_KEY;
      }

      if (url && anonKey && window.supabase && typeof window.supabase.createClient === 'function') {
        this.supabaseClient = window.supabase.createClient(url, anonKey);
        console.log('LifeOS: Supabase Cloud Client Initialized for project easdxpaygajwpmbwhdes');
      }
    } catch (e) {
      console.warn('LifeOS: Supabase init error', e);
    }
  },

  setSupabaseConfig(url, anonKey) {
    if (!url || !anonKey) {
      localStorage.removeItem(SUPABASE_CONFIG_KEY);
      this.supabaseClient = null;
      Toast.info('Cloud database disconnected.');
      return;
    }
    try {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        this.supabaseClient = window.supabase.createClient(url.trim(), anonKey.trim());
        localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
        Toast.success('Cloud Database connected successfully!');
        if (this.currentUser) this.syncToCloud(true);
      }
    } catch (e) {
      Toast.error('Invalid Supabase URL or Anon Key.');
    }
  },

  getSupabaseConfig() {
    try {
      const cfg = JSON.parse(localStorage.getItem(SUPABASE_CONFIG_KEY) || '{}');
      if (!cfg.url) cfg.url = DEFAULT_SUPABASE_URL;
      if (!cfg.anonKey) cfg.anonKey = DEFAULT_SUPABASE_ANON_KEY;
      return cfg;
    } catch {
      return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
    }
  },

  loadSession() {
    try {
      const sessionRaw = localStorage.getItem(CURRENT_SESSION_KEY);
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed && parsed.username) {
          this.currentUser = parsed;
          this.unlockApp();
          if (this.supabaseClient && this.currentUser) {
            setTimeout(() => this.pullFromCloud(true), 600);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Session load error', e);
    }

    // If no valid verified session, lock app and display mandatory login gate
    this.lockApp();
  },

  lockApp() {
    this.currentUser = null;
    document.body.classList.add('not-authenticated');
    const authScreen = document.getElementById('authScreen');
    if (authScreen) authScreen.style.display = 'flex';
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  },

  unlockApp() {
    document.body.classList.remove('not-authenticated');
    const authScreen = document.getElementById('authScreen');
    if (authScreen) authScreen.style.display = 'none';
    this.updateUserCardUI();
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  },

  saveSession(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
      this.unlockApp();
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      this.lockApp();
    }
  },

  updateUserCardUI() {
    const user = this.currentUser;
    const nameEl = document.querySelector('.user-name');
    const metaEl = document.querySelector('.user-meta');
    const avatarEl = document.querySelector('.user-avatar');

    if (user && nameEl && avatarEl) {
      nameEl.textContent = user.name || user.username;
      const initials = (user.name || user.username).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      avatarEl.textContent = initials;
      if (metaEl) {
        metaEl.innerHTML = user.isVasanth 
          ? `CSE (AI&ML) • <span style="color:var(--accent-green);">20+ LPA Target</span>` 
          : `<span style="color:var(--accent-cyan-light);">Personal LifeOS</span>`;
      }
    }
  },

  // ── Authentication Engine ───────────────────────────────────────────────────
  async signIn(username, password) {
    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) throw new Error('Please enter your username.');
    if (!password) throw new Error('Please enter your password.');

    const passHash = this.simpleHash(password);

    // 1. Check Supabase Cloud Database first
    if (this.supabaseClient) {
      try {
        const { data: cloudRow } = await this.supabaseClient
          .from('lifeos_userdata')
          .select('*')
          .eq('username', cleanUser)
          .maybeSingle();

        if (cloudRow && cloudRow.data) {
          const expectedHash = cloudRow.data.accountPasswordHash;
          if (expectedHash && expectedHash !== passHash) {
            throw new Error('❌ Incorrect password. Access denied.');
          }

          const sessionUser = {
            id: cloudRow.user_id,
            username: cleanUser,
            email: cloudRow.data.user?.email || '',
            name: cloudRow.data.user?.name || cleanUser,
            isVasanth: cleanUser === 'vasanth' || cleanUser === 'vasanthm'
          };

          this.saveSession(sessionUser);
          Store._data = cloudRow.data;
          Store.save();
          return sessionUser;
        }
      } catch (err) {
        if (err.message && err.message.includes('Incorrect password')) throw err;
        console.warn('Supabase lookup failed, checking local accounts', err);
      }
    }

    // 2. Check local accounts database
    const accounts = this.getStoredAccounts();
    const localAcc = accounts[cleanUser];

    if (localAcc) {
      if (localAcc.password !== passHash) {
        throw new Error('❌ Incorrect password. Access denied.');
      }

      const sessionUser = {
        id: localAcc.id,
        username: cleanUser,
        email: localAcc.email || '',
        name: localAcc.name || cleanUser,
        isVasanth: localAcc.isVasanth
      };

      this.saveSession(sessionUser);
      Store._data = localAcc.data;
      Store.save();
      return sessionUser;
    }

    // 3. First-time initialization for Vasanth
    // If Vasanth is logging in for the first time on a fresh setup, lock with the entered password!
    if (cleanUser === 'vasanth' || cleanUser === 'vasanthm') {
      const initialData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      initialData.accountPasswordHash = passHash;

      const userId = 'usr_' + uid();
      const sessionUser = {
        id: userId,
        username: cleanUser,
        email: 'vasanth@lifeos.app',
        name: 'Vasanth M',
        isVasanth: true
      };

      // Save locally
      accounts[cleanUser] = {
        id: userId,
        username: cleanUser,
        name: 'Vasanth M',
        password: passHash,
        isVasanth: true,
        data: initialData
      };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      // Save to Supabase Cloud
      if (this.supabaseClient) {
        await this.supabaseClient.from('lifeos_userdata').upsert({
          user_id: userId,
          username: cleanUser,
          data: initialData,
          updated_at: new Date().toISOString()
        });
      }

      this.saveSession(sessionUser);
      Store._data = initialData;
      Store.save();
      return sessionUser;
    }

    // If account not found
    throw new Error('Account not found. Please click "Create Account" tab to set up your private dashboard.');
  },

  async signUp(username, password, fullName) {
    const cleanUser = username.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanUser;

    if (!cleanUser || cleanUser.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const passHash = this.simpleHash(password);

    // Verify username not already taken in Supabase
    if (this.supabaseClient) {
      try {
        const { data: existing } = await this.supabaseClient
          .from('lifeos_userdata')
          .select('username')
          .eq('username', cleanUser)
          .maybeSingle();

        if (existing) {
          throw new Error('This username is already taken. Please choose another username or Sign In.');
        }
      } catch (err) {
        if (err.message && err.message.includes('already taken')) throw err;
      }
    }

    const accounts = this.getStoredAccounts();
    if (accounts[cleanUser]) {
      throw new Error('This username is already registered. Please choose another or Sign In.');
    }

    // Determine initial data template:
    // If username is "vasanth", initialize with Vasanth's preloaded data, else create completely empty clean system!
    const userData = (cleanUser === 'vasanth' || cleanUser === 'vasanthm')
      ? JSON.parse(JSON.stringify(DEFAULT_DATA))
      : createCleanUserData(cleanName, `${cleanUser}@lifeos.user`);

    userData.accountPasswordHash = passHash;
    const userId = 'usr_' + uid();

    // Save to local accounts
    accounts[cleanUser] = {
      id: userId,
      username: cleanUser,
      name: cleanName,
      password: passHash,
      isVasanth: cleanUser.includes('vasanth'),
      data: userData,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

    // Save to Supabase Cloud Database
    if (this.supabaseClient) {
      try {
        await this.supabaseClient.from('lifeos_userdata').upsert({
          user_id: userId,
          username: cleanUser,
          data: userData,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase cloud signup save error', err);
      }
    }

    const sessionUser = {
      id: userId,
      username: cleanUser,
      email: `${cleanUser}@lifeos.user`,
      name: cleanName,
      isVasanth: cleanUser.includes('vasanth')
    };

    this.saveSession(sessionUser);
    Store._data = userData;
    Store.save();
    return sessionUser;
  },

  signOut() {
    this.saveSession(null);
    Toast.info('🔒 LifeOS locked. Sign in to continue.');
    if (typeof App !== 'undefined') App.navigate('dashboard');
  },

  // ── Cloud Sync ──────────────────────────────────────────────────────────────
  scheduleSync() {
    if (!this.currentUser || !this.currentUser.username) return;

    // Cache locally
    const accounts = this.getStoredAccounts();
    if (accounts[this.currentUser.username]) {
      accounts[this.currentUser.username].data = Store._data;
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }

    // Sync to Supabase
    if (this.supabaseClient) {
      clearTimeout(this.syncTimeout);
      this.syncTimeout = setTimeout(() => {
        this.syncToCloud();
      }, 1500);
    }
  },

  async syncToCloud(showToast = false) {
    if (!this.supabaseClient || !this.currentUser || this.isSyncing) return;
    try {
      this.isSyncing = true;
      const { error } = await this.supabaseClient
        .from('lifeos_userdata')
        .upsert({
          user_id: this.currentUser.id,
          username: this.currentUser.username,
          data: Store._data,
          updated_at: new Date().toISOString()
        });

      if (!error && showToast) {
        Toast.success('☁️ Saved to cloud database!');
      }
    } catch (err) {
      console.warn('Sync error', err);
    } finally {
      this.isSyncing = false;
    }
  },

  async pullFromCloud(silent = false) {
    if (!this.supabaseClient || !this.currentUser) return;
    try {
      if (!silent) Toast.info('Fetching latest data from cloud database...');
      const { data, error } = await this.supabaseClient
        .from('lifeos_userdata')
        .select('data')
        .eq('user_id', this.currentUser.id)
        .single();

      if (!error && data?.data) {
        Store._data = data.data;
        Store.save();
        if (!silent) Toast.success('LifeOS data updated from cloud!');
        if (typeof App !== 'undefined') App.navigate(App.currentPage);
      }
    } catch (err) {
      if (!silent) Toast.error('Could not pull from cloud: ' + err.message);
    }
  },

  getStoredAccounts() {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}');
    } catch {
      return {};
    }
  },

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36);
  }
};

// ── Auth Gate Event Handlers ──────────────────────────────────────────────────
function toggleGateTab(tab) {
  const isSignIn = tab === 'signin';
  document.getElementById('gateSignInForm').style.display = isSignIn ? 'block' : 'none';
  document.getElementById('gateSignUpForm').style.display = isSignIn ? 'none' : 'block';

  document.getElementById('btnTabSignIn').classList.toggle('active', isSignIn);
  document.getElementById('btnTabSignUp').classList.toggle('active', !isSignIn);

  if (isSignIn) {
    document.getElementById('gateLoginUser')?.focus();
  } else {
    document.getElementById('gateRegName')?.focus();
  }
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

async function handleGateLogin(e) {
  e.preventDefault();
  const user = document.getElementById('gateLoginUser')?.value.trim();
  const pass = document.getElementById('gateLoginPass')?.value;
  const btn = document.getElementById('gateSignInBtn');

  if (btn) btn.innerHTML = `<i data-lucide="loader"></i> Verifying...`;
  try {
    const session = await AuthManager.signIn(user, pass);
    Toast.success(`Welcome back, ${session.name}!`);
    if (typeof App !== 'undefined') App.navigate('dashboard');
  } catch (err) {
    Toast.error(err.message || 'Login failed.');
  } finally {
    if (btn) {
      btn.innerHTML = `<i data-lucide="unlock"></i> Sign In to My LifeOS`;
      lucide.createIcons();
    }
  }
}

async function handleGateRegister(e) {
  e.preventDefault();
  const name = document.getElementById('gateRegName')?.value.trim();
  const user = document.getElementById('gateRegUser')?.value.trim();
  const pass = document.getElementById('gateRegPass')?.value;
  const btn = document.getElementById('gateSignUpBtn');

  if (btn) btn.innerHTML = `<i data-lucide="loader"></i> Creating account...`;
  try {
    const session = await AuthManager.signUp(user, pass, name);
    Toast.success(`Account created! Welcome to LifeOS, ${session.name}!`);
    if (typeof App !== 'undefined') App.navigate('dashboard');
  } catch (err) {
    Toast.error(err.message || 'Registration failed.');
  } finally {
    if (btn) {
      btn.innerHTML = `<i data-lucide="user-plus"></i> Create Private Account`;
      lucide.createIcons();
    }
  }
}
