# Manual de Usuario - Sistema Integral de Gestión de Cafetería

## 1. Introducción

### Objetivo del sistema
El Sistema Integral de Gestión de Cafetería tiene como objetivo centralizar, optimizar y auditar todas las operaciones críticas del negocio. Desde la toma de pedidos y cobros en mostrador, hasta la gestión milimétrica del inventario, costos de recetas y trazabilidad de insumos (como tolvas de café).

### Alcance
El sistema cubre el ciclo de vida completo de la operación:
1. **Backoffice**: Creación de catálogo, diseño de recetas, configuración de tolvas y roles de usuarios.
2. **Supply Chain**: Registro de proveedores, carga de órdenes de compra, y control de stock FIFO (First-In, First-Out).
3. **Frontoffice (POS)**: Punto de venta interactivo, gestión de mesas/cuentas, mermas, propinas y cobros.
4. **Auditoría**: Monitoreo de seguridad y seguimiento en tiempo real de operaciones sensibles.

### Público objetivo
Este manual está dirigido a todos los colaboradores del negocio (Cajeros, Baristas, Encargados y Gerentes), pero está redactado desde la perspectiva de un **Administrador Total (Superadmin)** que tiene visibilidad absoluta de todos los módulos.

### Descripción general
Es una plataforma web moderna, rápida e intuitiva, que opera en la nube y se actualiza en tiempo real, garantizando que el stock descontado en la caja impacte instantáneamente en los depósitos y reportes financieros.

---

## 2. Acceso al Sistema

### Requisitos previos
- Dispositivo (PC, Tablet o Móvil) con conexión a internet estable.
- Navegador web actualizado (Chrome, Edge o Safari).
- Credenciales de acceso provistas por Recursos Humanos o Gerencia.

### Inicio de sesión
1. Ingresar a la URL del sistema.
2. Ingresar Nombre de Usuario y Contraseña en el panel de autenticación.
3. Hacer clic en **"Iniciar Sesión"**.

### Recuperación de contraseña
*(Nota: Actualmente en fase administrativa. Si el usuario olvida la contraseña, debe solicitar un blanqueo al administrador del sistema mediante ticket interno).*

### Cierre de sesión
Para salir del sistema de forma segura, hacer clic en el nombre de perfil (esquina superior derecha) y seleccionar **"Cerrar Sesión"**.

### Gestión de perfil
Al hacer clic en el icono de usuario superior derecho, el sistema muestra el rol asignado actual.

---

## 3. Navegación General

### Menú principal y lateral
El menú lateral izquierdo (Sidebar) agrupa funcionalmente el sistema. Puede colapsarse para mayor espacio visual. Se divide típicamente en:
- **POS / Ventas**: Operativa diaria en caja.
- **Catálogo**: Gestión de oferta gastronómica.
- **Inventario**: Depósito y compras.
- **Configuración**: Usuarios, roles y auditoría.

### Barra superior
Contiene:
- **Botón de Colapso del Menú** (Hamburguesa).
- **Toggle Modo Oscuro / Claro**: Cambia el contraste de la interfaz para comodidad visual.
- **Perfil de Usuario**: Desplegable de sesión.

### Búsquedas globales y Atajos
Cada tabla del sistema cuenta con un campo de **Búsqueda (Filtro Inteligente)** en la parte superior derecha que busca en todas las columnas visibles simultáneamente sin necesidad de recargar la página.

---

## 4. Gestión de Usuarios

### Pantalla de Usuarios

#### Descripción
Permite administrar al personal que accede al sistema, controlando credenciales y estados.

#### Acceso
Menú lateral > Configuración > Usuarios

#### Campos

| Campo | Descripción | Obligatorio | Observaciones |
|---------|---------|---------|---------|
| Username | Nombre de acceso del usuario | Sí | Debe ser único. |
| Password | Contraseña de acceso | Sí | Solo requerida al crear. |
| Activo | Estado de habilitación en el sistema | Sí | Un usuario inactivo no puede loguearse. |

