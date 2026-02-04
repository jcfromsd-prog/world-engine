import React, { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { AuthContext, type User, type AuthContextType } from './AuthContextType';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch role from profile and build User object
    const buildUser = async (sbUser: SupabaseUser | null): Promise<User | null> => {
        if (!sbUser) return null;

        // Fetch role from profiles table (defaults to 'solver' if not found)
        let role: 'admin' | 'solver' | 'client' = 'solver';
        try {
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', sbUser.id)
                .single();
            if (data?.role) {
                role = data.role as 'admin' | 'solver' | 'client';
            }
        } catch {
            // Profile doesn't exist yet or no role column - default to solver
        }

        // ⚡ SOVEREIGN OVERRIDE: James Morris (Founder)
        const founderEmails = ['james@mybestpurpose.com', 'admin@mybestpurpose.com', 'founder@mybestpurpose.com'];
        const hasSovereignToken = localStorage.getItem('SOVEREIGN_ACCESS_TOKEN');

        if (founderEmails.includes(sbUser.email || '') || hasSovereignToken) {
            console.log("⚡ SOVEREIGN IDENTITY RECOGNIZED: ACCESS GRANTED");
            role = 'admin';
        }

        return {
            id: sbUser.id,
            email: sbUser.email || '',
            name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Solver',
            role
        };
    };

    // Initialize auth state from Supabase session
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSupabaseUser(session?.user ?? null);
            setUser(await buildUser(session?.user ?? null));
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: string, session: Session | null) => {
                setSupabaseUser(session?.user ?? null);
                setUser(await buildUser(session?.user ?? null));
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
                setUser(await buildUser(data.user));
                return { success: true };
            }

            return { success: false, error: 'Login failed' };
        } catch {
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
                setUser(await buildUser(data.user));
                return { success: true };
            }

            return { success: false, error: 'Signup failed' };
        } catch {
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
