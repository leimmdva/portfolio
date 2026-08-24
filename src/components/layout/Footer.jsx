import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="wrap">
      <div className="footer-inner">
        <Link to="/" className="logo" style={{ fontSize: 20 }}>
          Leyla <span>+</span>
        </Link>
        <div className="footer-links">
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/blog">{t("nav.blog")}</Link>
          <Link to="/projects">{t("nav.projects")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
        </div>
        <div className="footer-note">
          {t("footer.rights")} · <Link to="/admin" style={{ color: "var(--text-faint)" }}>{t("nav.admin")}</Link>
        </div>
      </div>
    </footer>
  );
}
