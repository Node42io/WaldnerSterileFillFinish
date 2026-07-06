import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpRight, Question } from "@phosphor-icons/react";
import { Navbar } from "./Navbar";
import { Logo } from "../Logo/Logo";
import { Button } from "../Button/Button";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Navbar>;

const ReportContent = (
  <Navbar
    brand={
      <Logo
        aria-label="Node42"
        style={{ height: 16, width: "auto", display: "block" }}
      />
    }
  >
    <ThemeToggle />
    <Button
      variant="secondary-outline"
      size="xs"
      iconOnly
      aria-label="Help"
      leftIcon={<Question size={14} weight="light" />}
    />
    <Button
      variant="secondary"
      size="xs"
      rightIcon={<ArrowUpRight size={14} weight="light" />}
    >
      About the Company
    </Button>
  </Navbar>
);

export const Report: Story = {
  render: () => ReportContent,
};

export const ReportTablet: Story = {
  name: "Report — Tablet (768)",
  parameters: { viewport: { defaultViewport: "tablet" } },
  render: () => ReportContent,
};

export const ReportMobile: Story = {
  name: "Report — Mobile (375)",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => ReportContent,
};
