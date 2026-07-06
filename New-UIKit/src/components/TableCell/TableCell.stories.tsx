import type { Meta, StoryObj } from "@storybook/react";
import { TableCell } from "./TableCell";
import { Badge } from "../Badge/Badge";

const meta: Meta<typeof TableCell> = {
  title: "Components/TableCell",
  component: TableCell,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["dark", "light"] },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
    title: { control: "text" },
    mainText: { control: "text" },
    score: { control: "text" },
    scoreMax: { control: "text" },
    description: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div
        style={{ padding: 24, background: "var(--color-page)", display: "inline-block" }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableCell>;

const badges = (
  <>
    <Badge variant="primary" size="sm">physical</Badge>
    <Badge variant="primary" size="sm">physical</Badge>
    <Badge variant="primary" size="sm">physical</Badge>
  </>
);

export const Dark: Story = {
  args: {
    variant: "dark",
    orientation: "vertical",
    title: "title",
    mainText: "Lorem Ipsum",
    score: "99",
    scoreMax: "99",
    badges,
    description: "Description",
  },
};

/** Lighter surface. */
export const Light: Story = {
  args: { ...Dark.args, variant: "light" },
};

/** Badges laid out in a wrapping row instead of a column. */
export const Horizontal: Story = {
  args: { ...Dark.args, orientation: "horizontal" },
};

/** Lighter surface, horizontal badge group. */
export const LightHorizontal: Story = {
  args: { ...Dark.args, variant: "light", orientation: "horizontal" },
};

/** Only the parts you pass render — every block is optional. */
export const ScoreOnly: Story = {
  args: { variant: "dark", mainText: "Lorem Ipsum", score: "99", scoreMax: "99" },
};
