# WaldnerSterileFillFinish

Interactive report app for the **Waldner Process and Automation Solutions — Sterile Fill-Finish** engagement (NAICS 325412, Pharmaceutical Preparation Manufacturing).

The app presents:

- **Market page** — the Sterile Fill-Finish value network: 6,616 functional units organised L7 → L3, with Waldner's products marked in the tree and per-unit detail (level, path, core functional job).
- **ODI needs matrix** — Outcome-Driven Innovation (ODI) needs across the 40 rated value-network units: 8,310 need statements held by 362 stakeholder roles (ESCO-coded), each scored for importance × satisfaction → opportunity with calibrated confidence and rationale.

All displayed data is exported from the Node42 Neo4j knowledge graph (`ODI _ waldner/scripts/export_sff_data.py`) — nothing is hand-authored.

## Structure

| Folder | Purpose |
| --- | --- |
| `ODI _ waldner/` | The report app (Vite + React + TypeScript) |
| `New-UIKit/` | `@node42/ui-kit` — the component library and design tokens the app is built on (consumed from source via a Vite alias) |

## Run

```bash
cd "ODI _ waldner"
npm install
npm run dev
```

Routes: `/market-page` (value network) and `/odi-matrix` (needs matrix).
