import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowElbowDownRight, ArrowRight, ArrowSquareOut, CaretDown, Crown, Cube, Eye, Heart, LockSimple, Megaphone, ShoppingCart, Target, TreeStructure, Wrench } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import {
  Badge,
  Button,
  Divider,
  InfoCard,
  InfoTooltip,
  Number,
  PageTemplate,
  SearchBar,
  Text,
  Tooltip,
  TreeView,
  WidgetCard,
} from '@node42/ui-kit'
import type { TreeNode } from '@node42/ui-kit'
import { ReportActions } from './ReportActions'
import { slugify } from './sections'
import { UPSELL_COPY } from './copy'
import {
  loadOdiUnit,
  market,
  productsByUnitId,
  productUnitIds,
  ratedByUnitId,
  ROLE_LABEL,
  ROLE_ORDER,
  stakeholderTitle,
  valueNetwork,
} from './data'
import type { OdiUnitData, VNNode } from './data'

// "Market Page" — the Sterile Fill-Finish market (NAICS 325412, a sub-segment of
// Pharmaceutical Preparation Manufacturing), populated from the value-network
// export (valueNetwork.json): 6,616 functional units across levels L7 → L3. The
// Value Network tab renders the full taxonomy; selecting a node reveals its
// level, name, path, core functional job, matching Waldner products, and — for
// ODI-rated units — a link into the needs matrix.

// Headline market stats shown to the right of the title. All figures are derived
// from the graph (market.json); no dollar market-sizing exists in the graph, so
// none is invented here.
const headerStats: { label: string; value: number; tip: string }[] = [
  { label: 'Functional units', value: market.unit_count, tip: 'Functional units in the market value network, from the top-level production system (L7) down to granular modules (L3).' },
  { label: 'Rated units', value: market.rated_units, tip: 'Value-network units carried through the full Outcome-Driven Innovation (ODI) needs analysis.' },
  { label: 'Rated stakeholder roles', value: market.stakeholder_roles, tip: 'Distinct stakeholder roles that hold rated needs across the analysed units — the rated subset, not every role in the graph.' },
  { label: 'Mapped needs', value: market.total_needs, tip: 'Rated desired-outcome (need) statements across all analysed units.' },
]

// One-line description of what this NAICS industry covers — shown under the
// market title, beside the NAICS badge.
const NAICS_DESCRIPTION =
  'Sterile fill-finish manufacturing of pharmaceutical preparations — aseptic filling, stoppering and finishing of sterile drug product within controlled environments.'

// Short "what it is" blurb for the Value Network card header. The unit count is
// interpolated from market.json so it can never go stale on re-export.
const VN_DESCRIPTION =
  `The full ecosystem of functional units this market needs to produce its output — here, ${market.unit_count.toLocaleString('en-US')} units organised across levels, from the top-level sterile fill-finish production system down to granular modules.`

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)', width: '100%' }}>
      <Text variant="label-s">{label}</Text>
      {children}
    </div>
  )
}

// Walk the tree to the node with `id`, returning the chain of nodes from the
// root down to it (inclusive). Used to build the ancestry schema on the right.
function findNodePath(nodes: TreeNode[], id: string): TreeNode[] {
  for (const node of nodes) {
    if (node.id === id) return [node]
    if (node.children) {
      const sub = findNodePath(node.children, id)
      if (sub.length) return [node, ...sub]
    }
  }
  return []
}

