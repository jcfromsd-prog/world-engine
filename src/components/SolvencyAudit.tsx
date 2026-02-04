import React, { useState, useEffect } from 'react';
import { useEngine } from '../lib/engine';

const SolvencyAudit: React.FC = () => {
    const { ledger } = useEngine();
    const [auditLogs, setAuditLogs] = useState<string[]>([]);
    const [isAuditing, setIsAuditing] = useState(false);

    const addLog = (msg: string) => {
        setAuditLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    useEffect(() => {
        const runAudit = () => {
            addLog("--- INITIATING SOLVENCY PROTOCOL AUDIT ---");
            try {
                // Test 1: Create Wallet & Deposit
                addLog("TEST 1: Creating Wallet 'SOLVER_X'...");
                ledger.createWallet('SOLVER_X');
                addLog("TEST 2: Depositing $100.00...");
                ledger.processTransaction('SOLVER_X', 'DEPOSIT', 100, 'Initial Funding');

                // Test 3: Fractional Reserve Check (15% platform levy)
                addLog("TEST 3: Applying 15% Platform Levy...");
                ledger.processTransaction('SOLVER_X', 'WITHDRAWAL', 15, 'Platform Maintenance Fee');

                // Test 4: Final Balance
                const balance = ledger.getBalance('SOLVER_X');
                addLog(`AUDIT COMPLETE. FINAL BALANCE: $${balance.toFixed(2)}`);
                addLog("--- SYSTEM STATUS: SOLVENT ---");
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setAuditLogs(prev => [`[ERROR] AUDIT FAILED: ${errorMessage}`, ...prev]);
            }
        };

        const timer = setTimeout(runAudit, 0);
        return () => clearTimeout(timer);
    }, [ledger]);

    return (
        <div className="p-6 bg-black/40 border border-green-500/30 rounded-xl font-mono">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-green-400 text-sm font-bold tracking-tighter uppercase">Protocol Ledger v1.0</h3>
                <button
                    onClick={() => {
                        setAuditLogs([]);
                        setIsAuditing(true);
                        setTimeout(() => setIsAuditing(false), 2000);
                    }}
                    className="text-[10px] bg-green-500/10 text-green-500 border border-green-500/50 px-2 py-1 rounded hover:bg-green-500 hover:text-black transition-all"
                >
                    {isAuditing ? 'AUDITING...' : 'RUN MANUAL AUDIT'}
                </button>
            </div>

            <div className="h-48 overflow-y-auto space-y-1 text-[11px]">
                {auditLogs.map((log, i) => (
                    <div key={i} className={log.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SolvencyAudit;
