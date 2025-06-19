
import { FC, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FixedMonthlyExpense } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MoneyDisplay } from '@/components/MoneyDisplay';

export const EditableCell: FC<{
  expense: FixedMonthlyExpense;
  field: keyof FixedMonthlyExpense;
  value: string | number | undefined | boolean;
  currencyFormatter?: Intl.NumberFormat;
  isLocked: boolean;
}> = ({ expense, field, value, currencyFormatter, isLocked }) => {
  const queryClient = useQueryClient();
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: async (updatedField: Partial<FixedMonthlyExpense>) => {
      const { error } = await supabase
        .from('fixed_monthly_expenses')
        .update(updatedField)
        .eq('id', expense.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedMonthlyExpenses'] });
    },
    onError: (error) => {
      toast.error("Error al actualizar", { description: error.message });
    },
  });

  const handleBlur = () => {
    if (isLocked) {
        setIsEditing(false);
        setLocalValue(value);
        return;
    }
    if (localValue !== value) {
      mutation.mutate({ [field]: localValue });
    }
    setIsEditing(false);
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (isLocked) return;
    setLocalValue(checked);
    mutation.mutate({ [field]: checked });
  };

  if (field === 'paid') {
    return <Checkbox checked={!!localValue} onCheckedChange={handleCheckboxChange} disabled={isLocked} />;
  }

  if (field === 'amount' && currencyFormatter) {
    if (isEditing) {
      return (
        <Input
          type="number"
          value={localValue === null ? '' : String(localValue)}
          onChange={(e) => setLocalValue(e.target.valueAsNumber || 0)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
            if (e.key === 'Escape') {
              setLocalValue(value);
              setIsEditing(false);
            }
          }}
          autoFocus
          className="h-8 w-full border-none bg-transparent text-right focus:ring-0 focus:ring-offset-0"
        />
      );
    }
    return (
      <div onClick={() => !isLocked && setIsEditing(true)} className={cn("flex h-8 w-full items-center justify-end text-right", !isLocked && "cursor-pointer")}>
        <MoneyDisplay amount={Number(value) || 0} prefix="$" />
      </div>
    );
  }

  const inputType = typeof value === 'number' ? 'number' : 'text';
  
  return (
    <Input
      type={inputType}
      value={localValue === null ? '' : String(localValue)}
      onChange={(e) => setLocalValue(inputType === 'number' ? e.target.valueAsNumber || 0 : e.target.value)}
      onBlur={handleBlur}
      className="h-8 border-none bg-transparent focus:ring-0 focus:ring-offset-0"
      readOnly={isLocked}
    />
  );
};
