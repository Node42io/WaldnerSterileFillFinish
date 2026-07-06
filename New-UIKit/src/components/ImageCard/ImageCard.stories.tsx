import type { Meta, StoryObj } from "@storybook/react";
import { ImageCard } from "./ImageCard";

const meta = {
  title: "Components/ImageCard",
  component: ImageCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 200 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    src: "https://picsum.photos/seed/node42/320/320",
    alt: "",
    role: "Role",
    name: "Name Surname",
    subtitle: true,
  },
} satisfies Meta<typeof ImageCard>;

export default meta;
type Story = StoryObj<typeof ImageCard>;

export const Default: Story = {};

export const WithoutSubtitle: Story = {
  args: { subtitle: false },
};
