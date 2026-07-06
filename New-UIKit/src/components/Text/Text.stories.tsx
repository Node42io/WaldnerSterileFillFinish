import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "page-title",
        "page-chapter",
        "h3",
        "h4",
        "h5",
        "b1",
        "b2",
        "b3",
        "label-l",
        "label-m",
        "label-s",
      ],
    },
    weight: { control: "inline-radio", options: [undefined, "regular", "medium"] },
    children: { control: "text" },
  },
  args: {
    variant: "page-title",
    children: "The quick brown fox",
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

/** Single variant, controllable from the args panel. */
export const Playground: Story = {};

/** Every variant with its default element and tokens. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-400)" }}>
      <Text variant="page-title">Page title</Text>
      <Text variant="page-chapter">Page chapter</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="h5">Heading 5</Text>
      <Text variant="b1">Body 1 — the quick brown fox jumps over the lazy dog.</Text>
      <Text variant="b2">Body 2 — the quick brown fox jumps over the lazy dog.</Text>
      <Text variant="b3">Body 3 — the quick brown fox jumps over the lazy dog.</Text>
      <Text variant="label-l">Label L</Text>
      <Text variant="label-m">Label M</Text>
      <Text variant="label-s">Label S</Text>
    </div>
  ),
};

/** Body variants default to Regular; pass `weight="medium"` for names/titles. */
export const BodyWeights: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-200)" }}>
      <Text variant="b1">B1 Regular — default body</Text>
      <Text variant="b1" weight="medium">
        B1 Medium — a name or inline title
      </Text>
      <Text variant="b3">B3 Regular — default small body</Text>
      <Text variant="b3" weight="medium">
        B3 Medium — e.g. a progress-box label
      </Text>
    </div>
  ),
};
