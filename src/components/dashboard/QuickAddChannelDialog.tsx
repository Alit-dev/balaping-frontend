import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alertApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Mail, Send, Webhook, Plus, ArrowLeft } from 'lucide-react';

interface QuickAddChannelDialogProps {
    onChannelCreated: (channelId: string) => void;
    trigger?: React.ReactNode;
}

export function QuickAddChannelDialog({ onChannelCreated, trigger }: QuickAddChannelDialogProps) {
    const { currentTeam } = useAuthStore();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [channelType, setChannelType] = useState<'email' | 'telegram' | 'webhook'>('email');
    const [formData, setFormData] = useState({
        name: '',
        emails: '',
        telegramBotToken: '',
        telegramChatId: '',
        webhookUrl: '',
        webhookMethod: 'POST',
    });

    const createChannelMutation = useMutation({
        mutationFn: (data: any) => alertApi.createChannel(currentTeam!._id, data),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['alertChannels'] });
            onChannelCreated(res.data.channel._id);
            setOpen(false);
            resetForm();
        },
    });

    const resetForm = () => {
        setStep('select');
        setChannelType('email');
        setFormData({
            name: '',
            emails: '',
            telegramBotToken: '',
            telegramChatId: '',
            webhookUrl: '',
            webhookMethod: 'POST',
        });
    };

    const handleSelectType = (type: 'email' | 'telegram' | 'webhook') => {
        setChannelType(type);
        setStep('form');
        // Set default name based on type
        setFormData(prev => ({
            ...prev,
            name: `My ${type.charAt(0).toUpperCase() + type.slice(1)} Channel`
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const config: any = {};

        if (channelType === 'email') {
            config.emails = formData.emails.split(',').map(e => e.trim()).filter(Boolean);
        } else if (channelType === 'telegram') {
            config.telegramBotToken = formData.telegramBotToken;
            config.telegramChatId = formData.telegramChatId;
        } else if (channelType === 'webhook') {
            config.webhookUrl = formData.webhookUrl;
            config.webhookMethod = formData.webhookMethod;
        }

        createChannelMutation.mutate({
            name: formData.name,
            type: channelType,
            config,
            // Enable all notifications by default for quick add
            notifyOn: { down: true, up: true, degraded: true, sslExpiry: true }
        });
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) resetForm();
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Channel
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'select' ? 'Add Alert Channel' : `Configure ${channelType.charAt(0).toUpperCase() + channelType.slice(1)}`}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 'select'
                            ? 'Choose a channel type to receive notifications.'
                            : 'Enter the details for your new alert channel.'}
                    </DialogDescription>
                </DialogHeader>

                {step === 'select' ? (
                    <div className="grid grid-cols-1 gap-4 py-4">
                        <Button
                            variant="outline"
                            className="h-auto py-4 justify-start"
                            onClick={() => handleSelectType('email')}
                        >
                            <Mail className="w-5 h-5 mr-3 text-muted-foreground" />
                            <div className="text-left">
                                <div className="font-medium">Email</div>
                                <div className="text-xs text-muted-foreground">Receive alerts via email</div>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto py-4 justify-start"
                            onClick={() => handleSelectType('telegram')}
                        >
                            <Send className="w-5 h-5 mr-3 text-muted-foreground" />
                            <div className="text-left">
                                <div className="font-medium">Telegram</div>
                                <div className="text-xs text-muted-foreground">Receive alerts via Telegram bot</div>
                            </div>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto py-4 justify-start"
                            onClick={() => handleSelectType('webhook')}
                        >
                            <Webhook className="w-5 h-5 mr-3 text-muted-foreground" />
                            <div className="text-left">
                                <div className="font-medium">Webhook</div>
                                <div className="text-xs text-muted-foreground">Send alerts to a custom URL</div>
                            </div>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Channel Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. DevOps Team"
                                required
                            />
                        </div>

                        {channelType === 'email' && (
                            <div className="space-y-2">
                                <Label htmlFor="emails">Email Addresses</Label>
                                <Input
                                    id="emails"
                                    value={formData.emails}
                                    onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                                    placeholder="email1@example.com, email2@example.com"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Comma-separated list of emails
                                </p>
                            </div>
                        )}

                        {channelType === 'telegram' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="botToken">Bot Token</Label>
                                    <Input
                                        id="botToken"
                                        value={formData.telegramBotToken}
                                        onChange={(e) => setFormData({ ...formData, telegramBotToken: e.target.value })}
                                        placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="chatId">Chat ID</Label>
                                    <Input
                                        id="chatId"
                                        value={formData.telegramChatId}
                                        onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value })}
                                        placeholder="-1001234567890"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {channelType === 'webhook' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                                    <Input
                                        id="webhookUrl"
                                        value={formData.webhookUrl}
                                        onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                                        placeholder="https://api.example.com/webhook"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="webhookMethod">Method</Label>
                                    <Select
                                        value={formData.webhookMethod}
                                        onValueChange={(value) => setFormData({ ...formData, webhookMethod: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        <DialogFooter className="flex justify-between sm:justify-between">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep('select')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button type="submit" loading={createChannelMutation.isPending}>
                                Create Channel
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
