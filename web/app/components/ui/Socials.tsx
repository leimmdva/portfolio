import type { Social } from "~/content/site";
import { Icon } from "./Icon";
import styles from "./Socials.module.css";

export function Socials({ items, stacked = false }: { items: Social[]; stacked?: boolean }) {
  return (
    <ul className={stacked ? `${styles.list} ${styles.stacked}` : styles.list}>
      {items.map((s) => (
        <li key={s.kind}>
          <a className={styles.link} href={s.url} target="_blank" rel="noreferrer">
            <Icon name={s.kind} />
            <span className={styles.label}>{s.label}</span>
            <span className={styles.handle}>{s.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
