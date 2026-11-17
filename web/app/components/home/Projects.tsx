import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { Project } from "~/content/site";
import { StatusPill } from "~/components/ui/StatusPill";
import { TagList } from "~/components/ui/Tag";
import { AssistantWall, type WallItem } from "~/components/ui/AssistantWall";
import { ProjectDialog, type DetailedProject } from "./ProjectDialog";
import { SectionHead } from "./SectionHead";
import { useUi } from "~/i18n/ui";
import styles from "./Projects.module.css";

const hasDetails = (p: Project): p is DetailedProject => p.details !== undefined;

export function Projects({ projects }: { projects: Project[] }) {
  const ui = useUi();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  // The pre-rendered HTML never has a dialog, so wait for hydration before opening one from ?project=.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // The moving wall replaces the list once the browser can run it; reduced motion keeps the calm list.
  const [wall, setWall] = useState(false);
  useEffect(() => {
    const canRun = typeof ResizeObserver !== "undefined" && typeof window.matchMedia === "function";
    setWall(canRun && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const open = hydrated ? projects.filter(hasDetails).find((p) => p.slug === params.get("project")) : undefined;

  const show = (slug: string) => setParams({ project: slug }, { preventScrollReset: true, state: { fromCard: true } });

  // Opened from a card: go back so Back doesn't reopen it. Opened from a shared link: just drop the param.
  const close = useCallback(() => {
    if (location.state?.fromCard) navigate(-1);
    else setParams({}, { replace: true, preventScrollReset: true });
  }, [location.state, navigate, setParams]);

  // Return focus to the card's button once the dialog is gone.
  const lastOpen = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (lastOpen.current && !open) document.getElementById(`open-${lastOpen.current}`)?.focus();
    lastOpen.current = open?.slug;
  }, [open]);

  return (
    <section id="work" className={`container ${styles.section}`} aria-labelledby="work-title">
      <SectionHead id="work-title" title={ui.workTitle} label={ui.workLabel} />
      {wall ? (
        <ProjectWall projects={projects} onOpen={show} />
      ) : (
        <ul className={styles.list}>
          {projects.map((p) => (
            <li key={p.slug} data-reveal>
              <ProjectCard project={p} onOpen={hasDetails(p) ? () => show(p.slug) : undefined} />
            </li>
          ))}
        </ul>
      )}
      {open && <ProjectDialog key={open.slug} project={open} onClose={close} />}
    </section>
  );
}

function ProjectCard({ project: p, onOpen }: { project: Project; onOpen?: () => void }) {
  const ui = useUi();
  return (
    <article
      className={onOpen ? `${styles.card} ${styles.clickable}` : styles.card}
      aria-labelledby={`project-${p.slug}`}
    >
      {p.image ? (
        <img
          className={`${styles.media} ${styles.image}`}
          src={p.image.url}
          alt={p.image.alt}
          loading="lazy"
          decoding="async"
        />
      ) : p.cover ? (
        <div className={`${styles.media} ${styles.cover}`}>
          <p className={styles.coverTitle}>{p.cover.title}</p>
          <p className={styles.coverCaption}>{p.cover.caption}</p>
        </div>
      ) : (
        <div className={`${styles.media} ${styles.placeholder}`} aria-hidden="true">
          {ui.screenshot(p.name)}
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
        {onOpen && (
          <button id={`open-${p.slug}`} type="button" className={styles.open} aria-haspopup="dialog" onClick={onOpen}>
            {ui.viewDetails}
            <span className="visually-hidden">{ui.aboutProject(p.name)}</span> →
          </button>
        )}
      </div>
    </article>
  );
}

/** Projects on the glass wall, with a plain index of buttons below it for keyboard and screen reader users. */
function ProjectWall({ projects, onOpen }: { projects: Project[]; onOpen: (slug: string) => void }) {
  const ui = useUi();
  const items: WallItem[] = projects.map((p, i) => ({
    badge: String(i + 1).padStart(2, "0"),
    // The category starts with the project number ("01 · AI"), which the sphere already shows.
    label: p.category.replace(/^\d+\s*·\s*/, ""),
    title: p.name,
    text: p.summary,
    action: hasDetails(p) ? `${ui.viewDetails} →` : (p.status ?? ""),
  }));
  // No data-reveal here: the wall mounts after the reveal observer has collected its targets.
  return (
    <div>
      <AssistantWall
        items={items}
        className={styles.wall}
        onOpen={(i) => {
          const p = projects[i];
          if (p && hasDetails(p)) onOpen(p.slug);
        }}
      />
      <ul className={styles.index} aria-label={ui.workTitle}>
        {projects.map((p) => (
          <li key={p.slug}>
            {hasDetails(p) ? (
              <button
                id={`open-${p.slug}`}
                type="button"
                className={styles.indexItem}
                aria-haspopup="dialog"
                onClick={() => onOpen(p.slug)}
              >
                <span className="visually-hidden">{ui.viewDetails}</span>
                <span className="visually-hidden">{ui.aboutProject(p.name)}</span>
                <span aria-hidden="true">{p.name}</span>
              </button>
            ) : (
              <span className={`${styles.indexItem} ${styles.indexMuted}`}>
                {p.name}
                {p.status && <span className="visually-hidden">: {p.status}</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
