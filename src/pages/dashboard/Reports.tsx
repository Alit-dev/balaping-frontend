import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Calendar, Filter, Clock, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { reportApi, monitorApi } from '@/api/client';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';

interface ReportData {
    summary: {
        monitorsTracked: number;
        averageUptime: number;
        totalIncidents: number;
        averageResponseTime: number;
    };
    monitors: Array<{
        id: string;
        name: string;
        url: string;
        uptime: number;
        avgResponseTime: number;
        incidents: number;
        totalChecks: number;
    }>;
    dateRange: {
        start: string;
        end: string;
    };
}

export default function Reports() {
    const { currentTeam } = useAuthStore();
    const [generating, setGenerating] = useState(false);
    const [report, setReport] = useState<ReportData | null>(null);
    const [monitors, setMonitors] = useState<any[]>([]);

    // Form state
    const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedMonitor, setSelectedMonitor] = useState('all');
    const [reportType, setReportType] = useState('summary');

    useEffect(() => {
        if (currentTeam) {
            loadMonitors();
            // Generate initial report
            handleGenerateReport();
        }
    }, [currentTeam]);

    const loadMonitors = async () => {
        try {
            const res = await monitorApi.getMonitors(currentTeam!._id);
            setMonitors(res.data.monitors);
        } catch (error) {
            console.error('Failed to load monitors', error);
        }
    };

    const handleGenerateReport = async () => {
        if (!currentTeam) return;
        setGenerating(true);
        try {
            const params: any = {
                startDate,
                endDate,
                type: reportType
            };

            if (selectedMonitor !== 'all') {
                params.monitorIds = selectedMonitor;
            }

            const res = await reportApi.generateReport(currentTeam._id, params);
            setReport(res.data.report);
            toast.success('Report generated successfully');
        } catch (error) {
            console.error('Report generation failed:', error);
            toast.error('Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!currentTeam) return;
        try {
            const params: any = { startDate, endDate };
            if (selectedMonitor !== 'all') {
                params.monitorIds = selectedMonitor;
            }

            const response = await reportApi.downloadReport(currentTeam._id, params);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${startDate}-to-${endDate}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Report downloaded successfully');
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download report');
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <FadeIn>
                <div>
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-muted-foreground">Generate comprehensive monitoring reports</p>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Report Generator */}
                <FadeIn delay={0.1} className="md:col-span-1">
                    <AnimatedCard>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Configuration
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <Label>Report Type</Label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="summary">Summary Report</SelectItem>
                                        <SelectItem value="detailed">Detailed Report</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                    />
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Monitors</Label>
                                <Select value={selectedMonitor} onValueChange={setSelectedMonitor}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Monitors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Monitors</SelectItem>
                                        {monitors.map(m => (
                                            <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={handleGenerateReport}
                                    disabled={generating}
                                    className="flex-1"
                                >
                                    {generating ? (
                                        <>Generating...</>
                                    ) : (
                                        <>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Generate
                                        </>
                                    )}
                                </Button>
                                <Button variant="outline" onClick={handleDownload}>
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </AnimatedCard>
                </FadeIn>

                {/* Report Display */}
                <FadeIn delay={0.2} className="md:col-span-2">
                    {report ? (
                        <div className="space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <AnimatedCard className="p-4">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Activity className="w-4 h-4" />
                                        <span className="text-sm">Avg Uptime</span>
                                    </div>
                                    <div className={`text-2xl font-bold ${report.summary.averageUptime >= 99 ? 'text-green-500' : report.summary.averageUptime >= 95 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {report.summary.averageUptime}%
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard className="p-4">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">Avg Response</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {report.summary.averageResponseTime}ms
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard className="p-4">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-sm">Incidents</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {report.summary.totalIncidents}
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard className="p-4">
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-sm">Monitors</span>
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {report.summary.monitorsTracked}
                                    </div>
                                </AnimatedCard>
                            </div>

                            {/* Detailed Table */}
                            <AnimatedCard>
                                <h3 className="font-semibold mb-4">Monitor Performance</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Monitor</TableHead>
                                                <TableHead>Uptime</TableHead>
                                                <TableHead>Response Time</TableHead>
                                                <TableHead>Incidents</TableHead>
                                                <TableHead>Total Checks</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {report.monitors.map((monitor) => (
                                                <TableRow key={monitor.id}>
                                                    <TableCell className="font-medium">
                                                        <div>
                                                            {monitor.name}
                                                            <div className="text-xs text-muted-foreground">{monitor.url}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`font-medium ${monitor.uptime >= 99 ? 'text-green-600' : monitor.uptime >= 95 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                            {monitor.uptime}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{monitor.avgResponseTime}ms</TableCell>
                                                    <TableCell>{monitor.incidents}</TableCell>
                                                    <TableCell>{monitor.totalChecks}</TableCell>
                                                </TableRow>
                                            ))}
                                            {report.monitors.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                        No data found for this period.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </AnimatedCard>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-12 border rounded-xl bg-muted/10 border-dashed">
                            <div className="text-center text-muted-foreground">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Select configuration and click Generate to view report</p>
                            </div>
                        </div>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
