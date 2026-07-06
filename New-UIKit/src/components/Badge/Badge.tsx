import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "warning"
  | "error"
  | "success"
  | "information"
  | "color";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

/** Pixel size of the leading/trailing icons per badge size (from Figma). */
const ICON_SIZE: Record<BadgeSize, number> = {
  xs: 12,
  sm: 16,
  md: 16,
  lg: 24,
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Render a leading status dot. */
  dot?: boolean;
  /** Optional leading icon — sized automatically to match the badge. */
  icon?: ReactNode;
  /** Optional trailing icon — sized automatically to match the badge. */
  trailingIcon?: ReactNode;
  /** When provided, renders a trailing dismiss button wired to this handler. */
  onClose?: () => void;
  /** Accessible label for the dismiss button. */
  closeLabel?: string;
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "neutral",
      size = "sm",
      dot = false,
      icon,
      trailingIcon,
      onClose,
      closeLabel = "Remove",
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.badge,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={classes} {...rest}>
        {dot ? <span className={styles.dot} aria-hidden="true" /> : null}

        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}

        {children != null ? (
          <span className={styles.label}>{children}</span>
        ) : null}

        {trailingIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}

        {onClose ? (
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={closeLabel}
          >
            <X size={ICON_SIZE[size]} weight="regular" aria-hidden="true" />
          </button>
        ) : null}
      </span>
    );
  },
);

Badge.displayName = "Badge";
