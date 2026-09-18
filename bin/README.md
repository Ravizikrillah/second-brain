# ⚙️ Second Brain Deterministic CLI Tools (`bin/`)

Welcome to the **CLI Tools** directory. This folder contains zero-dependency, deterministic Node.js utilities that automate scaffolding, document organization, schema extraction, API cataloging, and provenance auditing.

---

## 🚀 Design Philosophy

1. **Zero External Dependencies**: All scripts rely solely on native Node.js standard modules (`fs`, `path`). They run instantly without requiring `npm install` or third-party packages.
2. **Deterministic & Token-Free**: Complex schema and API extraction tasks are performed via deterministic code rather than LLM token-consuming prompts, preventing truncation, dropped tables, or hallucinations.
3. **Cross-Platform**: Tested and compliant across macOS, Linux, and Windows.

---

## 🛠️ Tool Catalog & NPM Script Mappings

| Script | NPM Script | Description |
| :--- | :--- | :--- |
| **`init.js`** | `npm run init` | Scaffolds the 6-zone directory hierarchy, configuration rules (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`), starter templates, and folder READMEs. |
| **`organize.js`** | `npm run organize [dir]` | Universal directory-preserving auto-triage. Scans unstructured drops (e.g. `artifacts/`) and moves files into `00-raw-inputs/` subfolders (`db/`, `brd/`, `existing-code/`, `mom/`, `figma/`) while preserving intact git/backend repositories. |
| **`ingest-ddl.js`** | `npm run ingest:ddl` | Deterministic SQL DDL parser. Scans `00-raw-inputs/db/*.sql` and indexes 100% of tables, columns, data types, and primary keys into `01-ground-truth/entity-catalog.md`. |
| **`ingest-apis.js`** | `npm run ingest:apis` | Deterministic API and Surrounding System parser. Scans YAML configs, curls, and Go routers to crystallize `01-ground-truth/api-inventory.md` with strict Internal vs External system partitioning. |
| **`audit.js`** | `npm run audit`<br>`npm test` | Automated provenance and integrity auditor. Validates 100% `[SRC:...]` tag coverage on deliverables, asserts DDL completeness, checks API disambiguation, and blocks on active contradictions. |

---

## ⚡ Usage Examples

```bash
# Initialize Second Brain in current workspace
node ./bin/init.js

# Automatically organize raw materials dropped in artifacts/
node ./bin/organize.js artifacts/

# Ingest all SQL tables deterministically
node ./bin/ingest-ddl.js

# Ingest internal APIs and external surrounding systems
node ./bin/ingest-apis.js

# Run full provenance and consistency audit
node ./bin/audit.js
```
