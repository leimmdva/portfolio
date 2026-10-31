import { useEffect, useRef } from "react";
import type { Project, ProjectDetails } from "~/content/site";
import { ButtonLink } from "~/components/ui/ButtonLink";
import { Icon } from "~/components/ui/Icon";
import { TagList } from "~/components/ui/Tag";
import { useUi } from "~/i18n/ui";
import styles from "./ProjectDialog.module.css";

export type DetailedProject = Project & { details: ProjectDetails };

export function ProjectDialog({ project, onClose }: { project: DetailedProject; onClose: () => void }) {
  const ui = useUi();
  const ref = useRef<HTMLDialogElement>(null);
  const { details: d } = project;
  const titleId = `dialog-${project.slug}`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // jsdom has no showModal; the open attribute is enough there.
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    // Esc fires "close"; tell the parent so the URL and state follow.
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.sheet}>
        <span className={styles.grabber} aria-hidden="true" />

        <header className={styles.header}>
          <div className={styles.title}>
            <p className={styles.label}>
              {project.category} · {d.year}
            </p>
            <h2 id={titleId} className={styles.name}>
              {project.name}
            </h2>
            <p className={styles.tagline}>{d.tagline}</p>
          </div>
          <button type="button" className={styles.close} onClick={onClose}>
            <Icon name="close" />
            <span className="visually-hidden">{ui.closeDetails}</span>
          </button>
        </header>

        <div className={styles.gallery}>
          <ul className={styles.shots} aria-label={ui.screenshots}>
            {[1, 2, 3].map((n) => (
              <li key={n} className={styles.shot}>
                {ui.screenshotN(n)}
              </li>
            ))}
          </ul>
          <p className={styles.note}>{ui.screenshotsLater}</p>
        </div>

        <div className={styles.body}>
          <div className={styles.story}>
            <h3 className={styles.label}>{ui.overview}</h3>
            <p>{d.overview}</p>
            <h3 className={styles.label}>{ui.whatIBuilt}</h3>
            <ul className={styles.bullets}>
              {d.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className={styles.aside}>
            <h3 className={styles.label}>{ui.techStack}</h3>
            <TagList items={d.stack} />
            <h3 className={styles.label}>{ui.links}</h3>
            {d.links.map((l) => (
              <ButtonLink key={l.url} variant="ghost" href={l.url} target="_blank" rel="noreferrer">
                {l.label} ↗
              </ButtonLink>
            ))}
            {d.linksNote && <p className={styles.note}>{d.linksNote}</p>}
          </div>
        </div>

        <dl className={styles.results}>
          {d.results.map((r) => (
            <div key={r.label} className={styles.result}>
              <dt className={styles.resultLabel}>{r.label}</dt>
              <dd className={styles.resultValue}>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </dialog>
  );
}
