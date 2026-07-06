import type { Meta, StoryObj } from "@storybook/react";

/**
 * Desktop grid spec — 13 columns
 * Reference frame: 1440px wide.
 *
 * - Top row (navbar) ............ 40px tall  (--space-800)
 * - 13 columns total, zero-indexed (sidebar = column 0):
 *     · col 0 = sidebar .......... 168px
 *     · cols 1–12 = content ...... 92px wide each (12 columns)
 * - Gutter (between every column) 12px       (--space-300)
 * - Right margin ................ 24px       (--space-600)
 * - Left margin ................. 0  (sidebar sits flush to the edge)
 *
 * Total = 168 + 12·92 + 12·12 + 24 = 1440 (fits exactly).
 */

const FRAME = 1440;
const NAVBAR = 40;
const SIDEBAR = 168;
const CONTENT_COLS = 12;
const TOTAL_COLS = SIDEBAR ? CONTENT_COLS + 1 : CONTENT_COLS; // 13 incl. sidebar
const COL_W = 92;
const GUTTER = 12;
const MARGIN_R = 24;
const BODY_H = 360;

const GRID_W = CONTENT_COLS * COL_W + (CONTENT_COLS - 1) * GUTTER; // 1236
const GRID_LEFT = SIDEBAR + GUTTER; // 180 — also FRAME − MARGIN_R − GRID_W

type Row = { label: string; value: string; token?: string };

const SPEC: Row[] = [
  { label: "Reference width", value: "1440px" },
  { label: "Columns (incl. sidebar)", value: `${TOTAL_COLS}` },
  { label: "Navbar (top row) height", value: "40px", token: "--space-800" },
  { label: "Sidebar (col 0) width", value: "168px" },
  { label: "Content columns", value: `${CONTENT_COLS} × 92px` },
  { label: "Gutter", value: "12px", token: "--space-300" },
  { label: "Right margin", value: "24px", token: "--space-600" },
  { label: "Left margin", value: "0px" },
];

const mono = {
  fontFamily: "var(--font-family-mono)",
  fontSize: "var(--font-size-label-xs)",
} as const;

function SpecTable() {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        maxWidth: 560,
        marginBottom: "var(--space-700)",
      }}
    >
      <tbody>
        {SPEC.map((r) => (
          <tr
            key={r.label}
            style={{ borderBottom: "1px solid var(--border-default-default)" }}
          >
            <td
              style={{
                padding: "var(--space-200) var(--space-300)",
                fontFamily: "var(--font-family-sans)",
                fontSize: "var(--font-size-body-s)",
                color: "var(--text-body)",
              }}
            >
              {r.label}
            </td>
            <td
              style={{
                padding: "var(--space-200) var(--space-300)",
                textAlign: "right",
                color: "var(--text-headings)",
                ...mono,
              }}
            >
              {r.value}
            </td>
            <td
              style={{
                padding: "var(--space-200) var(--space-300)",
                textAlign: "right",
                color: "var(--text-description)",
                ...mono,
              }}
            >
              {r.token ?? ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GridOverlay() {
  const columns = Array.from({ length: CONTENT_COLS }, (_, i) => {
    const left = GRID_LEFT + i * (COL_W + GUTTER);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          top: 0,
          height: "100%",
          left,
          width: COL_W,
          background: "var(--surface-action-primary-default)",
          opacity: 0.25,
          display: "flex",
          justifyContent: "center",
          paddingTop: "var(--space-200)",
          ...mono,
          color: "var(--text-headings)",
          boxSizing: "border-box",
        }}
      >
        {i + 1}
      </div>
    );
  });

  return (
    <div
      style={{
        position: "relative",
        width: FRAME,
        background: "var(--surface-default-default)",
        border: "1px solid var(--border-default-default)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
      }}
    >
      {/* Navbar row */}
      <div
        style={{
          height: NAVBAR,
          borderBottom: "1px solid var(--border-default-default)",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--space-400)",
          background: "var(--surface-default-default-2)",
          ...mono,
          color: "var(--text-description)",
        }}
      >
        navbar · 40px
      </div>

      {/* Body: sidebar (col 1) + content column overlay */}
      <div style={{ position: "relative", height: BODY_H, display: "flex" }}>
        {/* Sidebar = column 1 */}
        <div
          style={{
            width: SIDEBAR,
            flexShrink: 0,
            borderRight: "1px solid var(--border-default-default)",
            background: "var(--surface-default-default-2)",
            display: "flex",
            justifyContent: "center",
            paddingTop: "var(--space-300)",
            ...mono,
            color: "var(--text-description)",
          }}
        >
          00 · sidebar · 168px
        </div>

        {/* Content column overlays 2–13 (absolute, measured from frame left) */}
        {columns}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Grid",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const Desktop: Story = {
  render: () => (
    <div>
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
        Desktop grid — 13 columns @ 1440
      </h2>

      <SpecTable />

      <div style={{ overflowX: "auto", paddingBottom: "var(--space-400)" }}>
        <GridOverlay />
      </div>
    </div>
  ),
};
