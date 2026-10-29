import type { Project } from "~/content/site";
import { StatusPill } from "~/components/ui/StatusPill";
import { TagList } from "~/components/ui/Tag";
import { SectionHead } from "./SectionHead";
import styles from "./Projects.module.css";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className={`container ${styles.section}`} aria-labelledby="work-title">
      <SectionHead id="work-title" title="Selected work" label="01 — Projects" />
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className={styles.card} aria-labelledby={`project-${p.slug}`}>
      {p.cover ? (
        <div className={`${styles.media} ${styles.cover}`}>
          <p className={styles.coverTitle}>{p.cover.title}</p>
          <p className={styles.coverCaption}>{p.cover.caption}</p>
        </div>
      ) : (
        <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true">
          {p.name} screenshot
        </div>
      )}
      <div className={styles.info}>
        <p className={styles.category}>{p.category}</p>
        <h3 id={`project-${p.slug}`} className={styles.name}>
          {p.name}
        </h3>
        <p className={styles.summary}>{p.summary}</p>
        {p.highlight && <p className={styles.highlight}>{p.highlight}</p>}
        {p.status && <StatusPill>{p.status}</StatusPill>}
        {p.tags.length > 0 && <TagList items={p.tags} />}
      </div>
    </article>
  );
}
