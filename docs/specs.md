# Especificaciones Funcionales MVP - ShareMyPrompt

## 1. Propósito y Roles

El objetivo del MVP es permitir el ciclo completo de negocio: publicación, revisión, venta y soporte de activos técnicos de IA [13].

### Roles del Sistema [14, 15]:

- **ADMIN:** Control total, gestión de usuarios/expertos, resolución de disputas y configuración SEO [14].
- **EXPERTO:** Usuario autorizado para vender activos, gestionar su catálogo y responder reviews [14].
- **USUARIO/COMPRADOR:** Explora, compra, descarga activos y puede solicitar convertirse en experto [6, 14].

## 2. Ciclo de Vida del Producto

Todo producto debe pasar por un flujo de estados estrictamente controlado por el ADMIN [16, 17]:

1.  **Borrador:** Creado por el experto.
2.  **Pendiente de Aprobación:** Revisión manual por el ADMIN.
3.  **Publicado:** Visible en el marketplace.
4.  **Rechazado:** Si no cumple con los pilares de calidad; requiere una nueva revisión [17].
5.  **Descatalogado:** El experto retira el producto, pero los compradores previos mantienen el acceso [11, 18].

## 3. Funcionalidades del Marketplace

- **Exploración:** Buscador central y filtros facetados por herramienta, categoría, precio y ranking [19].
- **Ficha de Producto:** Detalla precio, rating, compatibilidad, número de ventas y licencias (personal/comercial) [7, 19].
- **Sistema de Reviews:** Exclusivo para compradores verificados o usuarios que hayan descargado activos gratuitos [20].
- **Badge "Still Working":** Votación de la comunidad sobre la vigencia operativa del activo [20].

## 4. Gestión de Disputas y Soporte

- **Chat Integrado:** Comunicación asíncrona dentro de la plataforma para evitar fugas de transacciones [12].
- **Disputas:** Proceso de mediación entre comprador y experto supervisado por el ADMIN, quien tiene la decisión final [21].
- **Cierre de Cuentas:** Un experto no puede cerrar su cuenta si tiene disputas activas [21, 22].

## 5. Reglas de Negocio Críticas

- **Actualizaciones:** Cualquier cambio (menor o mayor) en un producto publicado requiere nueva aprobación del ADMIN [23].
- **Acceso Gratuito:** Si un experto mejora un producto, los compradores anteriores reciben la actualización sin coste [19, 24].
- **Moderación:** El ADMIN puede retirar productos aprobados si detecta plagio o contenido NSFW posteriormente [9].
- **Finanzas:** Compras directas (sin cupones en el MVP) con generación de facturas y reembolsos excepcionales [10].

## 6. Panel de Analítica

- **Expertos:** Métricas de ventas, visitas, conversiones y ratings [4].
- **Admin:** Seguimiento de ingresos, usuarios activos e interacciones por experto [4].
