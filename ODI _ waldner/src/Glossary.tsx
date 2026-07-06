import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { BookOpenText, MagnifyingGlass, X } from '@phosphor-icons/react'
import { Button, InputField, Sources, Text } from '@node42/ui-kit'
import { findTerm, glossaryTerms } from './glossaryData'

// ---------------------------------------------------------------------------
// Context — one glossary modal lives at the app root; any component opens it
// via `useGlossary().open()`. Passing a term id/label deep-links to that entry
// (used by the inline "book-open" buttons); calling it bare opens the index.
// ---------------------------------------------------------------------------

interface GlossaryContextValue {
  open: (termKey?: string) => void
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null)

// The A–Z rail shown beside the term list — every letter renders, whether or
// not it has entries.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function useGlossary(): GlossaryContextValue {
  const ctx = useContext(GlossaryContext)
  if (!ctx) throw new Error('useGlossary must be used within <GlossaryProvider>')
  return ctx
}

// Imperative bridge — lets static, module-level page content (the inline
// "book-open" buttons authored outside any component) open the glossary
// without plumbing the hook through. The provider registers the handler.
let externalOpen: ((termKey?: string) => void) | null = null

export function openGlossary(termKey?: string) {
  externalOpen?.(termKey)
}

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  // The term to select when the modal opens; defaults to the first entry.
  const [pendingKey, setPendingKey] = useState<string | undefined>(undefined)

  const open = useCallback((termKey?: string) => {
    setPendingKey(termKey)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  // Expose `open` to the imperative bridge for the lifetime of the provider.
  useEffect(() => {
    externalOpen = open
    return () => {
      externalOpen = null
    }
  }, [open])

  const value = useMemo(() => ({ open }), [open])

  return (
    <GlossaryContext.Provider value={value}>
      {children}
      {isOpen ? <GlossaryModal initialKey={pendingKey} onClose={close} /> : null}
    </GlossaryContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Modal — dictionary master/detail: searchable alphabetical list on the left,
// the selected definition + sources on the right.
// ---------------------------------------------------------------------------

function GlossaryModal({
  initialKey,
  onClose,
}: {
  initialKey?: string
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(
    () => findTerm(initialKey)?.id ?? glossaryTerms[0]?.id,
  )
  const searchRef = useRef<HTMLInputElement>(null)

  // Close on Escape; focus the search field on open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    searchRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return glossaryTerms
    return glossaryTerms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.short.toLowerCase().includes(q),
    )
  }, [query])

  // Bucket the (already alphabetical) list by initial letter so the list can
  // show a full A–Z rail on the left: letters with terms align with their
  // first entry; letters with none still render, smaller and lighter.
  const byLetter = useMemo(() => {
    const m = new Map<string, typeof filtered>()
    for (const t of filtered) {
      const letter = t.term.charAt(0).toUpperCase()
      const arr = m.get(letter)
      if (arr) arr.push(t)
      else m.set(letter, [t])
    }
    return m
  }, [filtered])

  const selected =
    glossaryTerms.find((t) => t.id === selectedId) ?? filtered[0] ?? glossaryTerms[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Glossary"
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-600)',
        background: 'color-mix(in srgb, var(--secondary-default) 50%, transparent)',
      }}
    >
      <div
        // Stop backdrop close when interacting inside the panel.
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(960px, 100%)',
          height: 'min(640px, 100%)',
          background: 'var(--surface-default-default)',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border-width-default) solid var(--border-default-default)',
          boxShadow: 'var(--shadow-l)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-300)',
            padding: 'var(--space-400) var(--space-500)',
            borderBottom: 'var(--border-width-default) solid var(--border-default-default-lighter)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-default-colored)',
              color: 'var(--icon-action-tertiary)',
              flexShrink: 0,
            }}
          >
            <BookOpenText size={18} weight="regular" />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Text variant="page-chapter" as="h2" style={{ margin: 0 }}>
              Glossary
            </Text>
            <Text variant="label-s" style={{ color: 'var(--text-labels)' }}>
              Core terminology of the Node42 analysis framework
            </Text>
          </div>
          <Button
            variant="secondary-outline"
            size="xs"
            iconOnly
            aria-label="Close glossary"
            leftIcon={<X size={14} weight="regular" />}
            onClick={onClose}
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          />
        </div>

        {/* Body — list | detail */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 300,
              flexShrink: 0,
              borderRight: 'var(--border-width-default) solid var(--border-default-default-lighter)',
              minHeight: 0,
            }}
          >
            <div style={{ padding: 'var(--space-300)' }}>
              <InputField
                ref={searchRef}
                placeholder="Search terms"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                leading={<MagnifyingGlass size={16} weight="regular" />}
              />
            </div>
            <div style={{ overflow: 'auto', padding: '0 var(--space-300) var(--space-300)' }}>
              {filtered.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    padding: 'var(--space-300)',
                    fontFamily: 'var(--font-family-sans)',
                    fontSize: 'var(--font-size-b3)',
                    color: 'var(--text-description)',
                  }}
                >
                  No terms match “{query}”.
                </p>
              ) : (
                ALPHABET.map((letter) => {
                  const items = byLetter.get(letter)
                  return (
                    <div
                      key={letter}
                      style={{
                        display: 'flex',
                        gap: 'var(--space-300)',
                        alignItems: 'flex-start',
                        marginBottom: items ? 'var(--space-200)' : 0,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          width: 16,
                          paddingTop: items ? 'var(--space-200)' : 0,
                          textAlign: 'center',
                        }}
                      >
                        {items ? (
                          <Text variant="label-m" weight="medium" as="span">
                            {letter}
                          </Text>
                        ) : (
                          <Text
                            variant="label-s"
                            as="span"
                            style={{
                              display: 'inline-block',
                              color: 'var(--text-placeholder)',
                              opacity: 0.5,
                              transform: 'scale(0.8)',
                            }}
                          >
                            {letter}
                          </Text>
                        )}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {(items ?? []).map((t) => {
                        const active = t.id === selected?.id
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedId(t.id)}
                            style={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'left',
                              cursor: 'pointer',
                              border: 'none',
                              borderRadius: 'var(--radius-xs)',
                              padding: 'var(--space-200) var(--space-300)',
                              marginBottom: 2,
                              background: active ? 'var(--surface-default-selected)' : 'transparent',
                              color: 'var(--text-body)',
                              font: 'inherit',
                            }}
                          >
                            <span
                              style={{
                                display: 'block',
                                fontFamily: 'var(--font-family-sans)',
                                fontSize: 'var(--font-size-b2)',
                                fontWeight: active
                                  ? 'var(--font-weight-medium)'
                                  : 'var(--font-weight-regular)',
                                color: active ? 'var(--text-action-tertiary)' : 'var(--text-body)',
                              }}
                            >
                              {t.term}
                            </span>
                            <span
                              style={{
                                display: 'block',
                                fontFamily: 'var(--font-family-sans)',
                                fontSize: 'var(--font-size-b3)',
                                color: 'var(--text-description)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t.short}
                            </span>
                          </button>
                        )
                        })}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Detail */}
          <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 'var(--space-600)' }}>
            {selected ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-400)' }}>
                <Text variant="page-chapter" as="h3" style={{ margin: 0 }}>
                  {selected.term}
                </Text>
                {selected.definition.split('\n\n').map((para, i) => (
                  <p
                    key={i}
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-family-sans)',
                      fontSize: 'var(--font-size-b1)',
                      lineHeight: 'var(--line-height-b1)',
                      color: 'var(--text-body)',
                    }}
                  >
                    {para}
                  </p>
                ))}
                {selected.sources && selected.sources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
                    <Text variant="label-s">Sources</Text>
                    {selected.sources.map((s, i) => (
                      <Sources key={s.href} index={i + 1} href={s.href} linkText={s.label} />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared navbar actions — the global, persistent glossary entry point sits
// beside the theme toggle and the help button.
// ---------------------------------------------------------------------------

export function GlossaryButton() {
  const { open } = useGlossary()
  return (
    <Button
      variant="secondary-outline"
      size="xs"
      iconOnly
      aria-label="Open glossary"
      title="Glossary"
      leftIcon={<BookOpenText size={14} weight="regular" />}
      onClick={() => open()}
    />
  )
}
