import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CalibrationFlow from './CalibrationFlow';
import Ticker from './Ticker';

interface HeroProps {
  viewMode?: 'solver' | 'client';
  onOpenPostBounty?: () => void;
  onOpenCapitalModal?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  viewMode = 'solver',
  onOpenPostBounty,
  onOpenCapitalModal
}) => {
  const [showCalibration, setShowCalibration] = useState(false);
  const navigate = useNavigate();

  const handleCalibrationComplete = (_archetypeId: string) => {
    // Navigate to workspace after completing calibration
    navigate('/workspace');
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white">

      {/* 1. BACKGROUND LAYER - Dynamic based on mode */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <h1 className="text-[6rem] md:text-[9rem] font-black text-gray-900 opacity-5 leading-none tracking-tighter mr-12 md:mr-32">
          {viewMode === 'client' ? 'SCALE' : 'IMPACT'}
        </h1>
        <h1 className="text-[6rem] md:text-[9rem] font-black text-gray-900 opacity-5 leading-none tracking-tighter ml-12 md:ml-32">
          {viewMode === 'client' ? 'INNOVATE' : 'PURPOSE'}
        </h1>
      </div>

      {/* 2. FOREGROUND LAYER */}
      <div className="relative z-10 text-center px-4 w-full max-w-screen-2xl mx-auto flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-xl md:text-3xl font-bold text-slate-400 mb-6 tracking-wide">
            {viewMode === 'client'
              ? <span>Optimize Your <span className="text-purple-400">Engineering Output</span></span>
              : <span>MyBestPurpose <span className="text-cyan-400">World Engine</span></span>
            }
          </h2>

          {/* Main Headline */}
          <div className="w-full flex justify-center py-2">
            <h1 className="text-[5vw] md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,1)] whitespace-nowrap leading-tight">
              {viewMode === 'client' ? 'DEPLOY CAPITAL, NOT CONTRACTS.' : 'LEARN, CONNECT, SOLVE and EARN!'}
            </h1>
          </div>

          <p className="text-lg md:text-2xl text-slate-400 mb-10 font-light tracking-wider">
            {viewMode === 'client'
              ? "Access 14,000+ Vetted Engineers via Micro-Bounties."
              : "Don't Work Alone. Create Paid Solutions."
            }
          </p>

          {/* CTA Area */}
          <div className="flex flex-col items-center gap-6 mb-16">
            {viewMode === 'client' ? (
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={onOpenPostBounty}
                  className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg md:text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                >
                  Post a Bounty
                </button>
                <button
                  onClick={onOpenCapitalModal}
                  className="px-8 py-5 bg-slate-900 border border-purple-500/50 text-purple-400 rounded-full font-bold text-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all"
                >
                  Start Engine Pass ($499)
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCalibration(true)}
                className="px-12 py-5 bg-white text-gray-900 rounded-full font-bold text-lg md:text-xl hover:bg-cyan-400 hover:text-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                Solve Your First Problem (5 Mins)
              </button>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">🛡️ SECURE SANDBOX ENV</span>
              <span className="hidden md:inline text-slate-700">|</span>
              <span className="flex items-center gap-1 cursor-help">
                🔒 IP PROTECTION POLICY*
              </span>
            </div>
          </div>

          {/* Partner Ticker (Powering Innovation) */}
          <div className="w-full">
            <p className="text-center text-xs text-cyan-400 uppercase tracking-[0.4em] mb-4 font-black drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              Powered by Industry Leaders
            </p>
            <Ticker />
          </div>

        </motion.div>
      </div>

      {/* Footer Ticker (Absolute Bottom) - Seamless Infinite Scroll */}
      <div className="absolute bottom-0 w-full bg-black border-t border-gray-900 py-3 z-30 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {/* First set */}
          <div className="flex items-center gap-12 px-6 opacity-90">
            <span className="text-cyan-300 font-mono text-xs tracking-widest flex items-center gap-2">
              ❤️ 102 LIVES IMPACTED
            </span>
            <span className="text-purple-400 font-mono text-xs tracking-widest flex items-center gap-2">
              💼 $45M BOUNTIES PAID
            </span>
            <span className="text-green-400 font-mono text-xs tracking-widest flex items-center gap-2">
              🌳 400 TREES PLANTED
            </span>
            <span className="text-cyan-300 font-mono text-xs tracking-widest flex items-center gap-2">
              🧠 14,500 SOLVERS ACTIVE
            </span>
            <span className="text-purple-400 font-mono text-xs tracking-widest flex items-center gap-2">
              ⚡ 9.8x VELOCITY
            </span>
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 px-6 opacity-90">
            <span className="text-cyan-300 font-mono text-xs tracking-widest flex items-center gap-2">
              ❤️ 102 LIVES IMPACTED
            </span>
            <span className="text-purple-400 font-mono text-xs tracking-widest flex items-center gap-2">
              💼 $45M BOUNTIES PAID
            </span>
            <span className="text-green-400 font-mono text-xs tracking-widest flex items-center gap-2">
              🌳 400 TREES PLANTED
            </span>
            <span className="text-cyan-300 font-mono text-xs tracking-widest flex items-center gap-2">
              🧠 14,500 SOLVERS ACTIVE
            </span>
            <span className="text-purple-400 font-mono text-xs tracking-widest flex items-center gap-2">
              ⚡ 9.8x VELOCITY
            </span>
          </div>
        </motion.div>
      </div>

      {/* Calibration Flow Modal */}
      {showCalibration && (
        <CalibrationFlow
          onClose={() => setShowCalibration(false)}
          onComplete={handleCalibrationComplete}
        />
      )}
    </div>
  );
};

export default Hero;
