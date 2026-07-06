import { Fragment, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Briefcase, CaretDown, Cube, Eye, ListChecks, Megaphone, Rows, ShoppingCart, SquaresFour, Target, Users, Wrench } from '@phosphor-icons/react'
import {
  Badge,
  Breadcrumb,
  Button,
  ConfidenceBadge,
  PageTemplate,
  SearchBar,
  Table,
  Text,
  Toggle,
  Tooltip,
  WidgetCard,
} from '@node42/ui-kit'
import type { BadgeVariant } from '@node42/ui-kit'
import {
  DEFAULT_ODI_SLUG,
  loadOdiUnit,
  market,
  odiIndex,
  ROLE_LABEL,
  ROLE_ORDER,
} from './data'
import type { OdiRow, OdiStakeholder, OdiUnitData } from './data'
import { Dropdown } from './Dropdown'
import { FieldLabel } from './FieldLabel'
import { Checkbox } from './Checkbox'
import { ReportActions } from './ReportActions'
import { UPSELL_COPY } from './copy'

// ODI Matrix — the Outcome-Driven Innovation (ODI) needs table for one value-
// network unit: every desired outcome rated on Importance × Satisfaction, from
// which an Opportunity score is derived. A unit selector switches between the 40
// rated units; the selected unit's needs are lazy-loaded and rendered here.

const mono: CSSProperties = { fontFamily: 'var(--font-family-mono)', fontWeight: 'var(--font-weight-medium)' }

// Opportunity bands and innovation-status gap thresholds — the single source of
// truth for the scoring cut-offs used across this page.
const OPP_HIGH = 12 // opportunity ≥ this → high (error)
const OPP_MODERATE = 10 // opportunity ≥ this → moderate (warning)
const GAP_UNDERSERVED = 3 // importance − satisfaction ≥ this → underserved
const GAP_OVERSERVED = -1 // importance − satisfaction ≤ this → overserved

function impVariant(band: string): BadgeVariant {
  return band === 'very high' || band === 'high' ? 'success' : 'neutral'
}
// Opportunity band → Badge colour + word (ODI opportunity algorithm).
function oppVariant(opp: number): BadgeVariant {
  if (opp >= OPP_HIGH) return 'error'
  if (opp >= OPP_MODERATE) return 'warning'
  return 'neutral'
}
function oppWord(opp: number): string {
  if (opp >= OPP_HIGH) return 'high'
  if (opp >= OPP_MODERATE) return 'moderate'
  return 'low'
}
function satVariant(band: string): BadgeVariant {
  if (band === 'low' || band === 'very low') return 'error'
  if (band === 'medium') return 'warning'
  return 'success'
}

const meanConf = (r: OdiRow) => Math.round((r.imp_conf + r.sat_conf) / 2)

// ODI innovation status from the importance vs. satisfaction gap: underserved
// (importance outruns satisfaction), overserved (the reverse), or served.
// `order` drives the column sort (most actionable first).
function statusOf(r: OdiRow): { label: string; variant: BadgeVariant; order: number; note: string } {
  const gap = r.imp - r.sat
  if (gap >= GAP_UNDERSERVED) return { label: 'Underserved', variant: 'error', order: 3, note: 'Importance clearly exceeds satisfaction — a real innovation opportunity.' }
  if (gap <= GAP_OVERSERVED) return { label: 'Overserved', variant: 'information', order: 1, note: 'Satisfaction exceeds importance — likely more invested here than needed.' }
  return { label: 'Served', variant: 'success', order: 2, note: 'Satisfaction is roughly in line with importance — adequately met.' }
}

// ---- sortable columns (the leftmost data column is Opportunity; a caret column
// sits to its left as the expand affordance) ----
type SortKey = 'opp' | 'imp' | 'sat' | 'status' | 'conf' | 'source_job' | 'stk' | 'stmt'
const TEXT_KEYS: SortKey[] = ['source_job', 'stk', 'stmt']

