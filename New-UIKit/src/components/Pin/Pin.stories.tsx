import type { Meta, StoryObj } from "@storybook/react";
import { Pin } from "./Pin";

const meta: Meta<typeof Pin> = {
  title: "Components/Pin",
  component: Pin,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "selected", "group"] },
    size: { control: "inline-radio", options: ["default", "small"] },
    name: { control: "text" },
    address: { control: "text" },
    count: { control: "number" },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "default",
    size: "default",
    name: "Cerbios-Pharma SA",
  },
};

export default meta;
type Story = StoryObj<typeof Pin>;

export const Default: Story = {};

export const Hovered: Story = {
  parameters: {
    pseudo: { hover: true },
  },
};

export const Selected: Story = {
  args: {
    variant: "selected",
    name: "Cerbios-Pharma SA",
    address:
      "Hitzkofer Strasse 1,\nSigmaringendorf-Laucherthal (72517)\nGermany",
  },
};

export const Group: Story = {
  args: {
    variant: "group",
    count: 23,
    name: undefined,
  },
};

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const SmallSelected: Story = {
  args: {
    size: "small",
    variant: "selected",
    name: "Cerbios-Pharma SA",
    address:
      "Hitzkofer Strasse 1,\nSigmaringendorf-Laucherthal (72517)\nGermany",
  },
};

export const SmallGroup: Story = {
  args: {
    size: "small",
    variant: "group",
    count: 23,
    name: undefined,
  },
};

export const All: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 48,
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <Pin variant="group" count={23} />
        <Pin variant="default" name="Cerbios-Pharma SA" />
        <Pin
          variant="selected"
          name="Cerbios-Pharma SA"
          address={
            "Hitzkofer Strasse 1,\nSigmaringendorf-Laucherthal (72517)\nGermany"
          }
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <Pin size="small" variant="group" count={23} />
        <Pin size="small" variant="default" name="Cerbios-Pharma SA" />
        <Pin
          size="small"
          variant="selected"
          name="Cerbios-Pharma SA"
          address={
            "Hitzkofer Strasse 1,\nSigmaringendorf-Laucherthal (72517)\nGermany"
          }
        />
      </div>
    </div>
  ),
};
