import { createError } from './utils.js';

export class Cart {
  constructor() {
    this.items = [];
  }

  add(product, quantity = 1) {
    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      throw createError('El producto y la cantidad deben ser válidos.');
    }
    const item = this.items.find(({ product: current }) => current.id === product.id);
    if (item) item.quantity += quantity;
    else this.items.push({ product, quantity });
  }

  remove(productId) {
    const initialLength = this.items.length;
    this.items = this.items.filter(({ product }) => product.id !== productId);
    return this.items.length < initialLength;
  }

  getItems() {
    return this.items.map(({ product, quantity }) => ({ product, quantity }));
  }

  getSubtotal() {
    let subtotal = 0;
    for (const { product, quantity } of this.items) subtotal += product.price * quantity;
    return Number(subtotal.toFixed(2));
  }
}
