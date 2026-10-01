# URBAN STYLE · Tailwind

Interfaz de catálogo y carrito para preparar el negocio. Conserva la identidad verde/negra, usa Tailwind compilado localmente y HTML5 semántico. Todos los cambios se limitan a esta carpeta; la versión original permanece independiente.

## Ejecutar

Requiere Node.js 20 o superior y npm. Desde `tailwind-version`:

```sh
npm ci
npm run build
npm run dev
```

Abrir http://127.0.0.1:8000. En PowerShell con scripts restringidos usar `npm.cmd` en lugar de `npm`. El servidor incluido es solo para desarrollo local y no recibe datos ni pedidos. No abrir `index.html` con `file://`: el catálogo se carga por HTTP.

## Funcionalidades

- Ocho productos con fotografías reales locales, búsqueda sin distinguir acentos, categorías, ordenación de precios y estado sin resultados.
- Tallas y colores por producto, disponibilidad por combinación y estado agotado.
- Carrito en un modal nativo: añadir, incrementar, disminuir, eliminar, subtotal en centavos exactos y persistencia local. El subtotal se calcula siempre desde el catálogo, nunca desde precios guardados por el usuario.
- Recuperación ante almacenamiento corrupto o bloqueado, errores de carga y reintento.
- Formulario con restricciones HTML y reglas JavaScript; etiquetas, ayudas, errores asociados, resumen anunciado y foco en el primer error. El botón solo revisa la consulta: no se simula un envío.
- Semántica, salto al contenido, foco contrastado, teclado, control del foco del modal, regiones vivas y movimiento reducido. Diseño sin alturas fijas para el texto.

## Editar productos

La fuente única es `data/products.json`. Cada producto incluye:

- `id` estable, `name`, `description`, `category`.
- `priceCents` (1999 equivale a USD 19,99), `currency` (USD).
- `image`, `alt`, `imageSource`, `provisional`.
- `variants`: `id`, `size`, `color`, `stock` por combinación.

Los identificadores deben mantenerse estables para recuperar carritos. No repetir combinaciones de talla/color. Para reemplazar una foto, poner el archivo JPG en `assets/photos`, actualizar ruta, texto alternativo y procedencia. Los nombres de archivo admiten letras minúsculas sin acentos, números, guiones y guiones bajos.

El formulario no guarda información personal. El carrito guarda únicamente identificadores y cantidades bajo `urban-style.cart.v1` en localStorage. Los datos, existencias y precios son provisionales y se identifican así en la interfaz.

## Desarrollo y pruebas

```sh
npm run watch
npm test
```

Con el servidor activo y Google Chrome instalado:

```sh
npm run test:browser
```

Para usar Edge, definir `BROWSER_CHANNEL=msedge`; para otro servidor, `TEST_URL`. Las pruebas usan Playwright Core y Axe, generan capturas y `test-results/report.json` (carpeta excluida de Git), y cierran el navegador al terminar. No descargan navegadores automáticamente.

### Validación de calidad y CI/CD

La verificación que se ejecuta en GitHub Actions incluye:

- HTML5 válido con `html-validate`.
- Semántica y criterios de accesibilidad con el flujo Playwright + Axe.
- Comprobación de enlaces seguros y prevención de YouTube no verificado.
- Arquitectura responsable y adaptabilidad visual en varios anchos.

```sh
npm run build
npm test
npm run lint:html
npm run lint:quality
npm run test:browser
```

El proyecto está preparado para desplegarse en GitHub Pages desde la carpeta `tailwind-version` mediante una acción de GitHub Actions que genera el artefacto estático y lo publica en la rama `gh-pages`/Pages.

Tailwind escanea exclusivamente el HTML y `js/`; `npm run build` genera CSS minificado con las utilidades utilizadas. Las fotografías usan carga diferida excepto la principal. La página no usa fuentes remotas, Bootstrap ni servicios de terceros durante su ejecución.

Consultar `ACCESIBILIDAD.md` para resultados y límites de la auditoría y `REFERENCIAS.md` para las decisiones de diseño y fuentes de fotos.

## Siguiente fase: backend

No hay pagos, pedidos enviados, autenticación ni base de datos en esta entrega. Cuando se conecte el backend, deberá revalidar identificadores, precios y existencias, normalizar entradas y aplicar controles de seguridad. La disponibilidad calculada en el navegador no reserva stock. Se deberán definir también envío, impuestos y el proceso de confirmación; no se inventan estas condiciones comerciales.