#### Acciones Disponibles

| Acción | Descripción |
|---------|---------|
| Nuevo Usuario | Abre formulario para creación. |
| Editar | Modifica datos del usuario existente. |
| Deshabilitar | Bloquea el acceso sin eliminar el registro histórico. |

#### Flujo Operativo
1. Clic en "Nuevo Usuario".
2. Completar formulario con nombre y contraseña segura.
3. Guardar cambios (Aparecerá notificación Toast verde).

#### Resultado Esperado
El usuario nuevo podrá loguearse inmediatamente, pero sin permisos hasta que se le asigne uno.

#### Errores Posibles
- `Username already exists`: El nombre elegido ya pertenece a otro colaborador.

#### Buenas Prácticas
- Nunca compartir contraseñas genéricas. Asignar un usuario por colaborador.

---

## 5. Gestión de Clientes

Actualmente, el sistema no gestiona una base de datos de clientes recurrentes (CRM). La información del cliente se captura de manera **transaccional** dentro del Punto de Venta.

### Pantalla: Identificación en POS

#### Descripción
Captura el nombre o referencia del cliente temporal para identificar su pedido (Ej: "Mesa 4", "Para Llevar Juan").

#### Acceso
Ventas > POS > Nueva Cuenta

#### Campos

| Campo | Descripción | Obligatorio | Observaciones |
|---------|---------|---------|---------|
| Nombre / Referencia | Identificador visual para el barista o cajero. | No | Ayuda al llamado del pedido. |

#### Buenas Prácticas
Usar nomenclatura estandarizada (Ej: "M-04" para mesas, "LLEVA-Ana" para take-away).

---

## 6. Gestión de Operaciones

### Pantalla de Punto de Venta (POS)

#### Descripción
El corazón operativo de la cafetería. Centraliza la apertura de cuentas, toma de pedidos, mermas y cobros.

#### Acceso
Ventas > POS

#### Campos (Dentro del Ticket)

| Campo | Descripción | Obligatorio | Observaciones |
|---------|---------|---------|---------|
| Categoría | Filtro rápido superior | No | Filtra el catálogo derecho. |
| Ítem | Producto seleccionado | Sí | |
| Estado | PENDING (Naranja) / DELIVERED (Verde) | Automático | Define si ya descontó stock. |
| Total | Sumatoria monetaria de la cuenta | Automático | |

#### Acciones Disponibles

| Acción | Descripción |
|---------|---------|
| Nueva Cuenta | Abre un ticket vacío. |
| Agregar Ítem | Suma el producto al ticket activo en estado PENDING. |
| Entregar (Check verde) | Marca como preparado y descuenta stock en tiempo real. |
| Eliminar/Merma (Basura) | Anula el ítem y exige seleccionar un motivo de merma. |
| Cobrar | Cierra el ticket monetariamente. |

#### Flujo Operativo
1. Seleccionar o crear "Nueva Cuenta".
2. Tocar productos del panel derecho para añadirlos.
3. A medida que el barista los sirve, tocar el botón verde "Entregar" en cada línea.
4. Cuando el cliente se retira, clic en "Cobrar".
5. Seleccionar método de pago, ingresar propina y "Confirmar".

#### Resultado Esperado
El ticket desaparece del panel de cuentas activas, ingresa dinero a la caja teórica y el stock fue debitado correctamente.

#### Errores Posibles
- *Stock Insuficiente*: Al intentar "Entregar", el sistema avisa que no hay insumos.
- *Error de Tolva*: Intenta entregar un café, pero no hay una Tolva configurada o no se seleccionó una.

#### Buenas Prácticas
- **La Regla de Oro**: Marcar como "Entregado" *apenas* se entrega físicamente el producto. Nunca esperar al momento del cobro, para evitar desfasajes en inventario.

