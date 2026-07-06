import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { Divider } from "../Divider/Divider";
import styles from "./SubTaskStep.module.css";

export interface SubTaskStepAction {
  /** Visible label, e.g. "Detailed Analysis". */
  label: string;
  /** Click handler. */
  onClick?: () => void;
  /** Trailing glyph; defaults to an up-right arrow. */
  icon?: ReactNode;
}

export interface SubTaskStepProps extends HTMLAttributes<HTMLElement> {
  /** Card title — H5 Medium (Aeonik). */
  title: string;
  /** Optional header action — rendered as a tertiary Button. */
  action?: SubTaskStepAction;
  /** Eyebrow label above the description (uppercase Aeonik), e.g. "GOAL". */
  label?: string;
  /** Description text under the label; may contain inline links. */
  description?: ReactNode;
  /** Slot content, below the divider. */
  children?: ReactNode;
}

/**
 * A card describing one step of a sub-task: a title with an optional header
 * action, an eyebrow label + description block, a divider, and a slot for
 * arbitrary content below it.
 */
export const SubTaskStep = forwardRef<HTMLElement, SubTaskStepProps>(
  ({ title, action, label, description, children, className, ...rest }, ref) => {
    const titleId = useId();

    const classes = [styles.card, className ?? ""].filter(Boolean).join(" ");

    return (
      <section
        ref={ref}
        className={classes}
        aria-labelledby={titleId}
        {...rest}
      >
        <div className={styles.header}>
          <div className={styles.group}>
            <div className={styles.row}>
              <p id={titleId} className={styles.title}>
                {title}
              </p>
              {action ? (
                <Button
                  variant="tertiary"
                  size="xs"
                  onClick={action.onClick}
                  rightIcon={
                    action.icon ?? <ArrowUpRight size={14} weight="regular" />
                  }
                >
                  {action.label}
                </Button>
              ) : null}
            </div>

            {label || description ? (
              <div className={styles.item}>
                {label ? <p className={styles.label}>{label}</p> : null}
                {description ? (
                  <p className={styles.text}>{description}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <Divider />
        </div>

        <div className={styles.slot}>{children}</div>
      </section>
    );
  },
);

SubTaskStep.displayName = "SubTaskStep";