// Per-level colour, keyed by the value-network level label. One step of the
// tertiary (alt-blue) ramp per level — darkest at the top of the taxonomy (L7),
// lightest at the leaves (L3) — so depth reads as shade. Text flips to white on
// the dark top shades. All values are ui-kit tokens, never raw hex.
const LEVEL_STYLE: Record<string, { bg: string; fg: string }> = {
  L7: { bg: 'var(--tertiary-800)', fg: 'var(--white)' },
  L6: { bg: 'var(--tertiary-default)', fg: 'var(--white)' },
  L6a: { bg: 'var(--tertiary-400)', fg: 'var(--white)' },
  L5: { bg: 'var(--tertiary-200)', fg: 'var(--secondary-700)' },
  L4: { bg: 'var(--tertiary-100)', fg: 'var(--secondary-700)' },
  L3: { bg: 'var(--tertiary-50)', fg: 'var(--secondary-700)' },
}
function levelStyle(label: ReactNode): CSSProperties {
  // Badges may carry a per-level index (e.g. "L6a.2"); colour by the level part.
  const key = typeof label === 'string' ? label.split('.')[0] : ''
  const c = LEVEL_STYLE[key] || { bg: 'var(--surface-default-default-2)', fg: 'var(--text-body)' }
  return { background: c.bg, color: c.fg }
}

// Flag the product node(s) and the ancestry trail down to them, so the tree can
// mark each matching unit with a box icon and breadcrumb the path with a yellow
// dot on every ancestor — a visible trail the user follows down to the product.
// Product units come from market.product_matches (Waldner Process and Automation
// Solutions only); `productUnitIds` is the set of matched unit ids.
const productIds = new Set<string>()
const trailIds = new Set<string>()
;(function mark(node: VNNode, ancestors: string[]) {
  if (productUnitIds.has(node.id)) {
    productIds.add(node.id)
    for (const a of ancestors) trailIds.add(a)
  }
  if (node.children) for (const c of node.children) mark(c, [...ancestors, node.id])
})(valueNetwork.root, [])

// Tree-row marker shown just after the level badge: a box on a product-matched
// unit, a yellow dot on each ancestor leading to one, nothing elsewhere.
function treeMarker(n: VNNode): ReactNode {
  if (productIds.has(n.id)) {
    return (
      <span style={{ position: 'relative', display: 'inline-flex', width: 'var(--space-400)', height: 'var(--space-400)', flexShrink: 0 }} aria-hidden>
        <Cube size={16} weight="fill" style={{ position: 'absolute', inset: 0, color: 'var(--primary-400)' }} />
        <Cube size={16} weight="regular" style={{ position: 'absolute', inset: 0, color: 'var(--secondary-450)' }} />
      </span>
    )
  }
  if (trailIds.has(n.id)) {
    return <span style={{ width: 'var(--space-200)', height: 'var(--space-200)', borderRadius: '50%', background: 'var(--primary-600)', flexShrink: 0, boxShadow: '0 0 0 var(--space-50) var(--surface-default-default)' }} />
  }
  return null
}
function treeText(n: VNNode): ReactNode {
  const marker = treeMarker(n)
  if (!marker) return n.name
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-100)', minWidth: 0 }}>
      {marker}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</span>
    </span>
  )
}

const nodeById = new Map<string, VNNode>()
// Ids expanded on first render: every L7 and L6 node, so the tree opens down to
// (and including) L6a — deeper levels stay collapsed to keep 6.6k nodes snappy.
const defaultExpandedIds: string[] = []
function toTreeNode(n: VNNode, badge: string): TreeNode {
  nodeById.set(n.id, n)
  if (n.level === 'L7' || n.level === 'L6') defaultExpandedIds.push(n.id)
  const node: TreeNode = { id: n.id, badge, text: treeText(n), badgeStyle: levelStyle(n.level) }
  if (n.children?.length) {
    const perLevel: Record<string, number> = {}
    node.children = n.children.map((c) => {
      perLevel[c.level] = (perLevel[c.level] ?? 0) + 1
      return toTreeNode(c, `${c.level}.${perLevel[c.level]}`)
    })
  }
  return node
}
const valueTree: TreeNode[] = [toTreeNode(valueNetwork.root, valueNetwork.root.level)]

