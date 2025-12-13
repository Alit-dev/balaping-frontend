import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setError('Invalid verification link');
            return;
        }

        verifyEmail(token);
    }, [searchParams]);

    const verifyEmail = async (token: string) => {
        try {
            const response = await authApi.verifyEmail(token);
            const { token: authToken, user } = response.data;
            setAuth(authToken, user);
            setStatus('success');

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    if (status === 'loading') {
        return (
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <h1 className="text-xl font-semibold">Verifying your email...</h1>
                <p className="text-muted-foreground">Please wait</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Email verified!</h1>
                <p className="text-muted-foreground">
                    Your account is now active. Redirecting to dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-danger-50 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-danger" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification failed</h1>
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2 justify-center">
                <Link to="/login">
                    <Button variant="outline">Back to login</Button>
                </Link>
                <Link to="/register">
                    <Button>Try again</Button>
                </Link>
            </div>
        </div>
    );
}
