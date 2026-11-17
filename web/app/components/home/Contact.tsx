import type { SiteContent } from "~/content/site";
import { ButtonLink } from "~/components/ui/ButtonLink";
import { Socials } from "~/components/ui/Socials";
import { useUi } from "~/i18n/ui";
import styles from "./Contact.module.css";

export function Contact({ site }: { site: SiteContent }) {
  const ui = useUi();
  return (
    <section id="contact" className={`container ${styles.wrap}`} aria-labelledby="contact-title">
      <div className={styles.card} data-reveal>
        {/* The glass sphere from the projects wall. */}
        <span className={styles.sphere} aria-hidden="true">
          <span className={styles.sphereRing} />
          <span className={styles.badge}>{site.name.split(" ")[0].toLowerCase()}</span>
        </span>
        <h2 id="contact-title" className={styles.title}>
          {site.contact.before}
          <em>{site.contact.accent}</em>
        </h2>
        <div className={styles.links}>
          <ButtonLink variant="inverse" href={`mailto:${site.email}`} className={styles.email}>
            {ui.emailMe}
          </ButtonLink>
          <Socials items={site.socials} stacked />
        </div>
      </div>
    </section>
  );
}
