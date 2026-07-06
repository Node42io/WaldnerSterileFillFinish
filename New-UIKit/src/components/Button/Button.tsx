import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondary-neutral"
  | "secondary-outline"
  | "tertiary";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconOnly = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      iconOnly ? styles.iconOnly : "",
      fullWidth ? styles.fullWidth : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    if (iconOnly) {
      if (
        import.meta.env?.DEV &&
        !rest["aria-label"] &&
        !rest["aria-labelledby"]
      ) {
        console.warn(
          "Button: `iconOnly` requires an `aria-label` (or `aria-labelledby`).",
        );
      }
      return (
        <button ref={ref} type={type} className={classes} {...rest}>
          <span className={styles.icon}>{leftIcon ?? rightIcon}</span>
        </button>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} {...rest}>
        {leftIcon ? <span className={styles.icon}>{leftIcon}</span> : null}
        {children ? <span className={styles.label}>{children}</span> : null}
        {rightIcon ? <span className={styles.icon}>{rightIcon}</span> : null}
      </button>
    );
  },
);

Button.displayName = "Button";
