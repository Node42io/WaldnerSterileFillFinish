import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
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
type Story = StoryObj<typeof Checkbox>;

/** Default, unchecked. */
export const Default: Story = {
  args: { label: "Accept terms" },
};

/** Checked. */
export const Checked: Story = {
  args: { label: "Accept terms", defaultChecked: true },
};

/** Indeterminate ("mixed") — a dash instead of a check. */
export const Indeterminate: Story = {
  args: { label: "Select all", indeterminate: true },
};

/** Box only — no visible label (pass an accessible name). */
export const NoLabel: Story = {
  args: { "aria-label": "Select row" },
};

/** Disabled variants. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Disabled indeterminate" disabled indeterminate />
    </div>
  ),
};

/** All states side by side. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
    </div>
  ),
};

/** Controlled parent + indeterminate child (classic "select all" pattern). */
export const SelectAll: Story = {
  render: () => {
    const [items, setItems] = useState([true, false, false]);
    const allChecked = items.every(Boolean);
    const someChecked = items.some(Boolean);

    const toggleAll = (checked: boolean) => setItems(items.map(() => checked));
    const toggleOne = (i: number, checked: boolean) =>
      setItems(items.map((v, idx) => (idx === i ? checked : v)));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={(e) => toggleAll(e.target.checked)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 24 }}>
          {items.map((checked, i) => (
            <Checkbox
              key={i}
              label={`Item ${i + 1}`}
              checked={checked}
              onChange={(e) => toggleOne(i, e.target.checked)}
            />
          ))}
        </div>
      </div>
    );
  },
};
