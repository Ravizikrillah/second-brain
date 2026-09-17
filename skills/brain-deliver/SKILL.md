---
name: brain-deliver
description: Generate authoritative PlantUML sequence diagrams, Markdown API contracts, and Low-Level Designs in 04-deliverables/ with strict provenance citations [SRC:...].
---

# /brain-deliver

Synthesize and produce production-ready deliverables from verified Ground Truth:

1. Check `02-provenance/contradictions.md` to ensure NO unresolved Hard Block is active. If a Hard Block is active, HALT immediately and notify the user.
2. Generate or update PlantUML sequence diagrams in `04-deliverables/sequence-diagrams/*.puml` with `<color:#007acc><b>[SRC:...]</b></color>` provenance tags.
3. Generate or update API contracts in `04-deliverables/api-contracts/*.md` with explicit request/response schemas, validation rules, and provenance badges.
4. Generate or update Low-Level Design documents in `04-deliverables/lld/*.md` adhering to the 3-pillar format (Architecture Context, Technical Flow, Data Model & Specs).
5. Synchronize all generated tags into `02-provenance/traceability-matrix.md`.
