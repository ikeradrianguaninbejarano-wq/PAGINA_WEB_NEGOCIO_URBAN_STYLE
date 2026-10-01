import { loadProducts, filterProductsByCategory, findProductById } from './products.js';
import { formatPrice } from './utils.js';

const start = async () => {
  try {
    const products = await loadProducts('data/productos.json');
    const shirts = filterProductsByCategory(products, 'Camisetas');
    const firstProduct = findProductById(products, 1);
    console.info(`Catálogo preparado: ${products.length} productos; ${shirts.length} camisetas.`);
    if (firstProduct) console.info(`Primer producto: ${firstProduct.name} (${formatPrice(firstProduct.price)}).`);
  } catch (error) {
    console.error(error.message);
  } finally {
    console.info('Carga inicial del catálogo finalizada.');
  }
};

start();
