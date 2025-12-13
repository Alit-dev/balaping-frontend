import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Bell, Palette, Lock, Smartphone, Laptop, LogOut, Check, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/client';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Settings() {
    const [activeTab, setActiveTab] = useState('preferences');
    const { user, refreshUser } = useAuthStore();
    const queryClient = useQueryClient();

    // 2FA State
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [twoFactorToken, setTwoFactorToken] = useState('');
    const [secret, setSecret] = useState('');

    // Fetch Sessions
    const { data: sessionsData, isLoading: isLoadingSessions } = useQuery({
        queryKey: ['sessions'],
        queryFn: settingsApi.getSessions,
    });

    // Revoke Session Mutation
    const revokeSessionMutation = useMutation({
        mutationFn: settingsApi.revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            toast.success('Session revoked successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to revoke session');
        },
    });

    // Generate 2FA Mutation
    const generate2FAMutation = useMutation({
        mutationFn: settingsApi.generateTwoFactor,
        onSuccess: (data: any) => {
            setQrCodeUrl(data.qrCodeUrl);
            setSecret(data.secret);
            setIs2FAModalOpen(true);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to generate 2FA secret');
        },
    });

    // Verify 2FA Mutation
    const verify2FAMutation = useMutation({
        mutationFn: settingsApi.verifyTwoFactor,
        onSuccess: async () => {
            setIs2FAModalOpen(false);
            setTwoFactorToken('');
            await refreshUser();
            toast.success('Two-factor authentication enabled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Invalid verification code');
        },
    });

    // Disable 2FA Mutation
    const disable2FAMutation = useMutation({
        mutationFn: settingsApi.disableTwoFactor,
        onSuccess: async () => {
            await refreshUser();
            toast.success('Two-factor authentication disabled');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to disable 2FA');
        },
    });

    const handleRevokeSession = (sessionId: string) => {
        if (confirm('Are you sure you want to revoke this session?')) {
            revokeSessionMutation.mutate(sessionId);
        }
    };

    return (
        <div className="space-y-6">
            <FadeIn>
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and security</p>
                </div>
            </FadeIn>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="glass">
                    <TabsTrigger value="preferences" className="gap-2">
                        <Palette className="w-4 h-4" />
                        Preferences
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="preferences">
                    <FadeIn>
                        <AnimatedCard>
                            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'Email Notifications', desc: 'Receive email alerts for downtime' },
                                    { label: 'SMS Notifications', desc: 'Get SMS alerts (requires setup)' },
                                    { label: 'Weekly Reports', desc: 'Receive weekly summary emails' },
                                    { label: 'Incident Digests', desc: 'Daily digest of all incidents' },
                                ].map((pref, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{pref.label}</p>
                                            <p className="text-sm text-muted-foreground">{pref.desc}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Configure</Button>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    </FadeIn>
                </TabsContent>

                <TabsContent value="security">
                    <div className="grid gap-6">
                        <FadeIn delay={0.1}>
                            <AnimatedCard>
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Lock className="w-5 h-5" />
                                    Two-Factor Authentication
                                </h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            {user?.twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security to your account by requiring a code from your authenticator app.
                                        </p>
                                    </div>
                                    {user?.twoFactorEnabled ? (
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to disable 2FA?')) {
                                                    disable2FAMutation.mutate();
                                                }
                                            }}
                                            disabled={disable2FAMutation.isPending}
                                        >
                                            Disable 2FA
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => generate2FAMutation.mutate()}
                                            disabled={generate2FAMutation.isPending}
                                        >
                                            Enable 2FA
                                        </Button>
                                    )}
                                </div>
                            </AnimatedCard>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <AnimatedCard>
                                <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>
                                <div className="space-y-3">
                                    {isLoadingSessions ? (
                                        <div className="text-center py-4 text-muted-foreground">Loading sessions...</div>
                                    ) : sessionsData?.data?.sessions?.map((session: any) => (
                                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-muted rounded-full">
                                                    {session.deviceInfo?.toLowerCase().includes('mobile') ? (
                                                        <Smartphone className="w-4 h-4" />
                                                    ) : (
                                                        <Laptop className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {session.deviceInfo || 'Unknown Device'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {session.location || 'Unknown Location'} • {session.isCurrent ? 'Current session' : (() => {
                                                            try {
                                                                return session.lastActiveAt ? `Last active ${formatDistanceToNow(new Date(session.lastActiveAt))} ago` : 'Unknown time';
                                                            } catch (e) {
                                                                return 'Unknown time';
                                                            }
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                            {!session.isCurrent && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRevokeSession(session.id)}
                                                    disabled={revokeSessionMutation.isPending}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {sessionsData?.data?.sessions?.length === 0 && (
                                        <p className="text-muted-foreground text-center py-4">No active sessions found.</p>
                                    )}
                                </div>
                            </AnimatedCard>
                        </FadeIn>
                    </div>
                </TabsContent>
            </Tabs>

            <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                            Scan the QR code below with your authenticator app (like Google Authenticator or Authy), then enter the code to verify.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-4 py-4">
                        {qrCodeUrl && (
                            <div className="p-4 bg-white rounded-lg border">
                                <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                            </div>
                        )}

                        <div className="w-full max-w-xs space-y-2">
                            <Label>Verification Code</Label>
                            <Input
                                placeholder="123456"
                                value={twoFactorToken}
                                onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="text-center text-lg tracking-widest"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIs2FAModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => verify2FAMutation.mutate(twoFactorToken)}
                            disabled={twoFactorToken.length !== 6 || verify2FAMutation.isPending}
                        >
                            {verify2FAMutation.isPending ? 'Verifying...' : 'Verify & Enable'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
