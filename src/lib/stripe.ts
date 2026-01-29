/**
 * World Engine - Stripe Integration
 * Handles escrow, payouts, and Connect accounts for real payments
 */

import { supabase } from './supabase';

// Types
export interface CreateEscrowParams {
    bountyId: string;
    amount: number; // in cents
    title: string;
    companyId: string;
}

export interface EscrowResult {
    success: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    error?: string;
}

export interface PayoutResult {
    success: boolean;
    transferId?: string;
    error?: string;
}

// Call Edge Function to create escrow payment intent
export async function createBountyEscrow(params: CreateEscrowParams): Promise<EscrowResult> {
    try {
        const { data, error } = await supabase.functions.invoke('create-bounty-escrow', {
            body: params
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            clientSecret: data.clientSecret,
            paymentIntentId: data.paymentIntentId
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create escrow'
        };
    }
}

// Call Edge Function to release payment to solver
export async function releaseBountyPayment(params: {
    bountyId: string;
    solverId: string;
    paymentIntentId: string;
}): Promise<PayoutResult> {
    try {
        const { data, error } = await supabase.functions.invoke('release-payment', {
            body: params
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            transferId: data.transferId
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to release payment'
        };
    }
}

// Generate Stripe Connect onboarding link for solvers
export async function createConnectOnboardingLink(solverId: string): Promise<{
    success: boolean;
    url?: string;
    error?: string;
}> {
    try {
        const { data, error } = await supabase.functions.invoke('create-connect-link', {
            body: { solverId }
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return {
            success: true,
            url: data.url
        };
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Failed to create onboarding link'
        };
    }
}

// Check solver's Connect account status
export async function checkConnectStatus(solverId: string): Promise<{
    isOnboarded: boolean;
    canReceivePayments: boolean;
    email?: string;
}> {
    try {
        const { data, error } = await supabase.functions.invoke('check-connect-status', {
            body: { solverId }
        });

        if (error) {
            return { isOnboarded: false, canReceivePayments: false };
        }

        return {
            isOnboarded: data.isOnboarded,
            canReceivePayments: data.canReceivePayments,
            email: data.email
        };
    } catch {
        return { isOnboarded: false, canReceivePayments: false };
    }
}

// Format amount for display
export function formatCurrency(cents: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(cents / 100);
}

// Calculate platform fee (10%)
export function calculatePlatformFee(amountCents: number): {
    platformFee: number;
    solverReceives: number;
} {
    const platformFee = Math.floor(amountCents * 0.10);
    const solverReceives = amountCents - platformFee;
    return { platformFee, solverReceives };
}