// `sortable: false` drops the column's sort caret (Stakeholder / Job / Need are
// descriptive, not ranked — they carry an info tooltip instead).
const columns: { key: SortKey; label: string; align?: 'left' | 'right'; info?: string; sortable?: boolean }[] = [
  { key: 'opp', label: 'Opp.', info: 'Opportunity = importance + max(importance − satisfaction, 0). Higher = more underserved and more actionable.' },
  { key: 'stk', label: 'Stakeholder', sortable: false, info: 'The stakeholder role that holds this need — job executor, overseer, purchase influencer or executor.' },
  { key: 'source_job', label: 'Job', sortable: false, info: 'The core functional job this desired outcome was derived from.' },
  { key: 'stmt', label: 'Need (desired outcome)', sortable: false, info: 'The desired outcome phrased as a measurable need.' },
  { key: 'status', label: 'Status', info: 'Innovation status from the importance − satisfaction gap: underserved · served · overserved.' },
  { key: 'imp', label: 'Imp.', info: 'Importance — how important this desired outcome is to the stakeholder, rated 0–10.' },
  { key: 'sat', label: 'Sat.', info: 'Satisfaction — how well the outcome is met today, rated 0–10.' },
  { key: 'conf', label: 'Conf.', info: 'Confidence — mean of the importance and satisfaction confidences on a calibrated confidence scale.' },
]

// Expanded-row rationale panel — two rationale cards side by side (Importance /
// Satisfaction), each showing value · band · confidence + its rationale text.
function MetricCard({ label, value, band, variant, conf, rat }: { label: string; value: number; band: string; variant: BadgeVariant; conf: number; rat: string }) {
  const caption = <FieldLabel>{label}</FieldLabel>
  return (
    <div style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--space-400)', background: 'var(--surface-default-default)', display: 'flex', flexDirection: 'column', gap: 'var(--space-300)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', flexWrap: 'wrap' }}>
        {caption}
        <span style={{ ...mono, fontSize: 'var(--font-size-b1)', color: 'var(--text-headings)' }}>{value.toFixed(1)}</span>
        <Badge variant={variant} size="xs">{band}</Badge>
        <div style={{ marginLeft: 'auto' }}>
          {/* Neutral (uncoloured) confidence: same shape as ConfidenceBadge but
              no level colour — keeps the row cards from carrying too many hues. */}
          <Badge variant="neutral" size="xs" icon={<Target weight="regular" aria-hidden />}>{conf}%</Badge>
        </div>
      </div>
      <Text variant="b2" style={{ color: 'var(--text-body)' }}>{rat}</Text>
    </div>
  )
}

function RationalePanel({ r }: { r: OdiRow }) {
  return (
    <div style={{ padding: 'var(--space-500)', background: 'var(--surface-default-default-2)', borderTop: '1px solid var(--border-card)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-400)' }}>
        <MetricCard label="Importance" value={r.imp} band={r.imp_band} variant={impVariant(r.imp_band)} conf={r.imp_conf} rat={r.imp_rat} />
        <MetricCard label="Satisfaction" value={r.sat} band={r.sat_band} variant={satVariant(r.sat_band)} conf={r.sat_conf} rat={r.sat_rat} />
      </div>
    </div>
  )
}

// Table / Graph view switch — a platform upsell. Only Table works; Graph is
// disabled, and a transparent catcher over that half surfaces the unlock
// tooltip on hover (a disabled button doesn't reliably fire mouse events).
function ViewToggle() {
  const [hint, setHint] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <Toggle
        aria-label="View mode"
        value="table"
        onChange={() => {}}
        options={[
          { value: 'table', icon: <Rows size={16} weight="regular" />, label: 'Table' },
          { value: 'graph', icon: <SquaresFour size={16} weight="regular" />, label: 'Graph', disabled: true },
        ]}
      />
      {/* hover catcher over the disabled Graph segment (right half) */}
      <span
        aria-hidden="true"
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', cursor: 'not-allowed' }}
      />
      {hint ? (
        <div style={{ position: 'absolute', top: 'calc(100% + var(--space-200))', right: 0, zIndex: 30, pointerEvents: 'none' }}>
          <Tooltip arrow="top-center" maxWidth={220}>
            {UPSELL_COPY}
          </Tooltip>
        </div>
      ) : null}
    </div>
  )
}

