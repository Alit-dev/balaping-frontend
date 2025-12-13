import { useEffect, useState } from 'react';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Filter,
    Search,
    ChevronDown,
    XCircle,
    RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { incidentApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/animated/Skeleton';

interface Incident {
    _id: string;
    title?: string;
    monitorId?: {
        _id: string;
        name: string;
        url?: string;
    };
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    severity?: 'minor' | 'major' | 'critical';
    startTime: string;
    endTime?: string;
    duration?: string;
    message?: string;
    description?: string;
    timeline?: Array<{
        timestamp: string;
        status: string;
        message: string;
    }>;
}

interface IncidentStats {
    activeCount: number;
    resolvedLast24h: number;
    avgDuration: string;
}

export default function Incidents() {
    const { currentTeam } = useAuthStore();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [stats, setStats] = useState<IncidentStats>({
        activeCount: 0,
        resolvedLast24h: 0,
        avgDuration: '-'
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (currentTeam) {
            loadIncidents();
        }
    }, [currentTeam, statusFilter]);

    const loadIncidents = async () => {
        if (!currentTeam) return;

        try {
            setRefreshing(true);
            const params: any = {};
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await incidentApi.getIncidents(currentTeam._id, params);
            setIncidents(response.data.incidents || []);

            // Calculate stats from data
            const active = (response.data.incidents || []).filter(
                (inc: Incident) => inc.status !== 'resolved'
            ).length;

            const now = new Date();
            const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const resolvedLast24h = (response.data.incidents || []).filter(
                (inc: Incident) =>
                    inc.status === 'resolved' &&
                    inc.endTime &&
                    new Date(inc.endTime) >= last24h
            ).length;

            // Calculate average duration for resolved incidents
            const resolvedIncidents = (response.data.incidents || []).filter(
                (inc: Incident) => inc.status === 'resolved' && inc.startTime && inc.endTime
            );

            let avgDuration = '-';
            if (resolvedIncidents.length > 0) {
                const totalMs = resolvedIncidents.reduce((sum: number, inc: Incident) => {
                    const start = new Date(inc.startTime).getTime();
                    const end = inc.endTime ? new Date(inc.endTime).getTime() : Date.now();
                    return sum + (end - start);
                }, 0);
                const avgMs = totalMs / resolvedIncidents.length;
                avgDuration = formatDuration(avgMs);
            }

            setStats({ activeCount: active, resolvedLast24h, avgDuration });
        } catch (error) {
            console.error('Failed to load incidents:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m`;
        return `${seconds}s`;
    };

    const calculateIncidentDuration = (incident: Incident) => {
        const start = new Date(incident.startTime).getTime();
        const end = incident.endTime ? new Date(incident.endTime).getTime() : Date.now();
        return formatDuration(end - start);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'secondary';
            case 'investigating':
            case 'identified':
            case 'monitoring':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'critical':
                return 'text-red-600 bg-red-100';
            case 'major':
                return 'text-orange-600 bg-orange-100';
            case 'minor':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-blue-600 bg-blue-100';
        }
    };

    const handleSearch = () => {
        loadIncidents();
    };

    const filteredIncidents = incidents.filter(incident => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const monitorName = typeof incident.monitorId === 'object'
                ? incident.monitorId?.name?.toLowerCase() || ''
                : '';
            const title = incident.title?.toLowerCase() || '';
            const message = incident.message?.toLowerCase() || '';

            return monitorName.includes(query) || title.includes(query) || message.includes(query);
        }
        return true;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Incidents</h1>
                        <p className="text-text-secondary">Track and manage downtime incidents</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={loadIncidents}
                        disabled={refreshing}
                        className="rounded-full"
                    >
                        <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                    </Button>
                </div>
            </FadeIn>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4">
                <FadeIn delay={0.1}>
                    <AnimatedCard className="glass-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">Active Incidents</p>
                                <p className="text-3xl font-bold text-danger">{stats.activeCount}</p>
                            </div>
                            <div className="p-3 bg-danger-50 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-danger" />
                            </div>
                        </div>
                    </AnimatedCard>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <AnimatedCard className="glass-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">Resolved (24h)</p>
                                <p className="text-3xl font-bold text-success">{stats.resolvedLast24h}</p>
                            </div>
                            <div className="p-3 bg-success-50 rounded-xl">
                                <CheckCircle2 className="w-6 h-6 text-success" />
                            </div>
                        </div>
                    </AnimatedCard>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <AnimatedCard className="glass-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-text-secondary">Avg Duration</p>
                                <p className="text-3xl font-bold text-primary">{stats.avgDuration}</p>
                            </div>
                            <div className="p-3 bg-primary-50 rounded-xl">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </AnimatedCard>
                </FadeIn>
            </div>

            {/* Filters */}
            <FadeIn delay={0.4}>
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <Input
                                placeholder="Search incidents..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                            <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform", showFilters && "rotate-180")} />
                        </Button>
                    </div>

                    {showFilters && (
                        <Card className="p-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-text-primary mb-2 block">Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['all', 'investigating', 'identified', 'monitoring', 'resolved'].map(status => (
                                            <Button
                                                key={status}
                                                variant={statusFilter === status ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setStatusFilter(status)}
                                                className="capitalize"
                                            >
                                                {status}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </FadeIn>

            {/* Incidents List */}
            <div className="space-y-3">
                {filteredIncidents.length === 0 ? (
                    <FadeIn delay={0.5}>
                        <Card className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="h-8 w-8 text-success" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No incidents found</h3>
                            <p className="text-text-secondary">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'All systems running smoothly'}
                            </p>
                        </Card>
                    </FadeIn>
                ) : (
                    filteredIncidents.map((incident, i) => (
                        <FadeIn key={incident._id} delay={0.1 * (i + 5)}>
                            <AnimatedCard hoverLift className="cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={cn(
                                            'w-2 h-2 rounded-full mt-2',
                                            incident.status === 'resolved'
                                                ? 'bg-gray-400'
                                                : 'bg-danger animate-pulse'
                                        )} />

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-semibold text-text-primary">
                                                    {typeof incident.monitorId === 'object'
                                                        ? incident.monitorId?.name
                                                        : incident.title || 'Untitled Incident'}
                                                </h3>
                                                <Badge variant={getStatusColor(incident.status)}>
                                                    {incident.status}
                                                </Badge>
                                                {incident.severity && (
                                                    <Badge
                                                        className={cn(
                                                            "capitalize border-0",
                                                            getSeverityColor(incident.severity)
                                                        )}
                                                    >
                                                        {incident.severity}
                                                    </Badge>
                                                )}
                                            </div>
                                            {incident.message && (
                                                <p className="text-sm text-text-secondary mb-2">{incident.message}</p>
                                            )}
                                            {incident.description && (
                                                <p className="text-sm text-text-muted mb-2">{incident.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-text-muted">
                                                <span>Started: {new Date(incident.startTime).toLocaleString()}</span>
                                                <span>Duration: {calculateIncidentDuration(incident)}</span>
                                                {incident.endTime && incident.status === 'resolved' && (
                                                    <span className="text-success">✓ Resolved</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="sm">View Details</Button>
                                </div>
                            </AnimatedCard>
                        </FadeIn>
                    ))
                )}
            </div>
        </div>
    );
}
