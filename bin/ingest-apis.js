#!/usr/bin/env node

/**
 * Deterministic API & Surrounding System Ingester for Second Brain
 * 
 * Accurately parses and disambiguates:
 * 1. Internal Microservice APIs (Owned / Inbound HTTP & gRPC routes)
 * 2. External Surrounding Systems (Outbound IFAs, Client configs, Curls, & Webhooks)
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();
const existingCodeDir = path.join(targetDir, '00-raw-inputs', 'existing-code');
const brdDir = path.join(targetDir, '00-raw-inputs', 'brd');
const outputFile = path.join(targetDir, '01-ground-truth', 'api-inventory.md');

console.log(`\n🔌 Second Brain Deterministic API & Surrounding System Ingester\n`);

if (!fs.existsSync(existingCodeDir) && !fs.existsSync(brdDir)) {
  console.log(`⚠️  No raw inputs found in 00-raw-inputs/existing-code/ or 00-raw-inputs/brd/. Nothing to ingest.`);
  process.exit(0);
}

// Known Surrounding System Metadata Registry
const SURROUNDING_METADATA = {
  co: {
    code: 'CO',
    name: 'Customer Order (SOM / Central Order)',
    role: 'Centralized order fulfillment, state orchestration, and provisioning decomposition',
    direction: 'Outbound Client Call & Inbound Callback',
    protocol: 'REST HTTPS (Digital Core)',
    ownership: 'Enterprise Core / SOM Team'
  },
  esb: {
    code: 'ESB',
    name: 'Enterprise Service Bus (TSEL ESB)',
    role: 'Enterprise service bus for ODP optical coverage, reservation, OTP, and catalog',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS / SOAP',
    ownership: 'Enterprise Core / ESB Team'
  },
  upp: {
    code: 'UPP',
    name: 'Universal Payment Platform',
    role: 'Centralized payment gateway for QRIS, Virtual Account, Credit Card, and e-wallets',
    direction: 'Outbound Client Call & Inbound Payment Webhook',
    protocol: 'REST HTTPS / Webhook',
    ownership: 'Enterprise Finance & Billing'
  },
  dsc: {
    code: 'DSC',
    name: 'Digital Sales Channel',
    role: 'Sales channel integration, slot allocation, and order handoff notifications',
    direction: 'Outbound Client Call & Inbound Webhook',
    protocol: 'REST HTTPS',
    ownership: 'Digital Sales Team'
  },
  digipos: {
    code: 'DigiPOS',
    name: 'DigiPOS & Salesforce',
    role: 'Agent assisted sales, retail outlet order booking, and lead synchronization',
    direction: 'Outbound Client Call & Inbound Callback',
    protocol: 'REST HTTPS / Webhook',
    ownership: 'Channel & Outlet Systems'
  },
  docman: {
    code: 'Docman',
    name: 'Docman Document Vault',
    role: 'Enterprise document repository for digital contracts, consent PDFs, and e-signatures',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS (Digital Core)',
    ownership: 'Document Services Team'
  },
  dukcapil: {
    code: 'Dukcapil',
    name: 'Dukcapil Identity Verification',
    role: 'National citizen biometric and NIK identity validation gateway',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS / ESB',
    ownership: 'Government Gateway / Regulatory'
  },
  elisa: {
    code: 'ELISA',
    name: 'ELISA Billing & Invoice System',
    role: 'Billing account creation, invoice generation, and transaction status verification',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS (Digital Core)',
    ownership: 'Enterprise Revenue & Billing'
  },
  crm: {
    code: 'Siebel CRM',
    name: 'Siebel CRM Customer Management',
    role: 'Customer 360 profile lookup, active subscriptions, and service contract verification',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS / Siebel Web Services',
    ownership: 'Enterprise CRM Team'
  },
  ihld: {
    code: 'IHLD',
    name: 'IndiHome Lead & Demand (ODP Fulfillment)',
    role: 'Demand order tracking and optical distribution point (ODP) physical network survey',
    direction: 'Outbound Client Call & Inbound Callback',
    protocol: 'REST HTTPS',
    ownership: 'Access Network & Field Ops'
  },
  isyana: {
    code: 'ISYANA',
    name: 'ISYANA OCR & Biometric Engine',
    role: 'Automated OCR scanning and data extraction for KTP and Passports',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS (Digital Core)',
    ownership: 'AI & Vision Platform'
  },
  notif: {
    code: 'Notification Engine',
    name: 'Notification Engine (SMS, WhatsApp, Email)',
    role: 'Multi-channel outbound transactional notifications to customers',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS / ESB',
    ownership: 'Communication Platform'
  },
  orbit: {
    code: 'Orbit',
    name: 'Telkomsel Orbit (Wireless Broadband)',
    role: 'Orbit fixed wireless broadband coverage check, IMEI binding, and package activation',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS',
    ownership: 'Orbit Platform Team'
  },
  google: {
    code: 'Google Maps',
    name: 'Google Maps Platform',
    role: 'Address geocoding, reverse geocoding, and place autocomplete for address validation',
    direction: 'Outbound Client Call',
    protocol: 'REST HTTPS (Google Cloud)',
    ownership: 'Third-Party / Google'
  }
};

// Helper: Recursively find files
function findFiles(dir, filterFn) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(findFiles(fullPath, filterFn));
      } else if (!filterFn || filterFn(file, fullPath)) {
        results.push(fullPath);
      }
    } catch (e) {}
  });
  return results;
}

// Ignore non-service YAML files
function isServiceConfigFile(filePath) {
  const norm = filePath.replace(/\\/g, '/').toLowerCase();
  if (norm.includes('/.github/') || norm.includes('/.gitlab') || norm.includes('gitlab-ci')) return false;
  if (norm.includes('pnpm-lock') || norm.includes('docker-compose') || norm.includes('pre-commit')) return false;
  if (norm.includes('mockery') || norm.includes('golangci') || norm.includes('buf.gen') || norm.includes('buf.yaml')) return false;
  if (norm.includes('issue_template') || norm.includes('pull_request_template')) return false;
  if (norm.includes('/pipeline/') || norm.includes('service-stages') || norm.includes('aws-golang')) return false;
  if (norm.includes('logstash') || norm.includes('task_planning_crew')) return false;
  
  // Accept microservice-yaml-configs or direct service config files
  if (norm.includes('/microservice-yaml-configs/')) return true;
  if (norm.endsWith('/config.yml') || norm.endsWith('/config.yaml')) return true;
  if (norm.match(/config-[a-zA-Z0-9_-]+\.ya?ml$/)) return true;
  return false;
}

// -------------------------------------------------------------
// 1. INGEST CONFIGS: Microservice Topology & Port Allocations
// -------------------------------------------------------------
const microservices = new Map();
const allYamls = findFiles(existingCodeDir, (file) => file.endsWith('.yml') || file.endsWith('.yaml'));
const configFiles = allYamls.filter(isServiceConfigFile);

console.log(`🔍 Discovered ${configFiles.length} service configuration file(s).`);

configFiles.forEach(cfgPath => {
  const content = fs.readFileSync(cfgPath, 'utf8');
  const relPath = path.relative(targetDir, cfgPath);
  const baseName = path.basename(cfgPath);

  // Extract service name
  let svcName = baseName.replace(/^config-/, 'fmc-').replace(/\.ya?ml$/, '');
  if (svcName === 'config') {
    // deduce from directory path (e.g. repo/backend/fmc-smart-selfcare/pkg/config/config.yml)
    const parts = relPath.split(path.sep);
    const backendIdx = parts.indexOf('backend');
    if (backendIdx !== -1 && parts[backendIdx + 1]) {
      svcName = parts[backendIdx + 1];
    }
  }
  
  // Extract port
  let httpPort = '—';
  const portMatch = content.match(/http:\s*(?:\r?\n|\n)\s*port:\s*['"]?([0-9]+)['"]?/i) || content.match(/port:\s*['"]?([0-9]+)['"]?/i);
  if (portMatch) {
    httpPort = portMatch[1];
  }

  // Extract gRPC port
  let grpcPort = '—';
  const grpcMatch = content.match(/grpc:\s*(?:\r?\n|\n)\s*port:\s*['"]?(:?[0-9]+)['"]?/i) || content.match(/grpc_port:\s*['"]?(:?[0-9]+)['"]?/i);
  if (grpcMatch) {
    grpcPort = grpcMatch[1].startsWith(':') ? grpcMatch[1] : `:${grpcMatch[1]}`;
  }

  // Extract DB type
  let dbInfo = '—';
  if (/postgres:/i.test(content)) dbInfo = 'PostgreSQL';
  if (/mysql:/i.test(content)) dbInfo = dbInfo === '—' ? 'MySQL' : `${dbInfo}, MySQL`;
  if (/redis:/i.test(content)) dbInfo = dbInfo === '—' ? 'Redis' : `${dbInfo}, Redis`;

  // Extract responsibility from service name
  let responsibility = 'Core domain business logic and state management';
  if (svcName.includes('link')) responsibility = 'Journey token generation, session lifecycle, link analytics';
  else if (svcName.includes('product')) responsibility = 'Product catalog, package offers, speed tiers, add-ons';
  else if (svcName.includes('order')) responsibility = 'Order lifecycle, checkout cart, appointments, feasibility';
  else if (svcName.includes('auth')) responsibility = 'Customer authentication, OTP dispatch/validation, JWT session';
  else if (svcName.includes('payment')) responsibility = 'Payment initiation, transaction verification, receipt issuing';
  else if (svcName.includes('document')) responsibility = 'PDF digital contracts, signature capture, consent archival';
  else if (svcName.includes('address')) responsibility = 'Postal code lookup, administrative zoning, geocoding';
  else if (svcName.includes('notif')) responsibility = 'Outbound SMS, WhatsApp, and email customer notifications';
  else if (svcName.includes('callback')) responsibility = 'Webhook router for payment gateway and upstream callbacks';
  else if (svcName.includes('fallout')) responsibility = 'Automated fallout recovery queues, manual task handling';
  else if (svcName.includes('failover')) responsibility = 'Failover orchestration, retry queues, resilience worker';
  else if (svcName.includes('smart-selfcare')) responsibility = 'Self-care diagnostic hub, subscriber profile, router reboot';
  else if (svcName.includes('tracking')) responsibility = 'Real-time order tracker, technician dispatch status, timeline';

  // Normalize name
  if (!svcName.startsWith('fmc-') && svcName !== 'krakend') {
    svcName = `fmc-${svcName}`;
  }

  if (!microservices.has(svcName) || microservices.get(svcName).httpPort === '—') {
    microservices.set(svcName, {
      name: svcName,
      httpPort,
      grpcPort,
      db: dbInfo,
      responsibility,
      provenance: `[SRC:CODE:${relPath}]`,
      endpoints: []
    });
  }
});

// Also scan backend directories if not in configs
const backendDir = path.join(existingCodeDir, 'repo', 'backend');
if (fs.existsSync(backendDir)) {
  const dirs = fs.readdirSync(backendDir).filter(d => fs.statSync(path.join(backendDir, d)).isDirectory());
  dirs.forEach(d => {
    // Skip shared packages or utilities
    if (d === 'salt-pkg' || d === 'common' || d === 'pkg') return;

    if (!microservices.has(d)) {
      let resp = 'Backend microservice component';
      if (d.includes('krakend')) resp = 'API Gateway routing, rate-limiting, and request transformation';
      else if (d.includes('worker') || d.includes('ops')) resp = 'Background asynchronous jobs, status sync, order escalation';
      else if (d.includes('dashboard')) resp = 'Dashboard metrics, event aggregation, and observability';
      else if (d.includes('approval')) resp = 'Berita Acara installation approvals and technician sign-off';
      else if (d.includes('survey')) resp = 'Post-installation customer satisfaction survey rating';
      else if (d.includes('utility-monitoring')) resp = 'Utility network monitoring, modem telemetry, and Wi-Fi SSID';

      microservices.set(d, {
        name: d,
        httpPort: d.includes('krakend') ? 'Gateway' : (d.includes('worker') ? 'Worker' : '—'),
        grpcPort: '—',
        db: '—',
        responsibility: resp,
        provenance: `[SRC:CODE:repo/backend/${d}]`,
        endpoints: []
      });
    }
  });
}

// -------------------------------------------------------------
// 2. INGEST INTERNAL APIS: Route handlers from Go Controllers
// -------------------------------------------------------------
console.log(`🔍 Scanning Go controller route definitions...`);

const goFiles = findFiles(existingCodeDir, (file, fullPath) => {
  if (!file.endsWith('.go') || file.endsWith('_test.go')) return false;
  // Ignore shared library example handlers
  if (fullPath.includes('/salt-pkg/examples/') || fullPath.includes('/vendor/')) return false;
  return true;
});

goFiles.forEach(filePath => {
  const relPath = path.relative(targetDir, filePath);
  
  // Find which microservice owns this file
  let matchedSvc = null;
  for (const svcName of microservices.keys()) {
    if (relPath.includes(`/${svcName}/`) || relPath.includes(`/${svcName.replace(/^fmc-/, '')}/`)) {
      matchedSvc = svcName;
      break;
    }
  }
  if (!matchedSvc) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  // Detect group prefix if present in file
  let groupPrefix = '';
  const groupMatch = content.match(/handler\.Group\(\s*[\"\']([^\"\']+)[\"\']/i);
  if (groupMatch) {
    groupPrefix = groupMatch[1];
  }

  lines.forEach((line, idx) => {
    // Match route registration: e.g. h.GET("/path", handler)
    const m = line.match(/\.(GET|POST|PUT|DELETE|PATCH)\(\s*[\"\'](\/[^\"\']*)[\"\']/i);
    if (m) {
      const method = m[1].toUpperCase();
      let routePath = m[2];
      
      // Prepend group prefix if not already present
      if (groupPrefix && !routePath.startsWith(groupPrefix)) {
        routePath = groupPrefix.replace(/\/$/, '') + '/' + routePath.replace(/^\//, '');
      }

      // Filter out infrastructure probe & swagger endpoints
      if (
        routePath === '/healthz' || 
        routePath === '/metrics' || 
        routePath === '/health' || 
        routePath === '/ping' || 
        routePath.startsWith('/swagger') || 
        routePath.startsWith('/debug/pprof')
      ) {
        return;
      }

      const svc = microservices.get(matchedSvc);
      if (svc && !svc.endpoints.some(e => e.method === method && e.path === routePath)) {
        svc.endpoints.push({
          method,
          path: routePath,
          provenance: `[SRC:CODE:${relPath}#L${idx + 1}]`
        });
      }
    }
  });
});

// -------------------------------------------------------------
// 3. INGEST EXTERNAL SURROUNDING SYSTEMS: Curls & YAML web_api
// -------------------------------------------------------------
console.log(`🔍 Scanning External Surrounding Systems and Interface Agreements...`);

const surroundingSystems = new Map();

// Initialize known surrounding systems
for (const [key, meta] of Object.entries(SURROUNDING_METADATA)) {
  surroundingSystems.set(key, {
    ...meta,
    endpoints: [],
    sources: new Set()
  });
}

// 3a. Ingest curl files from configurations/curl-surroundings/
const curlDir = path.join(existingCodeDir, 'configurations', 'curl-surroundings');
if (fs.existsSync(curlDir)) {
  const sysDirs = fs.readdirSync(curlDir).filter(d => fs.statSync(path.join(curlDir, d)).isDirectory());
  sysDirs.forEach(sysKey => {
    const sysPath = path.join(curlDir, sysKey);
    const files = fs.readdirSync(sysPath).filter(f => f.endsWith('.txt'));

    let sys = surroundingSystems.get(sysKey.toLowerCase());
    if (!sys) {
      sys = {
        code: sysKey.toUpperCase(),
        name: `${sysKey.toUpperCase()} Integration`,
        role: `External enterprise integration for ${sysKey}`,
        direction: 'Outbound Client Call',
        protocol: 'REST HTTPS',
        ownership: 'External Enterprise Core',
        endpoints: [],
        sources: new Set()
      };
      surroundingSystems.set(sysKey.toLowerCase(), sys);
    }

    files.forEach(f => {
      const fPath = path.join(sysPath, f);
      const content = fs.readFileSync(fPath, 'utf8');
      const relPath = path.relative(targetDir, fPath);
      sys.sources.add(`[SRC:CODE:${relPath}]`);

      // Extract HTTP method
      const methodMatch = content.match(/--request\s+([A-Z]+)/i) || content.match(/-X\s+([A-Z]+)/i) || ['GET', 'GET'];
      const method = (methodMatch[1] || 'GET').toUpperCase();

      // Extract URL
      const urlMatch = content.match(/'(https?:\/\/[^']+)'/) || content.match(/"(https?:\/\/[^"]+)"/) || content.match(/(https?:\/\/[^\s]+)/);
      let url = urlMatch ? urlMatch[1] : '';
      let endpointPath = url;
      try {
        if (url.startsWith('http')) {
          const parsed = new URL(url);
          endpointPath = parsed.pathname;
        }
      } catch (e) {}

      // Clean feature title from filename
      const title = f.replace(/\.txt$/, '').replace(/^(?:post|get|put|delete)-api-/, '').replace(/-/g, ' ');

      if (!sys.endpoints.some(e => e.path === endpointPath && e.method === method)) {
        sys.endpoints.push({
          method,
          path: endpointPath,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          provenance: `[SRC:CODE:${relPath}]`
        });
      }
    });
  });
}

// 3b. Ingest external endpoints from YAML configs (web_api)
configFiles.forEach(cfgPath => {
  const content = fs.readFileSync(cfgPath, 'utf8');
  const relPath = path.relative(targetDir, cfgPath);
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (/^path_[a-zA-Z0-9_]+:\s*['"][^'"]+['"]/.test(trimmed)) {
      const m = trimmed.match(/^path_([a-zA-Z0-9_]+):\s*['"]([^'"]+)['"]/);
      if (m) {
        const key = m[1];
        let val = m[2];

        // Determine which surrounding system it belongs to based on path and key
        let targetSys = 'esb';
        const valLower = val.toLowerCase();
        const keyLower = key.toLowerCase();

        if (valLower.includes('cust-order') || keyLower.includes('order') || keyLower.includes('co')) {
          targetSys = 'co';
        } else if (valLower.includes('dsc') || keyLower.includes('dsc')) {
          targetSys = 'dsc';
        } else if (valLower.includes('crm') || valLower.includes('siebel') || keyLower.includes('crm')) {
          targetSys = 'crm';
        } else if (valLower.includes('maps') || keyLower.includes('place') || keyLower.includes('google')) {
          targetSys = 'google';
        } else if (valLower.includes('doc') || keyLower.includes('docman')) {
          targetSys = 'docman';
        } else if (valLower.includes('digi_pos') || valLower.includes('digipos') || keyLower.includes('digi_pos')) {
          targetSys = 'digipos';
        } else if (valLower.includes('orbit') || keyLower.includes('orbit')) {
          targetSys = 'orbit';
        } else if (valLower.includes('odp') || keyLower.includes('odp')) {
          targetSys = 'ihld';
        } else if (valLower.includes('upp') || keyLower.includes('payment')) {
          targetSys = 'upp';
        } else if (valLower.includes('ocr') || keyLower.includes('isyana')) {
          targetSys = 'isyana';
        }

        const sys = surroundingSystems.get(targetSys);
        if (sys) {
          sys.sources.add(`[SRC:CODE:${relPath}#L${idx + 1}]`);
          const cleanPath = val.startsWith('http') ? new URL(val).pathname : val.replace(/^-fmc/, '');
          const cleanTitle = key.replace(/_/g, ' ');

          if (!sys.endpoints.some(e => e.path === cleanPath)) {
            sys.endpoints.push({
              method: 'POST / GET',
              path: cleanPath,
              title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
              provenance: `[SRC:CODE:${relPath}#L${idx + 1}]`
            });
          }
        }
      }
    }
  });
});

// 3c. Scan BRD Interface Agreement PDFs
if (fs.existsSync(brdDir)) {
  const brdFiles = fs.readdirSync(brdDir).filter(f => /interface-agreement|blueprint|specification/i.test(f));
  brdFiles.forEach(f => {
    const lower = f.toLowerCase();
    let targetSys = null;
    if (lower.includes('customer-order') || lower.includes('cust-order')) targetSys = 'co';
    else if (lower.includes('dsc')) targetSys = 'dsc';
    else if (lower.includes('isyana')) targetSys = 'isyana';
    else if (lower.includes('orbit')) targetSys = 'orbit';
    else if (lower.includes('digipos')) targetSys = 'digipos';
    else if (lower.includes('appointment') || lower.includes('wfm')) targetSys = 'co';

    if (targetSys && surroundingSystems.has(targetSys)) {
      surroundingSystems.get(targetSys).sources.add(`[SRC:BRD:${f}]`);
    }
  });
}

// -------------------------------------------------------------
// 4. GENERATE 01-ground-truth/api-inventory.md
// -------------------------------------------------------------
console.log(`📝 Writing authoritative Ground Truth to ${path.relative(targetDir, outputFile)}...`);

let md = `# API & Service Inventory: Ground Truth

> **Canonical System Truth (Tier 1 Production Code, YAML Configs, & Tier 2 IFAs)**  
> Authoritative, disambiguated registry strictly separating **Internal Microservice APIs** from **External Surrounding Systems**.

---

## 🏛️ System Boundary & IFA Classification Architecture

To eliminate ambiguity across deliverables, the Second Brain enforces strict taxonomy between internal and external contracts:

1. **🔌 Internal Microservice APIs (Owned / Inbound)**:
   - **Provider / Host**: Microservices implemented and owned directly inside this repository (\`repo/backend/fmc-*\`).
   - **Consumer**: Frontend Web, BFF, KrakenD API Gateway, Mobile Client, or peer internal services.
   - **Traffic Flow**: Inbound to our services (we host the HTTP router / gRPC server).
   - **Contract Type**: Internal-for-Internal / BFF-to-Backend Interface Agreement.

2. **🌐 External Surrounding Systems (Outbound / Integrations / Third-Party IFAs)**:
   - **Provider / Host**: External Telkomsel Enterprise Core systems, vendor platforms, or government gateways.
   - **Consumer**: Our internal microservices act as **Clients** calling outbound APIs, OR our services expose dedicated callback listeners for asynchronous inbound webhooks.
   - **Traffic Flow**: Outbound client calls (e.g. to CO SOM, ESB, UPP) + Asynchronous webhook callbacks.
   - **Contract Type**: Enterprise Surrounding System Interface Agreement (subject to external SLAs, circuit breakers, and fallout recovery).

---

## 🔌 Part 1: Internal Microservice APIs (Owned Services & Endpoints)

### 1.1 Microservice Topology & Port Allocations

| Microservice Name | Runtime | HTTP Port | gRPC Port | Primary Persistence | Core Responsibility | Source Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

// Sort microservices by name
const sortedSvcs = Array.from(microservices.values()).sort((a, b) => a.name.localeCompare(b.name));

sortedSvcs.forEach(svc => {
  md += `| **\`${svc.name}\`** | Golang 1.21 | \`${svc.httpPort}\` | \`${svc.grpcPort}\` | ${svc.db} | ${svc.responsibility} | ${svc.provenance} |\n`;
});

md += `\n### 1.2 Active Internal Endpoints Registry\n\n`;

sortedSvcs.forEach(svc => {
  if (svc.endpoints.length === 0) return;
  md += `#### 📦 \`${svc.name}\` (Port ${svc.httpPort})\n`;
  svc.endpoints.forEach(ep => {
    md += `- \`${ep.method} ${ep.path}\` — ${svc.responsibility} ${ep.provenance}\n`;
  });
  md += `\n`;
});

md += `---

## 🌐 Part 2: External Surrounding Systems Catalog (Outbound IFAs & Webhooks)

### 2.1 Surrounding Systems Master Catalog

| System Code | System Name | Integration Role | Traffic Direction | Transport Protocol | Ownership Boundary | Authoritative Source Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

// Filter surrounding systems that have endpoints or sources
const activeSurroundings = Array.from(surroundingSystems.values())
  .filter(s => s.endpoints.length > 0 || s.sources.size > 0)
  .sort((a, b) => a.code.localeCompare(b.code));

activeSurroundings.forEach(sys => {
  const srcList = Array.from(sys.sources).slice(0, 2).join(', ') || `[SRC:CODE:configurations/curl-surroundings/${sys.code.toLowerCase()}]`;
  md += `| **\`${sys.code}\`** | ${sys.name} | ${sys.role} | \`${sys.direction}\` | \`${sys.protocol}\` | ${sys.ownership} | ${srcList} |\n`;
});

md += `\n### 2.2 External Endpoints & Integration Operations\n\n`;

activeSurroundings.forEach(sys => {
  if (sys.endpoints.length === 0) return;
  md += `#### 🌐 \`${sys.code}\`: ${sys.name}\n`;
  md += `> **Boundary**: ${sys.ownership} | **Direction**: \`${sys.direction}\` | **Protocol**: \`${sys.protocol}\`\n\n`;
  sys.endpoints.forEach(ep => {
    md += `- \`${ep.method} ${ep.path}\` — ${ep.title} ${ep.provenance}\n`;
  });
  md += `\n`;
});

fs.writeFileSync(outputFile, md, 'utf8');

console.log(`\n✨ Successfully crystallized Ground Truth API Inventory!`);
console.log(`   - Internal Microservices Cataloged : ${sortedSvcs.length}`);
console.log(`   - Internal Route Endpoints Indexed : ${sortedSvcs.reduce((acc, s) => acc + s.endpoints.length, 0)}`);
console.log(`   - External Surrounding Systems     : ${activeSurroundings.length}`);
console.log(`   - External Endpoints & IFAs Mapped : ${activeSurroundings.reduce((acc, s) => acc + s.endpoints.length, 0)}\n`);
