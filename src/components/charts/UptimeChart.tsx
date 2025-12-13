import { useMemo } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

interface UptimeChartProps {
    data: Array<{ timestamp: string; uptime: number; date?: string }>;
    period: '24H' | '7D' | '30D' | '90D';
    className?: string;
}

export function UptimeChart({ data, period, className }: UptimeChartProps) {
    const formattedData = useMemo(() => {
        return data.map((item) => ({
            ...item,
            uptimePercent: item.uptime * 100,
        }));
    }, [data]);

    const formatXAxis = (value: string) => {
        const date = new Date(value);
        if (period === '24H') {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (period === '7D') {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className={cn('w-full h-[300px]', className)}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={formatXAxis}
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[90, 100]}
                        tickFormatter={(value) => `${value}%`}
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        }}
                        labelStyle={{ color: '#0F172A', fontWeight: 600 }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Uptime']}
                    />
                    <Area
                        type="monotone"
                        dataKey="uptimePercent"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#uptimeGradient)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
