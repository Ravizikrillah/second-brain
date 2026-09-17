#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();

console.log(`\n🔍 Second Brain Deterministic Provenance & Integrity Auditor\n`);

const PROVENANCE_REGEX = /\[SRC:[^\]]+\]/;
const ARROW_REGEX = /^[ \t]*[A-Za-z0-9_]+[ \t]*(?:->|-->|->>|-->>|<-|<--)[ \t]*[A-Za-z0-9_]+[ \t]*:/;
const ENDPOINT_REGEX = /^#{2,4}[ \t]+(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)[ \t]+([^\n\r]+)/i;

let totalElements = 0;
let taggedElements = 0;
const violations = [];

// Helper to recursively find files matching extension
function findFiles(dir, exts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(fullPath, exts));
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

// 1. Audit Sequence Diagrams (.puml)
const pumlFiles = findFiles(path.join(targetDir, '04-deliverables', 'sequence-diagrams'), ['.puml']);
pumlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const relPath = path.relative(targetDir, file);

  lines.forEach((line, index) => {
    if (ARROW_REGEX.test(line)) {
      totalElements++;
      if (PROVENANCE_REGEX.test(line)) {
        taggedElements++;
      } else {
        violations.push({
          file: relPath,
          line: index + 1,
          type: 'MISSING_PROVENANCE',
          content: line.trim()
        });
      }
    }
  });
});

// 2. Audit API Contracts (.md)
const apiFiles = findFiles(path.join(targetDir, '04-deliverables', 'api-contracts'), ['.md']);
apiFiles.forEach(file => {
  if (path.basename(file).toLowerCase() === 'readme.md') return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const relPath = path.relative(targetDir, file);

  let currentEndpoint = null;
  let endpointHasProvenance = false;

  lines.forEach((line, index) => {
    const epMatch = line.match(ENDPOINT_REGEX);
    if (epMatch) {
      if (currentEndpoint && !endpointHasProvenance) {
        violations.push({
          file: relPath,
          line: currentEndpoint.line,
          type: 'ENDPOINT_MISSING_PROVENANCE',
          content: currentEndpoint.text
        });
      }
      totalElements++;
      currentEndpoint = { line: index + 1, text: line.trim() };
      endpointHasProvenance = PROVENANCE_REGEX.test(line);
      if (endpointHasProvenance) taggedElements++;
    } else if (currentEndpoint) {
      if (PROVENANCE_REGEX.test(line)) {
        if (!endpointHasProvenance) {
          endpointHasProvenance = true;
          taggedElements++;
        }
      }
      // Check request/response body field params
      if (/^[ \t]*-[ \t]*`[^`]+`/.test(line)) {
        totalElements++;
        if (PROVENANCE_REGEX.test(line)) {
          taggedElements++;
        } else {
          violations.push({
            file: relPath,
            line: index + 1,
            type: 'FIELD_MISSING_PROVENANCE',
            content: line.trim()
          });
        }
      }
    }
  });

  if (currentEndpoint && !endpointHasProvenance) {
    violations.push({
      file: relPath,
      line: currentEndpoint.line,
      type: 'ENDPOINT_MISSING_PROVENANCE',
      content: currentEndpoint.text
    });
  }
});

// 3. Audit Contradictions (Anti-Gaslighting Check)
const contradictionFile = path.join(targetDir, '02-provenance', 'contradictions.md');
let unresolvedContradictions = 0;
if (fs.existsSync(contradictionFile)) {
  const content = fs.readFileSync(contradictionFile, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    // Look for table rows with active / open conflict status
    if (/\|[ \t]*CONF-\d+[ \t]*\|/.test(line)) {
      if (/OPEN|UNRESOLVED|ACTIVE|PENDING/i.test(line)) {
        unresolvedContradictions++;
        violations.push({
          file: '02-provenance/contradictions.md',
          line: index + 1,
          type: 'ACTIVE_CONTRADICTION_HARD_BLOCK',
          content: line.trim()
        });
      }
    }
  });
}

// 4. Calculate Coverage
const coverage = totalElements === 0 ? 100 : ((taggedElements / totalElements) * 100).toFixed(1);

// 5. Output Audit Scorecard
console.log(`┌────────────────────────────────────────────────────────────┐`);
console.log(`│                    AUDIT SCORECARD                         │`);
console.log(`├────────────────────────────────────────────────────────────┤`);
console.log(`│ Total Audited Deliverable Elements : ${String(totalElements).padEnd(21)} │`);
console.log(`│ Elements with Provenance [SRC:...] : ${String(taggedElements).padEnd(21)} │`);
console.log(`│ Provenance Tag Coverage            : ${String(coverage + ' %').padEnd(21)} │`);
console.log(`│ Active Hard Block Contradictions   : ${String(unresolvedContradictions).padEnd(21)} │`);
console.log(`└────────────────────────────────────────────────────────────┘\n`);

if (violations.length > 0) {
  console.log(`⚠️  VIOLATIONS & MISSING PROVENANCE FOUND (${violations.length}):\n`);
  violations.forEach(v => {
    console.log(`  ❌ [${v.type}] ${v.file}:${v.line}`);
    console.log(`     Snippet: "${v.content}"\n`);
  });
}

if (unresolvedContradictions > 0) {
  console.log(`🛑 HARD BLOCK FAILURE: Unresolved contradictions exist in 02-provenance/contradictions.md.`);
  console.log(`   Resolve contradictions via ADRs before generating deliverables.\n`);
  process.exit(1);
}

if (parseFloat(coverage) < 100) {
  console.log(`⚠️  AUDIT WARNING: Provenance coverage is below 100% (${coverage}%).`);
  console.log(`   Ensure all sequence diagram messages and API fields cite authoritative [SRC:...].\n`);
  process.exit(1);
}

console.log(`✅ AUDIT PASSED: 100% Provenance Coverage and Zero Active Contradictions!\n`);
process.exit(0);
