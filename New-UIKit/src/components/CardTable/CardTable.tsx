import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./CardTable.module.css";

/** Left-column width relative to the card (Figma "x/5" variants). */
export type CardTableRatio = "1/5" | "2/5" | "3/5" | "4/5";

export interface CardTableProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Card title (Aeonik Medium / H5). */
  title: ReactNode;
  /** Optional description under the title (Aeonik / B2). */
  description?: ReactNode;
  /** Label above the badge group — uppercase (Aeonik / label-S). */
  badgeLabel?: ReactNode;
  /** Badge group content, e.g. `<Badge>` elements; wrapped and spaced. */
  badges?: ReactNode;
  /**
   * Left-column width preset (Figma "x/5"): `1/5`=200, `2/5`=440, `3/5`=680,
   * `4/5`=908 px. The slot fills the remaining width. Defaults to `3/5`.
   */
  ratio?: CardTableRatio;
  /**
   * Explicit left-column width, overriding `ratio`. Pass a number (px) or any
   * CSS length.
   */
  mainWidth?: number | string;
  /** Right-hand slot content, e.g. a table. */
  children?: ReactNode;
}

const RATIO_CLASS: Record<CardTableRatio, string> = {
  "1/5": "main-1-5",
  "2/5": "main-2-5",
  "3/5": "main-3-5",
  "4/5": "main-4-5",
};

export const CardTable = forwardRef<HTMLElement, CardTableProps>(
  (
    {
      title,
      description,
      badgeLabel,
      badges,
      ratio = "3/5",
      mainWidth,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const titleId = useId();

    const classes = [styles.card, className ?? ""].filter(Boolean).join(" ");
    const hasBadgeInfo = badges != null || badgeLabel != null;

    // `mainWidth` wins over `ratio`; otherwise the ratio preset class sets the width.
    const mainClasses = [styles.main, mainWidth == null ? styles[RATIO_CLASS[ratio]] : ""]
      .filter(Boolean)
      .join(" ");
    const mainStyle =
      mainWidth != null
        ? { width: typeof mainWidth === "number" ? `${mainWidth}px` : mainWidth }
        : undefined;

    return (
      <section ref={ref} className={classes} aria-labelledby={titleId} {...rest}>
        <div className={mainClasses} style={mainStyle}>
          <div className={styles.header}>
            <p id={titleId} className={styles.title}>
              {title}
            </p>
            {description != null ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>

          {hasBadgeInfo ? (
            <div className={styles.info}>
              {badgeLabel != null ? (
                <span className={styles.label}>{badgeLabel}</span>
              ) : null}
              {badges != null ? (
                <div className={styles.badges}>{badges}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        {children != null ? <div className={styles.slot}>{children}</div> : null}
      </section>
    );
  },
);

CardTable.displayName = "CardTable";
