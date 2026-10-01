# Referencias de diseño y fotografías

Revisión: 28 de septiembre de 2026. Se adaptan patrones de navegación; no se copian código, identidad visual ni fotografías de las tiendas.

| Referencia | Observación comprobable | Aplicación en URBAN STYLE |
| --- | --- | --- |
| [De Prati, enlace recibido](https://www.deprati.com.ec/es/mujeres/c/01) y [catálogo de mujeres accesible](https://www.deprati.com.ec/mujeres/c/0701) | El enlace original devuelve poco contenido legible; el catálogo indexado muestra filtros, ordenación y opción de eliminar filtros. | Filtros agrupados, ordenación explícita y botón para limpiar la selección. |
| [H&M Ecuador, básicos](https://ec.hm.com/mujer/basicos) y [ropa de hombre](https://ec.hm.com/HOMBRE) | Categorías de básicos, filtros, ordenación y precios junto a las prendas. | Camisetas, jeans y chompas; precios visibles y orden ascendente/descendente. |
| [KOAJ Ecuador](https://koaj.ec/) | Navegación por tipos de prendas, búsqueda, categorías como camisetas, jeans, chaquetas y accesorios. | Categorías comprensibles, búsqueda por palabras y variantes con talla y color. |

No se verificó un ranking de ventas de las tres tiendas. Los ocho artículos son una selección provisional de tipos de prendas, no una lista acreditada de «más vendidos». Los precios y existencias se inventaron únicamente para probar el flujo; no corresponden a ofertas de estas tiendas.

## Fotografías reales de referencia

Se descargaron fotografías desde Unsplash y se verificó visualmente cada archivo. La página usa copias locales de aproximadamente 800 px, sin depender de solicitudes a proveedores externos al navegar. [Licencia de Unsplash](https://unsplash.com/license).

| Archivo local | Fuente original |
| --- | --- |
| assets/photos/camiseta.jpg | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab |
| assets/photos/jeans.jpg | https://images.unsplash.com/photo-1542272604-787c3835535d |
| assets/photos/chompa.jpg | https://images.unsplash.com/photo-1556821840-3a63f95609a7 |
| assets/photos/chaqueta.jpg | https://images.unsplash.com/photo-1543076447-215ad9ba6923 |
| assets/photos/camiseta_negra.jpg | https://images.unsplash.com/photo-1503341504253-dff4815485f1 |
| assets/photos/camisa.jpg | https://images.unsplash.com/photo-1598033129183-c4f50c736f10 |
| assets/photos/gorra.jpg | https://images.unsplash.com/photo-1588850561407-ed78c282e89b |
| assets/photos/zapatillas.jpg | https://images.unsplash.com/photo-1542291026-7eec264c27ff |

Estas fotografías representan tipos de prendas: no documentan inventario real de URBAN STYLE ni una relación con las marcas que puedan aparecer. Sustituirlas por fotografías de los productos definitivos antes de habilitar ventas; la licencia fotográfica no equivale a derechos sobre marcas o diseños representados. La fuente de cada imagen también está en `data/products.json` para facilitar el reemplazo.

## Criterios técnicos

- [Referencia oficial WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/): objetivo A y AA aplicables.
- [Elemento dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog): modal nativo con `showModal()`, cierre con Escape, fondo inerte y foco controlado.
