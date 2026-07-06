import { Fragment } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Acorn } from "@phosphor-icons/react";
import { Button } from "./Button";

const ICON_SIZE_BY_BUTTON_SIZE = {
  xs: 16,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 24,
} as const;

const VARIANTS = [
  "primary",
  "secondary",
  "secondary-neutral",
  "secondary-outline",
  "tertiary",
] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    size: { control: "select", options: SIZES },
    iconOnly: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button CTA",
    variant: "primary",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      {VARIANTS.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      {SIZES.map((s) => (
        <Button key={s} {...args} size={s}>
          Button CTA
        </Button>
      ))}
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      {SIZES.map((s) => (
        <Button
          key={s}
          {...args}
          size={s}
          leftIcon={<Acorn size={ICON_SIZE_BY_BUTTON_SIZE[s]} weight="light" />}
        >
          Button CTA
        </Button>
      ))}
    </div>
  ),
};

export const WithTrailingIcon: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      {SIZES.map((s) => (
        <Button
          key={s}
          {...args}
          size={s}
          rightIcon={<Acorn size={ICON_SIZE_BY_BUTTON_SIZE[s]} weight="light" />}
        >
          Button CTA
        </Button>
      ))}
    </div>
  ),
};

export const IconOnly: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {SIZES.map((s) => (
        <Button
          key={s}
          {...args}
          size={s}
          iconOnly
          aria-label="Acorn"
          leftIcon={<Acorn size={ICON_SIZE_BY_BUTTON_SIZE[s]} weight="light" />}
        />
      ))}
    </div>
  ),
};

export const VariantsMatrix: Story = {
  name: "Variants × sizes matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "max-content repeat(5, max-content)",
        columnGap: 16,
        rowGap: 12,
        alignItems: "center",
      }}
    >
      <div />
      {SIZES.map((s) => (
        <div
          key={s}
          style={{
            fontFamily: "var(--font-family-mono)",
            fontSize: "var(--font-size-label-xs)",
            color: "var(--text-description)",
          }}
        >
          {s}
        </div>
      ))}
      {VARIANTS.map((v) => (
        <Fragment key={v}>
          <div
            style={{
              fontFamily: "var(--font-family-mono)",
              fontSize: "var(--font-size-label-xs)",
              color: "var(--text-description)",
            }}
          >
            {v}
          </div>
          {SIZES.map((s) => (
            <Button key={`${v}-${s}`} variant={v} size={s}>
              CTA
            </Button>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: 16, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export const OnDarkBackground: Story = {
  parameters: { backgrounds: { default: "page" } },
  decorators: [
    (Story) => (
      <div
        data-theme="dark"
        style={{ padding: 32, background: "var(--color-page)" }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      {VARIANTS.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};
