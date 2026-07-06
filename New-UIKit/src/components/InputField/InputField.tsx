import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./InputField.module.css";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Uppercase field label (Aeonik / label-M). */
  label?: ReactNode;
  /** Leading slot — icon, dropdown, or text prefix. */
  leading?: ReactNode;
  /** Trailing slot — e.g. a help icon or a dropdown. */
  trailing?: ReactNode;
  /** Helper text under the field (Aeonik / B3). */
  hint?: ReactNode;
  /**
   * Error state. Pass `true` for destructive styling only, or a node to also
   * render it as the message (in place of the hint).
   */
  error?: boolean | ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, leading, trailing, hint, error, id, className, disabled, ...rest },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const messageId = `${inputId}-message`;

    const isError = error != null && error !== false;
    const errorNode = typeof error === "boolean" ? null : error;
    const message = errorNode ?? hint;

    const boxClasses = [
      styles.box,
      isError ? styles["box-error"] : "",
      disabled ? styles["box-disabled"] : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={[styles.field, className ?? ""].filter(Boolean).join(" ")}>
        {label != null ? (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        ) : null}

        <div className={boxClasses}>
          {leading != null ? (
            <span className={styles.leading}>{leading}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={message != null ? messageId : undefined}
            {...rest}
          />
          {trailing != null ? (
            <span className={styles.trailing}>{trailing}</span>
          ) : null}
        </div>

        {message != null ? (
          <p id={messageId} className={errorNode != null ? styles.error : styles.hint}>
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);

InputField.displayName = "InputField";
