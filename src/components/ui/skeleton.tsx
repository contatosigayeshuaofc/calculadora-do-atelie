import { cn } from "@/lib/cn";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("atelier-skeleton rounded-[var(--radius-sm)]", className)} aria-hidden="true" />;
}