// Small level badge used in the unit selector + meta strip.
const LEVEL_BADGE: Record<string, { bg: string; fg: string }> = {
  L7: { bg: 'var(--tertiary-800)', fg: 'var(--white)' },
  L6: { bg: 'var(--tertiary-default)', fg: 'var(--white)' },
  L6a: { bg: 'var(--tertiary-400)', fg: 'var(--white)' },
  L5: { bg: 'var(--tertiary-200)', fg: 'var(--secondary-700)' },
  L4: { bg: 'var(--tertiary-100)', fg: 'var(--secondary-700)' },
  L3: { bg: 'var(--tertiary-50)', fg: 'var(--secondary-700)' },
}
function levelBadgeStyle(level: string): CSSProperties {
  const c = LEVEL_BADGE[level] ?? { bg: 'var(--surface-default-default-2)', fg: 'var(--text-body)' }
  return { background: c.bg, color: c.fg }
}

// The 40 rated units, ordered by opportunity (desc) for the selector.
const unitOptions = [...odiIndex]
  .sort((a, b) => b.top_opportunity - a.top_opportunity || a.unit_name.localeCompare(b.unit_name))
  .map((e) => ({
    value: e.slug,
    label: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-200)', minWidth: 0 }}>
        <Badge variant="color" size="xs" style={levelBadgeStyle(e.level)}>{e.level}</Badge>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.unit_name}</span>
        {e.product_matched ? <Cube size={13} weight="fill" style={{ color: 'var(--primary-500)', flexShrink: 0 }} aria-label="Waldner product match" /> : null}
        <span style={{ ...mono, fontSize: 'var(--font-size-b4)', color: 'var(--text-labels)', flexShrink: 0 }}>{e.needs} needs</span>
      </span>
    ),
  }))

const validSlugs = new Set(odiIndex.map((e) => e.slug))

