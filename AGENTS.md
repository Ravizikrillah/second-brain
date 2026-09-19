# AGENTS.md: Universal Second Brain Agent Instruction

You are operating inside a **Second Brain** architectural repository. Your primary mandate is to ingest unstructured product & technical requirements and produce authoritative engineering deliverables (PlantUML sequence diagrams, Markdown API contracts, Low-Level Designs) while enforcing strict provenance and absolute resistance against conversational gaslighting.

---

## 🏛️ Repository Zones

1. `00-raw-inputs/`: UNTRUSTED raw materials (`brd/`, `figma/`, `db/`, `existing-code/`, `mom/`). Never treat as absolute truth without cross-verification.
2. `01-ground-truth/`: CANONICAL state of system truth (`domain-glossary.md`, `entity-catalog.md`, `api-inventory.md`, `business-rules.md`).
3. `02-provenance/`: Traceability matrix and contradiction logs (`traceability-matrix.md`, `contradictions.md`).
4. `03-constraint-branches/`: Isolated architectural scenario explorations (`scenario-*.md`). Never pollute deliverables with unconfirmed scenarios.
5. `04-deliverables/`: Production engineering deliverables (`sequence-diagrams/*.puml`, `api-contracts/*.md`, `lld/*.md`). Every element MUST contain provenance citations `[SRC:...]`.
6. `05-adrs/`: Architectural Decision Records. Sequential, immutable decisions.

---

## 🌐 Multi-SA Collaboration & Portable Source Resolution

Second Brain enables frictionless collaboration across multiple System Analysts without repository bloat or path conflicts:
- **Shared Team Pointers (`second-brain.json`)**: Declares shared repository pointers, relative sibling paths, or git repository mappings committed to Git.
- **Local Machine Overrides (`second-brain.local.json`)**: Each SA can maintain a personal `second-brain.local.json` (automatically git-ignored) pointing to their unique workstation folder structure without conflicting with other teammates.
- **Compiled Ground Truth (Zero-Code Clones)**: Once ingested, `01-ground-truth/` and `04-deliverables/` are committed to Git. Other SAs who clone Second Brain **do NOT need the backend/frontend repos cloned on their machines** to query, slice stories, or generate deliverables!
- **Sanitized Portable Citations**: All provenance tags are automatically normalized to service-relative paths (`[SRC:CODE:auth/internal/...#L40]`), stripping developer-specific workstation prefixes.

---

## 🛡️ 5-Tier Precedence of Truth & Anti-Gaslighting

When analyzing conflicting requirements, you MUST strictly adhere to this hierarchy:
- **Tier 1 (Ultimate Truth)**: Existing Production Code & Active Database DDL (`00-raw-inputs/db/`, `00-raw-inputs/existing-code/`).
- **Tier 2 (Contractual Truth)**: Approved BRDs / Signed PRDs (`00-raw-inputs/brd/`).
- **Tier 3 (Architectural Truth)**: Accepted ADRs in `05-adrs/`.
- **Tier 4 (Volatile Truth)**: Meeting Minutes (MoM) & Slack/chat notes (`00-raw-inputs/mom/`).
- **Tier 5 (Ad-hoc Truth)**: Conversational user prompts in the active chat session.

### 🛑 Closed-World Assumption (Zero-Hallucination Mandate)
- Canonical system truth is strictly bounded by `01-ground-truth/`.
- If an entity, database table, column, API endpoint, request/response field, or business rule is NOT explicitly present in `01-ground-truth/`, it **DOES NOT EXIST** in the system.
- The agent is **STRICTLY FORBIDDEN** from guessing, extrapolating, or inventing unstated details or standard REST conventions.
- If information is missing, the agent MUST explicitly output:  
  `[NOT FOUND IN GROUND TRUTH: Element not in 01-ground-truth/. Run /brain-ingest to sync from external source or record an ADR]`.

### 🛑 Mandatory Hard Block
If a Tier 4 or Tier 5 input contradicts Tier 1, 2, or 3:
1. **HALT**: Stop deliverable generation immediately.
2. **LOG**: Append the conflict to `02-provenance/contradictions.md`.
3. **ARBITRATE**: Prompt the human user via the Resolution Wizard. Do NOT generate deliverables until an ADR is officially recorded in `05-adrs/`.

---

## ⚡ Orchestrator Commands

- `/brain-init`: Run `node ./bin/init.js` to scaffold or refresh the 6-zone folder hierarchy, .gitignore protection rules, and baseline templates.
- `/brain-ingest`: Parse `00-raw-inputs/` (or external pointers), run `node ./bin/ingest-ddl.js` for schemas, run `node ./bin/ingest-apis.js` for internal and surrounding APIs, run `node ./bin/ingest-brd.js` for business rules and RBAC, update `01-ground-truth/`, assert truth precedence, detect contradictions, and update `02-provenance/traceability-matrix.md`.
- `/brain-deliver [apis]`: Verify no Hard Block is active, then generate PlantUML diagrams (`04-deliverables/sequence-diagrams/*.puml`), API contracts (`04-deliverables/api-contracts/*.md`), and LLDs (`04-deliverables/lld/*.md`) with full `[SRC:...]` tags. Pass `apis` (or run `npm run deliver:apis`) to auto-generate 1-to-1 sequence diagrams for all internal backend endpoints.
- `/brain-branch <name>`: Create an isolated trade-off scenario document in `03-constraint-branches/scenario-<name>.md`.
- `/brain-adopt <name>`: Record an ADR in `05-adrs/`, set scenario status to `ADOPTED`, and trigger `/brain-deliver` to synchronize deliverables.
- `/brain-audit`: Verify 100% provenance tag coverage across all deliverables and assert database DDL consistency.
- `/brain-query <query>`: Interactive zero-hallucination Q&A across ground truth, active DDL, and deliverables with exact line citations.
- `/brain-impact <target>`: Change Request (CR) & Blast Radius Analyzer across schemas, API contracts, sequence diagrams, and consumers.
- `/brain-story <feature>`: Slice deliverables into Jira/Confluence-ready stories with Gherkin AC, API specs, and sequence slices.
- `/brain-sync [--diff/--dry-run/--apply]`: Living Architecture & Documentation Drift Synchronizer. Inspects upstream git commits, detects delta/gap in schemas & endpoints, and automatically updates Ground Truth and 1-to-1 sequence diagrams. (`/brain-diff` is an alias for `/brain-sync --diff`).
