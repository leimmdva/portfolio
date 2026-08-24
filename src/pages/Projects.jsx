import { useEffect, useState } from "react";
import { getProjects } from "../services/projects.js";
import ProjectCard from "../components/ProjectCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Projects() {
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
        <div className="eyebrow">Selected work</div>
        <h1>
          Projects<span className="italic-accent">.</span>
        </h1>
        <p>A closer look at the products, tools, and experiments I've built with code.</p>
      </div>

      <section className="project-grid">
        {error && <EmptyState text="Projects could not be loaded." />}
        {!error && !projects && <LoadingState text="Loading projects..." />}
        {!error && projects && projects.length === 0 && (
          <EmptyState text="No projects added yet." />
        )}
        {!error && projects && projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </section>
    </>
  );
}
