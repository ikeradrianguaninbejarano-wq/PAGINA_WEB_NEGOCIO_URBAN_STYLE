export const normalizeText = (value) => value.trim().replace(/\s+/g, ' ');

export const formatPrice = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const createError = (message) => new Error(message);
