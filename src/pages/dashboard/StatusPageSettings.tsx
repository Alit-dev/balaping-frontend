import { useState } from 'react';
import { AnimatedCard, FadeIn } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Globe, Plus, ExternalLink, Palette, Eye, Settings } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export default function StatusPageSettings() {
    const { currentTeam } = useAuthStore();
    const [statusPages, setStatusPages] = useState([
        {
            id: '1',
            name: 'Main Status Page',
            slug: currentTeam?.slug || 'my-team',
            isPublic: true,
            monitorsCount: 12,
        },
    ]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Status Pages</h1>
                        <p className="text-muted-foreground">Share your uptime with the world</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Status Page
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create Status Page</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Page Name</Label>
                                    <Input placeholder="My Service Status" />
                                </div>
                                <div>
                                    <Label>Custom Subdomain</Label>
                                    <div className="flex items-center gap-2">
                                        <Input placeholder="my-service" />
                                        <span className="text-sm text-muted-foreground">.balaping.io</span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Brand Color</Label>
                                    <div className="flex items-center gap-2">
                                        <Input type="color" defaultValue="#4F6DF5" className="w-20 h-10" />
                                        <Input defaultValue="#4F6DF5" placeholder="#4F6DF5" />
                                    </div>
                                </div>
                                <div>
                                    <Label>Logo URL (optional)</Label>
                                    <Input placeholder="https://example.com/logo.png" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Public Page</Label>
                                        <p className="text-sm text-muted-foreground">Allow anyone to view this status page</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Show Uptime Graph</Label>
                                        <p className="text-sm text-muted-foreground">Display 90-day uptime visualization</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Show Response Times</Label>
                                        <p className="text-sm text-muted-foreground">Display response time metrics</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setIsDialogOpen(false)}>
                                        Create Status Page
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </FadeIn>

            {/* Status Pages List */}
            <div className="grid gap-6">
                {statusPages.map((page, i) => (
                    <FadeIn key={page.id} delay={0.1 * (i + 1)}>
                        <AnimatedCard hoverLift className="overflow-hidden">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Globe className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{page.name}</h3>
                                        <p className="text-sm text-muted-foreground">{page.monitorsCount} monitors</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Settings className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={`/status/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Preview
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Public URL</span>
                                    <a
                                        href={`${window.location.origin}/status/${page.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-1"
                                    >
                                        {window.location.origin}/status/{page.slug}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="text-green-600 font-medium">
                                        {page.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                            </div>
                        </AnimatedCard>
                    </FadeIn>
                ))}
            </div>
        </div>
    );
}
