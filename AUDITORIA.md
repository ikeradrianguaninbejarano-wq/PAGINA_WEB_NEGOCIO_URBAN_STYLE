# Auditoría de accesibilidad, UX y diseño responsive — URBAN STYLE

**Fecha:** 24 de septiembre de 2026
**Alcance:** `index.html`, `assets/css/styles.css`, módulos JavaScript en `js/` (`app.js`, `cart.js`, `products.js`, `utils.js`, `validation.js`), `data/productos.json` y recursos `assets/img/`.
**Estándar:** WCAG 2.2 nivel AA, buenas prácticas de UX y diseño responsive.
**Método:** auditoría no destructiva (análisis estático + ejecución de módulos en Node + cálculo de contraste WCAG). No se modificó ningún archivo del proyecto.

> **Nota sobre el alcance:** no existe un archivo `script.js` en la raíz. El punto de entrada JavaScript es `js/app.js` (módulo ES6), que importa `products.js`, `cart.js`, `utils.js` y `validation.js`. La auditoría cubre todos esos módulos.

## 1. Resumen ejecutivo

La página presenta una base sólida de accesibilidad: HTML semántico correcto, un único `h1`, jerarquía de encabezados sin saltos, enlace "Saltar al contenido", navegación por teclado con foco visible, textos alternativos en todas las imágenes, labels asociados a todos los campos y ARIA usado con moderación y corrección. El diseño responsive está bien resuelto con media queries en 640/700/1000 px y no se detecta overflow horizontal en 320 px.

Se encontraron **2 hallazgos altos** (ambos de contraste de texto, WCAG 1.4.3 AA), **2 medios** (contraste no textual de los bordes del formulario, WCAG 1.4.11 AA, y enlaces de categorías con propósito engañoso) y **4 bajos** (objetivo táctil de la navegación, formulario sin botón de envío, CSS sin uso y atributos de dimensión en imágenes). **No hay hallazgos críticos.** El JavaScript es sintácticamente válido y su lógica se ejecutó sin errores.

## 2. Hallazgos

### Críticos

No se detectaron hallazgos críticos.

### Altos

#### H1. Contraste insuficiente del texto `.eyebrow` (WCAG 1.4.3 Contraste mínimo, AA)

