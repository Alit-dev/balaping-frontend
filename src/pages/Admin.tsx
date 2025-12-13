import { AnimatedCard, FadeIn } from '@/components/animated';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Activity, Clock, AlertTriangle } from 'lucide-react';

export default function Admin() {
    const stats = [
        { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Teams', value: '456', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Total Monitors', value: '8,901', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Active Incidents', value: '12', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Admin Panel</h1>
                        <p className="text-muted-foreground">System-wide management and statistics</p>
                    </div>
                </div>
            </FadeIn>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <FadeIn key={i} delay={0.1 * (i + 1)}>
                        <AnimatedCard className="glass-soft">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </AnimatedCard>
                    </FadeIn>
                ))}
            </div>

            {/* Recent Activity */}
            <FadeIn delay={0.5}>
                <AnimatedCard>
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                        {[
                            { user: 'john@example.com', action: 'Created 3 monitors', time: '2 min ago' },
                            { user: 'sarah@example.com', action: 'Upgraded to Pro plan', time: '15 min ago' },
                            { user: 'mike@example.com', action: 'Invited 2 team members', time: '1 hour ago' },
                            { user: 'emma@example.com', action: 'Created status page', time: '2 hours ago' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                    <p className="font-medium">{activity.user}</p>
                                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                                </div>
                                <Badge variant="outline">{activity.time}</Badge>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </FadeIn>

            {/* System Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <FadeIn delay={0.6}>
                    <AnimatedCard>
                        <h2 className="text-lg font-semibold mb-4">System Health</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'API Server', status: 'Operational', uptime: '99.99%' },
                                { label: 'Database', status: 'Operational', uptime: '100%' },
                                { label: 'Worker Queue', status: 'Operational', uptime: '99.95%' },
                            ].map((service, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="font-medium">{service.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">{service.uptime}</span>
                                        <Badge variant="success">{service.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedCard>
                </FadeIn>

                <FadeIn delay={0.7}>
                    <AnimatedCard>
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            {[
                                'View All Users',
                                'Manage Teams',
                                'System Logs',
                                'Billing Dashboard',
                                'Feature Flags',
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    className="w-full p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </AnimatedCard>
                </FadeIn>
            </div>
        </div>
    );
}
