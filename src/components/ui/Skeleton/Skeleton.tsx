import { cn } from '@/lib/utils';

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Additional class names */
  className?: string;
}

/**
 * Skeleton loading placeholder component
 *
 * @example
 * <Skeleton width={200} height={20} />
 * <Skeleton variant="circular" width={40} height={40} />
 */
export function Skeleton({
  width,
  height,
  variant = 'rectangular',
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      role="status"
      aria-label="Lädt..."
      className={cn(
        'animate-pulse bg-muted',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-md',
        variant === 'text' && 'rounded h-4',
        className
      )}
      style={style}
    >
      <span className="sr-only">Lädt...</span>
    </div>
  );
}

/**
 * Skeleton for text content with multiple lines
 */
export interface SkeletonTextProps {
  /** Number of lines to display */
  lines?: number;
  /** Additional class names */
  className?: string;
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            // Last line is shorter
            i === lines - 1 && 'w-3/4'
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for a card with image and text
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <Skeleton className="mb-4 h-40 w-full" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <SkeletonText lines={2} />
    </div>
  );
}

/**
 * Skeleton for timeline event
 */
export function SkeletonTimelineEvent({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-start gap-4', className)}>
      <Skeleton variant="circular" width={12} height={12} className="mt-1.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-24" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
