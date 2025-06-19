import { useMoneyVisibility } from "@/contexts/MoneyVisibilityContext";

interface MoneyDisplayProps {
  amount: number | string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({ 
  amount, 
  className = "", 
  prefix = "$", 
  suffix = "" 
}) => {
  const { isMoneyVisible } = useMoneyVisibility();

  const formatAmount = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (!isMoneyVisible) {
    return (
      <span className={className}>
        {prefix}****{suffix}
      </span>
    );
  }

  return (
    <span className={className}>
      {prefix}{formatAmount(amount)}{suffix}
    </span>
  );
};