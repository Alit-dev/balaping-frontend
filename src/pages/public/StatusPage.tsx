import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { statusApi } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime, formatUptime, formatResponseTime } from '@/lib/utils';

interface Monitor {
    id: string;
    name: string;
    url: string;
    status: 'up' | 'down' | 'pending';
    lastChecked: string;
    responseTime: number;
    uptime24h: number;
}

interface StatusPageData {
    team: {
        name: string;
        slug: string;
    };
    overallStatus: 'up' | 'down' | 'degraded';
    monitors: Monitor[];
    lastUpdated: string;
}

export function StatusPage() {
    const { slug } = useParams<{ slug: string }>();
    const [data, setData] = useState<StatusPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            loadStatusPage();
        }
    }, [slug]);

    const loadStatusPage = async () => {
        try {
            const response = await statusApi.getStatusPage(slug!);
            setData(response.data.statusPage);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Status page not found');
        } finally {
            setLoading(false);
        }
    };

    const getOverallStatusConfig = (status: string) => {
        switch (status) {
            case 'up':
                return {
                    label: 'All Systems Operational',
                    color: 'bg-success',
                    textColor: 'text-success',
                    bgColor: 'bg-success-50',
                    icon: CheckCircle,
                };
            case 'down':
                return {
                    label: 'Major Outage',
                    color: 'bg-danger',
                    textColor: 'text-danger',
                    bgColor: 'bg-danger-50',
                    icon: XCircle,
                };
            default:
                return {
                    label: 'Partial Outage',
                    color: 'bg-yellow-500',
                    textColor: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    icon: Clock,
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/20 to-white flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/20 to-white flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Status Page Not Found</h1>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    const statusConfig = getOverallStatusConfig(data?.overallStatus || 'up');

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/20 to-white">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">{data?.team.name}</h1>
                                <p className="text-sm text-muted-foreground">Status Page</p>
                            </div>
                        </div>
                        <Link
                            to="/"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Powered by Balaping
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Overall Status */}
                <div
                    className={cn(
                        'rounded-2xl p-6 mb-8 transition-all',
                        statusConfig.bgColor
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn('p-3 rounded-xl', statusConfig.color)}>
                            <statusConfig.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className={cn('text-2xl font-bold', statusConfig.textColor)}>
                                {statusConfig.label}
                            </h2>
                            <p className="text-muted-foreground">
                                Last updated: {formatDateTime(data?.lastUpdated || new Date().toISOString())}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Monitors */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-4">Services</h3>

                    {data?.monitors.map((monitor) => (
                        <div
                            key={monitor.id}
                            className="bg-white rounded-xl border p-4 shadow-soft hover:shadow-medium transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div
                                            className={cn(
                                                'w-3 h-3 rounded-full',
                                                monitor.status === 'up' && 'bg-success',
                                                monitor.status === 'down' && 'bg-danger',
                                                monitor.status === 'pending' && 'bg-gray-400'
                                            )}
                                        />
                                        {monitor.status === 'up' && (
                                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-ping opacity-75" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{monitor.name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {monitor.responseTime
                                                ? `${formatResponseTime(monitor.responseTime)}`
                                                : 'Checking...'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-medium">
                                            {formatUptime(monitor.uptime24h)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">24h uptime</div>
                                    </div>
                                    <Badge
                                        variant={
                                            monitor.status === 'up'
                                                ? 'success'
                                                : monitor.status === 'down'
                                                    ? 'danger'
                                                    : 'secondary'
                                        }
                                    >
                                        {monitor.status === 'up'
                                            ? 'Operational'
                                            : monitor.status === 'down'
                                                ? 'Down'
                                                : 'Checking'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Uptime bar */}
                            <div className="mt-4">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-all',
                                            monitor.uptime24h >= 99 && 'bg-success',
                                            monitor.uptime24h >= 95 && monitor.uptime24h < 99 && 'bg-yellow-500',
                                            monitor.uptime24h < 95 && 'bg-danger'
                                        )}
                                        style={{ width: `${monitor.uptime24h}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {data?.monitors.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No monitors configured
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-auto">
                <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    <p>© 2024 {data?.team.name}. Powered by Balaping.</p>
                </div>
            </footer>
        </div>
    );
}
