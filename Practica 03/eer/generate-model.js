// Rebuild the bundled, data-free schema model from the SQL backup without executing it.
const fs=require('node:fs');
const path=require('node:path');
const {parse}=require('./sql-parser.js');
const source=path.resolve(__dirname,'..','backups','respaldo_19_10_2026_DGC.sql');
const model=parse(fs.readFileSync(source,'latin1'));
model.source=path.basename(source);
model.dialect='MySQL 8.4.9';
fs.writeFileSync(path.join(__dirname,'model.js'),`window.EER_DATA = ${JSON.stringify(model)};\n`,'utf8');
console.log(`${model.tables.length} tablas · ${model.tables.reduce((n,t)=>n+t.columns.length,0)} columnas · ${model.relations.length} FK · modelo generado sin ejecutar el respaldo`);
