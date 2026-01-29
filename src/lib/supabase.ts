// Supabase Client Configuration
// Replace VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY with your actual values
// Or set them in your .env file

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface Profile {
    id: string;
    username: string | null;
    reputation_points: number;
    avatar_url: string | null;
    archetype: string | null;
    updated_at: string | null;
}

export interface GauntletEntry {
    id: number;
    user_id: string;
    event_name: string;
    joined_at: string;
    status: 'active' | 'completed' | 'cancelled';
}

// Helper functions for Gauntlet operations
export async function joinGauntlet(userId: string, eventName: string = 'Zero-Day Defense') {
    const { data, error } = await supabase
        .from('gauntlet_entries')
        .insert([
            { user_id: userId, event_name: eventName }
        ])
        .select();

    if (error) throw error;
    return data;
}

export async function getGauntletEntries(eventName: string = 'Zero-Day Defense') {
    const { data, error } = await supabase
        .from('gauntlet_entries')
        .select('*, profiles(username, avatar_url)')
        .eq('event_name', eventName)
        .eq('status', 'active');

    if (error) throw error;
    return data;
}

export async function getGauntletCount(eventName: string = 'Zero-Day Defense') {
    const { count, error } = await supabase
        .from('gauntlet_entries')
        .select('*', { count: 'exact', head: true })
        .eq('event_name', eventName)
        .eq('status', 'active');

    if (error) throw error;
    return count || 0;
}

export async function hasUserJoinedGauntlet(userId: string, eventName: string = 'Zero-Day Defense') {
    const { data, error } = await supabase
        .from('gauntlet_entries')
        .select('id')
        .eq('user_id', userId)
        .eq('event_name', eventName)
        .eq('status', 'active')
        .maybeSingle();

    if (error) throw error;
    return !!data;
}

// Profile helpers
export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            ...updates,
            updated_at: new Date().toISOString()
        })
        .select();

    if (error) throw error;
    return data;
}

export interface Bounty {
    id: string;
    client_id: string;
    title: string;
    description: string | null;
    reward: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string | null;
    time_estimate: string | null;
    status: 'open' | 'closed';
    created_at: string;
    profiles?: Profile; // For joining client details
}

// Bounty operations
export async function createBounty(bounty: Partial<Bounty>) {
    const { data, error } = await supabase
        .from('bounties')
        .insert([bounty])
        .select();

    if (error) throw error;
    return data;
}

export async function getBounties() {
    const { data, error } = await supabase
        .from('bounties')
        .select(`
            *,
            profiles:client_id (
                username,
                avatar_url,
                reputation_points
            )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
