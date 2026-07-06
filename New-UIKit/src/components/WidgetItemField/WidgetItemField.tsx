import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./WidgetItemField.module.css";

export type WidgetItemFieldVariant =
  | "short-title"
  | "long-title"
  | "vertical"
  | "legend"
  | "badge-sx"
  | "badge-dx";

export interface WidgetItemFieldProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Leading label/title text. Styled via `titleAs`. Hidden when `showTitle`
   * is `false` or when empty.
   */
  label?: string;
  /**
   * Whether to render the leading label/title (mirrors Figma's `title` boolean).
   * Defaults to `true`; set `false` to show the value/content alone.
   */
  showTitle?: boolean;
  /**
   * Typographic role of the leading label/title (orthogonal to `variant`):
   * - `label` — Aeonik, capitalize, label-XS, `text-labels` (default).
   * - `title` — Aeonik Medium / label-XS, no transform, `text-headings`.
   */
  titleAs?: "label" | "title";
  /**
   * Layout variant (mirrors Figma "card item - title+text"):
   * - `short-title` — horizontal, 56px label column + value
   * - `long-title`  — horizontal, 116px label column + value
   * - `vertical`    — stacked label/title above value
   * - `legend`      — label/title above a color swatch + value row
   * - `badge-sx`    — label/title above a badge + value row
   * - `badge-dx`    — label/title above a value + badge row
   */
  variant?: WidgetItemFieldVariant;
  /**
   * Swatch color for the `legend` variant. Pass an existing token,
   * e.g. `var(--success-default)`. Defaults to `var(--primary-default)`.
   */
  swatchColor?: string;
  /** Badge content (uppercase pill) for the `badge-sx` / `badge-dx` variants. */
  badge?: ReactNode;
  /** The value/body text (Aeonik / B2). */
  children?: ReactNode;
}

export const WidgetItemField = forwardRef<HTMLDivElement, WidgetItemFieldProps>(
  (
    {
      label,
      showTitle = true,
      variant = "short-title",
      titleAs = "label",
      swatchColor,
      badge,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.field,
      styles[`variant-${variant}`],
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const isLegend = variant === "legend";
    const isBadgeSx = variant === "badge-sx";
    const isBadgeDx = variant === "badge-dx";

    const titleEl =
      showTitle && label != null && label !== "" ? (
        <span
          className={
            titleAs === "title"
              ? `${styles.label} ${styles.title}`
              : styles.label
          }
        >
          {label}
        </span>
      ) : null;

    const badgeEl =
      badge != null ? <span className={styles.badge}>{badge}</span> : null;
    const textEl =
      children != null ? <span className={styles.text}>{children}</span> : null;

    let content: ReactNode = textEl;
    if (isLegend) {
      content = (
        <div className={styles.content}>
          <span
            className={styles.swatch}
            style={swatchColor ? { backgroundColor: swatchColor } : undefined}
            aria-hidden="true"
          />
          {textEl}
        </div>
      );
    } else if (isBadgeSx) {
      content = (
        <div className={styles.content}>
          {badgeEl}
          {textEl}
        </div>
      );
    } else if (isBadgeDx) {
      content = (
        <div className={styles.content}>
          {textEl}
          {badgeEl}
        </div>
      );
    }

    return (
      <div ref={ref} className={classes} {...rest}>
        {titleEl}
        {content}
      </div>
    );
  },
);

WidgetItemField.displayName = "WidgetItemField";
