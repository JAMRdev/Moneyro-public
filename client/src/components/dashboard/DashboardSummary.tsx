
import SummaryCards from "@/components/SummaryCards";
import { Transaction } from "@/types";

interface DashboardSummaryProps {
  transactions: Transaction[];
}

export const DashboardSummary = ({ transactions }: DashboardSummaryProps) => {
  return <SummaryCards transactions={transactions} />;
};
