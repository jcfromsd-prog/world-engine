import { createContext } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'solver' | 'client';
}

export interface AuthContextType {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
