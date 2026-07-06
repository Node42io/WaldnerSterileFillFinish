import type { Meta, StoryObj } from "@storybook/react";
import { InfoTooltip } from "./InfoTooltip";
import { Text } from "../Text/Text";

const meta: Meta<typeof InfoTooltip> = {
  title: "Components/InfoTooltip",
  component: InfoTooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    tooltip: "Functional Promise Fit — how well this market matches the product.",
  },
};

export default meta;
type Story = StoryObj<typeof InfoTooltip>;

/** Hover or focus the icon. The bubble is portalled to <body> and wraps at maxWidth. */
export const Default: Story = {};

/** Paired with a label, the usual header-stat pattern. */
export const WithLabel: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-200)" }}>
      <Text variant="label-s">F.P. Fit</Text>
      <InfoTooltip {...args} style={{ color: "var(--text-labels)" }} />
    </div>
  ),
};

/** Long copy wraps within the (configurable) max width. */
export const LongText: Story = {
  args: {
    tooltip:
      "Serviceable Addressable Market — the portion of the total market you can realistically reach given your product, channels and geography.",
    maxWidth: 220,
  },
};
