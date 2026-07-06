import { createElement, forwardRef } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "page-title"
  | "page-chapter"
  | "h3"
  | "h4"
  | "h5"
  | "b1"
  | "b2"
  | "b3"
  | "label-l"
  | "label-m"
  | "label-s"
  | "label-xs";

export type TextWeight = "regular" | "medium";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /**
   * Typographic role, mapped to the design tokens:
   * - `page-title`   — page heading (Aeonik / H2 Medium, text-headings → h1)
   * - `page-chapter` — section / chapter subtitle (Aeonik / H5 Medium → h2)
   * - `h3` / `h4` / `h5` — heading scale (Aeonik Medium, text-headings)
   * - `b1` / `b2` / `b3` — body scale (Aeonik Regular, text-body)
   * - `label-l/m/s/xs` — capitalized labels (Aeonik, text-labels); `label-xs`
   *   matches the widget item-label size (WidgetItemField / WidgetItemBox)
   */
  variant: TextVariant;
  /** Override the variant's default font weight (e.g. a medium B1 name). */
  weight?: TextWeight;
  /** Override the rendered element (each variant has a sensible default). */
  as?: ElementType;
  children: ReactNode;
}

// Default element per variant — headings render as real heading tags for
// document structure; body as paragraphs; labels as inline spans.
const DEFAULT_TAG: Record<TextVariant, ElementType> = {
  "page-title": "h1",
  "page-chapter": "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  b1: "p",
  b2: "p",
  b3: "p",
  "label-l": "span",
  "label-m": "span",
  "label-s": "span",
  "label-xs": "span",
};

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ variant, weight, as, className, children, ...rest }, ref) => {
    const Tag = as ?? DEFAULT_TAG[variant];
    const classes = [
      styles.text,
      styles[variant],
      weight ? styles[`weight-${weight}`] : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return createElement(Tag, { ref, className: classes, ...rest }, children);
  },
);

Text.displayName = "Text";
