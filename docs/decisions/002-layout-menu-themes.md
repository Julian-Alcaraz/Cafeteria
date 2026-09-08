# Decisión Arquitectónica: Refactor de Layout, Menús Dinámicos y Sistema de Temas

## Contexto
El sistema contaba con un `LayoutComponent` monolítico que contenía la lógica de la barra superior y del menú lateral, incluyendo un diseño rígido. Adicionalmente, el diseño del esquema de colores estaba limitado a una paleta estática, y los submenús estaban renderizados pero no contaban con un sistema expansible dinámico de tipo acordeón.

## Decisiones Tomadas

### 1. Extracción a Standalone Components (Topbar y Sidebar)
- Se dividió la responsabilidad del `LayoutComponent` en dos componentes Standalone separados: `TopbarComponent` y `SidebarComponent`.
- **Razón**: Mejorar la mantenibilidad, aplicar el principio de responsabilidad única (SRP) y facilitar los tests unitarios. `LayoutComponent` ahora actúa puramente como orquestador del contenedor padre y el `<router-outlet>`.

### 2. Comportamiento Genérico de Submenús (Acordeón)
- En lugar de anidar navegación de manera incondicional, el `SidebarComponent` evalúa dinámicamente el payload de `AuthService.session().menus`. 
- Si un menú tiene `children`, se renderiza como un botón toggle con estado (manejado vía el diccionario `expandedMenus`) en lugar de navegar.
- **Razón**: Permite la escalabilidad de la navegación. Cualquier estructura de menú jerárquico traída del backend se renderizará y funcionará sin tocar el HTML nuevamente.

### 3. Sistema de Temas Alternables
- Se definió un sistema de paletas en variables CSS (`styles.css`).
- Se introdujo el `ThemeToggleComponent` como Standalone Component inyectado en el `TopbarComponent`.
- El componente alterna una clase `.dark-theme` sobre el tag `<body>` para sobreescribir las variables CSS globales, y persiste la decisión en `localStorage('app-theme')`.
- **Razón**: Proveer flexibilidad estética al usuario final y establecer una arquitectura base limpia para futuras alteraciones visuales sin recargar estilos (CSS puro + cascade).

## Consecuencias
- La interfaz es 100% responsiva con comportamientos nativos diferenciados (colapso de barra a nivel ícono en escritorio y cajón deslizante en móvil).
- Facilita testear independientemente el Theme, el Header y el Menú lateral.
- Se debe tener la precaución de actualizar `auth.service.ts` si en el futuro la estructura `MenuNode` requiere más niveles de anidamiento (actualmente soporta 1 nivel de hijos genéricos).
