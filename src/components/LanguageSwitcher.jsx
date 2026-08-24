import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { LANGUAGES } from "../i18n/languages.js";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{current.code.toUpperCase()}</span>
        <span className="lang-caret">▾</span>
      </button>
      {open && (
        <ul className="lang-menu">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                className={`lang-menu-item${l.code === lang ? " active" : ""}`}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
              >
                <span className="lang-flag">{l.flag}</span>
                <span>{l.endonym}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
