import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/api/client';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export function Register() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authApi.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-success/20">
                    <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        We've sent a verification link to <strong className="text-gray-700">{formData.email}</strong>.
                        Please click the link to verify your account.
                    </p>
                </div>
                <Link to="/login">
                    <Button variant="outline" className="mt-4 h-11 px-6">
                        Back to login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                <p className="text-muted-foreground mt-2 text-sm">Start monitoring your services</p>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 bg-danger-50/80 backdrop-blur-sm text-danger-600 rounded-xl text-sm animate-slide-down border border-danger-100">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full name</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="pl-11"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-11"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <PasswordInput
                            id="password"
                            placeholder="••••••••"
                            className="pl-11"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm password</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <PasswordInput
                            id="confirmPassword"
                            placeholder="••••••••"
                            className="pl-11"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base" loading={loading}>
                    Create account
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:text-primary-600 transition-colors">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
