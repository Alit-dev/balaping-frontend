import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface UptimeCalendarProps {
    data: Array<{
        date: string;
        uptime: number; // 0-100
        incidents: number;
    }>;
    days?: number; // Default 90
    className?: string;
}

export function UptimeCalendar({ data, days = 90, className }: UptimeCalendarProps) {
    const calendarData = useMemo(() => {
        const today = new Date();
        const result = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = data.find((d) => d.date.startsWith(dateStr));

            result.push({
                date: dateStr,
                uptime: dayData?.uptime ?? 100,
                incidents: dayData?.incidents ?? 0,
            });
        }

        return result;
    }, [data, days]);

    const getColor = (uptime: number) => {
        if (uptime >= 99.5) return 'bg-success-500';
        if (uptime >= 98) return 'bg-success-600/70';
        if (uptime >= 95) return 'bg-warning-500';
        if (uptime >= 90) return 'bg-warning-600';
        return 'bg-danger-500';
    };

    const avgUptime = useMemo(() => {
        if (calendarData.length === 0) return 100;
        const sum = calendarData.reduce((acc, day) => acc + day.uptime, 0);
        return (sum / calendarData.length).toFixed(2);
    }, [calendarData]);

    return (
        <div className={cn('w-full', className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Uptime Calendar</h3>
                <div className="text-sm">
                    <span className="text-text-secondary">Last {days} days:</span>{' '}
                    <span className="font-semibold text-success">{avgUptime}%</span>
                </div>
            </div>

            <TooltipProvider>
                <div className="grid grid-cols-15 lg:grid-cols-30 gap-1">
                    {calendarData.map((day, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        'aspect-square rounded-sm transition-transform hover:scale-125 cursor-pointer',
                                        getColor(day.uptime)
                                    )}
                                    aria-label={`${day.date}: ${day.uptime}% uptime`}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-xs">
                                    <div className="font-semibold">{new Date(day.date).toLocaleDateString()}</div>
                                    <div className="text-success">{day.uptime.toFixed(2)}% uptime</div>
                                    {day.incidents > 0 && (
                                        <div className="text-danger">{day.incidents} incident(s)</div>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-text-secondary">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-danger-500" />
                    <div className="w-3 h-3 rounded-sm bg-warning-600" />
                    <div className="w-3 h-3 rounded-sm bg-warning-500" />
                    <div className="w-3 h-3 rounded-sm bg-success-600/70" />
                    <div className="w-3 h-3 rounded-sm bg-success-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
