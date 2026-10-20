const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {parse}=require('./sql-parser.js');

test('el respaldo real se analiza con su esquema y tuplas INSERT',()=>{
  const sql=fs.readFileSync(path.join(__dirname,'..','backups','respaldo_19_10_2026_DGC.sql'),'latin1');
  const d=parse(sql);
  assert.equal(d.tables.length,8);
  assert.equal(d.tables.reduce((n,t)=>n+t.columns.length,0),54);
  assert.equal(d.relations.length,8);
  assert.equal(d.tables.reduce((n,t)=>n+t.recordCount.value,0),21628);
  assert.deepEqual(Object.fromEntries(Object.entries(d.objects).map(([k,v])=>[k,v.length])),{views:8,procedures:2,functions:0,triggers:18});
  assert.equal(d.tables.find(t=>t.name==='tb_carts').indexes.find(i=>i.name==='uk_cart_user').type,'UNIQUE');
  assert.equal(d.tables.find(t=>t.name==='tb_categories').foreignKeys[0].references.table,'tb_categories');
});

test('ALTER TABLE y reglas referenciales se incorporan sin ejecutar SQL',()=>{
  const d=parse(`
    DROP DATABASE dangerous_schema;
    CREATE TABLE \`account\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`email\` varchar(80) NOT NULL,
      PRIMARY KEY (\`id\`), UNIQUE KEY \`uq_email\` (\`email\`)
    );
    CREATE TABLE \`event\` (\`id\` int NOT NULL, \`account_id\` int NULL, PRIMARY KEY (\`id\`));
    ALTER TABLE \`event\` ADD KEY \`ix_event_account\` (\`account_id\`),
      ADD CONSTRAINT \`fk_event_account\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;
    INSERT INTO \`event\` VALUES (1,2),(3,4);
  `);
  const event=d.tables.find(t=>t.name==='event');
  assert.equal(d.tables.length,2);
  assert.equal(event.indexes.find(i=>i.name==='ix_event_account').type,'INDEX');
  assert.equal(event.recordCount.value,2);
  assert.deepEqual(d.relations[0],{name:'fk_event_account',fromTable:'event',fromColumns:['account_id'],toTable:'account',toColumns:['id'],cardinality:'N:1',optional:true,onDelete:'SET NULL',onUpdate:'CASCADE',confirmed:true,selfReference:false});
  assert.equal(d.objects.views.length,0);
});

test('no presenta conteos exactos si el dump altera filas fuera de INSERT VALUES',()=>{
  const d=parse(`CREATE TABLE \`log\` (\`id\` int PRIMARY KEY); INSERT INTO \`log\` SELECT \`id\` FROM \`staging\`;`);
  assert.equal(d.tables.find(t=>t.name==='log').recordCount.kind,'unavailable');
  assert.equal(d.tables.find(t=>t.name==='log').recordCount.value,null);
});
