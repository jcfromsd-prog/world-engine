import { motion, AnimatePresence } from 'framer-motion';
import Hero from './Hero';
import ExplainerVideo from './ExplainerVideo';
import TrustTestimonials from './TrustTestimonials';
import TabbedDashboard from './TabbedDashboard';
import EngineGovernance from './EngineGovernance';
import SolverSpotlight from './SolverSpotlight';

interface HomeProps {
    guardianInitialized: boolean;
    setGuardianInitialized: (val: boolean) => void;

    viewMode: 'solver' | 'client';
    onOpenPostBounty?: () => void;
    onOpenCapitalModal?: () => void;
    onOpenLogin?: () => void;
}

const Home: React.FC<HomeProps> = ({
    guardianInitialized,
    setGuardianInitialized,
    viewMode,
    onOpenPostBounty,
    onOpenCapitalModal,
    onOpenLogin
}) => {

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={viewMode}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <Hero
                    viewMode={viewMode}
                    onOpenPostBounty={onOpenPostBounty}
                    onOpenCapitalModal={onOpenCapitalModal}
                />

                {/* Growth & Trust Modules */}
                <ExplainerVideo />
                <TrustTestimonials />

                <SolverSpotlight />

                {/* SOLVER VIEW: Dashboard & Governance */}
                {viewMode === 'solver' && (
                    <>
                        <div id="feed" className="min-h-screen bg-slate-950">
                            <TabbedDashboard onOpenLogin={onOpenLogin} />
                        </div>
                        <div id="mentor" className="section-container" style={{ marginTop: '80px', marginBottom: '40px' }}>
                            <EngineGovernance
                                onInitialize={() => setGuardianInitialized(true)}
                                isGuardianActive={guardianInitialized}
                            />
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default Home;
