import { getLocalized } from "../utils/localized.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop";

export default function ProjectCard({ project }) {
  const { lang, t } = useLanguage();
  const stack = project.stack || [];

  return (
    <div className="project-card">
      <img src={project.image || FALLBACK_IMAGE} alt="" />
      <div className="project-body">
        <span className="card-tag">{project.tag || t("projects.fallbackTag")}</span>
        <h3 style={{ fontSize: 20, marginTop: 10 }}>{getLocalized(project.title, lang)}</h3>
        <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 8 }}>
          {getLocalized(project.description, lang)}
        </p>
        <div className="stack">
          {stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              {t("projects.liveLink")}
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              {t("projects.repoLink")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
