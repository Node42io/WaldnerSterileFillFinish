import type { Meta, StoryObj } from "@storybook/react";

type Style = {
  name: string;
  family: "sans" | "mono";
  size: string;
  lineHeight: string;
  letterSpacing: string;
  weight: "regular" | "medium";
  sample: string;
};

const HEADINGS: Style[] = [
  { name: "H1-XL Regular", family: "sans", size: "h1-xl", lineHeight: "h1-xl", letterSpacing: "h1-xl", weight: "regular", sample: "The quick brown fox" },
  { name: "H1-XL Medium", family: "sans", size: "h1-xl", lineHeight: "h1-xl", letterSpacing: "h1-xl", weight: "medium", sample: "The quick brown fox" },
  { name: "H1-S Regular", family: "sans", size: "h1-s", lineHeight: "h1-s", letterSpacing: "h1-s", weight: "regular", sample: "The quick brown fox" },
  { name: "H1-S Medium", family: "sans", size: "h1-s", lineHeight: "h1-s", letterSpacing: "h1-s", weight: "medium", sample: "The quick brown fox" },
  { name: "H2 Regular", family: "sans", size: "h2", lineHeight: "h2", letterSpacing: "h2", weight: "regular", sample: "The quick brown fox jumps" },
  { name: "H2 Medium", family: "sans", size: "h2", lineHeight: "h2", letterSpacing: "h2", weight: "medium", sample: "The quick brown fox jumps" },
  { name: "H3 Regular", family: "sans", size: "h3", lineHeight: "h3", letterSpacing: "h3", weight: "regular", sample: "The quick brown fox jumps over" },
  { name: "H3 Medium", family: "sans", size: "h3", lineHeight: "h3", letterSpacing: "h3", weight: "medium", sample: "The quick brown fox jumps over" },
  { name: "H4 Regular", family: "sans", size: "h4", lineHeight: "h4", letterSpacing: "h4", weight: "regular", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "H4 Medium", family: "sans", size: "h4", lineHeight: "h4", letterSpacing: "h4", weight: "medium", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "H5 Regular", family: "sans", size: "h5", lineHeight: "h5", letterSpacing: "h5", weight: "regular", sample: "The quick brown fox jumps over the lazy dog" },
  { name: "H5 Medium", family: "sans", size: "h5", lineHeight: "h5", letterSpacing: "h5", weight: "medium", sample: "The quick brown fox jumps over the lazy dog" },
];

const BODY: Style[] = [
  { name: "B1 Regular", family: "sans", size: "b1", lineHeight: "b1", letterSpacing: "b1", weight: "regular", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B1 Medium", family: "sans", size: "b1", lineHeight: "b1", letterSpacing: "b1", weight: "medium", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B2 Regular", family: "sans", size: "b2", lineHeight: "b2", letterSpacing: "b2", weight: "regular", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B2 Medium", family: "sans", size: "b2", lineHeight: "b2", letterSpacing: "b2", weight: "medium", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B3 Regular", family: "sans", size: "b3", lineHeight: "b3", letterSpacing: "b3", weight: "regular", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B3 Medium", family: "sans", size: "b3", lineHeight: "b3", letterSpacing: "b3", weight: "medium", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B4 Regular", family: "sans", size: "b4", lineHeight: "b4", letterSpacing: "b4", weight: "regular", sample: "The quick brown fox jumps over the lazy dog." },
  { name: "B4 Medium", family: "sans", size: "b4", lineHeight: "b4", letterSpacing: "b4", weight: "medium", sample: "The quick brown fox jumps over the lazy dog." },
];

const LABELS: Style[] = [
  { name: "Label-L", family: "sans", size: "label-l", lineHeight: "label-l", letterSpacing: "label-l", weight: "regular", sample: "LABEL TEXT" },
  { name: "Label-M", family: "sans", size: "label-m", lineHeight: "label-m", letterSpacing: "label-m", weight: "regular", sample: "LABEL TEXT" },
  { name: "Label-S", family: "sans", size: "label-s", lineHeight: "label-s", letterSpacing: "label-s", weight: "regular", sample: "LABEL TEXT" },
  { name: "Label-XS", family: "sans", size: "label-xs", lineHeight: "label-xs", letterSpacing: "label-xs", weight: "regular", sample: "LABEL TEXT" },
];

function styleToCss(style: Style): React.CSSProperties {
  return {
    fontFamily: `var(--font-family-${style.family})`,
    fontSize: `var(--font-size-${style.size})`,
    lineHeight: `var(--line-height-${style.lineHeight})`,
    letterSpacing: `var(--letter-spacing-${style.letterSpacing})`,
    fontWeight: `var(--font-weight-${style.weight})`,
    color: "var(--text-body)",
    margin: 0,
  };
}

function specsLabel(style: Style): string {
  const family = style.family === "sans" ? "Aeonik" : "Aeonik";
  const w = style.weight === "regular" ? "400" : "500";
  return `${family} · ${w} · size: var(--font-size-${style.size}) · line-height: var(--line-height-${style.lineHeight})`;
}

function Section({ title, items }: { title: string; items: Style[] }) {
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

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {items.map((s) => (
          <div key={s.name}>
            <div
              style={{
                fontFamily: "var(--font-family-sans)",
                fontSize: "var(--font-size-label-xs)",
                color: "var(--text-description)",
                marginBottom: "var(--space-200)",
              }}
            >
              <strong style={{ color: "var(--text-body)" }}>{s.name}</strong>
              {" · "}
              {specsLabel(s)}
            </div>
            <p style={styleToCss(s)}>{s.sample}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Headings (Aeonik)" items={HEADINGS} />
      <Section title="Body (Aeonik)" items={BODY} />
      <Section title="Labels (Aeonik)" items={LABELS} />
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Headings (Aeonik)" items={HEADINGS} />
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Body (Aeonik)" items={BODY} />
    </div>
  ),
};

export const Labels: Story = {
  render: () => (
    <div style={{ maxWidth: 960 }}>
      <Section title="Labels (Aeonik)" items={LABELS} />
    </div>
  ),
};
