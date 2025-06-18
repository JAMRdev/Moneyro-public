
-- 1. Eliminar la política de seguridad anterior en la tabla de transacciones.
DROP POLICY "Users can manage their own transactions" ON public.transactions;

-- 2. Crear una nueva política que permita a cualquier usuario autenticado ver y gestionar todas las transacciones.
CREATE POLICY "Authenticated users can manage all transactions"
ON public.transactions
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. Crear un tipo de dato para los roles de usuario (admin, member).
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- 4. Añadir una columna 'role' a la tabla de perfiles para almacenar el rol del usuario.
ALTER TABLE public.profiles ADD COLUMN role public.app_role NOT NULL DEFAULT 'member';

-- 5. Actualizar la función que se ejecuta al crear un nuevo usuario.
--    Esta función ahora comprobará si el email del usuario está en la lista de permitidos.
--    Si lo está, le asignará un rol ('admin' o 'member') y creará su perfil.
--    Si no está en la lista, impedirá el registro lanzando un error.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role public.app_role;
BEGIN
  -- Asignar rol basado en el email
  IF new.email = 'alejandromonsalver@gmail.com' THEN
    user_role := 'admin';
  ELSIF new.email = 'carla.maffione@gmail.com' THEN
    user_role := 'member';
  ELSE
    -- Si el email no está en la lista, se lanza una excepción para bloquear el registro.
    RAISE EXCEPTION 'Acceso no autorizado. Tu correo no tiene permiso para registrarse.';
  END IF;

  -- Crear el perfil del usuario con su rol asignado.
  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', user_role);

  RETURN new;
END;
$$;
