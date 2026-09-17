# CLAUDE.md: Second Brain Architecture Engine

## Guidelines for Claude Code

When working in this repository:
1. **Never guess or assume requirements**: Look up ground truth in `01-ground-truth/` or raw evidence in `00-raw-inputs/`.
2. **Observe 5-Tier Truth Precedence**:
   - Production Code & DB DDL (Tier 1) > Signed BRD (Tier 2) > Accepted ADRs (Tier 3) > MoM & Chat notes (Tier 4) > Conversational prompts (Tier 5).
3. **Hard Block on Contradictions**: If user prompts or MoM files conflict with Tier 1/2/3, HALT deliverable generation, record in `02-provenance/contradictions.md`, and guide the user through the Resolution Wizard to generate an ADR in `05-adrs/`.
4. **Mandatory Provenance**: Every endpoint, model field, and diagram step in `04-deliverables/` must include inline citation tags:
   - PlantUML: `<color:#007acc><b>[SRC:BRD#REQ-01]</b></color>`
   - Markdown: `> **Provenance**: [SRC:BRD#REQ-01] | [SRC:DDL:tbl_orders]`
5. **Commands**:
   - `/brain-init`: Initialize 6-zone folder structure and starter templates.
   - `/brain-ingest`: Ingest raw inputs, run `ingest-ddl.js` & `ingest-apis.js` to disambiguate Internal APIs vs External Surrounding Systems, detect conflicts, map provenance.
   - `/brain-deliver`: Generate PlantUML sequence diagrams, Markdown API contracts, and LLDs.
   - `/brain-branch <name>`: Create isolated trade-off scenario in `03-constraint-branches/`.
   - `/brain-adopt <name>`: Adopt scenario via ADR and synchronize deliverables.
   - `/brain-audit`: Audit 100% provenance and system consistency.
   - `/brain-query <query>`: Interactive Q&A across ground truth, active DDL, and deliverables.
   - `/brain-impact <target>`: Change Request (CR) & Blast Radius Analyzer.
   - `/brain-story <feature>`: Slice deliverables into Jira/Confluence-ready stories with Gherkin AC.
