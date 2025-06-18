
-- Create a function to get all users with their activity status
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  username TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_transaction_date TIMESTAMP WITH TIME ZONE,
  hours_since_last_transaction NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    au.email as user_email,
    p.username,
    p.role::TEXT as role,
    p.updated_at as created_at,
    COALESCE(MAX(t.created_at), p.updated_at) as last_transaction_date,
    EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(t.created_at), p.updated_at))) / 3600 as hours_since_last_transaction
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN public.transactions t ON p.id = t.user_id
  GROUP BY p.id, au.email, p.username, p.role, p.updated_at
  ORDER BY p.updated_at DESC;
END;
$$;
