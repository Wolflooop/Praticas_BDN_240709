# Diccionario de datos

Referencia estática del esquema de `db_test_7b`, generada desde el mismo modelo que alimenta el diagrama ER.

## Fuente

- Respaldo: `../backups/respaldo_06_11_2026_DGC.sql`
- Fecha de generación indicada por el volcado: 2026-11-12 (13:50:23).
- Versión del servidor indicada en el archivo: MySQL 8.4.9.
- No requiere conexión activa a MySQL y no modifica filas; muestra cuántos registros tiene cada tabla según el respaldo (cuenta de filas de los `INSERT`), sin reproducir su contenido.

## Tecnologías y requisitos

HTML, CSS y JavaScript nativos; Node.js 18 o posterior para regenerar. No requiere paquetes externos.

## Ejecución local

Abre `index.html` en un navegador moderno. También puedes servirlo desde la raíz del repositorio con `python -m http.server 8000` y visitar `http://localhost:8000/Practica%2003/diccionario/index.html`.

## Funcionalidades

Índice de tablas, búsqueda, resumen del esquema, columnas con tipo, nulabilidad, valor predeterminado, PK/FK, autoincremento, índices, restricciones, relaciones y objetos SQL documentados. Cada tabla indica su número de registros actuales. La semántica que no se puede asegurar solo con el DDL se presenta como tal; no se inventan registros.

## Actualizar desde otro respaldo

Selecciona primero un único respaldo completo y verifica su DDL. Actualiza la fuente en `../diagrama/build-erd.mjs` y `../diagrama/validate-docs.mjs`; después ejecuta desde `../diagrama` `node build-erd.mjs`, `node validate-docs.mjs` y `node ../diccionario/generate-dictionary.mjs`. Ambos proyectos se construyen desde `../diagrama/schema-model.json`, lo que mantiene sincronizados sus inventarios.
