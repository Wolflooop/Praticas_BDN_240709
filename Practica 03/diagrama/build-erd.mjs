import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '..');
const source = path.join(root, 'backups', 'respaldo_29_10_2026_DGC.sql');
const modelPath = path.join(dir, 'schema-model.json');
const sql = fs.readFileSync(source, 'utf8');
const database=sql.match(/CREATE DATABASE\s+IF NOT EXISTS\s+`([^`]+)`/i)?.[1]||sql.match(/USE `([^`]+)`/i)?.[1];
const mysqlVersion=sql.match(/Server version\s+([^\r\n]+)/i)?.[1]?.trim()||'No indicada en el respaldo';
if(!database)throw new Error('No se pudo obtener el nombre de la base de datos desde el respaldo.');

const tableInfo = {
  tb_carts:['Carritos de compra','Mantiene el carrito asociado a una cuenta. La restricción única sobre user_ID limita a una fila de carrito por usuario.'],
  tb_logs:['Bitácora de operaciones','Conserva eventos de operaciones sobre tablas, con actor de base de datos, registro afectado, descripción, fecha y estado. El respaldo no declara una FK desde record_id porque la bitácora es polimórfica.'],
  tb_orders:['Pedidos','Registra pedidos por vendedor, subtotal, costo de envío, estado de cumplimiento y marcas temporales.'],
  tb_order_cancellations:['Solicitudes de cancelación de pedido','Registra solicitudes asociadas a un pedido, con usuario solicitante, motivo, estado y fechas. Sus claves foráneas declaradas apuntan al pedido y a la cuenta solicitante.'],
  tb_payment_methods:['Métodos de pago','Catálogo de métodos de pago con nombre, descripción, estado y fecha de creación. No hay una FK declarada hacia este catálogo en el respaldo.'],
  tb_payment_transaction:['Transacciones de pago','Almacena referencias y respuestas del gateway asociadas a un pago.'],
  tb_payments:['Pagos','Registra el importe y estado de pago de un pedido, además del método de pago del usuario cuando se especifica.'],
  tb_people:['Personas','Almacena datos personales y de contacto; user_ID opcional y único vincula como máximo una fila de persona por usuario.'],
  tb_products:['Productos','Catálogo de productos con SKU único, descripción, precio, inventario y estado.'],
  tb_refunds:['Reembolsos','Registra importes de reembolso, motivo y fecha para un pago.'],
  tb_returns:['Solicitudes de devolución','Registra solicitudes asociadas a un pedido, con usuario solicitante, motivo, estado y fechas. Sus claves foráneas declaradas apuntan al pedido y a la cuenta solicitante.'],
  tb_shipments:['Envíos','Registra seguimiento, transportista, estado y fechas de despacho y entrega de un pedido.'],
  tb_user_addresses:['Direcciones de usuario','Guarda direcciones de entrega, datos de recepción, instrucciones y coordenadas opcionales. La columna generada default_user_ID y su índice único implementan unicidad para el usuario marcado como predeterminado.'],
  tb_users:['Cuentas de usuario','Almacena credenciales de acceso, marcas de creación y actividad, último acceso y estado. email y nick son únicos.'],
  tbc_categories:['Categorías','Catálogo jerárquico de categorías; sup_id_category declara una autorrelación opcional con la categoría superior.'],
  tbc_payment_methods_types:['Tipos de método de pago','Catálogo de tipos de método de pago con código único, descripción, estado y marcas temporales.'],
  tbd_address_components:['Componentes de dirección','Representa partes tipadas de una dirección y su posible jerarquía dentro de esa misma dirección. Las FKs compuestas mantienen el componente padre dentro de la misma dirección.'],
  tbd_cancellation_items:['Detalles de cancelación','Conserva motivo, pedido y usuario solicitante; cancellation_ID permite vincular opcionalmente el registro con una solicitud de tb_order_cancellations.'],
  tbd_cart_items:['Artículos del carrito','Asocia un carrito con una oferta de producto-proveedor y conserva la cantidad solicitada.'],
  tbd_order_items:['Partidas de pedido','Conserva el producto y proveedor de cada partida, además del nombre y precio capturados. subtotal es una columna generada a partir de cantidad por precio unitario.'],
  tbd_products_categories:['Asignaciones de categoría','Tabla de asociación entre productos y categorías, con estado y fechas.'],
  tbd_products_users_providers:['Ofertas de producto por proveedor','Asocia cuentas proveedoras con productos e incluye tipo de titularidad y vigencia de la oferta.'],
  tbd_return_items:['Detalles de devolución','Conserva motivo, estado y pedido asociado; return_ID permite vincular opcionalmente el registro con una solicitud de tb_returns.'],
  tbd_user_payment_methods:['Métodos de pago de usuario','Guarda referencias tokenizadas de métodos de pago asociadas a una cuenta y un tipo de método. El esquema no contiene el número completo de tarjeta.'],
  tbd_users_wishlist_products:['Lista de deseos','Asocia usuarios con productos guardados y conserva estado y marcas temporales.'],
};

const fieldInfo = {
  ID:'Identificador técnico de la fila.', user_ID:'Identificador técnico de la cuenta de usuario relacionada.', person_ID:'Identificador técnico de la fila de persona.', seller_ID:'Identificador técnico de la cuenta vendedora del pedido.', order_ID:'Identificador técnico del pedido relacionado.', payment_ID:'Identificador técnico del pago relacionado.', user_payment_method_ID:'Identificador técnico del método de pago del usuario; puede no estar especificado.', payment_method_type_ID:'Identificador técnico del tipo de método de pago.', product_ID:'Identificador técnico del producto relacionado.', product_Id:'Identificador técnico del producto relacionado.', category_ID:'Identificador técnico de la categoría relacionada.', category_Id:'Identificador técnico de la categoría relacionada.', cart_ID:'Identificador técnico del carrito relacionado.', provider_ID:'Identificador técnico del usuario proveedor.', requested_by:'Identificador técnico del usuario que solicita la operación.', seller_order_ID:'Identificador técnico del pedido al que pertenece la partida.', address_ID:'Identificador técnico de la dirección a la que pertenece el componente.', address_sup_ID:'Identificador técnico opcional del componente padre de la misma dirección.', sup_id_category:'Identificador técnico opcional de la categoría superior.', default_user_ID:'Columna generada para aplicar unicidad al usuario cuya dirección está marcada como predeterminada.',
  status:'Indicador de estado almacenado como bit.', creation_date:'Fecha y hora de creación del registro.', last_update:'Fecha y hora de actualización; el SQL puede actualizarla automáticamente.', last_login:'Fecha y hora del acceso más reciente registrado.', name:'Nombre visible del elemento.', description:'Descripción textual del elemento.', email:'Dirección de correo electrónico de la cuenta.', nick:'Alias de la cuenta.', password:'Credencial de acceso almacenada como texto; el esquema por sí solo no especifica su tratamiento criptográfico.', SKU:'Código de referencia comercial del producto.', current_price:'Importe del precio vigente del producto.', current_stock:'Cantidad de existencias registrada para el producto.', subtotal:'Importe subtotal; cuando es generado, el SQL define la expresión que lo calcula.', shipping_cost:'Importe del costo de envío.', fulfillment_status:'Categoría del estado de cumplimiento del pedido.', payment_status:'Categoría del estado del pago.', shipping_status:'Categoría del estado del envío.', table_name:'Nombre de la tabla afectada, almacenado como texto.', record_id:'Identificador del registro afectado; no tiene FK declarada.', table_operation:'Categoría de operación registrada.', db_user:'Nombre del usuario de base de datos que ejecutó la operación.', table_description:'Descripción textual del evento registrado.', operation_date:'Fecha y hora de la operación registrada.', operation_status:'Indicador del resultado o estado de la operación.', transaction_reference:'Referencia de la transacción en el sistema externo.', gateway_response:'Respuesta textual del gateway de pago.', amount:'Importe del pago o reembolso.', reason:'Motivo textual de la solicitud.', tracking_number:'Número de seguimiento del envío.', carrier:'Nombre del transportista.', shipped_date:'Fecha y hora de despacho.', delivered_date:'Fecha y hora de entrega.', given_names:'Nombres de la persona.', family_names:'Apellidos de la persona.', birth_date:'Fecha de nacimiento.', gender:'Categoría declarada de género; los valores permitidos aparecen en el ENUM SQL.', country_code:'Código de país almacenado en dos caracteres; el SQL no define un catálogo.', phone:'Número telefónico almacenado como texto.', courtesy_title:'Tratamiento de cortesía textual.', address_label:'Etiqueta asignada a la dirección.', recipient_name:'Nombre de la persona destinataria.', recipient_phone:'Teléfono de la persona destinataria.', delivery_instructions:'Instrucciones textuales para la entrega.', latitude:'Coordenada de latitud; el CHECK limita el valor al intervalo de −90 a 90.', longitude:'Coordenada de longitud; el CHECK limita el valor al intervalo de −180 a 180.', is_default:'Indicador numérico de si la dirección o método está marcado como predeterminado.', value:'Valor textual del componente de dirección.', component_type:'Tipo textual del componente de dirección; no hay catálogo declarado en el SQL.', quantity:'Cantidad de unidades.', product_name:'Nombre del producto conservado en la partida del pedido.', unit_price:'Importe unitario conservado en la partida.', type_ownership:'Categoría del tipo de titularidad; los valores permitidos aparecen en el ENUM SQL.', avalaible_date:'Fecha y hora desde la que se registra disponible la oferta.', last_date:'Fecha y hora final registrada para la oferta.', provider:'Nombre del proveedor externo del método de pago.', provider_method_ref:'Referencia del método de pago en el proveedor externo.', label:'Etiqueta descriptiva opcional del método de pago.', last_four:'Últimos cuatro caracteres mostrables de la referencia de pago.', code:'Código único del tipo de método de pago.', fulfillment_status:'Estado del proceso de cumplimiento; los valores permitidos aparecen en el ENUM SQL.',
};

function splitColumns(s) { return [...s.matchAll(/`([^`]+)`/g)].map(m => m[1]); }
function rawType(def) {
  const m = def.match(/^([a-z]+(?:\s*\([^)]*\))?(?:\s+unsigned)?)/i);
  return m ? m[1].replace(/\s+/g, ' ').trim() : 'Tipo no reconocido';
}
function sizeOf(type) {
  if (/^enum\(/i.test(type)) return 'No aplica (ENUM)';
  const m = type.match(/\((.*)\)/);
  return m ? m[1] : (type.toLowerCase() === 'text' ? 'sin longitud declarada' : 'No aplica');
}
function classify(name, type, def) {
  if (/\b(date|datetime|timestamp|time)\b/i.test(type)) return 'Temporal';
  if (/^(?:ID|.*(?:_ID|_Id)|default_user_ID|record_id|person_ID|requested_by)$/i.test(name) && /int|bigint/i.test(type)) return 'Identificador técnico';
  if (/password|description|reason|instructions|response|table_description/i.test(name) || /\b(text|varchar|char|enum)\b/i.test(type)) return /enum/i.test(type) ? 'Cualitativa nominal' : 'Texto descriptivo';
  if (/\b(bit|boolean)\b/i.test(type) || /is_default|status|operation_status/i.test(name)) return 'Binaria o técnica';
  if (/latitude|longitude|price|amount|subtotal|cost/i.test(name) && /decimal|float|double/i.test(type)) return 'Cuantitativa continua';
  if (/quantity|stock|record_id/i.test(name) && /int|decimal/i.test(type)) return 'Cuantitativa discreta';
  if (/int|decimal|float|double/i.test(type)) return 'Cuantitativa discreta';
  return 'Cualitativa nominal';
}
function keysFor(body) {
  const keys=[];
  for (const m of body.matchAll(/\b(PRIMARY KEY|UNIQUE KEY|KEY|UNIQUE INDEX|INDEX)\s*(?:`([^`]+)`\s*)?\(([^)]*)\)/gi)) {
    const kind=/PRIMARY/i.test(m[1])?'PRIMARY':/UNIQUE/i.test(m[1])?'UNIQUE':'INDEX';
    keys.push({kind,name:m[2] || (kind==='PRIMARY'?'PRIMARY':null),columns:splitColumns(m[3])});
  }
  return keys;
}
function constraintsFor(body) {
  const out=[];
  for (const m of body.matchAll(/CONSTRAINT `([^`]+)` FOREIGN KEY \(([^)]*)\) REFERENCES `([^`]+)` \(([^)]*)\)([^,\n]*)/g)) {
    out.push({type:'FOREIGN KEY',name:m[1],columns:splitColumns(m[2]),references:{table:m[3],columns:splitColumns(m[4])},onDelete:(m[5].match(/ON DELETE (CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)/i)?.[1]||'NO ACTION').toUpperCase(),onUpdate:(m[5].match(/ON UPDATE (CASCADE|RESTRICT|SET NULL|NO ACTION|SET DEFAULT)/i)?.[1]||'NO ACTION').toUpperCase()});
  }
  for (const m of body.matchAll(/CONSTRAINT `([^`]+)` CHECK \((.*?)\)(?=,?\s*(?:CONSTRAINT|PRIMARY KEY|UNIQUE KEY|KEY|$))/gs)) out.push({type:'CHECK',name:m[1],expression:m[2]});
  return out;
}

const tables=[];
for (const m of sql.matchAll(/^CREATE TABLE `([^`]+)` \(([\s\S]*?)\) ENGINE=([^\n;]+)/gm)) {
  const name=m[1], body=m[2], cols=[];
  for (const line of body.split(/\r?\n/)) {
    const c=line.match(/^\s*`([^`]+)`\s+(.+?)(?:,)?\s*$/);
    if (!c || /^(PRIMARY KEY|UNIQUE KEY|KEY |CONSTRAINT )/i.test(c[2])) continue;
    const definition=c[2].replace(/,$/,'').trim(), type=rawType(definition);
    const generated=definition.match(/GENERATED ALWAYS AS \((.*)\) (VIRTUAL|STORED)/i);
    const defMatch=definition.match(/\bDEFAULT\s+(.+?)(?=\s+ON UPDATE|\s+GENERATED ALWAYS|$)/i);
    cols.push({name:c[1],type,size:sizeOf(type),definition,nullable:!(/\bNOT NULL\b/i.test(definition)),default:defMatch?.[1]?.trim()??null,autoIncrement:/\bAUTO_INCREMENT\b/i.test(definition),onUpdate:definition.match(/ON UPDATE (CURRENT_TIMESTAMP(?:\(\))?)/i)?.[1]||null,generated:generated?{expression:generated[1],storage:generated[2].toUpperCase()}:null,classification:classify(c[1],type,definition),description:fieldInfo[c[1]]||`El nombre y la definición SQL identifican el campo como “${c[1]}”, pero no bastan para determinar con seguridad su significado funcional.`});
  }
  const indexes=keysFor(body), constraints=constraintsFor(body);
  const pk=indexes.find(x=>x.kind==='PRIMARY')?.columns||[];
  for(const col of cols){col.keys=[];if(pk.includes(col.name))col.keys.push('PK');for(const ix of indexes.filter(x=>x.kind==='UNIQUE'&&x.columns.includes(col.name)))col.keys.push('UNIQUE');for(const fk of constraints.filter(x=>x.type==='FOREIGN KEY'&&x.columns.includes(col.name)))col.keys.push('FK');}
  tables.push({name,title:tableInfo[name]?.[0]||name,description:tableInfo[name]?.[1]||'El respaldo define esta tabla, pero sus nombres y restricciones no permiten asegurar un propósito funcional más específico.',columns:cols,primaryKey:pk,indexes,constraints,engine:(m[3].match(/^[^ ]+/)||[])[0],options:m[3]});
}
const relationships=[];
for(const t of tables) for(const col of t.columns){
  if(col.name==='status'&&/^enum\(/i.test(col.type)) col.description='Estado categórico del registro; los valores permitidos son los enumerados en la definición ENUM de SQL.';
  for(const fk of t.constraints.filter(x=>x.type==='FOREIGN KEY')) fk.columns.forEach((columnName,index)=>{if(columnName!==col.name)return;const target=tables.find(x=>x.name===fk.references.table)?.columns.find(x=>x.name===fk.references.columns[index]);if(col.description.startsWith('El nombre y')&&target)col.description=`Identificador técnico opcional que referencia ${fk.references.table}.${fk.references.columns[index]}.`;if(/^(?:int|bigint)/i.test(col.type))col.classification='Identificador técnico';});
}
for(const t of tables) for(const fk of t.constraints.filter(x=>x.type==='FOREIGN KEY')) {
  const unique=indexesUnique(t.indexes,fk.columns);
  const sourceOptional=fk.columns.some(n=>t.columns.find(c=>c.name===n)?.nullable);
  relationships.push({id:`relation-${relationships.length+1}`,sourceTable:t.name,sourceColumns:fk.columns,targetTable:fk.references.table,targetColumns:fk.references.columns,constraint:fk.name,sourceCardinality:sourceOptional?'0..1':'1',targetCardinality:unique?'0..1':'0..N',cardinality:`origen → destino: ${sourceOptional?'0..1':'1'}; destino → filas de origen: ${unique?'0..1':'0..N'}`,sourceOptional,onDelete:fk.onDelete,onUpdate:fk.onUpdate,description:`${t.title} referencia ${tableInfo[fk.references.table]?.[0]||fk.references.table} mediante la restricción declarada ${fk.name}.`});
}
function indexesUnique(indexes, columns){return indexes.some(i=>['PRIMARY','UNIQUE'].includes(i.kind)&&i.columns.length===columns.length&&i.columns.every(c=>columns.includes(c)));}
const triggers=[...sql.matchAll(/TRIGGER `([^`]+)` (BEFORE|AFTER) (INSERT|UPDATE|DELETE) ON `([^`]+)`/g)].map(m=>({name:m[1],timing:m[2],event:m[3],table:m[4]}));
const procedures=[...sql.matchAll(/PROCEDURE `([^`]+)`\s*\(([\s\S]*?)\)\s*(MODIFIES SQL DATA)?/g)].map(m=>({name:m[1],parameters:m[2].split(/,\s*\r?\n/).map(x=>x.trim()).filter(Boolean),modifiesSqlData:!!m[3],description:m[1]==='sp_register_new_user'?'Registra una cuenta y la información de persona relacionada, según el procedimiento almacenado.':m[1]==='sp_restore_product'?'Reactiva el estado de un producto tras validar su existencia y estado actual.':m[1]==='sp_soft_delete_product'?'Marca un producto como inactivo tras validar su existencia y estado actual.':'El respaldo declara este procedimiento; su propósito requiere revisión.'}));
const views=[...new Set([...sql.matchAll(/VIEW `([^`]+)` AS/g)].map(m=>m[1]))].map(name=>({name}));
const model={database,mysqlVersion,source:'backups/respaldo_29_10_2026_DGC.sql',generatedAt:new Date().toISOString().slice(0,10),tables,relationships,objects:{triggers,procedures,views},summary:{tables:tables.length,columns:tables.reduce((n,t)=>n+t.columns.length,0),primaryKeys:tables.filter(t=>t.primaryKey.length).length,foreignKeys:relationships.length,indexes:tables.reduce((n,t)=>n+t.indexes.length,0),constraints:tables.reduce((n,t)=>n+t.constraints.length+(t.primaryKey.length?1:0),0),relationships:relationships.length,triggers:triggers.length,procedures:procedures.length,views:views.length,undocumentedFields:tables.reduce((n,t)=>n+t.columns.filter(c=>c.description.startsWith('El nombre y')).length,0)}};
fs.writeFileSync(modelPath,JSON.stringify(model,null,2)+'\n','utf8');
let template=fs.readFileSync(path.join(dir,'diagram-template.html'),'utf8');
const darkTheme=`<style id="erd-neon-theme">
:root{color-scheme:dark;--ink:#e6edf7;--muted:#9aa9bc;--line:#26364a;--paper:#090e17;--card:#111a27;--navy:#070b12;--blue:#39bdf2;--cyan:#32e6d1;--amber:#ffbf69;--green:#70e1b4;--shadow:0 12px 36px #0008}
body{background:#090e17;color:#e6edf7}.top{background:#0c1420;border-bottom:1px solid #24354a;color:#edf5ff}.brand small{color:#54d4ed}.brand p{color:#aab8ca}.workspace,.main{background:#0d1521}.toolbar,.panel,.footer{background:#101a28;color:#dbe6f4;border-color:#26364a}.toolbar{box-shadow:0 5px 18px #0003}.toolbar input{background:#0a111b;color:#edf5ff;border-color:#34465d}.toolbar input::placeholder{color:#8292a8}.toolbar input:focus{border-color:#37c8e7;box-shadow:0 0 0 3px #20c7e522}.btn{background:#142133;color:#d9e5f3;border-color:#354b64}.btn:hover,.btn.active{background:#1a2b40;color:#b9f3ff;border-color:#36cbe6;box-shadow:0 0 14px #20c7e522}.toolbar label,.empty{color:#9aa9bc}.canvas{background-color:#090f19;background-image:radial-gradient(#25364c 0.75px,transparent .75px)}
.entity{filter:drop-shadow(0 5px 9px #0008)}.entity .head{fill:#121e2e;stroke:#344a62}.entity .rowbg{fill:#101a27;stroke:#1d2a3a}.entity:hover .head,.entity.selected .head{stroke:#37d8f3;filter:drop-shadow(0 0 7px #27cfea55)}.entity.selected .head{fill:#15283a}.entity .table-name{fill:#e5f3ff}.entity .table-meta{fill:#90a4bc}.entity .field{fill:#c9d7e8}.entity .type{fill:#8297b1}.entity .null,.entity .badge{fill:#8494a8}.entity .pk,.entity .key.pk{fill:#ffbf69}.entity .fk,.entity .key.fk{fill:#44e4d5}.entity .rowbg.match{fill:#40351d}.entity .rowbg.dim{opacity:.25}.entity .rowbg.focus{fill:#183245}.entity.selected .pk-row,.entity .rowbg.pk-row.highlight{fill:#42321d}.entity.selected .fk-row,.entity .rowbg.fk-row.highlight{fill:#123b3b}.entity .key.pk{filter:drop-shadow(0 0 4px #ffc36e88)}.entity .key.fk{filter:drop-shadow(0 0 4px #39e6d288)}
.rel{stroke:#516780;opacity:.72}.rel-label,.rel-card{fill:#b4c7dc;stroke:#0a111b}.edge:hover .rel,.edge:focus .rel{stroke:#58d8ff}.edge.selected .rel,.edge .rel.active{stroke:#55e8ff;filter:drop-shadow(0 0 5px #37d9ffb0)}.edge.incoming .rel{stroke:#ffbf69}.edge.outgoing .rel{stroke:#4ce5d3}.edge.dimmed{opacity:.12}.edge.touring .rel{stroke:#a5ffef;stroke-width:4;filter:drop-shadow(0 0 8px #55ffe0);stroke-dasharray:12 8;animation:relation-flow .65s linear infinite}
#world.group-view .edge .rel{stroke:#52c8dc;stroke-width:1.65;opacity:.62}#world.group-view .edge:hover .rel,#world.group-view .edge:focus .rel{stroke:#75edff;stroke-width:2.8;filter:drop-shadow(0 0 6px #4ee6ffb0)}#world.group-view .edge .flow-dot{opacity:1}.edge .flow-dot{fill:#a5ffef;opacity:0;filter:drop-shadow(0 0 4px #55ffe0)}
.panel{border-color:#26364a}.panel h2{color:#f0f6ff}.panel h3,.panel dt{color:#9db0c7}.panel p,.panel dd,.item small{color:#b0bfd1}.item{border-color:#26364a}.chip{background:#1b2939;color:#c4d3e5}.chip.pk{background:#382a1b;color:#ffd18d}.chip.fk{background:#133434;color:#78eee2}.legend{background:#101a28;border-color:#33475e;color:#b8c8da;box-shadow:0 6px 20px #0008}.hint,.footer{color:#92a2b6}.relation-button{background:#142133;color:#d5e4f4;border-color:#354b64}.relation-button:hover{background:#1b2b3e;border-color:#39cde5}.direction.out{color:#ffca78}.direction.in{color:#69e6dc}.panel a{color:#6bcfff}button:focus-visible,input:focus-visible,.entity:focus .head,.edge:focus .rel{outline-color:#48ddf1;box-shadow:0 0 0 2px #48ddf155}
@media(prefers-reduced-motion:reduce){.edge.touring .rel{animation:none;filter:none}.edge .flow-dot{display:none}}
</style>`;
template=template.replace('</head>',`${darkTheme}</head>`);
const html=template.replace('__MODEL__',JSON.stringify(model).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029'));
fs.writeFileSync(path.join(dir,'modelo-db-test-7b.html'),html,'utf8');
console.log(`Modelo actualizado: ${model.summary.tables} tablas, ${model.summary.columns} columnas, ${model.summary.foreignKeys} FK.`);
