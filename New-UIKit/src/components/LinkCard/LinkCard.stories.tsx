import type { Meta, StoryObj } from "@storybook/react";
import { LinkCard } from "./LinkCard";
import { Badge } from "../Badge";
import { WidgetItemField } from "../WidgetItemField/WidgetItemField";
import { WidgetItemBox } from "../WidgetItemBox/WidgetItemBox";
import { Number } from "../Number/Number";

/** The Figma default body: a title+text field and two TAM/SAM metric boxes. */
const ExampleSlot = () => (
  <>
    <WidgetItemField variant="vertical" label="core job-to-be-done">
      Text Lorem ipsum
    </WidgetItemField>
    <div style={{ display: "flex", gap: 8, width: "100%", alignItems: "stretch" }}>
      <WidgetItemBox title="TAM" button={false} surface="default">
        <Number color="none">999</Number>
      </WidgetItemBox>
      <WidgetItemBox title="SAM" button={false} surface="default">
        <Number color="none">999</Number>
      </WidgetItemBox>
    </div>
  </>
);

const meta: Meta<typeof LinkCard> = {
  title: "Components/LinkCard",
  component: LinkCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    rank: "rank 1°",
    title: "Market Name",
    confidence: 96,
    status: <Badge variant="primary" size="xs">Active</Badge>,
    badges: (
      <Badge variant="color" size="sm">
        naics: 000000
      </Badge>
    ),
    children: <ExampleSlot />,
  },
};

export default meta;
type Story = StoryObj<typeof LinkCard>;

export const Default: Story = {};

/** Header only — empty body slot. */
export const NoBody: Story = {
  args: { children: undefined },
};

/** Hover and focus states are interactive: hover the card, or Tab to the action. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      <LinkCard {...args} />
      <LinkCard {...args} />
      <LinkCard {...args} />
    </div>
  ),
};
