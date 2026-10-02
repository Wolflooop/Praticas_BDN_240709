USE db_test_7b;


/* ============================================================
   1. ¿CUÁNTAS TABLAS EXISTEN EN LA BASE DE DATOS db_test_7b?
   ============================================================ */

SHOW TABLES;


/* ============================================================
   2. ¿CUÁNTOS TRIGGERS EXISTEN EN LA BASE DE DATOS db_test_7b?
   ============================================================ */

SHOW TRIGGERS FROM db_test_7b;


/* ============================================================
   3. ¿CUÁNTOS REGISTROS EXISTEN EN LA TABLA tb_users?
   ============================================================ */

SELECT COUNT(*) AS total_registros
FROM tb_users;


/* ============================================================
   4. ¿CUÁNTOS REGISTROS EXISTEN EN LA TABLA BITÁCORA?
   ============================================================ */

SELECT COUNT(*) AS total_registros
FROM tb_logs;


/* ============================================================
   5. CONSULTAR TODAS LAS OPERACIONES REALIZADAS
      EN LA BASE DE DATOS
   ============================================================ */

SELECT *
FROM tb_logs
ORDER BY operation_date ASC;


/* ============================================================
   6. VERIFICAR QUE LOS USUARIOS REMOTOS HAYAN SIDO CREADOS
   ============================================================ */

SELECT
    User,
    Host
FROM mysql.user
WHERE Host = '%'
  AND account_locked = 'N';


/* ============================================================
   7. VERIFICAR LOS ROLES QUE FUERON CREADOS
   ============================================================ */

SELECT
    User,
    Host
FROM mysql.user
WHERE Host = '%'
  AND account_locked = 'Y';


/* ============================================================
   8. VERIFICAR QUÉ USUARIOS TIENEN QUÉ ROLES
   ============================================================ */

SELECT
    TO_USER AS usuario,
    TO_HOST AS host,
    FROM_USER AS rol,
    FROM_HOST AS rol_host
FROM mysql.role_edges
ORDER BY TO_USER, FROM_USER;


/* ============================================================
   9. VERIFICAR LOS PROCEDIMIENTOS ALMACENADOS
      QUE EXISTEN EN LA BASE DE DATOS
   ============================================================ */

SHOW PROCEDURE STATUS
WHERE Db = 'db_test_7b';


/* ============================================================
   10. VERIFICAR LAS FUNCIONES ALMACENADAS
       QUE EXISTEN EN LA BASE DE DATOS
   ============================================================ */

SHOW FUNCTION STATUS
WHERE Db = 'db_test_7b';


/* ============================================================
   11. VERIFICAR LAS VISTAS DE LA BASE DE DATOS
   ============================================================ */

SHOW FULL TABLES
WHERE Table_type = 'VIEW';


/* ============================================================
   12. VERIFICAR LOS PRIVILEGIOS ASIGNADOS A LOS ROLES
   ============================================================ */

SELECT
    GRANTEE,
    TABLE_SCHEMA,
    TABLE_NAME,
    PRIVILEGE_TYPE
FROM information_schema.TABLE_PRIVILEGES
WHERE TABLE_SCHEMA = 'db_test_7b'
ORDER BY GRANTEE, TABLE_NAME, PRIVILEGE_TYPE;


/* ============================================================
   13. VERIFICAR LOS PRIVILEGIOS A NIVEL DE BASE DE DATOS
   ============================================================ */

SELECT
    GRANTEE,
    PRIVILEGE_TYPE
FROM information_schema.SCHEMA_PRIVILEGES
WHERE TABLE_SCHEMA = 'db_test_7b'
ORDER BY GRANTEE, PRIVILEGE_TYPE;


/* ============================================================
   14. CONTABILIZAR LOS PRODUCTOS
   ============================================================ */

SELECT
    COUNT(*) AS total_productos
FROM tb_products;


/* ============================================================
   15. VERIFICAR QUE EXISTAN 5000 PRODUCTOS
   ============================================================ */

SELECT
    COUNT(*) AS total_productos,
    CASE
        WHEN COUNT(*) = 5000 THEN 'CORRECTO'
        ELSE 'REVISAR'
    END AS resultado
FROM tb_products;


/* ============================================================
   16. VISUALIZAR TODOS LOS PRODUCTOS
   ============================================================ */

SELECT *
FROM tb_products;


/* ============================================================
   17. VERIFICAR SKU DUPLICADOS
   ============================================================ */

SELECT
    sku,
    COUNT(*) AS cantidad
FROM tb_products
GROUP BY sku
HAVING COUNT(*) > 1;


/* ============================================================
   18. CONSULTAR LA TRAZABILIDAD DE LOS PRODUCTOS
   ============================================================ */

SELECT *
FROM vw_trazabilidad_productos
ORDER BY operation_date DESC
LIMIT 10;


/* ============================================================
   19. CONSULTAR LA TRAZABILIDAD DE LOS USUARIOS
   ============================================================ */

SELECT *
FROM vw_trazabilidad_usuarios
ORDER BY operation_date ASC;


/* ============================================================
   20. CONTABILIZAR CUÁNTOS PRODUCTOS HAY POR USUARIO
   ============================================================ */

SELECT
    vp.inserted_by AS usuario,
    COUNT(*) AS cantidad_productos
FROM vw_trazabilidad_productos vp
GROUP BY vp.inserted_by
ORDER BY cantidad_productos DESC;