
export interface Transaction {
  id: string;
  transaction_date: string;
  description: string | null;
  amount: number;
  type: 'ingreso' | 'egreso' | 'ahorro';
  categories: {
    id: string;
    name: string;
  } | null;
  category_id?: string | null;
  user_id: string;
  created_at: string;
  date?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'ingreso' | 'egreso';
}

export interface FixedMonthlyExpense {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
  month: string;
  due_date: string | null;
  payment_source: string | null;
  notes: string | null;
  expense_group_id: string | null;
  expense_groups: {
    id: string;
    name: string;
  } | null;
  user_id: string;
}

export interface ExpenseGroup {
    id: string;
    name: string;
    user_id: string;
}

export interface Log {
    id: string;
    created_at: string;
    user_id: string;
    user_email: string;
    action: string;
    location: string;
    details: any;
    device_info: string;
}
