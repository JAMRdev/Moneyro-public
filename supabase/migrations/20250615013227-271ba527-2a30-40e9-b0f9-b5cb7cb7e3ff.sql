
-- 1. Crear la tabla para almacenar los registros de actividad.
CREATE TABLE public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    location TEXT,
    details JSONB,
    device_info TEXT
);

-- 2. Habilitar la Seguridad a Nivel de Fila (RLS) en la nueva tabla.
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- 3. Crear una función auxiliar para obtener el rol de un usuario desde su perfil.
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS public.app_role AS $$
DECLARE
  v_role public.app_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = p_user_id;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear una política de RLS para permitir que solo los administradores lean los registros.
CREATE POLICY "Admins can view all logs"
ON public.logs
FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

-- 5. Crear una política de RLS para permitir que cualquier usuario autenticado inserte nuevos registros.
-- Esto es necesario para que la aplicación pueda registrar las acciones de todos los usuarios.
CREATE POLICY "Authenticated users can insert logs"
ON public.logs
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

