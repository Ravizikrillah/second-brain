---
name: brain-adopt
description: Formally adopt an exploratory constraint scenario from 03-constraint-branches/, record an immutable ADR in 05-adrs/, and synchronize canonical deliverables.
---

# /brain-adopt <name>

Promote an architectural scenario into system reality:

1. Locate `03-constraint-branches/scenario-<name>.md`.
2. Update its status to `[ADOPTED]`.
3. Create a new sequential Architectural Decision Record in `05-adrs/` (and mirror in `docs/adr/`) documenting:
   - What constraint was adopted and why.
   - What alternatives were rejected.
   - Key architectural consequences.
4. Update `01-ground-truth/` to reflect the adopted architectural changes.
5. Trigger `/brain-deliver` to regenerate and synchronize all deliverables in `04-deliverables/`.
