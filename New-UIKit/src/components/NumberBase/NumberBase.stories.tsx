import type { Meta, StoryObj } from "@storybook/react";
import { NumberBase } from "./NumberBase";

const meta: Meta<typeof NumberBase> = {
  title: "Components/NumberBase",
  component: NumberBase,
  tags: ["autodocs"],
  argTypes: {
    unit: {
      control: "inline-radio",
      options: ["none", "euro", "dollar", "score"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    max: { control: "text" },
    children: { control: "text" },
  },
  args: {
    children: "999",
    unit: "euro",
    size: "xl",
  },
};

export default meta;
type Story = StoryObj<typeof NumberBase>;

export const Euro: Story = {};

export const Dollar: Story = {
  args: { unit: "dollar" },
};

export const Score: Story = {
  args: { unit: "score", max: "999" },
};

export const PlainNumber: Story = {
  args: { unit: "none" },
};

/** Every size (sm · md · lg · xl) across all unit types — matches the Figma grid. */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-300)",
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      {(["euro", "dollar", "score", "none"] as const).map((unit) => (
        <div
          key={unit}
          style={{ display: "flex", alignItems: "baseline", gap: "var(--space-600)" }}
        >
          {(["sm", "md", "lg", "xl"] as const).map((size) => (
            <NumberBase key={size} unit={unit} size={size} max="999">
              999
            </NumberBase>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Every unit type side by side. */
export const AllUnits: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-200)",
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      <NumberBase unit="euro">999</NumberBase>
      <NumberBase unit="dollar">999</NumberBase>
      <NumberBase unit="score" max="999">
        999
      </NumberBase>
      <NumberBase unit="none">999</NumberBase>
    </div>
  ),
};
