import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import styles from "./Dot.module.css";

export type DotSize = "sm" | "md" | "lg";

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  size?: DotSize;
}

export const Dot = forwardRef<HTMLSpanElement, DotProps>(
  ({ size = "md", className, ...rest }, ref) => {
    const classes = [styles.dot, styles[`size-${size}`], className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} aria-hidden="true" className={classes} {...rest} />
    );
  },
);

Dot.displayName = "Dot";
