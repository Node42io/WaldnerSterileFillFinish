import type { Meta, StoryObj } from "@storybook/react";
import { Dot } from "./Dot";

const meta: Meta<typeof Dot> = {
  title: "Components/Dot",
  component: Dot,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Dot>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Dot {...args} size="sm" />
      <Dot {...args} size="md" />
      <Dot {...args} size="lg" />
    </div>
  ),
};

export const CustomColors: Story = {
  name: "Custom colors (via parent `color`)",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <span style={{ color: "var(--surface-action-error-default)" }}>
        <Dot size="md" />
      </span>
      <span style={{ color: "var(--surface-action-success-default)" }}>
        <Dot size="md" />
      </span>
      <span style={{ color: "var(--surface-action-warning-default)" }}>
        <Dot size="md" />
      </span>
      <span style={{ color: "var(--surface-action-information-default)" }}>
        <Dot size="md" />
      </span>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  parameters: { backgrounds: { default: "page" } },
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{ padding: 32, background: "var(--color-page)" }}
      >
        <Story />
      </div>
    ),
  ],
};
