import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import styles from "./Divider.module.css";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Line orientation (default "horizontal"). Vertical stretches to its row. */
  orientation?: "horizontal" | "vertical";
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", className, ...rest }, ref) => {
    const classes = [styles.divider, styles[orientation], className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        {...rest}
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={classes}
      />
    );
  },
);

Divider.displayName = "Divider";
