import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: (data: { email: string; password: string; name: string }) =>
        api.post('/api/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/api/auth/login', data),

    verifyEmail: (token: string) =>
        api.get(`/api/auth/verify/${token}`),

    forgotPassword: (email: string) =>
        api.post('/api/auth/forgot-password', { email }),

    resetPassword: (data: { token: string; password: string }) =>
        api.post('/api/auth/reset-password', data),

    getMe: () =>
        api.get('/api/auth/me'),

    resendVerification: (email: string) =>
        api.post('/api/auth/resend-verification', { email }),
};

// Team API
export const teamApi = {
    getTeams: () =>
        api.get('/api/teams'),

    getTeam: (teamId: string) =>
        api.get(`/api/teams/${teamId}`),

    createTeam: (name: string) =>
        api.post('/api/teams', { name }),

    updateTeam: (teamId: string, name: string) =>
        api.put(`/api/teams/${teamId}`, { name }),

    inviteMember: (teamId: string, data: { email: string; role: string }) =>
        api.post(`/api/teams/${teamId}/invite`, data),

    acceptInvite: (token: string) =>
        api.post(`/api/teams/accept-invite/${token}`),

    updateMemberRole: (teamId: string, userId: string, role: string) =>
        api.put(`/api/teams/${teamId}/members/${userId}`, { role }),

    removeMember: (teamId: string, userId: string) =>
        api.delete(`/api/teams/${teamId}/members/${userId}`),

    leaveTeam: (teamId: string) =>
        api.post(`/api/teams/${teamId}/leave`),
};

// Monitor API
export const monitorApi = {
    getMonitors: (teamId: string) =>
        api.get(`/api/teams/${teamId}/monitors`),

    getMonitor: (teamId: string, monitorId: string) =>
        api.get(`/api/teams/${teamId}/monitors/${monitorId}`),

    createMonitor: (teamId: string, data: any) =>
        api.post(`/api/teams/${teamId}/monitors`, data),

    updateMonitor: (teamId: string, monitorId: string, data: any) =>
        api.put(`/api/teams/${teamId}/monitors/${monitorId}`, data),

    deleteMonitor: (teamId: string, monitorId: string) =>
        api.delete(`/api/teams/${teamId}/monitors/${monitorId}`),

    pauseMonitor: (teamId: string, monitorId: string) =>
        api.post(`/api/teams/${teamId}/monitors/${monitorId}/pause`),

    resumeMonitor: (teamId: string, monitorId: string) =>
        api.post(`/api/teams/${teamId}/monitors/${monitorId}/resume`),

    getMonitorHistory: (teamId: string, monitorId: string, params?: { limit?: number; offset?: number }) =>
        api.get(`/api/teams/${teamId}/monitors/${monitorId}/history`, { params }),

    getMonitorStats: (teamId: string, monitorId: string, period?: string) =>
        api.get(`/api/teams/${teamId}/monitors/${monitorId}/stats`, { params: { period } }),

    getDashboard: (teamId: string) =>
        api.get(`/api/teams/${teamId}/monitors/dashboard`),
};

// Incident API
export const incidentApi = {
    getIncidents: (teamId: string, params?: { status?: string; monitorId?: string; search?: string; limit?: number; offset?: number }) =>
        api.get(`/api/teams/${teamId}/incidents`, { params }),

    getIncident: (teamId: string, incidentId: string) =>
        api.get(`/api/teams/${teamId}/incidents/${incidentId}`),

    createIncident: (teamId: string, data: {
        title: string;
        description?: string;
        severity?: 'minor' | 'major' | 'critical';
        monitorId?: string;
        affectedServices?: string[];
    }) => api.post(`/api/teams/${teamId}/incidents`, data),

    updateIncident: (teamId: string, incidentId: string, data: {
        status?: string;
        message?: string;
        severity?: string;
        title?: string;
        description?: string;
    }) => api.put(`/api/teams/${teamId}/incidents/${incidentId}`, data),

    addTimelineEntry: (teamId: string, incidentId: string, data: {
        status?: string;
        message: string;
    }) => api.post(`/api/teams/${teamId}/incidents/${incidentId}/timeline`, data),

    deleteIncident: (teamId: string, incidentId: string) =>
        api.delete(`/api/teams/${teamId}/incidents/${incidentId}`),

    getActiveCount: (teamId: string) =>
        api.get(`/api/teams/${teamId}/incidents/active-count`),
};

