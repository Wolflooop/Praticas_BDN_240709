/* ============================================================
   CREACIÓN DE USUARIOS
   ============================================================ */

CREATE USER IF NOT EXISTS 'Diego.Garrido'@'%'
IDENTIFIED BY '240709';

CREATE USER IF NOT EXISTS 'marco.ramirez'@'%'
IDENTIFIED BY 'qwerty123';

CREATE USER IF NOT EXISTS 'Rodolfo.cs'@'%'
IDENTIFIED BY '240836';

CREATE USER IF NOT EXISTS 'Victor.Manuel'@'%'
IDENTIFIED BY '240852';

CREATE USER IF NOT EXISTS 'Marianna.Mayte'@'%'
IDENTIFIED BY '240174';

CREATE USER IF NOT EXISTS 'Jeysi.Damari'@'%'
IDENTIFIED BY '240234';

CREATE USER IF NOT EXISTS 'Josue.Oloarte'@'%'
IDENTIFIED BY '240272';

CREATE USER IF NOT EXISTS 'John'@'%'
IDENTIFIED BY '240080';


/* ============================================================
   CREACIÓN DE ROLES
   ============================================================ */

CREATE ROLE IF NOT EXISTS 'super_admin';

CREATE ROLE IF NOT EXISTS 'admin';

CREATE ROLE IF NOT EXISTS 'seller';

CREATE ROLE IF NOT EXISTS 'buyer';

CREATE ROLE IF NOT EXISTS 'support';

CREATE ROLE IF NOT EXISTS 'common_user';

CREATE ROLE IF NOT EXISTS 'user_not_registered';


/* ============================================================
   PRIVILEGIOS DE SUPER ADMIN
   ============================================================ */

GRANT ALL PRIVILEGES
ON *.*
TO 'super_admin'
WITH GRANT OPTION;


/* ============================================================
   PRIVILEGIOS DE ADMIN
   ============================================================ */

GRANT ALL PRIVILEGES
ON db_test_7b.*
TO 'admin';


/* ============================================================
   PRIVILEGIOS DE SELLER
   ============================================================ */

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_7b.tb_products
TO 'seller';


/* ============================================================
   PRIVILEGIOS DE BUYER
   ============================================================ */

GRANT SELECT
ON db_test_7b.tb_products
TO 'buyer';


/* ============================================================
   PRIVILEGIOS DE SUPPORT
   ============================================================ */



GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_users
TO 'support';


/* ============================================================
   PRIVILEGIOS DE COMMON_USER
   ============================================================ */

GRANT SELECT
ON db_test_7b.*
TO 'common_user';


/* ============================================================
   PRIVILEGIOS DE USER_NOT_REGISTERED
   ============================================================ */

/*
   Usuario no registrado:
   solamente puede consultar productos.
*/

GRANT SELECT
ON db_test_7b.tb_products
TO 'user_not_registered';


/* ============================================================
   ASIGNACIÓN DE ROLES A LOS USUARIOS
   ============================================================ */

/* SUPER ADMIN — DIEGO */

GRANT 'super_admin'
TO 'Diego.Garrido'@'%';


/* ADMIN — MARCO */

GRANT 'admin'
TO 'marco.ramirez'@'%';


/* SELLER — MARIANNA */

GRANT 'seller'
TO 'Marianna.Mayte'@'%';


/* SELLER — JEYSI */

GRANT 'seller'
TO 'Jeysi.Damari'@'%';


/* BUYER — RODOLFO */

GRANT 'buyer'
TO 'Rodolfo.cs'@'%';


/* SUPPORT — VICTOR */

GRANT 'support'
TO 'Victor.Manuel'@'%';


/* COMMON USER — JOSUÉ */

GRANT 'common_user'
TO 'Josue.Oloarte'@'%';


/* USER NOT REGISTERED — JOHN */

GRANT 'user_not_registered'
TO 'John'@'%';


/* ============================================================
   ESTABLECER ROLES PREDETERMINADOS
   ============================================================ */

/* DIEGO — SUPER ADMIN */

SET DEFAULT ROLE 'super_admin'
TO 'Diego.Garrido'@'%';


/* MARCO — ADMIN */

SET DEFAULT ROLE 'admin'
TO 'marco.ramirez'@'%';


/* MARIANNA — SELLER */

SET DEFAULT ROLE 'seller'
TO 'Marianna.Mayte'@'%';


/* JEYSI — SELLER */

SET DEFAULT ROLE 'seller'
TO 'Jeysi.Damari'@'%';


/* RODOLFO — BUYER */

SET DEFAULT ROLE 'buyer'
TO 'Rodolfo.cs'@'%';


/* VICTOR — SUPPORT */

SET DEFAULT ROLE 'support'
TO 'Victor.Manuel'@'%';


/* JOSUÉ — COMMON USER */

SET DEFAULT ROLE 'common_user'
TO 'Josue.Oloarte'@'%';


/* JOHN — USER NOT REGISTERED */

SET DEFAULT ROLE 'user_not_registered'
TO 'John'@'%';


/* ============================================================
   CICLO DE INGRESO DE PRODUCTOS
   ============================================================ */

/*
   El ciclo de ingreso se maneja entre los participantes
   que tienen el rol seller:

   MARIANNA → JEYSI → MARIANNA

   Relación cruzada:

   MARIANNA → DIEGO → JEYSI

   Diego conserva únicamente el rol super_admin.
   Diego NO tiene el rol seller.
*/


/* ============================================================
   VERIFICACIÓN DE PRIVILEGIOS DE LOS USUARIOS
   ============================================================ */

SHOW GRANTS FOR 'Diego.Garrido'@'%';

SHOW GRANTS FOR 'marco.ramirez'@'%';

SHOW GRANTS FOR 'Marianna.Mayte'@'%';

SHOW GRANTS FOR 'Jeysi.Damari'@'%';

SHOW GRANTS FOR 'Josue.Oloarte'@'%';

SHOW GRANTS FOR 'Rodolfo.cs'@'%';

SHOW GRANTS FOR 'Victor.Manuel'@'%';

SHOW GRANTS FOR 'John'@'%';


/* ============================================================
   VERIFICACIÓN DE PRIVILEGIOS DE LOS ROLES
   ============================================================ */

SHOW GRANTS FOR 'super_admin';

SHOW GRANTS FOR 'admin';

SHOW GRANTS FOR 'seller';

SHOW GRANTS FOR 'buyer';

SHOW GRANTS FOR 'support';

SHOW GRANTS FOR 'common_user';

SHOW GRANTS FOR 'user_not_registered';


/* ============================================================
   VERIFICACIÓN DE ROLES ASIGNADOS
   ============================================================ */

SELECT
    FROM_USER,
    TO_USER,
    DEFAULT_ROLE
FROM mysql.role_edges;


/* ============================================================
   MENSAJE DE CONFIRMACIÓN
   ============================================================ */

SELECT
    'Los usuarios, roles y privilegios han sido creados correctamente'
    AS mensaje;