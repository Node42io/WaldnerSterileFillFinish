import { createContext } from "react";

/** Shared state passed from `Sidebar` down to each `SidebarItem`. */
export interface SidebarContextValue {
  /** When true, items render icon-only (the collapsed rail). */
  collapsed: boolean;
}

export const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
});
