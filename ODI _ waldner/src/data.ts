// Data layer for the Sterile Fill-Finish (NAICS 325412) engagement.
//
// All values are exported from the central Neo4j graph by the extract phase and
// live under ./data as JSON:
//   - valueNetwork.json  — the 6,616-unit value-network tree (single L7 root)
//   - market.json        — market meta, graph-derived counts, product matches
//   - odi/index.json     — the 40 ODI-rated units (summary rows)
//   - odi/<slug>.json    — per-unit ODI needs (lazy-loaded on demand)
//
// The tree, market meta and index are small enough to import statically; the 40
// per-unit ODI files are large, so they are lazy-loaded via import.meta.glob and
// only fetched when a unit is selected — keeping the initial bundle lean.

import valueNetworkFile from './data/valueNetwork.json'
import marketFile from './data/market.json'
import odiIndexFile from './data/odi/index.json'

// --- Value network -----------------------------------------------------------

/** One functional unit in the value-network tree. */
export interface VNNode {
  id: string
  name: string
  level: string
  /** Core functional job — may be empty on deeper (L4/L3) units. */
  cfj?: string
  children?: VNNode[]
}

export interface VNMeta {
  network: string
  segment_name: string
  naics_code: string
  naics_title: string
  market_name: string
  unit_count: number
  level_counts: Record<string, number>
}

export interface ValueNetworkFile {
  meta: VNMeta
  root: VNNode
}

// --- Market meta -------------------------------------------------------------

export interface RoleTotal {
  role: string
  srs: number
  ratings: number
}

export interface JobTypeTotal {
  job_type: string
  ratings: number
}

export interface ProductMatch {
  product: string
  unit_name: string
  unit_level: string
  unit_id: string
}

export interface MarketMeta {
  naics_code: string
  naics_title: string
  segment_name: string
  market_name: string
  vn_rationale: string
  unit_count: number
  level_counts: string[]
  rated_units: number
  stakeholder_roles: number
  total_needs: number
  role_totals: RoleTotal[]
  job_type_totals: JobTypeTotal[]
  product_matches: ProductMatch[]
}

// --- ODI index + per-unit data ----------------------------------------------

/** One row in odi/index.json — a summary of a single ODI-rated unit. */
export interface OdiIndexEntry {
  slug: string
  unit_name: string
  unit_id: string
  level: string
  cfj: string
  stakeholders: number
  needs: number
  top_opportunity: number
  avg_opportunity: number
  underserved: number
  product_matched: boolean
}

export interface OdiStakeholder {
  role: string
  /** Stakeholder title — null in the graph for a handful of roles. */
  title: string | null
  /** ESCO occupation code — null in the graph for a handful of roles. */
  esco_code: string | null
  n: number
  /** The core functional job as held by this specific stakeholder. */
  cfj_for_stakeholder: string
  confidence: number | null
}

/** One rated desired-outcome (need) row for a unit. */
export interface OdiRow {
  /** Stakeholder title — null in the graph for a handful of roles. */
  stk: string | null
  role: string
  role_label: string
  /** ESCO occupation code — null in the graph for a handful of roles. */
  esco_code: string | null
  job_type: string
  source_job: string
  stmt: string
  imp: number
  imp_band: string
  imp_rat: string
  imp_conf: number
  imp_conf_b: string
  sat: number
  sat_band: string
  sat_rat: string
  sat_conf: number
  sat_conf_b: string
  opp: number
  rank: number
  need_direction: string
  metric_word: string
  error_type: string
}

export interface OdiUnitData {
  unit: { name: string; level: string; cfj: string }
  stakeholders: OdiStakeholder[]
  rows: OdiRow[]
}

// --- Static exports ----------------------------------------------------------

export const valueNetwork = valueNetworkFile as unknown as ValueNetworkFile
export const market = marketFile as unknown as MarketMeta
export const odiIndex = odiIndexFile as unknown as OdiIndexEntry[]

// --- Lazy per-unit ODI loader ------------------------------------------------

// Every per-unit ODI file, as a dynamic-import map keyed by module path. Vite
// splits each into its own chunk, so nothing here lands in the initial bundle.
const odiModules = import.meta.glob<OdiUnitData>(
  ['./data/odi/*.json', '!./data/odi/index.json'],
  { import: 'default' },
)

const odiCache = new Map<string, OdiUnitData>()

/** Lazy-load one unit's ODI needs by slug (cached after first fetch). */
export async function loadOdiUnit(slug: string): Promise<OdiUnitData> {
  const cached = odiCache.get(slug)
  if (cached) return cached
  const loader = odiModules[`./data/odi/${slug}.json`]
  if (!loader) throw new Error(`No ODI data for unit "${slug}"`)
  const data = await loader()
  odiCache.set(slug, data)
  return data
}

// --- Shared role helpers -----------------------------------------------------

export const ROLE_ORDER = [
  'job_executor',
  'job_overseer',
  'purchase_influencer',
  'purchase_executor',
] as const

/** Sentence-case label for a stakeholder role key. */
export const ROLE_LABEL: Record<string, string> = {
  job_executor: 'Job executor',
  job_overseer: 'Job overseer',
  purchase_influencer: 'Purchase influencer',
  purchase_executor: 'Purchase executor',
}

/**
 * Display title for a stakeholder. A handful of roles carry a null title in
 * the graph — fall back to the role label rather than rendering blank text.
 * Display-layer only; the exported JSON is never patched.
 */
export const stakeholderTitle = (title: string | null | undefined, roleLabel: string): string =>
  title || roleLabel

// --- Derived lookups (built once) --------------------------------------------

/** Slug of the default ODI unit surfaced first (highest opportunity). */
export const DEFAULT_ODI_SLUG = 'aseptic-filling-machine'

/** unit_id → the Waldner product name(s) that match it. */
export const productsByUnitId: Map<string, string[]> = (() => {
  const m = new Map<string, string[]>()
  for (const pm of market.product_matches) {
    const arr = m.get(pm.unit_id) ?? []
    arr.push(pm.product)
    m.set(pm.unit_id, arr)
  }
  return m
})()

/** Every unit_id that a Waldner product maps onto. */
export const productUnitIds: Set<string> = new Set(productsByUnitId.keys())

/** unit_id → its ODI index entry, for the 40 rated units. */
export const ratedByUnitId: Map<string, OdiIndexEntry> = new Map(
  odiIndex.map((e) => [e.unit_id, e]),
)
