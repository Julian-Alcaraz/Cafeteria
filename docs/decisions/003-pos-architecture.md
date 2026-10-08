# Decisión de Arquitectura: Punto de Venta (POS) y Cuentas

## Contexto
El Sprint 3 se centra en la operación diaria de la cafetería: la toma de pedidos, apertura de cuentas, entrega de productos, descuento de stock y cobro.

## Decisiones Funcionales

### 1. Gestión de Cuentas (Tickets)
- **Cuentas Abiertas:** No trabajaremos con un sistema de "Mesas" estrictas en esta etapa (Mesa 1, Mesa 2), sino con "Tickets" o "Cuentas" que pueden tener un nombre o identificador (ej. "Para Llevar", "Juan").
- **Escalabilidad:** A nivel de base de datos, la tabla `Account` o `Ticket` tendrá un campo `tableId` (nullable) para poder implementar un plano de mesas en el futuro sin romper la arquitectura actual.

### 2. Estados de los Ítems y Descuento de Stock
- **Flujo de Ítem:** Un ítem entra a la cuenta en estado `PENDING`. Cuando el barista lo prepara, pasa a `DELIVERED`.
- **Momento del descuento:** El inventario se descuenta **en tiempo real** en el momento en que el ítem cambia a `DELIVERED` (entregado/preparado), no al cobrar.
- **Mermas / Rehacer:** Si un producto se prepara mal y debe rehacerse, se descontará stock de 2 productos pero se cobrará solo 1. Para esto, el ítem de la cuenta tendrá una funcionalidad de "Rehacer", la cual registrará un nuevo descuento de stock (como movimiento de ajuste negativo / merma) sin alterar el costo para el cliente.

### 3. Sistema de Pagos y Propinas
- **Pagos Simples:** Se manejará un único "marcado de pago" por cuenta (sin split payments formales por el momento). 
- **Observaciones de Pago:** Al cobrar, se dejará un campo de texto libre para detallar el método (Ej: "Efectivo", "Mitad tarjeta, mitad efectivo").
- **Propinas Mutables:** El campo de propina (`tip`) será opcional y podrá editarse incluso si la cuenta ya está en estado `CLOSED`, permitiendo registrar propinas recibidas post-cobro.

### 4. Asignación Dinámica de Tolvas
- Al agregar un producto que requiere café en grano (determinado por su receta que marca un insumo como "Tolva Dinámica"), el sistema verificará cuántas tolvas activas hay en el día (`HopperConfig`).
- **Si hay 1 sola tolva activa:** El sistema la asume automáticamente y la vincula al ítem sin preguntar.
- **Si hay >1 tolva activa:** La UI exigirá al cajero seleccionar de qué tolva se preparará ese café en particular.
