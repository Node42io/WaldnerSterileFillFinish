import type { Meta, StoryObj } from "@storybook/react";
import { BookOpenText } from "@phosphor-icons/react";
import { SubTaskStep } from "./SubTaskStep";
import { Button } from "../Button/Button";

/** 693px-wide frame matching the Figma reference. */
const frame: Meta<typeof SubTaskStep>["decorators"] = [
  (Story) => (
    <div style={{ width: 693 }}>
      <Story />
    </div>
  ),
];

/** Inline link rendered inside the description, as in the Figma source. */
const InlineLink = () => (
  <Button
    variant="tertiary"
    size="xs"
    rightIcon={<BookOpenText size={14} weight="regular" />}
    style={{ display: "inline-flex", verticalAlign: "baseline" }}
  >
    UNSPSC codes
  </Button>
);

const meta = {
  title: "Components/SubTaskStep",
  component: SubTaskStep,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "Title",
    action: { label: "Detailed Analysis" },
    label: "GOAL",
    description: (
      <>
        To link products to their global <InlineLink />, creating a "source of
        truth" for feature-by-feature comparison and competitive analysis.
      </>
    ),
  },
} satisfies Meta<typeof SubTaskStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: frame };

export const WithoutAction: Story = {
  decorators: frame,
  args: { action: undefined },
};

export const PlainDescription: Story = {
  decorators: frame,
  args: {
    description:
      "To link products to their global codes, creating a source of truth for feature-by-feature comparison and competitive analysis.",
  },
};

export const TitleOnly: Story = {
  decorators: frame,
  args: { action: undefined, label: undefined, description: undefined },
};

export const WithSlotContent: Story = {
  decorators: frame,
  args: {
    children: (
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-b2)",
          lineHeight: "var(--line-height-b2)",
          color: "var(--text-description)",
        }}
      >
        Slot content goes here.
      </p>
    ),
  },
};
