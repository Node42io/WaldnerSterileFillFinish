import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src/components/Button/Button";

/* -----------------------------------------------------------------------------
 * Exploration scaffold (NOT a shipped component).
 * Goal: pick the primary/secondary action colors once and for all.
 * Each candidate overrides the CSS custom properties the Button already reads,
 * so nothing here touches tokens.css — once you choose, we wire the winner into
 * the real --surface-action-* / --text-on-action-* tokens.
 * Hex values live here only because these are candidates, not yet tokens.
 * ---------------------------------------------------------------------------- */

// ---- WCAG contrast helper ---------------------------------------------------
function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
function rating(ratio: number): { label: string; color: string } {
  if (ratio >= 4.5) return { label: "AA", color: "#2e7d32" };
  if (ratio >= 3) return { label: "AA Large", color: "#b8860b" };
  return { label: "Fail", color: "#c62828" };
}

// ---- Backgrounds to test on -------------------------------------------------
interface Bg {
  name: string;
  bg: string;
  dark: boolean;
}
const BACKGROUNDS: Bg[] = [
  { name: "Page (#eef0f2)", bg: "#eef0f2", dark: false },
  { name: "Card (#f7f7f7)", bg: "#f7f7f7", dark: false },
  { name: "White", bg: "#ffffff", dark: false },
  { name: "Page dark (#15171a)", bg: "#15171a", dark: true },
  { name: "Surface dark (#1f2329)", bg: "#1f2329", dark: true },
  { name: "Elevated dark (#262b33)", bg: "#262b33", dark: true },
];

// ---- Candidate fills --------------------------------------------------------
interface Candidate {
  name: string;
  note?: string;
  def: string;
  hover: string;
  active: string;
  text: string;
}

const PRIMARY: Candidate[] = [
  {
    name: "A · Current (dark lime)",
    note: "primary-700 attuale",
    def: "#dad41b",
    hover: "#aca215",
    active: "#7c7213",
    text: "#262b33",
  },
  {
    name: "B · Classic golden",
    note: "il giallo storico del brand",
    def: "#f4ce3f",
    hover: "#eab61a",
    active: "#c59116",
    text: "#262b33",
  },
  {
    name: "C · Vivid lime",
    note: "lime pieno, più squillante",
    def: "#f3f349",
    hover: "#dad41b",
    active: "#aca215",
    text: "#262b33",
  },
  {
    name: "D · Deep amber",
    note: "ambra caldo, più saturo/scuro",
    def: "#eab61a",
    hover: "#c59116",
    active: "#9e6e15",
    text: "#262b33",
  },
  {
    name: "E · Pale lime",
    note: "molto chiaro, look soft",
    def: "#fdff98",
    hover: "#f3f349",
    active: "#dad41b",
    text: "#262b33",
  },
  {
    name: "F · Soft lime+ (warmer)",
    note: "più scuro/saturo del pale lime, spostato verso il giallo",
    def: "#f6ee5c",
    hover: "#e6dc42",
    active: "#c9bf2b",
    text: "#262b33",
  },
];

const SECONDARY: Candidate[] = [
  {
    name: "Current · Light blue",
    note: "tertiary-50 (colore diverso dal primary)",
    def: "#e5ebef",
    hover: "#bbc8d5",
    active: "#9da8bf",
    text: "#585959",
  },
  {
    name: "Yellow tint · soft",
    note: "giallo tenue, tono del primary",
    def: "#feffe0",
    hover: "#feffc7",
    active: "#feffb3",
    text: "#262b33",
  },
  {
    name: "Yellow tint · stronger (+sat)",
    note: "giallo tenue, un filo più saturo",
    def: "#fbf59e",
    hover: "#f7ef85",
    active: "#f2e96e",
    text: "#262b33",
  },
  {
    name: "Neutral · grey",
    note: "grigio neutro (alternativa sobria)",
    def: "#f0f0f0",
    hover: "#e5e5e3",
    active: "#dededb",
    text: "#585959",
  },
];

// ---- Cell rendering ---------------------------------------------------------
function primaryVars(c: Candidate): CSSProperties {
  return {
    ["--surface-action-primary-default" as string]: c.def,
    ["--surface-action-primary-hover" as string]: c.hover,
    ["--surface-action-primary-active" as string]: c.active,
    ["--border-action-primary" as string]: c.def,
    ["--border-action-primary-hover" as string]: c.hover,
    ["--text-on-action-primary" as string]: c.text,
    ["--icon-on-action-primary" as string]: c.text,
  } as CSSProperties;
}
function secondaryVars(c: Candidate): CSSProperties {
  return {
    ["--surface-action-secondary-default" as string]: c.def,
    ["--surface-action-secondary-hover" as string]: c.hover,
    ["--surface-action-secondary-pressed" as string]: c.active,
    ["--border-action-secondary" as string]: c.def,
    ["--border-action-secondary-hover" as string]: c.hover,
    ["--text-on-action-secondary" as string]: c.text,
    ["--icon-on-action-secondary" as string]: c.text,
  } as CSSProperties;
}

