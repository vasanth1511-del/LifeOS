/* ===========================
   LifeOS – Main App Controller & Router
   =========================== */

const App = {
  currentPage: 'dashboard',
  _charts: {},

  init() {
    // 1. Theme initialization
    const savedTheme = Store.get('settings.theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    // 2. Navigation items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        if (page) this.navigate(page);
      });
    });

    // 3. Sidebar toggle buttons
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.openMobileSidebar());
    }

    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());
    }

    // 4. Modal listeners
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
      modalClose.addEventListener('click', () => Modal.close());
    }

    const modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) Modal.close();
      });
    }

    // 5. Theme toggles
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    const mobileThemeBtn = document.getElementById('mobileThemeBtn');
    if (mobileThemeBtn) {
      mobileThemeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // 6. Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape closes open modals
      if (e.key === 'Escape') {
        Modal.close();
      }
      // Alt + D: Jump to Dashboard
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        this.navigate('dashboard');
      }
      // Alt + T: Quick Add Task
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        if (typeof addTaskModal === 'function') addTaskModal();
      }
    });

    // 7. Initialize Auth & Cross-Device Cloud Sync
    if (typeof AuthManager !== 'undefined' && AuthManager.init) {
      AuthManager.init();
    }

    // 8. Render start page only if authenticated
    if (!document.body.classList.contains('not-authenticated')) {
      this.navigate('dashboard');
    }
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  },

  navigate(page) {
    this.currentPage = page;

    // Destroy existing charts to prevent memory leak and canvas reuse errors
    Object.keys(this._charts).forEach(key => {
      try {
        if (this._charts[key] && typeof this._charts[key].destroy === 'function') {
          this._charts[key].destroy();
        }
      } catch (err) {
        console.warn('Chart cleanup error:', err);
      }
    });
    this._charts = {};

    // Clear live clock interval if moving away from dashboard
    if (typeof _clockInterval !== 'undefined' && _clockInterval) {
      clearInterval(_clockInterval);
      _clockInterval = null;
    }

    // Highlight active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      const itemPage = item.getAttribute('data-page');
      item.classList.toggle('active', itemPage === page);
    });

    // Page renderer map
    const pageRenderers = {
      dashboard: typeof renderDashboard === 'function' ? renderDashboard : null,
      academic: typeof renderAcademic === 'function' ? renderAcademic : null,
      skills: typeof renderSkills === 'function' ? renderSkills : null,
      routine: typeof renderRoutine === 'function' ? renderRoutine : null,
      english: typeof renderEnglish === 'function' ? renderEnglish : null,
      personal: typeof renderPersonal === 'function' ? renderPersonal : null,
      freelancing: typeof renderFreelancing === 'function' ? renderFreelancing : null,
      projects: typeof renderProjects === 'function' ? renderProjects : null,
      goals: typeof renderGoals === 'function' ? renderGoals : null,
      analytics: typeof renderAnalytics === 'function' ? renderAnalytics : null,
      assistant: typeof renderAssistant === 'function' ? renderAssistant : null,
      settings: typeof renderSettings === 'function' ? renderSettings : null,
    };

    const container = document.getElementById('pageContainer');
    if (!container) return;

    const renderer = pageRenderers[page];
    if (renderer) {
      container.innerHTML = renderer();
      lucide.createIcons();
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Page-specific post-render hooks
      if (page === 'dashboard' && typeof startLiveClock === 'function') {
        startLiveClock();
      } else if (page === 'analytics' && typeof drawAllCharts === 'function') {
        setTimeout(() => drawAllCharts(), 120);
      } else if (page === 'academic' && typeof drawSubjectChart === 'function') {
        setTimeout(() => drawSubjectChart(), 120);
      } else if (page === 'personal' && typeof drawHabitWeekChart === 'function') {
        setTimeout(() => drawHabitWeekChart(), 120);
      } else if (page === 'freelancing' && typeof drawIncomeChart === 'function') {
        setTimeout(() => drawIncomeChart(), 120);
      } else if (page === 'skills' && typeof drawSkillRadarChart === 'function') {
        setTimeout(() => drawSkillRadarChart(), 120);
      } else if (page === 'english' && typeof drawVocabChart === 'function') {
        setTimeout(() => drawVocabChart(), 120);
      }
    } else {
      container.innerHTML = `
        <div class="page">
          <div class="card empty-state">
            <div class="empty-state-icon">⚠️</div>
            <h3>Page Not Found</h3>
            <p>Could not load view for "${escapeHtml(page)}".</p>
            <button class="btn btn-primary" onclick="App.navigate('dashboard')">Return to Dashboard</button>
          </div>
        </div>
      `;
      lucide.createIcons();
    }

    // Close mobile drawer on navigation
    this.closeMobileSidebar();
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('mainContent');
    if (sidebar && main) {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('sidebar-collapsed');
    }
  },

  openMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
      sidebar.classList.add('mobile-open');
      overlay.style.display = 'block';
      requestAnimationFrame(() => overlay.classList.add('active'));
    }
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar && overlay) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
      setTimeout(() => { overlay.style.display = 'none'; }, 250);
    }
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Store.set('settings.theme', next);
    updateThemeButton(next);

    // Refresh charts for theme color adaptation
    if (typeof applyChartDefaults === 'function') applyChartDefaults();
    this.navigate(this.currentPage);
  }
};

function updateThemeButton(theme) {
  const isDark = theme === 'dark';
  const icon = isDark ? 'sun' : 'moon';
  const label = isDark ? 'Light Mode' : 'Dark Mode';

  document.querySelectorAll('#themeToggle, #mobileThemeBtn').forEach(btn => {
    btn.innerHTML = `<i data-lucide="${icon}"></i> <span>${label}</span>`;
  });
  lucide.createIcons();
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  if (typeof applyChartDefaults === 'function') {
    applyChartDefaults();
  }
  App.init();
});
