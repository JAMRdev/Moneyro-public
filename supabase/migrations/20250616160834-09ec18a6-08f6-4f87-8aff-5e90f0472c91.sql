
-- Create a table to track notification history
CREATE TABLE public.inactivity_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  last_transaction_date TIMESTAMP WITH TIME ZONE,
  notification_sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inactivity_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all notifications
CREATE POLICY "Admins can view all inactivity notifications" 
  ON public.inactivity_notifications 
  FOR SELECT 
  USING (get_user_role(auth.uid()) = 'admin');

-- Create policy for admins to insert notifications
CREATE POLICY "Admins can create inactivity notifications" 
  ON public.inactivity_notifications 
  FOR INSERT 
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Create a function to find inactive users (users who haven't added transactions in 24+ hours)
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
    COALESCE(MAX(t.created_at), p.created_at) as last_transaction_date,
    EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(t.created_at), p.created_at))) / 3600 as hours_since_last_transaction
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  LEFT JOIN public.transactions t ON p.id = t.user_id
  WHERE p.role = 'member' -- Only check members, not admins
  GROUP BY p.id, au.email, p.username, p.created_at
  HAVING EXTRACT(EPOCH FROM (NOW() - COALESCE(MAX(t.created_at), p.created_at))) / 3600 >= 24
  ORDER BY hours_since_last_transaction DESC;
END;
$$;

-- Create a function to get admin users for notifications
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  username TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    au.email as user_email,
    p.username
  FROM public.profiles p
  JOIN auth.users au ON p.id = au.id
  WHERE p.role = 'admin';
END;
$$;
