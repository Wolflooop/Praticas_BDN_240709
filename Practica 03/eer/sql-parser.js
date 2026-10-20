/* Safe, text-only MySQL DDL/dump parser. Never sends or executes SQL. */
(function(root){
  const unquote=s=>s?.replace(/^`|`$/g,'').replace(/``/g,'`');
  function statements(sql){
    sql=sql.replace(/^\s*DELIMITER\s+.*$/gim,'').replace(/\/\*!(?:\d{5,6})?\s*([\s\S]*?)\*\//g,'$1').replace(/;;/g,';');
    const out=[];let start=0,q=null,line=false,block=0;
    for(let i=0;i<sql.length;i++){
      const c=sql[i],n=sql[i+1];
      if(line){if(c==='\n')line=false;continue}
      if(block){if(c==='/'&&n==='*'){block++;i++}else if(c==='*'&&n==='/'){block--;i++}continue}
      if(q){if(c==='\\'){i++;continue}if(c===q){if(sql[i+1]===q){i++;continue}q=null}continue}
      if(c==='-'&&n==='-'&&(i+2===sql.length||/\s/.test(sql[i+2]))){line=true;i++;continue}
      if(c==='#'){line=true;continue}
      if(c==='/'&&n==='*'){block++;i++;continue}
      if(c==="'"||c==='"'||c==='`'){q=c;continue}
      if(c===';'){const part=sql.slice(start,i).trim();if(part)out.push(part);start=i+1}
    }
    const tail=sql.slice(start).trim();if(tail)out.push(tail);return out;
  }
  function splitTop(s){let a=[],st=0,d=0,q=null;for(let i=0;i<s.length;i++){let c=s[i];if(q){if(c==='\\'){i++;continue}if(c===q){if(s[i+1]===q){i++;continue}q=null}continue}if("'\"`".includes(c)){q=c;continue}if(c==='(')d++;else if(c===')')d--;else if(c===','&&d===0){a.push(s.slice(st,i).trim());st=i+1}}a.push(s.slice(st).trim());return a}
  function readParen(s,start){let d=0,q=null;for(let i=start;i<s.length;i++){const c=s[i];if(q){if(c==='\\'){i++;continue}if(c===q)q=null;continue}if("'\"`".includes(c))q=c;else if(c==='(')d++;else if(c===')'&&--d===0)return s.slice(start+1,i)}return ''}
  function colsIn(s){return splitTop(s).map(x=>unquote((x.match(/^\s*`([^`]+)`/)||[])[1]||x.trim().split(/\s+/)[0]))}
  function cleanDefault(spec){let m=spec.match(/\bDEFAULT\s+((?:b|_binary)?'(?:\\.|''|[^'])*'|NULL\b|CURRENT_TIMESTAMP(?:\(\d*\))?(?:\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP(?:\(\d*\))?)?|[+-]?\d+(?:\.\d+)?|\w+)/i);return m?m[1]:null}
  function parse(sql){
    const stmts=statements(sql),tables=new Map(),objects={views:[],procedures:[],functions:[],triggers:[]};let database=null;
    const ensure=name=>{if(!tables.has(name))tables.set(name,{name,schema:database,engine:null,columns:[],indexes:[],constraints:[],foreignKeys:[],inserts:0,countKnown:true});return tables.get(name)};
    function addConstraint(t,kind,name,columns,detail,extra={}){const item={name:name||kind,type:kind,columns,detail,...extra};if(!t.constraints.some(x=>x.name===item.name&&x.type===kind)){t.constraints.push(item);if(kind==='PRIMARY KEY')for(const c of t.columns)if(columns.includes(c.name))c.pk=true;if(kind==='UNIQUE')for(const c of t.columns)if(columns.includes(c.name))c.unique=true;if(kind==='FOREIGN KEY'){const fk={name:item.name,columns,references:extra.references,onDelete:extra.onDelete||null,onUpdate:extra.onUpdate||null};t.foreignKeys.push(fk);for(const c of t.columns)if(columns.includes(c.name)){c.fk=true;c.references=extra.references}}}}
    function parseTable(name,body,tail=''){
      const t=ensure(name);
      for(const part of splitTop(body)){
        let m=part.match(/^\s*`([^`]+)`\s+([\s\S]+)$/);if(m){const [,cn,spec]=m;const tm=spec.match(/^([\w]+(?:\s+unsigned)?(?:\s+zerofill)?(?:\s*\([^)]*\))?(?:\s+unsigned)?)/i);const type=tm?tm[1].replace(/\s+/g,' ').toLowerCase():spec.split(/\s/)[0].toLowerCase();const nullable=!/\bNOT\s+NULL\b/i.test(spec);const refs=spec.match(/\bREFERENCES\s+`([^`]+)`\s*\(`([^`]+)`\)/i);const c={name:cn,type,nullable,default:cleanDefault(spec),autoIncrement:/\bAUTO_INCREMENT\b/i.test(spec),pk:/\bPRIMARY\s+KEY\b/i.test(spec),fk:!!refs,unique:/\bUNIQUE\b/i.test(spec),comment:(spec.match(/\bCOMMENT\s+'((?:''|[^'])*)'/i)||[])[1]?.replace(/''/g,"'")||null,references:refs?{table:refs[1],column:refs[2]}:null,extra:spec.replace(tm?.[0]||type,'').trim()};t.columns.push(c);if(c.pk)addConstraint(t,'PRIMARY KEY','PRIMARY',[cn],cn);if(c.unique)addConstraint(t,'UNIQUE',cn,[cn],cn);if(refs){const actDelete=(spec.match(/ON\s+DELETE\s+(CASCADE|SET\s+NULL|RESTRICT|NO\s+ACTION|SET\s+DEFAULT)/i)||[])[1]||null,actUpdate=(spec.match(/ON\s+UPDATE\s+(CASCADE|SET\s+NULL|RESTRICT|NO\s+ACTION|SET\s+DEFAULT)/i)||[])[1]||null;addConstraint(t,'FOREIGN KEY',`fk_${name}_${cn}`,[cn],`${cn} → ${refs[1]}.${refs[2]}`,{references:{table:refs[1],columns:[refs[2]]},onDelete:actDelete,onUpdate:actUpdate})}continue}
        m=part.match(/^\s*(?:CONSTRAINT\s+`([^`]+)`\s+)?(PRIMARY\s+KEY|UNIQUE(?:\s+KEY|\s+INDEX)?|(?:KEY|INDEX)|FOREIGN\s+KEY|CHECK)\s*(?:`([^`]+)`)?\s*([\s\S]*)$/i);if(!m)continue;
        let [,constraintName,kind,indexName,rest]=m;kind=kind.replace(/\s+/g,' ').toUpperCase();const name2=constraintName||indexName||(kind==='PRIMARY KEY'?'PRIMARY':kind);const paren=rest.indexOf('(');const inside=paren>=0?readParen(rest,paren):'';const cc=inside?colsIn(inside):[];
        if(kind.startsWith('FOREIGN')){const ref=rest.slice(paren+inside.length+2).match(/REFERENCES\s+`([^`]+)`\s*\(([^)]*)\)/i);if(!ref)continue;const target=ref[1],targetCols=colsIn(ref[2]);const actions=rest.slice(paren+inside.length+2);const onDelete=(actions.match(/ON\s+DELETE\s+(CASCADE|SET\s+NULL|RESTRICT|NO\s+ACTION|SET\s+DEFAULT)/i)||[])[1]||null,onUpdate=(actions.match(/ON\s+UPDATE\s+(CASCADE|SET\s+NULL|RESTRICT|NO\s+ACTION|SET\s+DEFAULT)/i)||[])[1]||null;addConstraint(t,'FOREIGN KEY',name2,cc,`${cc.join(', ')} → ${target}.${targetCols.join(', ')}`,{references:{table:target,columns:targetCols},onDelete,onUpdate});continue}
        if(kind==='CHECK'){addConstraint(t,'CHECK',name2,cc,rest);continue}
        const typ=kind.startsWith('PRIMARY')?'PRIMARY KEY':kind.startsWith('UNIQUE')?'UNIQUE':'INDEX';const idx={name:name2,type:typ,columns:cc,unique:typ==='UNIQUE'};if(!t.indexes.some(x=>x.name===idx.name))t.indexes.push(idx);if(typ!=='INDEX')addConstraint(t,typ,name2,cc,cc.join(', '));
      }
      const engine=(tail.match(/\bENGINE\s*=\s*([\w]+)/i)||[])[1];if(engine)t.engine=engine;
    }
    for(const st of stmts){
      let m=st.match(/^CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?`([^`]+)`/i);if(m){database=m[1];continue}m=st.match(/^USE\s+`?([\w$]+)`?/i);if(m){database=m[1];for(const t of tables.values())if(!t.schema)t.schema=database;continue}
      m=st.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:`([^`]+)`\.)?`?([^`\s(]+)`?\s*\(/i);if(m){const name=m[2],start=st.indexOf('(',m.index);parseTable(name,readParen(st,start),st.slice(start+readParen(st,start).length+2));continue}
      m=st.match(/^ALTER\s+TABLE\s+(?:`([^`]+)`\.)?`?([^`\s]+)`?\s+([\s\S]+)/i);if(m){const t=ensure(m[2]);for(const p of splitTop(m[3])){let z=p.match(/^(?:ADD\s+)?(?:COLUMN\s+)?`([^`]+)`\s+([\s\S]+)/i);if(z){const [,cn,spec]=z,ty=(spec.match(/^([\w]+(?:\s+unsigned)?(?:\s*\([^)]*\))?)/i)||[])[1]||'';if(!t.columns.some(c=>c.name===cn))t.columns.push({name:cn,type:ty.toLowerCase(),nullable:! /\bNOT\s+NULL\b/i.test(spec),default:cleanDefault(spec),autoIncrement:/\bAUTO_INCREMENT\b/i.test(spec),pk:false,fk:false,unique:false,comment:null,references:null,extra:''});continue}const op=p.replace(/^ADD\s+/i,'');if(/^(?:CONSTRAINT\s+|PRIMARY\s+KEY|UNIQUE|KEY|INDEX|FOREIGN\s+KEY|CHECK)/i.test(op))parseTable(t.name,op)}continue}
      m=st.match(/^CREATE\s+(UNIQUE\s+)?INDEX\s+`?([^`\s]+)`?\s+ON\s+`?([^`\s(]+)`?\s*\(([^)]*)\)/i);if(m){const t=ensure(m[3]);const cc=colsIn(m[4]);t.indexes.push({name:m[2],type:m[1]?'UNIQUE':'INDEX',unique:!!m[1],columns:cc});if(m[1])addConstraint(t,'UNIQUE',m[2],cc,cc.join(', '));continue}
      m=st.match(/^INSERT\s+(?:IGNORE\s+)?INTO\s+`?([^`\s(]+)`?(?:\s*\([^)]*\))?\s+([\s\S]+)/i);if(m){const t=ensure(m[1]),v=m[2].match(/^VALUES\s+([\s\S]+)/i);if(!v||/\bON\s+DUPLICATE\s+KEY\s+UPDATE\b/i.test(m[2]))t.countKnown=false;else t.inserts+=splitTop(v[1]).filter(x=>x.startsWith('(')).length;continue}
      m=st.match(/^REPLACE\s+INTO\s+`?([^`\s(]+)`?/i);if(m){ensure(m[1]).countKnown=false;continue}
      m=st.match(/^LOAD\s+DATA\b[\s\S]*?\bINTO\s+TABLE\s+`?([^`\s]+)`?/i);if(m){ensure(m[1]).countKnown=false;continue}
      m=st.match(/^TRUNCATE\s+(?:TABLE\s+)?`?([^`\s;]+)`?/i);if(m){ensure(m[1]).countKnown=false;continue}
      m=st.match(/^DELETE\s+FROM\s+`?([^`\s;]+)`?/i);if(m){ensure(m[1]).countKnown=false;continue}
      m=st.match(/^CREATE\s+(?:OR\s+REPLACE\s+)?(?:DEFINER\s*=\s*[^\s]+\s+)?(VIEW|PROCEDURE|FUNCTION|TRIGGER)\s+`([^`]+)`/i);if(m){const key={VIEW:'views',PROCEDURE:'procedures',FUNCTION:'functions',TRIGGER:'triggers'}[m[1].toUpperCase()];objects[key].push(m[2])}
    }
    const relations=[];for(const t of tables.values())for(const fk of t.foreignKeys){const unique=t.indexes.some(i=>i.unique&&i.columns.length===fk.columns.length&&i.columns.every((c,n)=>c===fk.columns[n]))||t.constraints.some(c=>['PRIMARY KEY','UNIQUE'].includes(c.type)&&c.columns.length===fk.columns.length&&c.columns.every((x,n)=>x===fk.columns[n]));const optional=fk.columns.some(n=>t.columns.find(c=>c.name===n)?.nullable);relations.push({name:fk.name,fromTable:t.name,fromColumns:fk.columns,toTable:fk.references.table,toColumns:fk.references.columns,cardinality:unique?'1:1':'N:1',optional,onDelete:fk.onDelete,onUpdate:fk.onUpdate,confirmed:true,selfReference:t.name===fk.references.table})}
    for(const t of tables.values()){t.associative=t.foreignKeys.length>=2&&t.foreignKeys.every(f=>f.columns.every(c=>t.columns.find(x=>x.name===c)?.pk));t.relationshipFree=!relations.some(r=>r.fromTable===t.name||r.toTable===t.name);t.recordCount=t.countKnown?{value:t.inserts,source:t.inserts?'Respaldo SQL · tuplas INSERT incluidas':'Respaldo SQL · 0 tuplas INSERT',kind:'backup',exact:true}:{value:null,source:'Respaldo SQL · conteo final no reconstruible',kind:'unavailable',exact:false};delete t.inserts;delete t.countKnown}
    return{source:'respaldo_19_10_2026_DGC.sql',database:database||null,dialect:'MySQL',tables:[...tables.values()],relations,objects,analysis:{statements:stmts.length,generatedAt:new Date().toISOString(),databaseConnection:null}};
  }
  root.EERSQLParser={parse,statements};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.EERSQLParser;
})(typeof window!=='undefined'?window:globalThis);
