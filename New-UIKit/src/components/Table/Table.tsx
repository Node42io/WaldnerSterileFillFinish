import { forwardRef } from "react";
import type {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import type { ReactNode } from "react";
import { CaretDown, CaretUp, CaretUpDown } from "@phosphor-icons/react";
import { InfoTooltip } from "../InfoTooltip/InfoTooltip";
import styles from "./Table.module.css";

type Align = "left" | "center" | "right";

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

/* ------------------------------------------------------------------ Table */
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Zebra striping variant. The base band is the frame surface
   * (`--surface-default-default-2`); the alternate band uses
   * `--surface-default-default-3`.
   * - `rows`    — alternate body rows
   * - `columns` — alternate columns (header + body)
   * Omit for no striping.
   */
  striped?: "rows" | "columns";
}

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  ({ striped, className, children, ...rest }, ref) => (
    <div className={styles.frame}>
      <div className={styles.scroll}>
        <table
          ref={ref}
          className={cx(
            styles.table,
            striped === "rows" && styles["striped-rows"],
            striped === "columns" && styles["striped-columns"],
            className,
          )}
          {...rest}
        >
          {children}
        </table>
      </div>
    </div>
  ),
);
TableRoot.displayName = "Table";

/* ----------------------------------------------------------- Head / Body */
const TableHead = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...rest }, ref) => (
  <thead ref={ref} className={cx(styles.head, className)} {...rest} />
));
TableHead.displayName = "Table.Head";

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...rest }, ref) => (
  <tbody ref={ref} className={cx(styles.body, className)} {...rest} />
));
TableBody.displayName = "Table.Body";

/* -------------------------------------------------------------------- Row */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Highlight the row as selected. */
  selected?: boolean;
  /** Mark the row as clickable (hover affordance). */
  interactive?: boolean;
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected, interactive, className, ...rest }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cx(
        styles.row,
        interactive && styles["row-interactive"],
        selected && styles["row-selected"],
        className,
      )}
      {...rest}
    />
  ),
);
TableRow.displayName = "Table.Row";

/* ------------------------------------------------------------ HeaderCell */
export interface TableHeaderCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Text alignment. */
  align?: Align;
  /** Render a sort affordance (caret + aria-sort). */
  sortable?: boolean;
  /** Current sort direction for this column. */
  sortDirection?: "asc" | "desc";
  /** Fired when the sortable header is activated. */
  onSort?: () => void;
  /** Render an info affordance (info icon) next to the label. */
  info?: boolean;
  /** Fired when the info icon is activated (e.g. open a tooltip). */
  onInfo?: () => void;
  /** Tooltip content shown on hover/focus of the info icon (no-action variant). */
  infoTooltip?: ReactNode;
}

const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(
  (
    {
      align = "left",
      sortable,
      sortDirection,
      onSort,
      info,
      onInfo,
      infoTooltip,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const ariaSort = sortable
      ? sortDirection === "asc"
        ? "ascending"
        : sortDirection === "desc"
          ? "descending"
          : "none"
      : undefined;

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={ariaSort}
        className={cx(styles["header-cell"], styles[`align-${align}`], className)}
        {...rest}
      >
        <span className={styles["header-inner"]}>
          <span className={styles["header-label"]}>{children}</span>
          {info && (
            <InfoTooltip
              tooltip={infoTooltip}
              size={14}
              onClick={onInfo}
              style={{ color: "var(--icon-action-tertiary)" }}
            />
          )}
          {sortable && (
            <button
              type="button"
              className={styles["header-icon"]}
              onClick={onSort}
              aria-label="Sort"
            >
              {sortDirection === "asc" ? (
                <CaretUp size={14} weight="bold" />
              ) : sortDirection === "desc" ? (
                <CaretDown size={14} weight="bold" />
              ) : (
                <CaretUpDown size={14} weight="regular" />
              )}
            </button>
          )}
        </span>
      </th>
    );
  },
);
TableHeaderCell.displayName = "Table.HeaderCell";

/* -------------------------------------------------------------- DataCell */
export interface TableDataCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Text alignment. */
  align?: Align;
  /**
   * Icon-only cell: shrinks the column to its content and centers a single
   * icon (e.g. a leading status / type marker). Overrides `align`.
   */
  icon?: boolean;
}

const TableDataCell = forwardRef<HTMLTableCellElement, TableDataCellProps>(
  ({ align = "left", icon, className, ...rest }, ref) => (
    <td
      ref={ref}
      className={cx(
        styles.cell,
        icon ? styles["cell-icon"] : styles[`align-${align}`],
        className,
      )}
      {...rest}
    />
  ),
);
TableDataCell.displayName = "Table.Cell";

/* ----------------------------------------------------------- Compound API */
export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableDataCell,
});