// Path schema: the full chain from the root down to and including the selected
// node, each shown as a per-level colour badge + its name, indented step by step
// to convey the hierarchy. Every row selects that node; the selected level is
// highlighted (filled row + heading-weight name).
function LevelSchema({ path, selectedId, onSelect }: { path: TreeNode[]; selectedId: string; onSelect: (node: TreeNode) => void }) {
  if (!path.length) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)', width: '100%' }}>
      {path.map((node, i) => {
        const isSelected = node.id === selectedId
        return (
          <button
            type="button"
            key={node.id}
            onClick={() => onSelect(node)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-200)',
              minWidth: 0,
              width: '100%',
              margin: 0,
              padding: 'var(--space-100)',
              paddingLeft: `calc(var(--space-100) + var(--space-400) * ${i})`,
              border: 0,
              borderRadius: 'var(--radius-xs)',
              background: isSelected ? 'var(--surface-default-default-2)' : 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              font: 'inherit',
            }}
          >
            {i > 0 ? (
              <ArrowElbowDownRight size={14} weight="regular" style={{ flexShrink: 0, color: 'var(--text-labels)' }} />
            ) : null}
            <Badge variant="color" size="xs" style={levelStyle(node.badge)}>
              {node.badge}
            </Badge>
            <Text
              variant="b2"
              weight={isSelected ? 'medium' : undefined}
              as="span"
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: isSelected ? 'var(--text-headings)' : 'var(--text-body)',
              }}
            >
              {node.text}
            </Text>
          </button>
        )
      })}
    </div>
  )
}

// Stakeholders are rendered per rated unit, sourced from that unit's ODI export.
const escoUrl = (esco: string) => `https://esco.ec.europa.eu/en/search-occupations?text=${encodeURIComponent(esco)}`

// --- Jobs-to-be-Done per stakeholder ------------------------------------------
// Derived from the ODI needs rows: each row is a need tied to a source_job with
// a job_type (core / emotional / status). We dedupe to the distinct jobs each
// stakeholder holds (first-seen order). The Core Functional Job is NOT derived
// from these rows — it comes from the stakeholder's own cfj_for_stakeholder
// field on the ODI export (see StakeholderSection); every core job stays under
// Core Jobs. Keys use the display title (role-label fallback for null titles)
// so lookups line up with the stakeholder cards.
type JobKind = 'cfj' | 'core' | 'emotional' | 'status'
type StakeholderJobs = Record<JobKind, string[]>

function buildJobs(rows: OdiUnitData['rows']): Record<string, StakeholderJobs> {
  const acc: Record<string, { core: string[]; emotional: string[]; status: string[]; seen: Set<string> }> = {}
  for (const r of rows) {
    const a = (acc[stakeholderTitle(r.stk, ROLE_LABEL[r.role])] ??= { core: [], emotional: [], status: [], seen: new Set<string>() })
    const key = `${r.job_type}::${r.source_job}`
    if (a.seen.has(key)) continue
    a.seen.add(key)
    if (r.job_type === 'core') a.core.push(r.source_job)
    else if (r.job_type === 'emotional') a.emotional.push(r.source_job)
    else if (r.job_type === 'status') a.status.push(r.source_job)
  }
  const out: Record<string, StakeholderJobs> = {}
  for (const [stk, a] of Object.entries(acc)) {
    out[stk] = { cfj: [], core: a.core, emotional: a.emotional, status: a.status }
  }
  return out
}

const emptyJobs: StakeholderJobs = { cfj: [], core: [], emotional: [], status: [] }

// Job kinds, in display order — each with a colour + icon used both in the
// collapsed count summary and the expanded group headers.
const JOB_KINDS: { key: JobKind; label: string; short: string; icon: Icon; color: string }[] = [
  { key: 'cfj', label: 'Core Functional Job', short: 'CFJ', icon: Target, color: 'var(--tertiary-default)' },
  { key: 'core', label: 'Core Jobs', short: 'core', icon: Wrench, color: 'var(--info-default)' },
  { key: 'emotional', label: 'Emotional Jobs', short: 'emo', icon: Heart, color: 'var(--danger-400)' },
  { key: 'status', label: 'Status Job', short: 'status', icon: Crown, color: 'var(--warning-default)' },
]

