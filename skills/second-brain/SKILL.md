---
name: second-brain
description: Universal System Analyst Second Brain. Ingests BRD, Figma, DB DDL/DML, production code, and MoM notes into verified engineering deliverables (PlantUML sequence diagrams, Markdown API contracts, LLDs) with strict provenance, constraint branching, and 5-tier anti-gaslighting protection.
---

# Universal Second Brain: Architectural & Technical Knowledge Engine

Second Brain is an autonomous knowledge synthesis and system analyst engine. It ingests messy product and technical source materials (BRDs, Figma exports, existing codebase repositories, Meeting Minutes/MoMs, and database schemas) and synthesizes them into production-ready engineering deliverables with uncompromised integrity.

---

## 🏛️ The 6-Zone Architecture

Every Second Brain repository organizes information across 6 explicit zones:

```text
├── 00-raw-inputs/               # UNTRUSTED: Raw, unverified source files
│   ├── brd/                     # Product requirements, user stories, specs
│   ├── figma/                   # Screen flows, UX specs, copy text, design tokens
│   ├── db/                      # Schema DDL (CREATE TABLE), migrations, DML seeds
│   ├── existing-code/           # Repos, handler snippets, service logic, routes
│   └── mom/                     # Meeting minutes, chat agreements, email decisions
│
├── 01-ground-truth/             # CANONICAL: Crystallized system reality
│   ├── domain-glossary.md       # Ubiquitous language & business entity glossary
│   ├── entity-catalog.md        # Data models, field constraints, lifecycle states
│   └── api-inventory.md         # Active endpoint catalogue & service boundaries
│
├── 02-provenance/               # INTEGRITY: Traceability & truth verification
│   ├── traceability-matrix.md   # Requirement <-> Code <-> Deliverable link table
│   └── contradictions.md       # Contradiction log & anti-gaslighting audit trail
│
├── 03-constraint-branches/      # EXPLORATION: Isolated architectural trade-offs
│   └── scenario-{name}.md       # Impact analysis: "What if Constraint A vs B?"
│
├── 04-deliverables/             # DELIVERABLES: Production engineering artifacts
│   ├── sequence-diagrams/       # PlantUML (.puml) sequence diagrams with citations
│   ├── api-contracts/           # REST/IFA interface specifications in Markdown
│   └── lld/                     # Complete Low-Level Design documents (.md)
│
├── 05-adrs/                     # DECISIONS: Immutable Architectural Decision Records
│   ├── 0001-hierarchy-of-truth-and-hard-block.md
│   └── ...                      # Sequential ADR records
│
├── CONTEXT.md                   # Formal domain model dictionary
├── AGENTS.md                    # Universal AI agent instructions
├── CLAUDE.md                    # Claude Code configuration
└── .cursorrules                 # Cursor IDE configuration
```

---

## 🛡️ 5-Tier Precedence of Truth & Anti-Gaslighting

AI agents are susceptible to conversational gaslighting, hallucinated consensus, and contradictory meeting notes. The Second Brain enforces this absolute truth hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 1: Production Code & Active Database DDL (Ground Truth) │
├─────────────────────────────────────────────────────────────┤
│ Tier 2: Signed BRD / Approved PRD / Official Contracts      │
├─────────────────────────────────────────────────────────────┤
│ Tier 3: Accepted Architectural Decision Records (05-adrs/)  │
├─────────────────────────────────────────────────────────────┤
│ Tier 4: Meeting Minutes (MoM) & Chat Discussions            │
├─────────────────────────────────────────────────────────────┤
│ Tier 5: Ad-hoc Conversational User Prompts / Chat Claims     │
└─────────────────────────────────────────────────────────────┘
```

### 🛑 Hard Block Rule
When processing any input from Tier 4 or Tier 5 that contradicts Tier 1, Tier 2, or Tier 3:
1. **HALT IMMEDIATELY**: Do NOT update or generate deliverables.
2. **Log to `02-provenance/contradictions.md`**: Record the conflict ID, offending source, conflicting tiers, and exact discrepancies.
3. **Launch Resolution Wizard**: Prompt the human operator to arbitrate the contradiction. Deliverables remain locked until an ADR is officially recorded in `05-adrs/`.

---

## ⚡ Command Reference

All Second Brain commands are single-token hyphenated commands:

### 1. `/brain-init`
Scaffolds the 6-zone folder structure, starter templates, rule files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`), and `CONTEXT.md` in the current project.

