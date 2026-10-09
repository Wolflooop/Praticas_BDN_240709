
USE db_test_7b;

 /* ============================================================
    1. MOSTRAR LAS TABLAS DE LA BASE DE DATOS
    ============================================================ */
SHOW TABLES;


/* ============================================================
   2. VERIFICAR LOS TRIGGERS DE LA BASE DE DATOS
   ============================================================ */
SHOW TRIGGERS FROM db_test_7b;


/* ============================================================
   3. VERIFICAR LA ESTRUCTURA DE LAS TABLAS
   ============================================================ */
DESCRIBE tb_users;
DESCRIBE tb_products;
DESCRIBE tb_categories;
DESCRIBE tb_product_categories;
DESCRIBE tb_logs;


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
   9. CONSULTAR LA TRAZABILIDAD DE PRODUCTOS
   ============================================================ */
SELECT *
FROM vw_trazabilidad_productos;


/* ============================================================
   10. CONSULTAR LOS PROCEDIMIENTOS ALMACENADOS
   ============================================================ */
SHOW PROCEDURE STATUS
WHERE Db = 'db_test_7b';


/* ============================================================
   11. CONSULTAR LA TRAZABILIDAD DE PRODUCTOS Y CATEGORÍAS
   ============================================================ */
SELECT *
FROM vw_trazabilidad_categorizacion_productos;


/* ============================================================
   12. CONSULTAR LA TRAZABILIDAD DE USUARIOS
   ============================================================ */
SELECT *
FROM vw_trazabilidad_usuarios;


/* ============================================================
   13. VERIFICAR LOS MOVIMIENTOS DE PRODUCTOS EN LA BITÁCORA
   ============================================================ */
SELECT *
FROM tb_logs
WHERE table_name = 'tb_products'
ORDER BY operation_date DESC;


/* ============================================================
   14. VERIFICAR LOS MOVIMIENTOS DE RELACIONES PRODUCTO-CATEGORÍA
   ============================================================ */
SELECT *
FROM tb_logs
WHERE table_name = 'tb_product_categories'
ORDER BY operation_date DESC;


/* ============================================================
   15. CONSULTAR TODAS LAS VISTAS DE LA BASE DE DATOS
   ============================================================ */
SHOW FULL TABLES
WHERE Table_type = 'VIEW';


/* ============================================================
   16. CONTABILIZAR LAS RELACIONES ENTRE PRODUCTOS Y CATEGORÍAS
   ============================================================ */
SELECT COUNT(*) AS total_relaciones
FROM tb_product_categories;


/* ============================================================
   17. CONSULTAR EL PROCEDIMIENTO PARA ELIMINAR UN PRODUCTO
   LÓGICAMENTE
   ============================================================ */
SHOW CREATE PROCEDURE sp_soft_delete_product;


/* ============================================================
   18. CONSULTAR EL PROCEDIMIENTO PARA RESTAURAR UN PRODUCTO
   ============================================================ */
SHOW CREATE PROCEDURE sp_restore_product;