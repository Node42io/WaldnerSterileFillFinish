import type { ReactNode } from "react";
import {
  BookOpenText,
  Buildings,
  ChartBar,
  Cube,
  Question,
  SquaresFour,
  Storefront,
  Users,
} from "@phosphor-icons/react";
import { Navbar } from "../components/Navbar/Navbar";
import { Logo } from "../components/Logo/Logo";
import { Button } from "../components/Button/Button";
import { ThemeToggle } from "../components/ThemeToggle/ThemeToggle";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { SidebarItem } from "../components/SidebarItem/SidebarItem";
import { SidebarSubItem } from "../components/SidebarSubItem/SidebarSubItem";
import { WidgetCard } from "../components/WidgetCard/WidgetCard";
import { Text } from "../components/Text/Text";

export interface PageTemplateProps {
  /** Optional breadcrumb trail rendered above the page title. */
  breadcrumb?: ReactNode;
  /** Optional row rendered between the breadcrumb and the page title. */
  beforeTitle?: ReactNode;
  /** Main page heading. */
  title?: string;
  /** Optional id/anchor for the page title (so it can be linked/scrolled to). */
  titleId?: string;
  /** Optional description rendered under the title (Aeonik / B2). */
  description?: ReactNode;
  /** Optional content rendered to the right of the title (e.g. stat boxes). */
  titleAside?: ReactNode;
  /** Optional content rendered immediately to the left of the title (e.g. a back button). */
  titleLeading?: ReactNode;
  /** Hide the sidebar entirely; the brand moves into the navbar's left slot. */
  hideSidebar?: boolean;
  /** Brand shown in the sidebar header, left of the collapse toggle (defaults to the node42 Logo). */
  brand?: ReactNode;
  /** Compact brand shown when the sidebar is collapsed (defaults to the node42 Logo symbol). */
  brandCollapsed?: ReactNode;
  /** Trailing navbar actions (defaults to ThemeToggle + Help). */
  actions?: ReactNode;
  /** Sidebar contents (defaults to the demo navigation). */
  sidebar?: ReactNode;
  /** Main content area (defaults to the demo widget grid). */
  children?: ReactNode;
}

const defaultActions = (
  <>
    <ThemeToggle />
    <Button
      variant="secondary-outline"
      size="xs"
      iconOnly
      aria-label="Help"
      leftIcon={<Question size={14} weight="light" />}
    />
  </>
);

const defaultSidebar = (
  <>
    <SidebarItem
      label="Overview"
      icon={<SquaresFour size={16} weight="regular" />}
      selected
      defaultOpen
    >
      <SidebarSubItem>Content 1</SidebarSubItem>
      <SidebarSubItem>Content 1</SidebarSubItem>
    </SidebarItem>
    <SidebarItem
      label="Your Company"
      icon={<Buildings size={16} weight="regular" />}
    />
    <SidebarItem
      label="Product Analysis"
      icon={<Cube size={16} weight="regular" />}
    />
    <SidebarItem
      label="Market Analysis"
      icon={<Storefront size={16} weight="regular" />}
    />
  </>
);

const defaultContent = (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: "var(--space-300)",
      marginTop: "var(--space-600)",
    }}
  >
    <WidgetCard
      span={3}
      title="Sessions"
      description="Last 7 days"
      icon={<ChartBar size={24} weight="regular" />}
      action={{ label: "Details" }}
      style={{ height: 240 }}
    />
    <WidgetCard
      span={3}
      title="Users"
      description="Active now"
      icon={<Users size={24} weight="regular" />}
      action={{ label: "Details" }}
      style={{ height: 240 }}
    />
    <WidgetCard
      span={6}
      title="Glossary"
      description="Reference"
      icon={<BookOpenText size={24} weight="regular" />}
      action={{ label: "Full Glossary" }}
      style={{ height: 240 }}
    />
  </div>
);

/**
 * Full report page archetype: navbar + sidebar chrome with a swappable
 * main content area. Pass `children` to replace the demo widgets,
 * `sidebar`/`actions`/`brand`/`title` to customize the rest.
 */
export function PageTemplate({
  breadcrumb,
  beforeTitle,
  title = "Report template page",
  titleId,
  description,
  titleAside,
  titleLeading,
  hideSidebar = false,
  brand = <Logo style={{ height: 16, width: "auto", display: "block" }} />,
  brandCollapsed = (
    <Logo symbol style={{ height: 16, width: "auto", display: "block" }} />
  ),
  actions = defaultActions,
  sidebar = defaultSidebar,
  children = defaultContent,
}: PageTemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--color-page)",
      }}
    >
      {hideSidebar ? null : (
        <Sidebar brand={brand} brandCollapsed={brandCollapsed}>
          {sidebar}
        </Sidebar>
      )}

      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <Navbar brand={hideSidebar ? brand : undefined}>{actions}</Navbar>

        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: "var(--space-600)",
            overflow: "auto",
          }}
        >
          {breadcrumb ? (
            <div style={{ marginBottom: "var(--space-200)" }}>{breadcrumb}</div>
          ) : null}
          {beforeTitle ? (
            <div style={{ marginBottom: "var(--space-200)" }}>{beforeTitle}</div>
          ) : null}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "var(--space-300)",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-200)", minWidth: 0 }}>
              {titleLeading != null ? <div style={{ flexShrink: 0 }}>{titleLeading}</div> : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-100)", minWidth: 0 }}>
              <Text variant="page-title" id={titleId} style={{ scrollMarginTop: "var(--space-600)" }}>
                {title}
              </Text>
              {description != null ? (
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-family-sans)",
                    fontWeight: "var(--font-weight-regular)",
                    fontSize: "var(--font-size-b2)",
                    lineHeight: "var(--line-height-b2)",
                    letterSpacing: "var(--letter-spacing-b2)",
                    color: "var(--text-body)",
                  }}
                >
                  {description}
                </p>
              ) : null}
              </div>
            </div>
            {titleAside != null ? <div style={{ flexShrink: 0 }}>{titleAside}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

PageTemplate.displayName = "PageTemplate";
