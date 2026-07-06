import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./SidebarSubItem.module.css";

export interface SidebarSubItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Item label. */
  children: ReactNode;
  /** Marks the item as the current selection. */
  selected?: boolean;
  /** Disables the item. */
  disabled?: boolean;
}

/**
 * Sidebar sub-item — a single nested navigation row.
 *
 * Figma models five variants; here `Default`/`selected`/`disabled` are props
 * while `hover` and `focused` are the native `:hover` / `:focus-visible`
 * states (the focus pill is rendered by CSS).
 */
export const SidebarSubItem = forwardRef<
  HTMLButtonElement,
  SidebarSubItemProps
>(
  (
    { children, selected = false, disabled = false, className, type = "button", ...rest },
    ref,
  ) => {
    const classes = [
      styles.item,
      selected ? styles.selected : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        aria-current={selected ? "page" : undefined}
        {...rest}
      >
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);

SidebarSubItem.displayName = "SidebarSubItem";
