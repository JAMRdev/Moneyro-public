
import { ConnectionStatus } from "./ConnectionStatus";

interface DashboardHeaderProps {
  isOnline: boolean;
  pendingActions: number;
}

export const DashboardHeader = ({ isOnline, pendingActions }: DashboardHeaderProps) => {
  return (
    <div className="space-y-4 pt-4 md:pt-8">
      <ConnectionStatus isOnline={isOnline} pendingActions={pendingActions} />
    </div>
  );
};
