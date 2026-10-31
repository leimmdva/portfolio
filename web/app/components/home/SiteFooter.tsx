import { useUi } from "~/i18n/ui";
import styles from "./SiteFooter.module.css";

export function SiteFooter({ name }: { name: string }) {
  const ui = useUi();
  return (
    <footer className={`container ${styles.footer}`}>
      <div className={styles.inner}>
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <p>{ui.footer}</p>
      </div>
    </footer>
  );
}
