import type { Meta, StoryObj } from "@storybook/react";

type Shadow = {
  name: string;
  token: string;
  value: string;
};

const SHADOWS: Shadow[] = [
  {
    name: "shadow-s",
    token: "--shadow-s",
    value: "0 0 20px 1px rgba(187, 200, 213, 0.2)",
  },
  {
    name: "shadow-m",
    token: "--shadow-m",
    value: "0 0 20px 4px rgba(187, 200, 213, 0.2)",
  },
  {
    name: "shadow-l",
    token: "--shadow-l",
    value: "0 0 30px 6px rgba(187, 200, 213, 0.25)",
  },
  {
    name: "dropshadow",
    token: "--shadow-drop",
    value:
      "0 4px 10px 0 rgba(38, 43, 51, 0.1), 0 8px 64px -12px rgba(187, 200, 213, 0.2)",
  },
];

const FOCUS: Shadow[] = [
  {
    name: "shadow-focus",
    token: "--shadow-focus",
    value: "0 0 4px 4px var(--focus-ring)",
  },
  {
    name: "shadow-focus-error",
    token: "--shadow-focus-error",
    value: "0 0 4px 4px var(--focus-ring-error)",
  },
];

function Card({ shadow }: { shadow: Shadow }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-300)",
      }}
    >
      <div
        style={{
          width: 256,
          height: 240,
          padding: "var(--space-600)",
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-default-default)",
          boxShadow: `var(${shadow.token})`,
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-family-sans)",
            fontWeight: "var(--font-weight-medium)",
            fontSize: "var(--font-size-h5)",
            lineHeight: "var(--line-height-h5)",
            color: "var(--text-headings)",
          }}
        >
          {shadow.name}
        </p>
      </div>
      <div
        style={{
          fontFamily: "var(--font-family-mono)",
          fontSize: "var(--font-size-label-xs)",
          color: "var(--text-description)",
          lineHeight: 1.5,
        }}
      >
        <div style={{ color: "var(--text-body)" }}>{shadow.token}</div>
        <div>{shadow.value}</div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: Shadow[] }) {
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
          marginBottom: "var(--space-700)",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-1100)",
          padding: "var(--space-400) 0",
        }}
      >
        {items.map((s) => (
          <Card key={s.token} shadow={s} />
        ))}
      </div>
    </section>
  );
}

const meta: Meta = {
  title: "Foundations/Shadows",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div>
      <Section title="Shadows" items={SHADOWS} />
      <Section title="Focus rings" items={FOCUS} />
    </div>
  ),
};
