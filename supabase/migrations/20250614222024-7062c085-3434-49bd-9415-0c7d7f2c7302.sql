
-- Eliminar la política existente que restringe el acceso a los gastos mensuales fijos del propio usuario.
DROP POLICY "Users can manage their own fixed monthly expenses" ON public.fixed_monthly_expenses;

-- Crear una nueva política que permita a cualquier usuario autenticado gestionar todos los gastos mensuales fijos.
CREATE POLICY "Authenticated users can manage all fixed monthly expenses"
ON public.fixed_monthly_expenses
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Eliminar la política existente que restringe el acceso a los grupos de gastos del propio usuario.
DROP POLICY "Users can manage their own expense groups" ON public.expense_groups;

-- Crear una nueva política que permita a cualquier usuario autenticado gestionar todos los grupos de gastos.
CREATE POLICY "Authenticated users can manage all expense groups"
ON public.expense_groups
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
