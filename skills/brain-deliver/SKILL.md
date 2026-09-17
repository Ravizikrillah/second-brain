---
name: brain-deliver
description: Execute task-based deliverable generation from the Delivery Plan manifest. Produces authoritative PlantUML sequence diagrams, Markdown API contracts, and Low-Level Designs in 04-deliverables/ with strict provenance citations [SRC:...].
---

# /brain-deliver

Synthesize and produce production-ready deliverables from the Delivery Plan backlog:

## 🎯 Purpose
Transform verified Ground Truth into detailed, exhaustive engineering deliverables (PlantUML, API contracts, LLD) task-by-task without token truncation or missing requirements.

## 📋 Execution Protocol

### 1. 🛑 Pre-Flight Hard Block Check
Inspect `02-provenance/contradictions.md`.
If ANY unresolved contradiction exists (`STATUS: OPEN` / `ACTIVE`):
- **HALT immediately**.
- Notify the operator that deliverables cannot be generated until an ADR is recorded in `05-adrs/`.

### 2. 🎯 Determine Execution Target
Parse the command argument:
- `/brain-deliver <feature-name>` (e.g. `/brain-deliver eznet` or `/brain-deliver DEL-01`): Focuses solely on that specific task from `02-provenance/delivery-plan.md`.
- `/brain-deliver next` (or `/brain-deliver` without args): Finds the **first pending task (`[ ]`)** in `02-provenance/delivery-plan.md` and executes it.
- `/brain-deliver all`: Iterates through all remaining pending tasks in sequence, producing complete artifacts for each until the manifest is 100% complete.

### 3. 📄 Generate Exhaustive Deliverable Set
For the selected task/feature, produce the complete 3-pillar deliverables in `04-deliverables/`:

1. **PlantUML Sequence Diagram (`04-deliverables/sequence-diagrams/<feature>.puml`)**:
   - **Strict Architectural Partitioning**:
     - Group Internal Services inside `box "WEC FMC Internal Services" #AliceBlue ... end box`.
     - Group External Systems inside `box "External Surrounding Systems" #LightYellow ... end box` (or stereotype `participant "System Name" as Alias <<External System>> #PapayaWhip`).
     - Explicitly distinguish outbound client calls (Internal Service -> External System) from inbound webhook callbacks (External System -> Callback Router).
   - Autonumbering enabled (`autonumber "<b>[00]</b>"`).
   - Every request/response arrow MUST include an inline provenance citation tag:
     `<color:#007acc><b>[SRC:BRD#REQ-XX]</b></color>` or `<color:#28a745><b>[SRC:DDL:table_name]</b></color>`.
   - Comprehensive error paths and fallback logic (`alt / else / group`).

2. **API Contract (`04-deliverables/api-contracts/<feature>-api.md`)**:
   - Endpoint URL, HTTP Method, and provenance badge (`> **Provenance**: [SRC:...]`).
   - **Contract Boundary Tag**:
     - `Type: [INTERNAL MICROSERVICE API]` (Owned & Hosted by WEC FMC) OR
     - `Type: [EXTERNAL SURROUNDING SYSTEM IFA]` (Integration with External Core/Vendor, e.g. Central Order, ESB, UPP).
   - If External Surrounding IFA: Document Outbound Client Payload, Timeout/Retry policy, Circuit Breaker, and Fallout Recovery behavior.
   - Request Headers and Query Parameters with type & nullability.
   - Request JSON Schema with inline `[SRC:...]` tags for every field.
   - Success (`200 OK` / `201 Created`) and Error Responses (`400`, `401`, `409`, `500`, `504`).

3. **Low-Level Design (`04-deliverables/lld/<feature>-lld.md`)**:
   - **Pillar 1: Architectural Context** (Microservice topology and network routing).
   - **Pillar 2: Technical Flow** (Step-by-step logic, validation sequence, and exception handling).
   - **Pillar 3: Data Model & Specifications** (Database touchpoints, state machine transitions, caching, and async event triggers).

### 4. 🔄 Synchronize Manifest & Provenance
- Update `02-provenance/delivery-plan.md`:
  - Change the task status from `[ ]` to `[x]` (e.g. `- [x] Task DEL-01: EzNet Subscription Flow`).
  - Recalculate and update the overall progress percentage.
- Update `02-provenance/traceability-matrix.md` with the newly generated deliverable elements.

### 5. 📊 Output Completion Status
Display the task completion banner:
- Completed Task Name & Output Files
- Remaining Pending Tasks in `02-provenance/delivery-plan.md`
- Next Recommended Step: "Run `/brain-deliver next` for the next task or `/brain-audit` to verify system integrity."
