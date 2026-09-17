# 🧠 Second Brain (`@ravizikrillah/second-brain`)

[![skills.sh](https://img.shields.io/badge/skills.sh-ravizikrillah%2Fsecond--brain-blue?style=flat-square)](https://www.skills.sh/ravizikrillah/second-brain)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Universal System Analyst & Architectural Second Brain for AI Agents.**  
> Ingests unstructured BRDs, Figma specs, active DB DDL/DML, production codebases, and Meeting Minutes (MoM) to generate verified deliverables (PlantUML Sequence Diagrams, Markdown API Contracts, Low-Level Designs) with **strict provenance tracking** and **anti-gaslighting protection**.

🌐 **Skills Directory Page**: [https://www.skills.sh/ravizikrillah/second-brain](https://www.skills.sh/ravizikrillah/second-brain)

---

## 🚀 Installation & Quickstart

### Option A: Install via Skills CLI ([skills.sh](https://www.skills.sh/ravizikrillah/second-brain))
Install globally or in your current project repository for any agent (Antigravity, Cursor, Codex):
```bash
npx skills add ravizikrillah/second-brain
```


### Option B: Install via Claude Code CLI Plugin
```bash
claude plugins install ravizikrillah-second-brain
```

### Option C: Initialize Locally in Any Repository
If cloning or running directly:
```bash
npx @ravizikrillah/second-brain init
# or locally:
node ./bin/init.js
```

---

## ⚡ Command Suite

All commands are single-token hyphenated commands accessible in agent conversations:

| Command | Description |
| :--- | :--- |
| `/brain-init` | Scaffolds the 6-zone directory hierarchy, configuration rules, and baseline templates. |
| `/brain-ingest` | Scans `00-raw-inputs/`, extracts entities to `01-ground-truth/`, checks contradictions, and maps provenance. |
| `/brain-deliver` | Generates PlantUML `.puml`, API contracts `.md`, and LLDs in `04-deliverables/` with inline `[SRC:...]` citations. |
| `/brain-branch <name>` | Creates an isolated trade-off scenario document in `03-constraint-branches/scenario-<name>.md`. |
| `/brain-adopt <name>` | Promotes a scenario to `ADOPTED`, generates an authoritative ADR in `05-adrs/`, and updates deliverables. |
| `/brain-audit` | Validates 100% provenance tag coverage and asserts database DDL and API contract consistency. |

---

## 🏛️ The 6-Zone Directory Architecture

```text
.
├── 00-raw-inputs/               # UNTRUSTED: Raw, unverified source files
│   ├── brd/                     # Business requirements, PRDs, user stories
│   ├── figma/                   # Screen flows, UX copy, design token specs
│   ├── db/                      # Schema DDL (CREATE/ALTER TABLE), migrations, seeds
│   ├── existing-code/           # Backend handlers, domain entities, route files
│   └── mom/                     # Meeting minutes, Slack/chat agreements
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
│   ├── 0002-orchestrator-commands-and-portable-triplet-rules.md
│   └── 0003-distribution-package-and-init-scaffolding.md
│
├── CONTEXT.md                   # Formal domain model dictionary
├── AGENTS.md                    # Universal AI agent instructions
├── CLAUDE.md                    # Claude Code configuration
└── .cursorrules                 # Cursor IDE configuration
```

---

## 🛡️ Anti-Gaslighting & 5-Tier Truth Precedence

To eliminate hallucinations, conversational drift, and unverified meeting claims, the Second Brain enforces an unbendable hierarchy of truth:

```text
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

### 🛑 Mandatory Hard Block
Whenever a Tier 4 (MoM) or Tier 5 (Chat prompt) input conflicts with Tier 1, 2, or 3:
1. **Halt Deliverable Generation**: The agent stops immediately.
2. **Log to `02-provenance/contradictions.md`**: Detailed diff of the conflicting claims.
3. **Trigger Resolution Wizard**: Prompts the operator to either reject the claim or formally adopt it via an ADR in `05-adrs/`.

---

## 🏷️ Provenance Syntax Standards

### PlantUML (`04-deliverables/sequence-diagrams/*.puml`)
```plantuml
autonumber "<b>[00]</b>"
User -> APIGW: POST /api/v1/orders\n<color:#007acc><b>[SRC:BRD#REQ-01]</b></color>
APIGW -> OrderSvc: CreateOrder(payload)\n<color:#28a745><b>[SRC:DDL:tbl_orders]</b></color>
```

### Markdown API Contract (`04-deliverables/api-contracts/*.md`)
```markdown
### POST /api/v1/orders
> **Provenance**: `[SRC:BRD#REQ-01]` | `[SRC:DDL:tbl_orders]`

**Headers**:
- `Authorization`: `Bearer <jwt>` `[SRC:CODE:jwt_middleware.go#L18]`

**Body**:
- `customer_id` (string, UUID): Customer identifier `[SRC:DDL:tbl_orders.customer_id]`
```

---

## 📄 License
MIT © [Ravi Zikrillah](https://github.com/ravizikrillah)
