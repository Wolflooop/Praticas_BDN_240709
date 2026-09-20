-- ============================================================
-- CREACIÓN DE USUARIOS
-- ============================================================

CREATE USER IF NOT EXISTS 'Diego.Garrido'@'%'
IDENTIFIED BY '240709';

CREATE USER IF NOT EXISTS 'nombre.apellido'@'%'
IDENTIFIED BY 'sumatricula';

CREATE USER IF NOT EXISTS 'Rodolfo.cs'@'%'
IDENTIFIED BY '240836';

CREATE USER IF NOT EXISTS 'Victor.Manuel'@'%'
IDENTIFIED BY '240852';


-- ============================================================
-- SUPER USUARIO
-- SOLO PARA DIEGO
-- ============================================================

GRANT ALL PRIVILEGES
ON *.*
TO 'Diego.Garrido'@'%'
WITH GRANT OPTION;


-- ============================================================
-- CREACIÓN DE ROLES
-- ============================================================

CREATE ROLE IF NOT EXISTS 'super_admin';

CREATE ROLE IF NOT EXISTS 'admin';

CREATE ROLE IF NOT EXISTS 'seller';

CREATE ROLE IF NOT EXISTS 'buyer';

CREATE ROLE IF NOT EXISTS 'support';

CREATE ROLE IF NOT EXISTS 'common';

CREATE ROLE IF NOT EXISTS 'user_not_registered';


-- ============================================================
-- PRIVILEGIOS DE SUPER ADMIN
-- ============================================================

GRANT ALL PRIVILEGES
ON *.*
TO 'super_admin'
WITH GRANT OPTION;


-- ============================================================
-- PRIVILEGIOS DE SELLER
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_7b.tb_products
TO 'seller';


-- ============================================================
-- PRIVILEGIOS DE SUPPORT
-- ============================================================

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_users
TO 'support';

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_products
TO 'support';


-- ============================================================
-- ASIGNACIÓN DE ROLES
-- ============================================================

GRANT 'super_admin'
TO 'Diego.Garrido'@'%';

GRANT 'seller'
TO 'Victor.Manuel'@'%';

GRANT 'support'
TO 'Rodolfo.cs'@'%';


-- ============================================================
-- ROLES POR DEFECTO
-- ============================================================

SET DEFAULT ROLE 'super_admin'
TO 'Diego.Garrido'@'%';

SET DEFAULT ROLE 'seller'
TO 'Victor.Manuel'@'%';

SET DEFAULT ROLE 'support'
TO 'Rodolfo.cs'@'%';


-- ============================================================
-- VERIFICACIÓN DE PRIVILEGIOS
-- ============================================================

SHOW GRANTS FOR 'Diego.Garrido'@'%';

SHOW GRANTS FOR 'Victor.Manuel'@'%';

SHOW GRANTS FOR 'Rodolfo.cs'@'%';

SHOW GRANTS FOR 'nombre.apellido'@'%';

SHOW GRANTS FOR 'super_admin';

SHOW GRANTS FOR 'seller';

SHOW GRANTS FOR 'support';