import { useState, useEffect } from 'react';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plug, CheckCircle2, Settings, Zap, Trash2, TestTube, Loader2, AlertCircle } from 'lucide-react';
import { SiSlack, SiDiscord, SiTelegram, SiGmail, SiPagerduty, SiOpsgenie, SiZapier } from 'react-icons/si';
import { alertApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    type: 'slack' | 'discord' | 'telegram' | 'email' | 'webhook' | 'pagerduty' | 'opsgenie' | 'teams' | 'zapier';
    isPro?: boolean;
}

interface ConnectedChannel {
    _id: string;
    name: string;
    type: string;
    config: any;
    enabled: boolean;
}

const AVAILABLE_INTEGRATIONS: Integration[] = [
    { id: 'slack', name: 'Slack', description: 'Send alerts to Slack channels', icon: <SiSlack />, color: 'bg-[#4A154B]/10 text-[#4A154B]', type: 'slack' },
    { id: 'discord', name: 'Discord', description: 'Notify your Discord server', icon: <SiDiscord />, color: 'bg-[#5865F2]/10 text-[#5865F2]', type: 'discord' },
    { id: 'email', name: 'Email', description: 'Send alerts via Email', icon: <SiGmail />, color: 'bg-red-100 text-red-600', type: 'email' },
    { id: 'telegram', name: 'Telegram', description: 'Send messages via Telegram bot', icon: <SiTelegram />, color: 'bg-[#26A5E4]/10 text-[#26A5E4]', type: 'telegram' },
    { id: 'webhook', name: 'Custom Webhook', description: 'Send to any HTTP endpoint', icon: <Plug />, color: 'bg-gray-100 text-gray-700', type: 'webhook' },
    // Coming Soon
    { id: 'pagerduty', name: 'PagerDuty', description: 'Create incidents in PagerDuty', icon: <SiPagerduty />, color: 'bg-[#006028]/10 text-[#006028]', type: 'pagerduty', isPro: true },
    { id: 'opsgenie', name: 'Opsgenie', description: 'Alert your on-call team', icon: <SiOpsgenie />, color: 'bg-[#000000]/5 text-[#000000]', type: 'opsgenie', isPro: true },
    { id: 'teams', name: 'Microsoft Teams', description: 'Post to Teams channels', icon: <Plug />, color: 'bg-[#6264A7]/10 text-[#6264A7]', type: 'teams', isPro: true },
    { id: 'zapier', name: 'Zapier', description: 'Connect to 3000+ apps', icon: <SiZapier />, color: 'bg-[#FF4F00]/10 text-[#FF4F00]', type: 'zapier', isPro: true },
];

