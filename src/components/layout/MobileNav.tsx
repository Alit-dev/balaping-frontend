import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { bottomNavItems, moreMenuItems, userMenuItems } from '@/lib/navigation';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/authStore';
import { X, ChevronRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function MobileNav() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        setOpen(false);
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <nav className="bg-white/90 backdrop-blur-2xl border-t border-white/50 px-2 py-2.5 safe-area-inset-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-around">
                        {bottomNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href ||
                                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

                            if (item.name === 'More') {
                                return (
                                    <Link
                                        key={item.name}
                                        to="/menu"
                                        className={cn(
                                            'flex flex-col items-center justify-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-200',
                                            'min-w-[64px] min-h-[56px]',
                                            location.pathname === '/menu'
                                                ? 'text-primary bg-primary-50/80 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700 active:scale-95'
                                        )}
                                    >
                                        <Icon className={cn('w-5 h-5', location.pathname === '/menu' && 'stroke-[2.5]')} />
                                        <span className={cn(
                                            'text-[11px] font-medium',
                                            location.pathname === '/menu' && 'font-semibold'
                                        )}>
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        'flex flex-col items-center justify-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-200',
                                        'min-w-[64px] min-h-[56px]',
                                        isActive
                                            ? 'text-primary bg-primary-50/80 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 active:scale-95'
                                    )}
                                >
                                    <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
                                    <span className={cn(
                                        'text-[11px] font-medium',
                                        isActive && 'font-semibold'
                                    )}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
}
