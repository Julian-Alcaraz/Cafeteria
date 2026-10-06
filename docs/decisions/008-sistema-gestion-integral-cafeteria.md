# Decisión 008: Sistema de Gestión Integral de Cafetería — Diseño Arquitectónico

**Fecha**: 19/09/2026  
**Versión**: v2.1  
**Estado**: Aprobado

## Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| v2.0 | 19/09/2026 | Diseño inicial aprobado |
| v2.1 | 19/09/2026 | R-01 resuelto: bloqueo duro sin tolva · R-06 resuelto: mecanismo de corrección masiva de movimientos |

---

## Contexto

Se requiere diseñar e implementar un sistema integral para gestionar inventario, costos, ventas, producción y consumo de insumos de la cafetería, con especial atención al manejo de distintas variedades de café.

---

## Áreas Funcionales del Sistema

El dominio se organiza en 7 áreas:

1. **Catálogo** — Productos, tipos, categorías, variedades de café
2. **Recetas** — Recetas versionadas con ingredientes y configuración de tolvas
3. **Inventario** — Stock, lotes (FIFO), movimientos auditados
4. **Ventas** — Cuentas abiertas, ítems, entregas, pagos
5. **Compras** — Proveedores, órdenes de compra, recepción
6. **Costos** — Snapshots de costo, rentabilidad
7. **Infraestructura** — Usuarios, menús, permisos, auditoría (existente)

---

## Decisiones Tomadas

### 1. PKs y BaseEntity
- Todas las entidades heredan de `BaseEntity` existente en el proyecto.
- `BaseEntity` provee: `id (uuid)`, `createdAt`, `updatedAt`, `deshabilitado`.
- No se repiten estos campos en cada entidad nueva.

### 2. Tipos de Producto
Se definen 4 tipos mediante la entidad `ProductType`:

| Código | Descripción |
|--------|-------------|
| `SALEABLE` | Vendido directamente (cookies, tortas, etc.) |
| `INGREDIENT` | Insumo (leche, azúcar, vasos, servilletas) |
| `ELABORATED` | Elaborado mediante receta (latte, cappuccino, espresso) |
| `COFFEE_BEAN` | Café en grano, vendible por peso y como insumo de recetas |

### 3. Variedades de Café
- Cada variedad de café es un `Product` de tipo `COFFEE_BEAN`.
- La entidad `CoffeeVariety` extiende el producto con: origen, proceso, nivel de tueste, notas de cata.
- Esto permite vender café en grano por peso Y usarlo como insumo en recetas.

### 4. Sistema de Tolvas (Hoppers)
- **Situación actual**: 1 sola tolva operativa.
- **Diseño**: El modelo soporta N tolvas (campo `slotNumber` entero).
- **Configuración diaria**: Cada día se registra qué variedad de café está cargada en cada slot via `HopperConfig`.
- **Las recetas NO apuntan a un café específico**. El ingrediente tiene `isHopperSlot = true` y `hopperSlotNumber`. Al momento de la entrega, el sistema resuelve qué café corresponde consultando la `HopperConfig` activa.
- **UI**: Arranca mostrando 1 slot. Escalable sin migración de base de datos.

### 5. Recetas Versionadas
- Cada receta tiene `version (int)` y `validFrom (timestamp)`.
- Solo puede existir una receta activa por producto a la vez (RN-01).
- Al actualizar una receta se crea una nueva versión (no se sobreescribe).
- El `AccountItem` guarda referencia a la versión de receta usada — permite auditar el costo histórico exacto.

### 6. Momento del Descuento de Stock — AL ENTREGAR
**Decisión**: El stock se descuenta cuando el operador marca el ítem como `DELIVERED`, no al agregar ni al cobrar.

**Razón**: Refleja la realidad operativa. Si el café fue preparado y entregado al cliente, el insumo fue consumido. El momento del cobro es independiente del consumo físico.

**Flujo de estados del AccountItem**:
```
PENDING → DELIVERED → (cuenta cierra: PAID)
PENDING → CANCELLED  (no descuenta stock)
```

