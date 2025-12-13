import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';
import {
    Activity,
    Globe,
    Shield,
    Zap,
    Bell,
    Clock,
    CheckCircle2,
    ArrowRight,
    BarChart3,
    Smartphone,
    Server,
    Code2,
    Play,
    Star,
    TrendingUp,
    AlertTriangle,
    Wifi,
    WifiOff,
    RefreshCw,
    MapPin,
    Users,
    Building2,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn, NumberCounter } from '@/components/animated';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return <span className="counter">{count.toLocaleString()}{suffix}</span>;
}

// Live Status Indicator
function LiveStatusIndicator() {
    const [isUp, setIsUp] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsUp(prev => !prev);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-500",
            isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
            <span className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                isUp ? "bg-green-500" : "bg-red-500"
            )} />
            {isUp ? "All Systems Operational" : "Detecting Issues..."}
        </div>
    );
}

// Animated Ping Component
function AnimatedPing({ delay = 0 }: { delay?: number }) {
    return (
        <div className="relative" style={{ animationDelay: `${delay}ms` }}>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
        </div>
    );
}

// World Map with Ping Points
function WorldMapPings() {
    const locations = [
        { name: 'US East', top: '35%', left: '25%' },
        { name: 'US West', top: '38%', left: '15%' },
        { name: 'UK', top: '28%', left: '45%' },
        { name: 'Germany', top: '30%', left: '50%' },
        { name: 'Singapore', top: '55%', left: '75%' },
        { name: 'Australia', top: '70%', left: '85%' },
        { name: 'Japan', top: '38%', left: '85%' },
        { name: 'Brazil', top: '65%', left: '30%' },
    ];

    return (
        <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(79, 109, 245, 0)" />
                        <stop offset="50%" stopColor="rgba(79, 109, 245, 0.5)" />
                        <stop offset="100%" stopColor="rgba(79, 109, 245, 0)" />
                    </linearGradient>
                </defs>
                {locations.slice(0, 4).map((loc, i) => (
                    <line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={loc.left}
                        y2={loc.top}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                    />
                ))}
            </svg>

            {/* Ping points */}
            {locations.map((loc, i) => (
                <div
                    key={i}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ top: loc.top, left: loc.left }}
                >
                    <AnimatedPing delay={i * 300} />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                        {loc.name}
                    </div>
                </div>
            ))}

            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                        <Wifi className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute inset-0 w-8 h-8 bg-primary rounded-full animate-ping opacity-50" />
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white/60 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Active Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-primary opacity-50" />
                    <span>Connection</span>
                </div>
            </div>
        </div>
    );
}

// Real-time Response Time Graph
function ResponseTimeGraph() {
    const [data, setData] = useState<number[]>([45, 52, 38, 65, 42, 58, 35, 48, 55, 40]);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1), Math.floor(Math.random() * 50) + 30];
                return newData;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const max = Math.max(...data);

    return (
        <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Response Time</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">avg</span>
                    <span className="text-sm font-bold text-primary">{Math.round(data.reduce((a, b) => a + b) / data.length)}ms</span>
                </div>
            </div>
            <div className="flex items-end gap-1 h-16">
                {data.map((value, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex-1 rounded-t transition-all duration-500",
                            value < 50 ? "bg-green-500" : value < 70 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ height: `${(value / max) * 100}%` }}
                    />
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>-15s</span>
                <span>now</span>
            </div>
        </div>
    );
}

// Animated Uptime Bar
function UptimeBar() {
    const days = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        status: Math.random() > 0.05 ? 'up' : Math.random() > 0.5 ? 'partial' : 'down'
    }));

    return (
        <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">30-Day Uptime</span>
                </div>
                <span className="text-sm font-bold text-green-600">99.95%</span>
            </div>
            <div className="flex gap-0.5">
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex-1 h-8 rounded-sm transition-all hover:scale-y-125 cursor-pointer",
                            day.status === 'up' ? 'bg-green-500' :
                                day.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ animationDelay: `${i * 30}ms` }}
                        title={`Day ${day.day}`}
                    />
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>30 days ago</span>
                <span>Today</span>
            </div>
        </div>
    );
}

