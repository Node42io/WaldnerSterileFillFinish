import { useEffect, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

/* -----------------------------------------------------------------------------
   <Swatch> — single color tile reading the resolved hex from CSS at runtime.
   Reads the value from its own DOM scope so that values inside a
   [data-theme="dark"] subtree are resolved to their dark-mode override.
   --------------------------------------------------------------------------- */

function Swatch({
  token,
  label,
  width = 96,
  height = 64,
}: {
  token: string;
  label?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState("");

  useEffect(() => {
    if (!ref.current) return;
    const update = () => {
      setHex(
        getComputedStyle(ref.current!).getPropertyValue(token).trim(),
      );
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
      subtree: true,
    });
    return () => obs.disconnect();
  }, [token]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", width }}>
      <div
        style={{
          background: `var(${token})`,
          height,
          borderRadius: 6,
          border: "1px solid var(--border-default-default)",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-family-mono)",
          fontSize: "var(--font-size-label-xs)",
          lineHeight: "var(--line-height-label-xs)",
          color: "var(--text-body)",
          marginTop: "var(--space-100)",
        }}
      >
        {label ?? token}
      </div>
      <div
        style={{
          fontFamily: "var(--font-family-mono)",
          fontSize: "var(--font-size-label-xs)",
          lineHeight: "var(--line-height-label-xs)",
          color: "var(--text-description)",
        }}
      >
        {hex || "…"}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   <Scale> — a brand / alias scale row.
   --------------------------------------------------------------------------- */

const SCALE_STEPS: Array<string | number> = [
  50,
  100,
  150,
  200,
  250,
  300,
  400,
  "default",
  600,
  700,
  800,
  900,
  1050,
  1200,
];

function Scale({
  name,
  prefix,
  steps,
}: {
  name: string;
  prefix: string;
  steps?: Array<string | number>;
}) {
  const list = steps ?? SCALE_STEPS;
  return (
    <div style={{ marginBottom: "var(--space-700)" }}>
      <h3
        style={{
          fontFamily: "var(--font-family-sans)",
          fontSize: "var(--font-size-h5)",
          lineHeight: "var(--line-height-h5)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--text-headings)",
          margin: "0 0 var(--space-300) 0",
        }}
      >
        {name}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
          gap: "var(--space-300)",
        }}
      >
        {list.map((step) => (
          <Swatch
            key={String(step)}
            token={`--${prefix}-${step}`}
            label={String(step)}
          />
        ))}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Section heading
   --------------------------------------------------------------------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-family-sans)",
        fontSize: "var(--font-size-h4)",
        lineHeight: "var(--line-height-h4)",
        fontWeight: "var(--font-weight-medium)",
        color: "var(--text-headings)",
        borderBottom: "1px solid var(--border-default-default)",
        paddingBottom: "var(--space-200)",
        margin: "0 0 var(--space-500) 0",
      }}
    >
      {children}
    </h2>
  );
}

/* -----------------------------------------------------------------------------
   Brand scales — full step list per family
   --------------------------------------------------------------------------- */

const YELLOW_STEPS = [50, 100, 200, 300, 400, "default", 600, 700, 800, 900, 1050, 1200];
const STD_STEPS = [50, 100, 200, 300, 400, "default", 600, 700, 800, 900, 1050];
const DARK_BLUE_STEPS = [50, 100, 200, 300, 400, 450, "default", 550, 600, 700, 800, 900, 1050];
const GRAY_STEPS = [50, 100, 150, 175, 200, 250, 300, 400, "default", 600, 700, 800, 900, 1050];

