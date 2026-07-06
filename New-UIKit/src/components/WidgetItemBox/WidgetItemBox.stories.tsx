import type { Meta, StoryObj } from "@storybook/react";
import { WidgetItemBox } from "./WidgetItemBox";
import { WidgetItemField } from "../WidgetItemField/WidgetItemField";

const meta: Meta<typeof WidgetItemBox> = {
  title: "Components/Widget Items/WidgetItemBox",
  component: WidgetItemBox,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    variant: { control: "inline-radio", options: ["vertical", "horizontal"] },
    surface: { control: "inline-radio", options: ["default-2", "default"] },
    button: { control: "boolean" },
  },
  args: {
    title: "Title lorem ipsum",
    variant: "vertical",
    surface: "default-2",
    button: true,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 580, padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WidgetItemBox>;

export const Default: Story = {};

export const WithoutButton: Story = {
  args: { button: false },
};

/** Lighter `--surface-default-default` background (e.g. nested inside a card). */
export const SurfaceDefault: Story = {
  args: { surface: "default" },
};

export const VerticalContent: Story = {
  render: (args) => (
    <WidgetItemBox {...args} variant="vertical">
      <WidgetItemField label="Who">Lorem ipsum description</WidgetItemField>
      <WidgetItemField label="What">Lorem ipsum description</WidgetItemField>
      <WidgetItemField label="Why">Lorem ipsum description</WidgetItemField>
    </WidgetItemBox>
  ),
};

export const HorizontalContent: Story = {
  render: (args) => (
    <WidgetItemBox {...args} variant="horizontal">
      <WidgetItemField label="Who" variant="vertical">
        Lorem ipsum
      </WidgetItemField>
      <WidgetItemField label="What" variant="vertical">
        Lorem ipsum
      </WidgetItemField>
      <WidgetItemField label="Why" variant="vertical">
        Lorem ipsum
      </WidgetItemField>
    </WidgetItemBox>
  ),
};