export default function Integrations() {
    const { currentTeam } = useAuthStore();
    const [channels, setChannels] = useState<ConnectedChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [editingChannel, setEditingChannel] = useState<ConnectedChannel | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [testing, setTesting] = useState<string | null>(null);

    useEffect(() => {
        if (currentTeam) {
            fetchChannels();
        }
    }, [currentTeam]);

    const fetchChannels = async () => {
        try {
            const response = await alertApi.getChannels(currentTeam!._id);
            setChannels(response.data.channels);
        } catch (error) {
            console.error('Failed to fetch channels:', error);
            toast.error('Failed to load integrations');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = (integration: Integration) => {
        if (integration.isPro) {
            toast.info('This integration is coming soon to Pro plans!');
            return;
        }
        setSelectedIntegration(integration);
        setEditingChannel(null);
        setFormData({ name: integration.name });
        setIsDialogOpen(true);
    };

    const handleEdit = (channel: ConnectedChannel) => {
        const integration = AVAILABLE_INTEGRATIONS.find(i => i.type === channel.type);
        if (!integration) return;

        setSelectedIntegration(integration);
        setEditingChannel(channel);

        // Populate form data based on type
        let configData = {};
        if (channel.type === 'email') {
            configData = { emails: channel.config.emails.join(', ') };
        } else {
            configData = { ...channel.config };
        }

        setFormData({
            name: channel.name,
            ...configData
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentTeam || !selectedIntegration) return;

        setSubmitting(true);
        try {
            let config = {};

            // Format config based on type
            switch (selectedIntegration.type) {
                case 'email':
                    config = {
                        emails: formData.emails.split(',').map((e: string) => e.trim()).filter(Boolean)
                    };
                    break;
                case 'telegram':
                    config = {
                        telegramBotToken: formData.telegramBotToken,
                        telegramChatId: formData.telegramChatId
                    };
                    break;
                case 'slack':
                case 'discord':
                case 'webhook':
                    config = { webhookUrl: formData.webhookUrl };
                    break;
            }

            const payload = {
                name: formData.name,
                type: selectedIntegration.type,
                config
            };

            if (editingChannel) {
                await alertApi.updateChannel(currentTeam._id, editingChannel._id, payload);
                toast.success('Integration updated successfully');
            } else {
                await alertApi.createChannel(currentTeam._id, payload);
                toast.success('Integration connected successfully');
            }

            setIsDialogOpen(false);
            fetchChannels();
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || 'Failed to save integration');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (channelId: string) => {
        if (!currentTeam || !confirm('Are you sure you want to disconnect this integration?')) return;

        try {
            await alertApi.deleteChannel(currentTeam._id, channelId);
            toast.success('Integration disconnected');
            fetchChannels();
            if (isDialogOpen) setIsDialogOpen(false);
        } catch (error) {
            toast.error('Failed to disconnect integration');
        }
    };

    const handleTest = async (channelId: string) => {
        if (!currentTeam) return;
        setTesting(channelId);
        try {
            await alertApi.testChannel(currentTeam._id, channelId);
            toast.success('Test alert sent successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Test failed');
        } finally {
            setTesting(null);
        }
    };

    const renderFormFields = () => {
        if (!selectedIntegration) return null;

        switch (selectedIntegration.type) {
            case 'email':
                return (
                    <div className="space-y-2">
                        <Label>Email Addresses</Label>
                        <Input
                            placeholder="user@example.com, team@example.com"
                            value={formData.emails || ''}
                            onChange={e => setFormData({ ...formData, emails: e.target.value })}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Comma separated list of emails</p>
                    </div>
                );
            case 'telegram':
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Bot Token</Label>
                            <Input
                                type="password"
                                placeholder="123456789:ABCdef..."
                                value={formData.telegramBotToken || ''}
                                onChange={e => setFormData({ ...formData, telegramBotToken: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Chat ID</Label>
                            <Input
                                placeholder="-100123456789"
                                value={formData.telegramChatId || ''}
                                onChange={e => setFormData({ ...formData, telegramChatId: e.target.value })}
                                required
                            />
                        </div>
                    </>
                );
            case 'slack':
            case 'discord':
            case 'webhook':
                return (
                    <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input
                            placeholder={`https://${selectedIntegration.type === 'slack' ? 'hooks.slack.com' : selectedIntegration.type === 'discord' ? 'discord.com/api/webhooks' : 'example.com'}/...`}
                            value={formData.webhookUrl || ''}
                            onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })}
                            required
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
                    <p className="text-muted-foreground mt-2">Connect your monitoring with your favorite tools to get instant alerts.</p>
                </div>
            </FadeIn>

            {/* Connected Integrations */}
            {channels.length > 0 && (
                <FadeIn delay={0.1}>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            Connected ({channels.length})
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {channels.map((channel) => {
                                const integration = AVAILABLE_INTEGRATIONS.find(i => i.type === channel.type) || AVAILABLE_INTEGRATIONS[4];
                                return (
                                    <div
                                        key={channel._id}
                                        className="flex items-center justify-between p-5 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${integration.color} flex items-center justify-center text-2xl shadow-sm`}>
                                                {integration.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{channel.name}</p>
                                                <p className="text-sm text-muted-foreground capitalize">{integration.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleTest(channel._id)}
                                                disabled={testing === channel._id}
                                            >
                                                {testing === channel._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(channel)}>
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </FadeIn>
            )}

            {/* Available Integrations */}
            <FadeIn delay={0.2}>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Plug className="w-5 h-5 text-primary" />
                        Available Integrations
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {AVAILABLE_INTEGRATIONS.map((integration, i) => (
                            <FadeIn key={integration.id} delay={0.05 * i}>
                                <div
                                    className="group p-5 border rounded-xl bg-white hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => handleConnect(integration)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 rounded-xl ${integration.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            {integration.icon}
                                        </div>
                                        {integration.isPro && (
                                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200">
                                                Pro
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{integration.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{integration.description}</p>
                                    <Button
                                        variant="outline"
                                        className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
                                    >
                                        <Zap className="w-4 h-4 mr-2" />
                                        {integration.isPro ? 'Coming Soon' : 'Connect'}
                                    </Button>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </FadeIn>

            {/* Configuration Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedIntegration?.icon} {editingChannel ? 'Edit' : 'Connect'} {selectedIntegration?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Configure your {selectedIntegration?.name} integration settings below.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Integration Name</Label>
                            <Input
                                placeholder="My Integration"
                                value={formData.name || ''}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {renderFormFields()}

                        <DialogFooter className="gap-2 sm:gap-0">
                            {editingChannel && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleDelete(editingChannel._id)}
                                    className="mr-auto"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Disconnect
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
