import { useEffect, useRef, useState } from 'react'
import { CalendarPlus, Envelope, LinkedinLogo, Question, X } from '@phosphor-icons/react'
import { Button, Divider, Link, Logo, Text } from '@node42/ui-kit'

// Outward-facing links/contacts. Placeholders — swap for the real targets.
const DEMO_URL = 'https://node42.io'
const CONTACT_EMAIL = 'admin@node42.io'
// LinkedIn page not live yet — the link is rendered disabled until it exists.

// ---------------------------------------------------------------------------
// About / Help — opened from the navbar "?" button. Self-contained (single
// trigger), so it owns its open state and renders the modal itself. The modal
// is `position: fixed`, so it overlays regardless of where it sits in the DOM.
// ---------------------------------------------------------------------------

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button
        variant="secondary-outline"
        size="xs"
        iconOnly
        aria-label="About Node42"
        title="About Node42"
        leftIcon={<Question size={14} weight="light" />}
        onClick={() => setIsOpen(true)}
      />
      {isOpen ? <AboutModal onClose={() => setIsOpen(false)} /> : null}
    </>
  )
}

function AboutModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="About Node42"
      onMouseDown={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-600)',
        background: 'color-mix(in srgb, var(--secondary-default) 32%, transparent)',
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(520px, 100%)',
          maxHeight: '100%',
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
          <Logo style={{ height: 18, width: 'auto', display: 'block', color: 'var(--text-headings)' }} />
          <Button
            ref={closeRef}
            variant="secondary-outline"
            size="xs"
            iconOnly
            aria-label="Close"
            leftIcon={<X size={14} weight="regular" />}
            onClick={onClose}
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          />
        </div>

        {/* Body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-400)',
            padding: 'var(--space-600) var(--space-500)',
            overflow: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
            <Text variant="page-chapter" as="h2" style={{ margin: 0 }}>
              This report is a window into Node42
            </Text>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-family-sans)',
                fontSize: 'var(--font-size-b1)',
                lineHeight: 'var(--line-height-b1)',
                color: 'var(--text-body)',
              }}
            >
              What you are reading is an <strong>entry point</strong> — a curated slice of the
              analysis that the full Node42 platform produces. The complete platform turns this
              into a living workspace: continuously updated market intelligence, deeper drill-downs,
              and the data behind every figure in this report.
            </p>
          </div>

          {/* Schedule a demo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)' }}>
            <Text variant="label-s">See the full platform</Text>
            <Button
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<CalendarPlus size={16} weight="regular" />}
              onClick={() => window.open(DEMO_URL, '_blank', 'noopener,noreferrer')}
            >
              Schedule a demo
            </Button>
          </div>

          <Divider />

          {/* Stay updated + contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-300)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)' }}>
              <Text variant="label-s">Stay updated</Text>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-family-sans)',
                  fontSize: 'var(--font-size-b2)',
                  lineHeight: 'var(--line-height-b2)',
                  color: 'var(--text-body)',
                }}
              >
                Follow us on LinkedIn to keep up with what we’re building.
              </p>
            </div>
            <Link
              size="md"
              disabled
              leftIcon={<LinkedinLogo size={16} weight="regular" />}
            >
              Follow Node42 on LinkedIn (coming soon)
            </Link>
            <Link
              size="md"
              href={`mailto:${CONTACT_EMAIL}`}
              leftIcon={<Envelope size={16} weight="regular" />}
            >
              {CONTACT_EMAIL}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
