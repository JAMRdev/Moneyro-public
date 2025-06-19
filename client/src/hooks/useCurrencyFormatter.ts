import { useMoneyVisibility } from '@/contexts/MoneyVisibilityContext';

/**
 * Hook personalizado para formatear moneda respetando la configuración de visibilidad
 */
export const useCurrencyFormatter = () => {
  const { isMoneyVisible } = useMoneyVisibility();

  const formatCurrency = (amount: number, includeSymbol: boolean = true) => {
    if (!isMoneyVisible) {
      return includeSymbol ? '$****' : '****';
    }

    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return includeSymbol ? `$${formatted}` : formatted;
  };

  const formatCurrencyFull = (amount: number) => {
    if (!isMoneyVisible) {
      return '$****';
    }

    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  return { formatCurrency, formatCurrencyFull };
};