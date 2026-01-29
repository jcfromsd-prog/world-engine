import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'solver' | 'client';
}

interface AuthContextType {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map Supabase user to our User type
function mapSupabaseUser(supabaseUser: SupabaseUser | null): User | null {
    if (!supabaseUser) return null;

    // Check for founder email to grant admin
    const isAdmin = supabaseUser.email === 'founder@mybestpurpose.com' ||
        supabaseUser.email === 'jcfromsd@gmail.com';

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Solver',
        role: isAdmin ? 'admin' : 'solver'
    };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from Supabase session
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSupabaseUser(session?.user ?? null);
            setUser(mapSupabaseUser(session?.user ?? null));
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: string, session: Session | null) => {
                setSupabaseUser(session?.user ?? null);
                setUser(mapSupabaseUser(session?.user ?? null));
                setIsLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                setSupabaseUser(data.user);
                setUser(mapSupabaseUser(data.user));
                return { success: true };
            }

            return { success: false, error: 'Login failed' };
        } catch (err) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const signup = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || email.split('@')[0]
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // Create profile record
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    username: name || email.split('@')[0],
                    reputation_points: 0,
                    updated_at: new Date().toISOString()
                });

                setSupabaseUser(data.user);
                setUser(mapSupabaseUser(data.user));
                return { success: true };
            }

            return { success: false, error: 'Signup failed' };
        } catch (err) {
            return { success: false, error: 'An unexpected error occurred' };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSupabaseUser(null);
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        supabaseUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        signup,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
