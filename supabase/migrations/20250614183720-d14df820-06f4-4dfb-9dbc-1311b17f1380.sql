
-- Create a table for fixed monthly expenses, inspired by the spreadsheet
CREATE TABLE public.fixed_monthly_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  expense_group TEXT,
  name TEXT NOT NULL,
  due_date TEXT,
  amount NUMERIC(10, 2) DEFAULT 0,
  paid BOOLEAN DEFAULT false,
  notes TEXT,
  payment_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a function to automatically update the `updated_at` timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update on the table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.fixed_monthly_expenses
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();

-- Enable Row Level Security to ensure users can only access their own data
ALTER TABLE public.fixed_monthly_expenses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to perform all actions (select, insert, update, delete) on their own expenses
CREATE POLICY "Users can manage their own fixed monthly expenses"
ON public.fixed_monthly_expenses
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
