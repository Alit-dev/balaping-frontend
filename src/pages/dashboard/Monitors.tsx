import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { monitorApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import {
    Plus,
    ExternalLink,
    Clock,
    Pause,
    Play,
    Trash2,
    Edit,
    Search,
    Activity,
    Zap,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    ArrowUpRight,
    Filter,
    LayoutGrid,
    List,
    TrendingUp,
    WifiOff,
} from 'lucide-react';
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
import { formatDateTime, formatResponseTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/animated';

interface Monitor {
    _id: string;
    name: string;
    url: string;
    method: string;
    intervalSec: number;
    active: boolean;
    lastStatus: 'up' | 'down' | 'pending';
    lastChecked: string;
    lastResponseMs: number;
}

type FilterType = 'all' | 'up' | 'down' | 'paused';
type ViewType = 'list' | 'grid';

// Simple Animated Counter
function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const duration = 600;
        const start = Date.now();
        const initial = display;

        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(initial + (value - initial) * eased));

            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [value]);

    return <span>{display}</span>;
}

// Simple Status Dot
function StatusDot({ status, active }: { status: string; active: boolean }) {
    const isUp = active && status === 'up';
    const isDown = active && status === 'down';

    return (
        <div className="relative">
            <div className={cn(
                'w-2.5 h-2.5 rounded-full',
                isUp && 'bg-emerald-500',
                isDown && 'bg-red-500',
                (!active || status === 'pending') && 'bg-gray-400'
            )} />
            {isUp && (
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-50" />
            )}
        </div>
    );
}

// Mini Uptime Bar
function UptimeBar({ segments = 30 }: { segments?: number }) {
    const data = useMemo(() =>
        Array.from({ length: segments }, () => Math.random() > 0.05 ? 'up' : 'down'),
        [segments]);

    const uptime = Math.round((data.filter(s => s === 'up').length / segments) * 100);

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-[2px] flex-1">
                {data.map((s, i) => (
                    <div
                        key={i}
                        className={cn(
                            'w-full h-6 rounded-sm transition-transform hover:scale-y-110',
                            s === 'up' ? 'bg-emerald-400' : 'bg-red-400'
                        )}
                        style={{ animationDelay: `${i * 15}ms` }}
                    />
                ))}
            </div>
            <span className={cn(
                'text-xs font-semibold tabular-nums w-12 text-right',
                uptime >= 99 && 'text-emerald-600',
                uptime >= 95 && uptime < 99 && 'text-amber-600',
                uptime < 95 && 'text-red-600'
            )}>
                {uptime}%
            </span>
        </div>
    );
}

