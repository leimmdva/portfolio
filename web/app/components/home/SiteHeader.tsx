import { useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { ButtonLink } from "~/components/ui/ButtonLink";
import styles from "./SiteHeader.module.css";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader({ name, cvUrl }: { name: string; cvUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`container ${styles.header}`}>
      <div className={styles.bar}>
        <a className={styles.logo} href="#top">
          {name}
        </a>

        <nav aria-label="Main" className={styles.links}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <p className={styles.lang}>
            <span className={styles.langActive}>EN</span> / <span title="Turkish version coming soon">TR</span>
          </p>
          <ButtonLink variant="ghost" href={cvUrl} download className={styles.cv}>
            Download CV
          </ButtonLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className={styles.mobileMenu}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <ButtonLink variant="ghost" href={cvUrl} download block>
            Download CV ↓
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}