---

## 7. Gestión de Productos

### Pantalla de Catálogo y Recetas

#### Descripción
Permite dar de alta los productos que se mostrarán en el POS y estructurar las "fórmulas" (recetas) que componen cada producto complejo.

#### Acceso
Catálogo > Productos

#### Campos Principales

| Campo | Descripción | Obligatorio | Observaciones |
|---------|---------|---------|---------|
| Nombre | Nombre comercial del producto | Sí | |
| Precio | Valor final de venta al público | Sí | |
| Tipo | Producto Simple / Producto Preparado | Sí | Si es "Preparado", requerirá Receta. |

#### Acciones Disponibles

| Acción | Descripción |
|---------|---------|
| Copiar | Duplica un producto completo para crear variaciones rápido. |
| Editar Receta | Abre el constructor de fórmulas (Ingredientes y cantidades). |

#### Flujo Operativo (Armar Receta)
1. Clic en "Recetas" del menú lateral.
2. Seleccionar "Flat White".
3. Clic en "Añadir Ingrediente". Seleccionar "Leche", Cantidad "0.15", Unidad "Litros".
4. Añadir Ingrediente. Seleccionar "Café Especial" -> Marcar como *Consumo de Tolva Dinámica*.
5. Guardar.

#### Resultado Esperado
Cuando se venda un "Flat White", descontará 150ml de leche del stock y la cantidad de gramos de la tolva activa elegida en caja.

#### Errores Posibles
- Asignar una unidad de medida incorrecta (Ej: poner 150 Litros de leche en lugar de 0.15).

#### Buenas Prácticas
Revisar siempre dos veces las conversiones métricas (Gramos a Kilos, Mililitros a Litros).

---

## 8. Configuración del Sistema

### Configuración de Tolvas de Café (Hoppers)

#### Descripción
Asigna físicamente qué variedad de grano hay en cada máquina molinillo cada mañana.

#### Acceso
Inventario > Tolvas

#### Flujo Operativo
1. Acceder al inicio del turno.
2. Seleccionar la Tolva 1.
3. Asignarle la "Variedad Colombia Tostado Medio".
4. Guardar.

#### Resultado Esperado
El sistema enrutará todos los descuentos de café de las recetas hacia el stock de "Colombia Tostado Medio" mientras esta tolva esté activa.

---

## 9. Reportes y Consultas

### Historial de Ventas

#### Descripción
Un libro mayor de todos los tickets cerrados en la historia del local.

#### Acceso
Administración > Ventas (Historial)

#### Campos

| Campo | Descripción | Observaciones |
|---------|---------|---------|
| ID | Número de ticket | Único e irrepetible. |
| Creado Por | Usuario cajero que operó | |
| Apertura / Cierre | Marcas de tiempo de estadía | |
| Total | Monto final | Incluye propinas detalladas abajo. |

#### Acciones Disponibles
- **Expandir (Flechita)**: Muestra el desglose exacto de los ítems consumidos en ese ticket específico, su precio unitario al momento de la venta y su estado final.

#### Buenas Prácticas
Ideal para conciliación de caja al final del turno cruzando "Total" vs el "Método de Pago" reportado.

---

## 10. Notificaciones

El sistema utiliza **Notificaciones Toast** (carteles emergentes en la esquina inferior derecha).
- **Verde (Éxito)**: La acción se procesó correctamente en base de datos.
- **Rojo (Error)**: Operación fallida o rechazada por seguridad/stock. El formulario NO se limpiará para permitir correcciones sin perder lo tipeado.
- **Amarillo (Aviso)**: Alertas preventivas.

---

## 11. Auditoría y Seguimiento

El sistema cuenta con un submódulo de Auditoría Avanzada.
- Registra silenciosamente quién, cuándo y qué se insertó, modificó o eliminó.
- Administradores pueden acceder a **Configuración > Auditoría** para revisar trazabilidad de robo, mermas maliciosas o errores humanos severos.

