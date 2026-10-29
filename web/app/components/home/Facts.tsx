import type { SiteContent } from "~/content/site";
import styles from "./Facts.module.css";

export function Facts({ facts }: { facts: SiteContent["facts"] }) {
  return (
    <div className="container">
      <dl className={styles.facts}>
        {facts.map((f) => (
          <div key={f.label} className={styles.fact}>
            <dt className={styles.label}>{f.label}</dt>
            <dd className={styles.value}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
