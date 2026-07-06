import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";
import type { BreadcrumbItem } from "./Breadcrumb";

const TRAIL: BreadcrumbItem[] = [
  { label: "Home", href: "#" },
  { label: "Reports", href: "#" },
  { label: "Q3 2025", href: "#" },
  { label: "Revenue", href: "#" },
  { label: "Forecast" },
];

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  args: {
    items: TRAIL.slice(0, 3),
    label: "Breadcrumb",
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

/** 2 → 5 crumbs; the last is always the current page. */
export const Lengths: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>
      {[2, 3, 4, 5].map((n) => (
        <Breadcrumb key={n} items={TRAIL.slice(0, n)} />
      ))}
    </div>
  ),
};
