import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react'
import { Button, InputField } from '@node42/ui-kit'
import { Checkbox } from './Checkbox'

// App-level dropdown composed from kit primitives (Button trigger + a token-styled
// popover list). The kit has no Select component, so this fills that gap while
// staying visually consistent with @node42/ui-kit.
//
// Supports single-select (value/onChange) and multi-select (multiple + values/
// onToggle). In multi-select mode each option carries a checkbox and picking one
// keeps the menu open so several can be chosen in a row.

export interface DropdownOption {
  value: string
  label: ReactNode
}

export interface DropdownProps {
  options: DropdownOption[]
  placeholder?: string
  ariaLabel?: string
  /** Show a small filter field at the top of the menu (for long option lists). */
  searchable?: boolean
  /** Single-select value (ignored when `multiple`). */
  value?: string
  /** Single-select change handler. */
  onChange?: (value: string) => void
  /** Enable multi-select: checkboxes per option, menu stays open on pick. */
  multiple?: boolean
  /** Multi-select selected values. */
  values?: string[]
  /** Multi-select toggle handler (add if absent, remove if present). */
  onToggle?: (value: string) => void
}

// Plain-text of an option label, for the in-menu filter.
const labelText = (o: DropdownOption): string => (typeof o.label === 'string' ? o.label : o.value)

export function Dropdown({
  options,
  value,
  onChange,
  multiple = false,
  values = [],
  onToggle,
  placeholder = 'Select…',
  ariaLabel,
  searchable = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  // Open the menu, resetting the in-menu filter each time it opens.
  const openMenu = () => {
    setQ('')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const shown = useMemo(() => {
    if (!searchable || !q.trim()) return options
    const needle = q.trim().toLowerCase()
    return options.filter((o) => labelText(o).toLowerCase().includes(needle))
  }, [options, q, searchable])

  // Trigger text: in multi mode show a count once anything is picked.
  const triggerLabel = multiple
    ? values.length === 0
      ? placeholder
      : `${values.length} selected`
    : selected
    ? selected.label
    : placeholder

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant="secondary-outline"
        size="sm"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        // Match the SearchBar (size sm) exactly: lighter border + identical
        // trigger text (sans · B2 · regular · text-body).
        style={{
          borderColor: 'var(--border-default-default-lighter)',
          fontFamily: 'var(--font-family-sans)',
          fontSize: 'var(--font-size-b2)',
          fontWeight: 'var(--font-weight-regular)',
          letterSpacing: 'var(--letter-spacing-b2)',
          color: 'var(--text-body)',
        }}
        rightIcon={
          <CaretDown size={12} weight="regular" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease' }} />
        }
      >
        {triggerLabel}
      </Button>

      {open ? (
        <div
          role="listbox"
          aria-multiselectable={multiple || undefined}
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--space-100))',
            left: 0,
            zIndex: 20,
            minWidth: '100%',
            background: 'var(--surface-default-default)',
            border: '1px solid var(--border-default-default-lighter)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-s)',
            padding: 'var(--space-100)',
            whiteSpace: 'nowrap',
          }}
        >
          {searchable ? (
            <div style={{ margin: 'var(--space-50) var(--space-50) var(--space-100)' }}>
              <InputField
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                aria-label="Filter options"
                leading={<MagnifyingGlass size={16} weight="regular" style={{ color: 'var(--icon-description)' }} aria-hidden />}
              />
            </div>
          ) : null}

          <div style={{ maxHeight: 288, overflow: 'auto' }}>
            {shown.length === 0 ? (
              <div style={{ padding: 'var(--space-200) var(--space-300)', fontFamily: 'var(--font-family-sans)', fontSize: 'var(--font-size-b2)', color: 'var(--text-description)' }}>
                No matches
              </div>
            ) : (
              shown.map((o) => {
                const isSel = multiple ? values.includes(o.value) : o.value === value
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    onClick={() => {
                      if (multiple) {
                        onToggle?.(o.value)
                        // keep the menu open so several can be picked in a row
                      } else {
                        onChange?.(o.value)
                        setOpen(false)
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel) e.currentTarget.style.background = 'var(--surface-default-hover)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel) e.currentTarget.style.background = 'transparent'
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-200)',
                      width: '100%',
                      textAlign: 'left',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family-sans)',
                      fontSize: 'var(--font-size-b2)',
                      letterSpacing: 'var(--letter-spacing-b2)',
                      color: 'var(--text-body)',
                      background: isSel && !multiple ? 'var(--surface-selected-colored)' : 'transparent',
                      borderRadius: 'var(--radius-xs)',
                      padding: 'var(--space-200) var(--space-300)',
                    }}
                  >
                    {multiple ? <Checkbox checked={isSel} size={16} /> : null}
                    <span>{o.label}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Dropdown
