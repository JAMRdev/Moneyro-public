
-- Este script deduplica los grupos de gastos y los gastos fijos mensuales
-- que pueden haber sido creados por diferentes usuarios antes de que los datos fueran compartidos.

-- Parte 1: Deduplicar Grupos de Gastos por nombre

-- Paso 1.1: Actualizar las referencias en fixed_monthly_expenses
-- Se identifican los grupos duplicados por nombre, se elige uno para conservar (el más antiguo),
-- y se mapean los otros IDs duplicados al ID del que se conserva.
WITH keepers AS (
  SELECT DISTINCT ON (name) id as keeper_id, name
  FROM public.expense_groups
  ORDER BY name, created_at ASC
)
UPDATE public.fixed_monthly_expenses fme
SET expense_group_id = k.keeper_id
FROM public.expense_groups eg
JOIN keepers k ON eg.name = k.name
WHERE fme.expense_group_id = eg.id AND eg.id <> k.keeper_id;

-- Paso 1.2: Eliminar los grupos de gastos duplicados
-- Ahora que las referencias están actualizadas, se pueden eliminar de forma segura los grupos
-- que no son los "conservados".
DELETE FROM public.expense_groups
WHERE id NOT IN (
  SELECT DISTINCT ON (name) id FROM public.expense_groups ORDER BY name, created_at ASC
);


-- Parte 2: Deduplicar Gastos Mensuales Fijos por mes y nombre

-- Se clasifican los gastos dentro de cada grupo de mes/nombre.
-- Se da prioridad a los gastos creados por un usuario 'admin', en caso contrario, al más antiguo.
-- Luego se eliminan todos menos el de mayor rango (rango > 1).
WITH ranked_expenses AS (
  SELECT
    id,
    ROW_NUMBER() OVER(
      PARTITION BY month, name
      ORDER BY
        -- Priorizar los gastos del usuario admin, luego por fecha de creación
        (CASE WHEN user_id = (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1) THEN 0 ELSE 1 END),
        created_at ASC
    ) as rn
  FROM public.fixed_monthly_expenses
)
DELETE FROM public.fixed_monthly_expenses
WHERE id IN (
  SELECT id FROM ranked_expenses WHERE rn > 1
);
