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
   3. ¿CUÁNTOS REGISTROS EXISTEN EN LA TABLA USERS?
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
FROM tb_logs;


/* ============================================================
   6. VERIFICAR QUE LOS USUARIOS REMOTOS HAYAN SIDO CREADOS
   ============================================================ */

SELECT User, Host
FROM mysql.user
WHERE Host = '%'
  AND account_locked = 'N';


/* ============================================================
   7. VERIFICAR LOS ROLES QUE FUERON CREADOS
   ============================================================ */

SELECT User, Host
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
   9. VERIFICAR EL TOTAL DE PROCEDIMIENTOS ALMACENADOS
      QUE EXISTEN EN LA BASE DE DATOS
   ============================================================ */

SHOW PROCEDURE STATUS
WHERE Db = 'db_test_7b';


/* ============================================================
   10. VERIFICACIÓN DE PRODUCTOS
   ============================================================ */

/* Contabilizar los productos */

SELECT COUNT(*)
FROM tb_products;


/* 11 . Visualizar todos los productos */

SELECT *
FROM tb_products;


/*12. Consulta para saber la trazabilidad de los productos */

SELECT * 
FROM vw_trazabilidad_productos
LIMIT 10;
