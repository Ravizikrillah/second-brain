# CLAUDE.md: Second Brain Architecture Engine

## Guidelines for Claude Code

When working in this repository:
1. **Never guess or assume requirements**: Look up ground truth in `01-ground-truth/` or raw evidence in `00-raw-inputs/`.
2. **Observe 5-Tier Truth Precedence**:
   - Production Code & DB DDL (Tier 1) > Signed BRD (Tier 2) > Accepted ADRs (Tier 3) > MoM & Chat notes (Tier 4) > Conversational prompts (Tier 5).
3. **Closed-World Assumption (Zero-Hallucination Mandate)**:
   - System truth is strictly bounded by `01-ground-truth/`. If an entity, column, API endpoint, query parameter, DTO field, or business rule is not explicitly present in `01-ground-truth/`, it DOES NOT EXIST.
   - Never guess, extrapolate, or assume unstated REST patterns. Output `[NOT FOUND IN GROUND TRUTH]` if an element is missing.
4. **Hard Block on Contradictions**: If user prompts or MoM files conflict with Tier 1/2/3, HALT deliverable generation, record in `02-provenance/contradictions.md`, and guide the user through the Resolution Wizard to generate an ADR in `05-adrs/`.
5. **Multi-SA Collaboration**: Shared team pointers live in `second-brain.json`. Individual SAs can override with `second-brain.local.json` (git-ignored). Once ingested, `01-ground-truth/` and `04-deliverables/` are committed to Git so other SAs do NOT need the backend/frontend codebases cloned on their machines.
6. **Mandatory Provenance**: Every endpoint, model field, and diagram step in `04-deliverables/` must include inline citation tags:
   - PlantUML: `<color:#007acc><b>[SRC:BRD#REQ-01]</b></color>`
   - Markdown: `> **Provenance**: [SRC:BRD#REQ-01] | [SRC:DDL:tbl_orders]`
7. **Critical Socratic Probing (The Grill-Me Reflex)**: Never passively assume unstated requirements or edge cases. Present the direct Ground-Truth-backed answer, then append optional structured frontier questions (Decision, Recommendation, Trade-off) to stress-test failure modes, concurrency, and IFA SLAs.
8. **Commands**:
   - `/brain-init`: Initialize 6-zone folder structure, .gitignore protection rules, and starter templates.
   - `/brain-ingest`: Ingest raw inputs or external pointers via `ingest-ddl.js`, `ingest-apis.js`, and `ingest-brd.js`, detect conflicts, map provenance.
   - `/brain-deliver [apis]`: Generate PlantUML sequence diagrams, Markdown API contracts, and LLDs. Use `apis` to generate 1-to-1 endpoint sequence diagrams.
   - `/brain-branch <name>`: Create isolated trade-off scenario in `03-constraint-branches/` with cross-branch awareness (detecting obsolete parts, conflicts, and synergies).
   - `/brain-adopt <name>`: Adopt scenario via ADR and synchronize deliverables.
   - `/brain-audit`: Audit 100% provenance and system consistency.
   - `/brain-query <query>`: Interactive Q&A across ground truth, active DDL, and deliverables.
   - `/brain-impact <target>`: Change Request (CR) & Blast Radius Analyzer.
   - `/brain-story <feature>`: Slice deliverables into Jira/Confluence-ready stories with Gherkin AC.
   - `/brain-sync [--diff/--dry-run/--apply]`: Living Architecture & Documentation Synchronizer. Auto-detects drift across git repositories and synchronizes Ground Truth & 1-to-1 sequence diagrams. (Alias: `/brain-diff`).
