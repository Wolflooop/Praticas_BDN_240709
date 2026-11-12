# Documentación de la Práctica 02: Conexiones Remotas y Gestión de Datos (Tablas Clave)

> **Rama de desarrollo:** `Practica02`  
> **Motor de Base de Datos:** MySQL Server (Conexiones Remotas TCP/IP)  
> **Alcance:** Implementación simplificada y focalizada en las entidades principales: `tb_users`, `tb_products` y `tb_logs`.

---

## Tabla de Contenidos

1. [Resumen del Alcance](#1-resumen-del-alcance)
2. [Estructura de las Tablas Principales](#2-estructura-de-las-tablas-principales)
3. [Control de Acceso y Simulación por Rol (DCL)](#3-control-de-accès-y-simulación-por-rol-dcl)
4. [Población de Datos y Registros de Prueba](#4-población-de-datos-y-registros-de-prueba)
5. [Validación y Auditoría Remota](#5-validación-y-auditoría-remota)

---

## 1. Resumen del Alcance

Esta práctica se centra en el establecimiento de conexiones remotas seguras y la manipulación controlada de datos sobre un subconjunto crítico del esquema relacional:
* **`tb_users`**: Gestión de perfiles de usuario y credenciales de acceso.
* **`tb_products`**: Catálogo de productos e inventario.
* **`tb_logs`**: Registro de auditoría para las transacciones ejecutadas mediante conexiones remotas.

---

## 2. Estructura de las Tablas Principales

* **`tb_users`**: Almacena la información de identificación, credenciales de acceso y estado de actividad (`b'1'` activo, `b'0'` inactivo) de cada usuario del sistema, vinculada a sus respectivos roles de seguridad.
* **`tb_products`**: Contiene el inventario de artículos, asociando cada producto a su respectiva categoría, precio, stock disponible y estado de disponibilidad (`status`).
* **`tb_logs`**: Tabla de bitácora encargada de registrar automáticamente las operaciones críticas (inserciones, actualizaciones y eliminaciones) realizadas por los distintos usuarios remotos, almacenando la marca de tiempo y el usuario que ejecutó la acción.

---

## 3. Control de Acceso y Simulación por Rol (DCL)

Para la ejecución de las pruebas remotas, se configuraron perfiles específicos con privilegios granulares:

| Rol Asignado | Alcance y Operaciones Permitidas |
| :--- | :--- |
| **`support`** | Consulta de bitácora (`tb_logs`) y diagnóstico remoto sin permisos de modificación de datos de negocio. |
| **`user_not_registered`** | Acceso de lectura extremadamente limitado exclusivamente al catálogo público (`tb_products`). |
| **`admin`** | Gestión operativa y supervisión del catálogo de productos y control de usuarios. |
| **`seller1`** | Población y administración masiva de productos (asignación de los primeros 5,000 registros). |
| **`seller2`** | Población complementaria y gestión independiente de inventario. |

---

## 4. Población de Datos y Registros de Prueba

### A. Gestión de Usuarios y Accesos
* **Rol `support` y Usuario Sin Registro:** Se configuraron y validaron 9 usuarios iniciales operando bajo las restricciones del rol de soporte y los permisos mínimos de navegación para usuarios no registrados.

### B. Gestión de Productos (Administración y Carga Masiva)
* **Gestión por `admin`:** Se insertaron y verificaron 2 productos iniciales de prueba y validación estructural del catálogo.
* **Carga Masiva por `seller1` y `seller2`:** 
  * El rol **`seller1`** ejecutó la inserción masiva remota de **5,000 productos** bajo estrictas reglas de validación de integridad.
  * El rol **`seller2`** complementó la gestión de inventario con los registros adicionales requeridos por la práctica.

---
