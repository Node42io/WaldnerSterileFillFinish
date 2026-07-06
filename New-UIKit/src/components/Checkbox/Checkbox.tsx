import { forwardRef, useEffect, useId, useRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Visible label shown beside the box. Omit for a standalone box (pass `aria-label`). */
  label?: ReactNode;
  /**
   * Indeterminate ("mixed") state — visually a dash instead of a check.
   * Reflected on the native input via the DOM `indeterminate` property.
   */
  indeterminate?: boolean;
}

/** 16×16 stroke check — inherits `currentColor`. */
const CheckMark = () => (
  <svg
    className={styles.mark}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3.5 8.5L6.5 11.5L12.5 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 16×16 dash for the indeterminate state. */
const DashMark = () => (
  <svg
    className={styles.mark}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M4 8H12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, indeterminate = false, id, className, disabled, ...rest },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const innerRef = useRef<HTMLInputElement | null>(null);

    // `indeterminate` is a DOM-only property — it can't be set as an attribute.
    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    const rootClasses = [styles.root, disabled ? styles.disabled : ""]
      .filter(Boolean)
      .join(" ");

    return (
      <label htmlFor={inputId} className={rootClasses}>
        <span className={styles.control}>
          <input
            ref={setRef}
            id={inputId}
            type="checkbox"
            className={styles.input}
            disabled={disabled}
            aria-checked={indeterminate ? "mixed" : undefined}
            {...rest}
          />
          <span className={styles.box} aria-hidden="true">
            {indeterminate ? <DashMark /> : <CheckMark />}
          </span>
        </span>
        {label != null ? (
          <span className={[styles.label, className ?? ""].filter(Boolean).join(" ")}>
            {label}
          </span>
        ) : null}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
