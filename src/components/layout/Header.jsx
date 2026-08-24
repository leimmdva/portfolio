import { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import LanguageSwitcher from "../LanguageSwitcher.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/about", label: t("nav.about") },
    { to: "/blog", label: t("nav.blog") },
    { to: "/projects", label: t("nav.projects") },
    { to: "/notes", label: t("nav.notes") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="wrap">
      <nav className="site-nav">
        <NavLink to="/" className="logo">
          Leyla <span>+</span>
        </NavLink>
        <ul className={`nav-links${open ? " open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <div className="nav-icons">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}
