import { forwardRef } from "react";
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import { X } from "@phosphor-icons/react";
import styles from "./Tab.module.css";

export type TabKind = "horizontal" | "vertical";
export type TabSize = "sm" | "md" | "lg";

export interface TabProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  kind?: TabKind;
  size?: TabSize;
  selected?: boolean;
  disabled?: boolean;
  truncated?: boolean;
  prefixIcon?: ReactNode;
  showBadge?: boolean;
  closable?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  children: ReactNode;
}

const ICON_SIZE_BY_TAB_SIZE: Record<TabSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export const Tab = forwardRef<HTMLDivElement, TabProps>(
  (
    {
      kind = "horizontal",
      size = "md",
      selected = false,
      disabled = false,
      truncated = false,
      prefixIcon,
      showBadge = false,
      closable = false,
      onClose,
      onClick,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const iconSize = ICON_SIZE_BY_TAB_SIZE[size];

    const classes = [
      styles.tab,
      styles[`kind-${kind}`],
      styles[`size-${size}`],
      selected ? styles.selected : "",
      disabled ? styles.disabled : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = () => {
      if (disabled) return;
      onClick?.();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick?.();
      }
    };

    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClose?.();
    };

    return (
      <div
        ref={ref}
        role="tab"
        tabIndex={disabled ? -1 : 0}
        aria-selected={selected}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={classes}
        {...rest}
      >
        {prefixIcon ? (
          <span className={styles.prefix} aria-hidden="true">
            {prefixIcon}
          </span>
        ) : null}

        <span
          className={[styles.label, truncated ? styles.truncated : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </span>

        {showBadge ? (
          <span className={styles.badge} aria-hidden="true" />
        ) : null}

        {closable ? (
          <button
            type="button"
            aria-label="Close"
            disabled={disabled}
            onClick={handleClose}
            className={styles.close}
          >
            <X size={iconSize} weight="light" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  },
);

Tab.displayName = "Tab";