const ROLE_META: Record<string, { label: string; icon: Icon; desc: string }> = {
  job_executor: { label: 'Job Executor', icon: Wrench, desc: 'Operates the system day to day.' },
  job_overseer: { label: 'Job Overseer', icon: Eye, desc: 'Governs safety and service quality.' },
  purchase_influencer: { label: 'Purchase Influencer', icon: Megaphone, desc: 'Shapes specification and vendor choice.' },
  purchase_executor: { label: 'Purchase Executor', icon: ShoppingCart, desc: 'Holds budget and signs the purchase.' },
}

// One stakeholder, collapsed to a single row by default: name + ESCO + a compact
// job-mix summary (a coloured count per job kind). Expands to reveal every job,
// grouped by kind — keeping the buying-centre section short until drilled into.
// The ESCO link renders only when the graph carries a code for this role.
function StakeholderCard({ name, esco, jobs }: { name: string; esco: string | null; jobs: StakeholderJobs }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--surface-default-default)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)', padding: 'var(--space-200) var(--space-300)', minWidth: 0 }}>
        {/* Title row — accordion caret · name · ESCO link, all aligned to the title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', minWidth: 0 }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', flex: 1, padding: 0, border: 0, background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left', minWidth: 0 }}
          >
            <CaretDown size={14} weight="bold" style={{ flexShrink: 0, color: 'var(--icon-description)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease' }} />
            <Text variant="b2" weight="medium" as="span" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Text>
          </button>
          {esco ? (
            <a
              href={escoUrl(esco)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Open ESCO ${esco} on esco.ec.europa.eu`}
              style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none', color: 'inherit' }}
            >
              <Badge variant="color" size="xs">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-100)' }}>
                  ESCO {esco}
                  <ArrowSquareOut size={11} weight="regular" />
                </span>
              </Badge>
            </a>
          ) : null}
        </div>
        {/* Collapsed job-mix summary, indented under the name */}
        {!open && JOB_KINDS.some((k) => jobs[k.key].length) ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', flexWrap: 'wrap', paddingLeft: 'calc(14px + var(--space-200))' }}>
            {JOB_KINDS.map((k) => jobs[k.key].length ? (
              <span key={k.key} title={k.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-100)' }}>
                <span style={{ width: 'var(--space-200)', height: 'var(--space-200)', borderRadius: '50%', background: k.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-family-sans)', fontSize: 'var(--font-size-b4)', color: 'var(--text-description)' }}>{jobs[k.key].length} {k.short}</span>
              </span>
            ) : null)}
          </span>
        ) : null}
      </div>

      {open ? (
        <div style={{ padding: '0 var(--space-300) var(--space-300)', display: 'flex', flexDirection: 'column', gap: 'var(--space-300)' }}>
          {JOB_KINDS.map((k) => {
            const items = jobs[k.key]
            if (!items.length) return null
            const Ico = k.icon
            return (
              <div key={k.key} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
                  <Ico size={13} weight="regular" style={{ color: k.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-family-sans)', fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-b4)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-labels)' }}>{k.label}</span>
                  {items.length > 1 ? <Badge variant="neutral" size="xs">{items.length}</Badge> : null}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-50)', paddingLeft: 'calc(13px + var(--space-100))' }}>
                  {items.map((j) => (
                    <Text key={j} variant="b3" as="span" style={{ color: 'var(--text-body)' }}>{j}</Text>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function StakeholderGroup({ label, icon: RoleIcon, desc, roles }: { label: string; icon: Icon; desc: string; roles: { name: string; esco: string | null; jobs: StakeholderJobs }[] }) {
  return (
    <InfoCard
      style={{ minWidth: 0 }}
      titleVariant="b2"
      title={
        <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-100)', minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
            <RoleIcon size={14} weight="regular" />
            <Text variant="b3" weight="medium" as="span">{label}</Text>
          </span>
          <Text variant="b3" as="span" style={{ color: 'var(--text-description)' }}>{desc}</Text>
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)', width: '100%', minWidth: 0 }}>
        {/* Fallback names can repeat within a group, so the key carries the index. */}
        {roles.map((role, i) => (
          <StakeholderCard key={`${role.name}-${i}`} name={role.name} esco={role.esco} jobs={role.jobs} />
        ))}
      </div>
    </InfoCard>
  )
}

// The buying centre for a rated unit, built from its lazy-loaded ODI export.
// Each stakeholder's Core Functional Job is its own cfj_for_stakeholder from
// the per-unit export; the row-derived jobs only fill the other three kinds.
function StakeholderSection({ unit }: { unit: OdiUnitData }) {
  const jobsByStakeholder = useMemo(() => buildJobs(unit.rows), [unit])
  const groups = useMemo(
    () =>
      ROLE_ORDER.map((role) => ({
        role,
        label: ROLE_META[role].label,
        icon: ROLE_META[role].icon,
        desc: ROLE_META[role].desc,
        roles: unit.stakeholders
          .filter((s) => s.role === role)
          .map((s) => {
            const name = stakeholderTitle(s.title, ROLE_LABEL[role])
            const jobs = jobsByStakeholder[name] ?? emptyJobs
            return { name, esco: s.esco_code, jobs: { ...jobs, cfj: s.cfj_for_stakeholder ? [s.cfj_for_stakeholder] : [] } }
          }),
      })).filter((g) => g.roles.length),
    [unit, jobsByStakeholder],
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-300)', width: '100%' }}>
      {groups.map((g) => (
        <StakeholderGroup key={g.role} label={g.label} icon={g.icon} desc={g.desc} roles={g.roles} />
      ))}
    </div>
  )
}

// A value-network unit is product-classifiable at L5 and below (the granular
// service/product levels). Parse the level's leading number so "L6a" (→6) stays
// excluded while "L5" / "L4" / "L3" qualify.
const isProductLevel = (level: string): boolean => {
  const m = /\d+/.exec(level)
  return m ? parseInt(m[0], 10) <= 5 : false
}

// UNSPSC lookup: the graph carries no UNSPSC codes for these units, so we don't
// fabricate one — the card links out to a live UNSPSC search for the node's name.
const unspscSearchUrl = (name: string) => `https://www.google.com/search?q=${encodeURIComponent(`UNSPSC code ${name}`)}`

// "Needs" button, shown beside every node's title. On an ODI-rated unit it opens
// the needs matrix for that unit; on every other node it's locked, and hovering
// reveals an upgrade prompt (the feature ships with the full Node42 platform).
function NeedsButton({ enabled, onOpen }: { enabled: boolean; onOpen: () => void }) {
  const [hover, setHover] = useState(false)
  if (enabled) {
    return (
      <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} weight="regular" />} onClick={onOpen} style={{ flexShrink: 0 }}>
        Needs
      </Button>
    )
  }
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Button variant="secondary-outline" size="sm" disabled rightIcon={<LockSimple size={14} weight="regular" />} style={{ pointerEvents: 'none' }}>
        Needs
      </Button>
      {hover ? (
        <span style={{ position: 'absolute', top: 'calc(100% + var(--space-100))', right: 0, zIndex: 30 }}>
          <Tooltip
            arrow="top-center"
            maxWidth={260}
            description={UPSELL_COPY}
          />
        </span>
      ) : null}
    </span>
  )
}

// Detail panel for the selected tree node: level badge + name, the ancestry
// path, the node's core functional job, matching Waldner products, and — for a
// rated unit — the buying centre and a Needs button into the ODI matrix.
function MarketDetail({ node, path, onSelect, onNeeds }: { node: TreeNode; path: TreeNode[]; onSelect: (node: TreeNode) => void; onNeeds: (slug: string) => void }) {
  const data = nodeById.get(node.id)
  const rated = data ? ratedByUnitId.get(data.id) : undefined
  const matchedProducts = data ? productsByUnitId.get(data.id) : undefined

  // Lazy-load the ODI export for the buying centre when a rated unit is selected.
  // `odiUnit` is derived from data tagged with its slug, so there is no
  // synchronous state-clearing inside the effect.
  const ratedSlug = rated?.slug
  const [loaded, setLoaded] = useState<{ slug: string; data: OdiUnitData } | null>(null)
  useEffect(() => {
    if (!ratedSlug) return
    let live = true
    loadOdiUnit(ratedSlug).then((d) => { if (live) setLoaded({ slug: ratedSlug, data: d }) })
    return () => { live = false }
  }, [ratedSlug])
  const odiUnit = ratedSlug && loaded?.slug === ratedSlug ? loaded.data : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-300)', flex: '1 1 0', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-300)', minWidth: 0, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', flex: '1 1 auto', minWidth: 0 }}>
          <Badge variant="color" size="xs" style={{ ...levelStyle(node.badge), flexShrink: 0 }}>
            {node.badge}
          </Badge>
          <Text variant="h4" as="p" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{node.text}</Text>
        </div>
        <NeedsButton enabled={Boolean(rated)} onOpen={() => rated && onNeeds(rated.slug)} />
      </div>
      <Divider />
      <Section label="Path">
        <LevelSchema path={path} selectedId={node.id} onSelect={onSelect} />
      </Section>
      {data?.cfj ? (
        <>
          <Divider />
          <Section label="Core Functional Job">
            <Text variant="b2">{data.cfj}</Text>
          </Section>
        </>
      ) : null}
      {/* UNSPSC & Products — a UNSPSC lookup card (no codes in the graph, so it
          links out to a live search) plus one identity block per matching
          Waldner Process and Automation Solutions product. */}
      {data && isProductLevel(data.level) ? (
        <>
          <Divider />
          <Section label={matchedProducts?.length ? 'Products' : 'UNSPSC'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-200)', width: '100%', minWidth: 0 }}>
              {matchedProducts?.length ? (
                matchedProducts.map((p) => (
                  <div
                    key={p}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-100)',
                      alignItems: 'flex-start',
                      padding: 'var(--space-300)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-default-default-2)',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-100)' }}>
                      <Cube size={16} weight="regular" />
                      <Text variant="b1" weight="medium" as="span">{p}</Text>
                    </div>
                    <Text variant="b3" style={{ color: 'var(--text-description)' }}>Waldner Process and Automation Solutions</Text>
                  </div>
                ))
              ) : (
                <Button
                  variant="secondary-outline"
                  size="sm"
                  rightIcon={<ArrowSquareOut size={14} weight="regular" />}
                  onClick={() => window.open(unspscSearchUrl(data.name), '_blank', 'noopener')}
                >
                  Find UNSPSC code
                </Button>
              )}
            </div>
          </Section>
        </>
      ) : null}
      {rated ? (
        <>
          <Divider />
          <Section label="Stakeholder">
            {odiUnit ? (
              <StakeholderSection unit={odiUnit} />
            ) : (
              <Text variant="b3" style={{ color: 'var(--text-description)' }}>Loading buying centre…</Text>
            )}
          </Section>
        </>
      ) : null}
    </div>
  )
}

