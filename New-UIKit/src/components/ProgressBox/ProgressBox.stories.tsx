import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBox } from "./ProgressBox";

const meta: Meta<typeof ProgressBox> = {
  title: "Components/ProgressBox",
  component: ProgressBox,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    level: { control: "inline-radio", options: [undefined, "low", "medium", "high"] },
    decimals: { control: { type: "inline-radio" }, options: [0, 1] },
  },
  args: {
    title: "PET bottle",
    value: 40,
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
type Story = StoryObj<typeof ProgressBox>;

export const Default: Story = {};

/** A few materials at different levels. */
export const List: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <ProgressBox title="PET bottle" value={40} />
      <ProgressBox title="Aluminium can" value={80} />
      <ProgressBox title="Glass jar" value={20} />
    </div>
  ),
};
