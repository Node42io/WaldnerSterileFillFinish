import type { Meta, StoryObj } from "@storybook/react";
import { NumberSources } from "./NumberSources";

const meta: Meta<typeof NumberSources> = {
  title: "Sources/NumberSources",
  component: NumberSources,
  tags: ["autodocs"],
  argTypes: {
    index: { control: { type: "number", min: 0 } },
  },
  args: { index: 1 },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NumberSources>;

export const Default: Story = {};

/** A run of citation markers. */
export const Sequence: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {[1, 2, 3, 10].map((i) => (
        <NumberSources key={i} index={i} />
      ))}
    </div>
  ),
};