### 2. `/brain-ingest`
- Recursively reads all files in `00-raw-inputs/`.
- Extracts terms and entities into `01-ground-truth/domain-glossary.md` and `entity-catalog.md`.
- Cross-references incoming claims against Tier 1 (Code/DDL) and Tier 2 (BRD).
- If contradictions are found: triggers a **Hard Block**, writes to `02-provenance/contradictions.md`, and activates the Resolution Wizard.
- Updates `02-provenance/traceability-matrix.md`.

### 3. `/brain-deliver`
- Verifies that no unresolved Hard Block exists in `02-provenance/contradictions.md`.
- Generates or updates:
  - PlantUML sequence diagrams (`04-deliverables/sequence-diagrams/*.puml`)
  - API Contracts in Markdown (`04-deliverables/api-contracts/*.md`)
  - Low-Level Design documents (`04-deliverables/lld/*.md`)
- Attaches inline provenance citations (`[SRC:...]`) to every endpoint, state transition, and payload attribute.

### 4. `/brain-branch <scenario-name>`
- Creates an isolated scenario exploration document in `03-constraint-branches/scenario-<name>.md`.
- Evaluates architectural impact (e.g. "Scenario A: Latency < 50ms with Redis" vs "Scenario B: Budget constraint / No Redis").
- Preserves canonical deliverables untouched.

### 5. `/brain-adopt <scenario-name>`
- Promotes a constraint scenario into production reality.
- Generates a new sequential ADR in `05-adrs/`.
- Updates the scenario status to `ADOPTED`.
- Triggers `/brain-deliver` to synchronize `04-deliverables/` with the new architecture.

### 6. `/brain-audit`
- Audits the entire Second Brain repository.
- Asserts 100% provenance coverage (flags any deliverable element lacking a source tag).
- Verifies all DDL types match API contract payload types.
- Asserts that all ADRs are properly reflected in deliverables.

---

## 🏷️ Provenance Citation Syntax

Every deliverable artifact MUST embed provenance tags:

### PlantUML (`.puml`)
```plantuml
autonumber "<b>[00]</b>"
User -> APIGW: POST /api/v1/orders\n<color:#007acc><b>[SRC:BRD#REQ-01]</b></color>
activate APIGW
APIGW -> OrderSvc: CreateOrder(payload)\n<color:#28a745><b>[SRC:DDL:tbl_orders]</b></color>
activate OrderSvc
OrderSvc --> APIGW: 201 Created (OrderID)
deactivate OrderSvc
APIGW --> User: 201 Created
deactivate APIGW
```

### API Contract (`.md`)
```markdown
### POST /api/v1/orders
> **Provenance**: `[SRC:BRD#REQ-01]` | `[SRC:DDL:tbl_orders]` | `[SRC:CODE:order_handler.go#L45]`

**Request Headers**:
- `Authorization`: `Bearer <jwt>` `[SRC:CODE:jwt_middleware.go#L18]`

**Request Body**:
- `customer_id` (string, UUID, required): ID of purchasing customer `[SRC:DDL:tbl_orders.customer_id]`
- `total_amount` (int64, IDR, required): Total transaction amount in Rupiah `[SRC:BRD#REQ-04]`
```

### Traceability Matrix (`traceability-matrix.md`)
```markdown
| Artifact Element | Provenance Tag | Authoritative Source File & Line | Truth Tier | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/v1/orders` | `[SRC:BRD#REQ-01]` | `00-raw-inputs/brd/order-brd.md#L45` | Tier 2 | Verified |
| `tbl_orders.status` | `[SRC:DDL:tbl_orders]` | `00-raw-inputs/db/schema.sql#L12` | Tier 1 | Verified |
```

---

## 🧙‍♂️ Resolution Wizard Workflow

When a Hard Block is triggered by `/brain-ingest`:

1. **AI Output**:
   ```text
   🚨 HARD BLOCK TRIGGERED: CONTRADICTION DETECTED
   Conflict ID: CONF-001
   - Incoming Claim: MoM 2026-03-15 states "Order cancellation does not require manager approval" (Tier 4)
   - Canonical Reality: BRD Section 4.2 & Code state "Manager approval required if order amount > Rp 5,000,000" (Tier 1/2)

   Interactive Resolution Wizard:
   Option 1: Retain Ground Truth (Reject MoM claim, enforce Tier 1/2).
   Option 2: Approve MoM Modification (Generate new ADR in 05-adrs/ and update deliverables).
   Option 3: Branch as Constraint Scenario (Evaluate in 03-constraint-branches/ before deciding).
   ```
2. **Resolution**:
   - If Operator selects Option 1: The contradiction is resolved as `REJECTED`, and canonical deliverables remain protected.
   - If Operator selects Option 2: AI creates `05-adrs/000X-override-order-cancellation-approval.md`, updates `01-ground-truth/`, and releases the Hard Block.
