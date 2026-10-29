import styles from "./ButtonLink.module.css";

type Variant = "primary" | "ghost" | "inverse";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  block?: boolean;
}

export function ButtonLink({ variant = "primary", block = false, className, ...props }: Props) {
  const classes = [styles.button, styles[variant], block && styles.block, className].filter(Boolean).join(" ");
  return <a className={classes} {...props} />;
}
