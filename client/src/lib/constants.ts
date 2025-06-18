
/**
 * Constantes globales de la aplicación
 * 
 * Este archivo centraliza todas las constantes utilizadas
 * en múltiples partes de la aplicación para facilitar
 * el mantenimiento y evitar valores hardcodeados.
 */

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  /** Número de transacciones por página */
  TRANSACTIONS_PER_PAGE: 20,
  /** Número de logs por página */
  LOGS_PER_PAGE: 50,
  /** Número de categorías por página */
  CATEGORIES_PER_PAGE: 10,
} as const;

/**
 * Configuración de cache para React Query
 */
export const CACHE_TIMES = {
  /** Tiempo de datos frescos para transacciones (30 segundos) */
  TRANSACTIONS_STALE: 30 * 1000,
  /** Tiempo de datos frescos para categorías (10 minutos) */
  CATEGORIES_STALE: 10 * 60 * 1000,
  /** Tiempo de garbage collection (5 minutos) */
  DEFAULT_GC: 5 * 60 * 1000,
  /** Tiempo de garbage collection largo (30 minutos) */
  LONG_GC: 30 * 60 * 1000,
} as const;

/**
 * Límites de la aplicación
 */
export const LIMITS = {
  /** Máximo número de sugerencias de autocompletado */
  MAX_AUTOCOMPLETE_SUGGESTIONS: 20,
  /** Máximo número de transacciones para autocompletado */
  MAX_TRANSACTIONS_FOR_AUTOCOMPLETE: 100,
  /** Longitud máxima de descripción */
  MAX_DESCRIPTION_LENGTH: 255,
  /** Monto máximo permitido */
  MAX_AMOUNT: 999999999.99,
} as const;

/**
 * Configuración de UI
 */
export const UI_CONFIG = {
  /** Delay para búsqueda (debounce) */
  SEARCH_DEBOUNCE_MS: 300,
  /** Duración de animaciones */
  ANIMATION_DURATION: 200,
  /** Tiempo de toast por defecto */
  TOAST_DURATION: 3000,
} as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  BUDGETS: '/budgets',
  CATEGORIES: '/categories',
  REPORTS: '/reports',
  LOGS: '/logs',
  DOCUMENTATION: '/documentation',
} as const;

/**
 * Roles de usuario
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

/**
 * Tipos de transacción
 */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

/**
 * Estados de gastos fijos
 */
export const EXPENSE_STATES = {
  PAID: 'paid',
  PENDING: 'pending',
} as const;

/**
 * Configuración de notificaciones
 */
export const NOTIFICATIONS = {
  /** Título por defecto para notificaciones push */
  DEFAULT_TITLE: "Carle's Finance",
  /** Icono por defecto */
  DEFAULT_ICON: '/favicon.ico',
  /** TTL por defecto (24 horas) */
  DEFAULT_TTL: 24 * 60 * 60,
} as const;
