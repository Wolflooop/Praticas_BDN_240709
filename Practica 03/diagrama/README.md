# Diagrama entidad-relación

Diagrama interactivo, autónomo y estático de `db_test_7b`.

## Fuente

- Respaldo: `../backups/respaldo_06_11_2026_DGC.sql`
- Fecha de generación indicada por el volcado: 2026-11-12 (13:50:23).
- Versión del servidor indicada en el archivo: MySQL 8.4.9.
- El proyecto no necesita conectarse a MySQL y no modifica datos.

## Tecnologías y requisitos

HTML, CSS, SVG y JavaScript nativos; Node.js 18 o posterior para regenerar y validar. No hay dependencias externas ni instalación de paquetes.

## Ejecución local

Abre `modelo-db-test-7b.html` en un navegador moderno. Para servirlo localmente desde la raíz del repositorio, ejecuta `python -m http.server 8000` y visita `http://localhost:8000/Practica%2003/diagrama/modelo-db-test-7b.html`.

## Funcionalidades

Búsqueda por tabla y columna, selección de entidades y relaciones, panel contextual, distribución automática, arrastre, zoom, ajuste y restablecimiento de vista, filtros de relaciones y recorrido animado de FKs. La estructura procede del DDL; el número de registros de cada tabla (en el rótulo de la entidad y en el panel contextual) es el conteo de filas de los `INSERT` del respaldo. No se muestran los datos de las filas.

## Actualizar desde otro respaldo

1. Copia el respaldo completo elegido a `../backups/` sin alterar el original.
2. Actualiza `sourceName` en `build-erd.mjs` y la ruta de fuente en `validate-docs.mjs`.
3. Desde esta carpeta ejecuta `node build-erd.mjs`.
4. Ejecuta `node validate-docs.mjs` y confirma que las diferencias de tablas, columnas, claves, relaciones y objetos SQL sean cero.
5. Ejecuta `node ../diccionario/generate-dictionary.mjs` para regenerar el diccionario desde el `schema-model.json` compartido.

No mezcles objetos de respaldos diferentes. La clasificación y las descripciones funcionales son documentación semántica; las restricciones y columnas se extraen del SQL.
