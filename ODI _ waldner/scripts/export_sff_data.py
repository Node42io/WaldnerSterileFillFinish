#!/usr/bin/env python3
"""Export the Sterile Fill-Finish (NAICS 325412) dataset from Neo4j into JSON
files consumed by the ODI report app.

Outputs (under src/data/):
  - valueNetwork.json          full 6,616-unit tree
  - market.json                market/network summary + Waldner product matches
  - odi/index.json             40 rated units, summary stats
  - odi/<slug>.json            per rated unit: stakeholders + all ODI rows

All values are written exactly as stored in the graph — nothing is rounded,
renamed, or invented.
"""

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

from dotenv import load_dotenv
from neo4j import GraphDatabase

ENV_PATH = "/Users/florianstrauss/Desktop/Node42 Backend/.env"
BASE_DIR = Path("/Users/florianstrauss/Desktop/Node42 Backend/Waldner Project/ODI _ waldner")
DATA_DIR = BASE_DIR / "src" / "data"
ODI_DIR = DATA_DIR / "odi"

NETWORK = "325412/Sterile Fill-Finish"
NAICS = "325412"
OWNER_COMPANY = "Waldner Process and Automation Solutions"

LEVEL_ORDER = {"L7": 0, "L6": 1, "L6a": 2, "L5": 3, "L4": 4, "L3": 5}
ROLE_LABELS = {
    "job_executor": "Job Executor",
    "job_overseer": "Job Overseer",
    "purchase_influencer": "Purchase Influencer",
    "purchase_executor": "Purchase Executor",
}


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s or "unit"


class SlugRegistry:
    """Stable, unique slugs: append -2, -3 ... on collision."""

    def __init__(self):
        self.seen = defaultdict(int)
        self.collisions = []

    def make(self, text: str) -> str:
        base = slugify(text)
        self.seen[base] += 1
        if self.seen[base] == 1:
            return base
        self.collisions.append(text)
        return f"{base}-{self.seen[base]}"


def prettify_role(role: str) -> str:
    return ROLE_LABELS.get(role, (role or "").replace("_", " ").title())


def write_json(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))
    print(f"wrote {path} ({path.stat().st_size:,} bytes)")


