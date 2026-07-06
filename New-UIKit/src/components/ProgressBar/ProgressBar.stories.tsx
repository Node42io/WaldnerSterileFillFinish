import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";
import type { ProgressBarLabelPosition } from "./ProgressBar";

const POSITIONS: ProgressBarLabelPosition[] = ["right", "left", "top", "bottom"];

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    level: { control: "inline-radio", options: [undefined, "low", "medium", "high"] },
    labelPosition: { control: "inline-radio", options: POSITIONS },
    showLabel: { control: "boolean" },
    decimals: { control: { type: "inline-radio" }, options: [0, 1] },
    fullWidth: { control: "boolean" },
  },
  args: {
    value: 20,
    labelPosition: "right",
    showLabel: true,
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

/** Auto-derived levels: <34 low (error) · 34–66 medium (warning) · >66 high (success). */
export const Levels: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[20, 40, 80].map((value) => (
        <ProgressBar key={value} {...args} value={value} />
      ))}
    </div>
  ),
};

/** Label position: right (dx) · left (sx) · top (up) · bottom (down). */
export const LabelPositions: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      {POSITIONS.map((labelPosition) => (
        <ProgressBar key={labelPosition} {...args} value={40} labelPosition={labelPosition} />
      ))}
    </div>
  ),
};

/** Stretched to the container width. */
export const FullWidth: Story = {
  args: { value: 64, fullWidth: true },
  render: (args) => (
    <div style={{ width: 320 }}>
      <ProgressBar {...args} />
    </div>
  ),
};
