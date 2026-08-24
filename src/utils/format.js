const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value) {
  if (!value) return "";
  const d = value.toDate ? value.toDate() : new Date(value); // Firestore Timestamp or string
  if (isNaN(d)) return value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}
