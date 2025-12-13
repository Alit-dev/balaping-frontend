import { useMemo } from 'react';
import {
    Line,
    LineChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ResponseTimeChartProps {
    data: Array<{ timestamp: string; responseTime: number }>;
    className?: string;
}

export function ResponseTimeChart({ data, className }: ResponseTimeChartProps) {
    const formattedData = useMemo(() => {
        return data.map((item) => ({
            ...item,
            time: new Date(item.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));
    }, [data]);

    const avgResponseTime = useMemo(() => {
        if (data.length === 0) return 0;
        const sum = data.reduce((acc, item) => acc + item.responseTime, 0);
        return Math.round(sum / data.length);
    }, [data]);

    const maxResponseTime = useMemo(() => {
        if (data.length === 0) return 0;
        return Math.max(...data.map((item) => item.responseTime));
    }, [data]);

    return (
        <div className={cn('w-full', className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Response Time Trend</h3>
                <div className="flex gap-4 text-sm">
                    <div>
                        <span className="text-text-secondary">Avg:</span>{' '}
                        <span className="font-semibold text-primary">{avgResponseTime}ms</span>
                    </div>
                    <div>
                        <span className="text-text-secondary">Peak:</span>{' '}
                        <span className="font-semibold text-warning">{maxResponseTime}ms</span>
                    </div>
                </div>
            </div>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <defs>
                            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#94A3B8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value}ms`}
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
                            formatter={(value: number) => [`${value}ms`, 'Response Time']}
                        />
                        <Line
                            type="monotone"
                            dataKey="responseTime"
                            stroke="#2563EB"
                            strokeWidth={2}
                            dot={{ fill: '#2563EB', r: 3 }}
                            activeDot={{ r: 5 }}
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
