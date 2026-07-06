import type { Meta, StoryObj } from "@storybook/react";
import { SearchBar } from "./SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["xs", "sm"],
      description: "Compact size. `xs` (24px) matches the navbar actions; `sm` (32px) suits denser toolbars.",
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)", width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

/** Default xs size — matches the navbar action buttons (24px). */
export const Default: Story = {
  args: {
    size: "xs",
    placeholder: "Search",
  },
};

/** Larger 32px box for denser toolbars. */
export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "Search",
  },
};

/** Prefilled value. */
export const WithValue: Story = {
  args: {
    size: "xs",
    defaultValue: "node42",
  },
};

/** Disabled state. */
export const Disabled: Story = {
  args: {
    size: "xs",
    placeholder: "Search",
    disabled: true,
  },
};

/** Both sizes side by side. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-200)" }}>
      <SearchBar size="xs" placeholder="Search (xs)" />
      <SearchBar size="sm" placeholder="Search (sm)" />
    </div>
  ),
};
