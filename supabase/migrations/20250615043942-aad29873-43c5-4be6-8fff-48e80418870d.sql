
-- Crear tabla para almacenar las suscripciones a notificaciones push
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.push_subscriptions IS 'Almacena las suscripciones de notificaciones push web para los usuarios.';

-- Habilitar Row Level Security para la tabla
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para que los usuarios gestionen sus propias suscripciones
CREATE POLICY "Los usuarios pueden ver sus propias suscripciones"
ON public.push_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias suscripciones"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias suscripciones"
ON public.push_subscriptions
FOR DELETE
USING (auth.uid() = user_id);

