import { cloneElement, forwardRef, isValidElement } from "react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import type { BadgeSize } from "../Badge/Badge";
import styles from "./ContentCard.module.css";

export type ContentCardVariant = "horizontal" | "vertical";
export type ContentCardSize = "sm" | "md" | "lg";

/** Badge size paired with each card size (Figma label scale: M / S / XS). */
const BADGE_SIZE: Record<ContentCardSize, BadgeSize> = {
  lg: "md",
  md: "sm",
  sm: "xs",
};

export interface ContentCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout (Figma `Property 1`). Horizontal is a pill; vertical is a rounded box. */
  variant?: ContentCardVariant;
  /** Size (Figma `size`). Scales padding, gaps, type, icon and badges. */
  size?: ContentCardSize;
  /** Main text (Aeonik Medium — B1/B2/B3 per size). */
  children?: ReactNode;
  /** Leading icon, rendered before the text. */
  icon?: ReactNode;
  /** Start badge (e.g. a `<Badge>`), rendered before the icon. */
  badge?: ReactNode;
  /** End badge — horizontal layout only, rendered after the text. */
  badgeEnd?: ReactNode;
  /** Show the trailing action button (Figma `button`). Defaults to `true`. */
  button?: boolean;
  /** Click handler for the action button. */
  onButtonClick?: () => void;
  /** Accessible label for the action button. */
  buttonLabel?: string;
}

export const ContentCard = forwardRef<HTMLDivElement, ContentCardProps>(
  (
    {
      variant = "horizontal",
      size = "lg",
      children,
      icon,
      badge,
      badgeEnd,
      button = true,
      onButtonClick,
      buttonLabel = "Open",
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = [styles.card, styles[variant], styles[`size-${size}`], className ?? ""]
      .filter(Boolean)
      .join(" ");

    // Pair a bare <Badge> with the card size, but respect an explicit size.
    const sizeBadge = (node: ReactNode): ReactNode =>
      isValidElement(node) &&
      node.type === Badge &&
      (node.props as { size?: BadgeSize }).size == null
        ? cloneElement(node as ReactElement<{ size?: BadgeSize }>, {
            size: BADGE_SIZE[size],
          })
        : node;

    const iconNode = icon ? (
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    ) : null;

    const text =
      children != null ? <span className={styles.text}>{children}</span> : null;

    const actionButton = button ? (
      <Button
        iconOnly
        variant={size === "sm" ? "tertiary" : "secondary-outline"}
        size="xs"
        className={styles.action}
        leftIcon={<ArrowSquareOut size={14} weight="regular" />}
        aria-label={buttonLabel}
        onClick={onButtonClick}
      />
    ) : null;

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className={styles.group}>
          {sizeBadge(badge)}
          {variant === "horizontal" ? (
            <>
              {iconNode}
              {text}
              {sizeBadge(badgeEnd)}
            </>
          ) : (
            <div className={styles.iconText}>
              {iconNode}
              {text}
            </div>
          )}
        </div>

        {variant === "horizontal"
          ? actionButton
          : button && <div className={styles.footer}>{actionButton}</div>}
      </div>
    );
  },
);

ContentCard.displayName = "ContentCard";
