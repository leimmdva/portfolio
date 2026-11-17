import type { SiteContent } from "~/content/site";
import { ButtonLink } from "~/components/ui/ButtonLink";
import { SocialCards } from "./SocialCards";
import { useUi } from "~/i18n/ui";
import styles from "./Contact.module.css";

export function Contact({ site }: { site: SiteContent }) {
  const ui = useUi();
  return (
    <section id="contact" className={`container ${styles.wrap}`} aria-labelledby="contact-title">
      <div className={styles.card} data-reveal>
        <h2 id="contact-title" className={styles.title}>
          {site.contact.before}
          <em>{site.contact.accent}</em>
        </h2>
        <div className={styles.links}>
          <ButtonLink variant="inverse" href={`mailto:${site.email}`} className={styles.email}>
            {ui.emailMe}
          </ButtonLink>
        </div>
      </div>
      <SocialCards items={site.socials} />
    </section>
  );
}
