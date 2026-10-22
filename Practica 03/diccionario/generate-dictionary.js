// Generate the Spanish data dictionary and Archify ERD from the requested SQL dump.
// The SQL is parsed as text; this script never connects to or executes MySQL.
const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('../eer/sql-parser.js');

const root = path.resolve(__dirname, '..');
const dump = path.join(root, 'backups', 'respaldo_21_10_2026_DGC.sql');
const sql = fs.readFileSync(dump, 'latin1');
const model = parse(sql);
const lines = sql.split(/\r?\n/);
const tableInfo = {
  tb_buyer_orders: ['Órdenes de compra al vendedor', 'Registra la cabecera de cada orden generada para un vendedor. Conserva importes agregados, estado de cumplimiento y marcas de tiempo; las partidas detalladas se relacionan mediante tbd_order_items.'],
  tb_carts: ['Carritos de compra', 'Representa el carrito asociado a una cuenta. Su identificador permite agrupar las partidas del carrito y su estado y fechas permiten conocer su vigencia y trazabilidad.'],
  tb_categories: ['Categorías de productos', 'Catálogo jerárquico para clasificar productos. La referencia opcional a otra categoría permite expresar una categoría superior; tb_product_categories materializa la asignación de productos.'],
  tb_logs: ['Bitácora de operaciones', 'Almacena eventos de auditoría generados por las operaciones observadas en el respaldo. Conserva tabla y registro afectados, operación, usuario de base de datos, descripción, fecha y estado. No tiene FK declaradas hacia las tablas auditadas.'],
  tb_product_categories: ['Asignación de productos a categorías', 'Tabla asociativa que enlaza productos y categorías. La clave primaria compuesta evita repetir la misma pareja y sus FK conservan la integridad referencial.'],
  tb_products: ['Productos', 'Catálogo central de productos con SKU, nombre, descripción, precio, existencias y estado. Otras entidades como categorías, partidas, proveedores y listas de deseos hacen referencia a sus registros.'],
  tb_users: ['Usuarios', 'Guarda las cuentas de usuario, sus datos de acceso y marcas de creación, actualización e inicio de sesión. El esquema impone unicidad al correo y al apodo; no documenta aquí el proceso de autenticación.'],
  tbc_payment_methods_types: ['Tipos de medios de pago', 'Catálogo de tipos de medio de pago identificados por código y descripción. Las formas de pago de usuario referencian este catálogo.'],
  tbd_carts_items: ['Partidas de carrito', 'Relaciona un carrito con un producto y un proveedor, incluyendo la cantidad solicitada y la fecha de incorporación. Permite consultar el contenido detallado del carrito.'],
  tbd_order_items: ['Partidas de orden', 'Detalle de los productos incluidos en una orden de vendedor. Conserva nombre de producto y precio unitario como datos de la partida, además de cantidad y subtotal.'],
  tbd_products_users_providers: ['Relación de productos, usuarios y proveedores', 'Registra la asociación entre un producto y un usuario proveedor, junto con el tipo de titularidad, estado y fechas de disponibilidad y seguimiento.'],
  tbd_user_payment_methods: ['Medios de pago de usuario', 'Asocia una cuenta de usuario con un tipo de medio de pago y conserva referencias y etiquetas del proveedor, últimos cuatro dígitos, indicador predeterminado y estado. El esquema no incluye el número completo de tarjeta.'],
  tbd_users_wishlist_products: ['Productos en lista de deseos', 'Tabla asociativa que registra qué productos agregó cada usuario a su lista de deseos, junto con estado y fechas de creación y actualización.']
};
const words = {
  ID:'identificador interno del registro', seller_ID:'identificador del vendedor', user_ID:'identificador del usuario', product_ID:'identificador del producto',
  cart_ID:'identificador del carrito', provider_ID:'identificador del proveedor', category_Id:'identificador de la categoría', sup_id_category:'identificador de la categoría superior',
  seller_order_ID:'identificador de la orden del vendedor', payment_method_type_ID:'identificador del tipo de medio de pago', SKU:'código SKU del producto',
  name:'nombre', description:'descripción', code:'código del catálogo', email:'correo electrónico', nick:'apodo de usuario', password:'credencial de acceso almacenada',
  current_price:'precio vigente del producto', current_stock:'existencias actuales del producto', subtotal:'importe subtotal', shipping_cost:'costo de envío',
  fulfillment_status:'estado de cumplimiento de la orden', status:'indicador de estado del registro', operation_status:'indicador de resultado de la operación',
  table_name:'nombre técnico de la tabla afectada', record_id:'identificador del registro afectado', table_operation:'operación registrada sobre la tabla',
  db_user:'usuario de base de datos que ejecutó la operación', table_description:'descripción de la operación registrada', operation_date:'fecha y hora de la operación',
  creation_date:'fecha y hora de creación', last_update:'fecha y hora de la última actualización', last_login:'fecha y hora del último acceso',
  quantity:'cantidad de unidades', unit_price:'precio unitario aplicado', product_name:'nombre del producto conservado en la partida',
  type_ownership:'tipo de titularidad del producto', avalaible_date:'fecha y hora de disponibilidad (nombre según el esquema)', last_date:'fecha y hora del último evento registrado',
  provider:'proveedor del medio de pago', provider_method_ref:'referencia del medio asignada por el proveedor', label:'etiqueta descriptiva del medio de pago',
  last_four:'últimos cuatro dígitos identificadores del medio', is_default:'indicador de medio de pago predeterminado'
};
const es = s => String(s).replaceAll('_',' ').replace(/\bID\b/g,'ID');
function classify(c) {
  const n=c.name.toLowerCase(), t=c.type.toLowerCase();
  if(c.pk || /(^id$|_id$)/i.test(c.name)) return ['Identificador técnico','Clave o referencia técnica; el valor numérico no representa una magnitud.'];
  if(/date|time/.test(n)||/datetime|timestamp|date\b|time\b/.test(t)) return ['Temporal','Fecha u hora registrada por el sistema.'];
  if(/bit\(|bool/.test(t)||/^(status|operation_status|is_default)$/.test(n)) return ['Binaria o lógica','Bandera lógica; la convención numérica o binaria proviene del tipo SQL.'];
  if(/^enum\(/.test(t)) return ['Cualitativa nominal','Categoría limitada a los literales enumerados en el tipo SQL.'];
  if(/decimal|numeric|float|double|real/.test(t)) return ['Cuantitativa continua','Magnitud numérica; la precisión y escala SQL delimitan su representación.'];
  if(/int|serial/.test(t)) return ['Cuantitativa discreta','Cantidad entera, salvo que por nombre o relación sea un identificador.'];
  if(/text/.test(t)) return ['Texto descriptivo','Contenido textual de longitud variable; su estructura interna no está definida por el esquema.'];
  if(/char|varchar/.test(t)) return ['Cualitativa nominal','Texto o código categórico; no se asume un orden estadístico.'];
  return ['No aplicable o indeterminada','El esquema por sí solo no permite establecer una escala estadística con certeza.'];
}
function spanish(c) { return words[c.name] || `${es(c.name)} (significado inferido del nombre técnico)`; }
function example(c) {
  if(c.pk || /_id$/i.test(c.name)) return '123 (ilustrativo; identificador ficticio)';
  if(/date|time/i.test(c.name)) return '2026-10-21 10:30:00 (formato ilustrativo)';
  if(c.type.startsWith('enum(')) return c.type.match(/'([^']+)'/)?.[1] || 'valor enumerado';
  if(c.type.startsWith('bit')) return "b'1' (ilustrativo)";
  if(/decimal/.test(c.type)) return '125.50 (ilustrativo)';
  if(/int/.test(c.type)) return '3 (ilustrativo)';
  if(/email/.test(c.name)) return 'persona@example.invalid';
  if(/password/i.test(c.name)) return '[valor omitido]';
  return '«texto de ejemplo»';
}
const relationsByTable = new Map();
for(const r of model.relations) { const a=relationsByTable.get(r.fromTable)||[]; a.push(r); relationsByTable.set(r.fromTable,a); }
const md=[];
md.push('# Diccionario de datos — db_test_7b','',
  '> Fuente de esquema: `backups/respaldo_21_10_2026_DGC.sql` (MySQL 8.4.9, InnoDB, utf8mb4). El dump se analizó como texto; no se ejecutó ni se consultó una instancia. Este documento describe la definición incluida en ese respaldo, no el estado actual de un servidor. PostgreSQL no aparece en las fuentes inspeccionadas.','',
  '## Cómo leerlo','',
  'El tipo SQL describe almacenamiento; la clasificación describe la naturaleza conceptual del dato. Los ejemplos son ficticios y sirven solo para ilustrar el formato. Las descripciones marcadas como inferidas se deducen del nombre y la estructura, no de una especificación funcional. La ausencia de una FK significa que el dump no declara esa restricción.','',
  `## Resumen del respaldo\n\n- Motor y versión declarados: MySQL 8.4.9\n- Base: \`${model.tables[0]?.schema}\`\n- Tablas: ${model.tables.length}; columnas: ${model.tables.reduce((n,t)=>n+t.columns.length,0)}; FK: ${model.relations.length}\n- Vistas: ${model.objects.views.length}; procedimientos: ${model.objects.procedures.length}; funciones: ${model.objects.functions.length}; triggers: ${model.objects.triggers.length}\n- Conexión activa: no configurada. El dump no acredita que este sea el estado vigente de un servidor.`,
  '', '## Relaciones','', ...model.relations.map(r=>`- \`${r.fromTable}.${r.fromColumns.join(', ')}\` → \`${r.toTable}.${r.toColumns.join(', ')}\` (restricción \`${r.name}\`).`),'',
  '## Diccionario de tablas','');
for(const t of model.tables) {
  const [label,desc]=tableInfo[t.name]||[es(t.name),`Propósito inferido a partir de la estructura de columnas y relaciones de \`${t.name}\`.`];
  const start=lines.findIndex(x=>x.includes(`CREATE TABLE \`${t.name}\``))+1;
  const fks=t.foreignKeys.map(f=>`${f.name}: ${f.columns.join(', ')} → ${f.references.table}.${f.references.columns.join(', ')}`).join('; ')||'No hay claves foráneas declaradas.';
  const indexes=t.indexes.map(i=>`${i.name} (${i.type}): ${i.columns.join(', ')}`).join('; ')||'No se identificaron índices.';
  md.push(`### ${t.name} — ${label}`,'',desc,'',
    `**Motor:** ${t.engine||'no indicado'} · **Clave primaria:** ${t.indexes.find(i=>i.type==='PRIMARY KEY')?.columns.join(', ')||'no declarada'} · **Claves foráneas:** ${fks}`,'',
    `**Índices y restricciones:** ${indexes}. **Auditoría:** ${/log/i.test(t.name)?'es una tabla de bitácora; los eventos dependen de los triggers/procesos que escriban en ella.':'el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.'}`,'',
    `**Ejemplo de uso (ilustrativo):** consultar ${t.name} por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.`,``,`#### Columnas`,``,
    '| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |','|---|---|---|---|---|---|');
  for(const c of t.columns) {
    const [cl,why]=classify(c), keys=[c.pk?'PK':null,c.fk?`FK → ${c.references.table}.${c.references.columns.join(',')}`:null,c.unique?'Única':null].filter(Boolean).join(', ')||'—';
    const comp=c.autoIncrement?`${c.type}; entero generado automáticamente (AUTO_INCREMENT)`:c.type;
    const limit=c.type.match(/\(([^)]+)\)/)?.[1];
    const composition=limit?`${comp}; parámetro SQL ${limit}`:comp;
    const rule=[c.default!==null?`DEFAULT ${c.default}`:null,c.extra||null].filter(Boolean).join('; ')||'sin DEFAULT ni atributo adicional declarado';
    const ruleText=`${keys}; ${rule}${c.comment?`; comentario SQL: ${c.comment}`:''}`;
    const explanation=`${spanish(c)}. Clasificación: **${cl}**. ${why}`;
    md.push(`| \`${c.name}\` | ${explanation.replaceAll('|','\\|')} | \`${composition}\` | ${c.nullable?'Sí':'No'} | ${ruleText.replaceAll('|','\\|')} | ${example(c)} |`);
  }
  md.push('');
}
md.push('## Vistas','',...model.objects.views.map(v=>`- \`${v}\` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.`),'',
  '## Procedimientos almacenados','',...model.objects.procedures.map(p=>`- \`${p}\` — procedimiento declarado en el respaldo. Revise su cuerpo SQL antes de invocarlo para conocer efectos y parámetros.`),'',
  '## Funciones almacenadas','',model.objects.functions.length?model.objects.functions.map(f=>`- \`${f}\``):'No se encontraron funciones almacenadas en este respaldo.','',
  '## Disparadores (triggers)','',...model.objects.triggers.map(x=>{
    const match=x.match(/^(?:trg_)?(.+?)(?:_after_(insert|update|delete)|_(ai|au|ad))$/i);
    const event=({insert:'INSERT',update:'UPDATE',delete:'DELETE',ai:'INSERT',au:'UPDATE',ad:'DELETE'})[match?.[2]||match?.[3]];
    const target=match?.[1]||'la tabla indicada por el nombre';
    return `- \`${x}\` — disparador posterior a ${event||'un evento de escritura'} sobre \`${target}\`; registra el evento en \`tb_logs\`. Los disparadores de actualización comparan valores anteriores y nuevos o registran la actualización según el cuerpo SQL. La bitácora puede ser escrita de forma distinta por evento; consulte el SQL para sus campos exactos.`;
  }),'',
  '## Notas de integridad y alcance','',
  '- Se documentan PK, FK, índices, nulabilidad, valores predeterminados y atributos reconocidos en el DDL del respaldo. No se añaden reglas de negocio no expresadas en SQL.\n- La tabla `tb_logs` no tiene FK declaradas hacia los registros que describe; `table_name` y `record_id` son referencias de auditoría, no integridad referencial.\n- Los valores insertados y sus conteos no se reproducen aquí para evitar convertir datos de respaldo en ejemplos ni presentarlos como vigentes.\n- El respaldo exacto solicitado no está incluido en el commit inspeccionado (archivo sin seguimiento al momento del análisis); por ello el ERD generado no afirma que este dump sea la versión publicada en GitHub.');
