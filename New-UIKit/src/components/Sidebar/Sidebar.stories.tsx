import type { Meta, StoryObj } from "@storybook/react";
import { ChartBar, Gear, House, Users } from "@phosphor-icons/react";
import { Sidebar } from "./Sidebar";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { SidebarSubItem } from "../SidebarSubItem/SidebarSubItem";
import { Logo } from "../Logo/Logo";

/** Tall frame so the full-height rail is visible. */
const frame: Meta<typeof Sidebar>["decorators"] = [
  (Story) => (
    <div style={{ height: 640, display: "flex" }}>
      <Story />
    </div>
  ),
];

const items = (
  <>
    <SidebarItem label="Home" icon={<House size={16} weight="regular" />} selected>
      <SidebarSubItem>Content 1</SidebarSubItem>
      <SidebarSubItem>Content 1</SidebarSubItem>
      <SidebarSubItem>Content 1</SidebarSubItem>
    </SidebarItem>
    <SidebarItem label="Analytics" icon={<ChartBar size={16} weight="regular" />}>
      <SidebarSubItem>Content 1</SidebarSubItem>
      <SidebarSubItem>Content 1</SidebarSubItem>
    </SidebarItem>
    <SidebarItem label="Team" icon={<Users size={16} weight="regular" />} />
    <SidebarItem label="Settings" icon={<Gear size={16} weight="regular" />} />
  </>
);

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: frame,
  args: {
    children: items,
    brand: <Logo style={{ height: 16, width: "auto", display: "block" }} />,
    brandCollapsed: (
      <Logo symbol style={{ height: 16, width: "auto", display: "block" }} />
    ),
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};

export const Collapsed: Story = { args: { defaultCollapsed: true } };

/** Click the top toggle to switch between the expanded and icon rails. */
export const Toggleable: Story = {};
