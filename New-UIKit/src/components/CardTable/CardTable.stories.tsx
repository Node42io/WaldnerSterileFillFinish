import type { Meta, StoryObj } from "@storybook/react";
import { CardTable } from "./CardTable";
import { Badge } from "../Badge/Badge";
import { TableCell } from "../TableCell/TableCell";

const meta: Meta<typeof CardTable> = {
  title: "Components/CardTable",
  component: CardTable,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    badgeLabel: { control: "text" },
    ratio: { control: "inline-radio", options: ["1/5", "2/5", "3/5", "4/5"] },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CardTable>;

const badges = Array.from({ length: 8 }, (_, i) => (
  <Badge key={i} variant="color" size="sm">
    Label
  </Badge>
));

/** Default slot content — a TableCell that stretches to fill the slot. */
const slot = (
  <TableCell
    style={{ flex: 1, alignSelf: "stretch" }}
    orientation="horizontal"
    title="title"
    mainText="Lorem Ipsum"
    score="99"
    scoreMax="99"
    description="Description"
    badges={
      <>
        <Badge variant="primary" size="sm">physical</Badge>
        <Badge variant="primary" size="sm">physical</Badge>
        <Badge variant="primary" size="sm">physical</Badge>
      </>
    }
  />
);

export const Default: Story = {
  args: {
    title: "Title",
    description: "Lorem ipsum description",
    badgeLabel: "title",
    ratio: "3/5",
    badges,
    children: slot,
  },
};

/** Every left-column ratio (Figma 1/5 → 4/5). */
export const Ratios: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-300)" }}>
      {(["1/5", "2/5", "3/5", "4/5"] as const).map((ratio) => (
        <CardTable
          key={ratio}
          ratio={ratio}
          title="Title"
          description="Lorem ipsum description"
          badgeLabel="title"
          badges={badges}
        >
          {slot}
        </CardTable>
      ))}
    </div>
  ),
};

/** Description hidden (Figma `description={false}`). */
export const WithoutDescription: Story = {
  args: { ...Default.args, description: undefined },
};

/** Badge group hidden (Figma `badgeInfo={false}`). */
export const WithoutBadges: Story = {
  args: { ...Default.args, badgeLabel: undefined, badges: undefined },
};