function ContrastTag({ fg, bg }: { fg: string; bg: string }) {
  const ratio = contrast(fg, bg);
  const r = rating(ratio);
  return (
    <span
      style={{
        fontFamily: "var(--font-family-mono)",
        fontSize: 10,
        lineHeight: "12px",
        color: r.color,
        whiteSpace: "nowrap",
      }}
      title={`Testo su fondo bottone — WCAG ${r.label}`}
    >
      {ratio.toFixed(2)}:1 · {r.label}
    </span>
  );
}

function Row({
  candidates,
  kind,
}: {
  candidates: Candidate[];
  kind: "primary" | "secondary";
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {candidates.map((c) => (
        <div key={c.name}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: c.def,
                border: "1px solid rgba(0,0,0,.15)",
                display: "inline-block",
              }}
            />
            <strong style={{ fontFamily: "var(--font-family-sans)", fontSize: 14 }}>
              {c.name}
            </strong>
            <span style={{ fontFamily: "var(--font-family-sans)", fontSize: 12, color: "#777" }}>
              {c.def} {c.note ? `— ${c.note}` : ""}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${BACKGROUNDS.length}, 1fr)`,
              gap: 12,
            }}
          >
            {BACKGROUNDS.map((b) => (
              <div
                key={b.name}
                style={{
                  background: b.bg,
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(128,128,128,.25)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-family-sans)",
                    fontSize: 10,
                    color: b.dark ? "#c0c4ca" : "#777",
                  }}
                >
                  {b.name}
                </span>
                <div style={kind === "primary" ? primaryVars(c) : secondaryVars(c)}>
                  <Button variant={kind} size="md">
                    Action
                  </Button>
                </div>
                <ContrastTag fg={c.text} bg={c.def} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontFamily: "var(--font-family-sans)",
          fontSize: 20,
          margin: "0 0 4px",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const meta: Meta = {
  title: "Foundations/Color Exploration",
  parameters: {
    layout: "fullscreen",
    // Neutral canvas so the per-tile backgrounds read true.
    backgrounds: { default: "light" },
  },
};
export default meta;
type Story = StoryObj;

/** Bottoni reali (token cablati) affiancati su ogni sfondo, light e dark. */
export const ButtonsOnAllBackgrounds: Story = {
  render: () => (
    <div style={{ padding: 32, background: "#ffffff", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--font-family-sans)", fontSize: 28, margin: "0 0 4px" }}>
        Primary · Secondary · Outline — su tutti gli sfondi
      </h1>
      <p
        style={{
          fontFamily: "var(--font-family-sans)",
          fontSize: 14,
          color: "#555",
          maxWidth: 720,
          margin: "0 0 32px",
        }}
      >
        Bottoni reali con i token attuali. Ogni riquadro forza il proprio tema
        (light/dark), così vedi i tre affiancati nel contesto giusto. Passa il
        mouse per hover/active.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {BACKGROUNDS.map((b) => (
          <div
            key={b.name}
            data-theme={b.dark ? "dark" : "light"}
            style={{
              background: b.bg,
              borderRadius: 12,
              padding: 20,
              border: "1px solid rgba(128,128,128,.25)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-family-sans)",
                fontSize: 11,
                color: b.dark ? "#c0c4ca" : "#777",
              }}
            >
              {b.name} · {b.dark ? "dark" : "light"}
            </span>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Button variant="primary" size="md">
                Primary
              </Button>
              <Button variant="secondary" size="md">
                Secondary
              </Button>
              <Button variant="secondary-outline" size="md">
                Outline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const PrimaryAndSecondary: Story = {
  render: () => (
    <div style={{ padding: 32, background: "#ffffff", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--font-family-sans)", fontSize: 28, margin: "0 0 4px" }}>
        Primary / Secondary color exploration
      </h1>
      <p
        style={{
          fontFamily: "var(--font-family-sans)",
          fontSize: 14,
          color: "#555",
          maxWidth: 720,
          margin: "0 0 32px",
        }}
      >
        Ogni riga è un candidato; le colonne sono sfondi light e dark. Il tag sotto
        ogni bottone è il contrasto testo/fondo del bottone (soglia AA = 4.5:1).
        Passa il mouse per vedere hover/active.
      </p>

      <Section title="Primary — 5 opzioni (A = attuale)">
        <Row candidates={PRIMARY} kind="primary" />
      </Section>

      <Section title="Secondary — blu attuale vs giallo tenue">
        <Row candidates={SECONDARY} kind="secondary" />
      </Section>
    </div>
  ),
};
