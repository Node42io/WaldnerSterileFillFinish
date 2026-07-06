import { forwardRef, useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import type { ButtonProps } from "../Button/Button";

export type Theme = "light" | "dark";

const STORAGE_KEY = "ui-kit-theme";

function readStored(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}

function readInitial(): Theme {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "light";
  }
  const stored = readStored();
  if (stored) return stored;
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function writeStored(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — ignore */
  }
}

export type ThemeToggleProps = Omit<
  ButtonProps,
  | "variant"
  | "size"
  | "iconOnly"
  | "leftIcon"
  | "rightIcon"
  | "children"
  | "onClick"
>;

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ "aria-label": ariaLabel, ...rest }, ref) => {
    const [theme, setTheme] = useState<Theme>(readInitial);

    useEffect(() => {
      if (typeof document === "undefined") return;
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const Icon = theme === "light" ? Moon : Sun;
    const label =
      ariaLabel ??
      (theme === "light" ? "Switch to dark mode" : "Switch to light mode");

    return (
      <Button
        ref={ref}
        type="button"
        variant="secondary-outline"
        size="xs"
        iconOnly
        aria-label={label}
        leftIcon={<Icon size={14} weight="light" />}
        onClick={() => {
          setTheme((current) => {
            const next: Theme = current === "light" ? "dark" : "light";
            writeStored(next);
            return next;
          });
        }}
        {...rest}
      />
    );
  },
);

ThemeToggle.displayName = "ThemeToggle";
