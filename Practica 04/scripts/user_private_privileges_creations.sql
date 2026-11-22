
USE db_test_7b;

-- =========================================================
-- 1. CREACION DE USUARIOS
-- =========================================================

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

CREATE USER IF NOT EXISTS 'app_web'@'%'
IDENTIFIED BY 'web123';

CREATE USER IF NOT EXISTS 'app_mobile'@'%'
IDENTIFIED BY 'mobile890';


-- =========================================================
-- 2. CREACION DE ROLES
-- =========================================================

CREATE ROLE IF NOT EXISTS 'super_admin'@'%';
CREATE ROLE IF NOT EXISTS 'admin'@'%';
CREATE ROLE IF NOT EXISTS 'seller'@'%';
CREATE ROLE IF NOT EXISTS 'buyer'@'%';
CREATE ROLE IF NOT EXISTS 'support'@'%';
CREATE ROLE IF NOT EXISTS 'common_user'@'%';
CREATE ROLE IF NOT EXISTS 'user_not_registered'@'%';


-- =========================================================
-- 3. ASIGNACION DE PRIVILEGIOS A LOS ROLES
-- =========================================================

-- SUPER ADMIN
GRANT ALL PRIVILEGES
ON *.*
TO 'super_admin'@'%'
WITH GRANT OPTION;


-- ADMIN
GRANT ALL PRIVILEGES
ON db_test_7b.*
TO 'admin'@'%';


-- SELLER
GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_7b.tb_products
TO 'seller'@'%';


-- BUYER
GRANT SELECT
ON db_test_7b.tb_products
TO 'buyer'@'%';


-- SUPPORT
GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_users
TO 'support'@'%';

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_people
TO 'support'@'%';

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_user_addresses
TO 'support'@'%';

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tbc_categories
TO 'support'@'%';

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tbd_products_categories
TO 'support'@'%';


-- COMMON USER
GRANT SELECT
ON db_test_7b.*
TO 'common_user'@'%';


-- USER NOT REGISTERED
GRANT SELECT
ON db_test_7b.tb_products
TO 'user_not_registered'@'%';


-- =========================================================
-- 4. MODIFICACION DE PRIVILEGIOS EXECUTE
-- =========================================================

-- MODIFICADO:
-- Se retira EXECUTE del rol user_not_registered.
-- Este permiso no debe heredarse por todos los usuarios
-- que tengan asignado dicho rol.

REVOKE EXECUTE
ON PROCEDURE db_test_7b.sp_register_new_user
FROM 'user_not_registered'@'%';


-- MODIFICADO:
-- El permiso EXECUTE se concede directamente a las cuentas
-- de la aplicacion web y movil.

GRANT EXECUTE
ON PROCEDURE db_test_7b.sp_register_new_user
TO 'app_web'@'%';

GRANT EXECUTE
ON PROCEDURE db_test_7b.sp_register_new_user
TO 'app_mobile'@'%';


-- =========================================================
-- 5. ASIGNACION DE ROLES A LOS USUARIOS
-- =========================================================

GRANT 'super_admin'@'%'
TO 'Diego.Garrido'@'%';

GRANT 'admin'@'%'
TO 'marco.ramirez'@'%';

GRANT 'seller'@'%'
TO 'Marianna.Mayte'@'%';

GRANT 'seller'@'%'
TO 'Jeysi.Damari'@'%';

GRANT 'buyer'@'%'
TO 'Rodolfo.cs'@'%';

GRANT 'support'@'%'
TO 'Victor.Manuel'@'%';

GRANT 'common_user'@'%'
TO 'Josue.Oloarte'@'%';

GRANT 'user_not_registered'@'%'
TO 'John'@'%';


-- MODIFICADO:
-- Las cuentas de aplicacion reciben tres roles.
-- Esto permite manejar las transiciones de permisos
-- durante el registro, el carrito y el proceso de compra.

GRANT 'user_not_registered'@'%'
TO 'app_web'@'%';

GRANT 'common_user'@'%'
TO 'app_web'@'%';

GRANT 'buyer'@'%'
TO 'app_web'@'%';


GRANT 'user_not_registered'@'%'
TO 'app_mobile'@'%';

GRANT 'common_user'@'%'
TO 'app_mobile'@'%';

GRANT 'buyer'@'%'
TO 'app_mobile'@'%';


-- =========================================================
-- 6. CONFIGURACION DE ROLES PREDETERMINADOS
-- =========================================================

