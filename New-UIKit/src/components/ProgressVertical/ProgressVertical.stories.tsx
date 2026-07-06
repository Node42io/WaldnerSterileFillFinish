import type { Meta, StoryObj } from "@storybook/react";
import { ProgressVertical } from "./ProgressVertical";

/** Tall frame so the rail has a definite height to stretch into. */
const frame: Meta<typeof ProgressVertical>["decorators"] = [
  (Story) => (
    <div style={{ height: 480 }}>
      <Story />
    </div>
  ),
];

const meta = {
  title: "Components/ProgressVertical",
  component: ProgressVertical,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { value: 14 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof ProgressVertical>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma reference (~14% filled). */
export const Default: Story = { decorators: frame };

export const Midway: Story = { decorators: frame, args: { value: 50 } };

export const NearlyComplete: Story = { decorators: frame, args: { value: 90 } };

export const WithoutHandle: Story = {
  decorators: frame,
  args: { value: 40, showHandle: false },
};