fs.writeFileSync(path.join(__dirname,'DICCIONARIO.md'),md.join('\n'),'utf8');

const ids=new Map(model.tables.map(t=>[t.name, t.name.replace(/[^a-zA-Z0-9_-]/g,'_')]));
const domains={tb_buyer_orders:'órdenes',tb_carts:'compras',tb_categories:'catálogo',tb_logs:'auditoría',tb_product_categories:'catálogo',tb_products:'catálogo',tb_users:'cuentas',tbc_payment_methods_types:'pagos',tbd_carts_items:'compras',tbd_order_items:'órdenes',tbd_products_users_providers:'proveedores',tbd_user_payment_methods:'pagos',tbd_users_wishlist_products:'cuentas'};
const entities=model.tables.map(t=>({id:ids.get(t.name),label:t.name,attributes:t.columns.map(c=>({name:c.name,type:c.type,...(c.pk||c.fk||c.unique?{key:[...(c.pk?['pk']:[]),...(c.fk?['fk']:[]),...(c.unique?['uk']:[])]}:{}),...(c.fk?{references:`${ids.get(c.references.table)}.${c.references.columns[t.foreignKeys.find(f=>f.columns.includes(c.name))?.columns.indexOf(c.name)||0]}`}:{})}))}));
// No domain tags: the repository tables serve overlapping roles and the ERD remains purely structural.
const candidate={schema_version:1,diagram_type:'erd',meta:{title:'Diccionario de datos: db_test_7b',locale:'es',output:'diccionario-erd.html',quality_profile:'standard'},entities,relationships:model.relations.map(r=>({id:r.name.replace(/[^a-zA-Z0-9_-]/g,'_'),from:ids.get(r.fromTable),to:ids.get(r.toTable),label:r.name,fromCardinality:'many',toCardinality:'one',...(r.fromColumns.some(c=>{const t=model.tables.find(x=>x.name===r.fromTable);return t.columns.find(y=>y.name===c)?.nullable})?{fromOptional:true}:{})}))};
fs.writeFileSync(path.join(__dirname,'candidate.json'),JSON.stringify(candidate,null,2)+'\n','utf8');
console.log(`Generado desde ${path.basename(dump)}: ${model.tables.length} tablas, ${model.tables.reduce((n,t)=>n+t.columns.length,0)} columnas, ${model.relations.length} FK.`);
