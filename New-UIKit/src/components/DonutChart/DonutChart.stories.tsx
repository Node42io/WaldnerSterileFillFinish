import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./DonutChart";

const meta: Meta<typeof DonutChart> = {
  title: "Components/Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 80, max: 360, step: 4 } },
    thickness: { control: { type: "range", min: 4, max: 48, step: 1 } },
    gap: { control: { type: "range", min: 0, max: 20, step: 1 } },
    rounded: { control: "boolean" },
  },
  args: {
    size: 200,
    gap: 16,
    rounded: true,
    // Mirrors the Figma "pie-05" proportions/colours.
    data: [
      { label: "Steel", value: 40 },
      { label: "Aluminium", value: 14 },
      { label: "Copper", value: 12 },
      { label: "Zinc", value: 10 },
      { label: "Other", value: 4 },
    ],
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
type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {};

export const Flat: Story = {
  args: { rounded: false, gap: 2 },
};

/** Backend-driven: pass any values; segments normalise to the total. */
export const CustomData: Story = {
  args: {
    data: [
      { label: "Q1", value: 320 },
      { label: "Q2", value: 510 },
      { label: "Q3", value: 280 },
      { label: "Q4", value: 190 },
    ],
  },
};

/** Total shown in the hole via the centre slot. */
export const WithCenterLabel: Story = {
  render: (args) => (
    <DonutChart {...args}>
      <span
        style={{
          fontFamily: "var(--font-family-mono)",
          fontSize: "var(--font-size-label-l)",
          lineHeight: "var(--line-height-label-l)",
          color: "var(--text-body)",
        }}
      >
        80
      </span>
    </DonutChart>
  ),
};
