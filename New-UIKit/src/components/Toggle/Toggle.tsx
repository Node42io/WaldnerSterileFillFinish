import { forwardRef, useId, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import styles from "./Toggle.module.css";

export interface ToggleOption {
  /** Unique value identifying the option. */
  value: string;
  /** Optional icon shown inside the box. */
  icon?: ReactNode;
  /** Optional text label (shown beside the icon). */
  label?: ReactNode;
  /** Accessible name — required when the option has no visible `label`. */
  "aria-label"?: string;
  /** Disable just this option. */
  disabled?: boolean;
}

export interface ToggleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Two or more options. Each box can show an icon, a label, or both. */
  options: ToggleOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value (defaults to the first enabled option). */
  defaultValue?: string;
  /** Fired with the newly-selected value. */
  onChange?: (value: string) => void;
}

export const Toggle = forwardRef<HTMLDivElement, ToggleProps>(
  ({ options, value, defaultValue, onChange, className, ...rest }, ref) => {
    const groupId = useId();
    const isControlled = value !== undefined;
    const firstEnabled = options.find((o) => !o.disabled)?.value;
    const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
    const selected = isControlled ? value : internal;

    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const focusIndex = (() => {
      const sel = options.findIndex((o) => o.value === selected && !o.disabled);
      return sel >= 0 ? sel : options.findIndex((o) => !o.disabled);
    })();

    /** Next enabled index from `from` walking `dir` (±1), wrapping around. */
    const move = (from: number, dir: number) => {
      const n = options.length;
      let j = from;
      for (let step = 0; step < n; step++) {
        j = (j + dir + n) % n;
        if (!options[j].disabled) return j;
      }
      return from;
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      let target = -1;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          target = move(focusIndex, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          target = move(focusIndex, -1);
          break;
        case "Home":
          target = move(-1, 1);
          break;
        case "End":
          target = move(0, -1);
          break;
        default:
          return;
      }
      e.preventDefault();
      if (target < 0) return;
      itemRefs.current[target]?.focus();
      select(options[target].value);
    };

    const classes = [styles.group, className ?? ""].filter(Boolean).join(" ");

    return (
      <div ref={ref} role="radiogroup" className={classes} onKeyDown={onKeyDown} {...rest}>
        {options.map((option, i) => {
          const isSelected = option.value === selected;
          const itemClasses = [styles.item, isSelected ? styles.selected : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={option.value}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              id={`${groupId}-${option.value}`}
              aria-checked={isSelected}
              aria-label={option["aria-label"]}
              tabIndex={i === focusIndex ? 0 : -1}
              disabled={option.disabled}
              className={itemClasses}
              onClick={() => select(option.value)}
            >
              {option.icon != null ? (
                <span
                  className={styles.icon}
                  aria-hidden={option.label != null ? "true" : undefined}
                >
                  {option.icon}
                </span>
              ) : null}
              {option.label != null ? (
                <span className={styles.label}>{option.label}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  },
);

Toggle.displayName = "Toggle";
