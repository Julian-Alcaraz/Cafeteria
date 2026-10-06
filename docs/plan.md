# Plan de Desarrollo - Sistema de Gestión Integral

Este documento es un registro estático paso a paso del plan del proyecto y su progreso de ejecución.

## Sprint 1: Catálogo y Recetas (COMPLETADO) ✅
- **Estado**: ✅ Completado de manera exitosa.
- **Backend**:
  - `[x]` Creación de base de datos y migraciones (Catálogo, Productos, Categorías, Variedades de Café, Recetas, Ingredientes).
  - `[x]` CRUD completo para Catálogo (Categorías, Tipos de Producto, Productos Base).
  - `[x]` CRUD completo para Variedades de Café (Relación 1 a 1 para Tolvas).
  - `[x]` CRUD y Control de Versionado para Recetas e Ingredientes.
  - `[x]` Cobertura de Tests Unitarios (100% pasando).
- **Frontend**:
  - `[x]` Estructura de módulos y ruteo lazy.
  - `[x]` UI: Listados interactivos con tablas genéricas y ordenamiento.
  - `[x]` UI: Formularios en Modales con validación en tiempo real.
  - `[x]` Lógica: Selector inteligente de Variedades de Café (filtrado de productos libres).
  - `[x]` Lógica: Duplicación de registros rápida (Botón Copiar).
  - `[x]` Reparación del Sistema de Permisos para sub-rutas anidadas de forma estricta.

## Sprint 2: Tolvas e Inventario (PRÓXIMO) ⏳
- **Estado**: ⏳ Pendiente
- **Objetivos**:
  - Implementar configuración dinámica de Tolvas de Café (HopperConfigs).
  - Control de inventario general y visualización de Stock.
  - Entradas de stock mediante Compras / Recepción de lotes (FIFO).
  - Trazabilidad e historial de movimientos.

## Sprint 3: Cuentas y Ventas (BACKLOG) 📋
- **Estado**: 📋 Backlog
- **Objetivos**:
  - Pantalla principal del POS (Punto de Venta).
  - Apertura y cierre de cuentas.
  - Agregado de ítems (Descuento en tiempo real de inventario y tolvas).
  - Manejo de entregas no cobradas con motivo obligatorio.
  - Sistema de pagos y cierre de mesa.

## Sprint 4: Reportes y Costos (BACKLOG) 📋
- **Estado**: 📋 Backlog
- **Objetivos**:
  - Congelamiento de precios de costo al momento de venta.
  - Reporte de rentabilidad (Costo vs Precio de Venta).
  - Reporte de consumo de ingredientes.
  - Logs de Auditoría (Trazabilidad de eliminación y modificaciones).
