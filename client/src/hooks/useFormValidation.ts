
import { useState, useCallback } from 'react';

/**
 * Definición de reglas de validación para un campo
 */
interface ValidationRule {
  /** El campo es requerido */
  required?: boolean;
  /** Valor mínimo para números */
  min?: number;
  /** Valor máximo para números */
  max?: number;
  /** Patrón regex que debe cumplir */
  pattern?: RegExp;
  /** Función de validación personalizada */
  custom?: (value: any) => string | null;
}

/**
 * Schema de validación - mapea nombres de campos a sus reglas
 */
interface ValidationSchema {
  [key: string]: ValidationRule;
}

/**
 * Hook personalizado para validación de formularios en tiempo real
 * 
 * Este hook proporciona un sistema completo de validación para formularios:
 * - Validación campo por campo
 * - Validación completa del formulario
 * - Seguimiento de campos "tocados" por el usuario
 * - Mensajes de error personalizados
 * - Reglas de validación flexibles
 * 
 * Casos de uso:
 * - Formularios complejos con múltiples validaciones
 * - Validación en tiempo real mientras el usuario escribe
 * - Feedback visual inmediato de errores
 * 
 * @param schema - Objeto que define las reglas de validación para cada campo
 * @returns Objeto con estado de validación y funciones de control
 */
export const useFormValidation = (schema: ValidationSchema) => {
  // Estado para almacenar errores de cada campo
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Estado para rastrear qué campos ha "tocado" el usuario
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Valida un campo específico según sus reglas definidas
   * 
   * @param name - Nombre del campo a validar
   * @param value - Valor actual del campo
   * @returns Mensaje de error o null si es válido
   */
  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    // Validación de campo requerido
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'Este campo es requerido';
    }

    // Validación de valor mínimo para números
    if (rule.min && typeof value === 'number' && value < rule.min) {
      return `El valor mínimo es ${rule.min}`;
    }

    // Validación de valor máximo para números
    if (rule.max && typeof value === 'number' && value > rule.max) {
      return `El valor máximo es ${rule.max}`;
    }

    // Validación de patrón regex para strings
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'El formato no es válido';
    }

    // Validación personalizada
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [schema]);

  /**
   * Valida un campo y actualiza el estado de errores
   * 
   * @param name - Nombre del campo
   * @param value - Valor del campo
   * @returns true si el campo es válido, false si tiene errores
   */
  const validate = useCallback((name: string, value: any) => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    return !error;
  }, [validateField]);

  /**
   * Valida todos los campos del formulario
   * 
   * @param values - Objeto con todos los valores del formulario
   * @returns true si todo el formulario es válido, false si hay errores
   */
  const validateAll = useCallback((values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validar cada campo definido en el schema
    Object.keys(schema).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [schema, validateField]);

  /**
   * Marca un campo como "tocado" por el usuario
   * Útil para mostrar errores solo después de que el usuario interactúe con el campo
   * 
   * @param name - Nombre del campo
   */
  const touch = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  /**
   * Resetea el estado de validación (errores y campos tocados)
   */
  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors, // Objeto con errores actuales
    touched, // Objeto con campos tocados
    validate, // Función para validar un campo
    validateAll, // Función para validar todo el formulario
    touch, // Función para marcar campo como tocado
    reset, // Función para resetear estado
    hasErrors: Object.values(errors).some(error => error !== '') // Booleano que indica si hay errores
  };
};
