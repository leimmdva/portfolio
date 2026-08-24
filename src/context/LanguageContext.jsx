import { createContext, useContext, useEffect, useState } from "react";
import { DICTIONARIES, DEFAULT_LANG } from "../i18n/index.js";

const STORAGE_KEY = "leyla-lang";
const LanguageContext = createContext(null);

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && DICTIONARIES[stored]) return stored;
  } catch (e) {}
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next) => {
    if (!DICTIONARIES[next]) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
  };

  const t = (path) => {
    const value = getPath(DICTIONARIES[lang], path) ?? getPath(DICTIONARIES[DEFAULT_LANG], path);
    return value ?? path;
  };

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
