import { useEffect, useRef, type ComponentProps } from "react";
import styles from "./BubbleBackground.module.css";

/*
 * Soft, slowly drifting colour bubbles, adapted from the "bubble background"
 * component (animate-ui / shadcn style).
 *
 * The original uses Tailwind, `motion` and inline styles. This site has none of
 * them and its CSP is `style-src 'self'`, which blocks inline <style> tags and
 * style="" attributes in the pre-rendered HTML. So the bubbles are plain CSS
 * keyframes in a CSS module, colours come from CSS variables there, and the
 * pointer-following bubble is moved through the CSSOM (allowed by the CSP).
 */

type BubbleBackgroundProps = ComponentProps<"div"> & {
  /** A sixth bubble softly follows the mouse pointer. */
  interactive?: boolean;
};

export function BubbleBackground({ interactive = false, className, children, ...props }: BubbleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const follower = followerRef.current;
    if (!interactive || !el || !follower || typeof window.matchMedia !== "function") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A small spring: the bubble eases toward the pointer instead of jumping.
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    let frame = 0;

    const step = () => {
      const stiffness = 0.02;
      const damping = 0.82;
      vx = (vx + (targetX - x) * stiffness) * damping;
      vy = (vy + (targetY - y) * stiffness) * damping;
      x += vx;
      y += vy;
      follower.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame =
        Math.abs(vx) + Math.abs(vy) + Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5
          ? requestAnimationFrame(step)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = e.clientX - (rect.left + rect.width / 2);
      targetY = e.clientY - (rect.top + rect.height / 2);
      if (!frame) frame = requestAnimationFrame(step);
    };

    // Listen on the window so text and buttons on top of the background still move it.
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={className ? `${styles.root} ${className}` : styles.root}
      {...props}
    >
      <div className={styles.bubbles} aria-hidden="true">
        <div className={`${styles.bubble} ${styles.first}`} />
        <div className={`${styles.orbit} ${styles.secondOrbit}`}>
          <div className={`${styles.bubble} ${styles.second}`} />
        </div>
        <div className={`${styles.orbit} ${styles.thirdOrbit}`}>
          <div className={`${styles.bubble} ${styles.third}`} />
        </div>
        <div className={`${styles.bubble} ${styles.fourth}`} />
        <div className={`${styles.orbit} ${styles.fifthOrbit}`}>
          <div className={`${styles.bubble} ${styles.fifth}`} />
        </div>
        {interactive && <div ref={followerRef} className={`${styles.bubble} ${styles.sixth}`} />}
      </div>
      {children}
    </div>
  );
}
