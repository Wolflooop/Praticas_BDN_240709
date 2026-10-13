USE db_test_7b;

/* ============================================================
   1. MOSTRAR LAS TABLAS DE LA BASE DE DATOS
   ============================================================ */
SHOW TABLES;


/* ============================================================
   2. MOSTRAR LOS TRIGGERS DE LA BASE DE DATOS
   ============================================================ */
SHOW TRIGGERS FROM db_test_7b;


/* ============================================================
   3. CONTABILIZAR LOS TRIGGERS POR TABLA
   ============================================================ */
SELECT
    EVENT_OBJECT_TABLE AS tabla,
    COUNT(*) AS total_triggers
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = 'db_test_7b'
GROUP BY EVENT_OBJECT_TABLE
ORDER BY EVENT_OBJECT_TABLE;


/* ============================================================
   4. CONTABILIZAR EL TOTAL DE PRODUCTOS
   ============================================================ */
SELECT COUNT(*) AS total_productos
FROM tb_products;


/* ============================================================
   5. CONTABILIZAR EL TOTAL DE CATEGORÍAS
   ============================================================ */
SELECT COUNT(*) AS total_categorias
FROM tb_categories;


/* ============================================================
   6. VERIFICAR LOS MOVIMIENTOS DE CATEGORÍAS EN LA BITÁCORA
   ============================================================ */
SELECT *
FROM tb_logs
WHERE table_name = 'tb_categories'
ORDER BY operation_date DESC;


/* ============================================================
   7. CONSULTAR LA TRAZABILIDAD DE CATEGORÍAS
   ============================================================ */
SELECT *
FROM vw_trazabilidad_categorias;


/* ============================================================
   8. CONSULTAR EL TOTAL DE PRODUCTOS POR CATEGORÍA
   ============================================================ */
SELECT *
FROM vw_total_products_by_category
ORDER BY category_id IS NULL, category_id;


/* ============================================================
   9. MOSTRAR LAS VISTAS DE LA BASE DE DATOS
   ============================================================ */
SHOW FULL TABLES
FROM db_test_7b
WHERE Table_type = 'VIEW';


/* ============================================================
   10. MOSTRAR LOS PROCEDIMIENTOS ALMACENADOS
   ============================================================ */
SHOW PROCEDURE STATUS
WHERE Db = 'db_test_7b';