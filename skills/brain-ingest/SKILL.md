---
name: brain-ingest
description: Ingest unstructured BRDs, Figma specs, active DB DDL/DML, existing code, and MoMs from 00-raw-inputs/, build the Delivery Plan manifest, update 01-ground-truth/, enforce 5-tier truth precedence, and detect contradictions.
---

# /brain-ingest

Execute the Second Brain discovery, ingestion, and delivery planning pipeline:

## 🎯 Purpose
Scan all raw inputs across the repository, establish an exhaustive **Delivery Plan Manifest** (`02-provenance/delivery-plan.md`) to prevent token-exhaustion and cherry-picking, update Ground Truth (`01-ground-truth/`), and enforce anti-gaslighting protection.

## 📋 Execution Protocol

### 0. 🧹 Pre-Flight Auto-Triage & File Organization
If raw materials are located in an unstructured folder (e.g., `artifacts/`, `vault/`, `docs/`) or if an argument is passed (`/brain-ingest artifacts/`):
- Run `node ./bin/organize.js [source_folder]` (or `npm run organize [source_folder]`).
- This automatically sorts files into the correct `00-raw-inputs/` subdirectories (`db/`, `brd/`, `existing-code/`, `mom/`, `figma/`) while skipping videos and heavy binary archives.

### 1. 🔍 Exhaustive Raw Input Discovery & Inventory
Recursively scan all files in `00-raw-inputs/`:
- **Database (`00-raw-inputs/db/`)**: Detect all SQL DDL files and count EVERY `CREATE TABLE` / entity. Do NOT skip any table.
- **Product BRDs (`00-raw-inputs/brd/`)**: Identify all requirement docs, journey flows, and features.
- **Service Configurations & Code (`00-raw-inputs/existing-code/`)**: Scan YAML configs, routes, handlers, and models.
- **Figma & MoM (`00-raw-inputs/figma/`, `00-raw-inputs/mom/`)**: Scan UI notes and discussion minutes.

### 2. 🗺️ Generate / Update Delivery Plan (`02-provenance/delivery-plan.md`)
Create or synchronize the task backlog so deliverables can be executed cleanly task-by-task without token limits:
```markdown
# 🗺️ Second Brain Delivery & Ingestion Plan

## 1. 🗄️ Database Schemas Ingestion (Total: [X] Tables)
- [ ] Task DB-01: [Domain A] (`table_1`, `table_2`)
- [ ] Task DB-02: [Domain B] (`table_3`, `table_4`)

## 2. 🚀 Product Journey Deliverables (Total: [Y] Features)
- [ ] Task DEL-01: [Feature A] (Source: `brd/feature-a.md`)
- [ ] Task DEL-02: [Feature B] (Source: `brd/feature-b.md`)

---
**Status**: [X]% Ingested | [Y]% Delivered
```

### 3. 🏛️ Crystallize Ground Truth (`01-ground-truth/`)
- **Domain Glossary (`01-ground-truth/domain-glossary.md`)**: Update ubiquitous business terminology, canonical definitions, and forbidden synonyms.
- **Entity Catalog (`01-ground-truth/entity-catalog.md`)**:
  - **Deterministic DDL Ingestion**: Run `node ./bin/ingest-ddl.js` (or `npm run ingest:ddl`) to parse 100% of tables and columns directly from SQL files into `entity-catalog.md`. This guarantees zero dropped tables or columns.
  - Enrich the catalog with lifecycle state machine transitions, Go entity mappings, and domain relationships.
  - **ANTI-CHERRY-PICKING RULE**: Every table discovered in DDL MUST be indexed in `entity-catalog.md`. The auditor (`node ./bin/audit.js`) will fail with a hard block if any table is omitted.
- **API Inventory & Surrounding Systems Disambiguation (`01-ground-truth/api-inventory.md`)**:
  - **Deterministic API & gRPC Ingestion**: Run `node ./bin/ingest-apis.js` (or `npm run ingest:apis`) to scan configs, curl samples, Go controllers (resolving multi-tier router groups, root empty paths, and filtering dead comments), gRPC Protocol Buffers (`.proto`), KrakenD API Gateway ingress configs (`krakend.json`), and Go DTO models (`json:"..."`), automatically crystallizing Internal HTTP APIs, gRPC RPC Contracts, KrakenD Edge Ingress, DTO Schemas, and External Surrounding Systems with 100% provenance citations `[SRC:...]`.
  
#### ⚖️ The IFA Disambiguation Rule (Internal APIs vs External Surrounding Systems):
Enterprise projects frequently use the term "Interface Agreement" (IFA) for both internal microservice contracts and external integrations. You MUST strictly partition them:
1. **🔌 Part 1: Internal Microservice APIs (Owned / Inbound)**:
   - **Provider**: Microservices implemented inside this repository (`repo/backend/fmc-*`).
   - **Consumer**: Frontend Web, BFF, KrakenD API Gateway, Mobile App, or internal peer services.
   - **Origin**: Go HTTP router handlers (`internal/controller/http/v1/...`) and gRPC servers.
   - **Traffic Flow**: Inbound to our services (we host and maintain the endpoints).
2. **🌐 Part 2: External Surrounding Systems (Outbound Consumed / Inbound Webhooks)**:
   - **Provider**: External Enterprise Core systems or vendors (Central Order / SOM, ESB, UPP Payment, DSC, DigiPOS, Siebel CRM, Docman Vault, Dukcapil, ISYANA OCR, Orbit, Google Maps).
   - **Consumer**: Our internal microservices act as **Clients** calling outbound endpoints, OR our services expose callback listeners for asynchronous incoming webhooks.
   - **Origin**: Microservice YAML configs (`web_api:`, `api_key_surrounding:`), curl samples (`configurations/curl-surroundings/`), and BRD IFA PDFs.
   - **STRICT PROHIBITION**: NEVER catalog external surrounding systems as internal microservices, and NEVER put external endpoints into internal service lists!

### 4. 🛡️ Enforce 5-Tier Precedence of Truth
- Tier 1: Production Code & Active DB DDL
- Tier 2: Signed BRD / Approved PRD
- Tier 3: Accepted ADRs (`05-adrs/`)
- Tier 4: Meeting Minutes (MoM) & Chat Notes
- Tier 5: Ad-hoc Conversational User Prompts

### 🛑 Mandatory Hard Block Check
If a Tier 4 (MoM) or Tier 5 (Chat) input contradicts Tier 1, 2, or 3:
1. **HALT**: Stop deliverable generation.
2. **LOG**: Append the conflict to `02-provenance/contradictions.md`.
3. **ARBITRATE**: Prompt the operator to arbitrate via an ADR in `05-adrs/`.

### 5. 🏷️ Update Traceability & Output Scorecard
- Update `02-provenance/traceability-matrix.md` with source citations `[SRC:...]`.
- Display an Ingestion Summary Scorecard:
  - Total Raw Files Scanned
  - Total Tables Discovered & Cataloged
  - Total Product Journeys Mapped to Delivery Plan
  - Contradictions Detected / Active Hard Blocks
  - **Next Recommended Action**: "Run `/brain-deliver next` or `/brain-deliver <feature>` to execute deliverables from the Delivery Plan."
