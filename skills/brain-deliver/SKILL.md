---
name: brain-deliver
description: Execute task-based deliverable generation from the Delivery Plan manifest. Produces authoritative PlantUML sequence diagrams, Markdown API contracts, and Low-Level Designs in 04-deliverables/ conforming to WEC FMC visual sequence diagram and 3-pillar LLD standards with strict provenance citations [SRC:...].
---

# /brain-deliver

Synthesize and produce production-ready deliverables from the Delivery Plan backlog conforming strictly to the authoritative Telkomsel WEC FMC architecture standards.

## 🎯 Purpose
Transform verified Ground Truth into detailed, exhaustive engineering deliverables (WEC PlantUML sequence diagrams, Markdown API contracts, and 3-Pillar LLD documents) task-by-task without token truncation, missing requirements, or conversational drift.

---

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

### 3. 📄 Generate Authoritative Deliverables (WEC FMC Blueprint)
For the selected task/feature, produce the complete deliverable suite in `04-deliverables/`:

#### 1. PlantUML Sequence Diagram (`04-deliverables/sequence-diagrams/<feature>.puml`)
Must strictly follow `plantuml-sequence-standards` and `backend-code-to-plantuml-extractor`:
- **Mandatory Header & Styling**:
  ```plantuml
  @startuml [feature-slug]
  autonumber
  title [NAMA MODUL] - [NAMA FITUR]
  footer Telkomsel Enterprise Platform
  skinparam minClassWidth 90
  !theme plain
  hide unlinked
  ```
- **Internal Box WEC (`#DBEEF3`)**:
  - All internal components enclosed in `box WEC #DBEEF3 ... end box`.
  - Bold multiline participants: `participant "**Frontend** \n **Web**" as f`, `participant "**API** \n **Gateway**" as a`.
  - Canonical 18 microservice aliases: `auth`, `appr`, `cb`, `cmd`, `d`/`doc`, `fail`, `fall`, `ff`, `self`, `addr`, `notif`, `o`, `p`, `prod`, `l`, `srv`, `track`, `mon`.
  - Storage participants: `database "**DB**" as db`, `database "**Redis**" as r`, `queue "**RabbitMQ**" as rb`.
- **External Systems**:
  - Placed outside the box with bold titles: `participant "**CO**" as co`, `participant "**ESB**" as esb`, `participant "**ELISA**" as elisa`, `participant "**UPP**" as upp`.
- **Request / Response Arrow Conventions**:
  - Call syntax: `f -> a: METHOD: Title \n/url/endpoint` with explicit `activate` and `deactivate`.
  - Inline provenance tag on arrows: `<color:#007acc><b>[SRC:BRD#REQ-XX]</b></color>` or `<color:#28a745><b>[SRC:DDL:table_name]</b></color>`.
- **Note Conventions**:
  - Success response note over frontend: `note over f #DDF4DD \n Http Status: 200 \n { ... } \n end note`.
  - Error response note: `note over f #FFCCCC \n Http Status: 4xx \n { ... } \n end note`.
  - Enhancement logic wrapped in: `group #F8D4AF ENHANCEMENT [Sprint XX: Feature Name] ... end`.

#### 2. API Contract (`04-deliverables/api-contracts/<feature>-api.md`)
- Endpoint URL, HTTP Method, and provenance badge (`> **Provenance**: [SRC:...]`).
- **Contract Boundary Tag**:
  - `Type: [INTERNAL MICROSERVICE API]` (Owned & Hosted by WEC FMC) OR
  - `Type: [EXTERNAL SURROUNDING SYSTEM IFA]` (Integration with External Core/Vendor, e.g. Customer Orders CO, ESB, UPP).
- If External Surrounding IFA: Document Outbound Client Payload, Timeout/Retry policy, Circuit Breaker, and Fallout Recovery behavior.
- Request Headers and Query Parameters with type & nullability.
- Request & Response JSON Schemas with inline `[SRC:...]` tags for every field.
- Success (`200 OK` / `201 Created`) and Error Responses (`400`, `401`, `409`, `500`, `504`).

#### 3. Low-Level Design (`04-deliverables/lld/<feature>-lld.md`)
Must strictly adhere to the official **WEC FMC 3-Pillar Layout Standard** (`lld-generator`):
- **Document Title**: `# LLD - SPRINT{XX} - {FEATURE_TITLE_UPPERCASE}` (or `# LLD - {FEATURE_TITLE_UPPERCASE}`)
- **I. Introduction and Scope Sections**:
  - `### 1. Objective Overviews`: Narrative description, numbered `Scopes:`, and **Scope Metrics & Impact Quantification** standard GFM table.
  - `### 2. Glossaries`: GFM table of domain terms, acronyms, and platform contexts.
- **II. Solution Details Sections**:
  - `### 3. Impacted Objects`: GFM table covering impacted microservices, MySQL tables/columns, and Redis cache keys.
  - `### 4. Sequence Diagrams & Flow Descriptions`: Complete embedded PlantUML diagram code block, followed immediately by an exhaustive, numbered narrative breakdown (`##### Step-by-Step Flow Description:`).
  - `### 5. Technical Flows & Surrounding Systems`: SALT/Pepper concise system-to-system technical flow and categorized Surrounding Systems list (`technical-flow`).
  - `### 6. Application Interfaces`: Links to IFA contracts and Protobuf/JSON schema specifications.
  - `### 7. Data Designs`: PlantUML ERD snippet with `<back:#F8D4AF>column : TYPE</back>` for modifications, plus Redis key schemas.
  - `### 8. Security Measures`: Token integrity (JWT claims), channel whitelisting (End Session rules), price/input tampering protection.
- **III. Closure Section**:
  - `### 9. References`: Authoritative Miro board links.
- **Zero ASCII Box-Drawing Rule**: MUST use standard GitHub-Flavored Markdown tables with `<br/>` for multiline content. Never use box drawing characters (`┌───┐`, etc.).

---

### 4. 🔄 Synchronize Manifest & Provenance
- Update `02-provenance/delivery-plan.md`:
  - Change the task status from `[ ]` to `[x]` (e.g. `- [x] Task DEL-01: EzNet Subscription Flow`).
  - Recalculate and update the overall progress percentage.
- Update `02-provenance/traceability-matrix.md` with the newly generated deliverable elements.

---

### 5. 📊 Output Completion Status
Display the task completion banner:
- Completed Task Name & Output Files (`.puml`, `-api.md`, `-lld.md`)
- Remaining Pending Tasks in `02-provenance/delivery-plan.md`
- Next Recommended Step: "Run `/brain-deliver next` for the next task or `/brain-audit` to verify system integrity."
