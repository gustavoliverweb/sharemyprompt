# Arquitectura del Sistema - ShareMyPrompt

## 1. Visión General

**ShareMyPrompt** es un marketplace global diseñado para profesionalizar el uso de la Inteligencia Artificial mediante la comercialización de activos técnicos como prompts, automatizaciones y scripts [1, 2]. El sistema está construido con un enfoque modular y desacoplado para permitir la escalabilidad de sus componentes principales: catálogo, checkout, biblioteca y mensajería [3].

## 2. Stack Tecnológico

- **Frontend & SEO:** **Next.js** para garantizar un renderizado óptimo y posicionamiento en buscadores [4].
- **Estilos:** **Tailwind CSS** para un diseño responsive y modular, **Aceternity UI** como base para componentes UI.
- **Base de Datos:** **PostgreSQL** para la gestión de datos relacionales [4].
- **Almacenamiento:** **AWS S3** (o equivalente) para el guardado de archivos protegidos (JSON, ZIP, Python, PDF) [4, 5].
- **Seguridad:** Enlaces de descarga protegidos y firmados con caducidad limitada [4].

## 3. Pilares del Sistema (Framework de Calidad)

La plataforma se rige por un **framework obligatorio de 6 pilares** que garantiza la calidad de los activos [5]:

1.  **Role (Rol):** Definición de la identidad que debe asumir la IA.
2.  **Context (Contexto):** Información de fondo necesaria para la tarea.
3.  **Task (Tarea):** La acción específica a realizar.
4.  **Format (Formato):** Estructura de la respuesta esperada.
5.  **Constraints (Restricciones):** Limitaciones o reglas de exclusión.
6.  **Iterations (Iteraciones):** Instrucciones para el refinamiento continuo.

**Validación:** El sistema bloquea la publicación si estos campos no cumplen con un mínimo de **100 caracteres** por bloque [6].

## 4. Arquitectura de URLs (SEO Friendly)

El sistema utiliza slugs descriptivos generados automáticamente [7, 8]:

- **Home:** `/`
- **Exploración:** `/explore/`
- **Categorías:** `/category/[slug]/`
- **Herramientas:** `/tool/[slug]/`
- **Productos:** `/p/[slug]/`
- **Perfiles de Expertos:** `/u/[username]/` [3].

## 5. Módulos Desacoplados

- **Módulo de Moderación:** Capa automática y manual para filtrar contenido prohibido o plagio [9, 10].
- **Módulo de Checkout:** Gestión de carrito y transacciones directas con aplicación de comisiones [10, 11].
- **Módulo de Biblioteca:** Acceso de por vida a productos comprados o gratuitos, con límite de 5 descargas por usuario [11].
- **Módulo de Mensajería:** Chat asíncrono con soporte para adjuntos entre usuarios y expertos [12].
