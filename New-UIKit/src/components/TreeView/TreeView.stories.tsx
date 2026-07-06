import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "./TreeView";
import type { TreeNode } from "./TreeView";

const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView",
  component: TreeView,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 420, background: "var(--color-page)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TreeView>;

// A small taxonomy: a level badge + title per node, fanning out into children.
const taxonomy: TreeNode[] = [
  {
    id: "l3",
    badge: "L3",
    text: "Lorem ipsum dolor sit amet",
    children: [
      {
        id: "l3-1",
        badge: "L2.1",
        text: "Consectetur adipiscing",
        children: [
          { id: "l3-1-1", badge: "L1.1", text: "Sed do eiusmod" },
          { id: "l3-1-2", badge: "L1.2", text: "Tempor incididunt" },
        ],
      },
      { id: "l3-2", badge: "L2.2", text: "Ut labore et dolore" },
    ],
  },
];

// A Bill-of-Materials style tree where every node also carries progress boxes.
const bom: TreeNode[] = [
  {
    id: "bom",
    badge: "L3",
    text: "Final equipment",
    metrics: [
      { label: "PET bottle", value: 40 },
      { label: "Aluminium can", value: 80 },
      { label: "Glass jar", value: 20 },
    ],
    children: [
      {
        id: "bom-1",
        badge: "L2",
        text: "Module A",
        metrics: [
          { label: "Gable carton", value: 55 },
          { label: "Pouch", value: 33 },
        ],
      },
    ],
  },
];

// Selection is controlled by the parent, so it can drive a detail panel.
function Controlled({ nodes, label }: { nodes: TreeNode[]; label?: string }) {
  const [selected, setSelected] = useState<TreeNode>(nodes[0]);
  return <TreeView nodes={nodes} label={label} selectedId={selected.id} onSelect={setSelected} />;
}

export const Default: Story = {
  render: () => <Controlled nodes={taxonomy} label="Value Network" />,
};

/** Nodes with progress boxes sit in a bordered container. */
export const WithProgressBoxes: Story = {
  render: () => <Controlled nodes={bom} />,
};
