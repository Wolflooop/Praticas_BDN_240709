# Documentación de la Práctica 03: Manipulación de Datos, Relaciones, Procedimientos, Funciones y Eventos en Conexiones Remotas

## Modelo de datos

Los entregables están separados por tipo:

- [Diagrama ER interactivo](diagrama/modelo-db-test-7b.html): relaciones, navegación, zoom, búsqueda y resaltado.
- [Diccionario de datos web](diccionario/index.html): listado vertical por tabla con descripción, clasificación analítica, tipo SQL, nulabilidad, valores por defecto, claves y restricciones.

Ambos se generan a partir de `backups/respaldo_21_10_2026_DGC_sanitizado.sql` (MySQL 8.4.9). Las descripciones y la clasificación son interpretación semántica; los tipos y restricciones se extraen del respaldo.

Para regenerar desde la raíz: ejecuta `node 'Practica 03/diagrama/build-erd.mjs'`; compila con `node "RUTA_ARCHIFY/bin/archify.mjs" finalize erd .candidate.erd.json 'Practica 03/diagrama/modelo-db-test-7b.html' --quality standard --json` (sustituye `RUTA_ARCHIFY` por la carpeta de Archify); y ejecuta `node 'Practica 03/diccionario/generate-dictionary.mjs'` para generar el diccionario web.