function BrandLevel() {
  return (
    <>
      <Scale name="Yellow (primary brand)" prefix="yellow" steps={YELLOW_STEPS} />
      <Scale name="Dark Blue (secondary brand)" prefix="dark-blue" steps={DARK_BLUE_STEPS} />
      <Scale name="Alternative Blue (tertiary brand)" prefix="alternative-blue" steps={STD_STEPS} />
      <Scale name="Red" prefix="red" steps={STD_STEPS} />
      <Scale name="Orange" prefix="orange" steps={STD_STEPS} />
      <Scale name="Green" prefix="green" steps={STD_STEPS} />
      <Scale name="Light Blue" prefix="light-blue" steps={STD_STEPS} />
      <Scale name="Gray" prefix="gray" steps={GRAY_STEPS} />
      <Scale name="Antracite" prefix="antracite" steps={STD_STEPS} />

      <div style={{ marginBottom: "var(--space-700)" }}>
        <h3
          style={{
            fontFamily: "var(--font-family-sans)",
            fontSize: "var(--font-size-h5)",
            lineHeight: "var(--line-height-h5)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--text-headings)",
            margin: "0 0 var(--space-300) 0",
          }}
        >
          Singleton
        </h3>
        <div style={{ display: "flex", gap: "var(--space-300)" }}>
          <Swatch token="--white" label="white" />
          <Swatch token="--black" label="black" />
        </div>
      </div>
    </>
  );
}

/* -----------------------------------------------------------------------------
   Alias scales
   --------------------------------------------------------------------------- */

function AliasLevel() {
  return (
    <>
      <Scale name="Primary → Yellow" prefix="primary" steps={YELLOW_STEPS} />
      <Scale name="Secondary → Dark Blue" prefix="secondary" steps={DARK_BLUE_STEPS} />
      <Scale name="Tertiary → Alternative Blue" prefix="tertiary" steps={STD_STEPS} />
      <Scale name="Danger → Red" prefix="danger" steps={STD_STEPS} />
      <Scale name="Warning → Orange" prefix="warning" steps={STD_STEPS} />
      <Scale name="Success → Green" prefix="success" steps={STD_STEPS} />
      <Scale name="Info → Light Blue" prefix="info" steps={STD_STEPS} />
      <Scale name="Neutral → Gray" prefix="neutral" steps={GRAY_STEPS} />
    </>
  );
}

/* -----------------------------------------------------------------------------
   Mapped tokens — grouped list
   --------------------------------------------------------------------------- */

type MappedGroup = { title: string; tokens: string[] };

