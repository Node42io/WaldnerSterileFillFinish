import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Tooltip.module.css";

export type TooltipArrow =
  | "none"
  | "top-center"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Simple body text (used when neither `title` nor `description` is set). */
  children?: ReactNode;
  /** Arrow position relative to the bubble (default "none"). */
  arrow?: TooltipArrow;
  /** Rich variant heading (Aeonik Medium). */
  title?: ReactNode;
  /** Rich variant description (Aeonik Regular, muted). */
  description?: ReactNode;
  /** Optional action slot under the rich text (e.g. a tertiary `Button`). */
  action?: ReactNode;
  /** Cap the bubble width; long simple text wraps instead of staying on one line. */
  maxWidth?: number | string;
}

/**
 * Presentational tooltip bubble: a simple centred label, or a rich variant with
 * a heading, description and an optional action. A directional arrow can be
 * attached to any edge via `arrow`. Positioning relative to a trigger is left to
 * the consumer.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { children, arrow = "none", title, description, action, maxWidth, className, style, ...rest },
    ref,
  ) => {
    const isRich = title != null || description != null;
    const classes = [
      styles.tooltip,
      isRich ? styles.rich : "",
      styles[`arrow-${arrow}`],
      maxWidth != null ? styles["wrap-text"] : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="tooltip"
        className={classes}
        style={maxWidth != null ? { maxWidth, ...style } : style}
        {...rest}
      >
        {isRich ? (
          <div className={styles.content}>
            <div className={styles.text}>
              {title != null ? <p className={styles.title}>{title}</p> : null}
              {description != null ? (
                <p className={styles.description}>{description}</p>
              ) : null}
            </div>
            {action != null ? (
              <div className={styles.action}>{action}</div>
            ) : null}
          </div>
        ) : (
          <p className={styles.body}>{children}</p>
        )}

        {arrow !== "none" ? (
          <span className={styles.arrow} aria-hidden="true" />
        ) : null}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
