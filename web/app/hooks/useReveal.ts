import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements in as they scroll into view.
 * The hidden state only applies once this has run (html[data-reveal]), so the
 * pre-rendered page stays fully visible without JavaScript or with reduced motion.
 */
export function useReveal() {
  useEffect(() => {
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    for (const el of document.querySelectorAll("[data-reveal]")) observer.observe(el);
    root.setAttribute("data-reveal", "");

    return () => {
      observer.disconnect();
      root.removeAttribute("data-reveal");
    };
  }, []);
}
