import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberCounterProps {
    value: number;
    duration?: number;
    className?: string;
    decimals?: number;
    suffix?: string;
    prefix?: string;
}

export function NumberCounter({
    value,
    duration = 2,
    className,
    decimals = 0,
    suffix = '',
    prefix = '',
}: NumberCounterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        return decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString();
    });

    useEffect(() => {
        const controls = animate(count, value, { duration });
        return controls.stop;
    }, [value, duration, count]);

    return (
        <motion.span className={cn('counter tabular-nums', className)}>
            {prefix}
            <motion.span>{rounded}</motion.span>
            {suffix}
        </motion.span>
    );
}