// Floating Alert Notification
function FloatingAlerts() {
    const [alerts, setAlerts] = useState<{ id: number; type: 'up' | 'down'; name: string }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const isUp = Math.random() > 0.3;
            const names = ['api.example.com', 'cdn.myapp.io', 'db-primary.net', 'auth.service.com'];
            const newAlert = {
                id: Date.now(),
                type: isUp ? 'up' : 'down' as 'up' | 'down',
                name: names[Math.floor(Math.random() * names.length)]
            };
            setAlerts(prev => [newAlert, ...prev.slice(0, 2)]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-2">
            {alerts.map((alert, i) => (
                <div
                    key={alert.id}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-sm animate-slide-in-right",
                        alert.type === 'up' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    )}
                    style={{ animationDelay: `${i * 100}ms`, opacity: 1 - i * 0.3 }}
                >
                    {alert.type === 'up' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <div className="flex-1 text-sm">
                        <span className="font-medium">{alert.name}</span>
                        <span className={cn("ml-2", alert.type === 'up' ? 'text-green-600' : 'text-red-600')}>
                            is {alert.type}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">just now</span>
                </div>
            ))}
        </div>
    );
}

// Animated Logo Cloud
function LogoCloud() {
    const logos = [
        { name: 'Vercel', color: '#000' },
        { name: 'Stripe', color: '#635BFF' },
        { name: 'Shopify', color: '#96BF48' },
        { name: 'Notion', color: '#000' },
        { name: 'Linear', color: '#5E6AD2' },
        { name: 'Figma', color: '#F24E1E' },
    ];

    return (
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {logos.map((logo, i) => (
                <div
                    key={i}
                    className="text-xl font-bold opacity-40 hover:opacity-100 transition-opacity cursor-pointer animate-fade-in"
                    style={{
                        animationDelay: `${i * 100}ms`,
                        color: logo.color
                    }}
                >
                    {logo.name}
                </div>
            ))}
        </div>
    );
}

// Animated Pricing Preview
function PricingPreview() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border shadow-lg p-6 max-w-sm">
            <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-muted-foreground">Billing</span>
                <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all",
                            !isAnnual ? "bg-white shadow-sm" : ""
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium transition-all",
                            isAnnual ? "bg-white shadow-sm" : ""
                        )}
                    >
                        Annual
                    </button>
                </div>
            </div>
            <div className="text-center mb-6">
                <div className="text-4xl font-bold mb-1">
                    ${isAnnual ? '19' : '29'}
                    <span className="text-lg font-normal text-muted-foreground">/mo</span>
                </div>
                {isAnnual && (
                    <div className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full animate-bounce-in">
                        <Sparkles className="w-3 h-3" />
                        Save 35%
                    </div>
                )}
            </div>
            <ul className="space-y-2 mb-6">
                {['50 monitors', 'Unlimited team members', 'Email & Slack alerts', '1-minute checks'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {item}
                    </li>
                ))}
            </ul>
            <Button className="w-full rounded-full">Get Started</Button>
        </div>
    );
}

// Interactive Terminal Demo
function TerminalDemo() {
    const [lines, setLines] = useState<string[]>([]);
    const [resetTrigger, setResetTrigger] = useState(0);

    const commands = [
        '$ npm install @balaping/sdk',
        '✓ Package installed successfully',
        '$ balaping init',
        '? Enter your API key: ••••••••',
        '✓ Configuration saved',
        '$ balaping monitor add https://api.myapp.com',
        '✓ Monitor created: api.myapp.com',
        '  → Checking every 60 seconds',
        '  → Alerts via Email, Slack',
        '$ balaping status',
        '┌──────────────────────────────┐',
        '│ api.myapp.com    ● UP  42ms │',
        '│ cdn.myapp.com    ● UP  18ms │',
        '│ auth.myapp.com   ● UP  35ms │',
        '└──────────────────────────────┘',
    ];

    useEffect(() => {
        setLines([]);
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < commands.length) {
                const cmd = commands[currentIndex];
                setLines(prev => [...prev, cmd]);
                currentIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setResetTrigger(prev => prev + 1);
                }, 4000);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [resetTrigger]);

    const getLineColor = (line: string) => {
        if (!line) return 'text-slate-300';
        if (line.startsWith('$')) return 'text-green-400';
        if (line.startsWith('✓')) return 'text-emerald-400';
        if (line.startsWith('?')) return 'text-yellow-400';
        if (line.includes('●')) return 'text-cyan-400';
        return 'text-slate-300';
    };

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-400 ml-2">Terminal — balaping-cli</span>
            </div>
            <div className="p-4 font-mono text-sm h-80 overflow-hidden">
                {lines.map((line, i) => (
                    <div
                        key={`${resetTrigger}-${i}`}
                        className={cn("animate-slide-up", getLineColor(line))}
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {line}
                    </div>
                ))}
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
            </div>
        </div>
    );
}

