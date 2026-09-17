---
name: brain-branch
description: Create and evaluate isolated architectural constraint scenarios in 03-constraint-branches/scenario-{name}.md without polluting canonical deliverables.
---

# /brain-branch <name>

Explore an architectural "What-If" scenario under technical, operational, or business constraints:

1. Create or update `03-constraint-branches/scenario-<name>.md`.
2. Document:
   - Specific constraint requirements (e.g. Latency < 50ms, No Redis, Offline-first, Legacy DB frozen).
   - Impacted services, database schemas, and external dependencies.
   - Architectural trade-off analysis (Pros vs Cons vs Cost vs Complexity).
   - Solution delta against canonical baseline.
3. Keep status as `[PROPOSED]` or `[EVALUATING]`.
4. Ensure canonical deliverables in `04-deliverables/` remain untouched until formally adopted.
