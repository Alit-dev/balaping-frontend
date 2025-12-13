import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { monitorApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { useSocketStore } from '@/stores/socketStore';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    ArrowLeft,
    ExternalLink,
    Clock,
    Pause,
    Play,
    Trash2,
    TrendingUp,
    Activity,
    Edit,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Globe,
    Zap
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatDateTime, formatResponseTime, formatUptime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Monitor {
    _id: string;
    name: string;
    url: string;
    method: string;
    intervalSec: number;
    expectedCode: number;
    timeout: number;
    active: boolean;
    lastStatus: 'up' | 'down' | 'pending';
    lastChecked: string;
    lastResponseMs: number;
    lastError: string;
}

interface Stats {
    uptimePercentage: number;
    totalChecks: number;
    successfulChecks: number;
    failedChecks: number;
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    incidents: any[];
}

interface ChartData {
    time: string;
    responseMs: number;
    success: boolean;
    timestamp: string;
}

export function MonitorDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentTeam } = useAuthStore();
    const { connect, disconnect, joinTeam, leaveTeam, socket } = useSocketStore();
    const [monitor, setMonitor] = useState<Monitor | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('24h');

    useEffect(() => {
        if (currentTeam && id) {
            loadMonitor();
            connect();
            joinTeam(currentTeam._id);

            return () => {
                leaveTeam(currentTeam._id);
                disconnect();
            };
        }
    }, [currentTeam, id, period]);

    useEffect(() => {
        if (!socket) return;

        const handleMonitorCheck = (data: any) => {
            if (data.monitorId !== id) return;

            setMonitor((prev) => prev ? {
                ...prev,
                lastStatus: data.success ? 'up' : 'down',
                lastChecked: data.checkedAt,
                lastResponseMs: data.responseMs,
                lastError: data.error,
            } : null);

            setChartData((prev) => {
                const newData = {
                    time: new Date(data.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    responseMs: data.responseMs,
                    success: data.success,
                    timestamp: data.checkedAt,
                };
                return [...prev, newData];
            });

            // Update stats
            setStats((prev) => {
                if (!prev) return null;
                const newTotal = prev.totalChecks + 1;
                const newSuccess = prev.successfulChecks + (data.success ? 1 : 0);
                return {
                    ...prev,
                    totalChecks: newTotal,
                    successfulChecks: newSuccess,
                    failedChecks: newTotal - newSuccess,
                    uptimePercentage: (newSuccess / newTotal) * 100,
                };
            });
        };

        const handleStatusChange = (data: any) => {
            if (data.monitorId !== id) return;
            // Reload to get latest incident info
            loadMonitor();
        };

        socket.on('monitor_check', handleMonitorCheck);
        socket.on('monitor_status_changed', handleStatusChange);

        return () => {
            socket.off('monitor_check', handleMonitorCheck);
            socket.off('monitor_status_changed', handleStatusChange);
        };
    }, [socket, id]);

    const loadMonitor = async () => {
        try {
            const [monitorRes, statsRes] = await Promise.all([
                monitorApi.getMonitor(currentTeam!._id, id!),
                monitorApi.getMonitorStats(currentTeam!._id, id!, period),
            ]);
            setMonitor(monitorRes.data.monitor);
            setStats(statsRes.data.stats);
            setChartData(
                statsRes.data.chartData.map((d: any) => ({
                    ...d,
                    timestamp: d.time,
                    time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }))
            );
        } catch (error) {
            console.error('Failed to load monitor:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePause = async () => {
        try {
            await monitorApi.pauseMonitor(currentTeam!._id, id!);
            await loadMonitor();
        } catch (error) {
            console.error('Failed to pause monitor:', error);
        }
    };

    const handleResume = async () => {
        try {
            await monitorApi.resumeMonitor(currentTeam!._id, id!);
            await loadMonitor();
        } catch (error) {
            console.error('Failed to resume monitor:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await monitorApi.deleteMonitor(currentTeam!._id, id!);
            navigate('/monitors');
        } catch (error) {
            console.error('Failed to delete monitor:', error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="h-[400px] bg-muted rounded-xl animate-pulse" />
            </div>
        );
    }

    if (!monitor) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold">Monitor Not Found</h2>
                <p className="text-muted-foreground mb-6">The monitor you are looking for does not exist or has been deleted.</p>
                <Button onClick={() => navigate('/monitors')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Monitors
                </Button>
            </div>
        );
    }

    const isUp = monitor.lastStatus === 'up';
    const isDown = monitor.lastStatus === 'down';
    const isPaused = !monitor.active;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/monitors')} className="h-10 w-10 rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{monitor.name}</h1>
                            <div className={cn(
                                "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium border",
                                isPaused ? "bg-muted text-muted-foreground border-muted-foreground/20" :
                                    isUp ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900" :
                                        isDown ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900" :
                                            "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900"
                            )}>
                                {!isPaused && (
                                    <span className="relative flex h-2 w-2 mr-1">
                                        <span className={cn(
                                            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                            isUp ? "bg-green-500" : isDown ? "bg-red-500" : "bg-yellow-500"
                                        )}></span>
                                        <span className={cn(
                                            "relative inline-flex rounded-full h-2 w-2",
                                            isUp ? "bg-green-500" : isDown ? "bg-red-500" : "bg-yellow-500"
                                        )}></span>
                                    </span>
                                )}
                                {isPaused ? 'Paused' : isUp ? 'Operational' : isDown ? 'Down' : 'Pending'}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <a
                                href={monitor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary flex items-center gap-1.5 transition-colors"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                {monitor.url}
                                <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {monitor.intervalSec}s interval
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/monitors/${id}/edit`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    {monitor.active ? (
                        <Button variant="outline" onClick={handlePause}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handleResume}>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                        </Button>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Monitor?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this monitor? This action cannot be undone and all historical data will be lost.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Status Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Overall Uptime
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatUptime(stats?.uptimePercentage || 100)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Over last {period}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Avg Response
                        </CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatResponseTime(stats?.avgResponseTime || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Min: {formatResponseTime(stats?.minResponseTime || 0)} • Max: {formatResponseTime(stats?.maxResponseTime || 0)}
                        </p>
                    </CardContent>
                </Card>

                <Card className={cn("border-l-4 shadow-sm", isUp ? "border-l-green-500" : isDown ? "border-l-red-500" : "border-l-yellow-500")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Current Status
                        </CardTitle>
                        {isUp ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isPaused ? 'Paused' : isUp ? 'Operational' : isDown ? 'Down' : 'Unknown'}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Last checked {monitor.lastChecked ? formatDateTime(monitor.lastChecked) : 'Never'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Checks
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalChecks.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.failedChecks || 0} failures recorded
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Uptime History Bars */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">Uptime History</CardTitle>
                    <CardDescription>Recent checks status (hover for details)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-[2px] h-12 w-full overflow-hidden">
                        {chartData.slice(-60).map((point, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "flex-1 rounded-sm transition-all hover:opacity-80 cursor-help",
                                    point.success ? "bg-green-500" : "bg-red-500"
                                )}
                                style={{
                                    height: point.success ? '100%' : '100%',
                                    opacity: 0.6 + (i / 60) * 0.4 // Fade effect for older data
                                }}
                                title={`${new Date(point.timestamp).toLocaleString()}: ${point.success ? 'Up' : 'Down'} (${point.responseMs}ms)`}
                            />
                        ))}
                        {chartData.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground bg-muted/30 rounded">
                                No data available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Main Chart Section */}
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Response Time</CardTitle>
                            <CardDescription>Average response time over the selected period</CardDescription>
                        </div>
                        <div className="flex items-center p-1 bg-muted rounded-lg">
                            {['1h', '24h', '7d', '30d'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={cn(
                                        "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                        period === p
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `${v}ms`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                        labelStyle={{ color: '#64748b', marginBottom: '0.25rem' }}
                                        formatter={(value: number) => [
                                            <span className="font-medium text-blue-600">{value}ms</span>,
                                            'Response Time'
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="responseMs"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorResponse)"
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <Activity className="w-10 h-10 mb-2 opacity-20" />
                                <p>No data available for this period</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Incidents */}
            <div className="grid gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Recent Incidents</h2>
                </div>

                {(stats?.incidents?.length || 0) > 0 ? (
                    <div className="space-y-4">
                        {stats?.incidents.map((incident, i) => (
                            <Card key={i} className={cn(
                                "transition-all hover:shadow-md",
                                incident.ongoing ? "border-l-4 border-l-red-500" : "border-l-4 border-l-green-500"
                            )}>
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "p-2 rounded-full",
                                                incident.ongoing ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                            )}>
                                                {incident.ongoing ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-base">
                                                    {incident.ongoing ? 'Ongoing Outage' : 'Service Restored'}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {incident.error || 'Unknown error'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="font-medium">
                                                    {formatDateTime(incident.startedAt)}
                                                </span>
                                                {incident.endedAt ? (
                                                    <span className="text-muted-foreground">
                                                        Duration: {Math.round(incident.duration / 1000)}s
                                                    </span>
                                                ) : (
                                                    <Badge variant="destructive" className="animate-pulse">
                                                        Active Now
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4 opacity-80" />
                            <h3 className="text-lg font-medium">No Incidents Reported</h3>
                            <p className="text-muted-foreground max-w-sm mt-2">
                                This monitor has been stable with no downtime recorded in the selected period.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
