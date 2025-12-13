import { useState } from 'react';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wrench, Plus, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Maintenance() {
    const [maintenanceWindows, setMaintenanceWindows] = useState([
        {
            id: '1',
            title: 'Database Migration',
            description: 'Upgrading PostgreSQL to version 15',
            startTime: '2025-12-15T02:00:00',
            endTime: '2025-12-15T04:00:00',
            status: 'scheduled',
            affectedMonitors: 5,
        },
        {
            id: '2',
            title: 'CDN Update',
            description: 'Switching to new CDN provider',
            startTime: '2025-12-20T00:00:00',
            endTime: '2025-12-20T02:00:00',
            status: 'scheduled',
            affectedMonitors: 3,
        },
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateMaintenance = () => {
        setIsDialogOpen(false);
        // Would call API here
    };

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Maintenance Windows</h1>
                        <p className="text-muted-foreground">Schedule and manage planned downtime</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule Maintenance
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Schedule Maintenance Window</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input placeholder="Database Migration" />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea placeholder="Describe the maintenance work..." rows={3} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Start Time</Label>
                                        <Input type="datetime-local" />
                                    </div>
                                    <div>
                                        <Label>End Time</Label>
                                        <Input type="datetime-local" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Affected Monitors</Label>
                                    <Select defaultValue="all">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Monitors</SelectItem>
                                            <SelectItem value="selected">Select Monitors...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Recurring</Label>
                                    <Select defaultValue="none">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">One-time</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateMaintenance}>
                                        Schedule Maintenance
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </FadeIn>

            {/* Upcoming Maintenance */}
            <FadeIn delay={0.1}>
                <AnimatedCard>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Maintenance
                    </h2>
                    <div className="space-y-3">
                        {maintenanceWindows.map((window, i) => (
                            <div
                                key={window.id}
                                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Wrench className="w-4 h-4 text-primary" />
                                            <h3 className="font-semibold">{window.title}</h3>
                                            <span className={cn(
                                                "text-xs px-2 py-0.5 rounded-full",
                                                window.status === 'scheduled' && "bg-blue-100 text-blue-700"
                                            )}>
                                                {window.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{window.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(window.startTime).toLocaleString()} - {new Date(window.endTime).toLocaleTimeString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {window.affectedMonitors} monitors affected
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </FadeIn>

            {/* Calendar View Placeholder */}
            <FadeIn delay={0.2}>
                <AnimatedCard>
                    <h2 className="text-lg font-semibold mb-4">Calendar View</h2>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">Calendar visualization would go here</p>
                    </div>
                </AnimatedCard>
            </FadeIn>
        </div>
    );
}
