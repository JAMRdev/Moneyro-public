
-- Creamos tipos personalizados para las transacciones y categorías para mantener la consistencia.
CREATE TYPE public.transaction_type AS ENUM ('ingreso', 'egreso', 'ahorro');
CREATE TYPE public.category_type AS ENUM ('ingreso', 'egreso');

-- Tabla de perfiles para guardar datos de usuario como el tema preferido.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  theme TEXT NOT NULL DEFAULT 'dark',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Esta función creará automáticamente un perfil para cada nuevo usuario que se registre.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

-- Este disparador (trigger) ejecuta la función anterior cada vez que se crea un usuario en la tabla de autenticación.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Tabla de categorías para los ingresos y egresos.
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.category_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (name, type)
);

-- Tabla principal para almacenar todas las transacciones.
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  amount NUMERIC(10, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activamos la Seguridad a Nivel de Fila (RLS) para proteger los datos.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS: Definen quién puede ver y modificar los datos.
-- Los usuarios solo pueden ver y editar su propio perfil.
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Las categorías son públicas y de solo lectura para todos los usuarios.
CREATE POLICY "Allow public read-only access to categories" ON public.categories FOR SELECT USING (true);

-- Los usuarios solo pueden gestionar sus propias transacciones.
CREATE POLICY "Users can manage their own transactions" ON public.transactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insertamos las categorías que mencionaste.
INSERT INTO public.categories (name, type) VALUES
('Alquiler vivienda', 'egreso'),
('Comida', 'egreso'),
('Deudas', 'egreso'),
('Expensas vivienda', 'egreso'),
('Gastos personales', 'egreso'),
('Mascotas', 'egreso'),
('Regalos', 'egreso'),
('Salud/médicos', 'egreso'),
('Servicios', 'egreso'),
('Transporte/Auto', 'egreso'),
('Viajes', 'egreso'),
('Otros gastos', 'egreso'),
('Apoyo familia', 'egreso'),
('Sueldo Ale', 'ingreso'),
('Sueldo Car', 'ingreso'),
('Aguinaldo Ale', 'ingreso'),
('Aguinaldo Car', 'ingreso'),
('Otros ingresos', 'ingreso'),
('Apoyo familia', 'ingreso');
