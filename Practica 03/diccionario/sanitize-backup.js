// Create a separate public-safe SQL copy. Never modifies the requested source dump.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { parse } = require('../eer/sql-parser.js');

const backupDir = path.resolve(__dirname, '..', 'backups');
const sourcePath = path.join(backupDir, 'respaldo_21_10_2026_DGC.sql');
const outputPath = path.join(backupDir, 'respaldo_21_10_2026_DGC_sanitizado.sql');
if (fs.existsSync(outputPath)) throw new Error('The sanitized output already exists; refusing to overwrite it.');

const originalBytes = fs.readFileSync(sourcePath);
const originalHash = crypto.createHash('sha256').update(originalBytes).digest('hex');
let sql = originalBytes.toString('latin1');
const sourceModel = parse(sql);

function removeDumpRows(table) {
  const escaped = table.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(/\\*!40000 ALTER TABLE \\x60${escaped}\\x60 DISABLE KEYS \\*/;)[\\s\\S]*?(/\\*!40000 ALTER TABLE \\x60${escaped}\\x60 ENABLE KEYS \\*/;)`, 'g');
  const matches = [...sql.matchAll(re)];
  if (matches.length !== 1) throw new Error(`Expected one bounded data section for ${table}; found ${matches.length}.`);
  const inserts = (matches[0][0].match(/\bINSERT\s+(?:IGNORE\s+)?INTO\b/gi) || []).length;
  if (inserts === 0) throw new Error(`Expected data inserts to remove from ${table}.`);
  sql = sql.replace(re, (_whole, before, after) => `${before}\r\n${after}`);
  return inserts;
}

const removedUserInsertStatements = removeDumpRows('tb_users');
const removedAuditInsertStatements = removeDumpRows('tb_logs');

// MySQL 8.4 permits CURRENT_USER as a DEFINER. It binds objects to the account
// that imports the sanitized dump and removes the original account identities.
const definerPattern = /(DEFINER\s*=\s*)(?:`[^`]*`|[^\s@*]+)\s*@\s*(?:`[^`]*`|[^\s*]+)/gi;
let sanitizedDefiners = 0;
sql = sql.replace(definerPattern, (_match, prefix) => { sanitizedDefiners += 1; return `${prefix}CURRENT_USER`; });
const originalDefinerCount = (originalBytes.toString('latin1').match(/DEFINER\s*=/gi) || []).length;
if (!originalDefinerCount || sanitizedDefiners !== originalDefinerCount) {
  throw new Error(`DEFINER sanitization mismatch: expected ${originalDefinerCount}, replaced ${sanitizedDefiners}.`);
}

const sanitizedModel = parse(sql);
function structuralProjection(model) {
  return {
    schema: model.tables[0]?.schema,
    tables: model.tables.map(t => ({
      name: t.name, engine: t.engine,
      columns: t.columns.map(({ name, type, nullable, default: def, autoIncrement, pk, fk, unique, extra }) => ({ name, type, nullable, default: def, autoIncrement, pk, fk, unique, extra })),
      indexes: t.indexes, constraints: t.constraints, foreignKeys: t.foreignKeys,
    })),
    relations: model.relations,
    objects: model.objects,
  };
}
if (JSON.stringify(structuralProjection(sourceModel)) !== JSON.stringify(structuralProjection(sanitizedModel))) {
  throw new Error('The sanitized SQL changed schema or stored-object structure.');
}
for (const table of ['tb_users', 'tb_logs']) {
  const rows = sanitizedModel.tables.find(t => t.name === table)?.recordCount?.value;
  if (rows !== 0) throw new Error(`Sensitive table ${table} still has ${rows} dumped rows.`);
}
const preservedData = sourceModel.tables
  .filter(t => !['tb_users', 'tb_logs'].includes(t.name))
  .every(t => t.recordCount.value === sanitizedModel.tables.find(x => x.name === t.name)?.recordCount.value);
if (!preservedData) throw new Error('An unrelated table data section changed.');
if (/DEFINER\s*=\s*(?:\x60|[A-Za-z0-9_.-]+)\s*@/i.test(sql)) throw new Error('A source DEFINER account remains.');
if (crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex') !== originalHash) {
  throw new Error('The original SQL dump changed during sanitization.');
}

fs.writeFileSync(outputPath, Buffer.from(sql, 'latin1'), { flag: 'wx' });
console.log(JSON.stringify({
  output: path.basename(outputPath),
  schema: sanitizedModel.tables[0]?.schema,
  tables: sanitizedModel.tables.length,
  columns: sanitizedModel.tables.reduce((n, t) => n + t.columns.length, 0),
  foreignKeys: sanitizedModel.relations.length,
  views: sanitizedModel.objects.views.length,
  triggers: sanitizedModel.objects.triggers.length,
  procedures: sanitizedModel.objects.procedures.length,
  functions: sanitizedModel.objects.functions.length,
  removedUserInsertStatements,
  removedAuditInsertStatements,
  sanitizedDefiners,
  originalUnchanged: true,
}, null, 2));
