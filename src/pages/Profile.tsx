import { useState, useRef } from 'react';
import { AnimatedCard, FadeIn, ProgressBar } from '@/components/animated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Building, Calendar, Camera, Loader2, Lock } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { settingsApi } from '@/api/client';
import { toast } from 'sonner';

export default function Profile() {
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await settingsApi.updateProfile({ name: profileData.name });
            updateUser(data.user);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await settingsApi.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data } = await settingsApi.uploadAvatar(formData);

            // Update user profile with new avatar URL
            const updateResponse = await settingsApi.updateProfile({ avatar: data.avatarUrl });
            updateUser(updateResponse.data.user);

            toast.success('Avatar updated successfully');
        } catch (error: any) {
            console.error('Avatar upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload avatar');
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <FadeIn>
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and security</p>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <FadeIn delay={0.1}>
                    <AnimatedCard className="md:col-span-1">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <Avatar className="w-32 h-32 mb-4 border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity">
                                    <AvatarImage src={user?.avatar} className="object-cover" />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full mb-4">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />

                            <h2 className="text-xl font-semibold mb-1">{user?.name || 'User'}</h2>
                            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                            <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Change Avatar'}
                            </Button>
                        </div>

                        <div className="mt-6 pt-6 border-t space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Member Since</span>
                                <span className="font-medium">
                                    {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Teams</span>
                                <span className="font-medium">{user?.teams?.length || 0}</span>
                            </div>
                        </div>
                    </AnimatedCard>
                </FadeIn>

                {/* Forms Section */}
                <div className="md:col-span-2 space-y-6">
                    {/* Profile Details */}
                    <FadeIn delay={0.2}>
                        <AnimatedCard>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Profile Information
                            </h2>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input
                                        value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <Label>Email Address</Label>
                                    <Input value={profileData.email} disabled className="bg-muted/50" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Email cannot be changed directly. Contact support.
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </AnimatedCard>
                    </FadeIn>

                    {/* Change Password */}
                    <FadeIn delay={0.3}>
                        <AnimatedCard>
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Loader2 className="w-5 h-5 text-primary" /> {/* Using Loader2 as placeholder lock icon if Lock not imported, but wait, Lock is not imported. Let's fix imports */}
                                Change Password
                            </h2>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <Label>Confirm New Password</Label>
                                        <Input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                {passwordData.newPassword && (
                                    <ProgressBar
                                        label="Password Strength"
                                        value={Math.min(passwordData.newPassword.length * 10, 100)}
                                        variant={passwordData.newPassword.length >= 8 ? "success" : "warning"}
                                    />
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </AnimatedCard>
                    </FadeIn>
                </div>
            </div>

            {/* Danger Zone */}
            <FadeIn delay={0.4}>
                <AnimatedCard className="border-red-200 bg-red-50/50">
                    <h2 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h2>
                    <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                </AnimatedCard>
            </FadeIn>
        </div>
    );
}
