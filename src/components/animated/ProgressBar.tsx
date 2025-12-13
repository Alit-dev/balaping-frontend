import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
    className?: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantColors = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
};

export function ProgressBar({
    value,
    max = 100,
    label,
    showPercentage = true,
    className,
    variant = 'default',
}: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={cn('space-y-1', className)}>
            {(label || showPercentage) && (
                <div className="flex items-center justify-between text-sm">
                    {label && <span className="font-medium">{label}</span>}
                    {showPercentage && (
                        <span className="text-muted-foreground tabular-nums">{percentage.toFixed(0)}%</span>
                    )}
                </div>
            )}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn('h-full transition-all duration-500 ease-out', variantColors[variant])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
