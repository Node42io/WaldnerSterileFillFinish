import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { WidgetItemField } from "../WidgetItemField/WidgetItemField";
import styles from "./InfoCard.module.css";

export interface InfoCardAction {
  /** Button label. */
  label: ReactNode;
  /** Trailing icon. */
  icon?: ReactNode;
  onClick?: () => void;
}

export interface InfoCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Badge shown top-left (Badge `color` / `sm`). */
  badge?: ReactNode;
  /** Top-right CTA — rendered as a tertiary `xs` Button. */
  action?: InfoCardAction;
  /** Card title (Aeonik Medium / H5). */
  title: ReactNode;
  /** Title typography: `h5` (default, H5 Medium) or `b2` (B2 Medium). */
  titleVariant?: "h5" | "b2";
  /** Optional field label (rendered via a vertical WidgetItemField). */
  fieldLabel?: string;
  /** Optional field value, paired with `fieldLabel`. */
  fieldValue?: ReactNode;
  /** Optional description text (Aeonik / B2). */
  text?: ReactNode;
  /** Extra content appended inside the card body. */
  children?: ReactNode;
}

export const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(
  (
    { badge, action, title, titleVariant = "h5", fieldLabel, fieldValue, text, children, className, ...rest },
    ref,
  ) => {
    const classes = [styles.card, className ?? ""].filter(Boolean).join(" ");
    const hasField = fieldLabel != null || fieldValue != null;

    return (
      <div ref={ref} className={classes} {...rest}>
        {badge != null || action != null ? (
          <div className={styles.header}>
            {badge != null ? (
              <Badge variant="color" size="sm">
                {badge}
              </Badge>
            ) : (
              <span aria-hidden />
            )}
            {action != null ? (
              <Button
                variant="tertiary"
                size="xs"
                onClick={action.onClick}
                rightIcon={action.icon}
              >
                {action.label}
              </Button>
            ) : null}
          </div>
        ) : null}

        <div className={styles.content}>
          <span
            className={[styles.title, titleVariant === "b2" ? styles["title-b2"] : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {title}
          </span>
          {hasField ? (
            <WidgetItemField variant="vertical" label={fieldLabel}>
              {fieldValue}
            </WidgetItemField>
          ) : null}
          {text != null ? <p className={styles.text}>{text}</p> : null}
          {children}
        </div>
      </div>
    );
  },
);

InfoCard.displayName = "InfoCard";
