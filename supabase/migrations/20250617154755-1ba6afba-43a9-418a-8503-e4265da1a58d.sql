
-- Fix the get_inactive_users function to use the correct column
CREATE OR REPLACE FUNCTION public.get_inactive_users()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  username TEXT,
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
    COALESCE(MAX(t.created_at), p.updated_at) as last_transaction_date,
    EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(t.created_at), p.updated_at))) / 3600 as hours_since_last_transaction
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN public.transactions t ON p.id = t.user_id
  WHERE p.role = 'member' -- Only check members, not admins
  GROUP BY p.id, au.email, p.username, p.updated_at
  HAVING EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(t.created_at), p.updated_at))) / 3600 >= 24
  ORDER BY hours_since_last_transaction DESC;
END;
$$;
