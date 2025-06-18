
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  variant?: 'summary-cards' | 'transaction-list' | 'chart' | 'table';
  className?: string;
}

export const LoadingSkeleton = ({ variant = 'transaction-list', className }: LoadingSkeletonProps) => {
  switch (variant) {
    case 'summary-cards':
      return (
        <div className={cn("grid gap-4 md:grid-cols-3", className)}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      );
    
    case 'chart':
      return (
        <div className={cn("space-y-4", className)}>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      );
    
    case 'table':
      return (
        <div className={cn("space-y-3", className)}>
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg md:h-12" />
          ))}
        </div>
      );
    
    default:
      return (
        <div className={cn("space-y-3", className)}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
  }
};
