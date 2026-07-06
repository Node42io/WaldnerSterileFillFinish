import type { Meta, StoryObj } from "@storybook/react";
import { Number } from "./Number";
import { Badge } from "../Badge/Badge";

const meta: Meta<typeof Number> = {
  title: "Components/Number",
  component: Number,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["colored-full", "colored-angle", "badge"],
    },
    color: {
      control: "inline-radio",
      options: ["blue", "yellow", "neutral", "none"],
    },
    unit: {
      control: "inline-radio",
      options: ["none", "euro", "dollar", "score"],
    },
    max: { control: "text" },
    children: { control: "text" },
  },
  args: {
    children: "999",
    unit: "euro",
    type: "colored-full",
    color: "blue",
  },
};

export default meta;
type Story = StoryObj<typeof Number>;

export const ColoredFull: Story = {};

export const ColoredAngle: Story = {
  args: { type: "colored-angle" },
};

export const Bare: Story = {
  args: { type: "colored-full", color: "none" },
};

export const WithBadge: Story = {
  args: {
    type: "badge",
    color: "yellow",
    badge: <Badge dot>Label</Badge>,
  },
};

/** Full matrix — every type × color (mirrors the Figma frame). */
export const Matrix: Story = {
  render: () => {
    const colors = ["blue", "yellow", "neutral"] as const;
    const Cell = ({ children }: { children: React.ReactNode }) => (
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {children}
      </div>
    );
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: 24,
          background: "var(--color-page)",
        }}
      >
        <Number type="colored-full" color="none" unit="euro">
          999
        </Number>
        <Cell>
          {colors.map((color) => (
            <Number key={color} type="colored-full" color={color} unit="euro">
              999
            </Number>
          ))}
        </Cell>
        <Cell>
          {colors.map((color) => (
            <Number key={color} type="colored-angle" color={color} unit="euro">
              999
            </Number>
          ))}
        </Cell>
        <Cell>
          {colors.map((color) => (
            <Number
              key={color}
              type="badge"
              color={color}
              unit="euro"
              badge={<Badge dot>Label</Badge>}
            >
              999
            </Number>
          ))}
        </Cell>
      </div>
    );
  },
};
