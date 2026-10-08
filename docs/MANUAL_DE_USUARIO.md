# Manual de Usuario - Sistema Integral de Cafetería

Bienvenido al nuevo **Sistema Integral de Gestión de Cafetería**. Este manual ha sido diseñado para ayudar a cajeros, baristas y administradores a utilizar todas las funciones del sistema en su día a día.

---

## 1. Acceso al Sistema

Para ingresar al sistema, abrí tu navegador web y dirígete a la dirección proporcionada por tu administrador.
- Ingresá tu **Usuario** y **Contraseña**.
- Hacé clic en **Ingresar**.
*Nota: Las pantallas y permisos que veas dependerán del rol que tengas asignado (Cajero, Barista, Administrador).*

---

## 2. Punto de Venta (POS) y Cuentas

Este es el módulo principal que usarás durante el servicio para tomar pedidos y cobrar.

### Abrir una Nueva Cuenta
1. Dirígete a la sección **Ventas > POS (Punto de Venta)** en el menú lateral.
2. Vas a ver la pantalla dividida: a la izquierda tus cuentas activas y a la derecha el catálogo de productos.
3. Hacé clic en el botón **"Nueva Cuenta"** (botón verde en la parte inferior izquierda).
4. Escribí un nombre o referencia para la cuenta (Ej: "Mesa 4", "Juan para llevar").
5. La cuenta nueva aparecerá seleccionada y lista para recibir productos.

### Agregar Productos a una Cuenta
1. Con una cuenta seleccionada, usá el panel derecho para explorar el **Catálogo**.
2. Podés buscar un producto escribiendo su nombre en la barra de búsqueda o navegando por las categorías.
3. Hacé clic en un producto para agregarlo. Se sumará inmediatamente al ticket de la cuenta seleccionada en estado `PENDING` (Pendiente de entrega).

### Entregar Productos y Mermas (Importante)
A diferencia de otros sistemas, aquí **el stock se descuenta en el momento en que entregas la bebida**, no al momento de cobrarla.
1. En el ticket, vas a ver los productos en color naranja (`PENDING`).
2. Una vez que el producto fue preparado y entregado al cliente, hacé clic en el botón **"Entregar"** (ícono de cajita/check).
3. En ese momento, el sistema descontará los granos de café de la tolva y los insumos del inventario. El producto pasará a estado verde (`DELIVERED`).
4. **Cortesías o Mermas:** Si necesitas dar de baja un producto sin cobrarlo (porque se preparó mal, se derramó, o es una cortesía), hacé clic en el botón rojo con ícono de basura. El sistema te pedirá que ingreses un **motivo obligatorio**. El producto desaparecerá de la cuenta (no se le cobrará al cliente) pero el sistema descontará el stock correspondiente justificando el movimiento bajo ese motivo.

### Cobrar y Cerrar la Cuenta
1. Una vez que el cliente pide la cuenta, verificá el **Total** en la parte inferior del ticket.
2. Hacé clic en **"Cobrar"**.
3. Se abrirá una ventana donde podrás ingresar:
   - El **Método de Pago** (Ej: Efectivo, Tarjeta de Crédito, MercadoPago).
   - Si dejó **Propina**, podés ingresar el monto exacto.
4. Confirmá el cobro. La cuenta desaparecerá de las cuentas activas y pasará al historial de ventas.

### Ver el Historial de Ventas
1. Dirígete a **Administración > Ventas** (o Historial de Ventas).
2. Aquí verás una lista de todos los tickets cerrados en el día, con la hora de apertura, cierre, y el método de pago.
3. Hacé clic en la "flechita" al inicio de cualquier fila para **desplegar el detalle** y ver exactamente qué productos se vendieron en ese ticket.

---

## 3. Inventario y Tolvas

El manejo correcto del inventario garantiza que siempre sepamos qué insumos tenemos disponibles.

### Configurar Tolvas (Baristas)
Al iniciar el turno, es fundamental indicarle al sistema qué café en grano se cargó en las máquinas.
1. Andá a **Inventario > Tolvas**.
2. Verás las tolvas configuradas. Si cambias el grano de una tolva, hacé clic en **Editar** y seleccioná la nueva **Variedad de Café** que estás introduciendo.
3. *Nota:* Cuando vendas un "Café Espresso", el sistema descontará automáticamente los gramos correspondientes de esta tolva específica. Si hay más de una tolva activa, el sistema te preguntará de qué tolva lo preparaste al momento de venderlo.

### Recepción de Mercadería (Compras)
Cuando llega mercadería nueva al local, debe ingresarse al sistema.
1. Dirígete a **Inventario > Órdenes de Compra**.
2. Podés registrar el pedido a un proveedor. Cuando el proveedor te entregue la mercadería, marca la orden como **"Recibida"**.
3. El sistema ingresará automáticamente todos esos insumos a tu stock bajo el método FIFO (lo primero que entra es lo primero que se consume).

### Visor de Stock en Vivo
1. Dirígete a **Inventario > Stock**.
2. Vas a poder ver la cantidad exacta disponible de cada insumo (leche, azúcar, café).
3. Aquí también podés ver los movimientos históricos (qué día ingresó mercadería y qué día se descontó por ventas o mermas).

---

## 4. Catálogo y Recetas (Administradores)

La sección de Catálogo es donde se "arman" los productos que luego se venderán en el POS.

### Crear un Producto Base
1. Andá a **Catálogo > Productos**.
2. Hacé clic en **"Nuevo Producto"**.
3. Llená los datos como Nombre, Categoría, Tipo (Ej: "Venta Directa" o "Preparado") y su precio.

### Crear y Editar Recetas
Si un producto es "Preparado" (como un Latte o un Sándwich), necesita una receta para que el sistema sepa qué descontar del inventario.
1. Andá a **Catálogo > Recetas**.
2. Seleccioná el producto al que querés crearle la receta.
3. Agregá los ingredientes (Ej: "Leche" - 0.2 Litros; "Café" - Uso Dinámico de Tolva).
4. Guardá la receta. Cada vez que modifiques una receta, el sistema guardará un "historial de versiones" para que no pierdas trazabilidad de los costos del mes anterior.

---

> **Recomendación para un servicio fluido:** 
> Acostumbrate a marcar los productos como **"Entregados"** en el POS a medida que van saliendo de la barra de preparación. Esto mantiene el inventario en tiempo real y evita que te olvides qué le entregaste a cada cliente.
