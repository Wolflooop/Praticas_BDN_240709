CREATE USER 'Diego.Garrido'@'%' IDENTIFIED BY '240709';
CREATE USER 'nombre.apellido'@'%' IDENTIFIED BY 'sumatricula';
CREATE USER 'Rodolfo.cs'@'%' IDENTIFIED BY '240836';
CREATE USER 'Victor.Manuel'@'%' IDENTIFIED BY '240852';

/* Asignar los privilegios de super usuario IMPORTANTE: SOLO USTEDES!! */
GRANT ALL PRIVILEGES ON *.* TO 'Diego.Garrido'@'%';

/* ASIGNAR PRIVILEGIOS DE SELECCIÓN, INSERCIÓN, ACTUALIZACIÓN Y ELIMINACIÓN */
GRANT SELECT, UPDATE, INSERT, DELETE ON db_test_7b.* TO 'Victor.Manuel'@'%';

/* CREACIÓN DE ROLES PARA EL SISTEMA DE ECOMMERCE */
CREATE ROLE 'admin';
CREATE ROLE 'seller';
CREATE ROLE 'buyer';
CREATE ROLE 'support';
CREATE ROLE 'common';
CREATE ROLE 'user_not_registered';

/* ASIGNAR PRIVILEGIOS A LOS ROLES CREADOS */
GRANT ALL PRIVILEGES ON db_test_7b.* TO 'admin';
-- Support
GRANT SELECT, UPDATE, INSERT ON db_test_7b.* TO 'support';

/* ASIGNAR ROLES A LOS USUARIOS CREADOS */
GRANT 'admin' TO 'Diego.Garrido'@'%';

GRANT 'support' TO 'Victor.Manuel'@'%';