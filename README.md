# URBAN STYLE

Proyecto académico de una tienda ficticia de ropa urbana. Esta base reúne HTML5 semántico, formularios accesibles, CSS responsive y módulos JavaScript de Semana 4; no es todavía una tienda interactiva.

## Objetivo

Construir progresivamente la interfaz y la lógica inicial del reto **“Reto 1 - Carrito de Compras – Integración de HTML5, CSS3, JavaScript y Accesibilidad Web”**, avanzando solo hasta los temas vistos en las semanas 1 a 4.

## Tecnologías y contenidos

- **Semana 1:** documento HTML5, landmarks semánticos, jerarquía de encabezados, navegación por teclado y enlace para saltar al contenido.
- **Semana 2:** formulario con labels, tipos de input, autocomplete, required, límites, pattern y ayuda asociada con `aria-describedby`. Incluye validadores JS reutilizables; no se conectan al formulario mediante eventos en esta etapa.
- **Semana 3:** CSS3 mobile first, variables, box model, Flexbox, Grid, media queries, estados hover/focus y movimiento reducido.
- **Semana 4:** ES6+, clases, funciones, módulos, import/export, arrays, map/filter/find, for-of, switch, expresiones regulares, Promises y Fetch con async/await y manejo de errores.

## Estructura

```text
.
├── index.html
├── README.md
├── assets/
│   ├── css/styles.css
│   └── img/                 # Ilustraciones SVG locales y guía
├── data/productos.json
└── js/
    ├── app.js
    ├── cart.js
    ├── products.js
    ├── utils.js
    └── validation.js
```

### Módulos JavaScript

- `products.js`: clase `Product`, validación de registros, carga del catálogo JSON con una cadena de Promises, búsqueda por identificador y filtro por categoría.
- `cart.js`: clase `Cart` con operaciones de agregar, eliminar y calcular subtotal. Es lógica aislada, no está conectada a la página.
- `validation.js`: expresiones regulares y validadores puros para nombre, correo, teléfono, asunto y mensaje. Devuelve errores comprensibles sin manipular el DOM.
- `utils.js`: normalización de texto, formato de precios y creación de errores.
- `app.js`: punto de entrada que carga el JSON y muestra un resumen de diagnóstico en consola. No genera ni actualiza contenido del DOM.

## Catálogo JSON y carga asíncrona

`data/productos.json` contiene los ocho productos requeridos, sus categorías, descripciones, precios y rutas de imágenes locales. `loadProducts()` usa `fetch` y encadena sus Promises con `.then()`/`.catch()`; comprueba la respuesta HTTP, valida la estructura de los registros y propaga errores con contexto. `app.js` consume esa Promise mediante `async/await`, la captura y ejecuta `finally`.

## Accesibilidad

- HTML semántico, un solo `h1`, labels enlazados a campos e imágenes con texto alternativo.
- Enlace “Saltar al contenido”, navegación por teclado y foco visible.
- Contraste de texto, enlaces distinguibles y opción del sistema para reducir movimiento.
- El formulario emplea validación nativa y textos de ayuda asociados visualmente. Los errores accesibles personalizados (`aria-describedby`, `aria-invalid`) se integrarán cuando corresponda trabajar el DOM y los eventos.

## Diseño responsive

La composición parte de pantallas móviles y amplía la cuadrícula en 700 px y 1000 px. Los contenedores fluidos y los tamaños tipográficos flexibles cubren anchos de 320, 375, 768, 1024 y 1440 px.

## Formulario y datos

El formulario no tiene botón de envío, servidor de destino ni mecanismo que transmita información. Sus restricciones HTML5 están declaradas para la siguiente etapa. Los validadores JavaScript pueden probarse desde módulos, pero no muestran errores personalizados en la página porque eso implicaría conectar eventos y modificar el DOM.

## Promises, async/await, Fetch y errores

El módulo de productos carga el archivo JSON local con Fetch. Los errores HTTP, de lectura o de datos inválidos se convierten en `Error` con mensajes claros. Se necesita un servidor estático local porque los navegadores suelen bloquear `fetch()` sobre archivos `file://`.

### Ejecutar localmente

Desde la carpeta raíz, inicia un servidor estático. Por ejemplo, si tienes Python instalado:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000` en el navegador. También puedes usar la función de servidor local de tu editor. No abras `index.html` directamente desde el sistema de archivos: los módulos y Fetch necesitan un origen HTTP.

## Funcionalidades pendientes

En semanas posteriores se podrán incorporar manipulación del DOM, eventos, presentación dinámica del catálogo, mensajes personalizados del formulario, carrito interactivo y persistencia con `localStorage`, `sessionStorage`, IndexedDB o cookies. También podrían añadirse APIs. **Nada de eso se implementa en esta entrega.** No hay backend, autenticación, base de datos ni API externa.
