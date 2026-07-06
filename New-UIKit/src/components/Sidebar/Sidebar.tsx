import { forwardRef, useMemo, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { SidebarSimple } from "@phosphor-icons/react";
import { SidebarContext } from "./SidebarContext";
import styles from "./Sidebar.module.css";

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Controlled collapsed state — icon-only rail when true. */
  collapsed?: boolean;
  /** Initial collapsed state when uncontrolled. */
  defaultCollapsed?: boolean;
  /** Called when the collapse toggle is pressed. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible name for the navigation landmark. */
  "aria-label"?: string;
  /** Brand/logo shown in the header, to the left of the collapse toggle. */
  brand?: ReactNode;
  /** Compact brand shown when collapsed (e.g. `<Logo symbol />`). Falls back to hiding the brand when omitted. */
  brandCollapsed?: ReactNode;
  /** `SidebarItem`s. */
  children?: ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      collapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      "aria-label": ariaLabel = "Main",
      brand,
      brandCollapsed,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = collapsed !== undefined;
    const [internalCollapsed, setInternalCollapsed] =
      useState(defaultCollapsed);
    const isCollapsed = isControlled ? collapsed : internalCollapsed;

    const toggle = () => {
      const next = !isCollapsed;
      if (!isControlled) setInternalCollapsed(next);
      onCollapsedChange?.(next);
    };

    const ctx = useMemo(() => ({ collapsed: isCollapsed }), [isCollapsed]);

    const classes = [
      styles.sidebar,
      isCollapsed ? styles.collapsed : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <SidebarContext.Provider value={ctx}>
        <nav ref={ref} className={classes} aria-label={ariaLabel} {...rest}>
          <div className={styles.header}>
            {(isCollapsed ? brandCollapsed : brand) != null ? (
              <div className={styles.brand}>
                {isCollapsed ? brandCollapsed : brand}
              </div>
            ) : null}
            <button
              type="button"
              className={styles.toggle}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!isCollapsed}
              onClick={toggle}
            >
              <SidebarSimple size={16} weight="regular" aria-hidden="true" />
            </button>
          </div>

          <div className={styles.list}>{children}</div>
        </nav>
      </SidebarContext.Provider>
    );
  },
);

Sidebar.displayName = "Sidebar";
