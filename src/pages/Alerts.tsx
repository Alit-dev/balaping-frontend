import { useEffect, useState } from 'react';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Skeleton } from '@/components/animated/Skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Plus, Mail, MessageSquare, Webhook, TestTube, Power, Trash2, RefreshCw, Send } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { alertApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AlertChannel {
    _id: string;
    name: string;
    type: 'email' | 'telegram' | 'webhook';
    enabled: boolean;
    config: {
        emails?: string[];
        telegramBotToken?: string;
        telegramChatId?: string;
        webhookUrl?: string;
        webhookMethod?: 'GET' | 'POST';
    };
    notifyOn?: {
        down?: boolean;
        up?: boolean;
        degraded?: boolean;
        sslExpiry?: boolean;
    };
    alertsSent?: number;
}

export default function Alerts() {
    const { currentTeam } = useAuthStore();
    const [channels, setChannels] = useState<AlertChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [channelType, setChannelType] = useState<'email' | 'telegram' | 'webhook'>('email');
    const [channelName, setChannelName] = useState('');
    const [emailAddresses, setEmailAddresses] = useState('');
    const [telegramBotToken, setTelegramBotToken] = useState('');
    const [telegramChatId, setTelegramChatId] = useState('');
    const [webhookUrl, setWebhookUrl] = useState('');

    useEffect(() => {
        if (currentTeam) {
            loadChannels();
        }
    }, [currentTeam]);

    const loadChannels = async () => {
        if (!currentTeam) return;

        try {
            setRefreshing(true);
            const response = await alertApi.getChannels(currentTeam._id);
            setChannels(response.data.channels || []);
        } catch (error) {
            console.error('Failed to load channels:', error);
            toast.error('Failed to load alert channels');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const resetForm = () => {
        setChannelName('');
        setEmailAddresses('');
        setTelegramBotToken('');
        setTelegramChatId('');
        setWebhookUrl('');
        setChannelType('email');
    };

    const handleAddChannel = async () => {
        if (!currentTeam || !channelName.trim()) {
            toast.error('Please provide a channel name');
            return;
        }

        try {
            setSubmitting(true);

            let config: any = {};

            if (channelType === 'email') {
                const emails = emailAddresses
                    .split(',')
                    .map(e => e.trim())
                    .filter(e => e);

                if (emails.length === 0) {
                    toast.error('Please enter at least one email address');
                    return;
                }
                config = { emails };
            } else if (channelType === 'telegram') {
                if (!telegramBotToken.trim() || !telegramChatId.trim()) {
                    toast.error('Please provide Telegram bot token and chat ID');
                    return;
                }
                config = {
                    telegramBotToken: telegramBotToken.trim(),
                    telegramChatId: telegramChatId.trim(),
                };
            } else if (channelType === 'webhook') {
                if (!webhookUrl.trim()) {
                    toast.error('Please provide webhook URL');
                    return;
                }
                config = { webhookUrl: webhookUrl.trim() };
            }

            await alertApi.createChannel(currentTeam._id, {
                name: channelName.trim(),
                type: channelType,
                config,
            });

            toast.success('Alert channel added successfully!');
            setShowAddDialog(false);
            resetForm();
            loadChannels(); // Reload channels
        } catch (error: any) {
            console.error('Failed to add channel:', error);
            toast.error(error.response?.data?.message || 'Failed to add channel');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (channelId: string, currentlyEnabled: boolean) => {
        if (!currentTeam) return;

        try {
            await alertApi.toggleChannel(currentTeam._id, channelId);
            toast.success(`Channel ${!currentlyEnabled ? 'enabled' : 'disabled'}`);
            loadChannels();
        } catch (error) {
            console.error('Failed to toggle channel:', error);
            toast.error('Failed to update channel');
        }
    };

    const handleTest = async (channelId: string, channelName: string) => {
        if (!currentTeam) return;

        try {
            toast.loading(`Sending test to ${channelName}...`, { id: 'test-alert' });
            await alertApi.testChannel(currentTeam._id, channelId);
            toast.success(`Test alert sent to ${channelName}!`, { id: 'test-alert' });
        } catch (error: any) {
            console.error('Failed to test channel:', error);
            toast.error(error.response?.data?.message || 'Failed to send test', { id: 'test-alert' });
        }
    };

    const handleDelete = async (channelId: string, channelName: string) => {
        if (!currentTeam) return;
        if (!confirm(`Delete "${channelName}"? This action cannot be undone.`)) return;

        try {
            await alertApi.deleteChannel(currentTeam._id, channelId);
            toast.success('Channel deleted');
            loadChannels();
        } catch (error) {
            console.error('Failed to delete channel:', error);
            toast.error('Failed to delete channel');
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'email': return Mail;
            case 'telegram': return Send;
            case 'webhook': return Webhook;
            default: return Bell;
        }
    };

    const getDisplayConfig = (channel: AlertChannel) => {
        if (channel.type === 'email') {
            return channel.config.emails?.join(', ') || 'No emails configured';
        } else if (channel.type === 'telegram') {
            return channel.config.telegramChatId || 'No chat ID configured';
        } else if (channel.type === 'webhook') {
            return channel.config.webhookUrl || 'No URL configured';
        }
        return 'Not configured';
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Alert Channels</h1>
                        <p className="text-text-secondary">Configure how you receive downtime notifications</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={loadChannels}
                            disabled={refreshing}
                            className="rounded-full"
                        >
                            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                        </Button>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Channel
                        </Button>
                    </div>
                </div>
            </FadeIn>

            {/* Alert Channels */}
            <div className="space-y-3">
                {channels.length === 0 ? (
                    <FadeIn delay={0.1}>
                        <Card className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                                <Bell className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No alert channels</h3>
                            <p className="text-text-secondary mb-4">
                                Add your first alert channel to receive notifications
                            </p>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Channel
                            </Button>
                        </Card>
                    </FadeIn>
                ) : (
                    channels.map((channel, i) => {
                        const Icon = getIcon(channel.type);
                        return (
                            <FadeIn key={channel._id} delay={0.1 * (i + 1)}>
                                <AnimatedCard hoverLift>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="p-3 bg-primary/10 rounded-xl flex-shrink-0">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="font-semibold text-text-primary">{channel.name}</h3>
                                                    <Badge variant="outline" className="text-xs capitalize">
                                                        {channel.type}
                                                    </Badge>
                                                    {channel.alertsSent && channel.alertsSent > 0 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {channel.alertsSent} sent
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-text-secondary truncate">
                                                    {getDisplayConfig(channel)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleTest(channel._id, channel.name)}
                                            >
                                                <TestTube className="w-4 h-4 mr-2" />
                                                Test
                                            </Button>
                                            <div className="flex items-center gap-2">
                                                <Power className={cn(
                                                    "w-4 h-4",
                                                    channel.enabled ? 'text-success' : 'text-text-muted'
                                                )} />
                                                <Switch
                                                    checked={channel.enabled}
                                                    onCheckedChange={() => handleToggle(channel._id, channel.enabled)}
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(channel._id, channel.name)}
                                                className="text-danger hover:text-danger hover:bg-danger-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AnimatedCard>
                            </FadeIn>
                        );
                    })
                )}
            </div>

            {/* Info Card */}
            <FadeIn delay={0.4}>
                <AnimatedCard className="bg-primary-50 border-primary-100">
                    <div className="flex gap-3">
                        <Bell className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-primary mb-1">Alert Routing</h3>
                            <p className="text-sm text-primary/80">
                                Each monitor can be configured to send alerts to specific channels.
                                Edit your monitors to customize alert routing.
                            </p>
                        </div>
                    </div>
                </AnimatedCard>
            </FadeIn>

            {/* Add Channel Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Alert Channel</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Channel Type</Label>
                            <select
                                className="w-full p-2 border rounded-lg mt-1"
                                value={channelType}
                                onChange={(e) => setChannelType(e.target.value as any)}
                            >
                                <option value="email">Email</option>
                                <option value="telegram">Telegram</option>
                                <option value="webhook">Webhook</option>
                            </select>
                        </div>

                        <div>
                            <Label>Channel Name</Label>
                            <Input
                                placeholder="e.g., Team Notifications"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        {channelType === 'email' && (
                            <div>
                                <Label>Email Addresses</Label>
                                <Textarea
                                    placeholder="Enter email addresses separated by commas&#10;example@email.com, team@company.com"
                                    rows={3}
                                    value={emailAddresses}
                                    onChange={(e) => setEmailAddresses(e.target.value)}
                                    className="mt-1"
                                />
                                <p className="text-xs text-text-muted mt-1">
                                    Separate multiple emails with commas
                                </p>
                            </div>
                        )}

                        {channelType === 'telegram' && (
                            <>
                                <div>
                                    <Label>Telegram Bot Token</Label>
                                    <Input
                                        placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                        value={telegramBotToken}
                                        onChange={(e) => setTelegramBotToken(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label>Chat ID</Label>
                                    <Input
                                        placeholder="-1001234567890"
                                        value={telegramChatId}
                                        onChange={(e) => setTelegramChatId(e.target.value)}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-text-muted mt-1">
                                        Use @userinfobot or @getidsbot to get your chat ID
                                    </p>
                                </div>
                            </>
                        )}

                        {channelType === 'webhook' && (
                            <div>
                                <Label>Webhook URL</Label>
                                <Input
                                    placeholder="https://api.example.com/webhook"
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        )}

                        <Button
                            className="w-full"
                            onClick={handleAddChannel}
                            disabled={submitting}
                        >
                            {submitting ? 'Adding...' : 'Add Channel'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
