import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function PublicLayout() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/40 bg-white/75 backdrop-blur-xl shadow-sm">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-200">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Balaping</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link to="/docs" className="hover:text-foreground transition-colors duration-200">
                            Docs
                        </Link>
                        <Link to="/about" className="hover:text-foreground transition-colors duration-200">
                            About
                        </Link>
                        <Link to="/contact" className="hover:text-foreground transition-colors duration-200">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button>Go to Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link to="/register">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-white/40 py-14 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                    <Zap className="w-3 h-3 text-white" />
                                </div>
                                <span className="font-bold text-lg">Balaping</span>
                            </Link>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Reliable uptime monitoring for your websites, APIs, and servers.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/" className="hover:text-foreground">Features</Link></li>
                                <li><Link to="/" className="hover:text-foreground">Pricing</Link></li>
                                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/docs" className="hover:text-foreground">Documentation</Link></li>
                                <li><Link to="/docs" className="hover:text-foreground">API</Link></li>
                                <li><Link to="/status-page" className="hover:text-foreground">Status</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
                                <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} Balaping. All rights reserved.</p>
                        <div className="flex gap-4">
                            {/* Social icons could go here */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
