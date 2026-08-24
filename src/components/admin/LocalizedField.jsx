import { useState } from "react";
import { LANGUAGES, DEFAULT_LANG } from "../../i18n/languages.js";

export default function LocalizedField({ label, value, onChange, multiline = false, rows = 4, placeholder }) {
  const [activeLang, setActiveLang] = useState(DEFAULT_LANG);
  const values = typeof value === "string" ? { [DEFAULT_LANG]: value } : value || {};

  const handleChange = (e) => {
    onChange({ ...values, [activeLang]: e.target.value });
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="lang-tabs">
        {LANGUAGES.map((l) => (
          <button
            type="button"
            key={l.code}
            className={`lang-tab${activeLang === l.code ? " active" : ""}${values[l.code] ? " filled" : ""}`}
            onClick={() => setActiveLang(l.code)}
          >
            {l.flag} {l.code.toUpperCase()}
          </button>
        ))}
      </div>
      {multiline ? (
        <textarea rows={rows} placeholder={placeholder} value={values[activeLang] || ""} onChange={handleChange} />
      ) : (
        <input type="text" placeholder={placeholder} value={values[activeLang] || ""} onChange={handleChange} />
      )}
    </div>
  );
}
