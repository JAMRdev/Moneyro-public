
/**
 * Utilidades de formateo para la aplicación
 * 
 * Este módulo contiene funciones utilitarias para formatear datos
 * de manera consistente en toda la aplicación.
 */

import { useMoneyVisibility } from '@/contexts/MoneyVisibilityContext';

/**
 * Formatea un número como moneda argentina (ARS)
 * 
 * @function formatCurrency
 * @param {number} amount - Cantidad a formatear
 * @param {boolean} [includeSymbol=true] - Si incluir el símbolo de peso
 * @returns {string} Cantidad formateada como moneda
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56); // "$1.234,56"
 * formatCurrency(1234.56, false); // "1.234,56"
 * ```
 */
export const formatCurrency = (amount: number, includeSymbol: boolean = true): string => {
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  return includeSymbol ? `$${formatted}` : formatted;
};

/**
 * Formatea una fecha en formato español argentino
 * 
 * @function formatDate
 * @param {Date | string} date - Fecha a formatear
 * @param {boolean} [includeTime=false] - Si incluir la hora
 * @returns {string} Fecha formateada
 * 
 * @example
 * ```typescript
 * formatDate(new Date()); // "15/06/2024"
 * formatDate(new Date(), true); // "15/06/2024 14:30"
 * ```
 */
export const formatDate = (date: Date | string, includeTime: boolean = false): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('es-AR', options).format(dateObj);
};

/**
 * Capitaliza la primera letra de una cadena
 * 
 * @function capitalize
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena con primera letra mayúscula
 * 
 * @example
 * ```typescript
 * capitalize('hola mundo'); // "Hola mundo"
 * ```
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca un texto a una longitud específica
 * 
 * @function truncateText
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} [suffix='...'] - Sufijo para texto truncado
 * @returns {string} Texto truncado
 * 
 * @example
 * ```typescript
 * truncateText('Este es un texto muy largo', 10); // "Este es un..."
 * ```
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};