// Prune the tree to nodes whose title matches `query`, keeping the ancestor
// chain of every match so branches stay navigable. Match against the source
// name (via nodeById), not `node.text` — product/trail rows render `text` as a
// React element, so String(text) would be "[object Object]" and never match.
function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return nodes
  const walk = (node: TreeNode): TreeNode | null => {
    const name = nodeById.get(node.id)?.name ?? (typeof node.text === 'string' ? node.text : '')
    if (name.toLowerCase().includes(q)) return node
    const kids = (node.children ?? []).map(walk).filter(Boolean) as TreeNode[]
    return kids.length ? { ...node, children: kids } : null
  }
  return nodes.map(walk).filter(Boolean) as TreeNode[]
}

// Every id in a tree — used to expand all branches while a filter is active.
const allNodeIds = (nodes: TreeNode[]): string[] =>
  nodes.flatMap((n) => [n.id, ...(n.children ? allNodeIds(n.children) : [])])

// Value Network tab — one card: the taxonomy tree on the left (with a search
// box in place of the old heading), the selected node's detail on the right.
function ValueNetworkCard() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<TreeNode>(valueTree[0])
  const [query, setQuery] = useState('')
  const path = useMemo(() => findNodePath(valueTree, selected.id), [selected.id])
  const filtered = useMemo(() => filterTree(valueTree, query), [query])
  return (
    <WidgetCard
      title="Value Network"
      icon={<TreeStructure size={24} weight="regular" />}
      description={VN_DESCRIPTION}
      style={{ marginTop: 'var(--space-300)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--space-300)', width: '100%' }}>
        <div
          style={{
            // Lock the column width so the divider stays put; overflow:hidden
            // clips deep rows instead of pushing it wider.
            flex: '0 0 360px',
            maxWidth: 360,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-200)',
            overflow: 'hidden',
          }}
        >
          <SearchBar
            className="vn-searchbar"
            size="sm"
            placeholder="Search value network…"
            aria-label="Search the value network"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <TreeView
              // Remount when the query changes so the expanded set is re-seeded:
              // all matches open while filtering, back to the L6a depth otherwise.
              key={query}
              nodes={filtered}
              defaultExpandedIds={query ? allNodeIds(filtered) : defaultExpandedIds}
              highlightedIds={new Set(path.map((n) => n.id))}
              selectedId={selected.id}
              onSelect={setSelected}
              style={{ overflow: 'hidden' }}
            />
          </div>
        </div>
        <Divider orientation="vertical" />
        <MarketDetail node={selected} path={path} onSelect={setSelected} onNeeds={(slug) => navigate(`/odi-matrix?unit=${slug}`)} />
      </div>
    </WidgetCard>
  )
}

