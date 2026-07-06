import type { Meta, StoryObj } from "@storybook/react";
import { Acorn } from "@phosphor-icons/react";
import { InfoCard } from "./InfoCard";

const meta: Meta<typeof InfoCard> = {
  title: "Components/InfoCard",
  component: InfoCard,
  tags: ["autodocs"],
  argTypes: {
    badge: { control: "text" },
    title: { control: "text" },
    titleVariant: { control: "inline-radio", options: ["h5", "b2"] },
    fieldLabel: { control: "text" },
    fieldValue: { control: "text" },
    text: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)", width: 284 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Default: Story = {
  args: {
    badge: "Label",
    action: { label: "Button CTA", icon: <Acorn size={14} weight="regular" /> },
    title: "Title",
    fieldLabel: "Long title",
    fieldValue: "Text Lorem ipsum",
    text: "Long text/description",
  },
};

/** Label badge only — no CTA button. */
export const LabelOnly: Story = {
  args: {
    badge: "Label",
    title: "Title",
    fieldLabel: "Long title",
    fieldValue: "Text Lorem ipsum",
    text: "Long text/description",
  },
};

/** CTA button only — no label badge (button stays right-aligned). */
export const ButtonOnly: Story = {
  args: {
    action: { label: "Button CTA", icon: <Acorn size={14} weight="regular" /> },
    title: "Title",
    fieldLabel: "Long title",
    fieldValue: "Text Lorem ipsum",
    text: "Long text/description",
  },
};

/** Just the title — field and description omitted. */
export const TitleOnly: Story = {
  args: {
    badge: "Label",
    action: { label: "Button CTA", icon: <Acorn size={14} weight="regular" /> },
    title: "Title",
  },
};

/** Title in B2 Medium instead of the default H5. */
export const TitleB2: Story = {
  args: {
    badge: "Label",
    action: { label: "Button CTA", icon: <Acorn size={14} weight="regular" /> },
    title: "Title",
    titleVariant: "b2",
    fieldLabel: "Long title",
    fieldValue: "Text Lorem ipsum",
    text: "Long text/description",
  },
};

/** No header (no badge / CTA). */
export const NoHeader: Story = {
  args: {
    title: "Title",
    fieldLabel: "Long title",
    fieldValue: "Text Lorem ipsum",
    text: "Long text/description",
  },
};
