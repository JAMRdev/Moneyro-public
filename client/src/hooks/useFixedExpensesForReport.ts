
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FixedMonthlyExpense } from "@/types";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

type ReportFilters = {
  date_range?: DateRange;
  category_id?: string;
};

const fetchFixedExpensesForReport = async (filters: ReportFilters): Promise<FixedMonthlyExpense[]> => {
  let query = supabase
    .from("fixed_monthly_expenses")
    .select("*, expense_groups(id, name)")
    .order("month", { ascending: false });

  if (filters.date_range?.from) {
    query = query.gte('month', format(filters.date_range.from, 'yyyy-MM-dd'));
  }
  if (filters.date_range?.to) {
    query = query.lte('month', format(filters.date_range.to, 'yyyy-MM-dd'));
  }
  if (filters.category_id && filters.category_id !== 'all') {
    query = query.eq('expense_group_id', filters.category_id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
  return (data || []) as FixedMonthlyExpense[];
};

export const useFixedExpensesForReport = (filters: ReportFilters) => {
  return useQuery({
    queryKey: ['fixedExpensesForReport', filters],
    queryFn: () => fetchFixedExpensesForReport(filters),
  });
};
