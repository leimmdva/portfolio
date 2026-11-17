import type { Project } from "~/content/site";
import { useUi } from "~/i18n/ui";
import styles from "./ProjectsFolder.module.css";

/**
 * A folder in the middle of the projects section. It settles into place as it scrolls in,
 * opens a little on hover, and links to the full-screen projects page.
 */
export function ProjectsFolder({ projects, href }: { projects: Project[]; href: string }) {
  const ui = useUi();
  // The top three projects peek out of the folder as paper sheets.
  const sheets = projects.slice(0, 3);
  return (
    <div className={styles.wrap} data-reveal>
      <a className={styles.folder} href={href} aria-label={ui.openProjects(projects.length)}>
        <span className={styles.back} aria-hidden="true" />
        {sheets.map((p, i) => (
          <span key={p.slug} className={styles.sheet} data-i={i} aria-hidden="true">
            <span className={styles.sheetLabel}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.sheetName}>{p.name}</span>
          </span>
        ))}
        <span className={styles.front} aria-hidden="true">
          <span className={styles.name}>{ui.projectsFolder}</span>
          <span className={styles.count}>{projects.length}</span>
        </span>
      </a>
    </div>
  );
}
