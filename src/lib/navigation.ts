import {
    LayoutDashboard,
    Monitor,
    AlertTriangle,
    Bell,
    Globe,
    BarChart3,
    Clock,
    Zap,
    Users,
    Settings,
    Shield,
    Home,
    Activity,
    Menu,
    LogOut,
    User,
    BookOpen,
    Key
} from 'lucide-react';

export const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Monitors', href: '/monitors', icon: Monitor },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Status Page', href: '/status-page', icon: Globe },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Maintenance', href: '/maintenance', icon: Clock },
    { name: 'Integrations', href: '/integrations', icon: Zap },
    { name: 'API Keys', href: '/keys', icon: Key },
    { name: 'Team', href: '/team', icon: Users },
];

export const bottomNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Monitors', href: '/monitors', icon: Activity },
    { name: 'Alerts', href: '/incidents', icon: Bell }, // Using Incidents for Alerts tab on mobile as per previous code
    { name: 'Team', href: '/team', icon: Users },
    { name: 'More', href: '/menu', icon: Menu }, // Special item for the menu
];

export const moreMenuItems = [
    { name: 'Status Page', href: '/status-page', icon: Globe },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Maintenance', href: '/maintenance', icon: Clock },
    { name: 'Integrations', href: '/integrations', icon: Zap },
    { name: 'API Keys', href: '/keys', icon: Key },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Docs', href: '/docs', icon: BookOpen },
];

export const userMenuItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Logout', href: '#logout', icon: LogOut, variant: 'danger' },
];
