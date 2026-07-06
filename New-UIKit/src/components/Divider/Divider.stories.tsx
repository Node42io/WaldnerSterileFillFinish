import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 267 }}>
      <Divider {...args} />
    </div>
  ),
};

export const InContent: Story = {
  name: "Between blocks of content",
  render: () => (
    <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ margin: 0, color: "var(--text-body)" }}>Section one</p>
      <Divider />
      <p style={{ margin: 0, color: "var(--text-body)" }}>Section two</p>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{
          padding: 32,
          background: "var(--color-page)",
          width: 320,
        }}
      >
        <Story />
      </div>
    ),
  ],
};
