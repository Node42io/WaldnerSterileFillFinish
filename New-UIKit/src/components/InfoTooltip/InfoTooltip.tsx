import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info } from "@phosphor-icons/react";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from "./InfoTooltip.module.css";

export interface InfoTooltipProps {
  /** Tooltip content shown on hover/focus. When null, only the icon renders. */
  tooltip?: ReactNode;
  /** Icon pixel size (default 16). */
  size?: number;
  /** Accessible label for the trigger (default "More information"). */
  label?: string;
  /** Optional click handler, in addition to the hover/focus tooltip. */
  onClick?: () => void;
  /** Extra class on the trigger button. */
  className?: string;
  /** Inline style on the trigger button (e.g. to set the icon colour). */
  style?: CSSProperties;
  /** Cap the tooltip bubble width; long text wraps (default 240). */
  maxWidth?: number | string;
}

/**
 * An info icon with a hover/focus tooltip. The bubble is rendered in a portal on
 * `document.body` with fixed positioning, so it escapes any `overflow` clipping
 * from ancestors (tables, scroll containers, cards). Position is recomputed on
 * scroll/resize while open. The icon colour follows `currentColor`.
 */
export function InfoTooltip({
  tooltip,
  size = 16,
  label = "More information",
  onClick,
  className,
  style,
  maxWidth = 240,
}: InfoTooltipProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ left: r.left + r.width / 2, top: r.bottom + 8 });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  return (
    <span className={styles.wrap}>
      <button
        ref={ref}
        type="button"
        className={[styles.trigger, className].filter(Boolean).join(" ")}
        style={style}
        onClick={onClick}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label={label}
      >
        <Info size={size} weight="regular" />
      </button>
      {open && tooltip != null && pos
        ? createPortal(
            <span className={styles.tip} style={{ left: pos.left, top: pos.top }}>
              <Tooltip arrow="top-center" maxWidth={maxWidth}>
                {tooltip}
              </Tooltip>
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}

InfoTooltip.displayName = "InfoTooltip";
