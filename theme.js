(function () {
  const STORAGE_KEY = 'leyla-theme';

  function applyTheme(theme) {
    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', safeTheme);

    document.querySelectorAll('.icon-btn').forEach((btn) => {
      const isDark = safeTheme === 'dark';
      btn.textContent = isDark ? '☀' : '☾';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    });
  }

  function getInitialTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {}
    return 'light';
  }

  function initMobileMenu() {
    document.querySelectorAll('.site-nav').forEach((nav) => {
      const navLinks = nav.querySelector('.nav-links');
      const toggle = nav.querySelector('.nav-toggle');
      if (!navLinks || !toggle) return;

      toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.textContent = isOpen ? '✕' : '☰';
      });

      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '☰';
        });
      });
    });
  }

  function initThemeToggle() {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);

    document.querySelectorAll('.icon-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (e) {}
      });

      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          btn.click();
        }
      });
    });

    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