def main() -> int:
    load_dotenv(ENV_PATH)
    uri = os.environ["NEO4J_URI"]
    user = os.environ["NEO4J_USERNAME"]
    pwd = os.environ["NEO4J_PASSWORD"]

    notes = []
    driver = GraphDatabase.driver(uri, auth=(user, pwd))
    with driver.session() as session:
        # ---- network + market meta ------------------------------------
        meta_rec = session.run(
            """
            MATCH (m:Market {naics_code:$naics})-[:has_value_network]->
                  (v:ValueNetwork {naics_code:$network})
            RETURN v.segment_name AS segment_name, v.market_name AS market_name,
                   v.unit_count AS unit_count, v.rationale AS vn_rationale,
                   m.naics_title AS naics_title
            """,
            naics=NAICS, network=NETWORK,
        ).single()
        if meta_rec is None:
            print("FATAL: ValueNetwork/Market not found", file=sys.stderr)
            return 1

        # ---- units -----------------------------------------------------
        units = {}  # elementId -> dict
        for rec in session.run(
            """
            MATCH (:ValueNetwork {naics_code:$network})-[:has_unit]->(u:ValueNetworkUnit)
            RETURN elementId(u) AS eid, u.name AS name, u.level AS level,
                   u.cfj AS cfj, u.cfj_description AS cfj_description
            """,
            network=NETWORK,
        ):
            units[rec["eid"]] = {
                "name": rec["name"],
                "level": rec["level"],
                "cfj": rec["cfj"] or rec["cfj_description"] or "",
            }

        # ---- hierarchy edges (within this network) ---------------------
        children_of = defaultdict(list)  # parent eid -> [child eid]
        parent_of = {}
        multi_parent = []
        for rec in session.run(
            """
            MATCH (p:ValueNetworkUnit {value_network:$network})
                  -[:has_child]->(c:ValueNetworkUnit {value_network:$network})
            RETURN elementId(p) AS p, elementId(c) AS c
            """,
            network=NETWORK,
        ):
            p, c = rec["p"], rec["c"]
            if c in parent_of and parent_of[c] != p:
                multi_parent.append(units[c]["name"])
                continue
            parent_of[c] = p
            children_of[p].append(c)
        if multi_parent:
            notes.append(f"units with >1 parent (extra edges skipped): {multi_parent[:5]}")

        roots = [eid for eid in units if eid not in parent_of]
        l7_roots = [eid for eid in roots if units[eid]["level"] == "L7"]
        if len(l7_roots) != 1 or len(roots) != 1:
            notes.append(
                f"root anomaly: {len(roots)} parentless units, {len(l7_roots)} L7 roots"
            )
        root_eid = l7_roots[0] if l7_roots else roots[0]

        # ---- build tree with stable slugs (deterministic display order) -
        reg = SlugRegistry()
        id_by_eid = {}
        id_by_name = {}

        def sort_key(eid):
            u = units[eid]
            return (LEVEL_ORDER.get(u["level"], 99), u["name"] or "")

        def build(eid):
            u = units[eid]
            nid = reg.make(u["name"])
            id_by_eid[eid] = nid
            id_by_name[u["name"]] = nid
            node = {"id": nid, "name": u["name"], "level": u["level"], "cfj": u["cfj"]}
            kids = sorted(children_of.get(eid, []), key=sort_key)
            if kids:
                node["children"] = [build(k) for k in kids]
            return node

        sys.setrecursionlimit(10000)
        root_node = build(root_eid)

        def count_nodes(n):
            return 1 + sum(count_nodes(c) for c in n.get("children", []))

        tree_units = count_nodes(root_node)
        level_counts = defaultdict(int)
        for u in units.values():
            level_counts[u["level"]] += 1
        level_counts = {k: level_counts.get(k, 0) for k in ["L7", "L6", "L6a", "L5", "L4", "L3"]}

        if tree_units != len(units):
            notes.append(
                f"tree covers {tree_units} of {len(units)} units (disconnected units exist)"
            )
        if reg.collisions:
            notes.append(
                f"{len(reg.collisions)} slug collisions resolved with numeric suffix, "
                f"e.g. {reg.collisions[:3]}"
            )

        write_json(
            DATA_DIR / "valueNetwork.json",
            {
                "meta": {
                    "network": NETWORK,
                    "segment_name": meta_rec["segment_name"],
                    "naics_code": NAICS,
                    "naics_title": meta_rec["naics_title"],
                    "market_name": meta_rec["market_name"],
                    "unit_count": meta_rec["unit_count"],
                    "level_counts": level_counts,
                },
                "root": root_node,
            },
        )

        # ---- ODI ratings (one pass: unit -> SR -> ES -> rating) --------
        rows_by_unit = defaultdict(list)       # unit name -> [row]
        sr_by_unit = defaultdict(dict)         # unit name -> {sr eid: stakeholder}
        unit_meta = {}                         # unit name -> {level, cfj}
        role_sr = defaultdict(set)
        role_ratings = defaultdict(int)
        job_type_ratings = defaultdict(int)
        total_rows = 0

        for rec in session.run(
            """
            MATCH (u:ValueNetworkUnit {value_network:$network})
                  -[:has_stakeholder_role]->(sr:StakeholderRole)
                  -[:has_need_statement]->(es:ErrorStatement)
                  -[:has_odi_rating]->(o:ODIRating)
            RETURN u.name AS unit_name, u.level AS unit_level,
                   u.cfj AS unit_cfj, u.cfj_description AS unit_cfj_description,
                   elementId(sr) AS sr_eid, sr.role AS role, sr.title AS title,
                   sr.esco_code AS esco_code, sr.confidence AS sr_confidence,
                   sr.cfj_for_stakeholder AS cfj_for_stakeholder,
                   es.need_statement AS need_statement,
                   es.need_direction AS need_direction,
                   es.metric_word AS metric_word, es.error_type AS error_type,
                   o.importance AS imp, o.importance_band AS imp_band,
                   o.importance_rationale AS imp_rat,
                   o.importance_confidence_pct AS imp_conf,
                   o.importance_confidence_band AS imp_conf_b,
                   o.satisfaction AS sat, o.satisfaction_band AS sat_band,
                   o.satisfaction_rationale AS sat_rat,
                   o.satisfaction_confidence_pct AS sat_conf,
                   o.satisfaction_confidence_band AS sat_conf_b,
                   o.opportunity_score AS opp, o.opportunity_rank AS rank,
                   o.error_statement AS stmt, o.source_job AS source_job,
                   o.job_type AS job_type
            """,
            network=NETWORK,
        ):
            uname = rec["unit_name"]
            unit_meta[uname] = {
                "level": rec["unit_level"],
                "cfj": rec["unit_cfj"] or rec["unit_cfj_description"] or "",
            }
            sr = sr_by_unit[uname].setdefault(
                rec["sr_eid"],
                {
                    "role": rec["role"],
                    "title": rec["title"],
                    "esco_code": rec["esco_code"],
                    "n": 0,
                    "cfj_for_stakeholder": rec["cfj_for_stakeholder"],
                    "confidence": rec["sr_confidence"],
                },
            )
            sr["n"] += 1
            role_sr[rec["role"]].add(rec["sr_eid"])
            role_ratings[rec["role"]] += 1
            job_type_ratings[rec["job_type"]] += 1
            total_rows += 1
            rows_by_unit[uname].append(
                {
                    "stk": rec["title"],
                    "role": rec["role"],
                    "role_label": prettify_role(rec["role"]),
                    "esco_code": rec["esco_code"],
                    "job_type": rec["job_type"],
                    "source_job": rec["source_job"],
                    "stmt": rec["stmt"],
                    "imp": rec["imp"],
                    "imp_band": rec["imp_band"],
                    "imp_rat": rec["imp_rat"],
                    "imp_conf": rec["imp_conf"],
                    "imp_conf_b": rec["imp_conf_b"],
                    "sat": rec["sat"],
                    "sat_band": rec["sat_band"],
                    "sat_rat": rec["sat_rat"],
                    "sat_conf": rec["sat_conf"],
                    "sat_conf_b": rec["sat_conf_b"],
                    "opp": rec["opp"],
                    "rank": rec["rank"],
                    "need_direction": rec["need_direction"],
                    "metric_word": rec["metric_word"],
                    "error_type": rec["error_type"],
                }
            )

        # total SR rels in graph (incl. SRs without ratings) for the note
        sr_rel_total = session.run(
            """
            MATCH (u:ValueNetworkUnit {value_network:$network})
                  -[:has_stakeholder_role]->(sr:StakeholderRole)
            RETURN count(*) AS c
            """,
            network=NETWORK,
        ).single()["c"]

        rated_sr_total = sum(len(v) for v in sr_by_unit.values())
        if sr_rel_total != rated_sr_total:
            notes.append(
                f"{sr_rel_total} has_stakeholder_role rels in graph but only "
                f"{rated_sr_total} stakeholder roles carry ODI ratings"
            )

        # ---- product matches (Waldner only) -----------------------------
        product_matches = []
        excluded_owner_matches = 0
        for rec in session.run(
            """
            MATCH (c:Company)-[:has_product]->(p:Product)
                  -[:matches_vn_unit]->(u:ValueNetworkUnit {value_network:$network})
            RETURN c.name AS company, p.name AS product,
                   u.name AS unit_name, u.level AS unit_level
            """,
            network=NETWORK,
        ):
            if rec["company"] != OWNER_COMPANY:
                excluded_owner_matches += 1
                continue
            uid = id_by_name.get(rec["unit_name"])
            if uid is None:
                notes.append(f"product match to unit not in tree: {rec['unit_name']}")
                continue
            product_matches.append(
                {
                    "product": rec["product"],
                    "unit_name": rec["unit_name"],
                    "unit_level": rec["unit_level"],
                    "unit_id": uid,
                }
            )
        product_matches.sort(key=lambda m: (m["unit_name"], m["product"]))
        # de-duplicate identical (product, unit) pairs if the graph has any
        seen_pairs = set()
        deduped = []
        for m in product_matches:
            key = (m["product"], m["unit_id"])
            if key in seen_pairs:
                continue
            seen_pairs.add(key)
            deduped.append(m)
        if len(deduped) != len(product_matches):
            notes.append(
                f"de-duplicated {len(product_matches) - len(deduped)} repeated product-unit pairs"
            )
        product_matches = deduped
        matched_unit_names = {m["unit_name"] for m in product_matches}

        # ---- per-unit ODI files + index ---------------------------------
        odi_reg = SlugRegistry()
        index_entries = []
        for uname in sorted(rows_by_unit.keys()):
            rows = rows_by_unit[uname]
            rows.sort(
                key=lambda r: (
                    -(r["opp"] if r["opp"] is not None else float("-inf")),
                    -(r["imp"] if r["imp"] is not None else float("-inf")),
                )
            )
            slug = odi_reg.make(uname)
            meta = unit_meta[uname]
            stakeholders = sorted(
                sr_by_unit[uname].values(),
                key=lambda s: (s["role"] or "", s["title"] or ""),
            )
            write_json(
                ODI_DIR / f"{slug}.json",
                {
                    "unit": {"name": uname, "level": meta["level"], "cfj": meta["cfj"]},
                    "stakeholders": stakeholders,
                    "rows": rows,
                },
            )
            opps = [r["opp"] for r in rows if r["opp"] is not None]
            index_entries.append(
                {
                    "slug": slug,
                    "unit_name": uname,
                    "unit_id": id_by_name.get(uname),
                    "level": meta["level"],
                    "cfj": meta["cfj"],
                    "stakeholders": len(stakeholders),
                    "needs": len(rows),
                    "top_opportunity": max(opps) if opps else None,
                    "avg_opportunity": (sum(opps) / len(opps)) if opps else None,
                    "underserved": sum(
                        1
                        for r in rows
                        if r["imp"] is not None
                        and r["sat"] is not None
                        and (r["imp"] - r["sat"]) >= 3
                    ),
                    "product_matched": uname in matched_unit_names,
                }
            )
        index_entries.sort(
            key=lambda e: -(e["top_opportunity"] if e["top_opportunity"] is not None else float("-inf"))
        )
        write_json(ODI_DIR / "index.json", index_entries)

        missing_ids = [e["unit_name"] for e in index_entries if e["unit_id"] is None]
        if missing_ids:
            notes.append(f"rated units missing from tree: {missing_ids}")

        # ---- market.json -------------------------------------------------
        role_totals = [
            {"role": role, "srs": len(role_sr[role]), "ratings": role_ratings[role]}
            for role in sorted(role_ratings, key=lambda r: -role_ratings[r])
        ]
        job_type_totals = [
            {"job_type": jt, "ratings": job_type_ratings[jt]}
            for jt in sorted(job_type_ratings, key=lambda j: -job_type_ratings[j])
        ]
        write_json(
            DATA_DIR / "market.json",
            {
                "naics_code": NAICS,
                "naics_title": meta_rec["naics_title"],
                "segment_name": meta_rec["segment_name"],
                "market_name": meta_rec["market_name"],
                "vn_rationale": meta_rec["vn_rationale"],
                "unit_count": meta_rec["unit_count"],
                "level_counts": level_counts,
                "rated_units": len(index_entries),
                "stakeholder_roles": rated_sr_total,
                "total_needs": total_rows,
                "role_totals": role_totals,
                "job_type_totals": job_type_totals,
                "product_matches": product_matches,
            },
        )

        # ---- default unit selection ---------------------------------------
        matched_entries = [e for e in index_entries if e["product_matched"]]
        pool = matched_entries if matched_entries else index_entries
        default_unit = max(
            pool,
            key=lambda e: e["top_opportunity"] if e["top_opportunity"] is not None else float("-inf"),
        )

        # ---- verification ---------------------------------------------------
        all_tree_ids = set()

        def collect(n):
            all_tree_ids.add(n["id"])
            for c in n.get("children", []):
                collect(c)

        collect(root_node)
        assert tree_units == 6616, f"tree_units={tree_units}"
        assert len(all_tree_ids) == tree_units, "duplicate ids in tree"
        assert total_rows == sum(e["needs"] for e in index_entries)
        for e in index_entries:
            assert e["unit_id"] in all_tree_ids, e["unit_name"]
        for m in product_matches:
            assert m["unit_id"] in all_tree_ids, m["unit_name"]

        print("---- SUMMARY ----")
        print(f"tree_units            : {tree_units}")
        print(f"rated_units           : {len(index_entries)}")
        print(f"total_rows            : {total_rows}")
        print(f"stakeholder_roles     : {rated_sr_total} (rated) / {sr_rel_total} rels in graph")
        print(f"product_matched_units : {len(matched_unit_names)}")
        print(f"waldner product pairs : {len(product_matches)} (excluded non-Waldner: {excluded_owner_matches})")
        print(f"default_unit_slug     : {default_unit['slug']} (top_opp={default_unit['top_opportunity']})")
        for n in notes:
            print(f"NOTE: {n}")

    driver.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
