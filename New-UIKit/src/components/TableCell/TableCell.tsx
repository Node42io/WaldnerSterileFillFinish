import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./TableCell.module.css";

export type TableCellVariant = "dark" | "light";

export type TableCellOrientation = "vertical" | "horizontal";

export interface TableCellProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Surface shade (mirrors Figma "dark" / "light"):
   * - `dark`  — surface/default/default-3 (#e5e5e3)
   * - `light` — surface/default/default-2 (#f0f0f0)
   */
  variant?: TableCellVariant;
  /**
   * Badge-group layout (mirrors Figma "-vertical" / "-horizontal"):
   * - `vertical`   — badges stacked in a column
   * - `horizontal` — badges in a wrapping row
   */
  orientation?: TableCellOrientation;
  /** Uppercase label above the cell (Aeonik / label-S). */
  title?: ReactNode;
  /** Primary value text (Aeonik Medium / B1). */
  mainText?: ReactNode;
  /** Score value (Aeonik Medium / H5). */
  score?: ReactNode;
  /** Score maximum — rendered as `/{scoreMax}` (Aeonik / label-XS). */
  scoreMax?: ReactNode;
  /** Badge group (e.g. `<Badge>` elements). */
  badges?: ReactNode;
  /** Secondary description (Aeonik / B3). */
  description?: ReactNode;
}

export const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  (
    {
      variant = "dark",
      orientation = "vertical",
      title,
      mainText,
      score,
      scoreMax,
      badges,
      description,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = [styles.cell, styles[`variant-${variant}`], className ?? ""]
      .filter(Boolean)
      .join(" ");

    const badgeClasses = [styles.badges, styles[`badges-${orientation}`]].join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {title != null ? <span className={styles.title}>{title}</span> : null}
        {mainText != null ? (
          <span className={styles.main}>{mainText}</span>
        ) : null}
        {score != null ? (
          <span className={styles.score}>
            <span className={styles.value}>{score}</span>
            {scoreMax != null ? (
              <span className={styles.max}>/{scoreMax}</span>
            ) : null}
          </span>
        ) : null}
        {badges != null ? <div className={badgeClasses}>{badges}</div> : null}
        {description != null ? (
          <span className={styles.description}>{description}</span>
        ) : null}
      </div>
    );
  },
);

TableCell.displayName = "TableCell";
