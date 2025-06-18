
/**
 * Tipos específicos para la documentación de la aplicación
 */

/**
 * Estructura de una sección de documentación
 * 
 * @interface DocumentationSection
 * @property {string} id - Identificador único de la sección
 * @property {string} title - Título de la sección
 * @property {string} description - Descripción breve de la sección
 * @property {DocumentationItem[]} items - Elementos dentro de la sección
 */
export interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  items: DocumentationItem[];
}

/**
 * Elemento individual de documentación
 * 
 * @interface DocumentationItem
 * @property {string} name - Nombre del elemento
 * @property {string} description - Descripción del elemento
 * @property {string} [example] - Ejemplo de uso opcional
 * @property {string[]} [features] - Lista de características
 * @property {CodeExample[]} [codeExamples] - Ejemplos de código
 */
export interface DocumentationItem {
  name: string;
  description: string;
  example?: string;
  features?: string[];
  codeExamples?: CodeExample[];
}

/**
 * Ejemplo de código para documentación
 * 
 * @interface CodeExample
 * @property {string} language - Lenguaje del código (typescript, jsx, etc.)
 * @property {string} code - Código del ejemplo
 * @property {string} [description] - Descripción opcional del ejemplo
 */
export interface CodeExample {
  language: string;
  code: string;
  description?: string;
}

/**
 * Entrada del changelog
 * 
 * @interface ChangelogEntry
 * @property {string} version - Número de versión
 * @property {string} date - Fecha del cambio
 * @property {ChangeType[]} changes - Lista de cambios
 */
export interface ChangelogEntry {
  version: string;
  date: string;
  changes: ChangeType[];
}

/**
 * Tipo de cambio en el changelog
 * 
 * @interface ChangeType
 * @property {'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security'} type - Tipo de cambio
 * @property {string} description - Descripción del cambio
 */
export interface ChangeType {
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
}
