import type { Meta, StoryObj } from "@storybook/react";
import { SidebarItem } from "./SidebarItem";
import { SidebarSubItem } from "../SidebarSubItem/SidebarSubItem";

/** 176px frame matching the Figma sidebar column. */
const frame: Meta<typeof SidebarItem>["decorators"] = [
  (Story) => (
    <div style={{ width: 176 }}>
      <Story />
    </div>
  ),
];

const subItems = (
  <>
    <SidebarSubItem>Content 1</SidebarSubItem>
    <SidebarSubItem>Content 1</SidebarSubItem>
    <SidebarSubItem>Content 1</SidebarSubItem>
    <SidebarSubItem>Content 1</SidebarSubItem>
    <SidebarSubItem>Content 1</SidebarSubItem>
    <SidebarSubItem>Content 1</SidebarSubItem>
    <SidebarSubItem>Content 1</SidebarSubItem>
  </>
);

const meta = {
  title: "Components/SidebarItem",
  component: SidebarItem,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: frame,
  args: { label: "Overview", children: subItems },
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

export const Disabled: Story = { args: { disabled: true } };

/** Press Tab to focus the header and reveal the focus ring. */
export const Focused: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const OpenSelected: Story = {
  args: { selected: true, defaultOpen: true },
};

/** A leaf item with no sub-items — no caret, clicking just selects. */
export const Leaf: Story = { args: { children: undefined } };

/** The full variant sheet, mirroring the Figma frame. */
export const AllStates: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <div style={{ width: 176 }}>
        <SidebarItem {...args} label="Overview" />
      </div>
      <div style={{ width: 176 }}>
        <SidebarItem {...args} label="Overview" selected />
      </div>
      <div style={{ width: 176 }}>
        <SidebarItem {...args} label="Overview" disabled />
      </div>
      <div style={{ width: 176 }}>
        <SidebarItem {...args} label="Overview" defaultOpen />
      </div>
      <div style={{ width: 176 }}>
        <SidebarItem {...args} label="Overview" selected defaultOpen />
      </div>
    </>
  ),
};
