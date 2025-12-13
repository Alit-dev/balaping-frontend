import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:shadow-primary/40',
                secondary:
                    'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
                destructive:
                    'border-transparent bg-danger text-danger-foreground shadow-sm shadow-danger/25 hover:shadow-danger/40',
                outline: 'text-foreground border-black/10 bg-white/50 backdrop-blur-sm',
                success:
                    'border-transparent bg-success-50 text-success-600 ring-1 ring-success-200/50',
                danger:
                    'border-transparent bg-danger-50 text-danger-600 ring-1 ring-danger-200/50',
                warning:
                    'border-transparent bg-warning-50 text-warning-600 ring-1 ring-warning-200/50',
                glass:
                    'border-white/30 bg-white/50 backdrop-blur-sm text-foreground shadow-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
