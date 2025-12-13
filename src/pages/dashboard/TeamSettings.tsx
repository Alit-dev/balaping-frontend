import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { teamApi } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import {
    Users,
    UserPlus,
    Mail,
    Crown,
    Shield,
    User,
    Trash2,
    ExternalLink,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Member {
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
}

interface Team {
    _id: string;
    name: string;
    slug: string;
    owner: { _id: string; name: string; email: string };
    members: Member[];
}

export function TeamSettings() {
    const { currentTeam, user, setCurrentTeam } = useAuthStore();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentTeam) {
            loadTeam();
        }
    }, [currentTeam]);

    const loadTeam = async () => {
        try {
            const response = await teamApi.getTeam(currentTeam!._id);
            setTeam(response.data.team);
        } catch (error) {
            console.error('Failed to load team:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!inviteEmail) return;

        setError('');
        setInviteLoading(true);

        try {
            await teamApi.inviteMember(currentTeam!._id, {
                email: inviteEmail,
                role: inviteRole,
            });
            setInviteOpen(false);
            setInviteEmail('');
            setInviteRole('member');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setInviteLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await teamApi.removeMember(currentTeam!._id, userId);
            await loadTeam();
        } catch (error) {
            console.error('Failed to remove member:', error);
        }
    };

    const handleUpdateRole = async (userId: string, role: string) => {
        try {
            await teamApi.updateMemberRole(currentTeam!._id, userId, role);
            await loadTeam();
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'admin':
                return <Shield className="w-4 h-4 text-primary" />;
            default:
                return <User className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getInitials = (name: string | undefined | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const currentUserRole = team?.members.find(
        (m) => m.userId._id === user?.id
    )?.role;

    const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                <div className="h-64 bg-muted rounded-lg animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Team Settings</h1>
                    <p className="text-muted-foreground">Manage your team members and settings</p>
                </div>

                {canManageMembers && (
                    <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to join {team?.name}
                                </DialogDescription>
                            </DialogHeader>

                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-danger-50 text-danger-600 rounded-lg text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="colleague@example.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={inviteRole} onValueChange={setInviteRole}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setInviteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleInvite} loading={inviteLoading}>
                                    Send Invitation
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Team Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                                {team?.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{team?.name}</h3>
                            <p className="text-muted-foreground">
                                {team?.members.length} member{team?.members.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Status Page:</span>
                        <a
                            href={`/status/${team?.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                        >
                            /status/{team?.slug}
                        </a>
                    </div>
                </CardContent>
            </Card>

            {/* Members */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Team Members
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {team?.members.map((member) => (
                            <div
                                key={member.userId._id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary-100 text-primary">
                                            {getInitials(member.userId.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{member.userId.name}</span>
                                            {member.userId._id === user?.id && (
                                                <Badge variant="secondary" className="text-xs">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {member.userId.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        {getRoleIcon(member.role)}
                                        {canManageMembers && member.role !== 'owner' ? (
                                            <Select
                                                value={member.role}
                                                onValueChange={(role) =>
                                                    handleUpdateRole(member.userId._id, role)
                                                }
                                            >
                                                <SelectTrigger className="w-auto border-0 bg-transparent h-auto p-0 capitalize">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                    <SelectItem value="member">Member</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <span className="capitalize text-sm">{member.role}</span>
                                        )}
                                    </div>

                                    {canManageMembers &&
                                        member.role !== 'owner' &&
                                        member.userId._id !== user?.id && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-danger hover:text-danger hover:bg-danger-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to remove {member.userId.name} from the team? They will lose access to all team resources.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            onClick={() => handleRemoveMember(member.userId._id)}
                                                        >
                                                            Remove Member
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
