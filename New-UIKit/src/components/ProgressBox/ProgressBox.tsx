import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import type { ProgressLevel } from "../ProgressBar/ProgressBar";
import styles from "./ProgressBox.module.css";

export interface ProgressBoxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title shown above the bar (e.g. "PET bottle"). */
  title: ReactNode;
  /** Fill amount, 0–100. */
  value: number;
  /** Colour level — forwarded to ProgressBar (derived from `value` when omitted). */
  level?: ProgressLevel;
  /** Decimal places shown in the % label (default 0). */
  decimals?: number;
}

/**
 * A small bordered card pairing a title with a `ProgressBar` — used to show a
 * labelled metric (e.g. "PET bottle — 40%").
 */
export const ProgressBox = forwardRef<HTMLDivElement, ProgressBoxProps>(
  ({ title, value, level, decimals = 0, className, ...rest }, ref) => {
    const classes = [styles.box, className ?? ""].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <p className={styles.title}>{title}</p>
        <ProgressBar
          value={value}
          level={level}
          decimals={decimals}
          labelPosition="right"
        />
      </div>
    );
  },
);

ProgressBox.displayName = "ProgressBox";
