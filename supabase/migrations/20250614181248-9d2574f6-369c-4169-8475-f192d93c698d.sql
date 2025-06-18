
-- 1. Eliminar la política de seguridad de solo lectura que existe para las categorías.
DROP POLICY "Allow public read-only access to categories" ON public.categories;

-- 2. Crear una nueva política de seguridad que permita a los usuarios autenticados gestionar las categorías.
CREATE POLICY "Authenticated users can manage categories"
ON public.categories
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
