import type { CSSProperties, ReactNode } from 'react'

// Small uppercase mono caption sat above toolbar controls and metric values.
// Centralised so the app's field labels stay byte-identical everywhere. Kept
// app-level on purpose: the kit's `Text variant="label-s"` is sans + Capitalize
// (a different look), so it can't stand in without changing the design.
const fieldLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-family-mono)',
  fontWeight: 'var(--font-weight-medium)',
  fontSize: 'var(--font-size-b4)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-labels)',
}

export function FieldLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span style={style ? { ...fieldLabelStyle, ...style } : fieldLabelStyle}>{children}</span>
}

export default FieldLabel
