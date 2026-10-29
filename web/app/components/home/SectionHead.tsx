import styles from "./SectionHead.module.css";

export function SectionHead({ id, title, label }: { id: string; title: string; label?: string }) {
  return (
    <div className={styles.head}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
}
