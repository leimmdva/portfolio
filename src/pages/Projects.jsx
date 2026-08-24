import { useEffect, useState } from "react";
import { getProjects } from "../services/projects.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">{t("projects.eyebrow")}</div>
        <h1>
          {t("projects.title").replace(/\.$/, "")}
          <span className="italic-accent">.</span>
        </h1>
        <p>{t("projects.subhead")}</p>
      </div>

      <section className="project-grid">
        {error && <EmptyState text={t("common.projectsLoadError")} />}
        {!error && !projects && <LoadingState text={t("common.loadingProjects")} />}
        {!error && projects && projects.length === 0 && <EmptyState text={t("common.noProjects")} />}
        {!error && projects && projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </section>
    </>
  );
}
