import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:bg-primary-600 hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] active:scale-[0.97] active:shadow-[0_2px_8px_rgba(37,99,235,0.25)]',
                destructive:
                    'bg-danger text-danger-foreground shadow-[0_4px_16px_rgba(239,68,68,0.35)] hover:bg-danger-600 hover:shadow-[0_8px_24px_rgba(239,68,68,0.45)] active:scale-[0.97]',
                outline:
                    'border border-black/10 bg-white/60 backdrop-blur-sm shadow-sm hover:bg-white/80 hover:border-primary/30 hover:shadow-md active:scale-[0.98]',
                secondary:
                    'bg-muted/60 text-muted-foreground backdrop-blur-sm shadow-sm hover:bg-muted/80 hover:shadow-md active:scale-[0.98]',
                ghost: 'hover:bg-black/5 hover:text-foreground active:bg-black/10',
                link: 'text-primary underline-offset-4 hover:underline',
                success:
                    'bg-success text-success-foreground shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:bg-success-600 hover:shadow-[0_8px_24px_rgba(16,185,129,0.45)] active:scale-[0.97]',
                glass:
                    'bg-white/50 backdrop-blur-xl border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:bg-white/70 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] active:scale-[0.97]',
            },
            size: {
                default: 'h-10 px-5 py-2',
                sm: 'h-9 rounded-lg px-4 text-xs',
                lg: 'h-12 rounded-xl px-8 text-base',
                icon: 'h-10 w-10 rounded-xl',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {children}
                    </>
                ) : (
                    children
                )}
            </Comp>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
