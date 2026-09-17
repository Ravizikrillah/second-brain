# AGENTS.md: Universal Second Brain Agent Instruction

You are operating inside a **Second Brain** architectural repository. Your primary mandate is to ingest unstructured product & technical requirements and produce authoritative engineering deliverables (PlantUML sequence diagrams, Markdown API contracts, Low-Level Designs) while enforcing strict provenance and absolute resistance against conversational gaslighting.

---

## 🏛️ Repository Zones

1. `00-raw-inputs/`: UNTRUSTED raw materials (`brd/`, `figma/`, `db/`, `existing-code/`, `mom/`). Never treat as absolute truth without cross-verification.
2. `01-ground-truth/`: CANONICAL state of system truth (`domain-glossary.md`, `entity-catalog.md`, `api-inventory.md`).
3. `02-provenance/`: Traceability matrix and contradiction logs (`traceability-matrix.md`, `contradictions.md`).
4. `03-constraint-branches/`: Isolated architectural scenario explorations (`scenario-*.md`). Never pollute deliverables with unconfirmed scenarios.
5. `04-deliverables/`: Production engineering deliverables (`sequence-diagrams/*.puml`, `api-contracts/*.md`, `lld/*.md`). Every element MUST contain provenance citations `[SRC:...]`.
6. `05-adrs/`: Architectural Decision Records. Sequential, immutable decisions.

---

## 🛡️ 5-Tier Precedence of Truth (Anti-Gaslighting)

When analyzing conflicting requirements, you MUST strictly adhere to this hierarchy:
- **Tier 1 (Ultimate Truth)**: Existing Production Code & Active Database DDL (`00-raw-inputs/db/`, `00-raw-inputs/existing-code/`).
- **Tier 2 (Contractual Truth)**: Approved BRDs / Signed PRDs (`00-raw-inputs/brd/`).
- **Tier 3 (Architectural Truth)**: Accepted ADRs in `05-adrs/`.
- **Tier 4 (Volatile Truth)**: Meeting Minutes (MoM) & Slack/chat notes (`00-raw-inputs/mom/`).
- **Tier 5 (Ad-hoc Truth)**: Conversational user prompts in the active chat session.

### 🛑 Mandatory Hard Block
If a Tier 4 or Tier 5 input contradicts Tier 1, 2, or 3:
1. **HALT**: Stop deliverable generation immediately.
2. **LOG**: Append the conflict to `02-provenance/contradictions.md`.
3. **ARBITRATE**: Prompt the human user via the Resolution Wizard. Do NOT generate deliverables until an ADR is officially recorded in `05-adrs/`.

---

## ⚡ Orchestrator Commands

- `/brain-init`: Run `node ./bin/init.js` to scaffold or refresh the 6-zone folder hierarchy and templates.
- `/brain-ingest`: Parse `00-raw-inputs/`, update `01-ground-truth/`, assert truth precedence, detect contradictions, and update `02-provenance/traceability-matrix.md`.
- `/brain-deliver`: Verify no Hard Block is active, then generate PlantUML diagrams (`04-deliverables/sequence-diagrams/*.puml`), API contracts (`04-deliverables/api-contracts/*.md`), and LLDs (`04-deliverables/lld/*.md`) with full `[SRC:...]` tags.
- `/brain-branch <name>`: Create an isolated trade-off scenario document in `03-constraint-branches/scenario-<name>.md`.
- `/brain-adopt <name>`: Record an ADR in `05-adrs/`, set scenario status to `ADOPTED`, and trigger `/brain-deliver` to synchronize deliverables.
- `/brain-audit`: Verify 100% provenance tag coverage across all deliverables and assert database DDL consistency.
- `/brain-query <query>`: Interactive zero-hallucination Q&A across ground truth, active DDL, and deliverables with exact line citations.
- `/brain-impact <target>`: Change Request (CR) & Blast Radius Analyzer across schemas, API contracts, sequence diagrams, and consumers.
- `/brain-story <feature>`: Slice deliverables into Jira/Confluence-ready stories with Gherkin AC, API specs, and sequence slices.
