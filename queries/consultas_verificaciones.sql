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


/* Visualizar todos los productos */

SELECT *
FROM tb_products;


/* Consulta para saber la trazabilidad de los productos */

SELECT *
FROM vw_trazabilidad_productos
LIMIT 10;


/* ============================================================
   CONSULTA DE TRAZABILIDAD DE USUARIOS Y ROLES
   ============================================================ */

/*
   Verificar qué usuario de la base de datos
   insertó a qué usuario de la plataforma ecommerce,
   agregando el rol del SGBD.
*/

SELECT
    u.nick,
    u.email,
    b.db_user AS inserted_by,
    GROUP_CONCAT(
        DISTINCT re.FROM_USER
        ORDER BY re.FROM_USER
        SEPARATOR ', '
    ) AS roles,
    b.operation_description,
    b.operation_date
FROM tb_users u

JOIN tb_logs b
    ON b.operation_description LIKE CONCAT('%', u.nick, '%')
   AND b.operation_description LIKE CONCAT('%', u.email, '%')

LEFT JOIN mysql.role_edges re
    ON re.TO_USER = SUBSTRING_INDEX(b.db_user, '@', 1)

WHERE b.table_operation = 'Create'
  AND b.table_name = 'tb_users'

GROUP BY
    u.nick,
    u.email,
    b.db_user,
    b.operation_description,
    b.operation_date

ORDER BY b.operation_date ASC;