---

## 12. Integraciones Externas

*(El sistema actualmente opera de forma autónoma tipo monolito cerrado. Las integraciones con AFIP o Pasarelas de Pago de hardware se preverán en sprints futuros).*

---

## 13. Administración Avanzada

El sistema de **Permisos** permite crear roles dinámicos. En lugar de perfiles fijos, el Superadmin puede ir a **Configuración > Permisos** y otorgar acceso a rutas y menús específicos a usuarios puntuales.

---

## 14. Casos de Uso Frecuentes

### Caso: Ingresó el camión de proveedores
- **Objetivo**: Cargar mercadería al sistema.
- **Paso a paso detallado**:
  1. Ir a **Inventario > Compras**.
  2. Crear "Nueva Orden de Compra". Seleccionar Proveedor (Ej. La Serenísima).
  3. Agregar ítem: Leche Entera, Cantidad: 20, Precio Costo: $1000.
  4. Guardar Orden.
  5. Clic en **"Recibir Lote"**.
- **Resultado esperado**: El visor de stock suma 20 unidades de leche entera valorizadas.

### Caso: Un cliente devuelve un café frío
- **Objetivo**: Rehacer el café sin cobrarle de más, pero descontando inventario.
- **Paso a paso detallado**:
  1. En el POS, buscar la cuenta del cliente.
  2. En el ítem de café, clic en la "Basura" (Mermar).
  3. Elegir motivo: "Rehacer / Queja de cliente".
  4. Agregar un *nuevo* café a la cuenta, y click en Entregar.
- **Resultado esperado**: Se consumió doble porción de café de inventario, se registró el error por calidad, pero el total de la cuenta no subió.

---

## 15. Solución de Problemas

| Síntoma | Posible causa | Solución |
|---------|---------|---------|
| No aparece el menú de "Configuración" | Su usuario no tiene rol de administrador. | Solicite la asignación del permiso a Gerencia. |
| El botón de "Entregar" da error en el POS | Falta configurar una Tolva, o la variedad asignada se quedó sin stock. | Vaya a Inventario > Tolvas y asigne grano con stock. |
| Un producto recién creado no aparece en el POS | El producto quedó como Inactivo. | Editar el producto en el Catálogo y marcar casilla "Activo". |

---

## 16. Preguntas Frecuentes (FAQ)

**P: ¿Puedo modificar un ticket después de cobrarlo?**
R: No. Por cuestiones de auditoría financiera, un ticket cerrado queda bloqueado. Se debe registrar una nota de crédito/devolución manual.

**P: ¿Qué significa FIFO en los lotes de stock?**
R: First-In, First-Out. Cuando entregás una bebida, el sistema descuenta primero la leche o café del lote más antiguo (próximo a vencer) que tengas en depósito.

---

## 17. Buenas Prácticas

- **Cerrar sesión al abandonar la caja**: Evita que compañeros generen mermas a tu nombre.
- **Auditoría de mermas diaria**: Al cerrar la caja, revisar el reporte de motivos de mermas para detectar fallas recurrentes (Ej: Si hay muchas "Caídas de tazas", capacitar al personal).
- **Inventario al cierre**: Lo ideal es hacer un conteo ciego una vez por semana para comparar stock físico con el stock teórico del sistema.

---

## 18. Glosario de Términos

- **Hopper (Tolva)**: Recipiente superior de la máquina de espresso donde se aloja el grano de café.
- **Merma**: Producto que se dio de baja del inventario sin generar ganancias (pérdidas).
- **POS (Point of Sale)**: Punto de venta / Caja registradora.
- **Toast**: Mensaje rectangular pequeño que avisa el resultado de una acción en la esquina de la pantalla.
- **Lote (Batch)**: Conjunto de mercadería que ingresó al mismo tiempo y mismo costo al depósito.