export default function Home() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-24 md:py-40 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50 to-purple-50" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob delay-1000" />
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob delay-500" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
                </div>

                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fade-in">
                            {/* Live Status */}
                            <div className="mb-6">
                                <LiveStatusIndicator />
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 animate-gradient">
                                    Monitor Your
                                </span>
                                <br />
                                <span className="gradient-text">
                                    Entire Stack
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                                Instant alerts when your websites, APIs, and servers go down.
                                <span className="text-foreground font-medium"> Be the first to know.</span>
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                {isAuthenticated ? (
                                    <Link to="/dashboard">
                                        <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all">
                                            Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/register">
                                            <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all group">
                                                Start Free Monitoring
                                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                        <Link to="/docs">
                                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-2 hover:bg-slate-50 hover:scale-105 transition-all">
                                                <Play className="mr-2 w-5 h-5" /> View API Docs
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                {[
                                    { icon: CheckCircle2, text: 'No credit card required' },
                                    { icon: Zap, text: '5-minute setup' },
                                    { icon: Shield, text: '99.9% uptime SLA' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                        <item.icon className="w-4 h-4 text-green-500" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Demo Dashboard */}
                    <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div className="space-y-4 animate-slide-in-left">
                            <ResponseTimeGraph />
                            <UptimeBar />
                        </div>
                        <div className="animate-slide-in-right">
                            <TerminalDemo />
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Stats Counter */}
            <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZGVmcz48cGF0dGVybiBpZD0ibm9pc2UiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2VGaWx0ZXIpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20" />
                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: 9999, suffix: '%', label: 'Platform Uptime', prefix: '' },
                            { value: 50, suffix: 'M+', label: 'Checks per day', prefix: '' },
                            { value: 1, suffix: 's', label: 'Alert Speed', prefix: '<' },
                            { value: 180, suffix: '+', label: 'Countries', prefix: '' },
                        ].map((stat, i) => (
                            <div key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-4xl md:text-5xl font-bold mb-2">
                                    {stat.prefix}<AnimatedCounter end={stat.value} suffix={stat.suffix === '%' ? '.' + stat.suffix.replace('%', '99%') : stat.suffix} />
                                </div>
                                <div className="text-white/70 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Monitoring Locations */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4 animate-bounce-in">
                            <MapPin className="w-3 h-3 mr-1" />
                            GLOBAL NETWORK
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Monitor from anywhere</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Our distributed network ensures accurate, local monitoring from 180+ locations worldwide.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <WorldMapPings />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50 border-y">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                            <Sparkles className="w-3 h-3 mr-1" />
                            POWERFUL FEATURES
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Everything you need to stay online</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Comprehensive monitoring tools designed for modern teams.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Globe, iconBg: 'bg-blue-100 text-blue-600', title: 'HTTP(S) Monitoring', description: 'Monitor websites and APIs from multiple global locations.' },
                            { icon: Server, iconBg: 'bg-purple-100 text-purple-600', title: 'Port & TCP Monitoring', description: 'Keep track of any TCP port to ensure services are running.' },
                            { icon: Shield, iconBg: 'bg-green-100 text-green-600', title: 'SSL Certificate Alerts', description: 'Get notified before your SSL certificates expire.' },
                            { icon: Bell, iconBg: 'bg-red-100 text-red-600', title: 'Multi-Channel Alerts', description: 'Email, SMS, Slack, Discord, Telegram, and Webhooks.' },
                            { icon: BarChart3, iconBg: 'bg-yellow-100 text-yellow-600', title: 'Beautiful Status Pages', description: 'Share your uptime with customizable public status pages.' },
                            { icon: Clock, iconBg: 'bg-cyan-100 text-cyan-600', title: 'Cron & Heartbeat', description: 'Monitor scheduled tasks and background jobs.' },
                            { icon: Zap, iconBg: 'bg-orange-100 text-orange-600', title: 'Real-time WebSocket API', description: 'Subscribe to live updates for instant status changes.' },
                            { icon: Code2, iconBg: 'bg-indigo-100 text-indigo-600', title: 'Powerful REST API', description: 'Full API access to manage monitors programmatically.' },
                            { icon: Smartphone, iconBg: 'bg-pink-100 text-pink-600', title: 'Mobile Notifications', description: 'Push notifications for critical alerts, anywhere.' },
                        ].map((feature, i) => (
                            <FeatureCard key={i} {...feature} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Alerts Demo */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div className="animate-slide-in-left">
                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                                <Bell className="w-3 h-3 mr-1" />
                                INSTANT ALERTS
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Never miss an outage</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Get notified within seconds when something goes wrong. Our multi-channel alerting ensures you're always in the loop, no matter where you are.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: Zap, text: 'Sub-second alert delivery' },
                                    { icon: RefreshCw, text: 'Smart retry and escalation' },
                                    { icon: Users, text: 'Team-based routing' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="animate-slide-in-right">
                            <FloatingAlerts />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24 bg-slate-50 border-y">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div className="order-2 md:order-1 flex justify-center">
                            <PricingPreview />
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                                <Building2 className="w-3 h-3 mr-1" />
                                SIMPLE PRICING
                            </div>
                            <h2 className="text-4xl font-bold mb-4">Plans that scale with you</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Start free and upgrade as you grow. No hidden fees, no surprises. Cancel anytime.
                            </p>
                            <Link to="/pricing">
                                <Button variant="outline" className="rounded-full">
                                    View all plans <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Loved by developers worldwide</h2>
                        <p className="text-muted-foreground text-lg">See what our users are saying.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { name: 'Sarah Chen', role: 'CTO at TechStart', quote: 'Balaping saved us from major downtime. The instant alerts are a lifesaver!', avatar: '👩‍💻' },
                            { name: 'Mike Johnson', role: 'DevOps Lead', quote: 'The API is beautifully designed. Integration took less than 10 minutes.', avatar: '👨‍🔧' },
                            { name: 'Priya Sharma', role: 'Founder', quote: 'Finally, a monitoring tool that just works. Clean UI, powerful features.', avatar: '👩‍💼' },
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition-shadow animate-scale-in hover-lift" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Logo Cloud */}
            <section className="py-16 bg-slate-50 border-y">
                <div className="container mx-auto px-4 md:px-6">
                    <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
                        Trusted by teams at
                    </p>
                    <LogoCloud />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="gradient-bg-animated rounded-3xl p-8 md:p-20 text-center text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
                                Ready to monitor smarter?
                            </h2>
                            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                                Join thousands of teams who trust Balaping to keep their services online. Start your free trial today.
                            </p>
                            <Link to="/register">
                                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg text-primary font-bold rounded-full shadow-xl hover:scale-105 transition-transform">
                                    Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
                                {[
                                    { icon: CheckCircle2, text: 'No credit card required' },
                                    { icon: Zap, text: '14-day free trial' },
                                    { icon: RefreshCw, text: 'Cancel anytime' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon: Icon, iconBg, title, description, index }: { icon: React.ComponentType<{ className?: string }>; iconBg: string; title: string; description: string; index: number }) {
    return (
        <div className="p-6 rounded-2xl border bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 group hover-lift animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
