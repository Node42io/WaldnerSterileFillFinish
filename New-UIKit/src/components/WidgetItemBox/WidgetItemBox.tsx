import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { BookOpenText } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import styles from "./WidgetItemBox.module.css";

/**
 * Layout rule — height behaviour:
 * - A single box hugs its content (the slot uses `flex: 1 1 auto`).
 * - Two or more boxes laid out on the same row take the height of the
 *   TALLEST box: place them in a flex row with `align-items: stretch`
 *   (the default), and each shorter box's slot grows to fill the height.
 */
export type WidgetItemBoxVariant = "vertical" | "horizontal";
export type WidgetItemBoxSurface = "default" | "default-2";

export interface WidgetItemBoxAction {
  /** Visible label, e.g. "Glossary Link". */
  label: string;
  /** Click handler. */
  onClick?: () => void;
  /** Leading glyph; defaults to a BookOpenText icon. */
  icon?: ReactNode;
}

export interface WidgetItemBoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Box title — rendered capitalize (Aeonik / label-XS). */
  title: string;
  /** Slot layout direction (Figma `Property 1`). */
  variant?: WidgetItemBoxVariant;
  /**
   * Background surface:
   * - `default-2` — `--surface-default-default-2` (default)
   * - `default`   — `--surface-default-default` (lighter, e.g. nested on a card)
   */
  surface?: WidgetItemBoxSurface;
  /** Show the footer action button (Figma `button`). Defaults to `true`. */
  button?: boolean;
  /** Footer action content; defaults to the "Glossary Link" example. */
  action?: WidgetItemBoxAction;
  /** Box body content, between the title and the footer. */
  children?: ReactNode;
}

const DEFAULT_ACTION: WidgetItemBoxAction = {
  label: "Glossary Link",
};

export const WidgetItemBox = forwardRef<HTMLDivElement, WidgetItemBoxProps>(
  (
    {
      title,
      variant = "vertical",
      surface = "default-2",
      button = true,
      action,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = [styles.box, styles[`surface-${surface}`], className ?? ""]
      .filter(Boolean)
      .join(" ");
    const footer = action ?? DEFAULT_ACTION;

    return (
      <div ref={ref} className={classes} {...rest}>
        <p className={styles.title}>{title}</p>

        <div className={`${styles.slot} ${styles[`variant-${variant}`]}`}>
          {children}
        </div>

        {button ? (
          <div className={styles.footer}>
            <Button
              variant="tertiary"
              size="xs"
              onClick={footer.onClick}
              leftIcon={footer.icon ?? <BookOpenText size={14} weight="regular" />}
            >
              {footer.label}
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);

WidgetItemBox.displayName = "WidgetItemBox";