// Alert Channel API
export const alertApi = {
    getChannels: (teamId: string) =>
        api.get(`/api/teams/${teamId}/alerts`),

    getChannel: (teamId: string, channelId: string) =>
        api.get(`/api/teams/${teamId}/alerts/${channelId}`),

    createChannel: (teamId: string, data: {
        name: string;
        type: 'email' | 'telegram' | 'webhook' | 'slack' | 'discord' | 'pagerduty' | 'opsgenie' | 'teams' | 'zapier';
        config: any;
        notifyOn?: {
            down?: boolean;
            up?: boolean;
            degraded?: boolean;
            sslExpiry?: boolean;
        };
    }) => api.post(`/api/teams/${teamId}/alerts`, data),

    updateChannel: (teamId: string, channelId: string, data: any) =>
        api.put(`/api/teams/${teamId}/alerts/${channelId}`, data),

    deleteChannel: (teamId: string, channelId: string) =>
        api.delete(`/api/teams/${teamId}/alerts/${channelId}`),

    testChannel: (teamId: string, channelId: string) =>
        api.post(`/api/teams/${teamId}/alerts/${channelId}/test`),

    toggleChannel: (teamId: string, channelId: string) =>
        api.post(`/api/teams/${teamId}/alerts/${channelId}/toggle`),
};

// Billing API
export const billingApi = {
    getSubscription: (teamId: string) =>
        api.get(`/api/teams/${teamId}/billing`),

    createCheckoutSession: (teamId: string, plan: 'pro' | 'enterprise') =>
        api.post(`/api/teams/${teamId}/billing/checkout`, { plan }),

    cancelSubscription: (teamId: string) =>
        api.post(`/api/teams/${teamId}/billing/cancel`),

    reactivateSubscription: (teamId: string) =>
        api.post(`/api/teams/${teamId}/billing/reactivate`),

    getUsage: (teamId: string) =>
        api.get(`/api/teams/${teamId}/billing/usage`),

    mockUpgrade: (teamId: string, plan: string) =>
        api.post(`/api/teams/${teamId}/billing/mock-upgrade`, { plan }),
};

// Settings API
export const settingsApi = {
    getProfile: () =>
        api.get('/api/settings/profile'),

    updateProfile: (data: { name?: string; email?: string; avatar?: string }) =>
        api.put('/api/settings/profile', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.post('/api/settings/change-password', data),

    getApiKeys: () =>
        api.get('/api/settings/api-keys'),

    createApiKey: (data: { name: string; teamId: string; permissions?: any; expiresAt?: string }) =>
        api.post('/api/settings/api-keys', data),

    revokeApiKey: (keyId: string) =>
        api.delete(`/api/settings/api-keys/${keyId}`),

    getSessions: () =>
        api.get('/api/auth/sessions'),

    revokeSession: (sessionId: string) =>
        api.delete(`/api/auth/sessions/${sessionId}`),

    revokeAllSessions: () =>
        api.post('/api/settings/sessions/revoke-all'),

    getSecurityLogs: (params?: { limit?: number; offset?: number }) =>
        api.get('/api/settings/security-logs', { params }),

    deleteAccount: (password: string) =>
        api.delete('/api/settings/account', { data: { password } }),

    generateTwoFactor: () =>
        api.post('/api/settings/2fa/generate'),

    verifyTwoFactor: (token: string) =>
        api.post('/api/settings/2fa/verify', { token }),

    disableTwoFactor: () =>
        api.post('/api/settings/2fa/disable'),

    uploadAvatar: (formData: FormData) =>
        api.post('/api/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
};

// Admin API
export const adminApi = {
    getStats: () =>
        api.get('/api/admin/stats'),

    getUsers: (params?: { search?: string; limit?: number; offset?: number }) =>
        api.get('/api/admin/users', { params }),

    getUser: (userId: string) =>
        api.get(`/api/admin/users/${userId}`),

    updateUser: (userId: string, data: any) =>
        api.put(`/api/admin/users/${userId}`, data),

    deleteUser: (userId: string) =>
        api.delete(`/api/admin/users/${userId}`),

    getMonitors: (params?: { status?: string; type?: string; limit?: number; offset?: number }) =>
        api.get('/api/admin/monitors', { params }),

    getIncidents: (params?: { status?: string; limit?: number; offset?: number }) =>
        api.get('/api/admin/incidents', { params }),

    getSystemHealth: () =>
        api.get('/api/admin/system'),

    getBillingOverview: () =>
        api.get('/api/admin/billing'),

    getSecurityLogs: (params?: { action?: string; severity?: string; limit?: number; offset?: number }) =>
        api.get('/api/admin/security-logs', { params }),
};

// Status Page API (public)
export const statusApi = {
    getStatusPage: (teamSlug: string) =>
        api.get(`/api/status/${teamSlug}`),

    getStatusPageHistory: (teamSlug: string) =>
        api.get(`/api/status/${teamSlug}/history`),
};

// Report API
export const reportApi = {
    generateReport: (teamId: string, params: { startDate?: string; endDate?: string; monitorIds?: string; type?: string }) =>
        api.get(`/api/teams/${teamId}/reports`, { params }),

    scheduleReport: (teamId: string, data: any) =>
        api.post(`/api/teams/${teamId}/reports/schedule`, data),

    downloadReport: (teamId: string, params: { startDate?: string; endDate?: string; monitorIds?: string; type?: string }) =>
        api.get(`/api/teams/${teamId}/reports/download`, { params, responseType: 'blob' }),
};

export default api;
