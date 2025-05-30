
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  height?: string;
}

export const SkeletonLoader = ({ className, lines = 1, height = "h-4" }: SkeletonLoaderProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "skeleton rounded",
            height,
            index === lines - 1 && lines > 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <div className="skeleton h-6 w-1/3 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-4 w-3/5 rounded" />
      </div>
    </div>
  );
};
