import { Outlet, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function AuthLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/30 flex items-center justify-center p-5 relative overflow-hidden">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-primary-200/30 to-primary-300/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-200/30 to-pink-200/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Balaping</span>
                    </Link>
                    <p className="text-muted-foreground mt-3 text-sm">Lightweight Uptime Monitoring</p>
                </div>

                {/* Content */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_16px_64px_rgba(0,0,0,0.08)] border border-white/60 p-8 ring-1 ring-white/50">
                    <Outlet />
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    © 2024 Balaping. All rights reserved.
                </p>
            </div>
        </div>
    );
}
