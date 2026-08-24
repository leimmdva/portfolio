import { DEFAULT_LANG } from "../i18n/languages.js";

// Reads a possibly-localized Firestore field. Supports both the
// { en, tr, az, ru, de } shape and legacy plain-string values saved
// before multi-language support existed.
export function getLocalized(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value[DEFAULT_LANG] || Object.values(value).find(Boolean) || "";
}

export function hasLocalizedValue(value) {
  if (!value) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return Object.values(value).some((v) => v && v.trim().length > 0);
}
