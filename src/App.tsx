import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './components/Home';
import SolverWorkspace from './components/SolverWorkspace';
import AuditorDashboard from './components/AuditorDashboard';
import WalletModal from './components/WalletModal';
import GuardianFAB from './components/GuardianFAB';
import SageDiscoveryModal from './components/SageDiscoveryModal';
import Header from './components/Header';
import EnterpriseHero from './components/EnterpriseHero';
import FounderDashboard from './components/FounderDashboard';
import NeuralInterface from './components/NeuralInterface';
import CapitalDeploymentModal from './components/CapitalDeploymentModal';
import PostBountyModal from './components/PostBountyModal';
import CommandCenter from './components/CommandCenter';
import IPProtectionPolicy from './components/IPProtectionPolicy';
import Manifesto from './components/Manifesto';
import { TermsOfService, PrivacyPolicy, FoundingCharter } from './components/LegalPages';
import Economics from './components/Economics';
import TrustCenter from './components/TrustCenter';
import Profile from './components/Profile';
import EarningsDashboard from './components/EarningsDashboard';
import PublicPortfolio from './components/PublicPortfolio';
import SovereignGate from './components/SovereignGate';
import Footer from './components/Footer';


import { useWallet } from './hooks/useWallet';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';

interface LedgerStats {
  problemsSolved: number;
  earnings: string;
  impactVelocity: string;
  newTimelineItem?: {
    title: string;
    reward: string;
  };
}

function App() {
  const location = useLocation();
  const { isAuthenticated, isAdmin: isAuthAdmin, logout, supabaseUser } = useAuth();
  const { balance: walletBalance } = useWallet(supabaseUser);
  const [showWallet, setShowWallet] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewMode, setViewMode] = useState<'solver' | 'client'>('solver');
  const [guardianInitialized, setGuardianInitialized] = useState(true);
  const [showFounderDashboard, setShowFounderDashboard] = useState(false);
  const [ledgerStats] = useState<LedgerStats>({
    problemsSolved: 42,
    earnings: "$14,500",
    impactVelocity: "9.8x"
  });

  // Neural Link State
  const [isNeuralInterfaceOpen, setIsNeuralInterfaceOpen] = useState(false);

  // Enterprise Financial State
  const [showCapitalModal, setShowCapitalModal] = useState(false);

  // Command Center State
  const [showCommandCenter, setShowCommandCenter] = useState(false);

  // Post Bounty Logic
  const [showPostBountyModal, setShowPostBountyModal] = useState(false);

  const handlePostBounty = (_cost: number) => {
    // Balance deduction is handled by the Modal/Hook now
  };

  const isEnterprise = location.pathname === '/enterprise';

  // Sovereign Gate State
  const [showSovereignGate, setShowSovereignGate] = useState(false);

  // Secret keyboard shortcut: Ctrl+Shift+G for God Mode (Check Auth First)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        const hasToken = localStorage.getItem('SOVEREIGN_ACCESS_TOKEN');
        if (hasToken) {
          setShowFounderDashboard(prev => !prev);
        } else {
          setShowSovereignGate(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container relative">
      {/* Auth Layer */}
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} />
      )}

      {/* Sovereign Gate - Security Check */}
      <SovereignGate
        isOpen={showSovereignGate}
        onClose={() => setShowSovereignGate(false)}
        onSuccess={() => {
          setShowSovereignGate(false);
          setShowFounderDashboard(true);
        }}
      />

      {showWallet && (
        <WalletModal
          balance={ledgerStats.earnings}
          onClose={() => setShowWallet(false)}
        />
      )}

      {/* Founder Dashboard (God Mode) - Ctrl+Shift+G to toggle */}
      {showFounderDashboard && (
        <FounderDashboard onClose={() => setShowFounderDashboard(false)} />
      )}

      {showDiscovery && (
        <SageDiscoveryModal
          onClose={() => setShowDiscovery(false)}
          onComplete={() => setShowDiscovery(false)}
          onConnectWallet={() => {
            setShowDiscovery(false);
            setShowLogin(true);
          }}
        />
      )}

      {!isEnterprise && (
        <Header
          onConnectWallet={() => setShowLogin(true)}
          walletBalance={isAuthenticated ? `$${walletBalance.toLocaleString()}` : undefined}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onToggleNeural={() => {
            // Neural Link toggles Founder Dashboard directly if authenticated,
            // or opens login if not
            const hasToken = localStorage.getItem('SOVEREIGN_ACCESS_TOKEN');

            if (isAuthAdmin || hasToken) {
              if (hasToken) {
                setShowFounderDashboard(true);
              } else {
                logout();
              }
            } else {
              setShowLogin(true);
            }
          }}
          clientCredits={walletBalance}
          onOpenCapitalModal={() => setShowCapitalModal(true)}
          onOpenPostBounty={() => setShowPostBountyModal(true)}
          onOpenCommandCenter={() => setShowCommandCenter(true)}
          isAdmin={isAuthAdmin}
        />
      )}

      {showPostBountyModal && (
        <PostBountyModal
          onClose={() => setShowPostBountyModal(false)}
          currentBalance={walletBalance}
          onPost={handlePostBounty}
          onOpenCapital={() => {
            setShowPostBountyModal(false);
            setShowCapitalModal(true);
          }}
        />
      )}

      {showCapitalModal && (
        <CapitalDeploymentModal
          onClose={() => setShowCapitalModal(false)}
          onPurchase={() => { }} // Deprecated but prop might be required
        />
      )}

      <NeuralInterface
        isOpen={isNeuralInterfaceOpen}
        onClose={() => setIsNeuralInterfaceOpen(false)}
      />

      <CommandCenter
        isOpen={showCommandCenter}
        onClose={() => setShowCommandCenter(false)}
        onOpenFounderDashboard={() => {
          setShowCommandCenter(false);
          // Check Auth
          const hasToken = localStorage.getItem('SOVEREIGN_ACCESS_TOKEN');
          if (hasToken) {
            setShowFounderDashboard(true);
          } else {
            setShowSovereignGate(true);
          }
        }}
      />

      <main>
        <Routes>
          <Route path="/" element={
            <Home
              guardianInitialized={guardianInitialized}
              setGuardianInitialized={setGuardianInitialized}
              viewMode={viewMode}
              onOpenPostBounty={() => setShowPostBountyModal(true)}
              onOpenCapitalModal={() => setShowCapitalModal(true)}
              onOpenLogin={() => setShowLogin(true)}
            />
          } />
          <Route path="/workspace/:id" element={<SolverWorkspace />} />
          <Route path="/auditor" element={<AuditorDashboard />} />
          <Route path="/workspace" element={<SolverWorkspace />} />
          <Route path="/enterprise" element={<EnterpriseHero />} />
          <Route path="/ip-policy" element={<IPProtectionPolicy />} />
          <Route path="/about" element={<Manifesto />} />
          <Route path="/trust" element={<TrustCenter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/:username" element={<PublicPortfolio />} />
          <Route path="/earnings" element={<EarningsDashboard />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/charter" element={<FoundingCharter />} />
          <Route path="/economics" element={<Economics />} />
        </Routes>
      </main>

      {/* Hide Sage on Enterprise or Client View - professional clients don't need the avatar */}
      {!isEnterprise && viewMode === 'solver' && (
        <GuardianFAB
          onInitialize={() => setGuardianInitialized(true)}
          isInitialized={guardianInitialized}
        />
      )}

      <Footer />

    </div>
  );
}

export default App;
