---
name: brain-ingest
description: Ingest unstructured BRDs, Figma specs, active DB DDL/DML, existing code, and MoMs from 00-raw-inputs/, update 01-ground-truth/, enforce 5-tier truth precedence, and detect contradictions.
---

# /brain-ingest

Execute the Second Brain ingestion and cross-verification pipeline:

1. Recursively scan and read all files in `00-raw-inputs/` (`brd/`, `figma/`, `db/`, `existing-code/`, `mom/`).
2. Extract domain vocabulary into `01-ground-truth/domain-glossary.md`.
3. Extract entity schemas, primary keys, and state transitions into `01-ground-truth/entity-catalog.md`.
4. Extract endpoints and interfaces into `01-ground-truth/api-inventory.md`.
5. Enforce 5-Tier Precedence of Truth:
   - Tier 1: Production Code & DB DDL > Tier 2: BRD/PRD > Tier 3: ADRs > Tier 4: MoM > Tier 5: Chat prompts.
6. If any lower-tier input contradicts a higher tier:
   - Trigger a **Hard Block**.
   - Record details into `02-provenance/contradictions.md`.
   - Prompt the user with the Interactive Resolution Wizard to arbitrate via an ADR in `05-adrs/`.
7. Update `02-provenance/traceability-matrix.md` with verified source citations.
