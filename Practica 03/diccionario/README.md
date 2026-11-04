# Diccionario de datos

Referencia estática del esquema de `db_test_7b`, generada desde el mismo modelo que alimenta el diagrama ER.

## Fuente

- Respaldo: `../backups/respaldo_31_10_2026_DGC.sql`
- Fecha de generación indicada por el volcado: 2026-11-03 (03:05:26).
- Versión del servidor indicada en el archivo: MySQL 8.4.9.
- No requiere conexión activa a MySQL y no contiene ni modifica filas.

## Tecnologías y requisitos

HTML, CSS y JavaScript nativos; Node.js 18 o posterior para regenerar. No requiere paquetes externos.

## Ejecución local

Abre `index.html` en un navegador moderno. También puedes servirlo desde la raíz del repositorio con `python -m http.server 8000` y visitar `http://localhost:8000/Practica%2003/diccionario/index.html`.

## Funcionalidades

Índice de tablas, búsqueda, resumen del esquema, columnas con tipo, nulabilidad, valor predeterminado, PK/FK, autoincremento, índices, restricciones, relaciones y objetos SQL documentados. La semántica que no se puede asegurar solo con el DDL se presenta como tal; no se inventan registros.

## Actualizar desde otro respaldo

Selecciona primero un único respaldo completo y verifica su DDL. Actualiza la fuente en `../diagrama/build-erd.mjs` y `../diagrama/validate-docs.mjs`; después ejecuta desde `../diagrama` `node build-erd.mjs`, `node validate-docs.mjs` y `node ../diccionario/generate-dictionary.mjs`. Ambos proyectos se construyen desde `../diagrama/schema-model.json`, lo que mantiene sincronizados sus inventarios.
