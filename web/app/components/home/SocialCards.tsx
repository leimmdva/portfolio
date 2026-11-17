import type { Social } from "~/content/site";
import { Icon } from "~/components/ui/Icon";
import { useUi } from "~/i18n/ui";
import styles from "./SocialCards.module.css";

/** One small, slightly tilted card per social profile, each with its own colour strip. */
export function SocialCards({ items }: { items: Social[] }) {
  const ui = useUi();
  return (
    <ul className={styles.list} aria-label={ui.socialCardsLabel}>
      {items.map((s, i) => (
        <li key={s.kind} className={styles.item} data-i={i % 3}>
          <a className={styles.card} href={s.url} target="_blank" rel="noreferrer" data-kind={s.kind}>
            <span className={styles.head}>
              <span className={styles.icon} aria-hidden="true">
                <Icon name={s.kind} size={18} />
              </span>
              <span className={styles.text}>
                <span className={styles.label}>{s.label}</span>
                <span className={styles.title}>{ui.socialCards[s.kind].title}</span>
              </span>
            </span>
            <span className={styles.foot}>
              <span className={styles.handle}>
                <Icon name="arrowUpRight" size={14} />
                {s.handle}
              </span>
              <span className={styles.tag}>{ui.socialCards[s.kind].tag}</span>
            </span>
            <span className="visually-hidden"> ({ui.openProfile(s.label)})</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
