import { normalizeText } from './utils.js';

const patterns = {
  name: /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ' -]{3,80}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[0-9() -]{7,20}$/
};

export const validateName = (value) => patterns.name.test(normalizeText(value));
export const validateEmail = (value) => patterns.email.test(normalizeText(value));
export const validatePhone = (value) => value.trim() === '' || patterns.phone.test(normalizeText(value));
export const validateSubject = (value) => normalizeText(value).length >= 3 && normalizeText(value).length <= 100;
export const validateMessage = (value) => normalizeText(value).length >= 10 && normalizeText(value).length <= 1000;

export const validateContactForm = ({ name, email, phone, subject, message }) => {
  const errors = {};
  if (!validateName(name)) errors.name = 'Escribe un nombre válido de 3 a 80 caracteres.';
  if (!validateEmail(email)) errors.email = 'Escribe un correo electrónico válido.';
  if (!validatePhone(phone)) errors.phone = 'Usa un teléfono de 7 a 20 caracteres.';
  if (!validateSubject(subject)) errors.subject = 'El asunto debe tener entre 3 y 100 caracteres.';
  if (!validateMessage(message)) errors.message = 'El mensaje debe tener entre 10 y 1000 caracteres.';
  return { isValid: Object.keys(errors).length === 0, errors };
};