export function ODIMatrix() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Selected unit — seeded from ?unit=<slug> (deep-linked from the market page),
  // falling back to the default highest-opportunity unit.
  const urlSlug = searchParams.get('unit')
  const initialSlug = urlSlug && validSlugs.has(urlSlug) ? urlSlug : DEFAULT_ODI_SLUG
  const [slug, setSlug] = useState<string>(initialSlug)
  // Loaded ODI data tagged with the slug it belongs to, so `unitData` is derived
  // (null while the newly-selected unit is still loading) with no synchronous
  // state-clearing inside the effect.
  const [loaded, setLoaded] = useState<{ slug: string; data: OdiUnitData } | null>(null)

  const selectUnit = (next: string) => {
    setSlug(next)
    setSearchParams(next === DEFAULT_ODI_SLUG ? {} : { unit: next }, { replace: true })
  }

  // Lazy-load the selected unit's ODI needs.
  useEffect(() => {
    let live = true
    loadOdiUnit(slug).then((d) => {
      if (live) setLoaded({ slug, data: d })
    })
    return () => {
      live = false
    }
  }, [slug])

  const unitData = loaded?.slug === slug ? loaded.data : null

  const [stk, setStk] = useState<string[]>([])
  const [job, setJob] = useState<string[]>([])
  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const toggleStk = (v: string) => setStk((p) => toggleIn(p, v))
  const toggleJob = (v: string) => setJob((p) => toggleIn(p, v))
  const [query, setQuery] = useState<string>('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'opp', dir: -1 })
  const [open, setOpen] = useState<Set<number>>(new Set())
  const [expandAll, setExpandAll] = useState(false)

  // Reset filters + expand state whenever the unit changes. Done during render
  // (the endorsed "reset state when a value changes" pattern) rather than in an
  // effect, so there is no post-render cascade.
  const [prevSlug, setPrevSlug] = useState(slug)
  if (prevSlug !== slug) {
    setPrevSlug(slug)
    setStk([])
    setJob([])
    setQuery('')
    setOpen(new Set())
    setExpandAll(false)
  }

  const rowsData = useMemo(() => unitData?.rows ?? [], [unitData])
  const stakeholders = useMemo(() => unitData?.stakeholders ?? [], [unitData])

  // Browser-tab (document) title — "Needs — <unit name>".
  useEffect(() => {
    if (unitData) document.title = `Needs — ${unitData.unit.name}`
  }, [unitData])

  // Stable id per need (index in the source array), for expand state.
  const rowId = useMemo(() => new Map(rowsData.map((r, i) => [r, i] as const)), [rowsData])
  const toggleRow = (id: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const orderedStakeholders = useMemo(
    () => ROLE_ORDER.flatMap((role) => stakeholders.filter((s) => s.role === role)),
    [stakeholders],
  )

  // Unique jobs for the Job filter dropdown.
  const jobOptions = useMemo(
    () => Array.from(new Set(rowsData.map((r) => r.source_job))).sort((a, b) => a.localeCompare(b)),
    [rowsData],
  )

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rowsData.filter(
      (r) =>
        (stk.length === 0 || stk.includes(r.stk)) &&
        (job.length === 0 || job.includes(r.source_job)) &&
        (q === '' || r.stmt.toLowerCase().includes(q) || r.source_job.toLowerCase().includes(q) || r.stk.toLowerCase().includes(q)),
    )
  }, [rowsData, stk, job, query])

  // Summary counts for the widget cards (over the loaded unit's dataset).
  const stats = useMemo(() => {
    const status: Record<string, number> = { Underserved: 0, Served: 0, Overserved: 0 }
    for (const r of rowsData) status[statusOf(r).label]++
    const roles: Record<string, number> = {}
    for (const s of stakeholders) roles[ROLE_LABEL[s.role]] = (roles[ROLE_LABEL[s.role]] || 0) + 1
    const jobType = new Map<string, string>()
    for (const r of rowsData) if (!jobType.has(r.source_job)) jobType.set(r.source_job, r.job_type)
    const jobTypes: Record<string, number> = {}
    for (const t of jobType.values()) jobTypes[t] = (jobTypes[t] || 0) + 1
    return { status, roles, jobTypes, jobCount: jobType.size }
  }, [rowsData, stakeholders])

  const rows = useMemo(() => {
    const val = (r: OdiRow): number | string => {
      if (sort.key === 'conf') return meanConf(r)
      if (sort.key === 'status') return statusOf(r).order
      return (r as unknown as Record<SortKey, number | string>)[sort.key]
    }
    return [...list].sort((a, b) => {
      const av = val(a)
      const bv = val(b)
      if (typeof av === 'string' && typeof bv === 'string') return sort.dir * av.localeCompare(bv)
      return sort.dir * ((Number(av) || 0) - (Number(bv) || 0))
    })
  }, [list, sort])

  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: (s.dir * -1) as 1 | -1 }
        : { key, dir: TEXT_KEYS.includes(key) ? 1 : -1 },
    )

  // Sticky header: keep the header row fixed while the body scrolls.
  const headerSticky: CSSProperties = { position: 'sticky', top: 0, zIndex: 2, background: 'var(--surface-default-default-3)' }

  // Filter chip: darker neutral surface so the grey badge stands out against
  // the card (the default neutral tone is too faint here).
  const chipStyle: CSSProperties = { background: 'var(--surface-default-default-3)', color: 'var(--text-headings)' }

  // Labelled toolbar control: a small uppercase caption over the control.
  const field = (label: string, control: ReactNode) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-50)' }}>
      <FieldLabel>{label}</FieldLabel>
      {control}
    </label>
  )

  // Vertical value cell: band badge on top, number below — so the badges line
  // up horizontally across the Opportunity/Importance/Satisfaction columns.
  const stackCell = (value: string, badge: ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-200)' }}>
      {badge}
      <span style={{ ...mono, fontSize: 'var(--font-size-b1)', color: 'var(--text-headings)' }}>{value}</span>
    </div>
  )

  // Widget-card body: a large figure on the left, a hairline rule, then a
  // compact breakdown grid on the right.
  const sansNum: CSSProperties = { fontFamily: 'var(--font-family-sans)', fontWeight: 'var(--font-weight-medium)' }
  const cardBody = (n: ReactNode, items: { label: string; count: number; color?: string; icon?: ReactNode }[]) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-500)' }}>
      <span style={{ ...sansNum, fontSize: 'var(--font-size-h2)', lineHeight: 'var(--line-height-h2)', color: 'var(--text-headings)', flex: '0 0 auto', minWidth: '2ch' }}>{n}</span>
      <span aria-hidden style={{ alignSelf: 'stretch', width: 'var(--space-25)', background: 'var(--border-card)', flex: '0 0 auto' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: 'var(--space-200)', rowGap: 'var(--space-100)', alignItems: 'center', fontSize: 'var(--font-size-b3)', lineHeight: 'var(--line-height-b3)' }}>
        {items.map((it) => (
          <Fragment key={it.label}>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'var(--space-400)', color: 'var(--icon-subtle)' }}>
              {it.icon ?? (
                <span style={{ width: 'var(--space-200)', height: 'var(--space-200)', borderRadius: 'var(--radius-full)', background: it.color ?? 'var(--icon-subtle)', display: 'inline-block' }} />
              )}
            </span>
            <span style={{ ...sansNum, color: 'var(--text-headings)', textAlign: 'right' }}>{it.count}</span>
            <span style={{ color: 'var(--text-description)', whiteSpace: 'nowrap' }}>{it.label}</span>
          </Fragment>
        ))}
      </div>
    </div>
  )

  // Meta strip: level badge · unit name · cfj · stakeholder + needs counts.
  const metaStrip = unitData ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', flexWrap: 'wrap' }}>
        <Badge variant="color" size="xs" style={levelBadgeStyle(unitData.unit.level)}>{unitData.unit.level}</Badge>
        <Text variant="h4" as="span">{unitData.unit.name}</Text>
        {market.product_matches.some((m) => m.unit_name === unitData.unit.name) ? (
          <Badge variant="neutral" size="xs" icon={<Cube weight="fill" aria-hidden />}>Waldner product match</Badge>
        ) : null}
      </div>
      {unitData.unit.cfj ? (
        <Text variant="b2" style={{ color: 'var(--text-description)' }}>{unitData.unit.cfj}</Text>
      ) : null}
    </div>
  ) : null

  return (
    <PageTemplate
      breadcrumb={
        <Breadcrumb
          items={[
            { label: `NAICS ${market.naics_code}: ${market.segment_name}` },
            {
              label: unitData ? `${unitData.unit.level} ${unitData.unit.name}` : 'Loading…',
              onClick: (e) => {
                e.preventDefault()
                navigate('/market-page')
              },
            },
            { label: 'Needs' },
          ]}
        />
      }
      title="Needs — Opportunity Score"
      description="Every desired outcome, rated on Outcome-Driven Innovation (ODI) importance × satisfaction from each stakeholder's core functional job. Click a row to reveal its rationale and confidence."
      titleLeading={
        <Button
          variant="secondary-outline"
          size="sm"
          iconOnly
          aria-label="Back to value network"
          leftIcon={<ArrowLeft size={16} weight="regular" />}
          onClick={() => navigate('/market-page')}
        />
      }
      hideSidebar
      actions={<ReportActions />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-400)', marginTop: 'var(--space-500)' }}>
        {/* Unit selector + meta strip */}
        <WidgetCard title="Rated unit" icon={<ListChecks size={24} weight="regular" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-300)', width: '100%' }}>
            {field('Value-network unit', (
              <Dropdown
                searchable
                ariaLabel="Select a rated value-network unit"
                placeholder="Select a unit"
                value={slug}
                onChange={selectUnit}
                options={unitOptions}
              />
            ))}
            {metaStrip}
          </div>
        </WidgetCard>

        {/* Summary widget cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-300)' }}>
          <WidgetCard span={4} title="Jobs" icon={<Briefcase size={24} weight="regular" />}>
            {cardBody(
              stats.jobCount,
              ['core', 'emotional', 'status'].map((label) => ({
                label,
                count: stats.jobTypes[label] ?? 0,
              })),
            )}
          </WidgetCard>

          <WidgetCard span={4} title="Stakeholders" icon={<Users size={24} weight="regular" />}>
            {cardBody(
              stakeholders.length,
              [
                { label: 'Job executor', icon: <Wrench size={14} weight="regular" /> },
                { label: 'Job overseer', icon: <Eye size={14} weight="regular" /> },
                { label: 'Purchase influencer', icon: <Megaphone size={14} weight="regular" /> },
                { label: 'Purchase executor', icon: <ShoppingCart size={14} weight="regular" /> },
              ].map(({ label, icon }) => ({
                label,
                icon,
                count: stats.roles[label] ?? 0,
              })),
            )}
          </WidgetCard>

          <WidgetCard span={4} title="Needs found" icon={<ListChecks size={24} weight="regular" />}>
            {cardBody(rowsData.length, [
              { label: 'Underserved', count: stats.status.Underserved, color: 'var(--danger-400)' },
              { label: 'Served', count: stats.status.Served, color: 'var(--success-400)' },
              { label: 'Overserved', count: stats.status.Overserved, color: 'var(--info-400)' },
            ])}
          </WidgetCard>
        </div>

        {/* Search, filters and the table all live inside one "Needs" card */}
        <WidgetCard title="Needs" style={{ position: 'relative' }}>
        {/* View switch — pinned top-right, level with the card title (Graph is a platform upsell) */}
        <div style={{ position: 'absolute', top: 'var(--space-300)', right: 'var(--space-300)', height: 'var(--line-height-b1)', display: 'flex', alignItems: 'center', zIndex: 5 }}>
          <ViewToggle />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-400)' }}>
        {/* Search + filters (left, each with a label) · view controls (right) */}
        <div style={{ display: 'flex', gap: 'var(--space-400)', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 'var(--space-300)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {field('Search need', (
              <SearchBar
                size="sm"
                className="odi-searchbar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search needs…"
                aria-label="Search needs"
              />
            ))}
            {field('Stakeholder', (
              <Dropdown
                multiple
                ariaLabel="Filter by stakeholder"
                placeholder="All stakeholders"
                values={stk}
                onToggle={toggleStk}
                options={orderedStakeholders.map((s: OdiStakeholder) => ({ value: s.title, label: `${ROLE_LABEL[s.role]} · ${s.title} · ESCO ${s.esco_code} (${s.n})` }))}
              />
            ))}
            {field('Job', (
              <Dropdown
                multiple
                searchable
                ariaLabel="Filter by job"
                placeholder="All jobs"
                values={job}
                onToggle={toggleJob}
                options={jobOptions.map((j) => ({ value: j, label: j }))}
              />
            ))}
            {stk.length > 0 || job.length > 0 || query ? (
              <Button variant="tertiary" size="sm" onClick={() => { setStk([]); setJob([]); setQuery('') }}>
                Clear all
              </Button>
            ) : null}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-400)', alignItems: 'center', flexWrap: 'wrap' }}>
            <Checkbox
              checked={expandAll}
              onChange={() => setExpandAll((v) => !v)}
              size={18}
              label="See all rationales"
            />
          </div>
        </div>

        {/* Active filter chips: one closable neutral badge per selected value. */}
        {stk.length > 0 || job.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-200)', alignItems: 'center' }}>
            {stk.map((v) => (
              <Badge key={`stk-${v}`} variant="neutral" size="sm" style={chipStyle} onClose={() => toggleStk(v)} closeLabel={`Remove ${v}`}>
                {v}
              </Badge>
            ))}
            {job.map((v) => (
              <Badge key={`job-${v}`} variant="neutral" size="sm" style={chipStyle} onClose={() => toggleJob(v)} closeLabel={`Remove ${v}`}>
                {v}
              </Badge>
            ))}
          </div>
        ) : null}

        {/* Table */}
        <div className="odi-tablescroll" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <Table aria-label="ODI needs" striped="columns" style={{ tableLayout: 'fixed' }}>
            {/* Fixed column widths so the header never shifts when rows expand
                (expanding merges the right-hand columns into one wide cell). */}
            <colgroup>
              <col style={{ width: 32 }} />{/* caret — hugs the 16px arrow with 8px each side */}
              <col style={{ width: 92 }} />{/* opportunity */}
              <col style={{ width: 196 }} />{/* stakeholder */}
              <col style={{ width: 156 }} />{/* job */}
              <col />{/* need — takes the remaining width */}
              <col style={{ width: 116 }} />{/* status */}
              <col style={{ width: 96 }} />{/* importance */}
              <col style={{ width: 96 }} />{/* satisfaction */}
              <col style={{ width: 92 }} />{/* confidence */}
            </colgroup>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell aria-label="Expand" style={headerSticky} />
                {columns.map((c) => {
                  const canSort = c.sortable !== false
                  return (
                    <Table.HeaderCell
                      key={c.key}
                      align={c.align}
                      style={headerSticky}
                      sortable={canSort}
                      sortDirection={canSort && sort.key === c.key ? (sort.dir < 0 ? 'desc' : 'asc') : undefined}
                      onSort={canSort ? () => onSort(c.key) : undefined}
                      info={Boolean(c.info)}
                      infoTooltip={c.info}
                    >
                      {c.label}
                    </Table.HeaderCell>
                  )
                })}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {rows.map((r) => {
                const id = rowId.get(r)!
                const isOpen = expandAll || open.has(id)
                const conf = meanConf(r)
                const s = statusOf(r)
                const topCell: CSSProperties = { verticalAlign: 'top' }
                return (
                  <Fragment key={id}>
                    {/* Data row — every value stays in its own column, expanded or not */}
                    <Table.Row onClick={() => toggleRow(id)} style={{ cursor: 'pointer' }}>
                      {/* Caret — expand affordance */}
                      <Table.Cell icon style={topCell}>
                        <CaretDown size={16} weight="regular" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease', color: 'var(--icon-description)' }} />
                      </Table.Cell>
                      {/* Opportunity */}
                      <Table.Cell style={topCell}>{stackCell(r.opp.toFixed(1), <Badge variant={oppVariant(r.opp)} size="xs">{oppWord(r.opp)}</Badge>)}</Table.Cell>
                      {/* Stakeholder — title, role and ESCO code */}
                      <Table.Cell style={topCell}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{r.stk}</span>
                          <span style={{ ...mono, fontSize: 'var(--font-size-b4)', color: 'var(--text-labels)' }}>{r.role_label} · ESCO {r.esco_code}</span>
                        </div>
                      </Table.Cell>
                      {/* Job */}
                      <Table.Cell style={topCell}>{r.source_job}</Table.Cell>
                      {/* Need */}
                      <Table.Cell style={{ ...topCell, whiteSpace: 'normal', lineHeight: 'var(--line-height-b2)' }}>{r.stmt}</Table.Cell>
                      {/* Status */}
                      <Table.Cell style={topCell}><Badge variant={s.variant} size="xs">{s.label}</Badge></Table.Cell>
                      {/* Importance (number over band badge) */}
                      <Table.Cell style={topCell}>{stackCell(r.imp.toFixed(1), <Badge variant={impVariant(r.imp_band)} size="xs">{r.imp_band}</Badge>)}</Table.Cell>
                      {/* Satisfaction (number over band badge) */}
                      <Table.Cell style={topCell}>{stackCell(r.sat.toFixed(1), <Badge variant={satVariant(r.sat_band)} size="xs">{r.sat_band}</Badge>)}</Table.Cell>
                      {/* Confidence — badge only */}
                      <Table.Cell style={topCell}><ConfidenceBadge value={conf} size="xs" /></Table.Cell>
                    </Table.Row>

                    {/* Detail row — full-width rationale below; only the caret
                        column stays intact, the rest spans the whole table. */}
                    {isOpen ? (
                      <Table.Row>
                        <Table.Cell style={{ padding: 0 }} />
                        <Table.Cell colSpan={columns.length} style={{ padding: 0 }}>
                          <RationalePanel r={r} />
                        </Table.Cell>
                      </Table.Row>
                    ) : null}
                  </Fragment>
                )
              })}
              {!unitData ? (
                <Table.Row>
                  <Table.Cell colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 'var(--space-600)', color: 'var(--text-description)' }}>
                    Loading needs…
                  </Table.Cell>
                </Table.Row>
              ) : null}
            </Table.Body>
          </Table>
        </div>
        </div>
        </WidgetCard>
      </div>
    </PageTemplate>
  )
}

export default ODIMatrix
