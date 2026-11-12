# Documentación de la Práctica 03: Manipulación de Datos, Relaciones, Procedimientos, Funciones y Eventos en Conexiones Remotas

> **Rama de desarrollo:** `Practica03` (integrada en `main`)  
> **Motor de Base de Datos:** MySQL Server (Conexiones Remotas TCP/IP)  
> **Herramientas de Modelado y Control:** Archify, MySQL Workbench, Git / GitHub

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Actividades Realizadas en la Rama `Practica03`](#2-actividades-realizadas-en-la-rama-practica03)
3. [Arquitectura y Control de Acceso (DCL)](#3-arquitectura-y-control-de-acceso-dcl)
4. [Automatización y Auditoría (Triggers, Vistas y Rutinas)](#4-automatización-y-auditoría-triggers-vistas-y-rutinas)
5. [Pruebas de Carga Masiva y Simulación](#5-pruebas-de-carga-masiva-y-simulación)
6. [Auditoría, Respaldos y Control de Versiones](#6-auditoría-respaldos-y-control-de-versiones)

---

## 1. Resumen Ejecutivo

Esta práctica consolida la administración avanzada de bases de datos relacionales en entornos distribuidos mediante conexiones remotas. Se implementó un ecosistema completo de **auditoría automatizada**, **control de acceso basado en roles (RBAC)**, **generación sintética de datos a gran escala (+14,500 registros combinados)** y **automatización de tareas programadas**, garantizando la integridad referencial, la trazabilidad de operaciones y la disponibilidad de respaldos progresivos.

---

## 2. Actividades Realizadas en la Rama `Practica03`

1. **Integración de Esquema (25 Tablas):** Validación de 24 tablas operativas más la tabla de auditoría `tb_logs`, verificando llaves primarias (`PK`), llaves foráneas (`FK`), restricciones de dominio e integridad referencial mediante conexiones remotas.
2. **Auditoría Automatizada (72 Triggers):** Implementación de disparadores `AFTER INSERT`, `AFTER UPDATE` y `AFTER DELETE` en las 24 tablas operativas para registrar la tabla afectada, operación ejecutada, usuario remoto (`CURRENT_USER()`), marca de tiempo y detalle en `tb_logs`.
3. **Vistas SQL (25 Vistas):** Creación de **24 vistas de trazabilidad** vinculadas directamente a la bitácora del sistema y **1 vista consolidada de Productos por Categoría** (incluyendo jerarquía de subcategorías y estado de disponibilidad).
4. **Seguridad y Acceso Remoto (7 Roles):** Configuración de usuarios remotos, privilegios granulares y roles predeterminados (`SET DEFAULT ROLE`) para `superadmin`, `admin`, `support`, `seller`, `buyer`, `common_user` y `user_not_registered`.
5. **Rutinas y Automatización:** Desarrollo de un procedimiento almacenado general parametrizable para población masiva, funciones auxiliares deterministas/no deterministas (rangos de fechas, valores aleatorios, distribuciones de probabilidad) y eventos programados (`CREATE EVENT`).
6. **Simulación Masiva de Usuarios (7,500 registros):** Población sincronizada en las entidades `tb_users` y `tb_people` vía conexión remota `superadmin`:
   * **Test 1:** 500 usuarios masculinos con nacionalidad de Estados Unidos.
   * **Test 2:** 2,000 usuarios de diversos países con rango de edad entre 19 y 35 años.
   * **Test 3:** 5,000 usuarios con distribución probabilística de estado (80 % activos `b'1'`, 20 % inactivos `b'0'`).
7. **Población Masiva de Productos (+7,000 registros):** Carga remota ejecutada bajo el rol `seller` (`seller1`: 5,000 productos; `seller2`: 2,000 productos), asegurando un mínimo de $\ge 5$ productos por cada categoría y subcategoría, e incluyendo registros descontinuados (`status = b'0'`).
8. **Auditoría y Validación SQL:** Ejecución de consultas analíticas de verificación de conteos, proporciones demográficas, integridad referencial, detección de registros huérfanos y trazabilidad por sesión remota.
9. **Respaldos Progresivos:** Generación de copias de seguridad cronológicas (`mysqldump`) incluyendo estructura DDL, datos DML, rutinas almacenadas, triggers, vistas y sentencias DCL.
10. **Documentación Técnica (Archify):** Actualización del Modelo Entidad-Relación Extendido (MERE) y del Diccionario de Datos sincronizados con el esquema activo en MySQL.
11. **Control de Versiones (Git/GitHub):** Desarrollo modular aislado en la rama `Practica03` y fusión (`merge`) limpia hacia la rama principal `main`.

---

## 3. Arquitectura y Control de Acceso (DCL)

| Rol / Perfil | Nivel de Privilegios | Alcance en Conexión Remota |
| :--- | :--- | :--- |
| `superadmin` | Control total (`ALL PRIVILEGES` + `GRANT OPTION`) | Administración global, DDL, DML, DCL y carga masiva de usuarios. |
| `admin` | Gestión operativa (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) | Administración de catálogos, usuarios y supervisión general. |
| `support` | Lectura y diagnóstico (`SELECT`, `SHOW VIEW`) | Consulta de bitácoras (`tb_logs`), vistas de trazabilidad y soporte. |
| `seller` | Gestión de inventario (`SELECT`, `INSERT`, `UPDATE` en productos) | Publicación y actualización masiva de productos (`seller1`, `seller2`). |
| `buyer` | Transaccional (`SELECT`, `INSERT` en órdenes/carrito) | Consulta de catálogo activo y generación de compras. |
| `common_user` | Lectura estándar (`SELECT` en vistas públicas) | Navegación general en el sistema. |
| `user_not_registered` | Acceso restringido (`SELECT` mínimo en catálogo) | Vista previa sin privilegios de escritura. |

---

## 4. Automatización y Auditoría (Triggers, Vistas y Rutinas)

### Distribución de Objetos de Base de Datos

| Tipo de Objeto | Cantidad | Descripción Técnica |
| :--- | :---: | :--- |
| **Tablas Operativas** | 24 | Entidades principales del modelo de negocio con integridad referencial. |
| **Tabla de Bitácora** | 1 | `tb_logs` (almacena auditoría histórica de transacciones remotas). |
| **Triggers** | 72 | 3 eventos (`INSERT`, `UPDATE`, `DELETE`) $\times$ 24 tablas operativas. |
| **Vistas SQL** | 25 | 24 vistas de auditoría por tabla + 1 vista de catálogo por categoría. |
| **Funciones / Procedimientos** | Modular | Generadores aleatorios, cálculo de probabilidades y carga parametrizable. |
| **Eventos (`EVENT`)** | Programados | Tareas periódicas automatizadas en el planificador de MySQL (`event_scheduler`). |

---

## 5. Pruebas de Carga Masiva y Simulación

### Resumen de Población de Datos

| Lote / Prueba | Entidad Destino | Usuario Remoto | Volumen | Criterio de Distribución / Regla de Negocio |
| :--- | :--- | :--- | :---: | :--- |
| **Test 1 (Usuarios)** | `tb_users` / `tb_people` | `superadmin` | 500 | Género masculino, país Estados Unidos. |
| **Test 2 (Usuarios)** | `tb_users` / `tb_people` | `superadmin` | 2,000 | Multicultural, edades entre 19 y 35 años. |
| **Test 3 (Usuarios)** | `tb_users` / `tb_people` | `superadmin` | 5,000 | Probabilidad 80 % `status = b'1'` / 20 % `status = b'0'`. |
| **Carga Seller 1** | `tb_products` | `seller1` | 5,000 | Cobertura $\ge 5$ ítems por categoría/subcategoría. |
| **Carga Seller 2** | `tb_products` | `seller2` | 2,000 | Incluye productos activos y descontinuados (`b'0'`). |

---

## 6. Auditoría, Respaldos y Control de Versiones

* **Validación de Integridad:** Verificación mediante consultas `LEFT JOIN ... WHERE IS NULL` confirmando **0 registros huérfanos** entre `tb_users` y `tb_people`, así como consistencia exacta entre los registros insertados y las entradas generadas en `tb_logs`.
* **Estrategia de Respaldos:** Exportación secuencial mediante `mysqldump --routines --triggers --events` tras cada hito crítico de la práctica.
* **Flujo Git:**
  ```bash
  git checkout -b Practica03
  # Desarrollo modular de scripts DDL, DML, DCL, Triggers, Vistas y Rutinas
  git add .
  git commit -m "feat(db): completa implementacion Practica 03 - auditoria, roles y carga masiva"
  git checkout main
  git merge Practica03