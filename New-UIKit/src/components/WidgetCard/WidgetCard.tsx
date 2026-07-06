import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import styles from "./WidgetCard.module.css";

export interface WidgetCardAction {
  /** Visible label, e.g. "Full Glossary". */
  label: string;
  /** Click handler. */
  onClick?: () => void;
  /** Trailing glyph; defaults to an up-right arrow. */
  icon?: ReactNode;
}

export interface WidgetCardProps extends HTMLAttributes<HTMLElement> {
  /** Card title — rendered uppercase (Aeonik / label-M). */
  title: string;
  /** Optional leading glyph, wrapped in the rounded chip. */
  icon?: ReactNode;
  /** Optional subtitle under the title. */
  description?: ReactNode;
  /** Optional footer action — rendered as a tertiary Button. */
  action?: WidgetCardAction;
  /**
   * Number of grid columns the card spans when it is a direct child of a
   * 12-column CSS grid. Clamped to 2–12. Emits `grid-column: span N`;
   * the card stays fluid (`width: 100%`) otherwise.
   */
  span?: number;
  /** Card body content, between the header and the footer. */
  children?: ReactNode;
}

/** Min 2 columns, max 12 — the grid only ever holds whole columns. */
const clampSpan = (n: number) => Math.min(12, Math.max(2, Math.round(n)));

export const WidgetCard = forwardRef<HTMLElement, WidgetCardProps>(
  (
    { title, icon, description, action, children, className, span, style, ...rest },
    ref,
  ) => {
    const titleId = useId();

    const classes = [styles.card, className ?? ""].filter(Boolean).join(" ");

    const mergedStyle =
      span != null
        ? { gridColumn: `span ${clampSpan(span)}`, ...style }
        : style;

    return (
      <section
        ref={ref}
        className={classes}
        style={mergedStyle}
        aria-labelledby={titleId}
        {...rest}
      >
        <div className={styles.header}>
          {icon ? (
            <span className={styles.chip} aria-hidden="true">
              {icon}
            </span>
          ) : null}
          <div className={styles.titleBlock}>
            <p id={titleId} className={styles.title}>
              {title}
            </p>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
        </div>

        <div className={styles.contents}>{children}</div>

        {action ? (
          <Button
            variant="tertiary"
            size="xs"
            onClick={action.onClick}
            rightIcon={
              action.icon ?? <ArrowUpRight size={14} weight="regular" />
            }
          >
            {action.label}
          </Button>
        ) : null}
      </section>
    );
  },
);

WidgetCard.displayName = "WidgetCard";
