# Riesgos Funcionales Pendientes de Resolución

> **Propósito**: Este documento registra los riesgos funcionales identificados en el diseño del Sistema de Gestión Integral que **aún no tienen una mitigación implementada en código**. Deben tenerse en mente durante el desarrollo de cada etapa.

**Última actualización**: 19/09/2026  
**Diseño base**: [008-sistema-gestion-integral-cafeteria.md](./008-sistema-gestion-integral-cafeteria.md)

---

## ⚠️ Riesgos Activos

### R-02 — Stock negativo por concurrencia (dos baristas entregan simultáneamente)

| Campo | Valor |
|-------|-------|
| **Probabilidad** | Media |
| **Impacto** | Alto — Stock incorrecto, datos de costo corruptos |
| **Área** | `inventory`, `accounts` |
| **Sprint donde atacar** | Sprint 3 (lógica de entrega) |

**Descripción**: Si dos baristas marcan como `DELIVERED` ítems que consumen el mismo insumo casi simultáneamente, y el stock disponible alcanza para uno solo, ambas operaciones podrían pasar la validación antes de que alguna actualice el stock.

**Mitigación propuesta (no implementada)**:
- Usar `SELECT ... FOR UPDATE` (row-level lock) sobre la fila de `stocks` al momento de consumir.
- Toda la operación de entrega debe ejecutarse en una **transacción de base de datos** atómica:
  1. Lock de fila en `stocks`
  2. Verificar cantidad disponible
  3. Descontar
  4. Registrar `StockMovement`
  5. Commit
- Si el stock es insuficiente al momento del lock → error `409 Conflict` o `422` con mensaje al usuario.
- En NestJS: usar `queryRunner.startTransaction()` con el `EntityManager` de TypeORM.

---

### R-05 — Acumulación masiva de movimientos de stock a largo plazo

| Campo | Valor |
|-------|-------|
| **Probabilidad** | Media (certeza a largo plazo) |
| **Impacto** | Bajo a Medio — Degradación de performance en consultas históricas |
| **Área** | `inventory` |
| **Sprint donde atacar** | Etapa 4+ (no urgente para MVP) |

**Descripción**: La tabla `stock_movements` crecerá indefinidamente. En un negocio con 50-100 ventas diarias y múltiples insumos por bebida, en un año puede superar el millón de registros.

**Mitigación propuesta (no implementada)**:
- Particionado de la tabla `stock_movements` por mes (PostgreSQL table partitioning).
- Alternativamente: archivado periódico de movimientos antiguos a tabla histórica.
- Los índices definidos en el diseño (`idx_stock_movements_product`) mitigan el impacto a corto-mediano plazo.
- **Acción**: Evaluar en Etapa 4 cuando se construyan los reportes. Si las queries de reporte son lentas, implementar particionado.

---

## ✅ Riesgos Resueltos — Pendientes de Implementar en Código

> Estos riesgos tienen la decisión de negocio tomada y el mecanismo de mitigación diseñado. Deben implementarse en el sprint correspondiente.

### R-01 — Tolva no configurada al momento de entregar una bebida

| Campo | Valor |
|-------|-------|
| **Probabilidad** | Alta |
| **Impacto** | Alto |
| **Área** | `hoppers`, `accounts` |
| **Sprint de implementación** | Sprint 2 + Sprint 3 |
| **Estado** | ✅ Decisión tomada — pendiente de implementar |

**Decisión de negocio (19/09/2026)**:  
> _"No se puede vender hasta no tener la tolva configurada para los productos que requieren esta definición."_

**Implementación requerida**:
- El endpoint `PUT /accounts/:id/items/:itemId/deliver` debe validar **antes de ejecutar** que existe `HopperConfig` activa para cada slot requerido por la receta.
- Si no existe → `422 Unprocessable Entity`: *"No hay café configurado en la tolva 1 para hoy. Configure las tolvas antes de continuar."*
- El endpoint `POST /accounts/:id/items` (agregar ítem) también debe advertir en la respuesta si los ítems agregados requieren tolva y esta no está configurada (advertencia, no bloqueo al agregar).
- En el frontend POS: banner de alerta visible cuando el día no tiene tolvas configuradas, con acceso directo a la pantalla de configuración.

---

