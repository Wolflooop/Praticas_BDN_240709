# Diccionario de datos — db_test_7b

> Fuente de esquema: `backups/respaldo_21_10_2026_DGC.sql` (MySQL 8.4.9, InnoDB, utf8mb4). El dump se analizó como texto; no se ejecutó ni se consultó una instancia. Este documento describe la definición incluida en ese respaldo, no el estado actual de un servidor. PostgreSQL no aparece en las fuentes inspeccionadas.

## Cómo leerlo

El tipo SQL describe almacenamiento; la clasificación describe la naturaleza conceptual del dato. Los ejemplos son ficticios y sirven solo para ilustrar el formato. Las descripciones marcadas como inferidas se deducen del nombre y la estructura, no de una especificación funcional. La ausencia de una FK significa que el dump no declara esa restricción.

## Resumen del respaldo

- Motor y versión declarados: MySQL 8.4.9
- Base: `db_test_7b`
- Tablas: 13; columnas: 93; FK: 15
- Vistas: 13; procedimientos: 2; funciones: 0; triggers: 36
- El DDL no declara restricciones CHECK.
- Conexión activa: no configurada. El dump no acredita que este sea el estado vigente de un servidor.

## Relaciones

- `tb_buyer_orders.seller_ID` → `tb_users.ID` (restricción `tb_buyer_orders_ibfk_1`; cardinalidad N:1; opcionalidad en origen: no).
- `tb_carts.user_ID` → `tb_users.ID` (restricción `tb_carts_ibfk_1`; cardinalidad 1:1; opcionalidad en origen: no).
- `tb_categories.sup_id_category` → `tb_categories.ID` (restricción `fk_superior_category`; cardinalidad N:1; opcionalidad en origen: sí).
- `tb_product_categories.category_Id` → `tb_categories.ID` (restricción `fk_pc_category`; cardinalidad N:1; opcionalidad en origen: no).
- `tb_product_categories.product_Id` → `tb_products.ID` (restricción `fk_pc_product`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_carts_items.cart_ID` → `tb_carts.ID` (restricción `fk_cart_items_cart`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_carts_items.provider_ID, product_ID` → `tbd_products_users_providers.user_ID, product_ID` (restricción `fk_cart_items_provider_product`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_order_items.seller_order_ID` → `tb_buyer_orders.ID` (restricción `tbd_order_items_ibfk_1`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_order_items.product_ID, provider_ID` → `tbd_products_users_providers.product_ID, user_ID` (restricción `tbd_order_items_ibfk_2`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_products_users_providers.product_ID` → `tb_products.ID` (restricción `fk_products2`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_products_users_providers.user_ID` → `tb_users.ID` (restricción `fk_user1`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_user_payment_methods.user_ID` → `tb_users.ID` (restricción `tbd_user_payment_methods_ibfk_1`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_user_payment_methods.payment_method_type_ID` → `tbc_payment_methods_types.ID` (restricción `tbd_user_payment_methods_ibfk_2`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_users_wishlist_products.product_ID` → `tb_products.ID` (restricción `fk_products3`; cardinalidad N:1; opcionalidad en origen: no).
- `tbd_users_wishlist_products.user_ID` → `tb_users.ID` (restricción `fk_user2`; cardinalidad N:1; opcionalidad en origen: no).

## Diccionario de tablas

### tb_buyer_orders — Órdenes de compra al vendedor

Registra la cabecera de cada orden generada para un vendedor. Conserva importes agregados, estado de cumplimiento y marcas de tiempo; las partidas detalladas se relacionan mediante tbd_order_items.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** tb_buyer_orders_ibfk_1: seller_ID → tb_users.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; seller_ID (INDEX): seller_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tb_buyer_orders por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `seller_ID` | identificador del vendedor. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | FK → tb_users.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `subtotal` | importe subtotal. Clasificación: **Cuantitativa continua**. Magnitud numérica; la precisión y escala SQL delimitan su representación. | `decimal(12,2); parámetro SQL 12,2` | No | —; DEFAULT '0.00'; NOT NULL DEFAULT '0.00' | 125.50 (ilustrativo) |
| `shipping_cost` | costo de envío. Clasificación: **Cuantitativa continua**. Magnitud numérica; la precisión y escala SQL delimitan su representación. | `decimal(12,2); parámetro SQL 12,2` | No | —; DEFAULT '0.00'; NOT NULL DEFAULT '0.00' | 125.50 (ilustrativo) |
| `fulfillment_status` | estado de cumplimiento de la orden. Clasificación: **Cualitativa nominal**. Categoría limitada a los literales enumerados en el tipo SQL. | `enum('pending','accepted','preparing','sent','delivered','canceled','returned'); parámetro SQL 'pending','accepted','preparing','sent','delivered','canceled','returned'` | No | —; DEFAULT 'Pending'; NOT NULL DEFAULT 'Pending' | pending |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | Sí | —; DEFAULT NULL; DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tb_carts — Carritos de compra

Representa el carrito asociado a una cuenta. Su identificador permite agrupar las partidas del carrito y su estado y fechas permiten conocer su vigencia y trazabilidad.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** tb_carts_ibfk_1: user_ID → tb_users.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; uk_cart_user (UNIQUE): user_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tb_carts por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `user_ID` | identificador del usuario. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | FK → tb_users.ID, Única; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | Sí | —; DEFAULT b'1'; DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | Sí | —; DEFAULT NULL; DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tb_categories — Categorías de productos

Catálogo jerárquico para clasificar productos. La referencia opcional a otra categoría permite expresar una categoría superior; tb_product_categories materializa la asignación de productos.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** fk_superior_category: sup_id_category → tb_categories.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; name (UNIQUE): name; fk_superior_category (INDEX): sup_id_category. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tb_categories por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `name` | nombre. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(120); parámetro SQL 120` | No | Única; NOT NULL | «texto de ejemplo» |
| `description` | descripción. Clasificación: **Texto descriptivo**. Contenido textual de longitud variable; su estructura interna no está definida por el esquema. | `text` | Sí | —; sin DEFAULT ni atributo adicional declarado | «texto de ejemplo» |
| `sup_id_category` | identificador de la categoría superior. Clasificación: **Cuantitativa discreta**. Cantidad entera, salvo que por nombre o relación sea un identificador. | `int unsigned` | Sí | FK → tb_categories.ID; DEFAULT NULL; DEFAULT NULL | 3 (ilustrativo) |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; NOT NULL ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tb_logs — Bitácora de operaciones

Almacena eventos de auditoría generados por las operaciones observadas en el respaldo. Conserva tabla y registro afectados, operación, usuario de base de datos, descripción, fecha y estado. No tiene FK declaradas hacia las tablas auditadas.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** No hay claves foráneas declaradas.

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; idx_logs_table_record_operation (INDEX): table_name, record_id, table_operation; idx_logs_table_operation_date (INDEX): table_name, table_operation, operation_date; idx_logs_db_user_date (INDEX): db_user, operation_date. **Auditoría:** es una tabla de bitácora; los eventos dependen de los triggers/procesos que escriban en ella.

**Ejemplo de uso (ilustrativo):** consultar tb_logs por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `table_name` | nombre técnico de la tabla afectada. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(80); parámetro SQL 80` | No | —; NOT NULL | «texto de ejemplo» |
| `record_id` | identificador del registro afectado. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | Sí | —; DEFAULT NULL; DEFAULT NULL | 123 (ilustrativo; identificador ficticio) |
| `table_operation` | operación registrada sobre la tabla. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `enum('create','read','update','delete'); parámetro SQL 'create','read','update','delete'` | Sí | —; DEFAULT NULL; DEFAULT NULL | create |
| `db_user` | usuario de base de datos que ejecutó la operación. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(80); parámetro SQL 80` | No | —; NOT NULL | «texto de ejemplo» |
| `table_description` | descripción de la operación registrada. Clasificación: **Texto descriptivo**. Contenido textual de longitud variable; su estructura interna no está definida por el esquema. | `text` | No | —; NOT NULL | «texto de ejemplo» |
| `operation_date` | fecha y hora de la operación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `operation_status` | indicador de resultado de la operación. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | Sí | —; DEFAULT b'1'; DEFAULT b'1' | b'1' (ilustrativo) |

### tb_product_categories — Asignación de productos a categorías

Tabla asociativa que enlaza productos y categorías. La clave primaria compuesta evita repetir la misma pareja y sus FK conservan la integridad referencial.

**Motor:** InnoDB · **Clave primaria:** product_Id, category_Id · **Claves foráneas:** fk_pc_category: category_Id → tb_categories.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente; fk_pc_product: product_Id → tb_products.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): product_Id, category_Id; fk_pc_category (INDEX): category_Id. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tb_product_categories por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `product_Id` | product Id (significado inferido del nombre técnico). Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | PK, FK → tb_products.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `category_Id` | identificador de la categoría. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | PK, FK → tb_categories.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tb_products — Productos

Catálogo central de productos con SKU, nombre, descripción, precio, existencias y estado. Otras entidades como categorías, partidas, proveedores y listas de deseos hacen referencia a sus registros.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** No hay claves foráneas declaradas.

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; SKU (UNIQUE): SKU. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tb_products por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `SKU` | código SKU del producto. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(50); parámetro SQL 50` | No | Única; NOT NULL | «texto de ejemplo» |
| `name` | nombre. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(250); parámetro SQL 250` | No | —; NOT NULL | «texto de ejemplo» |
| `description` | descripción. Clasificación: **Texto descriptivo**. Contenido textual de longitud variable; su estructura interna no está definida por el esquema. | `text` | Sí | —; sin DEFAULT ni atributo adicional declarado | «texto de ejemplo» |
| `current_price` | precio vigente del producto. Clasificación: **Cuantitativa continua**. Magnitud numérica; la precisión y escala SQL delimitan su representación. | `decimal(10,2); parámetro SQL 10,2` | No | —; DEFAULT '0.00'; NOT NULL DEFAULT '0.00' | 125.50 (ilustrativo) |
| `current_stock` | existencias actuales del producto. Clasificación: **Cuantitativa discreta**. Cantidad entera, salvo que por nombre o relación sea un identificador. | `int unsigned` | No | —; DEFAULT '0'; NOT NULL DEFAULT '0' | 3 (ilustrativo) |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | Sí | —; DEFAULT b'1'; DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tb_users — Usuarios

Guarda las cuentas de usuario, sus datos de acceso y marcas de creación, actualización e inicio de sesión. El esquema impone unicidad al correo y al apodo; no documenta aquí el proceso de autenticación.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** No hay claves foráneas declaradas.

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; email (UNIQUE): email; nick (UNIQUE): nick. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tb_users por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `email` | correo electrónico. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(100); parámetro SQL 100` | No | Única; NOT NULL | persona@example.invalid |
| `nick` | apodo de usuario. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(50); parámetro SQL 50` | No | Única; NOT NULL | «texto de ejemplo» |
| `password` | credencial de acceso almacenada. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(255); parámetro SQL 255` | No | —; NOT NULL | [valor omitido] |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | Sí | —; DEFAULT NULL; DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_login` | fecha y hora del último acceso. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | Sí | —; DEFAULT NULL; DEFAULT NULL | «texto de ejemplo» |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | Sí | —; DEFAULT b'1'; DEFAULT b'1' | b'1' (ilustrativo) |

### tbc_payment_methods_types — Tipos de medios de pago

Catálogo de tipos de medio de pago identificados por código y descripción. Las formas de pago de usuario referencian este catálogo.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** No hay claves foráneas declaradas.

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; code_UNIQUE (UNIQUE): code. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tbc_payment_methods_types por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `code` | código del catálogo. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(30); parámetro SQL 30` | No | Única; NOT NULL | «texto de ejemplo» |
| `description` | descripción. Clasificación: **Texto descriptivo**. Contenido textual de longitud variable; su estructura interna no está definida por el esquema. | `text` | No | —; NOT NULL | «texto de ejemplo» |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | Sí | —; DEFAULT NULL; DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tbd_carts_items — Partidas de carrito

Relaciona un carrito con un producto y un proveedor, incluyendo la cantidad solicitada y la fecha de incorporación. Permite consultar el contenido detallado del carrito.

**Motor:** InnoDB · **Clave primaria:** cart_ID, provider_ID, product_ID · **Claves foráneas:** fk_cart_items_cart: cart_ID → tb_carts.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente; fk_cart_items_provider_product: provider_ID, product_ID → tbd_products_users_providers.user_ID, product_ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): cart_ID, provider_ID, product_ID; idx_cart_items_provider_product (INDEX): provider_ID, product_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tbd_carts_items por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `cart_ID` | identificador del carrito. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | PK, FK → tb_carts.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `provider_ID` | identificador del proveedor. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | PK, FK → tbd_products_users_providers.user_ID,product_ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `product_ID` | identificador del producto. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | PK, FK → tbd_products_users_providers.user_ID,product_ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `quantity` | cantidad de unidades. Clasificación: **Cuantitativa discreta**. Cantidad entera, salvo que por nombre o relación sea un identificador. | `int unsigned` | No | —; DEFAULT '1'; NOT NULL DEFAULT '1' | 3 (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tbd_order_items — Partidas de orden

Detalle de los productos incluidos en una orden de vendedor. Conserva nombre de producto y precio unitario como datos de la partida, además de cantidad y subtotal.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** tbd_order_items_ibfk_1: seller_order_ID → tb_buyer_orders.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente; tbd_order_items_ibfk_2: product_ID, provider_ID → tbd_products_users_providers.product_ID, user_ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; seller_order_ID (INDEX): seller_order_ID; product_ID_provider_ID (INDEX): product_ID, provider_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tbd_order_items por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `seller_order_ID` | identificador de la orden del vendedor. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | FK → tb_buyer_orders.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `product_ID` | identificador del producto. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | FK → tbd_products_users_providers.product_ID,user_ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `provider_ID` | identificador del proveedor. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | FK → tbd_products_users_providers.product_ID,user_ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `product_name` | nombre del producto conservado en la partida. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(255); parámetro SQL 255` | No | —; NOT NULL | «texto de ejemplo» |
| `quantity` | cantidad de unidades. Clasificación: **Cuantitativa discreta**. Cantidad entera, salvo que por nombre o relación sea un identificador. | `int unsigned` | No | —; NOT NULL | 3 (ilustrativo) |
| `unit_price` | precio unitario aplicado. Clasificación: **Cuantitativa continua**. Magnitud numérica; la precisión y escala SQL delimitan su representación. | `decimal(12,2); parámetro SQL 12,2` | No | —; NOT NULL | 125.50 (ilustrativo) |
| `subtotal` | importe subtotal. Clasificación: **Cuantitativa continua**. Magnitud numérica; la precisión y escala SQL delimitan su representación. | `decimal(12,2); parámetro SQL 12,2` | Sí | —; GENERATED ALWAYS AS ((`quantity` * `unit_price`)) STORED | 125.50 (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tbd_products_users_providers — Relación de productos, usuarios y proveedores

Registra la asociación entre un producto y un usuario proveedor, junto con el tipo de titularidad, estado y fechas de disponibilidad y seguimiento.

**Motor:** InnoDB · **Clave primaria:** user_ID, product_ID · **Claves foráneas:** fk_products2: product_ID → tb_products.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente; fk_user1: user_ID → tb_users.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): user_ID, product_ID; uidx_product_user (UNIQUE): product_ID, user_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tbd_products_users_providers por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `user_ID` | identificador del usuario. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | PK, FK → tb_users.ID, Única; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `product_ID` | identificador del producto. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | PK, FK → tb_products.ID, Única; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `type_ownership` | tipo de titularidad del producto. Clasificación: **Cualitativa nominal**. Categoría limitada a los literales enumerados en el tipo SQL. | `enum('owner','reseller','distributor'); parámetro SQL 'owner','reseller','distributor'` | Sí | —; DEFAULT NULL; DEFAULT NULL | owner |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `avalaible_date` | fecha y hora de disponibilidad (nombre según el esquema). Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; NOT NULL | 2026-10-21 10:30:00 (formato ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_date` | fecha y hora del último evento registrado. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tbd_user_payment_methods — Medios de pago de usuario

Asocia una cuenta de usuario con un tipo de medio de pago y conserva referencias y etiquetas del proveedor, últimos cuatro dígitos, indicador predeterminado y estado. El esquema no incluye el número completo de tarjeta.

**Motor:** InnoDB · **Clave primaria:** ID · **Claves foráneas:** tbd_user_payment_methods_ibfk_1: user_ID → tb_users.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente; tbd_user_payment_methods_ibfk_2: payment_method_type_ID → tbc_payment_methods_types.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): ID; uk_provider_method (UNIQUE): provider, provider_method_ref; user_ID (INDEX): user_ID; payment_method_type_ID (INDEX): payment_method_type_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tbd_user_payment_methods por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `ID` | identificador interno del registro. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `bigint unsigned; entero generado automáticamente (AUTO_INCREMENT)` | No | PK; NOT NULL AUTO_INCREMENT | 123 (ilustrativo; identificador ficticio) |
| `user_ID` | identificador del usuario. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | FK → tb_users.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `payment_method_type_ID` | identificador del tipo de medio de pago. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | FK → tbc_payment_methods_types.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `provider` | proveedor del medio de pago. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(60); parámetro SQL 60` | No | Única; NOT NULL | «texto de ejemplo» |
| `provider_method_ref` | referencia del medio asignada por el proveedor. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(255); parámetro SQL 255` | No | Única; NOT NULL | «texto de ejemplo» |
| `label` | etiqueta descriptiva del medio de pago. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `varchar(100); parámetro SQL 100` | Sí | —; DEFAULT NULL; DEFAULT NULL | «texto de ejemplo» |
| `last_four` | últimos cuatro dígitos identificadores del medio. Clasificación: **Cualitativa nominal**. Texto o código categórico; no se asume un orden estadístico. | `char(4); parámetro SQL 4` | Sí | —; DEFAULT NULL; DEFAULT NULL | 0427 (ficticio; cuatro dígitos) |
| `is_default` | indicador de medio de pago predeterminado. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `tinyint(1); parámetro SQL 1` | No | —; DEFAULT '0'; NOT NULL DEFAULT '0' | 3 (ilustrativo) |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | Sí | —; DEFAULT NULL; DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

### tbd_users_wishlist_products — Productos en lista de deseos

Tabla asociativa que registra qué productos agregó cada usuario a su lista de deseos, junto con estado y fechas de creación y actualización.

**Motor:** InnoDB · **Clave primaria:** user_ID, product_ID · **Claves foráneas:** fk_products3: product_ID → tb_products.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente; fk_user2: user_ID → tb_users.ID; ON DELETE no especificado explícitamente; ON UPDATE no especificado explícitamente

**Índices y restricciones:** PRIMARY (PRIMARY KEY): user_ID, product_ID; fk_products3 (INDEX): product_ID. **Auditoría:** el esquema incluye campos de estado y/o fechas de ciclo de vida cuando se muestran abajo; la trazabilidad adicional depende de los triggers listados en Objetos relacionados.

**Ejemplo de uso (ilustrativo):** consultar tbd_users_wishlist_products por su clave primaria o enlazarla mediante las FK indicadas. No se incluyen datos reales.

#### Columnas

| Columna | Descripción y clasificación | Tipo / composición | NULL | Claves y reglas del esquema | Ejemplo |
|---|---|---|---|---|---|
| `user_ID` | identificador del usuario. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int` | No | PK, FK → tb_users.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `product_ID` | identificador del producto. Clasificación: **Identificador técnico**. Clave o referencia técnica; el valor numérico no representa una magnitud. | `int unsigned` | No | PK, FK → tb_products.ID; NOT NULL | 123 (ilustrativo; identificador ficticio) |
| `status` | indicador de estado del registro. Clasificación: **Binaria o lógica**. Bandera lógica; la convención numérica o binaria proviene del tipo SQL. | `bit(1); parámetro SQL 1` | No | —; DEFAULT b'1'; NOT NULL DEFAULT b'1' | b'1' (ilustrativo) |
| `creation_date` | fecha y hora de creación. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |
| `last_update` | fecha y hora de la última actualización. Clasificación: **Temporal**. Fecha u hora registrada por el sistema. | `datetime` | No | —; DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP; NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 2026-10-21 10:30:00 (formato ilustrativo) |

## Vistas

- `vw_total_products_by_category` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_carritos` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_carts_items` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_categorias` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_categorizacion_productos` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_ordenes` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_order_items` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_productos` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_productos_proveedores` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_usuario_metodos_pago` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_usuarios` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_wishlist` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.
- `vw_trazabilidad_wishlist_carritos` — vista declarada en el respaldo; su definición SQL puede consultarse en el archivo fuente.

## Procedimientos almacenados

- `sp_restore_product` — procedimiento declarado en el respaldo. Revise su cuerpo SQL antes de invocarlo para conocer efectos y parámetros.
- `sp_soft_delete_product` — procedimiento declarado en el respaldo. Revise su cuerpo SQL antes de invocarlo para conocer efectos y parámetros.

## Funciones almacenadas

No se encontraron funciones almacenadas en este respaldo.

## Disparadores (triggers)

- `trg_tb_buyer_orders_ai` — se ejecuta AFTER INSERT sobre `tb_buyer_orders`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_buyer_orders_au` — se ejecuta AFTER UPDATE sobre `tb_buyer_orders`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tb_buyer_orders_ad` — se ejecuta AFTER DELETE sobre `tb_buyer_orders`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_carts_ai` — se ejecuta AFTER INSERT sobre `tb_carts`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_carts_au` — se ejecuta AFTER UPDATE sobre `tb_carts`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tb_carts_ad` — se ejecuta AFTER DELETE sobre `tb_carts`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbc_categories_after_insert` — se ejecuta AFTER INSERT sobre `tb_categories`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbc_categories_after_update` — se ejecuta AFTER UPDATE sobre `tb_categories`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbc_categories_after_delete` — se ejecuta AFTER DELETE sobre `tb_categories`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_product_categories_after_insert` — se ejecuta AFTER INSERT sobre `tb_product_categories`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_product_categories_after_update` — se ejecuta AFTER UPDATE sobre `tb_product_categories`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tb_product_categories_after_delete` — se ejecuta AFTER DELETE sobre `tb_product_categories`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_products_after_insert` — se ejecuta AFTER INSERT sobre `tb_products`; inserta un registro en `tb_logs` para auditoría.
- `trg_tb_products_after_update` — se ejecuta AFTER UPDATE sobre `tb_products`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tb_products_after_delete` — se ejecuta AFTER DELETE sobre `tb_products`; inserta un registro en `tb_logs` para auditoría.
- `trg_users_after_insert` — se ejecuta AFTER INSERT sobre `tb_users`; inserta un registro en `tb_logs` para auditoría.
- `trg_users_after_update` — se ejecuta AFTER UPDATE sobre `tb_users`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_users_after_delete` — se ejecuta AFTER DELETE sobre `tb_users`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbc_payment_methods_types_ai` — se ejecuta AFTER INSERT sobre `tbc_payment_methods_types`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbc_payment_methods_types_au` — se ejecuta AFTER UPDATE sobre `tbc_payment_methods_types`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbc_payment_methods_types_ad` — se ejecuta AFTER DELETE sobre `tbc_payment_methods_types`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_carts_items_ai` — se ejecuta AFTER INSERT sobre `tbd_carts_items`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_carts_items_au` — se ejecuta AFTER UPDATE sobre `tbd_carts_items`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbd_carts_items_ad` — se ejecuta AFTER DELETE sobre `tbd_carts_items`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_order_items_ai` — se ejecuta AFTER INSERT sobre `tbd_order_items`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_order_items_au` — se ejecuta AFTER UPDATE sobre `tbd_order_items`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbd_order_items_ad` — se ejecuta AFTER DELETE sobre `tbd_order_items`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_products_users_providers_ai` — se ejecuta AFTER INSERT sobre `tbd_products_users_providers`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_products_users_providers_au` — se ejecuta AFTER UPDATE sobre `tbd_products_users_providers`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbd_products_users_providers_ad` — se ejecuta AFTER DELETE sobre `tbd_products_users_providers`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_user_payment_methods_ai` — se ejecuta AFTER INSERT sobre `tbd_user_payment_methods`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_user_payment_methods_au` — se ejecuta AFTER UPDATE sobre `tbd_user_payment_methods`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbd_user_payment_methods_ad` — se ejecuta AFTER DELETE sobre `tbd_user_payment_methods`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_users_wishlist_products_ai` — se ejecuta AFTER INSERT sobre `tbd_users_wishlist_products`; inserta un registro en `tb_logs` para auditoría.
- `trg_tbd_users_wishlist_products_au` — se ejecuta AFTER UPDATE sobre `tbd_users_wishlist_products`; inserta un registro en `tb_logs` para auditoría. El cuerpo compara o registra los valores modificados según la tabla.
- `trg_tbd_users_wishlist_products_ad` — se ejecuta AFTER DELETE sobre `tbd_users_wishlist_products`; inserta un registro en `tb_logs` para auditoría.

## Notas de integridad y alcance

- Se documentan PK, FK, índices, nulabilidad, valores predeterminados y atributos reconocidos en el DDL del respaldo. No se añaden reglas de negocio no expresadas en SQL.
- La tabla `tb_logs` no tiene FK declaradas hacia los registros que describe; `table_name` y `record_id` son referencias de auditoría, no integridad referencial.
- Los valores insertados y sus conteos no se reproducen aquí para evitar convertir datos de respaldo en ejemplos ni presentarlos como vigentes.
- El respaldo exacto solicitado no está incluido en el commit inspeccionado (archivo sin seguimiento al momento del análisis); por ello el ERD generado no afirma que este dump sea la versión publicada en GitHub.