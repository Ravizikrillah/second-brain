#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();

console.log(`\n🧠 Initializing Second Brain in: ${targetDir}\n`);

const directories = [
  '00-raw-inputs/brd',
  '00-raw-inputs/figma',
  '00-raw-inputs/db',
  '00-raw-inputs/existing-code',
  '00-raw-inputs/mom',
  '01-ground-truth',
  '02-provenance',
  '03-constraint-branches',
  '04-deliverables/sequence-diagrams',
  '04-deliverables/api-contracts',
  '04-deliverables/lld',
  '05-adrs'
];

directories.forEach(dir => {
  const fullPath = path.join(targetDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`  📁 Created: ${dir}`);
  }
});

const starterFiles = [
  {
    path: '00-raw-inputs/brd/README.md',
    content: `# BRD & Requirements Input\n\nPlace raw business requirement documents, PRDs, or user story markdown files here.\n`
  },
  {
    path: '00-raw-inputs/figma/README.md',
    content: `# Figma & UI/UX Specs Input\n\nPlace screen flow summaries, UX copy text, component specs, and design token exports here.\n`
  },
  {
    path: '00-raw-inputs/db/README.md',
    content: `# Database Schemas Input\n\nPlace SQL DDL scripts (CREATE TABLE, ALTER TABLE), indexes, and seed DML data here.\n`
  },
  {
    path: '00-raw-inputs/existing-code/README.md',
    content: `# Existing Code Snippets & Models\n\nPlace active backend handlers, entity structs, route definitions, and service interfaces here.\n`
  },
  {
    path: '00-raw-inputs/mom/README.md',
    content: `# Meeting Minutes (MoM) & Discussion Notes\n\nPlace meeting notes, Slack/chat agreements, and alignment decisions here.\n`
  },
  {
    path: '01-ground-truth/domain-glossary.md',
    content: `# Domain Glossary\n\n| Term | Canonical Definition | Forbidden Synonyms | Source Tag |\n| :--- | :--- | :--- | :--- |\n`
  },
  {
    path: '01-ground-truth/entity-catalog.md',
    content: `# Entity Catalog\n\nDefines verified business entities, table models, primary keys, and state machine transitions.\n`
  },
  {
    path: '01-ground-truth/api-inventory.md',
    content: `# API & Service Inventory\n\nAuthoritative registry of active microservices, gateways, and public/internal endpoints.\n`
  },
  {
    path: '02-provenance/traceability-matrix.md',
    content: `# Traceability & Provenance Matrix\n\n| Artifact Element | Provenance Tag | Authoritative Source File & Line | Truth Tier | Verification Status |\n| :--- | :--- | :--- | :--- | :--- |\n`
  },
  {
    path: '02-provenance/contradictions.md',
    content: `# Contradiction & Anti-Gaslighting Log\n\nRecords all detected conflicts between raw inputs and Ground Truth.\n\n| Conflict ID | Incoming Claim (Tier) | Ground Truth Reality (Tier) | Status | Arbitration ADR |\n| :--- | :--- | :--- | :--- | :--- |\n`
  },
  {
    path: '03-constraint-branches/scenario-template.md',
    content: `# Scenario Template: [Scenario Title]\n\n## 1. Constraint Description\nDescribe the technical, operational, or budgetary constraint.\n\n## 2. Impacted Components\nList the services, database tables, and API contracts affected.\n\n## 3. Architectural Trade-offs\n| Option | Pros | Cons | Estimated Latency / Cost |\n| :--- | :--- | :--- | :--- |\n\n## 4. Proposed Solution & Delta\nDetail the changes required if this constraint is adopted.\n\n## 5. Adoption Status\nStatus: [PROPOSED | EVALUATING | ADOPTED | REJECTED]\n`
  },
  {
    path: '04-deliverables/sequence-diagrams/sample.puml',
    content: `@startuml\nskinparam style strictuml\nskinparam BoxPadding 10\nautonumber "<b>[00]</b>"\n\nactor "Customer" as User\nparticipant "API Gateway" as APIGW\nparticipant "Order Service" as OrderSvc\ndatabase "Postgres DB" as DB\n\nUser -> APIGW: POST /api/v1/orders \\n<color:#007acc><b>[SRC:BRD#REQ-01]</b></color>\nactivate APIGW\nAPIGW -> OrderSvc: CreateOrder(payload) \\n<color:#28a745><b>[SRC:DDL:tbl_orders]</b></color>\nactivate OrderSvc\nOrderSvc -> DB: INSERT INTO tbl_orders \\n<color:#28a745><b>[SRC:DDL:tbl_orders]</b></color>\nactivate DB\nDB --> OrderSvc: 1 row affected [SRC:DDL:tbl_orders]\ndeactivate DB\nOrderSvc --> APIGW: 201 Created (OrderID) [SRC:BRD#REQ-01]\ndeactivate OrderSvc\nAPIGW --> User: 201 Created [SRC:BRD#REQ-01]\ndeactivate APIGW\n@enduml\n`
  },
  {
    path: '04-deliverables/api-contracts/sample-api-contract.md',
    content: `# API Contract: Order Management\n\n### POST /api/v1/orders\n> **Provenance**: \`[SRC:BRD#REQ-01]\` | \`[SRC:DDL:tbl_orders]\`\n\n#### Request Headers\n- \`Authorization\`: \`Bearer <jwt>\` (required) \`[SRC:CODE:jwt_middleware.go#L18]\`\n- \`Content-Type\`: \`application/json\` \`[SRC:STANDARDS:rest-guideline]\`\n\n#### Request Body\n\`\`\`json\n{\n  "customer_id": "usr_99812",\n  "total_amount": 150000\n}\n\`\`\`\n\n#### Response (201 Created)\n\`\`\`json\n{\n  "order_id": "ord_12345",\n  "status": "PENDING_PAYMENT"\n}\n\`\`\`\n`
  },
  {
    path: '04-deliverables/lld/sample-lld.md',
    content: `# Low-Level Design (LLD): Order Management Service\n\n## 1. Architectural Context\nIntegrates incoming checkout requests through API Gateway down to the persistence layer.\n\n## 2. Technical Flow\n1. Validates JWT claims.\n2. Inserts pending record into \`tbl_orders\`.\n3. Dispatches order placed event.\n\n## 3. Data Model & Specifications\nBacked by Postgres \`tbl_orders\` with optimistic concurrency.\n`
  },
  {
    path: '05-adrs/0001-hierarchy-of-truth-and-hard-block.md',
    content: `# 0001. Hierarchy of Truth and Mandatory Hard Block\n\nAI agents processing mixed requirements (MoM, BRDs, production code, chat instructions) are vulnerable to gaslighting and contradictory inputs. We enforce a strict 5-tier precedence hierarchy where production code and active DDL outrank signed BRDs, which outrank MoM notes and ad-hoc chat instructions; any contradiction triggers a mandatory Hard Block that halts deliverable generation until human arbitration records an Architectural Decision Record (ADR). This trades automated turnaround speed for uncompromised architectural integrity.\n`
  },
  {
    path: 'AGENTS.md',
    content: `# AGENTS.md: Universal Second Brain Agent Instruction\n\nYou are operating inside a **Second Brain** architectural repository. Your primary mandate is to ingest unstructured product & technical requirements and produce authoritative engineering deliverables (PlantUML sequence diagrams, Markdown API contracts, Low-Level Designs) while enforcing strict provenance and absolute resistance against conversational gaslighting.\n\n---\n\n## 🏛️ Repository Zones\n1. \`00-raw-inputs/\`: UNTRUSTED raw materials (\`brd/\`, \`figma/\`, \`db/\`, \`existing-code/\`, \`mom/\`). Never treat as absolute truth without cross-verification.\n2. \`01-ground-truth/\`: CANONICAL state of system truth (\`domain-glossary.md\`, \`entity-catalog.md\`, \`api-inventory.md\`).\n3. \`02-provenance/\`: Traceability matrix and contradiction logs (\`traceability-matrix.md\`, \`contradictions.md\`).\n4. \`03-constraint-branches/\`: Isolated architectural scenario explorations (\`scenario-*.md\`). Never pollute deliverables with unconfirmed scenarios.\n5. \`04-deliverables/\`: Production engineering deliverables (\`sequence-diagrams/*.puml\`, \`api-contracts/*.md\`, \`lld/*.md\`). Every element MUST contain provenance citations \`[SRC:...]\`.\n6. \`05-adrs/\`: Architectural Decision Records. Sequential, immutable decisions.\n\n---\n\n## 🛡️ 5-Tier Precedence of Truth (Anti-Gaslighting)\n- **Tier 1 (Ultimate Truth)**: Existing Production Code & Active Database DDL (\`00-raw-inputs/db/\`, \`00-raw-inputs/existing-code/\`).\n- **Tier 2 (Contractual Truth)**: Approved BRDs / Signed PRDs (\`00-raw-inputs/brd/\`).\n- **Tier 3 (Architectural Truth)**: Accepted ADRs in \`05-adrs/\`.\n- **Tier 4 (Volatile Truth)**: Meeting Minutes (MoM) & Slack/chat notes (\`00-raw-inputs/mom/\`).\n- **Tier 5 (Ad-hoc Truth)**: Conversational user prompts in the active chat session.\n\n### 🛑 Mandatory Hard Block\nIf a Tier 4 or Tier 5 input contradicts Tier 1, 2, or 3:\n1. **HALT**: Stop deliverable generation immediately.\n2. **LOG**: Append the conflict to \`02-provenance/contradictions.md\`.\n3. **ARBITRATE**: Prompt the human user via the Resolution Wizard. Do NOT generate deliverables until an ADR is officially recorded in \`05-adrs/\`.\n\n---\n\n## ⚡ Orchestrator Commands\n- \`/brain-init\`: Run \`node ./bin/init.js\` to scaffold or refresh the 6-zone folder hierarchy and templates.\n- \`/brain-ingest\`: Parse \`00-raw-inputs/\`, update \`01-ground-truth/\`, assert truth precedence, detect contradictions, and update \`02-provenance/traceability-matrix.md\`.\n- \`/brain-deliver\`: Verify no Hard Block is active, then generate PlantUML diagrams (\`04-deliverables/sequence-diagrams/*.puml\`), API contracts (\`04-deliverables/api-contracts/*.md\`), and LLDs (\`04-deliverables/lld/*.md\`) with full \`[SRC:...]\` tags.\n- \`/brain-branch <name>\`: Create an isolated trade-off scenario document in \`03-constraint-branches/scenario-<name>.md\`.\n- \`/brain-adopt <name>\`: Record an ADR in \`05-adrs/\`, set scenario status to \`ADOPTED\`, and trigger \`/brain-deliver\` to synchronize deliverables.\n- \`/brain-audit\`: Verify 100% provenance tag coverage across all deliverables and assert database DDL consistency.\n- \`/brain-query <query>\`: Interactive zero-hallucination Q&A across ground truth, active DDL, and deliverables with exact line citations.\n- \`/brain-impact <target>\`: Change Request (CR) & Blast Radius Analyzer across schemas, API contracts, sequence diagrams, and consumers.\n- \`/brain-story <feature>\`: Slice deliverables into Jira/Confluence-ready stories with Gherkin AC, API specs, and sequence slices.\n`
  },
  {
    path: 'CLAUDE.md',
    content: `# CLAUDE.md: Second Brain Architecture Engine\n\n## Guidelines for Claude Code\n1. **Never guess or assume requirements**: Look up ground truth in \`01-ground-truth/\` or raw evidence in \`00-raw-inputs/\`.\n2. **Observe 5-Tier Truth Precedence**:\n   - Production Code & DB DDL (Tier 1) > Signed BRD (Tier 2) > Accepted ADRs (Tier 3) > MoM & Chat notes (Tier 4) > Conversational prompts (Tier 5).\n3. **Hard Block on Contradictions**: If user prompts or MoM files conflict with Tier 1/2/3, HALT deliverable generation, record in \`02-provenance/contradictions.md\`, and guide the user through the Resolution Wizard to generate an ADR in \`05-adrs/\`.\n4. **Mandatory Provenance**: Every endpoint, model field, and diagram step in \`04-deliverables/\` must include inline citation tags: \`[SRC:...]\`.\n5. **Commands**:\n   - \`/brain-init\`: Initialize 6-zone folder structure and starter templates.\n   - \`/brain-ingest\`: Ingest raw inputs, detect conflicts, map provenance.\n   - \`/brain-deliver\`: Generate PlantUML sequence diagrams, Markdown API contracts, and LLDs.\n   - \`/brain-branch <name>\`: Create isolated trade-off scenario in \`03-constraint-branches/\`.\n   - \`/brain-adopt <name>\`: Adopt scenario via ADR and synchronize deliverables.\n   - \`/brain-audit\`: Audit 100% provenance and system consistency.\n   - \`/brain-query <query>\`: Interactive Q&A across ground truth, active DDL, and deliverables.\n   - \`/brain-impact <target>\`: Change Request (CR) & Blast Radius Analyzer.\n   - \`/brain-story <feature>\`: Slice deliverables into Jira/Confluence-ready stories with Gherkin AC.\n`
  },
  {
    path: '.cursorrules',
    content: `# Cursor Rules for Second Brain\n\n1. Strictly respect the 6-zone folder model.\n2. Enforce 5-Tier Precedence of Truth (Code/DDL > BRD > ADR > MoM > Prompts).\n3. Mandatory Provenance Citation [SRC:...] on all deliverables.\n4. Hard Block on any unarbitrated contradictions.\n`
  },
  {
    path: 'CONTEXT.md',
    content: `# Second Brain\n\nA universal knowledge, synthesis, and architectural design system that converts raw product and technical inputs into verified deliverables with strict provenance, constraint branching, and misinformation resistance.\n\n## Language\n\n**Ground Truth**: The verified, immutable canonical state of system behavior.\n**Raw Input**: Unprocessed source materials prior to ingestion.\n**Provenance**: The explicit, traceable chain of evidence linking deliverables to source tags.\n**Contradiction**: A conflict between incoming claims and ground truth.\n**Hard Block**: Mandatory halt when a contradiction is detected.\n`
  }
];

starterFiles.forEach(file => {
  const fullPath = path.join(targetDir, file.path);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, file.content, 'utf8');
    console.log(`  📄 Created template: ${file.path}`);
  }
});

console.log(`\n✨ Second Brain initialized successfully!\n`);
