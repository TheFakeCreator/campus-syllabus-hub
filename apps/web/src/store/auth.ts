import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'moderator' | 'admin';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
