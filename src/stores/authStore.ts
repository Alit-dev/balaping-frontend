import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/client';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    timezone?: string;
    language?: string;
    twoFactorEnabled?: boolean;
    teams: Team[];
    isAdmin?: boolean;
    createdAt?: string;
}

interface Team {
    _id: string;
    name: string;
    slug: string;
    owner: string;
    members: {
        userId: string | { _id: string; name: string; email: string };
        role: string;
        joinedAt: string;
    }[];
}

interface AuthState {
    token: string | null;
    user: User | null;
    currentTeam: Team | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    setCurrentTeam: (team: Team) => void;
    updateUser: (user: User) => void;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            currentTeam: null,
            isAuthenticated: false,

            setAuth: (token, user) => {
                localStorage.setItem('token', token);
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    currentTeam: user.teams?.[0] || null,
                });
            },

            setCurrentTeam: (team) => {
                set({ currentTeam: team });
            },

            updateUser: (user) => {
                set({ user });
            },

            refreshUser: async () => {
                try {
                    const response = await authApi.getMe();
                    if (response.data.success) {
                        set({ user: response.data.user });
                    }
                } catch (error) {
                    console.error('Failed to refresh user:', error);
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({
                    token: null,
                    user: null,
                    currentTeam: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                currentTeam: state.currentTeam,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
