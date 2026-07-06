import type { Meta, StoryObj } from "@storybook/react";
import { BookOpenText } from "@phosphor-icons/react";
import { WidgetCard } from "./WidgetCard";

/** 296×349 frame matching the Figma reference, for single-card stories. */
const frame: Meta<typeof WidgetCard>["decorators"] = [
  (Story) => (
    <div style={{ width: 296, height: 349 }}>
      <Story />
    </div>
  ),
];

const meta = {
  title: "Components/WidgetCard",
  component: WidgetCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    title: "Title",
    description: "Description",
    icon: <BookOpenText size={24} weight="regular" />,
    action: { label: "Full Glossary" },
  },
} satisfies Meta<typeof WidgetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: frame };

export const WithoutIcon: Story = {
  decorators: frame,
  args: { icon: undefined },
};

export const WithoutDescription: Story = {
  decorators: frame,
  args: { description: undefined },
};

export const WithoutAction: Story = {
  decorators: frame,
  args: { action: undefined },
};

export const TitleOnly: Story = {
  decorators: frame,
  args: { icon: undefined, description: undefined, action: undefined },
};

export const WithContent: Story = {
  decorators: frame,
  args: {
    children: (
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-b3)",
          lineHeight: "var(--line-height-b2)",
          color: "var(--text-body)",
        }}
      >
        Card contents go here — charts, lists, or any widget body that fills the
        space between the header and the footer action.
      </p>
    ),
  },
};

/**
 * The card is fluid (`width: 100%`) and aligns to a 12-column grid via the
 * `span` prop (clamped 2–12). The container owns the grid: 12 equal columns
 * with the 12px gutter (`--space-300`). At the 1440 reference frame the content
 * area is 1236px → exactly 92px per column.
 */
export const Grid: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: "var(--space-300)",
        width: 1236,
        maxWidth: "100%",
      }}
    >
      <WidgetCard {...args} span={2} title="Span 2" style={{ height: 180 }} />
      <WidgetCard {...args} span={4} title="Span 4" style={{ height: 180 }} />
      <WidgetCard {...args} span={6} title="Span 6" style={{ height: 180 }} />
      <WidgetCard {...args} span={12} title="Span 12 (full)" style={{ height: 180 }} />
      <WidgetCard {...args} span={3} title="Span 3" style={{ height: 180 }} />
      <WidgetCard {...args} span={3} title="Span 3" style={{ height: 180 }} />
      <WidgetCard {...args} span={6} title="Span 6" style={{ height: 180 }} />
    </div>
  ),
};
