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
    content: `@startuml\nskinparam style strictuml\nskinparam BoxPadding 10\nautonumber "<b>[00]</b>"\n\nactor "Customer" as User\nparticipant "API Gateway" as APIGW\nparticipant "Order Service" as OrderSvc\ndatabase "Postgres DB" as DB\n\nUser -> APIGW: POST /api/v1/orders\\n<color:#007acc><b>[SRC:BRD#REQ-01]</b></color>\nactivate APIGW\nAPIGW -> OrderSvc: CreateOrder(payload)\\n<color:#28a745><b>[SRC:DDL:tbl_orders]</b></color>\nactivate OrderSvc\nOrderSvc -> DB: INSERT INTO tbl_orders\\n<color:#28a745><b>[SRC:DDL:tbl_orders]</b></color>\nactivate DB\nDB --> OrderSvc: 1 row affected\ndeactivate DB\nOrderSvc --> APIGW: 201 Created (OrderID)\ndeactivate OrderSvc\nAPIGW --> User: 201 Created\ndeactivate APIGW\n@enduml\n`
  },
  {
    path: '04-deliverables/api-contracts/sample-api-contract.md',
    content: `# API Contract: Order Management\n\n### POST /api/v1/orders\n> **Provenance**: \`[SRC:BRD#REQ-01]\` | \`[SRC:DDL:tbl_orders]\`\n\n#### Request Headers\n- \`Authorization\`: \`Bearer <jwt>\` (required) \`[SRC:CODE:jwt_middleware.go]\`\n- \`Content-Type\`: \`application/json\`\n\n#### Request Body\n\`\`\`json\n{\n  "customer_id": "usr_99812",\n  "total_amount": 150000\n}\n\`\`\`\n\n#### Response (201 Created)\n\`\`\`json\n{\n  "order_id": "ord_12345",\n  "status": "PENDING_PAYMENT"\n}\n\`\`\`\n`
  },
  {
    path: '04-deliverables/lld/sample-lld.md',
    content: `# Low-Level Design (LLD): Order Management Service\n\n## 1. Architectural Context\nIntegrates incoming checkout requests through API Gateway down to the persistence layer.\n\n## 2. Technical Flow\n1. Validates JWT claims.\n2. Inserts pending record into \`tbl_orders\`.\n3. Dispatches order placed event.\n\n## 3. Data Model & Specifications\nBacked by Postgres \`tbl_orders\` with optimistic concurrency.\n`
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
