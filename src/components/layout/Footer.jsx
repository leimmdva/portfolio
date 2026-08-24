import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="wrap">
      <div className="footer-inner">
        <Link to="/" className="logo" style={{ fontSize: 20 }}>
          Leyla <span>+</span>
        </Link>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-note">
          © 2026 Leyla. All rights reserved. · <Link to="/admin" style={{ color: "var(--text-faint)" }}>Admin</Link>
        </div>
      </div>
    </footer>
  );
}
