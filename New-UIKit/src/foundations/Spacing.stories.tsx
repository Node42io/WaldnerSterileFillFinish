import type { Meta, StoryObj } from "@storybook/react";

type Token = {
  name: string;
  value: string;
};

const SPACE: Token[] = [
  { name: "space-0", value: "0" },
  { name: "space-25", value: "1px" },
  { name: "space-50", value: "2px" },
  { name: "space-100", value: "4px" },
  { name: "space-200", value: "8px" },
  { name: "space-300", value: "12px" },
  { name: "space-400", value: "16px" },
  { name: "space-500", value: "20px" },
  { name: "space-600", value: "24px" },
  { name: "space-700", value: "32px" },
  { name: "space-800", value: "40px" },
  { name: "space-900", value: "48px" },
  { name: "space-1000", value: "56px" },
  { name: "space-1100", value: "64px" },
  { name: "space-1200", value: "72px" },
  { name: "space-1300", value: "96px" },
  { name: "space-1400", value: "124px" },
];

const RADIUS: Token[] = [
  { name: "radius-2xs", value: "4px" },
  { name: "radius-xs", value: "8px" },
  { name: "radius-sm", value: "12px" },
  { name: "radius-md", value: "16px" },
  { name: "radius-lg", value: "20px" },
  { name: "radius-xl", value: "24px" },
  { name: "radius-full", value: "9999px" },
];

function Section({
  title,
  items,
  kind,
}: {
  title: string;
  items: Token[];
  kind: "space" | "radius";
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-h4)",
          lineHeight: "var(--line-height-h4)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--text-headings)",
          borderBottom: "1px solid var(--border-default-default)",
          paddingBottom: "var(--space-200)",
          marginBottom: "var(--space-400)",
        }}
      >
        {title}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((t) => (
          <div
            key={t.name}
            style={{
              display: "grid",
              gridTemplateColumns: "240px 80px 1fr",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-family-mono)",
                fontSize: "var(--font-size-label-xs)",
                color: "var(--text-body)",
              }}
            >
              --{t.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-family-mono)",
                fontSize: "var(--font-size-label-xs)",
                color: "var(--text-description)",
              }}
            >
              {t.value}
            </div>
            {kind === "space" ? (
              <div
                style={{
                  height: 16,
                  width: `var(--${t.name})`,
                  minWidth: 1,
                  background: "var(--surface-action-primary-default)",
                  borderRadius: 2,
                }}
              />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "var(--surface-action-primary-default)",
                  borderRadius: `var(--${t.name})`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const meta: Meta = {
  title: "Foundations/Spacing",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Space scale" items={SPACE} kind="space" />
      <Section title="Radius scale" items={RADIUS} kind="radius" />
    </div>
  ),
};

export const Space: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Space scale" items={SPACE} kind="space" />
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Radius scale" items={RADIUS} kind="radius" />
    </div>
  ),
};
