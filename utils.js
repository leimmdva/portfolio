/* Shared helper functions */

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  let d;
  if (!value) return "";
  if (value.toDate) d = value.toDate(); // Firestore Timestamp
  else d = new Date(value);
  if (isNaN(d)) return value;
  const aylar = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  return `${d.getDate()} ${aylar[d.getMonth()]} ${d.getFullYear()}`;
}

function paragraphsToHtml(text) {
  if (!text) return "";
  return text
    .split(/\n\s*\n/)
    .map(p => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function slugify(text) {
  const trMap = { ç:"c", ğ:"g", ı:"i", ö:"o", ş:"s", ü:"u", Ç:"c", Ğ:"g", İ:"i", Ö:"o", Ş:"s", Ü:"u" };
  return text
    .split("").map(ch => trMap[ch] || ch).join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

(function () {
  const STORAGE_KEY = "leyla-theme";

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch (e) {
      console.warn("Theme storage unavailable:", e);
    }
    return "light";
  }

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    document.querySelectorAll(".icon-btn").forEach(btn => {
      const isDark = theme === "dark";
      btn.textContent = isDark ? "☀" : "☾";
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    });
  }

  function initThemeToggle() {
    const theme = getStoredTheme();
    applyTheme(theme);

    document.querySelectorAll(".icon-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const nextTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
          localStorage.setItem(STORAGE_KEY, nextTheme);
        } catch (e) {
          console.warn("Could not save theme:", e);
        }
      });

      btn.setAttribute("role", "button");
      btn.setAttribute("tabindex", "0");
      btn.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          btn.click();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
