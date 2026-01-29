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

        <h3 className="text-xl font-bold text-white mt-8">6. Founding Solver Credits</h3>
        <p>
            To bootstrap the "Neural Workforce," early adopters are granted a <strong>$5.00 Founding Credit</strong>.
            This credit:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
            <li>Is redeemable immediately for platform services (micro-tasks, bounty posting).</li>
            <li>Cannot be withdrawn as cash (must be used within the ecosystem).</li>
            <li>Experies if not active within 12 months.</li>
            <li>Is a token of gratitude for helping us test the "World Engine" beta.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8">7. Governance Rights</h3>
        <p>The Platform Founder retains the right to adjust economic parameters (including fee structures and reward splits) at any time to ensure the long-term sustainability and security of the Engine. Major changes will be communicated via the Governance Console.</p>
    </LegalLayout>
);

export const FoundingCharter: React.FC = () => (
    <LegalLayout title="Founding Charter & IP Policy">
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 mb-8">
            <p className="italic text-slate-400">
                "MyBestPurpose exists to decouple 'Work' from 'Employment' and reconnect it to Purpose. We provide the infrastructure for a global workforce to solve meaningful problems in real-time."
            </p>
        </div>

        <h3 className="text-xl font-bold text-white mt-8">I. Mission Statement</h3>
        <p>We believe that talent is equally distributed, but opportunity is not. This Platform is a "World Engine" designed to route capital directly to problem-solvers without friction, bureaucracy, or bias.</p>

        <h3 className="text-xl font-bold text-white mt-8">II. Definition of Assets</h3>
        <p>The "World Engine" recognizes multiple forms of contribution. A "Solve" is defined as any verified digital asset—including but not limited to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
            <li><strong>Source Code</strong> (Functions, Scripts, Apps)</li>
            <li><strong>Technical Content</strong> (Documentation, Tutorials, grant writing)</li>
            <li><strong>Strategic Research</strong> (Market analysis, Lead generation)</li>
            <li><strong>Visual Design</strong> (UI/UX, Branding, Assets)</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8">III. Intellectual Property (IP) Governance</h3>
        <ul className="space-y-4 mt-4">
            <li>
                <strong className="text-white block">1. Solver Ownership</strong>
                You retain 100% ownership of your work while it is in the "Draft" or "Submitted" phase.
            </li>
            <li>
                <strong className="text-white block">2. The Handover</strong>
                Ownership of the IP is transferred to the Requester (or the Public Domain, depending on the Bounty type) <strong>only upon the successful release of the agreed-upon payment</strong>.
            </li>
            <li>
                <strong className="text-white block">3. Platform License</strong>
                By using the site, Solvers grant MyBestPurpose a non-exclusive license to display their work for "Proof of Work" and portfolio purposes to help them build their professional reputation.
            </li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-8">IV. Anti-Exploitation Clause</h3>
        <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-lg mt-2">
            <p className="text-emerald-400 font-medium">Founders Commitment</p>
            <p className="mt-2 text-slate-400">
                MyBestPurpose is a founder-led mission. We commit to a "Solvers First" policy. Unclaimed bounty funds shall never be absorbed as platform profit; they will be recycled into "Founding Solver" credits to encourage new talent and community growth.
            </p>
        </div>
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
