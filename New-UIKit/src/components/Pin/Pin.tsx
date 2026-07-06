import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { MapPin } from "@phosphor-icons/react";
import styles from "./Pin.module.css";

export type PinVariant = "default" | "selected" | "group";
export type PinSize = "default" | "small";

export interface PinProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: PinVariant;
  size?: PinSize;
  name?: string;
  address?: ReactNode;
  count?: number;
}

export const Pin = forwardRef<HTMLButtonElement, PinProps>(
  (
    {
      variant = "default",
      size = "default",
      name,
      address,
      count,
      className,
      type = "button",
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.pin,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const computedAriaLabel =
      ariaLabel ??
      (variant === "group"
        ? `${count ?? 0} ${(count ?? 0) === 1 ? "location" : "locations"}`
        : name);

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        aria-label={computedAriaLabel}
        aria-pressed={variant === "selected" ? true : undefined}
        {...rest}
      >
        <span className={styles.marker}>
          <MapPin
            size={size === "small" ? 16 : 24}
            weight="regular"
            aria-hidden="true"
          />
          {variant === "group" ? (
            <span className={styles.count}>{count ?? 0}</span>
          ) : null}
        </span>

        {variant !== "group" ? (
          <span className={styles.label}>
            {name ? <span className={styles.name}>{name}</span> : null}
            {variant === "selected" && address ? (
              <span className={styles.address}>{address}</span>
            ) : null}
          </span>
        ) : null}
      </button>
    );
  },
);

Pin.displayName = "Pin";
