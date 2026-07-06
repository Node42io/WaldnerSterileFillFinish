import type { Meta, StoryObj } from "@storybook/react";
import { Sources } from "./Sources";

const meta: Meta<typeof Sources> = {
  title: "Sources/Sources",
  component: Sources,
  tags: ["autodocs"],
  argTypes: {
    index: { control: { type: "number", min: 0 } },
    href: { control: "text" },
    linkText: { control: "text" },
  },
  args: { index: 1, href: "#", linkText: "Link" },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sources>;

export const Default: Story = {};

/** A list of sources. */
export const List: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      {["Annual report 2024", "Market overview", "Press release"].map((label, i) => (
        <Sources key={label} index={i + 1} href="#" linkText={label} />
      ))}
    </div>
  ),
};