SET DEFAULT ROLE 'super_admin'@'%'
TO 'Diego.Garrido'@'%';

SET DEFAULT ROLE 'admin'@'%'
TO 'marco.ramirez'@'%';

SET DEFAULT ROLE 'seller'@'%'
TO 'Marianna.Mayte'@'%';

SET DEFAULT ROLE 'seller'@'%'
TO 'Jeysi.Damari'@'%';

SET DEFAULT ROLE 'buyer'@'%'
TO 'Rodolfo.cs'@'%';

SET DEFAULT ROLE 'support'@'%'
TO 'Victor.Manuel'@'%';

SET DEFAULT ROLE 'common_user'@'%'
TO 'Josue.Oloarte'@'%';

SET DEFAULT ROLE 'user_not_registered'@'%'
TO 'John'@'%';


-- MODIFICADO:
-- user_not_registered se mantiene como rol predeterminado.
-- common_user y buyer pueden activarse cuando corresponda.

SET DEFAULT ROLE 'user_not_registered'@'%'
TO 'app_web'@'%';

SET DEFAULT ROLE 'user_not_registered'@'%'
TO 'app_mobile'@'%';


-- =========================================================
-- 7. VERIFICACION DE CUENTAS
-- =========================================================

SELECT
    User,
    Host,
    account_locked,
    password_expired
FROM mysql.user
WHERE User NOT LIKE 'mysql.%'
ORDER BY User, Host;


-- =========================================================
-- 8. VERIFICACION DE ASIGNACION DE ROLES
-- =========================================================

SELECT
    FROM_USER AS rol,
    FROM_HOST AS host_rol,
    TO_USER AS cuenta,
    TO_HOST AS host_cuenta,
    WITH_ADMIN_OPTION
FROM mysql.role_edges
ORDER BY TO_USER, FROM_USER;


-- =========================================================
-- 9. VERIFICACION DE ROLES PREDETERMINADOS
-- =========================================================

SELECT
    USER,
    HOST,
    DEFAULT_ROLE_USER,
    DEFAULT_ROLE_HOST
FROM mysql.default_roles
ORDER BY USER, HOST;


-- =========================================================
-- 10. VERIFICACION DE PRIVILEGIOS DE LOS ROLES
-- =========================================================

SHOW GRANTS FOR 'super_admin'@'%';
SHOW GRANTS FOR 'admin'@'%';
SHOW GRANTS FOR 'seller'@'%';
SHOW GRANTS FOR 'buyer'@'%';
SHOW GRANTS FOR 'support'@'%';
SHOW GRANTS FOR 'common_user'@'%';
SHOW GRANTS FOR 'user_not_registered'@'%';


-- =========================================================
-- 11. VERIFICACION DE PRIVILEGIOS EFECTIVOS DE USUARIOS
-- =========================================================

SHOW GRANTS FOR 'Diego.Garrido'@'%' USING 'super_admin'@'%';

SHOW GRANTS FOR 'marco.ramirez'@'%' USING 'admin'@'%';

SHOW GRANTS FOR 'Marianna.Mayte'@'%' USING 'seller'@'%';

SHOW GRANTS FOR 'Jeysi.Damari'@'%' USING 'seller'@'%';

SHOW GRANTS FOR 'Rodolfo.cs'@'%' USING 'buyer'@'%';

SHOW GRANTS FOR 'Victor.Manuel'@'%' USING 'support'@'%';

SHOW GRANTS FOR 'Josue.Oloarte'@'%' USING 'common_user'@'%';

SHOW GRANTS FOR 'John'@'%' USING 'user_not_registered'@'%';


-- MODIFICADO:
-- Verificacion de los tres roles asignados a app_web.

SHOW GRANTS FOR 'app_web'@'%'
USING
    'user_not_registered'@'%',
    'common_user'@'%',
    'buyer'@'%';


-- MODIFICADO:
-- Verificacion de los tres roles asignados a app_mobile.

SHOW GRANTS FOR 'app_mobile'@'%'
USING
    'user_not_registered'@'%',
    'common_user'@'%',
    'buyer'@'%';


-- =========================================================
-- 12. VERIFICACION DEL PERMISO EXECUTE
-- =========================================================

SHOW GRANTS FOR 'app_web'@'%';

SHOW GRANTS FOR 'app_mobile'@'%';

SHOW GRANTS FOR 'user_not_registered'@'%';


SELECT
    'Configuracion de usuarios, roles y privilegios verificada.'
    AS mensaje;
