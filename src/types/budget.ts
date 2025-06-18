
export interface Budget {
  id: string;
  name: string;
  amount: number;
  category_id: string | null;
  period: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    type: 'ingreso' | 'egreso';
  } | null;
}
