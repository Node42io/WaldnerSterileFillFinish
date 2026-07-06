import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  GridFour,
  ListBullets,
  Rows,
  SquaresFour,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
} from "@phosphor-icons/react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toggle>;

const icon = (Cmp: typeof GridFour) => <Cmp size={20} weight="regular" />;

/** Two icons, no labels (icon-only — each needs an aria-label). */
export const TwoIcons: Story = {
  args: {
    "aria-label": "View",
    defaultValue: "grid",
    options: [
      { value: "grid", icon: icon(GridFour), "aria-label": "Grid view" },
      { value: "list", icon: icon(ListBullets), "aria-label": "List view" },
    ],
  },
};

/** Icon + label per box. */
export const WithLabels: Story = {
  args: {
    "aria-label": "View",
    defaultValue: "grid",
    options: [
      { value: "grid", icon: icon(GridFour), label: "Grid" },
      { value: "list", icon: icon(ListBullets), label: "List" },
    ],
  },
};

/** Text only — no icons. */
export const TextOnly: Story = {
  args: {
    "aria-label": "Period",
    defaultValue: "month",
    options: [
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
      { value: "year", label: "Year" },
    ],
  },
};

/** N options — the group scales to any number. */
export const ManyIcons: Story = {
  args: {
    "aria-label": "Layout",
    defaultValue: "cards",
    options: [
      { value: "cards", icon: icon(SquaresFour), "aria-label": "Cards" },
      { value: "grid", icon: icon(GridFour), "aria-label": "Grid" },
      { value: "rows", icon: icon(Rows), "aria-label": "Rows" },
      { value: "list", icon: icon(ListBullets), "aria-label": "List" },
    ],
  },
};

/** A disabled option is skipped by clicks and arrow-key navigation. */
export const WithDisabled: Story = {
  args: {
    "aria-label": "Text align",
    defaultValue: "left",
    options: [
      { value: "left", icon: icon(TextAlignLeft), "aria-label": "Align left" },
      { value: "center", icon: icon(TextAlignCenter), "aria-label": "Align center" },
      { value: "right", icon: icon(TextAlignRight), "aria-label": "Align right" },
      {
        value: "justify",
        icon: icon(TextAlignJustify),
        "aria-label": "Justify",
        disabled: true,
      },
    ],
  },
};

/** Controlled usage. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("grid");
    return (
      <Toggle
        aria-label="View"
        value={value}
        onChange={setValue}
        options={[
          { value: "grid", icon: icon(GridFour), label: "Grid" },
          { value: "list", icon: icon(ListBullets), label: "List" },
        ]}
      />
    );
  },
};
