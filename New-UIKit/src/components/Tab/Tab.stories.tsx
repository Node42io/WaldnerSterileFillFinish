import type { Meta, StoryObj } from "@storybook/react";
import { House } from "@phosphor-icons/react";
import { Tab } from "./Tab";

const meta: Meta<typeof Tab> = {
  title: "Components/Tab",
  component: Tab,
  tags: ["autodocs"],
  argTypes: {
    kind: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    truncated: { control: "boolean" },
    showBadge: { control: "boolean" },
    closable: { control: "boolean" },
  },
  args: {
    children: "Tab",
    kind: "horizontal",
    size: "md",
    selected: false,
    disabled: false,
    truncated: false,
    showBadge: false,
    closable: false,
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {};

export const Selected: Story = { args: { selected: true } };

export const Hovered: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const WithAllSlots: Story = {
  args: {
    prefixIcon: <House size={20} weight="light" />,
    showBadge: true,
    closable: true,
  },
};

export const Truncated: Story = {
  args: {
    children: "Tab with a very long label that should be truncated",
    truncated: true,
    prefixIcon: <House size={20} weight="light" />,
    showBadge: true,
    closable: true,
    style: { maxWidth: 180 },
  },
};

export const Horizontal_Sizes: Story = {
  name: "Sizes — horizontal",
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
      <Tab {...args} size="sm">
        Small
      </Tab>
      <Tab {...args} size="md">
        Medium
      </Tab>
      <Tab {...args} size="lg">
        Large
      </Tab>
    </div>
  ),
  args: {
    kind: "horizontal",
    prefixIcon: <House weight="light" />,
    showBadge: true,
    closable: true,
  },
};

export const Vertical_Sizes: Story = {
  name: "Sizes — vertical",
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Tab {...args} size="sm">
        Small
      </Tab>
      <Tab {...args} size="md">
        Medium
      </Tab>
      <Tab {...args} size="lg">
        Large
      </Tab>
    </div>
  ),
  args: {
    kind: "vertical",
    prefixIcon: <House weight="light" />,
    showBadge: true,
    closable: true,
  },
};

export const States_Matrix: Story = {
  name: "States matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, max-content)",
        gap: 16,
        alignItems: "center",
      }}
    >
      <Tab>Default</Tab>
      <Tab selected>Selected</Tab>
      <Tab disabled>Disabled</Tab>
      <Tab closable showBadge prefixIcon={<House weight="light" />}>
        All slots
      </Tab>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  parameters: { backgrounds: { default: "page" } },
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{ padding: 32, background: "var(--color-page)" }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    selected: true,
    prefixIcon: <House weight="light" />,
    showBadge: true,
    closable: true,
  },
};
