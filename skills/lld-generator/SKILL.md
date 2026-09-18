---
name: lld-generator
description: Standardization and generation of Low Level Design (LLD) documents for WEC FMC sprint features based on the official 3-pillar layout standard (index.md).
---

# 📐 LLD (Low Level Design) Generator Standard (WEC FMC)

This skill governs the creation, formatting, and validation of all **Low Level Design (LLD)** documents for WEC FMC sprint features.

All LLD documents generated MUST strictly follow the authoritative 3-pillar layout template derived from **`index.md`**.

---

## 📁 File Naming & Directory Convention

LLD documents MUST be organized into sprint-specific subfolders inside `references/lld/`:

- **Path:** `references/lld/sprint-{XX}/lld-sprint-{XX}-{feature-name}.md`
- **Example:** `references/lld/sprint-21/lld-sprint-21-enhance-fttr-ultimate.md`
- **Document Title Format:** `# LLD - SPRINT{XX} - {FEATURE_TITLE_UPPERCASE}`

---

## 🏗️ Mandatory 3-Pillar Section Structure

Every LLD document MUST include the following exact sections and headings:

```markdown
# LLD - SPRINT{XX} - {FEATURE_TITLE_UPPERCASE}

# I. Introduction and Scope Sections

### 1. Objective Overviews
Comprehensive objective narrative describing the sprint feature, business goals, and customer impact.

**Scopes:**
1. [Endpoint / Interface 1]: Detailed description of enhancement
2. [Endpoint / Interface 2]: Detailed description of enhancement
3. [Sequence Diagram 1]: Detailed description of flow enhancement
...

#### Scope Metrics & Impact Quantification:
| Metric Dimension | Classification | Count | Impacted System / Location | Details / Component Scope |
| :--- | :---: | :---: | :--- | :--- |
| **1. Number of new or enhanced features/functions** | New | 0 | - | None |
| | Enhanced | 1 | `Order Service` (`fmc-order`) | Description of enhancement |
| **2. Number of new or enhanced pages** | New | 0 | - | None |
| | Enhanced | 1 | `Frontend Web` | Description of UI changes |
| **3. Number of new or enhanced inputs** | New / Enhanced | 0 | - | Read-only / Form changes |

### 2. Glossaries
| Term | Definition & System Ecosystem Context |
| :--- | :--- |
| **AO** | Activation Order (Pasang Baru / new installation order) |
| **CO** | Customer Orders (Central order orchestration) |

# II. Solution Details Sections

### 3. Impacted Objects
| Microservice / Component | Modification Area & Technical Impact |
| :--- | :--- |
| **`fmc-order`** *(Golang Backend)* | • Description of handlers/usecases modified.<br/>• Endpoints impacted. |
| **Database** *(MySQL)* | • Table `orders` : Added column `x`. |
| **Redis Cache** *(No-SQL)* | • Key `cached_order:*` : Stored data structure. |

### 4. Sequence Diagrams & Flow Descriptions
- Embedded complete PlantUML sequence diagrams (`@startuml ... @enduml`).
- Explicitly highlight enhancement blocks using `group #F8D4AF ENHANCEMENT [...]`.
- **Mandatory Step-by-Step Flow Descriptions:** Directly beneath each sequence diagram block, provide an exhaustive, numbered narrative breakdown (`##### Step-by-Step Flow Description:`) detailing:
  1. User / Calling Channel initiation & endpoint path.
  2. API Gateway forwarding & header authentication.
  3. Internal service-to-service gRPC / REST communications.
  4. Surrounding system inquiries (CO, UPP, ELISA, DSC, Docman, etc.).
  5. Database / Cache operations & business logic branching.
  6. Return payload assembly and Frontend UI rendering / action execution (e.g. `NAVIGATE_TRACKING`, `REDIRECT_URL`).

### 5. Technical Flows & Surrounding Systems
- Concise SALT-standard Technical Flows (Only system-to-system communications).
- Categorized Surrounding Systems list per flow:
```text
[Feature Name] - [Flow Name]

1. Frontend Web -> API Gateway
    GET /v1/endpoint
2. API Gateway -> Backend Service
    GET /v1/endpoint
3. (If condition)
    Backend Service -> Surrounding System
    POST /v1/external-call

Surrounding:

1. Surrounding System
```

