import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { monitorApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import {
    Activity,
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Plus,
    Server,
    RefreshCw,
    TrendingUp,
    Zap,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatDateTime, formatResponseTime, cn } from '@/lib/utils';
import { NumberCounter, AnimatedCard, FadeIn } from '@/components/animated';

interface DashboardStats {
    totalMonitors: number;
    activeMonitors: number;
    upMonitors: number;
    downMonitors: number;
    overallUptime: number;
    avgResponseTime: number;
    totalChecks24h: number;
    recentIncidents: {
        monitorId: string;
        monitorName: string;
        url: string;
        error: string;
        since: string;
    }[];
}

// Generate chart data
const generateChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
            time: `${time.getHours()}:00`,
            value: Math.floor(Math.random() * 80) + 40,
        });
    }
    return data;
};

export function Dashboard() {
    const { currentTeam, user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartData] = useState(generateChartData());
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (currentTeam) {
            loadDashboard();
        } else {
            setLoading(false);
        }
    }, [currentTeam]);

    const loadDashboard = async () => {
        try {
            setRefreshing(true);
            const response = await monitorApi.getDashboard(currentTeam!._id);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-8 space-y-6">
                <div className="h-8 w-40 bg-muted rounded-lg animate-pulse" />
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="h-80 bg-muted rounded-xl animate-pulse" />
            </div>
        );
    }

    const isHealthy = (stats?.downMonitors || 0) === 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Welcome back, {user?.name?.split(' ')[0] || 'there'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={loadDashboard}
                        disabled={refreshing}
                        className="rounded-xl hover:bg-black/5"
                    >
                        <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                    </Button>
                    <Link to="/monitors/new">
                        <Button size="sm" className="rounded-xl h-10 px-4">
                            <Plus className="h-4 w-4 mr-1.5" />
                            Add Monitor
                        </Button>
                    </Link>
                </div>
            </div>

            {/* System Status */}
            <div className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-sm animate-slide-up transition-all duration-300",
                isHealthy
                    ? "bg-success-50/70 border-success-100 shadow-[0_4px_16px_rgba(16,185,129,0.1)]"
                    : "bg-danger-50/70 border-danger-100 shadow-[0_4px_16px_rgba(239,68,68,0.1)]"
            )}>
                {isHealthy ? (
                    <div className="p-2 rounded-xl bg-success-100/80">
                        <CheckCircle2 className="h-5 w-5 text-success-600" />
                    </div>
                ) : (
                    <div className="p-2 rounded-xl bg-danger-100/80">
                        <AlertTriangle className="h-5 w-5 text-danger-600" />
                    </div>
                )}
                <div className="flex-1">
                    <span className={cn("font-semibold text-sm", isHealthy ? "text-success-700" : "text-danger-700")}>
                        {isHealthy ? 'All systems operational' : `${stats?.downMonitors} monitor(s) down`}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium bg-white/50 px-2.5 py-1 rounded-full">
                    {stats?.upMonitors || 0}/{stats?.totalMonitors || 0} healthy
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Monitors"
                    value={stats?.totalMonitors || 0}
                    icon={Server}
                    color="text-blue-600"
                    bg="bg-blue-50"
                    delay={0}
                />
                <StatCard
                    label="Uptime"
                    value={`${stats?.overallUptime?.toFixed(1) || '100'}%`}
                    icon={TrendingUp}
                    color="text-green-600"
                    bg="bg-green-50"
                    delay={50}
                />
                <StatCard
                    label="Avg Response"
                    value={formatResponseTime(stats?.avgResponseTime || 0)}
                    icon={Zap}
                    color="text-purple-600"
                    bg="bg-purple-50"
                    delay={100}
                />
                <StatCard
                    label="Checks (24h)"
                    value={stats?.totalChecks24h?.toLocaleString() || '0'}
                    icon={Activity}
                    color="text-orange-600"
                    bg="bg-orange-50"
                    delay={150}
                />
            </div>

            {/* Chart */}
            <Card className="border shadow-sm animate-scale-in">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Response Time</CardTitle>
                        <span className="text-xs text-muted-foreground">Last 24 hours</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4F6DF5" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#4F6DF5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#888' }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#888' }}
                                    tickFormatter={(v) => `${v}ms`}
                                    width={50}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white',
                                        border: '1px solid #eee',
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }}
                                    formatter={(value: number) => [`${value}ms`, 'Response']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4F6DF5"
                                    strokeWidth={2}
                                    fill="url(#gradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card className="border shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Recent Incidents</CardTitle>
                        <Link to="/incidents">
                            <Button variant="ghost" size="sm" className="text-xs h-7">
                                View all <ArrowUpRight className="h-3 w-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {(stats?.recentIncidents?.length || 0) > 0 ? (
                        <div className="space-y-3">
                            {stats?.recentIncidents.slice(0, 5).map((incident) => (
                                <Link
                                    key={incident.monitorId}
                                    to={`/monitors/${incident.monitorId}`}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{incident.monitorName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{incident.error}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDateTime(incident.since)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <p className="text-sm font-medium">No incidents</p>
                            <p className="text-xs text-muted-foreground">All systems running smoothly</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon: Icon,
    color,
    bg,
    delay = 0,
}: {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    delay?: number;
}) {
    const isNumber = typeof value === 'number';

    return (
        <AnimatedCard
            delay={delay / 1000}
            hoverLift
            className="border-white/30"
        >
            <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", bg)}>
                    <Icon className={cn("h-5 w-5", color)} />
                </div>
                <div>
                    <p className="text-2xl font-bold tabular-nums text-gray-900">
                        {isNumber ? (
                            <NumberCounter value={value} duration={1.5} />
                        ) : (
                            value
                        )}
                    </p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                </div>
            </div>
        </AnimatedCard>
    );
}
