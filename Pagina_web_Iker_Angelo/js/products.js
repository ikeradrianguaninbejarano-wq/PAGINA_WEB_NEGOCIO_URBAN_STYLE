import { createError } from './utils.js';

export class Product {
  constructor({ id, name, category, description, price, image }) {
    if (!Number.isInteger(id) || !name || !category || !description || !image || !Number.isFinite(price) || price < 0) {
      throw createError('Los datos del producto no son válidos.');
    }

    Object.assign(this, { id, name, category, description, price, image });
  }
}

export const createProducts = (records) => {
  if (!Array.isArray(records)) throw createError('El catálogo debe ser una lista de productos.');
  return records.map((record) => new Product(record));
};

export const findProductById = (products, id) => products.find(({ id: productId }) => productId === id);
export const filterProductsByCategory = (products, category) =>
  products.filter(({ category: productCategory }) => productCategory === category);

export const getCategoryLabel = (category) => {
  switch (category) {
    case 'Camisetas': return 'Prendas superiores';
    case 'Pantalones': return 'Prendas inferiores';
    case 'Chaquetas': return 'Capas exteriores';
    case 'Calzado': return 'Calzado';
    case 'Accesorios': return 'Complementos';
    default: return 'Categoría general';
  }
};

export const loadProducts = (url = 'data/productos.json') =>
  fetch(url)
    .then((response) => {
      if (!response.ok) throw createError(`No se pudo cargar el catálogo (HTTP ${response.status}).`);
      return response.json();
    })
    .then(({ productos }) => createProducts(productos))
    .catch((error) => {
      throw createError(`Error al cargar productos: ${error.message}`);
    });
