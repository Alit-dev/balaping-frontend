import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { monitorApi, alertApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeft, AlertCircle, Bell, Settings, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuickAddChannelDialog } from '@/components/dashboard/QuickAddChannelDialog';

export function CreateMonitor() {
    const navigate = useNavigate();
    const { currentTeam, user } = useAuthStore();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        method: 'GET',
        intervalSec: '60',
        expectedCode: '200',
        timeout: '30000',
    });
    const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set());

    // Fetch alert channels
    const { data: channelsData } = useQuery({
        queryKey: ['alertChannels', currentTeam?._id],
        queryFn: () => alertApi.getChannels(currentTeam!._id),
        enabled: !!currentTeam,
    });

    // Initialize selected channels and handle "My Email"
    useEffect(() => {
        if (channelsData?.data?.channels && user?.email) {
            const channels = channelsData.data.channels;
            const newSelected = new Set<string>();

            // Select all existing channels by default
            channels.forEach((c: any) => newSelected.add(c._id));

            // Check if user email exists as a channel
            const userEmailChannel = channels.find(
                (c: any) => c.type === 'email' && c.config?.email === user.email
            );

            if (!userEmailChannel) {
                // We'll handle the creation of this channel on submit if selected
                // For now, we'll add a special ID to track it
                newSelected.add('new-user-email');
            }

            setSelectedChannels(newSelected);
        }
    }, [channelsData, user]);

    const toggleChannel = (id: string) => {
        const newSelected = new Set(selectedChannels);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedChannels(newSelected);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.url) {
            setError('Name and URL are required');
            return;
        }

        if (!currentTeam) {
            setError('No team selected. Please create or select a team.');
            return;
        }

        // Validate URL
        try {
            new URL(formData.url);
        } catch {
            setError('Please enter a valid URL');
            return;
        }

        setLoading(true);

        try {
            const finalChannels: string[] = [];

            // Handle "new-user-email" creation
            if (selectedChannels.has('new-user-email')) {
                try {
                    const res = await alertApi.createChannel(currentTeam._id, {
                        name: 'My Email',
                        type: 'email',
                        config: { email: user?.email },
                        notifyOn: { down: true, up: true, degraded: true, sslExpiry: true }
                    });
                    finalChannels.push(res.data.channel._id);
                } catch (err) {
                    console.error('Failed to create email channel', err);
                    // Continue without it or show error? 
                    // For now, we'll continue but maybe warn user?
                }
            }

            // Add other selected channels
            selectedChannels.forEach(id => {
                if (id !== 'new-user-email') {
                    finalChannels.push(id);
                }
            });

            await monitorApi.createMonitor(currentTeam._id, {
                name: formData.name,
                url: formData.url,
                method: formData.method,
                intervalSec: parseInt(formData.intervalSec),
                expectedCode: parseInt(formData.expectedCode),
                timeout: parseInt(formData.timeout),
                alertChannels: finalChannels,
            });
            navigate('/monitors');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create monitor');
        } finally {
            setLoading(false);
        }
    };

    const channels = channelsData?.data?.channels || [];
    const showNewEmailOption = user?.email && !channels.find(
        (c: any) => c.type === 'email' && c.config?.email === user.email
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/monitors')}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Create Monitor</h1>
                    <p className="text-muted-foreground">Add a new website or API to monitor</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 bg-danger-50 text-danger-600 rounded-lg text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Monitor Name</Label>
                            <Input
                                id="name"
                                placeholder="My Website"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                id="url"
                                type="url"
                                placeholder="https://example.com"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="method">HTTP Method</Label>
                                <Select
                                    value={formData.method}
                                    onValueChange={(value) => setFormData({ ...formData, method: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="HEAD">HEAD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="interval">Check Interval</Label>
                                <Select
                                    value={formData.intervalSec}
                                    onValueChange={(value) => setFormData({ ...formData, intervalSec: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30">30 seconds</SelectItem>
                                        <SelectItem value="60">1 minute</SelectItem>
                                        <SelectItem value="120">2 minutes</SelectItem>
                                        <SelectItem value="300">5 minutes</SelectItem>
                                        <SelectItem value="600">10 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expectedCode">Expected Status Code</Label>
                                <Select
                                    value={formData.expectedCode}
                                    onValueChange={(value) => setFormData({ ...formData, expectedCode: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="200">200 OK</SelectItem>
                                        <SelectItem value="201">201 Created</SelectItem>
                                        <SelectItem value="204">204 No Content</SelectItem>
                                        <SelectItem value="301">301 Redirect</SelectItem>
                                        <SelectItem value="302">302 Found</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeout">Timeout</Label>
                                <Select
                                    value={formData.timeout}
                                    onValueChange={(value) => setFormData({ ...formData, timeout: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5000">5 seconds</SelectItem>
                                        <SelectItem value="10000">10 seconds</SelectItem>
                                        <SelectItem value="30000">30 seconds</SelectItem>
                                        <SelectItem value="60000">60 seconds</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <Bell className="w-4 h-4" />
                                    Alert Channels
                                </Label>
                                <QuickAddChannelDialog
                                    onChannelCreated={(id) => toggleChannel(id)}
                                    trigger={
                                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                                            <Plus className="w-3.5 h-3.5 mr-1" />
                                            Add Channel
                                        </Button>
                                    }
                                />
                            </div>
                            <div className="space-y-3 border rounded-lg p-4">
                                {showNewEmailOption && (
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">My Email</Label>
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        </div>
                                        <Switch
                                            checked={selectedChannels.has('new-user-email')}
                                            onCheckedChange={() => toggleChannel('new-user-email')}
                                        />
                                    </div>
                                )}
                                {channels.map((channel: any) => (
                                    <div key={channel._id} className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">{channel.name}</Label>
                                            <p className="text-sm text-muted-foreground capitalize">{channel.type}</p>
                                        </div>
                                        <Switch
                                            checked={selectedChannels.has(channel._id)}
                                            onCheckedChange={() => toggleChannel(channel._id)}
                                        />
                                    </div>
                                ))}
                                {!showNewEmailOption && channels.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                        No alert channels configured.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/monitors')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" loading={loading}>
                                Create Monitor
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
