import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './authStore';

interface SocketState {
    socket: Socket | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    joinTeam: (teamId: string) => void;
    leaveTeam: (teamId: string) => void;
}

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,

    connect: () => {
        const { socket } = get();
        if (socket?.connected) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(SOCKET_URL, {
            query: { token },
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            set({ isConnected: true });
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            set({ isConnected: false });
        });

        set({ socket: newSocket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },

    joinTeam: (teamId: string) => {
        const { socket } = get();
        if (socket && socket.connected) {
            socket.emit('join_team', teamId);
        }
    },

    leaveTeam: (teamId: string) => {
        const { socket } = get();
        if (socket && socket.connected) {
            socket.emit('leave_team', teamId);
        }
    },
}));
