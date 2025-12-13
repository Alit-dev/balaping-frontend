import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    once?: boolean;
}

export function FadeIn({
    children,
    className,
    delay = 0,
    direction = 'up',
    once = true,
}: FadeInProps) {
    const [ref, inView] = useInView({
        triggerOnce: once,
        threshold: 0.1,
    });

    const directionOffset = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { y: 0, x: 40 },
        right: { y: 0, x: -40 },
        none: { y: 0, x: 0 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...directionOffset[direction] }}
            animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
