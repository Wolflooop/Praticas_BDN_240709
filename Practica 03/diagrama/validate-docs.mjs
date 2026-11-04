import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(dir,'..');
const read=p=>fs.readFileSync(p,'utf8');
const sql=read(path.join(root,'backups','respaldo_31_10_2026_DGC.sql'));
const model=JSON.parse(read(path.join(dir,'schema-model.json')));
const diagram=read(path.join(dir,'modelo-db-test-7b.html'));
const template=read(path.join(dir,'diagram-template.html'));
const dictionary=read(path.join(root,'diccionario','index.html'));
const generatorFiles=[path.join(dir,'build-erd.mjs'),path.join(root,'diccionario','generate-dictionary.mjs')];
const issues=[];
const blocks=[...sql.matchAll(/^CREATE TABLE `([^`]+)` \(([\s\S]*?)\) ENGINE=([^\n;]+)/gm)];
const names=body=>[...body.matchAll(/`([^`]+)`/g)].map(m=>m[1]);
const indexRecords=body=>[...body.matchAll(/\b(PRIMARY KEY|UNIQUE KEY|KEY|UNIQUE INDEX|INDEX)\s*(?:`([^`]+)`\s*)?\(([^)]*)\)/gi)].map(m=>({kind:/PRIMARY/i.test(m[1])?'PRIMARY':/UNIQUE/i.test(m[1])?'UNIQUE':'INDEX',name:m[2]||(/PRIMARY/i.test(m[1])?'PRIMARY':null),columns:names(m[3])}));
const fkRecords=body=>[...body.matchAll(/CONSTRAINT `([^`]+)` FOREIGN KEY \(([^)]*)\) REFERENCES `([^`]+)` \(([^)]*)\)([^,\n]*)/g)].map(m=>({name:m[1],columns:names(m[2]),table:m[3],references:names(m[4]),tail:m[5],onDelete:(m[5].match(/ON DELETE (CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)/i)?.[1]||'NO ACTION').toUpperCase(),onUpdate:(m[5].match(/ON UPDATE (CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)/i)?.[1]||'NO ACTION').toUpperCase()}));
const sqlTables=blocks.map(b=>b[1]),modelTables=model.tables.map(t=>t.name);
let columns=0,indexes=0,primaryKeys=0,foreignKeys=0,sqlCheckCount=0,definitionsExact=true,indexesExact=true,primaryExact=true,fksExact=true,cardinalityExact=true;
if(JSON.stringify(sqlTables)!==JSON.stringify(modelTables))issues.push('El inventario u orden de tablas no coincide con CREATE TABLE.');
for(const b of blocks){
  const [,tableName,body]=b,t=model.tables.find(x=>x.name===tableName);
  if(!t){issues.push(`Falta ${tableName} en schema-model.json.`);continue}
  const sourceCols=[...body.matchAll(/^\s*`([^`]+)`\s+(.+?)(?:,)?\s*$/gm)].filter(m=>!/^(?:PRIMARY KEY|UNIQUE KEY|KEY |CONSTRAINT )/i.test(m[2]));
  columns+=sourceCols.length;
  if(sourceCols.length!==t.columns.length)issues.push(`${tableName}: cantidad de columnas distinta (${sourceCols.length}/${t.columns.length}).`);
  for(const [i,c] of sourceCols.entries()){
    const got=t.columns[i],definition=c[2].replace(/,$/,'').trim();
    if(!got||got.name!==c[1])issues.push(`${tableName}: columna u orden distinto en posición ${i+1}.`);
    if(got&&(got.definition!==definition||got.type.toLowerCase()!==definition.match(/^([a-z]+(?:\([^)]*\))?(?:\s+unsigned)?)/i)?.[1].replace(/\s+/g,' ').trim().toLowerCase())){definitionsExact=false;issues.push(`${tableName}.${c[1]}: tipo o definición SQL distinta.`)}
  }
  const ix=indexRecords(body),modelIx=t.indexes;
  indexes+=ix.length;primaryKeys+=(ix.some(i=>i.kind==='PRIMARY')?1:0);
  if(JSON.stringify(ix)!==JSON.stringify(modelIx)){indexesExact=false;issues.push(`${tableName}: índices distintos.`)}
  const pk=ix.find(i=>i.kind==='PRIMARY')?.columns||[];
  if(JSON.stringify(pk)!==JSON.stringify(t.primaryKey)){primaryExact=false;issues.push(`${tableName}: clave primaria distinta.`)}
  const fk=fkRecords(body),modelFks=t.constraints.filter(c=>c.type==='FOREIGN KEY');
  foreignKeys+=fk.length;
  if(fk.length!==modelFks.length){fksExact=false;issues.push(`${tableName}: cantidad de FK distinta.`)}
  for(const f of fk){
    const got=modelFks.find(x=>x.name===f.name),rel=model.relationships.find(x=>x.constraint===f.name&&x.sourceTable===tableName);
    if(!got||JSON.stringify(got.columns)!==JSON.stringify(f.columns)||got.references.table!==f.table||JSON.stringify(got.references.columns)!==JSON.stringify(f.references)||got.onDelete!==f.onDelete||got.onUpdate!==f.onUpdate){fksExact=false;issues.push(`${tableName}: FK ${f.name}, columnas, destino o acciones distintas.`)}
    if(!rel){fksExact=false;issues.push(`${tableName}: no existe relación de modelo para ${f.name}.`);continue}
    const unique=ix.some(i=>['PRIMARY','UNIQUE'].includes(i.kind)&&i.columns.length===f.columns.length&&i.columns.every(c=>f.columns.includes(c)));
    const optional=f.columns.some(name=>t.columns.find(c=>c.name===name)?.nullable);
    const expected=`origen → destino: ${optional?'0..1':'1'}; destino → filas de origen: ${unique?'0..1':'0..N'}`;
    if(rel.sourceOptional!==optional||rel.onDelete!==f.onDelete||rel.onUpdate!==f.onUpdate||rel.cardinality!==expected){cardinalityExact=false;issues.push(`${tableName}: cardinalidad o acciones de ${f.name} no se derivan del DDL.`)}
  }
  const sqlChecks=[...body.matchAll(/CONSTRAINT `([^`]+)` CHECK \((.*?)\)(?=,?\s*(?:CONSTRAINT|PRIMARY KEY|UNIQUE KEY|KEY|$))/gs)].map(m=>({type:'CHECK',name:m[1],expression:m[2]}));
  sqlCheckCount+=sqlChecks.length;
  if(JSON.stringify(sqlChecks)!==JSON.stringify(t.constraints.filter(c=>c.type==='CHECK'))){issues.push(`${tableName}: nombre o expresión CHECK distinta.`)}
}
const triggerNames=[...sql.matchAll(/TRIGGER `([^`]+)` (?:BEFORE|AFTER) (?:INSERT|UPDATE|DELETE) ON `/g)].map(m=>m[1]);
const procedureNames=[...sql.matchAll(/PROCEDURE `([^`]+)`\s*\(/g)].map(m=>m[1]);
const viewNames=[...new Set([...sql.matchAll(/VIEW `([^`]+)` AS/g)].map(m=>m[1]))];
const sameNames=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
if(!sameNames(triggerNames,model.objects.triggers.map(x=>x.name)))issues.push('Lista de triggers distinta del respaldo.');
if(!sameNames(procedureNames,model.objects.procedures.map(x=>x.name)))issues.push('Lista de procedimientos distinta del respaldo.');
if(!sameNames(viewNames,model.objects.views.map(x=>x.name)))issues.push('Lista de vistas distinta del respaldo.');
const embeddedText=diagram.match(/const MODEL=(\{[\s\S]*?\});\r?\nconst svg=/)?.[1];
let embedded=null;try{embedded=JSON.parse(embeddedText||'null')}catch{issues.push('El modelo JSON incrustado en el diagrama no se puede leer.')}
if(!embedded||JSON.stringify(embedded)!==JSON.stringify(model))issues.push('El diagrama generado no coincide con el modelo compartido.');
const dictNames=[...dictionary.matchAll(/<section class="table-card" id="([^"]+)" data-table="([^"]+)"/g)].map(m=>m[2]);
if(JSON.stringify(dictNames)!==JSON.stringify(modelTables))issues.push('El índice de fichas del diccionario no coincide con las tablas.');
let dictionaryColumns=0;
for(const t of model.tables){
  const section=dictionary.match(new RegExp(`<section class="table-card" id="${t.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}" data-table="${t.name}"[^>]*>([\\s\\S]*?)<\\/section>`));
  if(!section){issues.push(`Falta la ficha ${t.name}.`);continue}
  const fields=[...section[1].matchAll(/data-column="([^"]+)"/g)].map(m=>m[1]);dictionaryColumns+=fields.length;
  if(JSON.stringify(fields)!==JSON.stringify(t.columns.map(c=>c.name)))issues.push(`${t.name}: columnas del diccionario distintas del esquema.`);
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  for(const c of t.columns){const row=section[1].match(new RegExp(`<tr data-column="${c.name}"[\\s\\S]*?<\\/tr>`));if(!row||!row[0].includes(escapeHtml(c.type))||!row[0].includes(c.classification))issues.push(`${t.name}.${c.name}: falta tipo o clasificación en la ficha.`)}
}
if(dictionaryColumns!==columns)issues.push(`El diccionario contiene ${dictionaryColumns} columnas; el SQL contiene ${columns}.`);
const scriptSyntax=[];
for(const [file,html] of [['diagrama',diagram],['diccionario',dictionary]])for(const [i,s] of [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).entries())try{new vm.Script(s)}catch(e){scriptSyntax.push(`${file} script ${i+1}: ${e.message}`)}
issues.push(...scriptSyntax);
const idDuplicates=[];
for(const [file,html] of [['diagrama',diagram],['diccionario',dictionary]]){const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),seen=new Set();for(const id of ids){if(seen.has(id))idDuplicates.push(`${file}: #${id}`);seen.add(id)}}
if(idDuplicates.length)issues.push(`IDs HTML duplicados: ${idDuplicates.join(', ')}.`);
const htmlRefs=[...dictionary.matchAll(/\bhref="#([^"]+)"/g)].map(m=>m[1]),htmlIds=new Set([...dictionary.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const ref of htmlRefs)if(!htmlIds.has(ref))issues.push(`Enlace interno sin destino en diccionario: #${ref}.`);
const externalAssets=[...`${diagram}\n${dictionary}`.matchAll(/(?:src|href)="([^"#][^"]*)"/g)].map(m=>m[1]);
if(externalAssets.length)issues.push(`Referencias externas no autocontenidas: ${externalAssets.join(', ')}.`);
function htmlNestingOk(html){const source=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'');const stack=[],voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);for(const token of source.match(/<![^>]*>|<\/?[a-z][^>]*>/gi)||[]){if(/^<!/.test(token))continue;const closing=/^<\//.test(token),name=token.match(/^<\/?\s*([a-z0-9:-]+)/i)?.[1]?.toLowerCase();if(!name)continue;if(closing){if(stack.pop()!==name)return false}else if(!voids.has(name)&&!/\/\s*>$/.test(token))stack.push(name)}return stack.length===0}
const htmlNesting=htmlNestingOk(diagram)&&htmlNestingOk(dictionary);
if(!htmlNesting)issues.push('La estructura de etiquetas HTML no está balanceada.');
const styleBlocks=[...diagram.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g),...dictionary.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]);
const cssBalanced=styleBlocks.every(css=>{let n=0;for(const ch of css){if(ch==='{')n++;if(ch==='}')n--;if(n<0)return false}return n===0});
if(!cssBalanced)issues.push('Bloques CSS con llaves desbalanceadas.');
const darkDictionary=dictionary.includes('id="dictionary-dark-theme"')&&dictionary.includes('color-scheme:dark')&&!/<button[^>]*>\s*(?:Claro|Tema claro|Light)\s*<\/button>/i.test(dictionary);
const dictionaryCss=[...dictionary.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
const lightSurfaces=/(?:background|background-color)\s*:\s*(?:white|#fff(?:fff)?\s*[;}]|#f(?:3f6fa|7f9fc|6f8fb)\b)|color-scheme\s*:\s*light|@media\s+print/i.test(dictionaryCss);
const darkOnly=dictionary.includes('id="dictionary-dark-theme"')&&!lightSurfaces;
const groupsText=template.match(/const groups=\[([\s\S]*?)\];/)?.[1]||'';
const groupedTables=[...groupsText.matchAll(/\b(?:tb|tbc|tbd)_[a-z0-9_]+\b/g)].map(m=>m[0]);
const allTablesGrouped=sameNames(groupedTables,modelTables)&&new Set(groupedTables).size===modelTables.length;
const requiredButtonIds=[...template.matchAll(/<button\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
const implementedButtonIds=['zoomIn','zoomOut','fit','reset','guide','panelToggle','showAll'].every(id=>requiredButtonIds.includes(id)&&template.includes(`document.querySelector('#${id}')`));
const interactiveDiagram=['startDrag','addEventListener(\'wheel\'','focusTable','selectRelation','startTour','prefers-reduced-motion','tourButton.addEventListener(\'click\',startTour)'].every(s=>template.includes(s))&&implementedButtonIds&&allTablesGrouped&&!diagram.includes('id="stats"');
const groupPulse=template.includes("world.classList.toggle('group-view',groupView)")&&template.includes('class="flow-dot"')&&template.includes('<animateMotion')&&template.includes('class="rel" id="rel-${esc(rel.id)}"')&&diagram.includes('#world.group-view .edge .flow-dot{opacity:1}')&&diagram.includes('.edge .flow-dot{display:none}');
const searchableDictionary=dictionary.includes("q.addEventListener('input',filter)")&&dictionary.includes('data-search=')&&dictionary.includes('href="#');
const dictScript=[...dictionary.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0]||'';
const makeClassList=()=>{const set=new Set();return {toggle(name,force){if(force)set.add(name);else set.delete(name)},contains:name=>set.has(name)}};
let mockSearchHandler=null;const mockSearch={value:'',addEventListener:(event,handler)=>{if(event==='input')mockSearchHandler=handler}},mockResult={textContent:''};
const mockCards=model.tables.map(t=>{const rows=t.columns.map(c=>({dataset:{column:c.name,search:`${c.name} ${c.type} ${c.description} ${c.classification} ${c.default||''} ${c.definition}`.toLowerCase()},classList:makeClassList()}));return {dataset:{table:t.name,title:t.title},textContent:`${t.name} ${t.title} ${t.description}`,querySelectorAll:selector=>selector==='tbody tr'?rows:[],classList:makeClassList(),rows}});
const mockRelationRows=model.relationships.map(r=>({dataset:{search:`${r.sourceTable} ${r.sourceColumns.join(' ')} ${r.targetTable} ${r.targetColumns.join(' ')} ${r.constraint}`.toLowerCase()},classList:makeClassList()}));
const mockDocument={querySelector:selector=>selector==='#search'?mockSearch:selector==='#result'?mockResult:null,querySelectorAll:selector=>selector==='.table-card'?mockCards:selector==='#relationRows tr'?mockRelationRows:[]};
let dictionarySearchCases={column:false,table:false,noMatch:false,clear:false},dictionarySearchBehavior=false;
try{vm.runInNewContext(dictScript,{document:mockDocument});const filter=()=>mockSearchHandler?.();mockSearch.value='cancellation_ID';filter();const cancellation=mockCards.find(c=>c.dataset.table==='tbd_cancellation_items'),cancelRow=cancellation.rows.find(r=>r.dataset.column==='cancellation_ID');dictionarySearchCases.column=!cancellation.classList.contains('hidden')&&!cancelRow.classList.contains('hidden')&&cancellation.rows.filter(r=>!r.classList.contains('hidden')).length===1;mockSearch.value='tb_returns';filter();const returnTable=mockCards.find(c=>c.dataset.table==='tb_returns');dictionarySearchCases.table=!returnTable.classList.contains('hidden')&&returnTable.rows.every(r=>!r.classList.contains('hidden'));mockSearch.value='__no_schema_match__';filter();dictionarySearchCases.noMatch=mockCards.every(c=>c.classList.contains('hidden'))&&mockRelationRows.every(r=>r.classList.contains('hidden'));mockSearch.value='';filter();dictionarySearchCases.clear=mockCards.every(c=>!c.classList.contains('hidden'))&&mockRelationRows.every(r=>!r.classList.contains('hidden'));dictionarySearchBehavior=!!mockSearchHandler&&Object.values(dictionarySearchCases).every(Boolean)}catch(e){issues.push(`La prueba aislada de búsqueda del diccionario falló: ${e.message}`)}
const checks={tables:sqlTables.length===model.summary.tables,columns:columns===model.summary.columns,columnDefinitions:definitionsExact,primaryKeys:primaryKeys===model.summary.primaryKeys&&primaryExact,foreignKeys:foreignKeys===model.summary.foreignKeys&&fksExact,indexes:indexes===model.summary.indexes&&indexesExact,checkConstraints:sqlCheckCount===model.summary.constraints-model.summary.primaryKeys-model.summary.foreignKeys,relationships:cardinalityExact,otherSqlObjects:triggerNames.length===model.summary.triggers&&procedureNames.length===model.summary.procedures&&viewNames.length===model.summary.views,diagramMatchesModel:!!embedded&&JSON.stringify(embedded)===JSON.stringify(model),dictionaryMatchesModel:dictionaryColumns===model.summary.columns&&dictNames.length===model.summary.tables,scriptSyntax:scriptSyntax.length===0,htmlTagNesting:htmlNesting,cssBraces:cssBalanced,uniqueHtmlIds:idDuplicates.length===0,internalDictionaryLinks:htmlRefs.every(x=>htmlIds.has(x)),inlineDependencies:externalAssets.length===0,dictionaryDarkTheme:darkDictionary&&darkOnly,diagramControlsAndTour:interactiveDiagram,groupViewPulse:groupPulse,dictionarySearchNavigation:searchableDictionary,dictionarySearchBehavior};
const status=Object.values(checks).every(Boolean)&&issues.length===0?'PASS':'FAIL';
const result={...model.summary,database:model.database,mysqlVersion:model.mysqlVersion,source:model.source,checkConstraints:sqlCheckCount,technicalChecks:checks,dictionarySearchCases,status,issues,visualReview:'Pendiente: revisión manual del usuario en navegador; no se ejecutaron pruebas visuales.',undocumentedFields:model.tables.flatMap(t=>t.columns.filter(c=>c.description.startsWith('El nombre y')).map(c=>`${t.name}.${c.name}`))};
console.log(JSON.stringify(result,null,2));
if(status!=='PASS')process.exitCode=1;
