
-- Habilitar Row Level Security en la tabla budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Política que permite a todos los usuarios autenticados ver todos los presupuestos
CREATE POLICY "Authenticated users can view all budgets" 
  ON public.budgets 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Política que permite a todos los usuarios autenticados crear presupuestos
CREATE POLICY "Authenticated users can create budgets" 
  ON public.budgets 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Política que permite a todos los usuarios autenticados actualizar presupuestos
CREATE POLICY "Authenticated users can update budgets" 
  ON public.budgets 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Política que permite a todos los usuarios autenticados eliminar presupuestos
CREATE POLICY "Authenticated users can delete budgets" 
  ON public.budgets 
  FOR DELETE 
  TO authenticated
  USING (true);
