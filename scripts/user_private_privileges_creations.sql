/*
============================================================
CREACIÓN DE USUARIOS
============================================================
*/

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


/*
============================================================
CREACIÓN DE ROLES
============================================================
*/

CREATE ROLE IF NOT EXISTS 'super_admin';

CREATE ROLE IF NOT EXISTS 'admin';

CREATE ROLE IF NOT EXISTS 'seller';

CREATE ROLE IF NOT EXISTS 'buyer';

CREATE ROLE IF NOT EXISTS 'support';

CREATE ROLE IF NOT EXISTS 'common';

CREATE ROLE IF NOT EXISTS 'user_not_registered';


/*
============================================================
PRIVILEGIOS DE SUPER ADMIN
============================================================
*/

GRANT ALL PRIVILEGES
ON *.*
TO 'super_admin'
WITH GRANT OPTION;


/*
============================================================
PRIVILEGIOS DE ADMIN
============================================================
*/

GRANT ALL PRIVILEGES
ON db_test_7b.*
TO 'admin';


/*
============================================================
PRIVILEGIOS DE SELLER
============================================================
*/

GRANT SELECT, INSERT, UPDATE, DELETE
ON db_test_7b.tb_products
TO 'seller';


/*
============================================================
PRIVILEGIOS DE SUPPORT
============================================================
*/

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_users
TO 'support';

GRANT SELECT, INSERT, UPDATE
ON db_test_7b.tb_products
TO 'support';


/*
============================================================
PRIVILEGIOS DE COMMON
============================================================
*/

GRANT SELECT
ON db_test_7b.*
TO 'common';


/*
============================================================
ASIGNACIÓN DE ROLES A LOS USUARIOS
============================================================
*/

/*
SUPER ADMIN — DIEGO
*/

GRANT 'super_admin'
TO 'Diego.Garrido'@'%';


/*
ADMIN — MARCO
*/

GRANT 'admin'
TO 'marco.ramirez'@'%';


/*
SELLER — JOSUÉ OLOARTE
*/

GRANT 'seller'
TO 'Josue.Oloarte'@'%';


/*
SELLER — MARIANNA MAYTE
*/

GRANT 'seller'
TO 'Marianna.Mayte'@'%';


/*
BUYER — RODOLFO
*/

GRANT 'buyer'
TO 'Rodolfo.cs'@'%';


/*
SUPPORT — JEYSI DAMARI
*/

GRANT 'support'
TO 'Jeysi.Damari'@'%';


/*
COMMON — VICTOR
*/

GRANT 'common'
TO 'Victor.Manuel'@'%';


/*
============================================================
ESTABLECER ROLES PREDETERMINADOS
============================================================
*/

SET DEFAULT ROLE 'super_admin'
TO 'Diego.Garrido'@'%';

SET DEFAULT ROLE 'admin'
TO 'marco.ramirez'@'%';

SET DEFAULT ROLE 'seller'
TO 'Josue.Oloarte'@'%';

SET DEFAULT ROLE 'seller'
TO 'Marianna.Mayte'@'%';

SET DEFAULT ROLE 'buyer'
TO 'Rodolfo.cs'@'%';

SET DEFAULT ROLE 'support'
TO 'Jeysi.Damari'@'%';

SET DEFAULT ROLE 'common'
TO 'Victor.Manuel'@'%';


/*
============================================================
VERIFICACIÓN DE PRIVILEGIOS DE LOS USUARIOS
============================================================
*/

SHOW GRANTS FOR 'Diego.Garrido'@'%';

SHOW GRANTS FOR 'marco.ramirez'@'%';

SHOW GRANTS FOR 'Josue.Oloarte'@'%';

SHOW GRANTS FOR 'Marianna.Mayte'@'%';

SHOW GRANTS FOR 'Rodolfo.cs'@'%';

SHOW GRANTS FOR 'Jeysi.Damari'@'%';

SHOW GRANTS FOR 'Victor.Manuel'@'%';


/*
============================================================
VERIFICACIÓN DE PRIVILEGIOS DE LOS ROLES
============================================================
*/

SHOW GRANTS FOR 'super_admin';

SHOW GRANTS FOR 'admin';

SHOW GRANTS FOR 'seller';

SHOW GRANTS FOR 'buyer';

SHOW GRANTS FOR 'support';

SHOW GRANTS FOR 'common';

SHOW GRANTS FOR 'user_not_registered';


/*
============================================================
MENSAJE DE CONFIRMACIÓN
============================================================
*/

SELECT
    'Los usuarios, roles y privilegios han sido creados correctamente'
    AS mensaje;