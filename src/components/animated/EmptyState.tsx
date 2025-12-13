import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(
                'flex flex-col items-center justify-center py-16 px-4 text-center',
                className
            )}
        >
            {Icon && (
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="mb-6 text-gray-300"
                >
                    <Icon className="w-12 h-12" />
                </motion.div>
            )}

            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

            {description && (
                <p className="text-gray-600 max-w-md mb-6">{description}</p>
            )}

            {action && <div className="mt-4">{action}</div>}
        </motion.div>
    );
}
