import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import styles from "./Sources.module.css";

export interface SourcesProps extends HTMLAttributes<HTMLDivElement> {
  /** Source index, rendered zero-padded, e.g. 1 → "01". */
  index?: number;
  /** Link target. */
  href?: string;
  /** Link text (default "Link"). */
  linkText?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Source row — index + separator dot + external link. */
export const Sources = forwardRef<HTMLDivElement, SourcesProps>(
  ({ index = 1, href, linkText = "Link", className, ...rest }, ref) => {
    const classes = [styles.sources, className ?? ""].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <span className={styles.number}>{pad(index)}</span>
        <span className={styles.dot} aria-hidden="true" />
        <a className={styles.link} href={href}>
          <span className={styles["link-label"]}>{linkText}</span>
          <ArrowSquareOut
            className={styles["link-icon"]}
            size={14}
            weight="regular"
            aria-hidden="true"
          />
        </a>
      </div>
    );
  },
);

Sources.displayName = "Sources";
