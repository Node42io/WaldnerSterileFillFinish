import { forwardRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Link } from "../Link";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  /** Visible label for the crumb. */
  label: ReactNode;
  /** Destination — omit on the current (last) item. */
  href?: string;
  /** Click handler, e.g. for client-side routing. */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface BreadcrumbProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Ordered crumbs, root first. The last item is rendered as the current page. */
  items: BreadcrumbItem[];
  /** Accessible label for the nav landmark (default "Breadcrumb"). */
  label?: string;
  /** Separator between crumbs (default a caret-right icon). */
  separator?: ReactNode;
}

/**
 * Breadcrumb trail: navigable `Link` crumbs separated by a caret, with the last
 * item shown as the current page (medium weight, tertiary colour, `aria-current`).
 * Wrapped in a `nav`/`ol` landmark for assistive tech.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, label = "Breadcrumb", separator, className, ...rest }, ref) => {
    const classes = [styles.breadcrumb, className ?? ""].filter(Boolean).join(" ");

    return (
      <nav ref={ref} aria-label={label} className={classes} {...rest}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className={styles.item}>
                {isLast ? (
                  <span className={styles.current} aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link size="sm" href={item.href} onClick={item.onClick}>
                    {item.label}
                  </Link>
                )}
                {!isLast ? (
                  <span className={styles.separator} aria-hidden="true">
                    {separator ?? <CaretRight weight="regular" />}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
