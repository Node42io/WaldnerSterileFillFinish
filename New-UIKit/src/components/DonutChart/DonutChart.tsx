import { forwardRef } from "react";
import type { ReactNode, SVGProps } from "react";
import styles from "./DonutChart.module.css";

export interface DonutSegment {
  /** Segment value (positive); segments are normalised to the total. */
  value: number;
  /** Accessible label, e.g. "Steel". */
  label?: string;
  /** CSS colour — defaults to the design-system palette, in order. */
  color?: string;
}

export interface DonutChartProps
  extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** The segments to plot. */
  data: DonutSegment[];
  /** Square size of the chart, in px. */
  size?: number;
  /** Ring thickness in px. Defaults to ~9% of `size`. */
  thickness?: number;
  /** Gap between segments, in degrees. */
  gap?: number;
  /** Round the segment ends. */
  rounded?: boolean;
  /** Optional content centred in the hole (e.g. a total). */
  children?: ReactNode;
  /** Accessible name for the chart. */
  title?: string;
}

/** Default segment palette — matches the Figma "pie-05" order. */
const PALETTE = [
  "var(--primary-default)",
  "var(--secondary-50)",
  "var(--tertiary-200)",
  "var(--tertiary-default)",
  "var(--tertiary-800)",
];

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      size = 200,
      thickness = Math.round(size * 0.09),
      gap = 16,
      rounded = true,
      children,
      title = "Donut chart",
      className,
      ...rest
    },
    ref,
  ) => {
    const center = size / 2;
    const radius = size / 2 - thickness;
    const circumference = 2 * Math.PI * radius;

    const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0) || 1;

    let cursorAngle = 0;
    const arcs = data.map((segment, i) => {
      const fraction = Math.max(0, segment.value) / total;
      const segmentAngle = fraction * 360;
      const startAngle = cursorAngle + gap / 2;
      const drawnAngle = Math.max(0, segmentAngle - gap);
      cursorAngle += segmentAngle;

      return {
        key: segment.label ?? i,
        color: segment.color ?? PALETTE[i % PALETTE.length],
        label: segment.label,
        value: segment.value,
        dash: (circumference * drawnAngle) / 360,
        offset: -(circumference * startAngle) / 360,
      };
    });

    const segmentLabels = arcs
      .filter((a) => a.label)
      .map((a) => `${a.label}: ${a.value}`)
      .join(", ");
    const ariaLabel =
      (rest["aria-label"] as string | undefined) ?? (segmentLabels || title);

    return (
      <div
        ref={ref}
        className={[styles.root, className ?? ""].filter(Boolean).join(" ")}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          className={styles.svg}
          role="img"
          aria-label={ariaLabel}
          {...rest}
        >
          <title>{title}</title>
          <g transform={`rotate(-90 ${center} ${center})`}>
            {arcs.map((a) => (
              <circle
                key={a.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={a.color}
                strokeWidth={thickness}
                strokeLinecap={rounded ? "round" : "butt"}
                strokeDasharray={`${a.dash} ${circumference - a.dash}`}
                strokeDashoffset={a.offset}
              />
            ))}
          </g>
        </svg>

        {children != null ? <div className={styles.center}>{children}</div> : null}
      </div>
    );
  },
);

DonutChart.displayName = "DonutChart";
