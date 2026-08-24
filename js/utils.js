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
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
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
