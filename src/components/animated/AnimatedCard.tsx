import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    hoverScale?: boolean;
    hoverLift?: boolean;
    onClick?: () => void;
}

export function AnimatedCard({
    children,
    className,
    delay = 0,
    hoverScale = false,
    hoverLift = true,
    onClick,
}: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
            whileHover={
                hoverLift
                    ? { y: -4, boxShadow: '0 16px 48px rgba(31, 38, 135, 0.15)' }
                    : hoverScale
                        ? { scale: 1.02 }
                        : {}
            }
            className={cn(
                'rounded-2xl bg-white/75 backdrop-blur-xl border border-white/40 p-6',
                'shadow-[0_8px_32px_rgba(31,38,135,0.1)]',
                'transition-all duration-300 ease-out',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
