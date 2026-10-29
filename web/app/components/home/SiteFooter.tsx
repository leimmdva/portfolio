import styles from "./SiteFooter.module.css";

export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className={`container ${styles.footer}`}>
      <div className={styles.inner}>
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <p>Built with React · Designed in Figma</p>
      </div>
    </footer>
  );
}