const MAPPED_GROUPS: MappedGroup[] = [
  {
    title: "Page",
    tokens: ["--color-page"],
  },
  {
    title: "Surface — default",
    tokens: [
      "--surface-default-default",
      "--surface-default-default-2",
      "--surface-default-default-2-5",
      "--surface-default-default-3",
      "--surface-default-hover",
      "--surface-default-selected",
      "--surface-default-colored",
      "--surface-selected-colored",
      "--surface-default-loading",
      "--surface-default-disabled",
      "--surface-default-warning",
      "--surface-default-error",
      "--surface-default-information",
      "--surface-default-success",
      "--surface-primary-surface",
    ],
  },
  {
    title: "Surface — action",
    tokens: [
      "--surface-action-primary-default",
      "--surface-action-primary-hover",
      "--surface-action-primary-active",
      "--surface-action-primary-disabled",
      "--surface-action-secondary-default",
      "--surface-action-secondary-hover",
      "--surface-action-secondary-pressed",
      "--surface-action-secondary-disabled",
      "--surface-action-success-default",
      "--surface-action-success-hover",
      "--surface-action-success-active",
      "--surface-action-warning-default",
      "--surface-action-warning-hover",
      "--surface-action-warning-active",
      "--surface-action-error-default",
      "--surface-action-error-hover",
      "--surface-action-error-active",
      "--surface-action-information-default",
      "--surface-action-information-hover",
      "--surface-action-information-active",
    ],
  },
  {
    title: "Text — default",
    tokens: [
      "--text-headings",
      "--text-body",
      "--text-information",
      "--text-warning",
      "--text-success",
      "--text-error",
      "--text-labels",
      "--text-description",
      "--text-placeholder",
      "--text-link",
    ],
  },
  {
    title: "Text — on-action",
    tokens: [
      "--text-on-action-primary",
      "--text-on-action-secondary",
      "--text-on-action-disabled",
      "--text-on-action-information",
      "--text-on-action-warning",
    ],
  },
  {
    title: "Text — action",
    tokens: [
      "--text-action-tertiary",
      "--text-action-tertiary-hover",
      "--text-action-disabled",
    ],
  },
  {
    title: "Icon — default",
    tokens: [
      "--icon-headings",
      "--icon-body",
      "--icon-information",
      "--icon-warning",
      "--icon-error",
      "--icon-labels",
      "--icon-description",
      "--icon-subtle",
      "--icon-inverse",
    ],
  },
  {
    title: "Icon — on-action",
    tokens: [
      "--icon-on-action-primary",
      "--icon-on-action-secondary",
      "--icon-on-action-information",
      "--icon-on-action-warning",
      "--icon-on-action-success",
      "--icon-on-action-error",
    ],
  },
  {
    title: "Icon — action",
    tokens: [
      "--icon-action-tertiary",
      "--icon-action-tertiary-hover",
      "--icon-action-disabled",
    ],
  },
  {
    title: "Border — default",
    tokens: [
      "--border-default-default",
      "--border-default-hover",
      "--border-default-selected",
      "--border-success",
      "--border-warning",
      "--border-information",
      "--border-error",
    ],
  },
  {
    title: "Border — action",
    tokens: [
      "--border-action-primary",
      "--border-action-primary-hover",
      "--border-action-secondary",
      "--border-action-secondary-hover",
      "--border-action-focused",
      "--border-action-disabled",
    ],
  },
];

function MappedLevel() {
  return (
    <>
      {MAPPED_GROUPS.map((group) => (
        <div key={group.title} style={{ marginBottom: "var(--space-700)" }}>
          <h3
            style={{
              fontFamily: "var(--font-family-sans)",
              fontSize: "var(--font-size-h5)",
              lineHeight: "var(--line-height-h5)",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--text-headings)",
              margin: "0 0 var(--space-300) 0",
            }}
          >
            {group.title}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "var(--space-300)",
            }}
          >
            {group.tokens.map((tok) => (
              <Swatch
                key={tok}
                token={tok}
                label={tok.replace(/^--/, "")}
                width={180}
                height={48}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* -----------------------------------------------------------------------------
   Stories
   --------------------------------------------------------------------------- */

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => (
    <div style={{ maxWidth: 1200 }}>
      <SectionTitle>1. Brand</SectionTitle>
      <BrandLevel />
      <SectionTitle>2. Alias</SectionTitle>
      <AliasLevel />
      <SectionTitle>3. Mapped</SectionTitle>
      <MappedLevel />
    </div>
  ),
};

export const Brand: Story = {
  render: () => (
    <div style={{ maxWidth: 1200 }}>
      <SectionTitle>Brand</SectionTitle>
      <BrandLevel />
    </div>
  ),
};

export const Alias: Story = {
  render: () => (
    <div style={{ maxWidth: 1200 }}>
      <SectionTitle>Alias</SectionTitle>
      <AliasLevel />
    </div>
  ),
};

export const Mapped: Story = {
  render: () => (
    <div style={{ maxWidth: 1200 }}>
      <SectionTitle>Mapped</SectionTitle>
      <MappedLevel />
    </div>
  ),
};

export const MappedDarkMode: Story = {
  name: "Mapped — dark mode",
  parameters: { backgrounds: { default: "page" } },
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{
          padding: 32,
          background: "var(--color-page)",
          minHeight: "100vh",
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ maxWidth: 1200 }}>
      <SectionTitle>Mapped (dark)</SectionTitle>
      <MappedLevel />
    </div>
  ),
};
