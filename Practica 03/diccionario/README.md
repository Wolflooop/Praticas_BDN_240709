# Diccionario de datos

Documentación generada a partir del respaldo `../backups/respaldo_21_10_2026_DGC.sql`.

- [Diccionario completo de tablas y columnas](DICCIONARIO.md)
- [Fuente Archify ERD](candidate.json)
- [Generador reproducible](generate-dictionary.js)

El respaldo se analiza como texto y no se ejecuta. El diccionario describe el esquema del archivo, no el estado actual de una instancia. Para regenerarlo, desde esta carpeta ejecuta `node generate-dictionary.js`; el script usa el respaldo original si está disponible y, en su ausencia, la copia sanitizada.

La entrega pública incluye `../backups/respaldo_21_10_2026_DGC_sanitizado.sql`. Es una copia distinta: conserva DDL y objetos del respaldo analizado, elimina las filas insertadas de `tb_users` y `tb_logs`, y reemplaza las cuentas asociadas a `DEFINER` por `CURRENT_USER`. Las filas de otras tablas se conservan. La copia no ha sido restaurada en un servidor MySQL, por lo que esta entrega no certifica su restaurabilidad. El respaldo original no forma parte de la entrega.

## Publicación

Archify 3.1.0 generó [el ERD navegable](diccionario-erd.html) a partir de `candidate.json`; las etapas de validación, entrega y comprobación del artefacto pasaron. La comprobación en navegador no pudo ejecutarse porque no se encontró Chrome/Chromium.

En esta rama no hay un workflow ni archivos de configuración de GitHub Pages. El README se muestra al navegar el repositorio; eso no equivale a un sitio Pages publicado. La copia publicada es sanitizada; el respaldo original contiene datos de usuarios y auditoría y se excluye de la entrega.
