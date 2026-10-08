USE db_test_7b;

-- 1. ¿Cuántas tablas tenemos?
SHOW TABLES;

-- 2. ¿Cuántos triggers tenemos?
SHOW TRIGGERS FROM db_test_7b;

-- 3. ¿Cuántos registros tiene cada tabla?
SELECT 'tb_products' AS tabla, COUNT(*) AS registros
FROM tb_products
UNION ALL
SELECT 'tb_categories', COUNT(*)
FROM tb_categories
UNION ALL
SELECT 'tb_product_categories', COUNT(*)
FROM tb_product_categories
UNION ALL
SELECT 'tb_logs', COUNT(*)
FROM tb_logs;

-- 4. Contabilizar el total de productos
SELECT COUNT(*) AS total_productos
FROM tb_products;

-- 5. Contabilizar el total de categorías
SELECT COUNT(*) AS total_categorias
FROM tb_categories;

-- 6. Contabilizar las relaciones producto-categoría
SELECT COUNT(*) AS total_relaciones
FROM tb_product_categories;

-- 7. Verificar relaciones producto-categoría sin producto
SELECT COUNT(*) AS relaciones_sin_producto
FROM tb_product_categories pc
LEFT JOIN tb_products p
    ON p.ID = pc.product_Id
WHERE p.ID IS NULL;

-- 8. Verificar relaciones producto-categoría sin categoría
SELECT COUNT(*) AS relaciones_sin_categoria
FROM tb_product_categories pc
LEFT JOIN tb_categories c
    ON c.ID = pc.category_Id
WHERE c.ID IS NULL;

-- 9. Trazabilidad de categorías
SELECT *
FROM vw_trazabilidad_categorias
ORDER BY category_id;

-- 10. Trazabilidad de productos
SELECT *
FROM vw_trazabilidad_productos
ORDER BY id;

-- 11. Trazabilidad de categorizaciones de productos
SELECT *
FROM vw_trazabilidad_categorizacion_productos
ORDER BY product_id, category_id;

-- 12. Total de productos por categoría
SELECT *
FROM vw_total_products_by_category
ORDER BY category_ID IS NULL, category_ID;

-- 13. Productos sin categoría
SELECT COUNT(*) AS productos_sin_categoria
FROM tb_products p
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_product_categories pc
    WHERE pc.product_Id = p.ID
      AND pc.status = b'1'
);

-- 14. Movimientos de categorizaciones registrados en la bitácora
SELECT
    ID,
    table_name,
    record_id,
    table_operation,
    db_user,
    table_description,
    operation_date,
    operation_status
FROM tb_logs
WHERE table_name = 'tb_product_categories'
ORDER BY ID;

-- 15. Resumen de movimientos de categorizaciones
SELECT
    table_operation,
    db_user,
    COUNT(*) AS total
FROM tb_logs
WHERE table_name = 'tb_product_categories'
GROUP BY table_operation, db_user
ORDER BY table_operation, db_user;

-- 16. Verificar las vistas existentes
SHOW FULL TABLES
FROM db_test_7b
WHERE TABLE_TYPE = 'VIEW';