import { forwardRef } from "react";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import styles from "./Link.module.css";

export type LinkSize = "sm" | "md" | "lg";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Visual size — sm (12px) · md (14px) · lg (16px). */
  size?: LinkSize;
  /** Underline the label. */
  underline?: boolean;
  /** Persistent "current/selected" emphasis (medium weight, tertiary colour). */
  selected?: boolean;
  /** Disable interaction — non-focusable, no navigation. */
  disabled?: boolean;
  /** Leading icon, sized to match the link. */
  leftIcon?: ReactNode;
  /** Trailing icon, sized to match the link. */
  rightIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * Inline text link with sm/md/lg sizes, optional leading/trailing icons and an
 * underline toggle. `selected` marks the current destination (medium weight,
 * tertiary colour); `disabled` blocks navigation and focus. Hover/focus are
 * handled in CSS to match the Figma states.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      size = "sm",
      underline = false,
      selected = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className,
      children,
      href,
      onClick,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.link,
      styles[`size-${size}`],
      underline ? styles.underline : "",
      selected ? styles.selected : "",
      disabled ? styles.disabled : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <a
        ref={ref}
        className={classes}
        {...rest}
        href={disabled ? undefined : href}
        onClick={handleClick}
        aria-disabled={disabled || undefined}
        aria-current={selected ? "page" : undefined}
        tabIndex={disabled ? -1 : tabIndex}
      >
        {leftIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {children != null ? (
          <span className={styles.label}>{children}</span>
        ) : null}
        {rightIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {rightIcon}
          </span>
        ) : null}
      </a>
    );
  },
);

Link.displayName = "Link";
