# Diccionario de datos

Documentación generada a partir del respaldo `../backups/respaldo_21_10_2026_DGC.sql`.

- [Diccionario completo de tablas y columnas](DICCIONARIO.md)
- [Fuente Archify ERD](candidate.json)
- [Generador reproducible](generate-dictionary.js)

El respaldo se analiza como texto y no se ejecuta. El diccionario describe el esquema del archivo, no el estado actual de una instancia. Para regenerarlo, desde esta carpeta ejecuta `node generate-dictionary.js`.

## Publicación

Esta carpeta puede servirse como contenido estático de GitHub Pages (por ejemplo, usando `Practica 03` como carpeta publicada). El archivo de entrada de lectura es este `README.md`. El ERD Archify se conserva como candidato reproducible; Archify no pudo entregar su HTML en el entorno de esta ejecución porque rechazó la resolución de identidad de la ruta de salida con `EPERM`.