- **Archivo/elemento:** `assets/css/styles.css`, línea 39 (`.eyebrow { color: #6a7f3a; ... }`). Afecta a 4 de los 5 usos en `index.html`: línea 42 ("Encuentra tu básico"), línea 57 ("Selección URBAN STYLE"), línea 76 ("Nuestra idea") y línea 83 ("Hablemos").
- **Causa:** el color `#6a7f3a` no alcanza 4.5:1 sobre ninguno de los fondos donde se usa.
- **Evidencia (ratios calculados con la fórmula WCAG):**
  - Sobre `--paper` (#f4f3ee): **4.01:1** (Categorías y Contacto).
  - Sobre `--white` (#fffefa): **4.42:1** (Catálogo).
  - Sobre `#20231e` (sección Nosotros): **3.57:1**.
- **Impacto:** texto pequeño (0.7rem ≈ 11.2 px, en negrita y mayúsculas) por debajo del mínimo AA; dificulta la lectura a usuarios con baja visión. El único uso que cumple es el del hero (`.hero .eyebrow` en lima sobre fondo oscuro, 14.82:1).
- **Corrección:** oscurecer el color del eyebrow (p. ej. `#55682e` o `#4f6129`) y verificar que alcance ≥4.5:1 sobre los tres fondos (paper, white y #20231e). Alternativa: definir un color específico para la sección "Nosotros" (p. ej. `#c3c7bd` o lima).

#### H2. Contraste insuficiente de `.product-category` (WCAG 1.4.3, AA)

- **Archivo/elemento:** `assets/css/styles.css`, línea 69 (`.product-category { color: #6a7f3a; ... }`). Afecta a las 8 tarjetas de producto en `index.html`, líneas 61-68.
- **Causa:** mismo color `#6a7f3a` sobre el fondo blanco `--white`.
- **Evidencia:** ratio **4.42:1** (se necesita ≥4.5:1 para texto normal; 0.65rem ≈ 10.4 px en negrita no califica como texto grande).
- **Impacto:** las etiquetas de categoría ("Camisetas", "Pantalones", etc.) son difíciles de leer.
- **Corrección:** usar el mismo color oscurecido que en H1 (p. ej. `#55682e`) o `--muted` (#696d65, 5.23:1 sobre blanco).

### Medios

#### M1. Borde de los campos del formulario sin contraste suficiente (WCAG 1.4.11 Contraste no textual, AA)

- **Archivo/elemento:** `assets/css/styles.css`, línea 86 (`.field input, .field textarea { border: 1px solid #b8bbb2; ... }`). Campos en `index.html`, líneas 85-89.
- **Causa:** el borde `#b8bbb2` sobre el fondo blanco del campo tiene **1.93:1** (sobre el fondo de página `--paper`, 1.75:1). El fondo blanco del campo frente al fondo de página es ~1.1:1, por lo que el borde es el único indicador visual del límite del componente.
- **Impacto:** los límites de los campos no son perceptibles para usuarios con baja visión; falla el requisito de 3:1 para componentes de interfaz.
- **Corrección:** oscurecer el borde (p. ej. `#8a8f84` o `#767b70`) o añadir un relleno/fondo que distinga el campo del fondo de página con ≥3:1.

#### M2. Enlaces de categorías con propósito engañoso (WCAG 2.4.4 Propósito de los enlaces, A / UX)

- **Archivo/elemento:** `index.html`, líneas 46-50 (`.category-list`).
- **Causa:** los cinco enlaces ("01 Camisetas", "02 Pantalones", "03 Chaquetas", "04 Calzado", "05 Accesorios") apuntan todos a `#catalogo`. El texto sugiere que llevan a una categoría concreta, pero todos desplazan al catálogo completo.
- **Impacto:** el usuario espera filtrar por categoría y recibe el mismo contenido; genera confusión y fricción, y el propósito del enlace no coincide con su destino.
- **Corrección:** o bien implementar el filtrado por categoría (los datos ya existen en `data/productos.json` y `filterProductsByCategory` en `js/products.js`), o bien cambiar el texto/etiqueta para reflejar que conducen al catálogo general (p. ej. "Ver camisetas en la colección").

### Bajos

#### B1. Objetivo táctil reducido en la navegación principal (WCAG 2.5.8 Tamaño del objetivo, AA)

- **Archivo/elemento:** `assets/css/styles.css`, línea 33 (`.nav-list a { font-size: .78rem; ... }`); enlaces en `index.html`, líneas 19-22.
- **Causa:** los enlaces del menú tienen ~12.5 px de alto de clic (menos de 24×24 px). La excepción de "espaciado" de WCAG 2.5.8 probablemente aplica (el `gap` entre elementos es ≥16 px), por lo que **no se confirma un fallo**, pero el área de clic es pequeña.
- **Impacto:** dificultad para usuarios con motricidad fina en pantallas táctiles.
- **Corrección:** añadir `padding-block` o `min-height: 24px` (idealmente 44 px) a `.nav-list a` sin romper el diseño.

#### B2. Formulario sin botón de envío (UX)

- **Archivo/elemento:** `index.html`, líneas 84-91.
- **Causa:** el formulario declara campos `required` y `pattern`, pero no tiene botón de envío; la nota explicativa ("El envío está desactivado...") está al final del formulario.
- **Impacto:** el usuario puede completar el formulario y no encontrar cómo enviarlo; la nota llega tarde. Es un comportamiento intencional según `README.md`, pero conviene comunicarlo antes.
- **Corrección:** mover la nota al inicio del formulario o añadir un botón de envío deshabilitado con `aria-disabled` y texto explicativo.

#### B3. CSS sin uso: `.button-dark` (mantenibilidad)

- **Archivo/elemento:** `assets/css/styles.css`, líneas 92-93.
- **Causa:** la clase `.button-dark` está definida pero ningún elemento del HTML la utiliza.
- **Impacto:** código muerto que aumenta el mantenimiento.
- **Corrección:** eliminar la regla o aplicarla cuando exista un botón real.

#### B4. Imágenes sin atributos `width`/`height` (rendimiento / CLS)

- **Archivo/elemento:** `index.html`, líneas 61-68.
- **Causa:** las 8 `<img>` no declaran dimensiones. El CSS mitiga el desplazamiento de layout con `aspect-ratio` (línea 68 de `styles.css`), por lo que el riesgo de CLS es bajo.
- **Impacto:** sin dimensiones intrínsecas declaradas, el navegador depende del CSS; añadir `width`/`height` es una buena práctica.
- **Corrección:** añadir `width="600" height="660"` (dimensiones del viewBox de los SVG) a cada `<img>`.

## 3. Criterios que cumplen (evidencia)

- **Estructura semántica (1.3.1):** `header`, `nav`, `main`, `footer`, `section` con `aria-labelledby`, `article` para productos, listas `ul` correctas.
- **Jerarquía de encabezados (1.3.1 / 2.4.6):** un único `h1` (línea 32), `h2` en cada sección, `h3` en productos; sin niveles saltados.
- **Nombres accesibles (4.1.2):** `nav` con `aria-label="Navegación principal"` (línea 17); secciones con `aria-labelledby`; todos los campos con `<label for>` (verificado: 5/5 inputs con label, 0 labels rotos).
- **Textos alternativos (1.1.1):** 8/8 imágenes con `alt` descriptivo; elementos decorativos (`hero-mark`, flechas ↗) con `aria-hidden="true"`.
- **Contraste que cumple:** texto principal `--ink`/`--paper` 15.92:1; `--muted`/`--paper` 4.75:1; `--muted`/`--white` 5.23:1; lima/ink 14.82:1; `hero-copy` 10.3:1; `hero-note` 8.36:1; texto del footer ink/lima 14.82:1; `brand-footer span` 5.46:1.
- **Navegación con teclado (2.1.1 / 2.1.2):** todos los elementos interactivos son `<a>` nativos; sin trampas de foco; orden de foco lógico (skip link → menú → contenido).
- **Foco visible (2.4.7):** `:focus-visible` global con `outline: 3px solid #517300; outline-offset: 4px` (línea 26); ratio del outline ≥4.6:1 sobre los fondos usados.
- **Enlace para saltar bloques (2.4.1):** `.skip-link` presente y visible al recibir foco (líneas 12 y 24-25).
- **Idioma (3.1.1):** `lang="es"` en `<html>`.
- **Título de página (2.4.2):** `<title>` descriptivo.
- **Identificación de propósito de entrada (1.3.5):** `autocomplete` en nombre, correo y teléfono.
- **Etiquetas e instrucciones (3.3.2):** labels visibles + ayuda con `aria-describedby` en los 5 campos.
- **ARIA (4.1.2):** sin roles inventados; `aria-hidden` solo en decorativos; referencias `aria-labelledby`/`aria-describedby` verificadas (todas apuntan a IDs existentes; 21 IDs únicos, sin duplicados).
- **Objetivos táctiles (2.5.8):** botón "Explorar colección" 48 px, enlaces de categorías 64-112 px, campos 48 px.
- **Navegación móvil:** el menú se reordena a columna y envuelve sin hamburguesa (correcto para 4 enlaces); media queries en 640/700/1000 px.
- **Overflow horizontal (1.4.10):** no se detecta en análisis estático en 320 px; `body { min-width: 320px }` evita el colapso.
- **Imágenes:** 8 SVG bien formados (XML válido) y con rutas existentes.
- **JavaScript:** sintaxis válida en los 5 módulos; lógica ejecutada sin errores; `loadProducts` funciona vía HTTP (8 productos).
- **Movimiento reducido (2.3.3 / 4.1):** `@media (prefers-reduced-motion: reduce)` desactiva scroll suave y transiciones.

## 4. Pruebas que deberían repetirse después de corregir

1. **Contraste:** recalcular ratios de `.eyebrow` y `.product-category` sobre paper, white y #20231e (objetivo ≥4.5:1) y del borde de inputs (objetivo ≥3:1). Herramientas: axe DevTools, Lighthouse o calculadora WCAG.
2. **Navegación con teclado:** recorrer toda la página con Tab/Shift+Tab y verificar foco visible en cada elemento (skip link, menú, botón, categorías, campos, footer).
3. **Lector de pantalla (NVDA/VoiceOver):** verificar que el orden de lectura coincide con el visual y que los nombres accesibles se anuncian correctamente.
4. **Responsive:** comprobar en 320, 390, 768 y ≥1000 px que no hay overflow horizontal, que el menú envuelve bien y que la cuadrícula de productos cambia a 2/3/4 columnas.
5. **Zoom 200% y 400%:** verificar que el texto reescala sin pérdida de contenido (1.4.4 / 1.4.10).
6. **Formulario:** si se añade botón de envío, probar validación nativa y mensajes de error accesibles (`aria-invalid`, `aria-describedby`).
7. **JavaScript:** repetir `node --check` en los módulos y la carga del catálogo vía servidor HTTP; verificar en consola que no hay errores.
8. **Enlaces de categorías:** si se implementa filtrado, comprobar que el foco y el anuncio del resultado son accesibles.

## 5. Verificaciones realizadas

- **Existencia de archivos:** confirmados `index.html`, `assets/css/styles.css`, `js/app.js`, `js/cart.js`, `js/products.js`, `js/utils.js`, `js/validation.js`, `data/productos.json` y los 8 SVG en `assets/img/`. No existe `script.js` en la raíz (el punto de entrada es `js/app.js`).
- **Sintaxis JavaScript:** `node --check` aprobado en los 5 módulos (Node v26.8.1).
- **JSON:** `data/productos.json` válido; 8 productos con campos completos.
- **Ejecución de módulos:** `products.js`, `cart.js`, `validation.js` y `utils.js` probados en Node sin errores (creación/filtrado/búsqueda de productos, carrito con subtotal, validadores, formato de precio).
- **Carga asíncrona:** `loadProducts` probado contra un servidor HTTP local → 8 productos cargados correctamente. El fallo con `file://` es esperado (los módulos y `fetch` requieren HTTP, como indica el README) y se captura sin romper la página.
- **HTML:** 21 IDs únicos sin duplicados; todas las anclas `href="#..."`, `aria-labelledby`, `aria-describedby` y `label for` apuntan a destinos existentes; 8/8 imágenes con `alt`.
- **SVG:** los 8 archivos son XML bien formado.
- **Contraste:** ratios calculados con la fórmula WCAG (ver secciones 2 y 3).
- **Cambios realizados:** ninguno sobre los archivos del proyecto; solo se creó este informe `AUDITORIA.md`.

## 6. Supuestos y preguntas abiertas

- **Supuesto:** la página se sirve por HTTP (no `file://`), como indica el README; en `file://` el `fetch` falla pero se captura.
- **Supuesto:** los SVG son ilustraciones provisionales; su texto interno ("URBAN STYLE · 01") no se expone a lectores de pantalla porque se cargan vía `<img>` con `alt`.
- **Pregunta abierta:** ¿los enlaces de categorías deben filtrar el catálogo en una etapa posterior? (afecta a M2).
- **Pregunta abierta:** ¿se añadirá un botón de envío al formulario en la siguiente etapa? (afecta a B2).
- **Limitación:** la verificación de overflow horizontal y foco se hizo por análisis estático; se recomienda confirmar en navegador real (Chrome DevTools, modo dispositivo).
