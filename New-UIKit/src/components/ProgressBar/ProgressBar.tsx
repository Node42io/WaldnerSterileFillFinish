import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import styles from "./ProgressBar.module.css";

export type ProgressLevel = "low" | "medium" | "high";
export type ProgressBarLabelPosition = "right" | "left" | "top" | "bottom";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** <34 low · 34–66 medium · >66 high (matches the Figma examples 20/40/80). */
export const deriveProgressLevel = (value: number): ProgressLevel => {
  const v = clamp(value);
  if (v < 34) return "low";
  if (v > 66) return "high";
  return "medium";
};

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Fill amount, 0–100. */
  value: number;
  /** Colour level — derived from `value` when omitted. */
  level?: ProgressLevel;
  /** Position of the % label relative to the bar (default "right"). */
  labelPosition?: ProgressBarLabelPosition;
  /** Show the % label (default true). */
  showLabel?: boolean;
  /** Decimal places shown in the label (default 0). */
  decimals?: number;
  /** Stretch the track to fill the container instead of the fixed 92px. */
  fullWidth?: boolean;
}

/**
 * Slim progress/level bar: a rounded track with a coloured fill sized to
 * `value` (0–100). Colour encodes the level (low/error · medium/warning ·
 * high/success); an optional uppercase % label sits on any side.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      level,
      labelPosition = "right",
      showLabel = true,
      decimals = 0,
      fullWidth = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const pct = clamp(value);
    const resolvedLevel = level ?? deriveProgressLevel(value);
    const label = `${pct.toFixed(decimals)}%`;

    const classes = [
      styles.progress,
      styles[`label-${labelPosition}`],
      fullWidth ? styles.fullWidth : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <div className={styles.track}>
          <div
            className={`${styles.fill} ${styles[`level-${resolvedLevel}`]}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {showLabel ? <span className={styles.label}>{label}</span> : null}
      </div>
    );
  },
);

ProgressBar.displayName = "ProgressBar";
