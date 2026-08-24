const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop";

export default function ProjectCard({ project }) {
  const stack = project.stack || [];

  return (
    <div className="project-card">
      <img src={project.image || FALLBACK_IMAGE} alt="" />
      <div className="project-body">
        <span className="card-tag">{project.tag || "Project"}</span>
        <h3 style={{ fontSize: 20, marginTop: 10 }}>{project.title}</h3>
        <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 8 }}>{project.description || ""}</p>
        <div className="stack">
          {stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="project-links">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live preview →
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              Source code →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
