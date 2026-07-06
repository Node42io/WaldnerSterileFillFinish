import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { ConfidenceBadge } from "../ConfidenceBadge/ConfidenceBadge";
import styles from "./LinkCard.module.css";

export interface LinkCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Small uppercase label, top-left (e.g. "rank 1°"). */
  rank?: ReactNode;
  /** Status slot, top-right — typically a `<Badge>` (e.g. "Active"). */
  status?: ReactNode;
  /** Card title (e.g. "Market Name"). */
  title: ReactNode;
  /** Meta badges shown under the title, left of the confidence badge. */
  badges?: ReactNode;
  /** Confidence percentage (0–100). Renders a `ConfidenceBadge` when set. */
  confidence?: number;
  /** Footer action label (default "Detailed Analysis"). */
  actionLabel?: ReactNode;
  /** Footer action click handler. */
  onActionClick?: () => void;
  /** Body slot, between the header and the footer action. */
  children?: ReactNode;
}

/**
 * Composable "market" card: a header (rank, status, title, meta badges +
 * confidence), a free body slot, and a footer call-to-action. Hover and focus
 * states are handled in CSS (`:hover` / `:focus-within`) to match Figma.
 */
export const LinkCard = forwardRef<HTMLDivElement, LinkCardProps>(
  (
    {
      rank,
      status,
      title,
      badges,
      confidence,
      actionLabel = "Detailed Analysis",
      onActionClick,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = [styles.card, className ?? ""].filter(Boolean).join(" ");
    const hasMeta = badges != null || confidence != null;

    return (
      <div ref={ref} className={classes} {...rest}>
        <div className={styles.header}>
          {rank != null || status != null ? (
            <div className={styles["top-row"]}>
              {rank != null ? <span className={styles.rank}>{rank}</span> : null}
              {status != null ? <div className={styles.status}>{status}</div> : null}
            </div>
          ) : null}

          <p className={styles.title}>{title}</p>

          {hasMeta ? (
            <div className={styles.meta}>
              {badges}
              {confidence != null ? (
                <ConfidenceBadge value={confidence} showTitle={false} />
              ) : null}
            </div>
          ) : null}
        </div>

        {children != null ? <div className={styles.slot}>{children}</div> : null}

        <div className={styles.footer}>
          <Button
            variant="tertiary"
            size="xs"
            onClick={onActionClick}
            rightIcon={<ArrowRight size={16} weight="regular" />}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    );
  },
);

LinkCard.displayName = "LinkCard";
