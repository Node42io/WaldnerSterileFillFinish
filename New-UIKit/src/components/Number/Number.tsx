import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { NumberBase } from "../NumberBase/NumberBase";
import type { NumberBaseUnit, NumberBaseSize } from "../NumberBase/NumberBase";
import styles from "./Number.module.css";

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export type NumberType = "colored-full" | "colored-angle" | "badge";
export type NumberColor = "blue" | "yellow" | "neutral" | "none";

export interface NumberProps extends HTMLAttributes<HTMLDivElement> {
  /** The numeric value — forwarded to the inner NumberBase. */
  children: ReactNode;
  /** Unit shown after the value (see NumberBase). */
  unit?: NumberBaseUnit;
  /** Denominator for `unit="score"`. */
  max?: ReactNode;
  /** Typographic size — forwarded to the inner NumberBase (default `xl`). */
  numberSize?: NumberBaseSize;
  /**
   * Container shape (mirrors Figma "type"):
   * - `colored-full`  — pill (fully rounded)
   * - `colored-angle` — softly rounded (radius-lg)
   * - `badge`         — stacked: a badge above the value
   */
  type?: NumberType;
  /**
   * Background tint (mirrors Figma "color"):
   * - `blue` · `yellow` · `neutral` — tinted surface
   * - `none` — no background (valid with `colored-full`)
   */
  color?: NumberColor;
  /** Badge node shown above the value when `type="badge"`. */
  badge?: ReactNode;
}

export const Number = forwardRef<HTMLDivElement, NumberProps>(
  (
    {
      children,
      unit,
      max,
      numberSize,
      type = "colored-full",
      color = "none",
      badge,
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cx(
        styles.number,
        styles[`type-${type}`],
        styles[`color-${color}`],
        className,
      )}
      {...rest}
    >
      {type === "badge" && badge}
      <NumberBase unit={unit} max={max} size={numberSize}>
        {children}
      </NumberBase>
    </div>
  ),
);

Number.displayName = "Number";
