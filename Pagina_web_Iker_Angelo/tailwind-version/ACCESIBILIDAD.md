# Comprobaciones de accesibilidad

Fecha: 28 de septiembre de 2026. Objetivo: WCAG 2.2 A y AA aplicables. Este documento registra pruebas y límites; no es una certificación de conformidad.

## Resultados ejecutados

- `npm run build`: CSS de producción compilado y minificado correctamente.
- `npm test`: 8 pruebas aprobadas (catálogo, recursos, cantidades, variantes, existencias, recuperación de datos, filtros y validación).
- `npm run test:browser`: 10 grupos de comprobaciones aprobados en Chrome con Playwright.
- Axe Core: **0 infracciones detectadas** en cinco estados: carrito con productos, formulario con errores, página a 375 px, página a 1440 px y carrito a 320 px con espaciado personalizado.
- Capturas de página completa inspeccionadas en escritorio y móvil, además del carrito de escritorio. Todas las fotografías cargan; los archivos fotográficos suman aproximadamente 696 KiB.

El informe detallado y las capturas se regeneran en `test-results/`. Las pruebas no envían información a terceros.

## Criterios comprobados

| Área | Implementación y evidencia |
| --- | --- |
| Estructura | Idioma español, un h1, títulos h2/h3, header/nav/main/footer y etiquetas nativas. Identificadores únicos y referencias ARIA existentes comprobados. |
| Imágenes | Fotografías informativas con alt ajustado a lo que se ve. Miniaturas redundantes del carrito con alt vacío. Imagen principal con figure y figcaption. |
| Contraste | Texto principal `#171916` sobre `#fffefa`: 17,53:1; secundario `#575d53` sobre `#f4f3ee`: 6,11:1; verde `#385019` sobre papel: 8,11:1; errores `#9b1c20` sobre papel: 7,32:1. |
| Contraste no textual | Bordes `#6b7166` sobre `#fffefa`: 4,98:1. Foco oscuro con halo claro para fondos claros y oscuros. Los estados incluyen texto, no solo color. |
| Teclado | Enlace de salto probado con Tab y Enter. Botones nativos para acciones y selectores nativos para variantes y filtros. Controles principales de al menos 44–48 px. |
| Modal | dialog/showModal, nombre accesible, descripción, fondo inerte, foco inicial en Cerrar, ciclo Tab/Shift+Tab, Escape y retorno al disparador. El foco se conserva al cambiar cantidades y se dirige a Cerrar al eliminar la última fila. |
| Mensajes | Regiones de estado para filtros y carrito; alert de resumen para errores de formulario, aria-invalid y aria-describedby por campo. |
| Validación | Campos requeridos, tipos y límites HTML; reglas JS para nombre con letras, email, teléfono con dígitos y longitudes. Foco al primer campo inválido. Patrones compatibles con la bandera v comprobados. |
| Reflow | Pruebas sin scroll horizontal general a 320, 375, 640, 768 y 1440 px. 320 px cubre el ancho de referencia de 1280 px al 400 %, pero no se ejecutó una prueba manual de zoom del navegador. |
| Espaciado | A 320 px: interlineado 1,5, párrafos 2em, letras 0,12em y palabras 0,16em aplicados simultáneamente. Sin desbordamiento horizontal de página/modal y con carrito operable. |
| Movimiento | prefers-reduced-motion reduce animaciones, transiciones y desplazamiento suave; probado con emulación de la preferencia. |
| Fallos | Catálogo con fallo HTTP y reintento; carrito corrupto o almacenamiento bloqueado; sin errores JavaScript no controlados en el recorrido. |

## Resultados que requieren interpretación manual

Axe dejó comprobaciones incompletas, no infracciones:

- `aria-controls` del botón del carrito apunta a un dialog cerrado. El identificador existe; al abrirlo, el control y el modal funcionan y la relación pasa la auditoría del estado abierto.
- En una captura del modal, Axe no resolvió automáticamente el contraste del botón de reducir cantidad. El texto hereda `#171916` y el fondo efectivo es `#fffefa` (17,53:1); el borde tiene 4,98:1. El control también se revisó en la captura.

## Pendiente antes de afirmar conformidad completa

- Recorrido humano con NVDA o VoiceOver: pronunciación, orden de lectura, anuncios de errores y cambios, interacción con los selectores y el modal.
- Zoom real del navegador a 200 % y 400 %, tamaños de texto del sistema, modo de alto contraste y combinaciones adicionales de navegador/tecnología de asistencia.
- Revisión completa de todos los criterios A/AA aplicables cuando estén definidos el catálogo definitivo y el flujo de compra; repetir auditorías al conectar pagos o backend.

No se ejecutaron Lighthouse ni WAVE: la auditoría automática realizada es Axe, complementada con pruebas de teclado, comprobaciones geométricas, cálculos de contraste e inspección de capturas. No hay medios de audio/vídeo en directo, así que 1.2.4 no aplica al contenido actual. Tampoco hay contenido adicional que dependa de hover, autenticación, límites de tiempo ni transacciones reales.

Las validaciones del navegador no sustituyen validaciones del servidor. La fase de backend debe comprobar precios, stock e integridad de pedidos antes de habilitar ventas.
