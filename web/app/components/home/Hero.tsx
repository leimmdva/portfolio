import type { SiteContent } from "~/content/site";
import { ButtonLink } from "~/components/ui/ButtonLink";
import { Socials } from "~/components/ui/Socials";
import { useUi } from "~/i18n/ui";
import styles from "./Hero.module.css";

export function Hero({ site }: { site: SiteContent }) {
  const { headline } = site;
  const ui = useUi();
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <div className={styles.top}>
          <div className={`${styles.portrait} ${styles.avatar}`} aria-hidden="true" />
        </div>
        <h1 id="hero-title" className={styles.title}>
          {headline.before}
          <em>{headline.accent}</em>
          {headline.after}
        </h1>
        <p className={styles.lead}>{site.lead}</p>
        <div className={styles.ctas}>
          <ButtonLink href="#work">{ui.seeWork}</ButtonLink>
          <ButtonLink variant="ghost" href={site.cvUrl} download>
            {ui.downloadCv} ↓
          </ButtonLink>
        </div>
        <Socials items={site.socials} />
      </div>
      <div className={`${styles.portrait} ${styles.photo}`} aria-hidden="true" />
    </section>
  );
}
