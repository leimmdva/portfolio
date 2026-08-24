import { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projects" },
  { to: "/notes", label: "Notes" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

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