### R-06 — Error humano en configuración de tolvas (café equivocado cargado)

| Campo | Valor |
|-------|-------|
| **Probabilidad** | Media |
| **Impacto** | Medio — Stock de variedad incorrecta descontado; reportes de consumo errados |
| **Área** | `hoppers`, `inventory` |
| **Sprint de implementación** | Sprint 2 |
| **Estado** | ✅ Decisión tomada — pendiente de implementar |

**Descripción**: El operador configura la variedad incorrecta en la tolva (ej. registra Colombia pero en realidad cargó Brasil). Todos los descuentos de stock del día apuntan a la variedad equivocada.

**Decisión de negocio (19/09/2026)**:  
> _"Debe existir un mecanismo que, al corregir la configuración de la tolva, realice un ajuste sobre todos los movimientos de stock generados en el día por esa tolva y corrija la situación."_

**Diseño del mecanismo de corrección**:

1. **Detección del error**: El supervisor advierte que la tolva tenía la variedad equivocada cargada.

2. **Acción del usuario**: En la pantalla de configuración de tolvas, el supervisor puede ejecutar "Corregir configuración del día" para un slot específico, indicando:
   - Variedad incorrecta (la que estaba registrada)
   - Variedad correcta (la que realmente estaba cargada)
   - Fecha a corregir (por defecto: hoy)
   - Motivo de corrección (texto libre, obligatorio)

3. **Proceso del sistema** (`POST /api/hoppers/correct`):
   ```
   a. Buscar todos los StockMovements del día con:
      - type = SALE
      - productId = coffeeProductId de la variedad INCORRECTA
      - referenceType = 'account_item'
      - createdAt entre inicio y fin del día indicado
      - que tengan como origen una receta con isHopperSlot = true para ese slot
   
   b. Por cada movimiento encontrado:
      - Crear StockMovement de tipo ADJUSTMENT con signo POSITIVO
        sobre la variedad INCORRECTA (devuelve el stock)
      - Crear StockMovement de tipo ADJUSTMENT con signo NEGATIVO
        sobre la variedad CORRECTA (descuenta del stock real)
      - Ambos movimientos referencian el movimiento original (referenceId)
      - notes: "Corrección por error de configuración de tolva [slot N] del [fecha]"
   
   c. Actualizar stocks:
      - Stock variedad INCORRECTA += total descontado por error
      - Stock variedad CORRECTA -= total descontado por error
   
   d. Actualizar HopperConfig:
      - Marcar la config incorrecta como inactiva
      - Crear nueva HopperConfig con la variedad correcta para la fecha
      - Campo: correctedAt, correctedByUserId, correctionReason
   
   e. Registrar en AuditLog la corrección masiva con resumen:
      - Cuántos movimientos se corrigieron
      - Total de gramos reasignados
      - Usuario que ejecutó la corrección
   ```

4. **Lo que NO cambia**: Los `AccountItem` y sus precios/costos cobrados **no se modifican**. El `unitCost` del café puede diferir levemente entre variedades, pero se acepta que la corrección opera a nivel de stock (la diferencia de costo se absorbe como ajuste). Esta es una decisión deliberada de simplicidad operativa.

5. **Prevención**: Pantalla de confirmación con resumen visual antes de guardar la configuración inicial del día.

---

## ✅ Riesgos Resueltos por Diseño (sin implementación adicional requerida)

| ID | Riesgo | Cómo se resolvió |
|----|--------|-----------------| 
| R-03 | Receta desactualizada aplicada retroactivamente | `AccountItem` guarda referencia a versión de receta usada |
| R-04 | Cambio de costo de insumo afecta rentabilidad histórica | `unitCost` congelado en `AccountItem` al momento de entrega |
| R-07 | Producto elaborado sin receta activa intentado entregar | Validación en backend: tipo `ELABORATED` sin receta activa → error 422 |

---

## Instrucciones para el equipo

1. **Al iniciar cada sprint**, revisar este documento y verificar si algún riesgo activo o pendiente de implementar corresponde al trabajo planificado.
2. **Al implementar la mitigación** de un riesgo, moverlo a la sección "Resueltos por diseño" con una nota de cómo se implementó en código.
3. **Si se identifica un nuevo riesgo** durante el desarrollo, agregarlo aquí con el mismo formato.
