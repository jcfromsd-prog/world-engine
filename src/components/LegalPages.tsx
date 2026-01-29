import React from 'react';
import { motion } from 'framer-motion';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-20 px-4">
        <div className="max-w-3xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-white mb-8 border-b border-slate-800 pb-4"
            >
                {title}
            </motion.h1>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 text-sm leading-relaxed"
            >
                {children}
            </motion.div>
        </div>
    </div>
);

export const TermsOfService: React.FC = () => (
    <LegalLayout title="Terms of Service">
        <p><strong>Last Updated: January 2026</strong></p>

        <h3 className="text-xl font-bold text-white mt-8">1. Acceptance of Terms</h3>
        <p>By accessing the World Engine Platform ("Platform"), you agree to be bound by these Terms. If you disobey the Guardian Protocol, you may be subject to immediate reputation reset.</p>

        <h3 className="text-xl font-bold text-white mt-8">2. Work for Hire & IP</h3>
        <p>Unless explicitly stated otherwise in a specific Bounty Agreement (see "One-Click NDA"), all code submitted and accepted for payment is considered "Work for Hire." Intellectual Property transfers to the Client immediately upon successful payment processing via Stripe.</p>

        <h3 className="text-xl font-bold text-white mt-8">3. Payments & Escrow</h3>
        <p>The Platform utilizes Stripe Connect for payouts. Funds are held in escrow until the "Definition of Done" is met. The Platform charges a 10% Protocol Fee on all successful bounties.</p>

        <h3 className="text-xl font-bold text-white mt-8">4. User Conduct</h3>
        <p>Solvers must adhere to the "Clean Code" standard. Malicious submissions, data exfiltration attempts, or harassment of Clients will result in a permanent ban.</p>

        <h3 className="text-xl font-bold text-white mt-8">5. Disclaimer</h3>
        <p>The Platform provides "as is" services. We serve as the interface between Capital and Talent but do not guarantee the success of any specific venture.</p>
    </LegalLayout>
);

export const PrivacyPolicy: React.FC = () => (
    <LegalLayout title="Privacy Policy">
        <p><strong>Effective Date: January 2026</strong></p>

        <h3 className="text-xl font-bold text-white mt-8">1. Data Collection</h3>
        <p>We collect only what is needed to verify skill and process payments: Email, GitHub Profile ID, and Stripe Connect account details. We do <strong>not</strong> sell user data.</p>

        <h3 className="text-xl font-bold text-white mt-8">2. Zero-Trust Architecture</h3>
        <p>Client data uploaded to the Platform is processed in ephemeral sandbox environments. We employ automated PII sanitization before data touches our Global Feed.</p>

        <h3 className="text-xl font-bold text-white mt-8">3. Public Profile</h3>
        <p>Your "Solver" profile (Reputation, Earnings, Badge Collection) is public by default to prove competence. You may toggle this to "Stealth Mode" in Settings.</p>

        <h3 className="text-xl font-bold text-white mt-8">4. Third Parties</h3>
        <p>We use Stripe for payment processing and Supabase for real-time state. Check their respective privacy policies for details on how they handle financial and database transactions.</p>
    </LegalLayout>
);
