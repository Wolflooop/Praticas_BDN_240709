# Práctica 02: Conexiones Remotas y Gestión de Datos en MySQL

**Rama de desarrollo:** `Practica02`  
**Motor de base de datos:** MySQL Server  
**Tipo de conexión:** Remota mediante TCP/IP.

---

## 1. Descripción general

En esta práctica se trabajó con conexiones remotas a un servidor MySQL, mediante la configuración de usuarios, roles y privilegios para controlar el acceso a la base de datos. También se realizaron operaciones de consulta, inserción y administración de datos sobre las tablas principales del sistema.

## 2. Actividades realizadas

- **Conexiones remotas:** configuración y establecimiento de conexiones TCP/IP con el servidor MySQL.
- **Gestión de usuarios y roles:** creación y configuración de perfiles con diferentes niveles de acceso.
- **Control de privilegios:** asignación de permisos específicos para limitar las operaciones disponibles según cada rol.
- **Estructura de datos:** trabajo con las tablas principales `tb_users`, `tb_products` y `tb_logs`.
- **Gestión de usuarios:** configuración y validación de 9 usuarios iniciales bajo distintos perfiles de acceso.
- **Administración de productos:** inserción y validación de registros de prueba mediante el rol `admin`.
- **Carga masiva:** inserción remota de 5,000 productos mediante `seller1` y gestión complementaria del inventario mediante `seller2`.
- **Auditoría:** registro y consulta de operaciones realizadas mediante conexiones remotas.
- **Validación:** comprobación de los permisos asignados y de las operaciones permitidas para cada perfil.

## 3. Resultados

Se estableció un entorno de administración remota de MySQL con diferentes perfiles de acceso y privilegios. Se realizaron operaciones de gestión de usuarios y productos, pruebas de carga masiva y validaciones de auditoría para comprobar el funcionamiento del control de acceso y la manipulación de datos.

---