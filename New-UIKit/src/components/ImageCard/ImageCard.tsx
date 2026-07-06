import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import styles from "./ImageCard.module.css";

export interface ImageCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  /** Image URL. */
  src: string;
  /** Alternative text for the image. */
  alt?: string;
  /** Uppercase label shown in the badge (e.g. "ROLE"). */
  role: string;
  /** Subtitle under the label (e.g. a person's name). */
  name?: string;
  /** Whether to render the subtitle line. */
  subtitle?: boolean;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ src, alt = "", role, name, subtitle = true, className, ...rest }, ref) => {
    const classes = [styles.card, className ?? ""].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        <img className={styles.image} src={src} alt={alt} />
        <div className={styles.badge}>
          <p className={styles.role}>{role}</p>
          {subtitle && name ? <p className={styles.name}>{name}</p> : null}
        </div>
      </div>
    );
  },
);

ImageCard.displayName = "ImageCard";
