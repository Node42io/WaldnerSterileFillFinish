import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import styles from "./SearchBar.module.css";

export interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /**
   * Compact size. `xs` (default) matches the navbar action buttons (24px);
   * `sm` (32px) suits denser toolbars.
   */
  size?: "xs" | "sm";
}

// Icon scales with the box height.
const ICON_SIZE: Record<NonNullable<SearchBarProps["size"]>, number> = {
  xs: 14,
  sm: 16,
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      size = "xs",
      placeholder = "Search",
      "aria-label": ariaLabel = "Search",
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const classes = [styles.box, styles[`size-${size}`], className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={classes}>
        <MagnifyingGlass
          className={styles.icon}
          size={ICON_SIZE[size]}
          weight="light"
          aria-hidden
        />
        <input
          ref={ref}
          id={inputId}
          type="search"
          className={styles.input}
          placeholder={placeholder}
          aria-label={ariaLabel}
          {...rest}
        />
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
