# Práctica 04: Simulación del Proceso de Compras en BD de E-Commerce

**Rama de desarrollo:** `Practica04`  
**Motor de base de datos:** MySQL Server  
**Herramientas:** MySQL Workbench, Git y GitHub.

---

## 1. Descripción general

En esta práctica se realizaron simulaciones del proceso de compra en una base de datos relacional de comercio electrónico (E-Commerce). Se trabajó con operaciones de registro de usuarios, gestión de carritos, generación de órdenes de compra, administración de domicilios, métodos de pago, transacciones bancarias, control de inventario y seguimiento de entregas.

Se establecieron cinco casos de prueba para evaluar diferentes escenarios de compra, incluyendo transacciones exitosas, pagos diferidos, incidencias en los pedidos, cancelaciones parciales, reembolsos, reenvíos y falta de inventario.

## 2. Actividades realizadas

- **Registro de usuarios:** utilización de usuarios nuevos y previamente registrados, considerando los roles `user_not_registered` y `buyer`, mediante las conexiones `AppWeb` y `AppMobile`.
- **Selección de productos:** consulta y selección de productos disponibles dentro de un catálogo de aproximadamente 10,000 registros, verificando su estatus.
- **Gestión de carritos:** creación de carritos de compra y asociación de productos con diferentes cantidades.
- **Órdenes de compra:** generación y procesamiento de órdenes a partir de los productos seleccionados en cada carrito.
- **Gestión de domicilios:** registro y selección de direcciones de envío, incluyendo domicilios particulares, laborales y ubicaciones alternativas.
- **Métodos de pago:** simulación de pagos mediante tarjetas de débito, crédito y digitales, transferencias SPEI y cupones de regalo, utilizando cuentas de prueba de 16 dígitos cuando corresponde.
- **Procesamiento de pagos:** simulación de pagos únicos y pagos mensuales, contemplando la autorización y el rechazo de transacciones bancarias.
- **Control de roles:** activación del rol `buyer` durante el proceso de pago para habilitar las operaciones correspondientes al usuario comprador.
- **Transacciones bancarias:** registro y validación de operaciones autorizadas y rechazadas, incluyendo incidencias por límite de crédito excedido.
- **Gestión de reclamaciones:** simulación de reclamaciones por productos dañados y procesamiento de reenvíos.
- **Cancelaciones y reembolsos:** cancelación parcial de productos, actualización de órdenes de compra y devolución de los importes correspondientes.
- **Gestión de entregas:** simulación de envíos a domicilios registrados y recolección de pedidos en puntos de entrega.
- **Control de inventario:** validación de escenarios de falta de existencias, cancelación de órdenes y reasignación de cupones de regalo.
- **Validación:** ejecución de consultas para comprobar la consistencia de las operaciones de compra, pagos, órdenes y movimientos relacionados.

## 3. Casos de prueba

Se contemplaron cinco escenarios para evaluar el funcionamiento de los procesos de compra:

- **Caso 1 — Compra exitosa sin modificaciones:** registro de un usuario nuevo, selección de cinco productos, generación de una orden y pago único mediante tarjeta de débito.
- **Caso 2 — Compra con incidencias en el último pago, reclamación y reenvío:** compra de diez productos mediante seis pagos mensuales, rechazo de la última transacción por límite de crédito excedido y posterior reclamación por un producto dañado.
- **Caso 3 — Compra exitosa con cancelación parcial, ajuste y reembolso parcial:** adquisición de tres productos de una misma categoría, cancelación de uno de ellos y devolución del importe correspondiente.
- **Caso 4 — Compra exitosa del mismo proveedor con entrega en punto de recolección:** adquisición de tres productos de un mismo proveedor mediante transferencia SPEI y recolección del pedido en un punto de entrega.
- **Caso 5 — Compra fallida por falta de inventario:** generación de una orden con un producto sin existencias suficientes, cancelación de la compra y reasignación del cupón de regalo utilizado.

## 4. Documentación técnica

Los siguientes recursos permiten consultar la estructura y documentación de la base de datos utilizada durante las simulaciones:

- [Diagrama Entidad-Relación (MERE)](https://wolflooop.github.io/Praticas_BDN_240709/Practica%2004/diagrama/modelo-db-test-7b.html)
- [Diccionario de datos](https://wolflooop.github.io/Praticas_BDN_240709/Practica%2004/diccionario/)

---

## 5. Resultados

Se establecieron cinco escenarios de prueba para evaluar el funcionamiento del proceso de compras de una plataforma de comercio electrónico mediante MySQL. Las simulaciones abarcaron desde el registro y selección de productos hasta el procesamiento de pagos, actualización de órdenes y gestión de entregas.

También se contemplaron situaciones excepcionales, como transacciones rechazadas, reclamaciones por productos dañados, cancelaciones parciales, reembolsos y falta de inventario, permitiendo evaluar la consistencia de las operaciones y la integridad de la información relacionada con cada proceso.