// Stat Card
function StatCard({
    label,
    value,
    icon: Icon,
    color = 'gray',
    delay = 0
}: {
    label: string;
    value: number;
    icon: React.ElementType;
    color?: 'gray' | 'primary' | 'emerald' | 'red';
    delay?: number;
}) {
    const colors = {
        gray: 'bg-gray-50 text-gray-600',
        primary: 'bg-primary-50 text-primary-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                        <AnimatedNumber value={value} />
                    </p>
                </div>
                <div className={cn('p-3 rounded-xl', colors[color])}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

export function Monitors() {
    const { currentTeam } = useAuthStore();
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [view, setView] = useState<ViewType>('list');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (currentTeam) loadMonitors();
    }, [currentTeam]);

    const loadMonitors = async () => {
        try {
            const res = await monitorApi.getMonitors(currentTeam!._id);
            setMonitors(res.data.monitors);
        } catch (e) {
            console.error('Failed to load monitors:', e);
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        setRefreshing(true);
        await loadMonitors();
        setTimeout(() => setRefreshing(false), 400);
    };

    const pause = async (id: string) => {
        setActionLoading(id);
        try {
            await monitorApi.pauseMonitor(currentTeam!._id, id);
            await loadMonitors();
        } finally {
            setActionLoading(null);
        }
    };

    const resume = async (id: string) => {
        setActionLoading(id);
        try {
            await monitorApi.resumeMonitor(currentTeam!._id, id);
            await loadMonitors();
        } finally {
            setActionLoading(null);
        }
    };

    const remove = async (id: string) => {
        setActionLoading(id);
        try {
            await monitorApi.deleteMonitor(currentTeam!._id, id);
            setMonitors(m => m.filter(x => x._id !== id));
        } finally {
            setActionLoading(null);
        }
    };

    // Filtered monitors
    const filtered = useMemo(() => {
        return monitors.filter(m => {
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.url.toLowerCase().includes(search.toLowerCase());

            if (filter === 'up') return matchSearch && m.active && m.lastStatus === 'up';
            if (filter === 'down') return matchSearch && m.active && m.lastStatus === 'down';
            if (filter === 'paused') return matchSearch && !m.active;
            return matchSearch;
        });
    }, [monitors, search, filter]);

    // Stats
    const stats = useMemo(() => ({
        total: monitors.length,
        up: monitors.filter(m => m.active && m.lastStatus === 'up').length,
        down: monitors.filter(m => m.active && m.lastStatus === 'down').length,
        avgMs: monitors.length ? Math.round(monitors.reduce((a, m) => a + (m.lastResponseMs || 0), 0) / monitors.length) : 0,
    }), [monitors]);

    const timeSince = (d: string) => {
        if (!d) return '--';
        const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
        if (s < 60) return `${s}s`;
        if (s < 3600) return `${Math.floor(s / 60)}m`;
        return `${Math.floor(s / 3600)}h`;
    };

    // Loading
    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Monitors</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {monitors.length} monitor{monitors.length !== 1 ? 's' : ''} • Real-time health tracking
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={refresh}
                        className="rounded-xl"
                    >
                        <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
                    </Button>
                    <Button asChild className="rounded-xl shadow-sm">
                        <Link to="/monitors/new">
                            <Plus className="w-4 h-4 mr-2" />
                            New Monitor
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total" value={stats.total} icon={Activity} color="primary" delay={0} />
                <StatCard label="Operational" value={stats.up} icon={CheckCircle2} color="emerald" delay={50} />
                <StatCard label="Down" value={stats.down} icon={AlertCircle} color="red" delay={100} />
                <StatCard label="Avg Response" value={stats.avgMs} icon={Zap} color="gray" delay={150} />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search monitors..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    {(['all', 'up', 'down', 'paused'] as FilterType[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                                filter === f
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            )}
                        >
                            {f === 'all' && 'All'}
                            {f === 'up' && 'Up'}
                            {f === 'down' && 'Down'}
                            {f === 'paused' && 'Paused'}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setView('list')}
                        className={cn(
                            'p-2 rounded-lg transition-all',
                            view === 'list' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setView('grid')}
                        className={cn(
                            'p-2 rounded-lg transition-all',
                            view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {monitors.length === 0 ? (
                <EmptyState
                    icon={Activity}
                    title="No monitors yet"
                    description="Start monitoring your websites and APIs to get real-time uptime alerts."
                    action={
                        <Button asChild className="rounded-xl">
                            <Link to="/monitors/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Monitor
                            </Link>
                        </Button>
                    }
                />
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-gray-500">No monitors match your filters</p>
                </div>
            ) : view === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((m, i) => (
                        <div
                            key={m._id}
                            className={cn(
                                'bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 animate-fade-in',
                                !m.active && 'opacity-60'
                            )}
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <StatusDot status={m.lastStatus} active={m.active} />
                                    <div>
                                        <Link
                                            to={`/monitors/${m._id}`}
                                            className="font-medium text-gray-900 hover:text-primary transition-colors"
                                        >
                                            {m.name}
                                        </Link>
                                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{m.url}</p>
                                    </div>
                                </div>
                                <Badge variant={!m.active ? 'secondary' : m.lastStatus === 'up' ? 'success' : 'danger'}>
                                    {!m.active ? 'Paused' : m.lastStatus === 'up' ? 'Up' : m.lastStatus === 'down' ? 'Down' : 'Pending'}
                                </Badge>
                            </div>
                            <UptimeBar segments={20} />
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {m.intervalSec}s
                                    </span>
                                    {m.lastResponseMs && (
                                        <span className={cn(
                                            m.lastResponseMs < 300 ? 'text-emerald-500' :
                                                m.lastResponseMs < 800 ? 'text-amber-500' : 'text-red-500'
                                        )}>
                                            {m.lastResponseMs}ms
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <Link to={`/monitors/${m._id}`}><ArrowUpRight className="w-4 h-4" /></Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-3">
                    {filtered.map((m, i) => (
                        <div
                            key={m._id}
                            className={cn(
                                'bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-gray-200 transition-all duration-300 animate-fade-in',
                                !m.active && 'opacity-60'
                            )}
                            style={{ animationDelay: `${i * 30}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                {/* Status */}
                                <StatusDot status={m.lastStatus} active={m.active} />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link
                                            to={`/monitors/${m._id}`}
                                            className="font-medium text-gray-900 hover:text-primary transition-colors truncate"
                                        >
                                            {m.name}
                                        </Link>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] px-1.5 py-0 font-mono"
                                        >
                                            {m.method}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">{m.url}</p>
                                </div>

                                {/* Uptime (hidden on mobile) */}
                                <div className="hidden lg:block w-48">
                                    <UptimeBar segments={24} />
                                </div>

                                {/* Stats */}
                                <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {m.intervalSec}s
                                    </span>
                                    {m.lastResponseMs && (
                                        <span className={cn(
                                            'tabular-nums font-medium',
                                            m.lastResponseMs < 300 ? 'text-emerald-500' :
                                                m.lastResponseMs < 800 ? 'text-amber-500' : 'text-red-500'
                                        )}>
                                            {m.lastResponseMs}ms
                                        </span>
                                    )}
                                    <span className="text-xs">{timeSince(m.lastChecked)}</span>
                                </div>

                                {/* Status Badge */}
                                <Badge
                                    variant={!m.active ? 'secondary' : m.lastStatus === 'up' ? 'success' : 'danger'}
                                    className="hidden sm:inline-flex"
                                >
                                    {!m.active ? 'Paused' : m.lastStatus === 'up' ? 'Up' : 'Down'}
                                </Badge>

                                {/* Actions */}
                                <div className="flex items-center gap-0.5">
                                    {m.active ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600"
                                            onClick={() => pause(m._id)}
                                            disabled={actionLoading === m._id}
                                        >
                                            <Pause className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
                                            onClick={() => resume(m._id)}
                                            disabled={actionLoading === m._id}
                                        >
                                            <Play className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <Link to={`/monitors/${m._id}/edit`}>
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                                disabled={actionLoading === m._id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete "{m.name}"?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently remove this monitor and all its data.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-600 hover:bg-red-700"
                                                    onClick={() => remove(m._id)}
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
