import { useEffect, useRef } from "react";
import type { SiteContent } from "~/content/site";
import { SocialCards, type ContactCard } from "./SocialCards";
import { useUi } from "~/i18n/ui";
import styles from "./Contact.module.css";

/** Moves the heading a few pixels towards the pointer, easing in very slowly. Mouse only, never with reduced motion. */
function useSlowFollow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window.matchMedia !== "function") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const MAX = 10; // px at the far edge of the screen
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * 0.025;
      y += (ty - y) * 0.025;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${(x * 0.06).toFixed(3)}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.02 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2 * MAX;
      ty = (e.clientY / window.innerHeight - 0.5) * 2 * MAX * 0.6;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, []);
  return ref;
}

export function Contact({ site }: { site: SiteContent }) {
  const ui = useUi();
  const titleRef = useSlowFollow<HTMLHeadingElement>();
  const cards: ContactCard[] = [
    {
      kind: "email",
      icon: "mail",
      label: ui.contactEmail,
      handle: site.email,
      url: `mailto:${site.email}`,
      hint: ui.emailMe,
    },
    ...site.socials.map((s) => ({
      kind: s.kind,
      icon: s.kind,
      label: s.label,
      handle: s.handle,
      url: s.url,
      hint: ui.openProfile(s.label),
      external: true,
    })),
  ];
  return (
    <section id="contact" className={`container ${styles.wrap}`} aria-labelledby="contact-title">
      <div className={styles.heading} data-reveal>
        <h2 id="contact-title" ref={titleRef} className={styles.title}>
          {site.contact.before}
          <em>{site.contact.accent}</em>
        </h2>
      </div>
      <SocialCards items={cards} />
    </section>
  );
}
