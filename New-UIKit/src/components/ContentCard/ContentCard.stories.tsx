import type { Meta, StoryObj } from "@storybook/react";
import { Acorn } from "@phosphor-icons/react";
import { ContentCard } from "./ContentCard";
import type { ContentCardSize } from "./ContentCard";
import { Badge } from "../Badge/Badge";

const SIZES: ContentCardSize[] = ["lg", "md", "sm"];

const meta: Meta<typeof ContentCard> = {
  title: "Components/Widget Items/ContentCard",
  component: ContentCard,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["horizontal", "vertical"] },
    size: { control: "inline-radio", options: SIZES },
    button: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    variant: "horizontal",
    size: "lg",
    button: true,
    children: "Rolled Steel Shape Manufacturing",
    // Icon + badges are left un-sized so the card scales them to its `size`.
    icon: <Acorn weight="regular" />,
    badge: <Badge>NAICS N</Badge>,
    badgeEnd: <Badge>NAICS N</Badge>,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 586, padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContentCard>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { variant: "vertical", badgeEnd: undefined },
};

/** Every size, both layouts — mirrors the Figma component set. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(["horizontal", "vertical"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SIZES.map((size) => (
            <ContentCard
              key={size}
              {...args}
              variant={variant}
              size={size}
              badgeEnd={variant === "vertical" ? undefined : args.badgeEnd}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithoutButton: Story = {
  args: { button: false },
};

export const TextOnly: Story = {
  args: { icon: undefined, badge: undefined, badgeEnd: undefined },
};
