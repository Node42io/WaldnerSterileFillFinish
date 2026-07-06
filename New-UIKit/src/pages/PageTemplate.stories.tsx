import type { Meta, StoryObj } from "@storybook/react";
import { PageTemplate } from "./PageTemplate";

const meta = {
  title: "Pages/Template",
  component: PageTemplate,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PageTemplate>;

export default meta;
type Story = StoryObj<typeof PageTemplate>;

export const Default: Story = {};
