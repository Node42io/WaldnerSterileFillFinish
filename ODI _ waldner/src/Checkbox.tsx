import type { ReactNode } from 'react'
import { CheckSquare, Square } from '@phosphor-icons/react'

// App-level checkbox — the kit has no Checkbox component, so this is the single
// source of truth for the box glyph (filled/tertiary when checked, outline/
// description when not). Two modes:
//   • interactive — pass `onChange`; renders a `role="checkbox"` button with an
//     optional trailing label.
//   • glyph-only — omit `onChange`; renders just the box (aria-hidden) for
//     embedding inside another clickable element (e.g. a listbox option) that
//     owns the click and selected state.

export interface CheckboxProps {
  checked: boolean
  /** When provided the checkbox is interactive; when omitted it's a static glyph. */
  onChange?: () => void
  /** Optional trailing label (interactive mode only). */
  label?: ReactNode
  /** Box size in px. Default 16. */
  size?: number
  disabled?: boolean
  'aria-label'?: string
}

// The box glyph alone — shared by both modes.
function Glyph({ checked, size }: { checked: boolean; size: number }) {
  return checked ? (
    <CheckSquare size={size} weight="fill" style={{ color: 'var(--tertiary-default)', flexShrink: 0 }} aria-hidden />
  ) : (
    <Square size={size} weight="regular" style={{ color: 'var(--icon-description)', flexShrink: 0 }} aria-hidden />
  )
}

export function Checkbox({ checked, onChange, label, size = 16, disabled = false, 'aria-label': ariaLabel }: CheckboxProps) {
  // Glyph-only: no handler → just the visual box for embedding elsewhere.
  if (!onChange) return <Glyph checked={checked} size={size} />

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-200)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 'var(--font-size-b3)',
        color: 'var(--text-body)',
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: 'inherit',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Glyph checked={checked} size={size} />
      {label}
    </button>
  )
}

export default Checkbox
