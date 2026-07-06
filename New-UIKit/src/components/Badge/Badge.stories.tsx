import type { Meta, StoryObj } from "@storybook/react";
import { Acorn, ArrowUpRight } from "@phosphor-icons/react";
import { Badge } from "./Badge";
import type { BadgeSize, BadgeVariant } from "./Badge";

const VARIANTS: BadgeVariant[] = [
  "neutral",
  "primary",
  "warning",
  "error",
  "success",
  "information",
  "color",
];

const SIZES: BadgeSize[] = ["xs", "sm", "md", "lg"];

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: VARIANTS },
    size: { control: "inline-radio", options: SIZES },
    dot: { control: "boolean" },
    onClose: { control: false },
    children: { control: "text" },
  },
  args: {
    variant: "neutral",
    size: "sm",
    children: "Label",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const WithDot: Story = {
  args: { dot: true },
};

export const WithIcon: Story = {
  args: { icon: <Acorn weight="regular" /> },
};

/** Trailing icon — e.g. an "open in new" arrow on a code/link badge. */
export const WithTrailingIcon: Story = {
  args: {
    variant: "color",
    children: "541512",
    trailingIcon: <ArrowUpRight weight="regular" />,
  },
};

export const Dismissible: Story = {
  args: { onClose: () => {} },
};

export const Loaded: Story = {
  args: {
    dot: true,
    icon: <Acorn weight="regular" />,
    onClose: () => {},
  },
};

/** Every colour variant at the default size. */
export const Variants: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      {VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

/** The full variant × size matrix, mirroring the Figma component set. */
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      {SIZES.map((size) => (
        <div
          key={size}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}
        >
          {VARIANTS.map((variant) => (
            <Badge key={variant} size={size} variant={variant} dot>
              Label
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};