### 6. Application Interfaces
- Links to authoritative IFA documents (`.md`).
- Protobuf schema snippets for gRPC request/response messages.
- Request / response JSON schemas.

### 7. Data Designs
- ERD PlantUML snippets highlighting new/modified columns with `<back:#F8D4AF>column_name : TYPE</back>`.
- JSON schema structures for Redis cache keys.

### 8. Security Measures
1. **Authentication & Token Integrity:** Bearer JWT authorization and claim validation.
2. **Channel & Journey Whitelisting:** Validating allowed channel IDs and end session pages (`END_SESSION_12`, `END_SESSION_18`, `END_SESSION_19`).
3. **Input & Price Tampering Protection:** Server-side price calculation and hardware limit re-validation.

# III. Closure Section

### 9. References
Authoritative Miro Board markdown links mapped from `docs/miro-spaces-and-boards-index.md` (Do NOT include local repository file paths):
1. **[LLD - Sprint] [{SPRINT_BOARD_NAME}]({MIRO_SPRINT_BOARD_URL})**
   - Target Sprint Board
2. **[LLD - Master Reference] [{BOARD_NAME}]({MIRO_BOARD_URL})**
   - Corresponds to: `{sequence_diagram_or_flow_name}`
3. **[IFA - Internal for Internal] [{SERVICE_NAME}]({MIRO_BOARD_URL})**
   - Corresponds to: `{interface_or_grpc_name}`
```

---

## 📏 Quality & Validation Checklist

- [ ] File is saved in `references/lld/sprint-{XX}/` or `04-deliverables/lld/` subfolder.
- [ ] Title header uses `# LLD - SPRINT{XX} - {FEATURE_TITLE_UPPERCASE}`.
- [ ] Section `# I. Introduction and Scope Sections` contains `### 1. Objective Overviews` with explicit numbered **Scopes** list and Scope Metrics & Impact Quantification GFM table.
- [ ] Section `# II. Solution Details Sections` contains `### 3. Impacted Objects`, `### 4. Sequence Diagrams & Flow Descriptions`, `### 5. Technical Flows & Surrounding Systems`, `### 6. Application Interfaces`, `### 7. Data Designs`, and `### 8. Security Measures`.
- [ ] Sequence diagrams follow WEC FMC PlantUML sequence diagram standards (`box WEC #DBEEF3`, `#DDF4DD` response note, `group #F8D4AF ENHANCEMENT`).
- [ ] **Every Sequence Diagram in Section 4 includes an exhaustive, numbered Step-by-Step Flow Description.**
- [ ] Section `# III. Closure Section` contains `### 9. References` with valid Miro Board markdown links.

---

## 📊 Mandatory GFM Markdown Table Standard (Zero ASCII Box Drawing)

All tables inside LLD documents (such as **Impacted Objects**, **Glossaries**, **Error Code Matrices**, and **Benchmark Scoreboards**) MUST be authored in standard **GitHub-Flavored Markdown (GFM)** tables.

- **BANNED:** Never use Unicode/ASCII box drawings (`┌───┐`, `├───┤`, `│...│`, `└───┘`) inside markdown documents or code blocks as they break on varying viewport sizes.
- **MANDATORY GFM TABLE FORMAT:**
  ```markdown
  | Microservice / Component | Modification Area & Technical Impact |
  | :--- | :--- |
  | **`fmc-document`** *(Golang Backend)* | • `pkg/common/pdf.go` : Replaced with HTTP Sidecar Client.<br/>• `internal/usecase/v2/contracts/generate_contract_pdf.go` : Concurrency pool update. |
  | **Database** *(MySQL)* | • Table `documents` : Added tracking columns `engine_type` & `render_duration_ms`. |
  ```
- **MULTILINE CELLS:** Use `<br/>` for line breaks and sub-bullets inside table cells.
- **ALIGNMENT:** Explicitly define column alignments (`:---` for left-aligned text, `:---:` for centered codes/metrics, `---:` for numeric values).