export default function MarketPage() {
  const stats = (
    <div style={{ display: 'flex', gap: 'var(--space-200)', flexWrap: 'wrap' }}>
      {headerStats.map((stat) => (
        <HeaderStat key={stat.label} label={stat.label} value={stat.value} tip={stat.tip} />
      ))}
    </div>
  )

  return (
    <PageTemplate
      hideSidebar
      actions={<ReportActions />}
      title={market.segment_name}
      titleId={slugify(market.segment_name)}
      description={
        <>
          {/* NAICS badges sit between the title and the description text. No
              confidence badge here — market.json carries no confidence figure,
              and we never invent one. */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)', marginBottom: 'var(--space-300)', flexWrap: 'wrap' }}>
            <Badge variant="color" size="sm">NAICS: {market.naics_code}</Badge>
            <Badge variant="neutral" size="sm">{market.naics_title}</Badge>
          </span>
          <span style={{ display: 'block' }}>{NAICS_DESCRIPTION}</span>
        </>
      }
      titleAside={stats}
    >
      <ValueNetworkCard />
    </PageTemplate>
  )
}

// Small headline stat: a label + info icon (with tooltip) over a medium Number,
// on the lighter surface. Not a single kit component, so composed from tokens.
function HeaderStat({ label, value, tip }: { label: string; value: number; tip?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-200)',
        padding: 'var(--space-300)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-default-default)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-200)' }}>
        <Text variant="label-s">{label}</Text>
        <InfoTooltip tooltip={tip} size={16} label={`About ${label}`} style={{ color: 'var(--text-labels)' }} />
      </div>
      <Number color="none" numberSize="md" style={{ alignSelf: 'flex-start' }}>
        {value.toLocaleString('en-US')}
      </Number>
    </div>
  )
}
