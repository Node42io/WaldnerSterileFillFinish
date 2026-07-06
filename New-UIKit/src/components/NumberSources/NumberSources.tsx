import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./NumberSources.module.css";

export interface NumberSourcesProps extends HTMLAttributes<HTMLSpanElement> {
  /** Source index, rendered zero-padded in brackets, e.g. 1 → "[01]". */
  index?: number;
  /** Custom content, overrides `index`. */
  children?: ReactNode;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Inline citation marker — the bracketed source number, e.g. `[01]`. */
export const NumberSources = forwardRef<HTMLSpanElement, NumberSourcesProps>(
  ({ index = 1, children, className, ...rest }, ref) => {
    const classes = [styles.number, className ?? ""].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {children ?? `[${pad(index)}]`}
      </span>
    );
  },
);

NumberSources.displayName = "NumberSources";
