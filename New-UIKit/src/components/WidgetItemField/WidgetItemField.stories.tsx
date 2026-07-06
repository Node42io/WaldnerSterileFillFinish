import type { Meta, StoryObj } from "@storybook/react";
import { WidgetItemField } from "./WidgetItemField";

const meta: Meta<typeof WidgetItemField> = {
  title: "Components/Widget Items/WidgetItemField",
  component: WidgetItemField,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    showTitle: { control: "boolean" },
    variant: {
      control: "inline-radio",
      options: [
        "short-title",
        "long-title",
        "vertical",
        "legend",
        "badge-sx",
        "badge-dx",
      ],
    },
    titleAs: {
      control: "inline-radio",
      options: ["label", "title"],
    },
    swatchColor: { control: "text" },
    badge: { control: "text" },
    children: { control: "text" },
  },
  args: {
    label: "Title",
    variant: "short-title",
    badge: "Label",
    children: "Text Lorem ipsum",
  },
};

export default meta;
type Story = StoryObj<typeof WidgetItemField>;

export const ShortTitle: Story = {};

export const LongTitle: Story = {
  args: { label: "Long Title", variant: "long-title" },
};

export const Vertical: Story = {
  args: { label: "Long Title", variant: "vertical" },
};

/** Title role — heading in Aeonik Medium / B1 instead of the Aeonik label. */
export const TitleAeonik: Story = {
  args: { label: "Title", titleAs: "title", variant: "vertical" },
};

/** No title — set `showTitle={false}` to render the value/content alone. */
export const NoTitle: Story = {
  args: { showTitle: false, variant: "badge-dx" },
};

/** Chart legend marker — label/title above a color swatch + value. */
export const Legend: Story = {
  args: { label: "Long Title", variant: "legend", children: "Text Lorem ipsum" },
};

/** Badge before the value, label/title on top. */
export const BadgeStart: Story = {
  args: {
    label: "Long Title",
    variant: "badge-sx",
    badge: "Label",
    children: "Text Lorem ipsum",
  },
};

/** Badge after the value, label/title on top. */
export const BadgeEnd: Story = {
  args: {
    label: "Long Title",
    variant: "badge-dx",
    badge: "Label",
    children: "Text Lorem ipsum",
  },
};

/** A legend with several series, each with its own token color. */
export const LegendGroup: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-100)",
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      <WidgetItemField variant="legend">Primary series</WidgetItemField>
      <WidgetItemField variant="legend" swatchColor="var(--success-default)">
        Success series
      </WidgetItemField>
      <WidgetItemField variant="legend" swatchColor="var(--info-default)">
        Info series
      </WidgetItemField>
    </div>
  ),
};

/** Full matrix — every variant in both `label` and `title` roles (mirrors the Figma frame). */
export const Matrix: Story = {
  render: () => {
    const variants = [
      "short-title",
      "long-title",
      "vertical",
      "legend",
      "badge-sx",
      "badge-dx",
    ] as const;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          padding: 24,
          background: "var(--color-page)",
        }}
      >
        {(["label", "title"] as const).map((titleAs) => (
          <div
            key={titleAs}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {variants.map((variant) => (
              <WidgetItemField
                key={variant}
                variant={variant}
                titleAs={titleAs}
                label={variant === "short-title" ? "Title" : "Long Title"}
                badge="Label"
              >
                Text Lorem ipsum
              </WidgetItemField>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

/** A stack of fields — the "Problem Statement" pattern. */
export const FieldGroup: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-300)",
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      <WidgetItemField label="Who">Lorem ipsum description</WidgetItemField>
      <WidgetItemField label="What">Lorem ipsum description</WidgetItemField>
      <WidgetItemField label="Why">Lorem ipsum description</WidgetItemField>
    </div>
  ),
};
