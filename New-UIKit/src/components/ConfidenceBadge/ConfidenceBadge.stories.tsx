import type { Meta, StoryObj } from "@storybook/react";
import { ConfidenceBadge } from "./ConfidenceBadge";
import type { BadgeSize } from "../Badge";

const SIZES: BadgeSize[] = ["xs", "sm", "md", "lg"];

const meta: Meta<typeof ConfidenceBadge> = {
  title: "Components/ConfidenceBadge",
  component: ConfidenceBadge,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    level: { control: "inline-radio", options: [undefined, "low", "medium", "high"] },
    size: { control: "inline-radio", options: SIZES },
    decimals: { control: { type: "inline-radio" }, options: [0, 1] },
    hideIcon: { control: "boolean" },
    label: { control: "text" },
    showTitle: { control: "boolean" },
    titleText: { control: "text" },
    hideInfoIcon: { control: "boolean" },
  },
  args: {
    value: 87,
    size: "sm",
    label: "Confidence",
  },
};

export default meta;
type Story = StoryObj<typeof ConfidenceBadge>;

export const Default: Story = {};

/** Figma title variant: a "CONF. LEVEL ⓘ" header above the badge. */
export const WithTitle: Story = {
  args: { showTitle: true },
};

/** Header on every level (low/medium/high), matching the Figma selection. */
export const WithTitleLevels: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: 24,
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      {[34, 62, 91].map((value) => (
        <ConfidenceBadge key={value} {...args} showTitle value={value} />
      ))}
    </div>
  ),
};

/** Auto-derived levels: <50 low (error) · 50–80 medium (warning) · >80 high (success). */
export const Levels: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      {[34, 62, 91].map((value) => (
        <ConfidenceBadge key={value} {...args} value={value} />
      ))}
    </div>
  ),
};

/** Every size, one per level. */
export const AllSizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 24,
        background: "var(--color-page)",
      }}
    >
      {SIZES.map((size) => (
        <div key={size} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {[34, 62, 91].map((value) => (
            <ConfidenceBadge key={value} {...args} size={size} value={value} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Colour-only fallback when the icon is hidden. */
export const NoIcon: Story = {
  args: { hideIcon: true },
};

/** How it reads inline, next to report values. */
export const NextToValue: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 24,
        background: "var(--color-page)",
        fontFamily: "var(--font-family-base)",
        color: "var(--text-body)",
      }}
    >
      {[
        { metric: "Revenue forecast", value: "€1.24M", confidence: 91 },
        { metric: "Churn estimate", value: "4.7%", confidence: 63 },
        { metric: "Lead score", value: "Medium", confidence: 38 },
      ].map((row) => (
        <div key={row.metric} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 160, color: "var(--text-body)" }}>{row.metric}</span>
          <strong style={{ width: 80 }}>{row.value}</strong>
          <ConfidenceBadge {...args} value={row.confidence} />
        </div>
      ))}
    </div>
  ),
};
