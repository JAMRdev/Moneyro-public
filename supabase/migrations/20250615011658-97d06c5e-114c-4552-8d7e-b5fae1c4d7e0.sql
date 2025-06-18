
-- Habilitar la replicación para la tabla de transacciones
ALTER TABLE public.transactions REPLICA IDENTITY FULL;

-- Añadir la tabla de transacciones a la publicación de tiempo real de Supabase
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Habilitar la replicación para la tabla de gastos fijos mensuales
ALTER TABLE public.fixed_monthly_expenses REPLICA IDENTITY FULL;

-- Añadir la tabla de gastos fijos mensuales a la publicación de tiempo real de Supabase
ALTER PUBLICATION supabase_realtime ADD TABLE public.fixed_monthly_expenses;
