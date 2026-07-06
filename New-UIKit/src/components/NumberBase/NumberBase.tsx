import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./NumberBase.module.css";

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export type NumberBaseUnit = "none" | "euro" | "dollar" | "score";
export type NumberBaseSize = "sm" | "md" | "lg" | "xl";

export interface NumberBaseProps extends HTMLAttributes<HTMLDivElement> {
  /** The numeric value — the large figure (Aeonik). */
  children: ReactNode;
  /**
   * Unit shown after the value (mirrors Figma "Type"):
   * - `none`   — value only
   * - `euro`   — trailing "€"
   * - `dollar` — trailing "$"
   * - `score`  — trailing "/{max}"
   */
  unit?: NumberBaseUnit;
  /** Denominator for `unit="score"`, rendered as `/{max}`. */
  max?: ReactNode;
  /**
   * Typographic size (mirrors Figma "size"):
   * - `sm` — B1 Regular · unit label-XS
   * - `md` — H4 Medium · unit label-M
   * - `lg` — H2 Medium · unit label-L
   * - `xl` — H1-S Medium · unit label-L (Figma "lxl", default)
   */
  size?: NumberBaseSize;
}

export const NumberBase = forwardRef<HTMLDivElement, NumberBaseProps>(
  ({ children, unit = "none", max, size = "xl", className, ...rest }, ref) => {
    let suffix: ReactNode = null;
    if (unit === "euro") suffix = "€";
    else if (unit === "dollar") suffix = "$";
    else if (unit === "score") suffix = <>/{max}</>;

    return (
      <div
        ref={ref}
        className={cx(styles.base, styles[`size-${size}`], className)}
        {...rest}
      >
        <span className={styles.value}>{children}</span>
        {suffix != null && <span className={styles.unit}>{suffix}</span>}
      </div>
    );
  },
);

NumberBase.displayName = "NumberBase";
