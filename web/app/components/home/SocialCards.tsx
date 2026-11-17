import type { IconName } from "~/components/ui/Icon";
import { Icon } from "~/components/ui/Icon";
import { useUi } from "~/i18n/ui";
import styles from "./SocialCards.module.css";

export type ContactCard = {
  kind: "email" | "linkedin" | "github" | "instagram";
  icon: IconName;
  label: string;
  handle: string;
  url: string;
  /** Screen-reader hint added after the visible text. */
  hint: string;
  external?: boolean;
};

/** One small, slightly tilted card per way to reach me, each with its own colour strip. */
export function SocialCards({ items }: { items: ContactCard[] }) {
  const ui = useUi();
  return (
    <ul className={styles.list} aria-label={ui.socialCardsLabel}>
      {items.map((c, i) => (
        <li key={c.kind} className={styles.item} data-i={i % 4}>
          <a
            className={styles.card}
            href={c.url}
            data-kind={c.kind}
            {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <span className={styles.head}>
              <span className={styles.icon} aria-hidden="true">
                <Icon name={c.icon} size={18} />
              </span>
              <span className={styles.text}>
                <span className={styles.label}>{c.label}</span>
                <span className={styles.title}>{ui.socialCards[c.kind].title}</span>
              </span>
            </span>
            <span className={styles.foot}>
              <span className={styles.handle}>
                <Icon name="arrowUpRight" size={14} />
                <span className={styles.handleText}>{c.handle}</span>
              </span>
              <span className={styles.tag}>{ui.socialCards[c.kind].tag}</span>
            </span>
            <span className="visually-hidden"> ({c.hint})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
