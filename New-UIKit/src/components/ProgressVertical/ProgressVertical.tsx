import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowCircleDown } from "@phosphor-icons/react";
import styles from "./ProgressVertical.module.css";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export interface ProgressVerticalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Fill amount from the top, 0–100. */
  value: number;
  /** Handle glyph; defaults to an arrow-circle-down. */
  icon?: ReactNode;
  /** Show the circular handle at the progress position (default true). */
  showHandle?: boolean;
}

/**
 * Vertical progress rail: a full-height track with a coloured fill from the
 * top sized to `value` (0–100), and a circular handle marking the current
 * position. The rail stretches to its container's height (set a height on the
 * parent or via `style`).
 */
export const ProgressVertical = forwardRef<HTMLDivElement, ProgressVerticalProps>(
  ({ value, icon, showHandle = true, className, ...rest }, ref) => {
    const pct = clamp(value);

    const classes = [styles.rail, className ?? ""].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="progressbar"
        aria-orientation="vertical"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <div className={styles.track} />
        <div className={styles.fill} style={{ height: `${pct}%` }} />
        {showHandle ? (
          <span
            className={styles.handle}
            style={{ top: `${pct}%` }}
            aria-hidden="true"
          >
            {icon ?? <ArrowCircleDown size={24} weight="regular" />}
          </span>
        ) : null}
      </div>
    );
  },
);

ProgressVertical.displayName = "ProgressVertical";
