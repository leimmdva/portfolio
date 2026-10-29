import styles from "./StatusPill.module.css";

export function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.pill}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </p>
  );
}
