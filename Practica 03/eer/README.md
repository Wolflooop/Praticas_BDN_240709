# Atlas EER

Explorador visual local de `../backups/respaldo_19_10_2026_DGC.sql`. Abre `index.html` en un navegador moderno; no requiere servidor, librerías externas ni credenciales. La importación local lee el SQL como texto y nunca ejecuta instrucciones del respaldo ni lo envía a un servicio externo.

## Datos del respaldo incluido

El modelo se genera con el parser incluido, no con datos de ejemplo. En esta versión se analizaron ocho tablas, 54 columnas y ocho claves foráneas confirmadas. El parser encontró ocho vistas, dos procedimientos, 18 triggers y ningún `CHECK` ni función almacenada. Las cantidades mostradas como **filas en respaldo** cuentan tuplas `INSERT` presentes en el archivo y suman 21,628; no representan conteos actuales de una instancia conectada. El respaldo no incluye filas `INSERT` para `tb_carts`, `tbd_produtcs_users_providers` ni `tbd_users_wishlist_products`, por lo que se muestran como cero filas incluidas en el dump. No hay conexión configurada a la base de datos.

## Uso

- Busca tablas y columnas; combina filtros por PK, FK, tablas intermedias, tipo, nulabilidad y cantidad exacta incluida en el respaldo.
- Arrastra entidades; usa la rueda para zoom y arrastra el lienzo para desplazarte. Organiza por relaciones, conectividad o alfabeto; ajusta, centra o restablece la vista.
- Haz clic en una entidad, columna o relación para resaltar sus conexiones y ver detalles. Usa `Ctrl`/`⌘` + clic o el control `⊕` para selección múltiple. Contrae columnas individualmente o en todas las entidades.
- Los puntos animados muestran el flujo desde la columna FK hacia la tabla referenciada. La autorrelación de categorías usa una ruta ortogonal por fuera de su entidad, sin un círculo encima de la tabla. Seleccionar una conexión resalta sus columnas, origen y destino; puedes pausar la animación y se respeta la preferencia del sistema de movimiento reducido.
- Importa otro `.sql` local, exporta JSON/CSV/SVG, guarda la distribución en el navegador o imprime a PDF.

El botón de actualización explica que no hay una conexión real configurada; nunca sustituye un conteo no disponible por cero ni presenta los conteos del dump como estado actual. No se han inferido relaciones por nombres de columnas.

## Regenerar y verificar

Desde esta carpeta, con Node.js:

```sh
node generate-model.js
node --test sql-parser.test.js
```

`generate-model.js` vuelve a analizar el respaldo y actualiza `model.js` sin ejecutar sentencias SQL. Las pruebas verifican el respaldo real y el análisis de `ALTER TABLE`, acciones referenciales e instrucciones destructivas ignoradas.
