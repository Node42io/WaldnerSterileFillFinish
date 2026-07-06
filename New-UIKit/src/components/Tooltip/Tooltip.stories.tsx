import type { Meta, StoryObj } from "@storybook/react";
import { Acorn } from "@phosphor-icons/react";
import { Tooltip } from "./Tooltip";
import type { TooltipArrow } from "./Tooltip";
import { Button } from "../Button/Button";

const ARROWS: TooltipArrow[] = [
  "none",
  "top-center",
  "bottom-center",
  "bottom-left",
  "bottom-right",
  "left",
  "right",
];

const DESCRIPTION =
  "Tooltips are used to describe or identify an element. In most scenarios, tooltips help the user understand the meaning, function or alt-text of an element.";

const CTA = (
  <Button variant="tertiary" size="xs" rightIcon={<Acorn size={14} weight="regular" />}>
    Button CTA
  </Button>
);

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    arrow: { control: "inline-radio", options: ARROWS },
    children: { control: "text" },
  },
  args: {
    children: "This is a tooltip",
    arrow: "bottom-center",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 48, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};

/** Rich variant: heading + description + action. */
export const WithSupportingText: Story = {
  args: {
    title: "This is a tooltip",
    description: DESCRIPTION,
    action: CTA,
  },
};

/** Every arrow position, simple variant. */
export const ArrowPositions: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 48,
        padding: 24,
      }}
    >
      {ARROWS.map((arrow) => (
        <Tooltip key={arrow} arrow={arrow}>
          {arrow}
        </Tooltip>
      ))}
    </div>
  ),
};

/** Every arrow position, rich variant. */
export const ArrowPositionsRich: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 56,
        padding: 24,
      }}
    >
      {ARROWS.map((arrow) => (
        <Tooltip
          key={arrow}
          arrow={arrow}
          title="This is a tooltip"
          description={DESCRIPTION}
          action={CTA}
        />
      ))}
    </div>
  ),
};
