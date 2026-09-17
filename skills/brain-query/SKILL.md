---
name: brain-query
description: Interactive System Analyst knowledge retrieval engine. Query schemas, endpoints, Kafka events, and flow sequences across ground truth, deliverables, and active DDL with exact line citations and provenance.
---

# /brain-query

Execute an interactive, zero-hallucination System Analyst query across the Second Brain:

## 🎯 Purpose
Provide instant, authoritative answers to developer, QA, or product queries regarding database models, API contracts, flow sequences, and cross-service dependencies without digging through dozens of raw files.

## 📋 Execution Protocol

1. **Understand the Query Target**:
   Analyze the user query. Identify the primary subject:
   - **Entity / Data Model**: Table columns, data types, constraints, status enums.
   - **Endpoint / API**: Request/response payloads, validation rules, HTTP status codes.
   - **Flow / Sequence**: Interactions between actors, gateways, microservices, and databases.
   - **Event / Messaging**: Kafka/RabbitMQ topics, payload contracts, publish/subscribe triggers.
   - **Provenance / Traceability**: Origin of a requirement or decision (`[SRC:...]`).

2. **Search Canonical Truth Sources** (Respecting 5-Tier Precedence):
   - `01-ground-truth/entity-catalog.md` & `00-raw-inputs/db/` (DDL & Schema reality).
   - `01-ground-truth/api-inventory.md` (Part 1 for Internal APIs, Part 2 for Surrounding Systems Catalog) & `04-deliverables/api-contracts/*.md`.
   - `04-deliverables/sequence-diagrams/*.puml` & `04-deliverables/lld/*.md` (Execution flow).
   - `01-ground-truth/domain-glossary.md` (Ubiquitous business language).
   - `05-adrs/` (Architectural decisions and rationale).

3. **Format the Output**:
   Structure the response clearly using this System Analyst format:

   ```markdown
   ### 🔍 Query Summary: [Restatement of user query]

   #### 1. 📌 Direct Answer & Technical Summary
   [Concise, unambiguous summary answering the question directly]

   #### 2. 🗄️ Schema & Entity Reality (Tier 1)
   - **Table/Entity**: `tbl_name`
   - **Relevant Fields**: `column_name` (`DATA_TYPE`, constraints)
   - **State Transitions**: `STATUS_A` -> `STATUS_B` (Trigger: event/API)

   #### 3. 🔌 API & Flow Touchpoints (Internal Microservices)
   - **Endpoint**: `METHOD /api/v1/resource` [SRC:...]
   - **Owning Service**: `fmc-[service]` (Port `XXX`)
   - **Sequence Step**: Diagram `sample.puml` Step [XX]
   - **Async Events**: Topic `topic.order.events`, Payload: `{ "event_type": "..." }`

   #### 4. 🌐 Surrounding Systems & External IFAs (Integration Boundary)
   - **External Systems Involved**: e.g., Central Order (CO), ESB, UPP Payment, DSC
   - **Outbound Calls**: `METHOD /scrt/...` (Payload fields & SLA timeout)
   - **Inbound Webhooks / Callbacks**: Callback URL & status payload
   - **Fallback / Circuit Breaker**: Queue / error handling policy

   #### 5. 🏷️ Provenance & Citations
   - [file:///path/to/file#L10-L25] (`[SRC:BRD#REQ-XX]`, `[SRC:DDL:tbl_orders]`)
   ```

4. **Zero Hallucination Rule**:
   If a queried detail does not exist in Ground Truth or Raw Inputs, explicitly state:
   > ⚠️ **UNRESOLVED SPECIFICATION**: Field/Flow `[X]` is not defined in Ground Truth or DDL. Suggest running `/brain-ingest` or creating an ADR via `/brain-branch`.