### 7. Ítems Entregados Sin Cobro
- Un ítem puede ser entregado y NO cobrado: `isCharged = false`.
- El stock **se descuenta igualmente** (el insumo fue consumido).
- El campo `notChargedReason` es **obligatorio** cuando `isCharged = false`.
- El ítem no suma al total de la cuenta.
- Esto cubre: cortesías, quejas de calidad, errores de preparación, etc.
- Se puede reportar cuánto "regala" el negocio y por qué razón.

**Valores de `notChargedReason`**:
- `COURTESY` — Cortesía al cliente
- `COMPLAINT` — Queja del cliente
- `MISTAKE` — Error de preparación / pedido equivocado
- `QUALITY_ISSUE` — Problema de calidad del producto

### 8. Valorización de Stock — FIFO
- Se utiliza FIFO (First In, First Out) a nivel de lotes (`StockLot`).
- Al descontar stock se consume primero el lote más antiguo con cantidad disponible.
- Alineado con normas contables argentinas (RT 17 FACPCE).
- Permite calcular el CMV (Costo de Mercadería Vendida) real.

### 9. Tipos de Cuentas
- `SALON` — Consumo en el local
- `COUNTER` — Mostrador (para llevar inmediato)
- `TAKEAWAY` — Para llevar con espera
- `DELIVERY` — Envío a domicilio

No existen mesas predefinidas. Las cuentas son la unidad de gestión.

### 10. Auditoría de Movimientos
- Todo movimiento de stock genera exactamente un `StockMovement` (RN-08).
- No hay cambios de stock silenciosos.
- Tipos: `PURCHASE | SALE | PRODUCTION | WASTE | ADJUSTMENT | TRANSFER`.

---

### 11. Bloqueo por Tolva no Configurada (R-01 — Resuelto)

**Regla**: No se puede entregar ningún ítem que requiera tolva si no hay `HopperConfig` activa para ese día y slot.

- El endpoint de entrega (`deliver`) valida la existencia de tolva antes de ejecutar. Si no existe → `422`.
- Al **agregar** el ítem a la cuenta: se advierte en la respuesta que el ítem requiere tolva (advertencia no bloqueante).
- En el POS frontend: banner de alerta cuando no hay tolvas configuradas para el día, con acceso directo a la pantalla de configuración.

### 12. Corrección de Configuración de Tolva Errónea (R-06 — Resuelto)

**Regla**: Si se detecta que la tolva tenía la variedad incorrecta, el sistema puede corregir retroactivamente todos los movimientos de stock del día afectado.

**Endpoint**: `POST /api/hoppers/correct`

**Proceso atómico**:
1. Identificar todos los `StockMovement` del día con `type=SALE` generados por esa tolva y variedad incorrecta.
2. Por cada movimiento: crear un `ADJUSTMENT` positivo en la variedad incorrecta (devuelve stock) y un `ADJUSTMENT` negativo en la variedad correcta (descuenta del stock real).
3. Actualizar `Stock.quantityAvailable` de ambas variedades.
4. Crear nueva `HopperConfig` con la variedad correcta; marcar la incorrecta como inactiva.
5. Registrar en `AuditLog` con resumen: cantidad de movimientos corregidos, gramos reasignados, usuario.

**Lo que NO cambia**: `AccountItem.unitCost` y precios cobrados permanecen intactos. La corrección opera solo a nivel de stock. La diferencia de costo entre variedades se absorbe como ajuste de inventario.



## Consecuencias

- Se crean 6 nuevos módulos NestJS: `catalog`, `recipes`, `hoppers`, `inventory`, `accounts`, `purchasing`, `reports`.
- Se requieren migraciones de base de datos para cada módulo.
- La lógica de entrega de ítems es el punto crítico del sistema: debe ejecutarse en transacción atómica con `SELECT FOR UPDATE` sobre stocks.
- La UI de POS debe diferenciar claramente entre "agregar ítem" (PENDING) y "marcar como entregado" (DELIVERED).

---

## Referencias
- [Diseño completo con diagramas y API](../../.gemini/antigravity/brain/5f606050-61c6-4105-8368-ad806c156679/sistema-gestion-cafeteria.md)
- [Riesgos funcionales pendientes](./009-riesgos-funcionales-pendientes.md)
