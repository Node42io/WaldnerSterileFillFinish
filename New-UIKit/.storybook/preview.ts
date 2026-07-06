import type { Preview } from "@storybook/react";
import "../src/styles/tokens.scss";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    options: {
      // Sidebar order: Foundations, then Pages, then Components (everything
      // alphabetical within). "Widget Items" nests under Components, landing
      // next to "WidgetCard".
      storySort: {
        method: "alphabetical",
        order: ["Foundations", "Pages", "Components"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "page",
      values: [
        { name: "page", value: "var(--color-page)" },
        { name: "surface", value: "var(--surface-default-default)" },
      ],
    },
  },
};

export default preview;
