import { forwardRef, useContext, useState } from "react";
import type { HTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { CaretDown, CaretUp, SquaresFour } from "@phosphor-icons/react";
import { SidebarContext } from "../Sidebar/SidebarContext";
import styles from "./SidebarItem.module.css";

export interface SidebarItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** Item label. */
  label: string;
  /** Leading glyph; defaults to a grid icon. */
  icon?: ReactNode;
  /** Marks the item as the current selection. */
  selected?: boolean;
  /** Disables the item. */
  disabled?: boolean;
  /**
   * Icon-only rendering (collapsed rail). Falls back to the parent
   * `Sidebar`'s collapsed state when omitted.
   */
  collapsed?: boolean;
  /** Controlled open state — reveals the nested sub-items. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state toggles (only when the item has children). */
  onOpenChange?: (open: boolean) => void;
  /** Fires when the header row is activated. */
  onClick?: () => void;
  /** Nested `SidebarSubItem`s, shown when open. */
  children?: ReactNode;
}

export const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  (
    {
      label,
      icon,
      selected = false,
      disabled = false,
      collapsed: collapsedProp,
      open,
      defaultOpen = false,
      onOpenChange,
      onClick,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const { collapsed: ctxCollapsed } = useContext(SidebarContext);
    const collapsed = collapsedProp ?? ctxCollapsed;

    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    // `selected` and `open` are independent: a selected item can be closed
    // (and vice-versa). Expansion is driven solely by the open state.
    const isOpen = !collapsed && (isControlled ? open : internalOpen);
    const hasChildren = Boolean(children);
    const expandable = !collapsed && hasChildren;

    const setOpen = (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    // Row click only selects/activates the item — it does not force the
    // sub-items open. Expanding/collapsing is the caret's job.
    const handleSelect = () => {
      if (disabled) return;
      onClick?.();
    };

    // The caret is its own control: it toggles the sub-items open/closed
    // without triggering the row's select/navigate action.
    const handleCaretToggle = (event: ReactMouseEvent) => {
      event.stopPropagation();
      if (disabled) return;
      setOpen(!isOpen);
    };

    const classes = [
      styles.root,
      selected ? styles.selected : "",
      isOpen ? styles.open : "",
      collapsed ? styles.collapsed : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const Caret = isOpen ? CaretUp : CaretDown;

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.row}
            disabled={disabled}
            aria-label={collapsed ? label : undefined}
            aria-current={selected ? "page" : undefined}
            onClick={handleSelect}
          >
            <span className={styles.icon} aria-hidden="true">
              {icon ?? <SquaresFour size={16} weight="regular" />}
            </span>
            {!collapsed ? <span className={styles.label}>{label}</span> : null}
          </button>
          {!collapsed && hasChildren ? (
            <button
              type="button"
              className={styles.caret}
              disabled={disabled}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
              aria-expanded={isOpen}
              onClick={handleCaretToggle}
            >
              <Caret size={12} weight="regular" />
            </button>
          ) : null}
        </div>

        {expandable && isOpen ? (
          <div className={styles.sublist} role="group" aria-label={label}>
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);

SidebarItem.displayName = "SidebarItem";
