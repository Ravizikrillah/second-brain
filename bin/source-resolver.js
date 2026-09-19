/**
 * Second Brain Source Resolver
 * 
 * Dynamically resolves data source locations (code repositories, DDL schemas,
 * PRDs/BRDs, MoMs, Figma specs) supporting:
 * 1. CLI flags (--code, --ddl, --brd, --path)
 * 2. Configuration file (second-brain.json / .brainrc.json)
 * 3. Default fallback directory (00-raw-inputs/*) including symlinks
 * 
 * Prevents repository bloat by allowing external BE/FE repositories to remain
 * in their native locations without duplicating them into Second Brain's git index.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_RAW_MAP = {
  code: path.join('00-raw-inputs', 'existing-code'),
  ddl: path.join('00-raw-inputs', 'db'),
  brd: path.join('00-raw-inputs', 'brd'),
  mom: path.join('00-raw-inputs', 'mom'),
  figma: path.join('00-raw-inputs', 'figma')
};

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.svn',
  'vendor',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  'tmp',
  'temp',
  '.cache',
  'bin',
  'obj'
]);

/**
 * Expand tilde (~) in file paths
 */
function expandHome(filepath) {
  if (!filepath) return filepath;
  if (filepath.startsWith('~/') || filepath === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

/**
 * Parse CLI arguments for source flags
 */
function parseCliArgs() {
  const args = process.argv.slice(2);
  const result = {
    code: [],
    ddl: [],
    brd: [],
    genericPath: null,
    configFile: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--code=')) {
      result.code.push(arg.split('=')[1]);
    } else if ((arg === '--code' || arg === '-c') && i + 1 < args.length) {
      result.code.push(args[++i]);
    } else if (arg.startsWith('--ddl=')) {
      result.ddl.push(arg.split('=')[1]);
    } else if ((arg === '--ddl' || arg === '-d') && i + 1 < args.length) {
      result.ddl.push(args[++i]);
    } else if (arg.startsWith('--brd=')) {
      result.brd.push(arg.split('=')[1]);
    } else if ((arg === '--brd' || arg === '-b') && i + 1 < args.length) {
      result.brd.push(args[++i]);
    } else if (arg.startsWith('--path=')) {
      result.genericPath = arg.split('=')[1];
    } else if ((arg === '--path' || arg === '-p') && i + 1 < args.length) {
      result.genericPath = args[++i];
    } else if (arg.startsWith('--config=')) {
      result.configFile = arg.split('=')[1];
    } else if (arg === '--config' && i + 1 < args.length) {
      result.configFile = args[++i];
    }
  }

  return result;
}

/**
 * Load and parse second-brain.json or .brainrc.json if present
 */
function loadConfig(targetDir = process.cwd(), customConfigPath = null) {
  const candidates = customConfigPath
    ? [path.resolve(targetDir, expandHome(customConfigPath))]
    : [
        path.join(targetDir, 'second-brain.json'),
        path.join(targetDir, '.brainrc.json'),
        path.join(targetDir, '.brainrc')
      ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const raw = fs.readFileSync(candidate, 'utf8');
        const parsed = JSON.parse(raw);
        return {
          configPath: candidate,
          name: parsed.name || 'Second Brain Workspace',
          sources: parsed.sources || {}
        };
      } catch (err) {
        console.warn(`⚠️  Warning: Failed to parse configuration file at ${candidate}: ${err.message}`);
      }
    }
  }

  return { configPath: null, name: null, sources: {} };
}

/**
 * Resolves source directories for a specific type ('code', 'ddl', 'brd', 'mom', 'figma').
 * Priority:
 * 1. CLI arguments
 * 2. second-brain.json configuration
 * 3. Default fallback in 00-raw-inputs/
 * 
 * Returns an array of objects:
 * [{ path: '/abs/path', relativePath: '...', name: '...', exists: true, isExternal: true/false }]
 */
function resolveSources(type, options = {}) {
  const targetDir = options.targetDir || process.cwd();
  const cliArgs = parseCliArgs();
  const config = loadConfig(targetDir, cliArgs.configFile);
  const rawList = [];

  // 1. Check CLI args
  if (cliArgs[type] && cliArgs[type].length > 0) {
    rawList.push(...cliArgs[type].map(p => ({ raw: p, origin: 'cli' })));
  } else if (cliArgs.genericPath && (type === 'code' || type === 'ddl')) {
    rawList.push({ raw: cliArgs.genericPath, origin: 'cli' });
  }

  // 2. Check config file
  if (config.sources && config.sources[type]) {
    const cfg = config.sources[type];
    if (Array.isArray(cfg)) {
      cfg.forEach(entry => {
        if (typeof entry === 'string') {
          rawList.push({ raw: entry, origin: 'config' });
        } else if (entry && entry.path) {
          rawList.push({ raw: entry.path, name: entry.name, origin: 'config' });
        }
      });
    } else if (typeof cfg === 'string') {
      rawList.push({ raw: cfg, origin: 'config' });
    }
  }

  // 3. Fallback to default raw inputs directory
  const defaultRel = DEFAULT_RAW_MAP[type] || path.join('00-raw-inputs', type);
  const defaultAbs = path.join(targetDir, defaultRel);

  if (rawList.length === 0) {
    rawList.push({ raw: defaultRel, origin: 'default' });
  }

  // Normalize, resolve, deduplicate
  const seenPaths = new Set();
  const resolved = [];

  for (const item of rawList) {
    const expanded = expandHome(item.raw);
    const absPath = path.isAbsolute(expanded)
      ? path.normalize(expanded)
      : path.normalize(path.join(targetDir, expanded));

    if (seenPaths.has(absPath)) continue;
    seenPaths.add(absPath);

    const exists = fs.existsSync(absPath);
    let isDirectory = false;
    if (exists) {
      try {
        isDirectory = fs.statSync(absPath).isDirectory();
      } catch (e) {}
    }

    const relPath = path.relative(targetDir, absPath);
    const isExternal = relPath.startsWith('..') || path.isAbsolute(item.raw);
    const defaultName = item.name || path.basename(absPath);

    resolved.push({
      path: absPath,
      relativePath: relPath,
      name: defaultName,
      exists,
      isDirectory,
      isExternal,
      origin: item.origin
    });
  }

  return {
    type,
    configPath: config.configPath,
    sources: resolved
  };
}

/**
 * High-performance file finder that skips heavy non-code directories (node_modules, .git, etc.)
 * Automatically follows directory symlinks.
 */
function findFiles(dir, filterFn, options = {}) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const maxDepth = options.maxDepth || 20;
  const currentDepth = options.currentDepth || 0;
  if (currentDepth > maxDepth) return results;

  let list = [];
  try {
    list = fs.readdirSync(dir);
  } catch (e) {
    return results;
  }

  for (const file of list) {
    // Skip heavy dependency, git, or build folders
    if (IGNORED_DIRS.has(file)) continue;

    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath); // follows symlinks
      if (stat.isDirectory()) {
        const subResults = findFiles(fullPath, filterFn, {
          ...options,
          currentDepth: currentDepth + 1
        });
        results.push(...subResults);
      } else if (!filterFn || filterFn(file, fullPath)) {
        results.push(fullPath);
      }
    } catch (e) {}
  }

  return results;
}

module.exports = {
  loadConfig,
  parseCliArgs,
  resolveSources,
  findFiles,
  IGNORED_DIRS
};
