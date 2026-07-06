import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import styles from "./Navbar.module.css";

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode;
  /** Action slot rendered on the right side of the navbar. */
  children?: ReactNode;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ brand, children, className, ...rest }, ref) => {
    const classes = [styles.navbar, className ?? ""].filter(Boolean).join(" ");

    return (
      <nav ref={ref} className={classes} {...rest}>
        {brand ? <div className={styles.brand}>{brand}</div> : null}
        <div className={styles.actions}>{children}</div>
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";
