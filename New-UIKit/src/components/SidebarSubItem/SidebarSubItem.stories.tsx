import type { Meta, StoryObj } from "@storybook/react";
import { SidebarSubItem } from "./SidebarSubItem";

/** 152px frame matching the Figma sidebar column. */
const frame: Meta<typeof SidebarSubItem>["decorators"] = [
  (Story) => (
    <div style={{ width: 152 }}>
      <Story />
    </div>
  ),
];

const meta = {
  title: "Components/SidebarSubItem",
  component: SidebarSubItem,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: frame,
  args: { children: "Content 1" },
} satisfies Meta<typeof SidebarSubItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

export const Disabled: Story = { args: { disabled: true } };

/** Tab to the item (or click) to see the focus pill + ring. */
export const Focused: Story = {
  parameters: {
    docs: { description: { story: "Press Tab to focus and reveal the pill." } },
  },
};

/** All states stacked, mirroring the Figma variant sheet. */
export const AllStates: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 152, display: "flex", flexDirection: "column", gap: 12 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <SidebarSubItem {...args}>Content 1</SidebarSubItem>
      <SidebarSubItem {...args}>Content 1</SidebarSubItem>
      <SidebarSubItem {...args} selected>
        Content 1
      </SidebarSubItem>
      <SidebarSubItem {...args} disabled>
        Content 1
      </SidebarSubItem>
    </>
  ),
};
