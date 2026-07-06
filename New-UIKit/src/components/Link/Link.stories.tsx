import type { Meta, StoryObj } from "@storybook/react";
import { Acorn } from "@phosphor-icons/react";
import { Link } from "./Link";
import type { LinkSize } from "./Link";

const SIZES: LinkSize[] = ["sm", "md", "lg"];

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: SIZES },
    underline: { control: "boolean" },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: {
    children: "Link",
    href: "#",
    size: "sm",
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {};

/** sm (12px) · md (14px) · lg (16px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 24 }}>
      {SIZES.map((size) => (
        <Link key={size} {...args} size={size}>
          Link
        </Link>
      ))}
    </div>
  ),
};

/** Leading and trailing icons (placeholder Acorn from Figma). */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link {...args} size={size} leftIcon={<Acorn />}>
            Link
          </Link>
          <Link {...args} size={size} rightIcon={<Acorn />}>
            Link
          </Link>
          <Link {...args} size={size} leftIcon={<Acorn />} rightIcon={<Acorn />}>
            Link
          </Link>
        </div>
      ))}
    </div>
  ),
};

/** Default · selected · disabled · underline. Hover/focus are interactive. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: 24 }}>
      <Link {...args}>Default</Link>
      <Link {...args} selected>
        Selected
      </Link>
      <Link {...args} disabled>
        Disabled
      </Link>
      <Link {...args} underline>
        Underline
      </Link>
    </div>
  ),
};

/** Underlined, every size. */
export const Underline: Story = {
  args: { underline: true },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 24 }}>
      {SIZES.map((size) => (
        <Link key={size} {...args} size={size}>
          Link
        </Link>
      ))}
    </div>
  ),
};
