import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { Table } from "./Table";
import { Badge } from "../Badge/Badge";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: "var(--color-page)", maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Table>;

const rows = [
  { material: "Steel", share: 40, group: "Ferrous" },
  { material: "Aluminium", share: 24, group: "Light metal" },
  { material: "Copper", share: 18, group: "Non-ferrous" },
  { material: "Zinc", share: 12, group: "Non-ferrous" },
  { material: "Other", share: 6, group: "—" },
];

export const Default: Story = {
  render: () => (
    <Table aria-label="Materials">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Material</Table.HeaderCell>
          <Table.HeaderCell>Group</Table.HeaderCell>
          <Table.HeaderCell align="right">Share</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.material}>
            <Table.Cell>{r.material}</Table.Cell>
            <Table.Cell>{r.group}</Table.Cell>
            <Table.Cell align="right">{r.share}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

/** Icon-only leading column — `Table.Cell icon` hugs the icon (narrow column). */
export const IconColumn: Story = {
  render: () => (
    <Table aria-label="Materials">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell aria-label="" />
          <Table.HeaderCell>Material</Table.HeaderCell>
          <Table.HeaderCell>Group</Table.HeaderCell>
          <Table.HeaderCell align="right">Share</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.material}>
            <Table.Cell icon>
              <CaretRight size={16} weight="regular" />
            </Table.Cell>
            <Table.Cell>{r.material}</Table.Cell>
            <Table.Cell>{r.group}</Table.Cell>
            <Table.Cell align="right">{r.share}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

/** Header `info` icon with a hover/focus tooltip (rendered in a portal so it
 *  escapes the table's overflow), alongside the sort affordance. */
export const HeaderInfoTooltip: Story = {
  render: () => (
    <Table aria-label="Materials">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell info infoTooltip="The material name.">
            Material
          </Table.HeaderCell>
          <Table.HeaderCell info infoTooltip="Material family / classification.">
            Group
          </Table.HeaderCell>
          <Table.HeaderCell
            align="right"
            info
            infoTooltip="Share of total volume."
            sortable
          >
            Share
          </Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.material}>
            <Table.Cell>{r.material}</Table.Cell>
            <Table.Cell>{r.group}</Table.Cell>
            <Table.Cell align="right">{r.share}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

/** Striped rows — alternate body rows between surface-2 and surface-3. */
export const StripedRows: Story = {
  render: () => (
    <Table aria-label="Materials" striped="rows">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Material</Table.HeaderCell>
          <Table.HeaderCell>Group</Table.HeaderCell>
          <Table.HeaderCell align="right">Share</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.material}>
            <Table.Cell>{r.material}</Table.Cell>
            <Table.Cell>{r.group}</Table.Cell>
            <Table.Cell align="right">{r.share}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

/** Striped columns — alternate columns between surface-2 and surface-3. */
export const StripedColumns: Story = {
  render: () => (
    <Table aria-label="Materials" striped="columns">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Material</Table.HeaderCell>
          <Table.HeaderCell>Group</Table.HeaderCell>
          <Table.HeaderCell align="right">Share</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.material}>
            <Table.Cell>{r.material}</Table.Cell>
            <Table.Cell>{r.group}</Table.Cell>
            <Table.Cell align="right">{r.share}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

/** Rich cells — compose Badge (or any component) inside a data cell. */
export const WithBadges: Story = {
  render: () => (
    <Table aria-label="Materials">
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Material</Table.HeaderCell>
          <Table.HeaderCell>Group</Table.HeaderCell>
          <Table.HeaderCell align="right">Share</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r.material}>
            <Table.Cell>{r.material}</Table.Cell>
            <Table.Cell>
              <Badge variant="color">{r.group}</Badge>
            </Table.Cell>
            <Table.Cell align="right">{r.share}%</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  ),
};

/** Sortable header + selectable interactive rows (controlled). */
export const SortableSelectable: Story = {
  render: () => {
    const [dir, setDir] = useState<"asc" | "desc">("desc");
    const [selected, setSelected] = useState("Steel");
    const sorted = useMemo(
      () =>
        [...rows].sort((a, b) =>
          dir === "asc" ? a.share - b.share : b.share - a.share,
        ),
      [dir],
    );
    return (
      <Table aria-label="Materials">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Material</Table.HeaderCell>
            <Table.HeaderCell>Group</Table.HeaderCell>
            <Table.HeaderCell
              align="right"
              sortable
              sortDirection={dir}
              onSort={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
            >
              Share
            </Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sorted.map((r) => (
            <Table.Row
              key={r.material}
              interactive
              selected={selected === r.material}
              onClick={() => setSelected(r.material)}
            >
              <Table.Cell>{r.material}</Table.Cell>
              <Table.Cell>{r.group}</Table.Cell>
              <Table.Cell align="right">{r.share}%</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};
