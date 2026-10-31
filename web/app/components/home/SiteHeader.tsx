import { useState } from "react";
import { Icon } from "~/components/ui/Icon";
import { ButtonLink } from "~/components/ui/ButtonLink";
import { HOME_PATH, LOCALES, useLocale, useUi } from "~/i18n/ui";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ name, cvUrl }: { name: string; cvUrl: string }) {
  const [open, setOpen] = useState(false);
  const ui = useUi();
  const links = (["work", "experience", "skills", "contact"] as const).map((key) => ({
    href: `#${key}`,
    label: ui.nav[key],
  }));

  return (
    <header className={`container ${styles.header}`}>
      <div className={styles.bar}>
        <a className={styles.logo} href="#top">
          {name}
        </a>

        <nav aria-label={ui.mainNav} className={styles.links}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.right}>
          <LanguageSwitch />
          <ButtonLink variant="ghost" href={cvUrl} download className={styles.cv}>
            {ui.downloadCv}
          </ButtonLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
            <span className="visually-hidden">{open ? ui.closeMenu : ui.openMenu}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label={ui.mobileNav} className={styles.mobileMenu}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <ButtonLink variant="ghost" href={cvUrl} download block>
            {ui.downloadCv} ↓
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}

// Plain links, not client navigation: each language is its own pre-rendered page.
function LanguageSwitch() {
  const locale = useLocale();
  const ui = useUi();
  return (
    <nav aria-label={ui.languageSwitch} className={styles.lang}>
      {LOCALES.map((l, i) => (
        <span key={l}>
          {i > 0 && " / "}
          <a
            href={HOME_PATH[l]}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "page" : undefined}
            aria-label={ui.languageNames[l]}
            className={l === locale ? styles.langActive : undefined}
          >
            {l.toUpperCase()}
          </a>
        </span>
      ))}
    </nav>
  );
}
