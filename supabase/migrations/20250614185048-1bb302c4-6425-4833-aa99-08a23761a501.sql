
-- Create a table for expense groups
CREATE TABLE public.expense_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, name)
);

-- Enable RLS for expense_groups
ALTER TABLE public.expense_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for expense_groups
CREATE POLICY "Users can manage their own expense groups"
ON public.expense_groups
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Alter fixed_monthly_expenses to use expense_group_id
-- WARNING: This will remove any existing data in the 'expense_group' column.
ALTER TABLE public.fixed_monthly_expenses DROP COLUMN IF EXISTS expense_group;
ALTER TABLE public.fixed_monthly_expenses ADD COLUMN expense_group_id UUID REFERENCES public.expense_groups(id) ON DELETE SET NULL;
