import type { Meta, StoryObj } from "@storybook/react";
import {
  CaretDown,
  CreditCard,
  Envelope,
  Question,
  WarningCircle,
} from "@phosphor-icons/react";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    placeholder: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)", width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputField>;

const help = <Question size={16} weight="regular" />;
const errorIcon = <WarningCircle size={16} weight="regular" />;

/** A small inline dropdown affordance (label + caret) for the slots. */
const Dropdown = ({ children }: { children: string }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-50)" }}>
    {children}
    <CaretDown size={12} weight="regular" />
  </span>
);

export const Default: Story = {
  args: {
    label: "Email",
    defaultValue: "admin@node42.io",
    leading: <Envelope size={20} weight="regular" />,
    trailing: help,
    hint: "This is a hint text to help user.",
  },
};

/** Empty input showing the placeholder (State=Placeholder). */
export const Placeholder: Story = {
  args: {
    label: "Email",
    placeholder: "admin@node42.io",
    leading: <Envelope size={20} weight="regular" />,
    trailing: help,
    hint: "This is a hint text to help user.",
  },
};

/** Leading text prefix (e.g. a URL scheme). */
export const LeadingText: Story = {
  args: {
    label: "Website",
    defaultValue: "www.node42.io",
    leading: "http://",
    trailing: help,
    hint: "This is a hint text to help user.",
  },
};

/** Leading dropdown (e.g. country code). */
export const LeadingDropdown: Story = {
  args: {
    label: "Phone number",
    defaultValue: "+1 (555) 000-0000",
    leading: <Dropdown>US</Dropdown>,
    trailing: help,
    hint: "This is a hint text to help user.",
  },
};

/** Trailing dropdown (e.g. currency). */
export const TrailingDropdown: Story = {
  args: {
    label: "Sale amount",
    defaultValue: "$ 1,000.00",
    trailing: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-200)" }}>
        {help}
        <Dropdown>USD</Dropdown>
      </span>
    ),
    hint: "This is a hint text to help user.",
  },
};

/** Payment input. */
export const Payment: Story = {
  args: {
    label: "Card number",
    placeholder: "Card number",
    leading: <CreditCard size={20} weight="regular" />,
  },
};

/** Destructive / error state. */
export const Error: Story = {
  args: {
    label: "Email",
    defaultValue: "admin@node42.io",
    leading: <Envelope size={20} weight="regular" />,
    trailing: errorIcon,
    error: "This is an error message.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    defaultValue: "admin@node42.io",
    leading: <Envelope size={20} weight="regular" />,
    trailing: help,
    hint: "This is a hint text to help user.",
    disabled: true,
  },
};
