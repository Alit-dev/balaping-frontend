import { Link, useNavigate } from 'react-router-dom';
import { moreMenuItems, userMenuItems } from '@/lib/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ChevronRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

export default function MoreMenu() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">


            <div className="space-y-6">
                {/* User Profile Section */}
                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border border-primary/10 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-bold text-xl ring-4 ring-white/50">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>

                {/* Main Menu Items */}
                <div className="grid gap-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Apps</h2>
                    {moreMenuItems.map((menuItem) => (
                        <Link
                            key={menuItem.name}
                            to={menuItem.href}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
                                    <menuItem.icon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-700 group-hover:text-gray-900">{menuItem.name}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </Link>
                    ))}
                </div>

                {/* User Actions */}
                <div className="grid gap-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Account</h2>
                    {userMenuItems.map((menuItem) => {
                        const isLogout = menuItem.name === 'Logout';
                        return (
                            <Link
                                key={menuItem.name}
                                to={menuItem.href}
                                onClick={(e) => {
                                    if (isLogout) {
                                        e.preventDefault();
                                        handleLogout();
                                    }
                                }}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all duration-200 group",
                                    isLogout
                                        ? "bg-red-50/50 border-red-100 hover:bg-red-50 hover:border-red-200"
                                        : "bg-white border-gray-100 hover:shadow-md hover:border-primary/20"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                        isLogout
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-50 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
                                    )}>
                                        <menuItem.icon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        "font-semibold",
                                        isLogout ? "text-red-600" : "text-gray-700 group-hover:text-gray-900"
                                    )}>{menuItem.name}</span>
                                </div>
                                {!isLogout && <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
