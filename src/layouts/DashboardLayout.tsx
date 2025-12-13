import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Zap,
    LayoutDashboard,
    Monitor,
    Settings,
    LogOut,
    ChevronDown,
    Menu,
    X,
    Users,
    Globe,
    AlertTriangle,
    Bell,
    Shield,
    BarChart3,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileNav } from '@/components/layout/MobileNav';

import { navigationItems } from '@/lib/navigation';

// const navigation = [ ... ] removed


export function DashboardLayout() {
    const { user, currentTeam, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Check if user is admin
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
    const isAdmin = user?.isAdmin || adminEmails.includes(user?.email || '');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 bg-white/85 backdrop-blur-2xl border-r border-white/40 shadow-[4px_0_32px_rgba(0,0,0,0.04)] transform transition-all duration-300 ease-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-5 border-b border-black/5">
                        <Link to="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-200">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-gray-900 text-lg">Balaping</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-black/5 rounded-xl transition-colors duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Team Selector */}
                    {currentTeam && (
                        <div className="p-4 border-b border-black/5">
                            <div className="flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-primary-50/80 to-primary-100/60 rounded-xl border border-primary-100/50">
                                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-primary font-bold text-sm">
                                        {currentTeam.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate text-gray-800">{currentTeam.name}</p>
                                    <p className="text-xs text-primary-600/70">Free Plan</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-primary-400" />
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1.5">
                        {navigationItems.map((item) => {
                            const isActive = location.pathname === item.href ||
                                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/25'
                                            : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* Admin Link */}
                        {isAdmin && (
                            <>
                                <div className="pt-5 pb-2">
                                    <p className="px-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Admin
                                    </p>
                                </div>
                                <Link
                                    to="/admin"
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                        location.pathname === '/admin'
                                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                                            : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                                    )}
                                >
                                    <Shield className="w-5 h-5" />
                                    Admin Panel
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User Menu */}
                    <div className="p-4 border-t border-black/5">
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-black/5 transition-all duration-200"
                            >
                                <Avatar className="w-9 h-9 ring-2 ring-primary-100">
                                    <AvatarFallback className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary font-semibold text-sm">
                                        {user ? getInitials(user.name) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-semibold truncate text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/50 p-1.5 animate-slide-up">
                                    <Link
                                        to="/profile"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-black/5 rounded-lg transition-colors duration-200"
                                    >
                                        <Users className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link
                                        to="/settings"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-black/5 rounded-lg transition-colors duration-200"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <div className="my-1 border-t border-black/5"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-danger hover:bg-danger-50 rounded-lg transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-black/5 hidden lg:block shadow-sm">
                    <div className="flex items-center justify-between px-6 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-black/5 rounded-xl transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex-1" />

                    </div>
                </header>

                {/* Page Content */}
                <main className="p-5 lg:p-8 pb-28 md:pb-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
