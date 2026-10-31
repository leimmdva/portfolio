import type { TimelineItem } from "~/content/site";
import { SectionHead } from "./SectionHead";
import { useUi } from "~/i18n/ui";
import styles from "./Experience.module.css";

export function Experience({ items }: { items: TimelineItem[] }) {
  const ui = useUi();
  return (
    <section id="experience" aria-labelledby="experience-title">
      <SectionHead id="experience-title" title={ui.experienceTitle} />
      <ol>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <p className={styles.period}>{item.period}</p>
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
