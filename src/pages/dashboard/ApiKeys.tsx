import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Key, Copy, Trash2, Check, Plus, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/client';
import { formatDistanceToNow } from 'date-fns';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

export default function ApiKeys() {
    const [copied, setCopied] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [showKey, setShowKey] = useState(false);
    const { currentTeam } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: apiKeysData, isLoading } = useQuery({
        queryKey: ['api-keys'],
        queryFn: settingsApi.getApiKeys,
    });

    const createKeyMutation = useMutation({
        mutationFn: settingsApi.createApiKey,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
            setCreatedKey(data.key);
            setNewKeyName('');
            toast.success('API key created successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create API key');
        },
    });

    const revokeKeyMutation = useMutation({
        mutationFn: settingsApi.revokeApiKey,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-keys'] });
            toast.success('API key revoked successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to revoke API key');
        },
    });

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopied(key);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(null), 2000);
    };

    const handleCreateKey = () => {
        if (!newKeyName.trim()) return;
        if (!currentTeam) {
            toast.error('No team selected');
            return;
        }
        createKeyMutation.mutate({
            name: newKeyName,
            teamId: currentTeam._id,
        });
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setCreatedKey(null);
    };

    const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);

    const handleRevokeConfirm = () => {
        if (keyToRevoke) {
            revokeKeyMutation.mutate(keyToRevoke);
            setKeyToRevoke(null);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-sm">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">API Keys</h1>
                        <p className="text-muted-foreground max-w-2xl text-base">
                            Manage your API keys for external integrations.
                            <span className="hidden sm:inline"> Keep these keys secure and never share them in client-side code.</span>
                        </p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="gap-4 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full md:w-auto hidden md:flex rounded-xl h-12 px-6 text-base">
                                <Plus className="w-5 h-5" />
                                Generate New Key
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Generate New API Key</DialogTitle>
                                <DialogDescription>
                                    Create a new API key to access the Balaping API programmatically.
                                </DialogDescription>
                            </DialogHeader>

                            {!createdKey ? (
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Key Name</Label>
                                        <Input
                                            placeholder="e.g. CI/CD Pipeline"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 py-4">
                                    <div className="bg-amber-50/50 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="text-sm text-amber-900">
                                            <p className="font-semibold mb-1">Save this key now!</p>
                                            <p className="opacity-90">This is the only time the full key will be shown. You won't be able to see it again.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Your API Key</Label>
                                        <div className="relative">
                                            <Input
                                                value={createdKey}
                                                readOnly
                                                type={showKey ? 'text' : 'password'}
                                                className="font-mono pr-20 h-11 bg-muted/30"
                                            />
                                            <div className="absolute right-1 top-1 flex items-center gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 hover:bg-background/50"
                                                    onClick={() => setShowKey(!showKey)}
                                                >
                                                    {showKey ? (
                                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 hover:bg-background/50"
                                                    onClick={() => handleCopy(createdKey)}
                                                >
                                                    {copied === createdKey ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="gap-4 sm:gap-0">
                                {!createdKey ? (
                                    <>
                                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                        <Button
                                            onClick={handleCreateKey}
                                            disabled={!newKeyName.trim() || createKeyMutation.isPending}
                                        >
                                            {createKeyMutation.isPending ? 'Generating...' : 'Generate Key'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={handleCloseCreateModal} className="w-full">Done</Button>
                                )}
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <AnimatedCard className="overflow-hidden border-0 shadow-none bg-transparent">
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse" />
                                ))}
                            </div>
                        ) : apiKeysData?.data?.apiKeys?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-200 rounded-3xl bg-white/30 backdrop-blur-sm">
                                <div className="p-4 rounded-full bg-primary/10 mb-4">
                                    <Key className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No API Keys Found</h3>
                                <p className="text-muted-foreground max-w-sm mb-6">
                                    Generate your first API key to start integrating with our platform securely.
                                </p>
                                <Button onClick={() => setIsCreateModalOpen(true)} variant="outline">
                                    Generate Key
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                <AnimatePresence mode="popLayout">
                                    {apiKeysData?.data?.apiKeys?.map((key: any, index: number) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            key={key._id}
                                            className={`
                                                group relative p-6 rounded-3xl border bg-white/60 backdrop-blur-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300
                                                ${!key.isActive ? 'opacity-75 bg-gray-50/50' : 'border-white/40 hover:border-primary/20'}
                                                overflow-hidden
                                            `}
                                        >
                                            {/* Animated background gradient for active keys */}
                                            {key.isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            )}

                                            {/* Mobile Layout (< sm) */}
                                            <div className="flex flex-col h-full sm:hidden">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg leading-tight mb-1">{key.name}</h3>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${key.isActive
                                                            ? 'bg-green-100/50 text-green-700 border border-green-200/50'
                                                            : 'bg-red-100/50 text-red-700 border border-red-200/50'
                                                            }`}>
                                                            {key.isActive ? 'Active' : 'Revoked'}
                                                        </span>
                                                    </div>
                                                    {key.isActive && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 -mt-2 rounded-full"
                                                            onClick={() => setKeyToRevoke(key._id)}
                                                            disabled={revokeKeyMutation.isPending}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="bg-muted/30 rounded-xl p-3 font-mono text-sm text-muted-foreground break-all border border-transparent mb-4">
                                                    {key.keyPrefix}••••••••••••••••••••••••
                                                </div>

                                                <div className="mt-auto flex items-end justify-between">
                                                    <div className={`p-3 rounded-2xl shadow-sm ${key.isActive ? 'bg-primary text-primary-foreground shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                                                        <Key className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {(() => {
                                                            try {
                                                                return key.createdAt ? formatDistanceToNow(new Date(key.createdAt)) + ' ago' : '';
                                                            } catch (e) {
                                                                return '';
                                                            }
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Desktop/Tablet Layout (>= sm) */}
                                            <div className="hidden sm:block">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-105 duration-300 ${key.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                            <Key className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-lg leading-none mb-2">{key.name}</h3>
                                                            <div className="flex items-center gap-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${key.isActive
                                                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                                                    : 'bg-red-50 text-red-700 border border-red-100'
                                                                    }`}>
                                                                    {key.isActive ? 'Active' : 'Revoked'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {(() => {
                                                                        try {
                                                                            return key.createdAt ? formatDistanceToNow(new Date(key.createdAt)) + ' ago' : '';
                                                                        } catch (e) {
                                                                            return '';
                                                                        }
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {key.isActive && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2 -mt-2 rounded-full"
                                                            onClick={() => setKeyToRevoke(key._id)}
                                                            disabled={revokeKeyMutation.isPending}
                                                            title="Revoke Key"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="bg-muted/30 rounded-xl p-3.5 font-mono text-sm text-muted-foreground break-all border border-transparent group-hover:border-primary/10 group-hover:bg-white/50 transition-all">
                                                    {key.keyPrefix}••••••••••••••••••••••••
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </AnimatedCard>
            </FadeIn>

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-24 right-4 z-50 md:hidden">
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </div>

            {/* Revoke Confirmation Dialog */}
            <AlertDialog open={!!keyToRevoke} onOpenChange={(open) => !open && setKeyToRevoke(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to revoke this API key? This action cannot be undone and any applications using this key will stop working immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRevokeConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                        >
                            Revoke Key
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
