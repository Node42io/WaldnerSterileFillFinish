import { forwardRef } from "react";
import { Info, Target } from "@phosphor-icons/react";
import { Badge } from "../Badge";
import type { BadgeProps, BadgeVariant } from "../Badge";
import styles from "./ConfidenceBadge.module.css";

export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * Inclusive cut-offs for the level scale:
 * `value < low` → low · `value > high` → high · otherwise → medium.
 * Defaults: <50 low, 50–80 medium, >80 high.
 */
export interface ConfidenceThresholds {
  low: number;
  high: number;
}

const DEFAULT_THRESHOLDS: ConfidenceThresholds = { low: 50, high: 80 };

/**
 * Badge variant per confidence level. The Badge variant already colours its
 * text and icon (via the status tokens), so nothing else is needed here.
 */
const LEVEL_VARIANT: Record<ConfidenceLevel, BadgeVariant> = {
  low: "error",
  medium: "warning",
  high: "success",
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export const deriveConfidenceLevel = (
  value: number,
  thresholds: ConfidenceThresholds = DEFAULT_THRESHOLDS,
): ConfidenceLevel => {
  const v = clamp(value);
  if (v < thresholds.low) return "low";
  if (v > thresholds.high) return "high";
  return "medium";
};

export interface ConfidenceBadgeProps
  extends Omit<
    BadgeProps,
    "variant" | "icon" | "dot" | "children" | "onClose" | "closeLabel"
  > {
  /** Confidence percentage, 0–100. */
  value: number;
  /** Force a level instead of deriving it from `value`. */
  level?: ConfidenceLevel;
  /** Override the low/high cut-offs used to derive the level. */
  thresholds?: ConfidenceThresholds;
  /** Decimal places shown in the percentage (default 0). */
  decimals?: number;
  /** Hide the leading confidence icon. */
  hideIcon?: boolean;
  /** Word prefixed in the tooltip / accessible name (default "Confidence"). */
  label?: string;
  /** Render a "Conf. level" header row above the badge (Figma title variant). */
  showTitle?: boolean;
  /** Text shown in the header row (default "Conf. level"). */
  titleText?: string;
  /** Hide the info icon next to the header title. */
  hideInfoIcon?: boolean;
}

/**
 * Small inline indicator of a confidence percentage, composed from `Badge`.
 * Colour + icon encode the level (low/medium/high); the native tooltip and
 * accessible name spell out what the number means, e.g. "Confidence: 87%".
 */
export const ConfidenceBadge = forwardRef<HTMLSpanElement, ConfidenceBadgeProps>(
  (
    {
      value,
      level,
      thresholds = DEFAULT_THRESHOLDS,
      decimals = 0,
      hideIcon = false,
      label = "Confidence",
      size = "sm",
      title,
      showTitle = false,
      titleText = "Conf. level",
      hideInfoIcon = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const resolvedLevel = level ?? deriveConfidenceLevel(value, thresholds);
    const variant = LEVEL_VARIANT[resolvedLevel];
    const display = `${clamp(value).toFixed(decimals)}%`;
    const description = `${label}: ${display}`;

    const badge = (
      <Badge
        ref={ref}
        size={size}
        variant={variant}
        icon={
          hideIcon ? undefined : (
            <Target weight="regular" aria-hidden="true" />
          )
        }
        title={title ?? description}
        aria-label={description}
        className={showTitle ? undefined : className}
        {...rest}
      >
        <span className={styles.value}>{display}</span>
      </Badge>
    );

    if (!showTitle) return badge;

    return (
      <div className={[styles.root, className].filter(Boolean).join(" ")}>
        <div className={styles.title}>
          <span className={styles["title-text"]}>{titleText}</span>
          {hideInfoIcon ? null : (
            <Info
              className={styles["info-icon"]}
              size={16}
              weight="regular"
              aria-hidden="true"
            />
          )}
        </div>
        {badge}
      </div>
    );
  },
);

ConfidenceBadge.displayName = "ConfidenceBadge";
